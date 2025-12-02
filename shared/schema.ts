import { pgTable, text, uuid, timestamp, integer, decimal, uniqueIndex, index } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

// ============================================
// ENUM TYPES (Using text fields in DB)
// ============================================

export const ROLES = ["admin", "operator"] as const;
export const ORDER_STATUSES = ["draft", "generated", "sent", "authorized", "committed", "received"] as const;
export const AUDIT_ACTIONS = ["create", "update", "delete", "dispensar", "import", "login", "logout"] as const;

// ============================================
// TABLES
// ============================================

// Users
export const users = pgTable(
  "users",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    email: text("email").notNull(),
    firstName: text("first_name").notNull(),
    lastName: text("last_name").notNull(),
    role: text("role").notNull().default("operator"), // enum value as text
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (table) => [
    uniqueIndex("users_email_idx").on(table.email),
  ]
);

// Units (Unidades de Saúde)
export const units = pgTable(
  "units",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name: text("name").notNull(),
    type: text("type").notNull(), // "centro_saude", "hospital", etc
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  }
);

// Suppliers (Fornecedores)
export const suppliers = pgTable(
  "suppliers",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name: text("name").notNull(),
    contact: text("contact"),
    priority: integer("priority").default(0), // 0=low, 1=medium, 2=high
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  }
);

// Items (Medicamentos)
export const items = pgTable(
  "items",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    code: text("code").notNull(),
    name: text("name").notNull(),
    presentation: text("presentation"), // "500mg comprimido", etc
    currentStock: integer("current_stock").notNull().default(0),
    monthlyConsumption: decimal("monthly_consumption", { precision: 10, scale: 2 }),
    minStockMonths: integer("min_stock_months").default(1),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (table) => [
    uniqueIndex("items_code_idx").on(table.code),
    index("items_name_idx").on(table.name),
  ]
);

// Orders (Pedidos de Medicamentos)
export const orders = pgTable(
  "orders",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    supplierId: uuid("supplier_id").notNull(),
    status: text("status").notNull().default("draft"), // enum value as text
    horizonMonths: integer("horizon_months").default(1),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (table) => [
    index("orders_supplier_idx").on(table.supplierId),
    index("orders_status_idx").on(table.status),
  ]
);

// OrderItems (Itens de Pedido)
export const orderItems = pgTable(
  "order_items",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    orderId: uuid("order_id").notNull(),
    itemId: uuid("item_id").notNull(),
    quantity: integer("quantity").notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (table) => [
    index("order_items_order_idx").on(table.orderId),
    index("order_items_item_idx").on(table.itemId),
  ]
);

// ImportHistory (Auditoria de Imports)
export const importHistory = pgTable(
  "import_history",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    fileName: text("file_name").notNull(),
    itemsCount: integer("items_count"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  }
);

// AuditLogs (Trilha de Auditoria)
export const auditLogs = pgTable(
  "audit_logs",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id"),
    action: text("action").notNull(), // enum value as text
    entityId: uuid("entity_id"),
    entityType: text("entity_type"), // "item", "order", "dispensacao", etc
    changes: text("changes"), // JSON stringified
    ipAddress: text("ip_address"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (table) => [
    index("audit_logs_user_idx").on(table.userId),
    index("audit_logs_entity_idx").on(table.entityId),
    index("audit_logs_created_idx").on(table.createdAt),
  ]
);

// ============================================
// SESI TABLES (Pacientes Excepcionais)
// ============================================

// SesiPatients
export const sesiPatients = pgTable(
  "sesi_patients",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name: text("name").notNull(),
    cpf: text("cpf").notNull(), // Será criptografado em aplicação
    dateOfBirth: timestamp("date_of_birth"),
    phone: text("phone"),
    address: text("address"),
    notes: text("notes"),
    active: integer("active").notNull().default(1),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (table) => [
    uniqueIndex("sesi_patients_cpf_idx").on(table.cpf),
    index("sesi_patients_name_idx").on(table.name),
  ]
);

// SesiStock (Estoque SESI)
export const sesiStock = pgTable(
  "sesi_stock",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    itemId: uuid("item_id").notNull(),
    batchNumber: text("batch_number").notNull(),
    expiryDate: timestamp("expiry_date"),
    quantity: integer("quantity").notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (table) => [
    index("sesi_stock_item_idx").on(table.itemId),
    index("sesi_stock_expiry_idx").on(table.expiryDate),
  ]
);

// SesiDispensations (Dispensações)
export const sesiDispensations = pgTable(
  "sesi_dispensations",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    patientId: uuid("patient_id").notNull(),
    medicationId: uuid("medication_id").notNull(),
    quantity: integer("quantity").notNull(),
    batchNumber: text("batch_number"),
    dispensedBy: uuid("dispensed_by"), // userId
    notes: text("notes"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (table) => [
    index("sesi_dispensations_patient_idx").on(table.patientId),
    index("sesi_dispensations_medication_idx").on(table.medicationId),
    index("sesi_dispensations_created_idx").on(table.createdAt),
  ]
);

// ============================================
// ZOD SCHEMAS (Validação)
// ============================================

// Users
export const selectUserSchema = createSelectSchema(users);
export const insertUserSchema = z.object({
  email: z.string().email(),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  role: z.enum(["admin", "operator"]).default("operator"),
});

// Items
export const selectItemSchema = createSelectSchema(items);
export const insertItemSchema = z.object({
  code: z.string().min(1),
  name: z.string().min(1),
  presentation: z.string().optional(),
  monthlyConsumption: z.number().optional(),
  minStockMonths: z.number().default(1),
});

// Orders
export const selectOrderSchema = createSelectSchema(orders);
export const insertOrderSchema = z.object({
  supplierId: z.string().uuid(),
  horizonMonths: z.number().default(1),
});

// OrderItems
export const selectOrderItemSchema = createSelectSchema(orderItems);
export const insertOrderItemSchema = z.object({
  orderId: z.string().uuid(),
  itemId: z.string().uuid(),
  quantity: z.number().int().positive(),
});

// Units
export const selectUnitSchema = createSelectSchema(units);
export const insertUnitSchema = z.object({
  name: z.string().min(1),
  type: z.string().min(1),
});

// Suppliers
export const selectSupplierSchema = createSelectSchema(suppliers);
export const insertSupplierSchema = z.object({
  name: z.string().min(1),
  contact: z.string().optional(),
  priority: z.number().default(0),
});

// SESI Patients
export const selectSesiPatientSchema = createSelectSchema(sesiPatients);
export const insertSesiPatientSchema = z.object({
  name: z.string().min(1),
  cpf: z.string().min(11).max(14), // CPF format
  dateOfBirth: z.coerce.date().optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
});

// SESI Stock
export const selectSesiStockSchema = createSelectSchema(sesiStock);
export const insertSesiStockSchema = z.object({
  itemId: z.string().uuid(),
  batchNumber: z.string().min(1),
  expiryDate: z.coerce.date().optional(),
  quantity: z.number().int().positive(),
});

// SESI Dispensations
export const selectSesiDispensationSchema = createSelectSchema(sesiDispensations);
export const insertSesiDispensationSchema = z.object({
  patientId: z.string().uuid(),
  medicationId: z.string().uuid(),
  quantity: z.number().int().positive(),
  batchNumber: z.string().optional(),
  notes: z.string().optional(),
});

// Audit Logs
export const selectAuditLogSchema = createSelectSchema(auditLogs);
export const insertAuditLogSchema = z.object({
  userId: z.string().uuid().optional(),
  action: z.enum(["create", "update", "delete", "dispensar", "import", "login", "logout"]),
  entityId: z.string().uuid().optional(),
  entityType: z.string().optional(),
  changes: z.string().optional(),
  ipAddress: z.string().optional(),
});

// ============================================
// TYPE EXPORTS
// ============================================

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

export type Item = typeof items.$inferSelect;
export type InsertItem = typeof items.$inferInsert;

export type Order = typeof orders.$inferSelect;
export type InsertOrder = typeof orders.$inferInsert;

export type OrderItem = typeof orderItems.$inferSelect;
export type InsertOrderItem = typeof orderItems.$inferInsert;

export type Unit = typeof units.$inferSelect;
export type InsertUnit = typeof units.$inferInsert;

export type Supplier = typeof suppliers.$inferSelect;
export type InsertSupplier = typeof suppliers.$inferInsert;

export type SesiPatient = typeof sesiPatients.$inferSelect;
export type InsertSesiPatient = typeof sesiPatients.$inferInsert;

export type SesiStockItem = typeof sesiStock.$inferSelect;
export type InsertSesiStockItem = typeof sesiStock.$inferInsert;

export type SesiDispensation = typeof sesiDispensations.$inferSelect;
export type InsertSesiDispensation = typeof sesiDispensations.$inferInsert;

export type AuditLog = typeof auditLogs.$inferSelect;
export type InsertAuditLog = typeof auditLogs.$inferInsert;
