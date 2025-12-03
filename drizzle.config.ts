import { defineConfig } from "drizzle-kit";

// Allow drizzle-kit commands to run even without DATABASE_URL for schema inspection
const databaseUrl = process.env.DATABASE_URL || "postgresql://placeholder:placeholder@localhost:5432/placeholder";

if (!process.env.DATABASE_URL) {
  console.warn("⚠️ DATABASE_URL não configurada. Alguns comandos drizzle-kit podem falhar.");
}

export default defineConfig({
  out: "./migrations",
  schema: "./shared/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: databaseUrl,
  },
});
