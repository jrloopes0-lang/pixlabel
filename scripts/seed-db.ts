#!/usr/bin/env tsx
/**
 * Script para popular o banco de dados com dados iniciais
 * Uso: npm run db:seed
 * 
 * Este script insere:
 * - Usuários de exemplo (admin e operador)
 * - Unidades de saúde
 * - Fornecedores
 * - Medicamentos de exemplo
 * - Pacientes SESI de exemplo
 * - Estoque SESI inicial
 */

import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "../shared/schema.js";

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error("❌ Erro: DATABASE_URL não configurada");
  console.error("Configure DATABASE_URL no arquivo .env");
  process.exit(1);
}

const db = drizzle(DATABASE_URL, { schema });

async function seedDatabase() {
  console.log("\n🌱 PIXLABEL - Carregando Dados Iniciais");
  console.log("=========================================\n");

  try {
    // 1. Usuários
    console.log("👤 Criando usuários...");
    const adminUser = await db.insert(schema.users).values({
      email: "admin@pixlabel.local",
      firstName: "Administrador",
      lastName: "Sistema",
      role: "admin",
    }).returning();
    console.log(`  ✓ Admin criado: ${adminUser[0].email}`);

    const operatorUser = await db.insert(schema.users).values({
      email: "operador@pixlabel.local",
      firstName: "Operador",
      lastName: "Farmácia",
      role: "operator",
    }).returning();
    console.log(`  ✓ Operador criado: ${operatorUser[0].email}`);

    // 2. Unidades de Saúde
    console.log("\n🏥 Criando unidades de saúde...");
    const units = await db.insert(schema.units).values([
      { name: "UBS Centro", type: "centro_saude" },
      { name: "UBS Bairro Norte", type: "centro_saude" },
      { name: "Hospital Municipal", type: "hospital" },
      { name: "Farmácia Central", type: "farmacia" },
    ]).returning();
    console.log(`  ✓ ${units.length} unidades criadas`);

    // 3. Fornecedores
    console.log("\n🏢 Criando fornecedores...");
    const suppliers = await db.insert(schema.suppliers).values([
      { name: "Farmamed Distribuidora", contact: "(85) 3000-1000", priority: 2 },
      { name: "Medicamentos Nordeste LTDA", contact: "(85) 3000-2000", priority: 1 },
      { name: "Farma Ceará", contact: "(85) 3000-3000", priority: 1 },
    ]).returning();
    console.log(`  ✓ ${suppliers.length} fornecedores criados`);

    // 4. Medicamentos
    console.log("\n💊 Criando medicamentos de exemplo...");
    const medications = await db.insert(schema.items).values([
      {
        code: "MED001",
        name: "Paracetamol",
        presentation: "500mg - Comprimido",
        currentStock: 1000,
        monthlyConsumption: "150",
        minStockMonths: 2,
      },
      {
        code: "MED002",
        name: "Dipirona",
        presentation: "500mg - Comprimido",
        currentStock: 800,
        monthlyConsumption: "120",
        minStockMonths: 2,
      },
      {
        code: "MED003",
        name: "Losartana Potássica",
        presentation: "50mg - Comprimido",
        currentStock: 500,
        monthlyConsumption: "80",
        minStockMonths: 3,
      },
      {
        code: "MED004",
        name: "Metformina",
        presentation: "850mg - Comprimido",
        currentStock: 600,
        monthlyConsumption: "100",
        minStockMonths: 3,
      },
      {
        code: "MED005",
        name: "Omeprazol",
        presentation: "20mg - Cápsula",
        currentStock: 450,
        monthlyConsumption: "75",
        minStockMonths: 2,
      },
      {
        code: "MED006",
        name: "Amoxicilina",
        presentation: "500mg - Cápsula",
        currentStock: 300,
        monthlyConsumption: "60",
        minStockMonths: 2,
      },
      {
        code: "MED007",
        name: "Atenolol",
        presentation: "25mg - Comprimido",
        currentStock: 400,
        monthlyConsumption: "70",
        minStockMonths: 2,
      },
      {
        code: "MED008",
        name: "Sinvastatina",
        presentation: "20mg - Comprimido",
        currentStock: 350,
        monthlyConsumption: "55",
        minStockMonths: 2,
      },
    ]).returning();
    console.log(`  ✓ ${medications.length} medicamentos criados`);

    // 5. Pacientes SESI (Excepcionais)
    console.log("\n👨‍⚕️ Criando pacientes SESI...");
    const patients = await db.insert(schema.sesiPatients).values([
      {
        name: "Maria da Silva Santos",
        cpf: "12345678901",
        dateOfBirth: new Date("1965-03-15"),
        phone: "(85) 99999-0001",
        address: "Rua das Flores, 123 - Centro",
        notes: "Hipertensão e diabetes tipo 2",
      },
      {
        name: "João Pereira Costa",
        cpf: "23456789012",
        dateOfBirth: new Date("1958-07-22"),
        phone: "(85) 99999-0002",
        address: "Av. Principal, 456 - Bairro Norte",
        notes: "Diabetes tipo 1",
      },
      {
        name: "Ana Paula Oliveira",
        cpf: "34567890123",
        dateOfBirth: new Date("1972-11-08"),
        phone: "(85) 99999-0003",
        address: "Rua do Comércio, 789 - Centro",
        notes: "Hipertensão arterial",
      },
    ]).returning();
    console.log(`  ✓ ${patients.length} pacientes SESI criados`);

    // 6. Estoque SESI
    console.log("\n📦 Criando estoque SESI inicial...");
    
    // Encontrar alguns medicamentos para estoque SESI
    const losartana = medications.find(m => m.code === "MED003");
    const metformina = medications.find(m => m.code === "MED004");
    const atenolol = medications.find(m => m.code === "MED007");

    if (losartana && metformina && atenolol) {
      const sesiStock = await db.insert(schema.sesiStock).values([
        {
          itemId: losartana.id,
          batchNumber: "LOTE-2024-001",
          expiryDate: new Date("2026-12-31"),
          quantity: 200,
        },
        {
          itemId: losartana.id,
          batchNumber: "LOTE-2024-002",
          expiryDate: new Date("2027-06-30"),
          quantity: 150,
        },
        {
          itemId: metformina.id,
          batchNumber: "LOTE-2024-003",
          expiryDate: new Date("2026-09-30"),
          quantity: 300,
        },
        {
          itemId: atenolol.id,
          batchNumber: "LOTE-2024-004",
          expiryDate: new Date("2026-11-30"),
          quantity: 180,
        },
      ]).returning();
      console.log(`  ✓ ${sesiStock.length} lotes de estoque SESI criados`);
    }

    // 7. Pedido de exemplo
    console.log("\n📋 Criando pedido de exemplo...");
    const order = await db.insert(schema.orders).values({
      supplierId: suppliers[0].id,
      status: "draft",
      horizonMonths: 3,
    }).returning();
    console.log(`  ✓ Pedido criado: ${order[0].id}`);

    // Adicionar itens ao pedido
    const orderItems = await db.insert(schema.orderItems).values([
      {
        orderId: order[0].id,
        itemId: medications[0].id,
        quantity: 500,
      },
      {
        orderId: order[0].id,
        itemId: medications[1].id,
        quantity: 400,
      },
    ]).returning();
    console.log(`  ✓ ${orderItems.length} itens adicionados ao pedido`);

    // 8. Log de auditoria inicial
    console.log("\n📝 Criando log de auditoria...");
    await db.insert(schema.auditLogs).values({
      userId: adminUser[0].id,
      action: "import",
      entityType: "system",
      changes: JSON.stringify({ action: "seed_database", timestamp: new Date() }),
      ipAddress: "127.0.0.1",
    });
    console.log("  ✓ Log de auditoria criado");

    console.log("\n✅ Dados iniciais carregados com sucesso!");
    console.log("\n📊 Resumo:");
    console.log(`   • ${2} usuários`);
    console.log(`   • ${units.length} unidades de saúde`);
    console.log(`   • ${suppliers.length} fornecedores`);
    console.log(`   • ${medications.length} medicamentos`);
    console.log(`   • ${patients.length} pacientes SESI`);
    console.log(`   • 4 lotes de estoque SESI`);
    console.log(`   • 1 pedido de exemplo\n`);

    console.log("💡 Credenciais de acesso:");
    console.log("   Admin:    admin@pixlabel.local");
    console.log("   Operador: operador@pixlabel.local\n");

  } catch (error: any) {
    console.error("\n❌ Erro ao carregar dados:", error);
    
    // Se for erro de duplicação, significa que dados já existem
    if (error.message?.includes("duplicate") || error.message?.includes("unique")) {
      console.log("\n⚠️  Alguns dados já existem no banco de dados.");
      console.log("   Execute 'npm run db:reset' primeiro para limpar tudo.\n");
    }
    
    process.exit(1);
  }
}

seedDatabase();
