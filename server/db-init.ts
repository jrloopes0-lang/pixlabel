/**
 * Database initialization script
 * Run this to create tables in PostgreSQL when DATABASE_URL is configured
 * Usage: tsx server/db-init.ts
 */

import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import { migrate } from "drizzle-orm/neon-http/migrator";
import * as schema from "@shared/schema";

async function initDatabase() {
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    console.error("❌ DATABASE_URL não configurada!");
    console.log("Configure a variável de ambiente DATABASE_URL e tente novamente.");
    console.log("Exemplo: DATABASE_URL=postgresql://user:pass@host:5432/dbname");
    process.exit(1);
  }

  try {
    console.log("🔄 Iniciando conexão com o banco de dados...");
    const sql = neon(databaseUrl);
    const db = drizzle(sql, { schema });
    
    console.log("✅ Conectado ao banco de dados");
    console.log(`📊 Host: ${databaseUrl.split('@')[1]?.split('/')[0] || 'configured'}`);
    
    // Run migrations if migrations folder exists
    console.log("\n🔄 Aplicando migrations...");
    try {
      await migrate(db, { migrationsFolder: "./migrations" });
      console.log("✅ Migrations aplicadas com sucesso!");
    } catch (migrationError: any) {
      console.warn("⚠️ Erro ao aplicar migrations:", migrationError.message);
      console.log("Talvez as tabelas já existam ou não haja migrations pendentes.");
    }
    
    // Verify tables exist
    console.log("\n🔍 Verificando tabelas criadas...");
    const tables = [
      "users",
      "items", 
      "orders",
      "order_items",
      "units",
      "suppliers",
      "sesi_patients",
      "sesi_stock",
      "sesi_dispensations",
      "audit_logs",
      "import_history"
    ];
    
    for (const tableName of tables) {
      try {
        const result = await sql`
          SELECT EXISTS (
            SELECT FROM information_schema.tables 
            WHERE table_schema = 'public' 
            AND table_name = ${tableName}
          );
        `;
        const exists = result[0]?.exists;
        console.log(`  ${exists ? '✅' : '❌'} ${tableName}`);
      } catch (err) {
        console.log(`  ⚠️ ${tableName} (erro ao verificar)`);
      }
    }
    
    console.log("\n✨ Inicialização do banco de dados concluída!");
    console.log("Você pode agora executar o servidor com: npm run dev");
    
  } catch (error: any) {
    console.error("❌ Erro ao inicializar banco de dados:", error.message);
    console.error(error);
    process.exit(1);
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  initDatabase();
}

export { initDatabase };
