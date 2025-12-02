import session from "express-session";
import ConnectPgSimple from "connect-pg-simple";
import { Pool } from "@neondatabase/serverless";

export function createSessionMiddleware() {
  if (!process.env.DATABASE_URL) {
    console.warn("⚠️  DATABASE_URL não configurada. Usando session em-memória (NÃO use em produção)");
    return session({
      secret: process.env.SESSION_SECRET || "dev-secret-unsafe",
      resave: false,
      saveUninitialized: false,
      cookie: {
        secure: process.env.NODE_ENV === "production",
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24, // 24 horas
      },
    });
  }

  // Use PostgreSQL session store
  const pgPool = new Pool({ connectionString: process.env.DATABASE_URL });
  const PostgresqlStore = ConnectPgSimple(session);

  return session({
    store: new PostgresqlStore({ pool: pgPool }),
    secret: process.env.SESSION_SECRET || "dev-secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24,
    },
  });
}

// Extend Express session to include user
declare global {
  namespace Express {
    interface User {
      id: string;
      email: string;
      firstName: string;
      lastName: string;
      role: "admin" | "operator";
    }
  }
}
