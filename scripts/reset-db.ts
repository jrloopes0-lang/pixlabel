#!/usr/bin/env tsx
/**
 * Script para resetar/reiniciar o banco de dados
 * Uso: npm run db:reset
 * 
 * Este script:
 * 1. Remove todas as tabelas existentes
 * 2. Recria as tabelas via Drizzle migrations
 * 3. Opcionalmente carrega dados iniciais (seed)
 */

import { drizzle } from "drizzle-orm/neon-http";
import { sql } from "drizzle-orm";
import * as schema from "../shared/schema.js";
import readline from "readline";

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error("❌ Erro: DATABASE_URL não configurada");
  console.error("Configure DATABASE_URL no arquivo .env");
  process.exit(1);
}

const db = drizzle(DATABASE_URL, { schema });

// Supported confirmation responses (English and Portuguese)
const AFFIRMATIVE_RESPONSES = ['y', 'yes', 's', 'sim'];

async function askConfirmation(question: string): Promise<boolean> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close();
      const normalizedAnswer = answer.toLowerCase().trim();
      resolve(AFFIRMATIVE_RESPONSES.includes(normalizedAnswer));
    });
  });
}

async function dropAllTables() {
  console.log("🗑️  Dropping all tables...");
  
  // List of all tables in schema (in reverse dependency order for CASCADE)
  // Note: Keep this synchronized with shared/schema.ts
  const tables = [
    "sesi_dispensations",
    "sesi_stock",
    "sesi_patients",
    "audit_logs",
    "import_history",
    "order_items",
    "orders",
    "items",
    "suppliers",
    "units",
    "users",
  ];

  for (const table of tables) {
    try {
      await db.execute(sql.raw(`DROP TABLE IF EXISTS "${table}" CASCADE`));
      console.log(`  ✓ Table ${table} dropped`);
    } catch (error) {
      console.warn(`  ⚠️  Warning while dropping ${table}:`, error);
    }
  }
}

async function createTables() {
  console.log("\n📦 Creating tables...");
  
  // Criar tabelas principais
  await db.execute(sql.raw(`
    CREATE TABLE IF NOT EXISTS "users" (
      "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      "email" text NOT NULL,
      "first_name" text NOT NULL,
      "last_name" text NOT NULL,
      "role" text NOT NULL DEFAULT 'operator',
      "created_at" timestamp NOT NULL DEFAULT now(),
      "updated_at" timestamp NOT NULL DEFAULT now()
    )
  `));
  console.log("  ✓ Table users created");

  await db.execute(sql.raw(`
    CREATE UNIQUE INDEX IF NOT EXISTS "users_email_idx" ON "users" ("email")
  `));

  await db.execute(sql.raw(`
    CREATE TABLE IF NOT EXISTS "units" (
      "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      "name" text NOT NULL,
      "type" text NOT NULL,
      "created_at" timestamp NOT NULL DEFAULT now(),
      "updated_at" timestamp NOT NULL DEFAULT now()
    )
  `));
  console.log("  ✓ Table units created");

  await db.execute(sql.raw(`
    CREATE TABLE IF NOT EXISTS "suppliers" (
      "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      "name" text NOT NULL,
      "contact" text,
      "priority" integer DEFAULT 0,
      "created_at" timestamp NOT NULL DEFAULT now(),
      "updated_at" timestamp NOT NULL DEFAULT now()
    )
  `));
  console.log("  ✓ Table suppliers created");

  await db.execute(sql.raw(`
    CREATE TABLE IF NOT EXISTS "items" (
      "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      "code" text NOT NULL,
      "name" text NOT NULL,
      "presentation" text,
      "current_stock" integer NOT NULL DEFAULT 0,
      "monthly_consumption" decimal(10, 2),
      "min_stock_months" integer DEFAULT 1,
      "created_at" timestamp NOT NULL DEFAULT now(),
      "updated_at" timestamp NOT NULL DEFAULT now()
    )
  `));
  console.log("  ✓ Table items created");

  await db.execute(sql.raw(`
    CREATE UNIQUE INDEX IF NOT EXISTS "items_code_idx" ON "items" ("code")
  `));
  await db.execute(sql.raw(`
    CREATE INDEX IF NOT EXISTS "items_name_idx" ON "items" ("name")
  `));

  await db.execute(sql.raw(`
    CREATE TABLE IF NOT EXISTS "orders" (
      "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      "supplier_id" uuid NOT NULL,
      "status" text NOT NULL DEFAULT 'draft',
      "horizon_months" integer DEFAULT 1,
      "created_at" timestamp NOT NULL DEFAULT now(),
      "updated_at" timestamp NOT NULL DEFAULT now()
    )
  `));
  console.log("  ✓ Table orders created");

  await db.execute(sql.raw(`
    CREATE INDEX IF NOT EXISTS "orders_supplier_idx" ON "orders" ("supplier_id")
  `));
  await db.execute(sql.raw(`
    CREATE INDEX IF NOT EXISTS "orders_status_idx" ON "orders" ("status")
  `));

  await db.execute(sql.raw(`
    CREATE TABLE IF NOT EXISTS "order_items" (
      "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      "order_id" uuid NOT NULL,
      "item_id" uuid NOT NULL,
      "quantity" integer NOT NULL,
      "created_at" timestamp NOT NULL DEFAULT now()
    )
  `));
  console.log("  ✓ Table order_items created");

  await db.execute(sql.raw(`
    CREATE INDEX IF NOT EXISTS "order_items_order_idx" ON "order_items" ("order_id")
  `));
  await db.execute(sql.raw(`
    CREATE INDEX IF NOT EXISTS "order_items_item_idx" ON "order_items" ("item_id")
  `));

  await db.execute(sql.raw(`
    CREATE TABLE IF NOT EXISTS "import_history" (
      "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      "file_name" text NOT NULL,
      "items_count" integer,
      "created_at" timestamp NOT NULL DEFAULT now()
    )
  `));
  console.log("  ✓ Table import_history created");

  await db.execute(sql.raw(`
    CREATE TABLE IF NOT EXISTS "audit_logs" (
      "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      "user_id" uuid,
      "action" text NOT NULL,
      "entity_id" uuid,
      "entity_type" text,
      "changes" text,
      "ip_address" text,
      "created_at" timestamp NOT NULL DEFAULT now()
    )
  `));
  console.log("  ✓ Table audit_logs created");

  await db.execute(sql.raw(`
    CREATE INDEX IF NOT EXISTS "audit_logs_user_idx" ON "audit_logs" ("user_id")
  `));
  await db.execute(sql.raw(`
    CREATE INDEX IF NOT EXISTS "audit_logs_entity_idx" ON "audit_logs" ("entity_id")
  `));
  await db.execute(sql.raw(`
    CREATE INDEX IF NOT EXISTS "audit_logs_created_idx" ON "audit_logs" ("created_at")
  `));

  // Tabelas SESI
  await db.execute(sql.raw(`
    CREATE TABLE IF NOT EXISTS "sesi_patients" (
      "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      "name" text NOT NULL,
      "cpf" text NOT NULL,
      "date_of_birth" timestamp,
      "phone" text,
      "address" text,
      "notes" text,
      "active" integer NOT NULL DEFAULT 1,
      "created_at" timestamp NOT NULL DEFAULT now(),
      "updated_at" timestamp NOT NULL DEFAULT now()
    )
  `));
  console.log("  ✓ Table sesi_patients created");

  await db.execute(sql.raw(`
    CREATE UNIQUE INDEX IF NOT EXISTS "sesi_patients_cpf_idx" ON "sesi_patients" ("cpf")
  `));
  await db.execute(sql.raw(`
    CREATE INDEX IF NOT EXISTS "sesi_patients_name_idx" ON "sesi_patients" ("name")
  `));

  await db.execute(sql.raw(`
    CREATE TABLE IF NOT EXISTS "sesi_stock" (
      "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      "item_id" uuid NOT NULL,
      "batch_number" text NOT NULL,
      "expiry_date" timestamp,
      "quantity" integer NOT NULL,
      "created_at" timestamp NOT NULL DEFAULT now(),
      "updated_at" timestamp NOT NULL DEFAULT now()
    )
  `));
  console.log("  ✓ Table sesi_stock created");

  await db.execute(sql.raw(`
    CREATE INDEX IF NOT EXISTS "sesi_stock_item_idx" ON "sesi_stock" ("item_id")
  `));
  await db.execute(sql.raw(`
    CREATE INDEX IF NOT EXISTS "sesi_stock_expiry_idx" ON "sesi_stock" ("expiry_date")
  `));

  await db.execute(sql.raw(`
    CREATE TABLE IF NOT EXISTS "sesi_dispensations" (
      "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      "patient_id" uuid NOT NULL,
      "medication_id" uuid NOT NULL,
      "quantity" integer NOT NULL,
      "batch_number" text,
      "dispensed_by" uuid,
      "notes" text,
      "created_at" timestamp NOT NULL DEFAULT now()
    )
  `));
  console.log("  ✓ Table sesi_dispensations created");

  await db.execute(sql.raw(`
    CREATE INDEX IF NOT EXISTS "sesi_dispensations_patient_idx" ON "sesi_dispensations" ("patient_id")
  `));
  await db.execute(sql.raw(`
    CREATE INDEX IF NOT EXISTS "sesi_dispensations_medication_idx" ON "sesi_dispensations" ("medication_id")
  `));
  await db.execute(sql.raw(`
    CREATE INDEX IF NOT EXISTS "sesi_dispensations_created_idx" ON "sesi_dispensations" ("created_at")
  `));

  console.log("\n✅ All tables created successfully!");
}

async function resetDatabase() {
  console.log("\n🔄 PIXLABEL - System Reset");
  console.log("===========================\n");

  // Confirmation required in production environment
  if (process.env.NODE_ENV === "production") {
    console.warn("⚠️  WARNING: You are in PRODUCTION environment!");
    const confirmed = await askConfirmation("Are you sure you want to reset the database? (y/n): ");
    if (!confirmed) {
      console.log("❌ Operation cancelled by user");
      process.exit(0);
    }
  }

  try {
    await dropAllTables();
    await createTables();
    
    console.log("\n🎉 Reset completed successfully!");
    console.log("\n💡 Next steps:");
    console.log("   • Run 'npm run db:seed' to load initial data");
    console.log("   • Run 'npm run dev' to start the server\n");
  } catch (error) {
    console.error("\n❌ Error during reset:", error);
    process.exit(1);
  }
}

resetDatabase();
