import { drizzle as drizzleNeon, NeonHttpDatabase } from "drizzle-orm/neon-http";
import { drizzle as drizzlePg, NodePgDatabase } from "drizzle-orm/node-postgres";
import { neon } from "@neondatabase/serverless";
import { Pool } from "pg";
import * as schema from "@shared/schema";

let instance: NeonHttpDatabase<typeof schema> | NodePgDatabase<typeof schema> | null = null;

if (process.env.DATABASE_URL) {
  const shouldUseNeon =
    process.env.DRIZZLE_ADAPTER === "neon" || process.env.DATABASE_URL.includes("neon.tech");

  if (shouldUseNeon) {
    const sql = neon(process.env.DATABASE_URL);
    instance = drizzleNeon({ client: sql, schema });
  } else {
    const pool = new Pool({ connectionString: process.env.DATABASE_URL });
    instance = drizzlePg(pool, { schema });
  }
} else {
  console.warn(
    "DATABASE_URL is not set. API routes will fall back to in-memory mocks for development.",
  );
}

export const db = instance;
