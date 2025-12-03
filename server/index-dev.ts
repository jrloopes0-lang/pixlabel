import express from "express";
import passport from "passport";
import { createServer as createViteServer } from "vite";
import routes from "./routes";
import authRoutes from "./routes/auth";
import { createSessionMiddleware } from "./middleware/session";
import { createOAuthStrategy, createDevStrategy } from "./oauth/provider";
import {
  helmetMiddleware,
  apiLimiter,
  loginLimiter,
  oauthLimiter,
  createLimiter,
  dispensationLimiter,
  requestIdMiddleware,
  securityHeadersMiddleware,
  sanitizationMiddleware,
  loggingMiddleware,
} from "./middleware/security";

async function startDevServer() {
  const app = express();

  // ============================================
  // SECURITY MIDDLEWARES
  // ============================================
  app.use(helmetMiddleware); // Security headers
  app.use(requestIdMiddleware); // Add X-Request-ID
  app.use(securityHeadersMiddleware); // Custom security headers
  app.use(loggingMiddleware); // Request logging

  // ============================================
  // BODY PARSERS
  // ============================================
  app.use(express.json({ limit: "10mb" })); // Body parser for JSON
  app.use(express.urlencoded({ extended: true, limit: "10mb" })); // URL-encoded body parser
  app.use(sanitizationMiddleware); // Sanitize inputs

  // ============================================
  // RATE LIMITING (Disabled in development)
  // ============================================
  if (process.env.NODE_ENV === "production") {
    app.use("/api", apiLimiter); // General API rate limit (100/15min)
    app.use("/auth/login", loginLimiter); // Strict login limit (5/15min)
    app.use("/auth/callback", oauthLimiter); // OAuth callback limit (10/5min)
    app.use("/api/items", createLimiter); // Create limit (10/hour)
    app.use("/api/sesi/dispensacoes", dispensationLimiter); // Dispensation limit (50/hour per user)
  }
  
  // ============================================
  // SESSION & AUTHENTICATION
  // ============================================

  // Session middleware MUST come before Passport
  if (process.env.NODE_ENV === "production" || process.env.FORCE_SESSION === "true") {
    app.use(createSessionMiddleware());
    app.use(passport.initialize());
    app.use(passport.session());
  } else {
    // DEV: ignora session para contornar erro
    app.use(passport.initialize());
    // NÃO usa passport.session() em dev
  }

  // Configure strategy: use generic OAuth provider env vars when available, otherwise dev strategy
  if (
    process.env.OAUTH_CLIENT_ID &&
    process.env.OAUTH_CLIENT_SECRET &&
    process.env.OAUTH_CALLBACK_URL &&
    process.env.OAUTH_AUTH_URL &&
    process.env.OAUTH_TOKEN_URL
  ) {
    const providerName = process.env.OAUTH_PROVIDER_NAME || "oauth";
    const strategy = createOAuthStrategy(
      process.env.OAUTH_AUTH_URL,
      process.env.OAUTH_TOKEN_URL,
      process.env.OAUTH_USERINFO_URL || "",
      process.env.OAUTH_CLIENT_ID,
      process.env.OAUTH_CLIENT_SECRET,
      process.env.OAUTH_CALLBACK_URL,
      providerName
    );
    passport.use(providerName, strategy as any);
  } else {
    // Dev fallback strategy
    passport.use("dev-oauth", createDevStrategy() as any);
  }

  passport.serializeUser((user: any, done) => {
    done(null, user.id);
  });

  passport.deserializeUser((id: string, done) => {
    // For dev, return a minimal user shape expected by the types.
    // In production, replace with DB lookup by id.
    const user = {
      id,
      email: `${id}@pixlabel.test`,
      firstName: "Dev",
      lastName: "User",
      role: "operator" as const,
    };
    done(null, user);
  });

  // ============================================
  // DEMO TOKEN MIDDLEWARE
  // ============================================
  app.use((req, _res, next) => {
    const demoToken = req.headers["x-demo-token"];
    if (demoToken === "demo-pixlabel-test") {
      (req as any).user = {
        id: "demo-user-123",
        email: "demo@pixlabel.test",
        firstName: "Demo",
        lastName: "User",
        role: "admin" as const,
      };
    }
    next();
  });

  // Auth routes (public) - BEFORE Vite
  app.use("/auth", authRoutes);

  // API routes - BEFORE Vite
  app.use("/api", routes);

  const vite = await createViteServer({
    server: {
      middlewareMode: true,
      hmr: {
        port: 5173,
        protocol: "ws",
      },
    },
  });

  // Vite middleware (serve React + HMR) - AFTER API routes
  app.use(vite.middlewares);

  // 404 handler
  app.use((_req, res) => {
    res.status(404).json({ error: "Not found" });
  });

  // Error handler
  app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
    console.error("❌ Error:", err);
    res.status(err.status || 500).json({
      error: err.message || "Internal server error",
      status: "error",
    });
  });

  const PORT = 3000;

  app.listen(PORT, () => {
    console.log("=====================================");
    console.log(`🚀 Dev Server → http://localhost:${PORT}`);
    console.log(`🔥 Vite HMR → ws://localhost:5173`);
    console.log(`🩺 Health → http://localhost:${PORT}/api/health`);
    console.log("=====================================");
  });
}

startDevServer();
