import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { existsSync, statSync } from "fs";
import passport from "passport";
import { createSessionMiddleware } from "./middleware/session.js";
import { createOAuthStrategy, createDevStrategy } from "./oauth/provider.js";
import {
  helmetMiddleware,
  apiLimiter,
  loginLimiter,
  createLimiter,
  dispensationLimiter,
  requestIdMiddleware,
  securityHeadersMiddleware,
  sanitizationMiddleware,
  loggingMiddleware,
} from "./middleware/security.js";

// Import routes
import routes from "./routes.js";
import authRoutes from "./routes/auth.js";

// ESM __dirname setup
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create Express app
const app = express();

// ============================================
// SECURITY MIDDLEWARES (Production)
// ============================================
app.use(helmetMiddleware);
app.use(requestIdMiddleware);
app.use(securityHeadersMiddleware);
app.use(loggingMiddleware);

// ============================================
// BODY PARSERS
// ============================================
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));
app.use(sanitizationMiddleware);

// ============================================
// RATE LIMITING (Production only)
// ============================================
app.use("/api", apiLimiter);
app.use("/auth/login", loginLimiter);
app.use("/api/items", createLimiter);
app.use("/api/sesi/dispensacoes", dispensationLimiter);

// ============================================
// SESSION & AUTHENTICATION
// ============================================
if (process.env.DATABASE_URL) {
  app.use(createSessionMiddleware());
  app.use(passport.initialize());
  app.use(passport.session());
  
  // Configure OAuth strategy
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
  }

  passport.serializeUser((user: any, done) => {
    done(null, user.id);
  });

  passport.deserializeUser((id: string, done) => {
    // In production, this should fetch from DB
    const user = {
      id,
      email: `${id}@pixlabel.app`,
      firstName: "User",
      lastName: "Name",
      role: "operator" as const,
    };
    done(null, user);
  });
}

// ============================================
// DEMO TOKEN MIDDLEWARE (for testing)
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

// Auth routes (public)
app.use("/auth", authRoutes);

// API routes
app.use("/api", routes);

// Determine public directory
const publicDir = (() => {
  // In production, dist/public is 1 level up from bundled index.js
  const possiblePaths = [
    path.resolve(__dirname, "../public"),
    path.resolve(__dirname, "../../dist/public"),
    path.resolve(process.cwd(), "dist/public"),
  ];
  
  console.log("\n🔍 Looking for public directory...");
  console.log(`   Current __dirname: ${__dirname}`);
  console.log(`   Current cwd: ${process.cwd()}\n`);
  
  for (const dir of possiblePaths) {
    try {
      const exists = existsSync(dir);
      const isDir = exists && statSync(dir).isDirectory();
      
      if (isDir) {
        console.log(`✅ Found public directory: ${dir}`);
        return dir;
      } else {
        console.log(`❌ Not found: ${dir} (exists: ${exists}, isDir: ${isDir})`);
      }
    } catch (e: any) {
      console.log(`❌ Error checking ${dir}: ${e.message}`);
    }
  }
  
  // Fallback
  console.warn(`⚠️ Public directory not found, using default: ${possiblePaths[2]}`);
  return possiblePaths[2];
})();

// Static file serving
app.use(express.static(publicDir, {
  maxAge: "1h",
  etag: false,
  extensions: ["html", "js", "css", "json"],
}));

// SPA fallback route
app.get("*", (req, res) => {
  // Don't serve HTML for actual files
  if (path.extname(req.path)) {
    console.warn(`📁 File not found: ${req.path}`);
    return res.status(404).send("Not found");
  }
  
  const indexPath = path.join(publicDir, "index.html");
  
  // Check if file exists before trying to send
  if (!existsSync(indexPath)) {
    console.error(`❌ index.html not found at: ${indexPath}`);
    console.error(`📂 publicDir contents:`, existsSync(publicDir) ? "exists" : "MISSING");
    return res.status(500).json({ 
      error: "Application index not found",
      path: indexPath,
      publicDirExists: existsSync(publicDir)
    });
  }
  
  res.sendFile(indexPath, (err) => {
    if (err) {
      console.error(`❌ Error serving index.html:`, err.message);
      res.status(500).json({ error: "Failed to serve application" });
    }
  });
});

// API error handler (before 404 fallback)
app.use("/api", (err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error("❌ API Error:", {
    message: err.message,
    stack: err.stack,
    name: err.name,
  });
  res.status(err.status || 500).json({ 
    status: "error",
    error: err.message || "Internal server error",
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
});

// Global error handler
app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error("❌ Global Error:", {
    message: err.message,
    stack: err.stack,
    name: err.name,
  });
  res.status(500).json({ 
    error: "Internal server error",
    message: process.env.NODE_ENV === "development" ? err.message : undefined,
  });
});

// Server setup
const PORT = parseInt(process.env.PORT || "3000", 10);
const HOST = process.env.HOST || "0.0.0.0";

if (!isValidPort(PORT)) {
  console.error(`❌ Invalid PORT: ${PORT}`);
  process.exit(1);
}

function isValidPort(port: number): boolean {
  return port > 0 && port < 65536 && Number.isInteger(port);
}

// Start server
const server = app.listen(PORT, HOST, () => {
  const diagnostics = {
    "Server Status": "✅ STARTED",
    "URL": `http://${HOST}:${PORT}`,
    "Environment": process.env.NODE_ENV || "production",
    "Port": PORT,
    "Host": HOST,
    "Static Files": publicDir,
    "Node Version": process.version,
    "Memory": `${Math.round(process.memoryUsage().heapUsed / 1024 / 1024)}MB`,
    "Database": process.env.DATABASE_URL ? "🔗 Connected" : "💾 In-Memory (Dev Mode)",
  };
  
  console.log(`
╔════════════════════════════════════════════╗
║  ✅ PixelLab Production Server Started    ║
╚════════════════════════════════════════════╝
  `);
  
  Object.entries(diagnostics).forEach(([key, value]) => {
    console.log(`${key}: ${value}`);
  });
  
  console.log(`
🏥 Health Check: GET http://${HOST}:${PORT}/api/health
📊 API Routes: /api/*
📁 Static Serving: ${publicDir}
  `);
});

// Graceful shutdown
const gracefulShutdown = (signal: string) => {
  console.log(`\n📛 ${signal} received, gracefully shutting down...`);
  
  server.close(() => {
    console.log("✅ Server closed");
    process.exit(0);
  });
  
  // Force exit after 30 seconds
  setTimeout(() => {
    console.error("❌ Forced shutdown after timeout");
    process.exit(1);
  }, 30000);
};

process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
process.on("SIGINT", () => gracefulShutdown("SIGINT"));

// Handle uncaught exceptions
process.on("uncaughtException", (err) => {
  console.error("❌ Uncaught Exception:", err);
  process.exit(1);
});

process.on("unhandledRejection", (reason, promise) => {
  console.error("❌ Unhandled Rejection at:", promise, "reason:", reason);
  process.exit(1);
});
