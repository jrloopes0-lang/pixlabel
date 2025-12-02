import { Request, Response, NextFunction } from "express";

// Extend Express Request type for Passport
declare global {
  namespace Express {
    interface User {
      id: string;
      email: string;
      firstName: string;
      lastName: string;
      role: "admin" | "operator";
    }

    interface Request {
      user?: User;
    }
  }
}

// Middleware para verificar se usuário está autenticado
export function isAuthenticated(req: Request, res: Response, next: NextFunction) {
  if (!req.user) {
    return res.status(401).json({ error: "Unauthorized", status: "error" });
  }
  next();
}

// Middleware para RBAC (role-based access control)
export function requireRole(role: "admin" | "operator" | "all") {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized", status: "error" });
    }

    if (role === "all") {
      return next();
    }

    const userRole = req.user.role;
    if (userRole !== role) {
      return res.status(403).json({ error: "Forbidden: insufficient permissions", status: "error" });
    }

    next();
  };
}

// Middleware para logar requisições em auditLogs
export function auditLog(action: string, entityType: string) {
  return async (req: Request, res: Response, next: NextFunction) => {
    // TODO: Log to auditLogs table when auth is implemented
    // For now, just pass through
    next();
  };
}
