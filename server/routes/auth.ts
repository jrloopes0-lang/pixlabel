import express, { Request, Response, NextFunction } from "express";
import passport from "passport";
import { eq } from "drizzle-orm";
import { randomUUID } from "crypto";
import { users, auditLogs } from "@shared/schema";
import { db } from "../db";

const router = express.Router();

async function saveOrUpdateUser(user: any) {
  try {
    if (!user?.email) return null;
    const found = await db.select().from(users).where(eq(users.email, user.email));
    if (found.length > 0) {
      const existing = found[0];
      await db.update(users).set({
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role || existing.role,
      }).where(eq(users.email, user.email));
      // return updated record
      const refreshed = await db.select().from(users).where(eq(users.email, user.email));
      return refreshed[0];
    } else {
      await db.insert(users).values({
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role || "operator",
      });
      const created = await db.select().from(users).where(eq(users.email, user.email));
      return created[0] || null;
    }
  } catch (err) {
    console.error("Error saving user:", err);
    return null;
  }
}

/**
 * GET /auth/login
 * Redireciona para Replit OAuth
 * Em desenvolvimento, cria sessão de teste
 */
router.get("/login", async (req: Request, res: Response, next: NextFunction) => {
  try {
    // If production OAuth credentials present, use passport to redirect to configured provider
    const provider = process.env.OAUTH_PROVIDER_NAME || (process.env.OAUTH_CLIENT_ID ? "oauth" : "dev-oauth");
    if (process.env.OAUTH_CLIENT_ID && process.env.OAUTH_CLIENT_SECRET) {
      return passport.authenticate(provider)(req, res, next);
    }

    // Dev fallback: create session user and persist to DB
    const devUser = {
      email: "dev@pixlabel.test",
      firstName: "Dev",
      lastName: "User",
      role: "admin" as const,
    };

    try {
      const saved = await saveOrUpdateUser(devUser);
      if (saved && req.session) {
        (req.session as any).userId = saved.id;
        (req as any).user = saved;
      }
    } catch (dbErr) {
      console.warn("⚠️ DB error in dev login, continuing with demo token:", dbErr);
    }
    
    // Redireciona para a Home após login de desenvolvimento
    res.redirect("/");
  } catch (err: any) {
    console.error("❌ Auth login error:", err);
    res.status(500).json({ status: "error", error: "Login failed: " + err.message });
  }
});

/**
 * GET /auth/callback
 * Callback após OAuth sucesso (Replit OIDC)
 */
router.get(
  "/callback",
  passport.authenticate("replit", { failureRedirect: "/" }),
  async (req: Request, res: Response) => {
    try {
      const oauthUser = (req as any).user;
      if (!oauthUser) {
        return res.status(400).json({ status: "error", error: "No user returned from provider" });
      }

      const saved = await saveOrUpdateUser(oauthUser);

      if (saved && req.session) {
        (req.session as any).userId = saved.id;
        (req as any).user = saved;
      }

      try {
        if (saved) {
            await db.insert(auditLogs).values({
              userId: saved.id,
              action: "login",
              entityType: "user",
              entityId: saved.id,
              changes: JSON.stringify({ method: process.env.OAUTH_PROVIDER_NAME || "oauth" }),
              ipAddress: req.ip || "unknown",
              createdAt: new Date(),
            });
          }
      } catch (err) {
        console.error("Failed to write audit log:", err);
      }

      if ((req.headers.accept || "").includes("text/html")) {
        return res.redirect("/");
      }

      res.json({ status: "success", message: "OAuth callback processed", user: saved });
    } catch (err: any) {
      console.error(err);
      res.status(500).json({ status: "error", error: err.message });
    }
  }
);

/**
 * GET /auth/logout
 * Logout do usuário com auditlog
 */
router.get("/logout", async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;

    // Log auditoria
    if (userId) {
      await db.insert(auditLogs).values({
        userId,
        action: "logout",
        entityType: "user",
        entityId: userId,
        changes: JSON.stringify({}),
        ipAddress: req.ip || "unknown",
        createdAt: new Date(),
      });
    }

    // Destruir sessão
    if (req.logout) {
      req.logout((err: any) => {
        if (err) {
          return res.status(500).json({ error: err.message });
        }
        if (req.session) {
          req.session.destroy((err: any) => {
            if (err) {
              return res.status(500).json({ error: err.message });
            }
            res.json({ status: "success", message: "Logged out" });
          });
        } else {
          res.json({ status: "success", message: "Logged out" });
        }
      });
    } else {
      if (req.session) {
        req.session.destroy((err: any) => {
          if (err) {
            return res.status(500).json({ error: err.message });
          }
          res.json({ status: "success", message: "Logged out" });
        });
      } else {
        res.json({ status: "success", message: "Logged out" });
      }
    }
  } catch (err: any) {
    res.status(500).json({ status: "error", error: err.message });
  }
});

/**
 * GET /auth/status
 * Check authentication status (public)
 */
router.get("/status", async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    
    // Check for demo token (for testing without OAuth)
    const demoToken = req.headers["x-demo-token"];
    if (!user && demoToken === "demo-pixlabel-test") {
      const demoUser = {
        id: "demo-user-123",
        email: "demo@pixlabel.test",
        firstName: "Demo",
        lastName: "User",
        role: "admin" as const,
      };
      return res.json({
        status: "success",
        data: {
          isAuthenticated: true,
          user: demoUser,
        },
      });
    }

    if (!user) {
      return res.json({
        status: "success",
        data: {
          isAuthenticated: false,
          user: null,
        },
      });
    }

    res.json({
      status: "success",
      data: {
        isAuthenticated: true,
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
        },
      },
    });
  } catch (err: any) {
    res.status(500).json({ status: "error", error: err.message });
  }
});

/**
 * GET /auth/demo-login
 * Demo login for testing (development only)
 */
router.get("/demo-login", async (req: Request, res: Response) => {
  if (process.env.NODE_ENV === "production" && !process.env.ALLOW_DEMO_LOGIN) {
    return res.status(403).json({ status: "error", error: "Demo login not allowed" });
  }

  try {
    const demoUser = {
      email: "demo@pixlabel.test",
      firstName: "Demo",
      lastName: "User",
      role: "admin" as const,
    };

    const saved = await saveOrUpdateUser(demoUser);

    if (saved && req.session) {
      (req.session as any).userId = saved.id;
      (req as any).user = saved;
    }

    // Redireciona com token no header
    res.setHeader("X-Demo-Token", "demo-pixlabel-test");
    res.json({ 
      status: "success", 
      message: "Demo login successful",
      user: saved,
      demoToken: "demo-pixlabel-test"
    });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ status: "error", error: err.message });
  }
});

export default router;
