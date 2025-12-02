import express, { Request, Response, NextFunction } from "express";
import rateLimit from "express-rate-limit";
import helmet from "helmet";

/**
 * CORS Middleware
 */
export const corsMiddleware = express.json({ limit: "10mb" });

/**
 * Helmet - Security headers
 */
export const helmetMiddleware = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'"],
    },
  },
  frameguard: { action: "deny" },
  xssFilter: true,
  noSniff: true,
  referrerPolicy: { policy: "strict-origin-when-cross-origin" },
});

/**
 * Rate Limiting Middleware
 * 
 * Endpoints críticos (auth, API) com limites menores
 */

// General API rate limiter: 100 requests per 15 minutes
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: "Too many requests from this IP, please try again later.",
  standardHeaders: true,
  legacyHeaders: false,
});

// Strict limiter para login: 5 requests per 15 minutes
export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  skipSuccessfulRequests: false,
  message: "Too many login attempts, please try again later.",
  standardHeaders: true,
  legacyHeaders: false,
});

// Strict limiter para OAuth callback: 10 requests per 5 minutes
export const oauthLimiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 10,
  message: "Too many OAuth attempts, please try again later.",
  standardHeaders: true,
  legacyHeaders: false,
});

// Muito restritivo para criar items (prevent spam): 10 per hour
export const createLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 10,
  message: "Too many items created, please try again later.",
  standardHeaders: true,
  legacyHeaders: false,
});

// Dispensação médica (crítica): 50 per hour per user
export const dispensationLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 50,
  keyGenerator: (req: Request) => {
    // Usa o id do usuário se existir, senão usa IP
    return (req as any).user?.id || req.ip || "unknown";
  },
  message: "Too many dispensations, please try again later.",
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * CSRF Protection Middleware
 * TODO: Implementar após setup de sesões completo
 */
export const csrfMiddleware = (req: Request, res: Response, next: NextFunction) => {
  // Placeholder para CSRF token validation
  // Será implementado com csurf package
  next();
};

/**
 * Request ID Middleware
 * Adiciona X-Request-ID para tracing
 */
export const requestIdMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const requestId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  (req as any).id = requestId;
  res.setHeader("X-Request-ID", requestId);
  next();
};

/**
 * Security Headers Middleware
 */
export const securityHeadersMiddleware = (req: Request, res: Response, next: NextFunction) => {
  // Prevent MIME sniffing
  res.setHeader("X-Content-Type-Options", "nosniff");
  
  // XSS Protection
  res.setHeader("X-XSS-Protection", "1; mode=block");
  
  // Disable autocomplete for sensitive fields
  res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, max-age=0");
  
  // Referrer Policy
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  
  // Feature Policy (Permissions Policy)
  res.setHeader(
    "Permissions-Policy",
    "geolocation=(), microphone=(), camera=(), payment=()"
  );
  
  next();
};

/**
 * Input Sanitization Middleware
 * Prevenir XSS e injection attacks
 */
export const sanitizationMiddleware = (req: Request, res: Response, next: NextFunction) => {
  // Remover caracteres perigosos de strings
  const sanitize = (value: any): any => {
    if (typeof value === "string") {
      return value
        .replace(/[<>]/g, "") // Remove < e >
        .replace(/javascript:/gi, "") // Remove javascript:
        .trim();
    }
    if (typeof value === "object" && value !== null) {
      return Object.keys(value).reduce((acc: any, key: string) => {
        acc[key] = sanitize(value[key]);
        return acc;
      }, Array.isArray(value) ? [] : {});
    }
    return value;
  };

  if (req.body) {
    req.body = sanitize(req.body);
  }

  next();
};

/**
 * Logging Middleware
 */
export const loggingMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();
  const requestId = (req as any).id;

  res.on("finish", () => {
    const duration = Date.now() - start;
    const log = {
      requestId,
      method: req.method,
      path: req.path,
      status: res.statusCode,
      duration: `${duration}ms`,
      ip: req.ip,
      userId: (req as any).user?.id,
      timestamp: new Date().toISOString(),
    };

    // Log to console (production: use structured logging)
    if (res.statusCode >= 400) {
      console.error("[ERROR]", log);
    } else {
      console.log("[INFO]", log);
    }
  });

  next();
};

/**
 * Export all security middlewares
 */
export const securityMiddlewares = {
  corsMiddleware,
  helmetMiddleware,
  apiLimiter,
  loginLimiter,
  oauthLimiter,
  createLimiter,
  dispensationLimiter,
  csrfMiddleware,
  requestIdMiddleware,
  securityHeadersMiddleware,
  sanitizationMiddleware,
  loggingMiddleware,
};
