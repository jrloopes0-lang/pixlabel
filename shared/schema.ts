<<<<<<< HEAD
import { integer, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

export const unidadesSaude = pgTable("unidades_saude", {
  id: serial("id").primaryKey(),
  nome: text("nome").notNull(),
  cidade: text("cidade"),
  uf: text("uf"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

export const medicamentosMestres = pgTable("medicamentos_mestres", {
  id: serial("id").primaryKey(),
  principioAtivo: text("principio_ativo").notNull(),
  formaFarmaceutica: text("forma_farmaceutica").notNull(),
  dosagem: text("dosagem").notNull(),
  unidadeDispensacao: text("unidade_dispensacao").notNull(),
  categoria: text("categoria"),
  via: text("via"),
  estoquePermitido: integer("estoque_permitido"),
  deltaTrackingTag: text("delta_tracking_tag"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

export const estoque = pgTable("estoque", {
  id: serial("id").primaryKey(),
  medicamentoId: integer("medicamento_id").notNull(),
  unidadeSaudeId: integer("unidade_saude_id").notNull(),
  quantidade: integer("quantidade").notNull(),
  validade: timestamp("validade", { withTimezone: true }),
  lote: text("lote"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

export const movimentacoesEstoque = pgTable("movimentacoes_estoque", {
  id: serial("id").primaryKey(),
  estoqueId: integer("estoque_id").notNull(),
  tipo: text("tipo").notNull(),
  quantidade: integer("quantidade").notNull(),
  observacao: text("observacao"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

export const pmsPacientes = pgTable("pms_pacientes", {
  id: serial("id").primaryKey(),
  nome: text("nome").notNull(),
  documento: text("documento"),
  unidadeSaudeId: integer("unidade_saude_id"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

export const pmsEvolucoes = pgTable("pms_evolucoes", {
  id: serial("id").primaryKey(),
  pacienteId: integer("paciente_id").notNull(),
  descricao: text("descricao").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

export const pmsPareceres = pgTable("pms_pareceres", {
  id: serial("id").primaryKey(),
  pacienteId: integer("paciente_id").notNull(),
  parecer: text("parecer").notNull(),
  profissional: text("profissional"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

export const pmsDispensacoes = pgTable("pms_dispensacoes", {
  id: serial("id").primaryKey(),
  pacienteId: integer("paciente_id").notNull(),
  medicamentoId: integer("medicamento_id").notNull(),
  quantidade: integer("quantidade").notNull(),
  unidadeSaudeId: integer("unidade_saude_id"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

export const deltaPendencias = pgTable("delta_pendencias", {
  id: serial("id").primaryKey(),
  descricao: text("descricao").notNull(),
  status: text("status").default("pendente"),
  origem: text("origem"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

export type UnidadeSaude = typeof unidadesSaude.$inferSelect;
export type MedicamentoMestre = typeof medicamentosMestres.$inferSelect;
export type Estoque = typeof estoque.$inferSelect;
export type MovimentacaoEstoque = typeof movimentacoesEstoque.$inferSelect;
export type PmsPaciente = typeof pmsPacientes.$inferSelect;
export type PmsEvolucao = typeof pmsEvolucoes.$inferSelect;
export type PmsParecer = typeof pmsPareceres.$inferSelect;
export type PmsDispensacao = typeof pmsDispensacoes.$inferSelect;
export type DeltaPendencia = typeof deltaPendencias.$inferSelect;
=======
import { pgTable, text, uuid, timestamp, integer, decimal, enum as pgEnum, uniqueIndex, index } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

// ============================================
// ENUMS
// ============================================

export const roleEnum = pgEnum("role", ["admin", "operator"]);
export const orderStatusEnum = pgEnum("order_status", [
  "draft",
  "generated",
  "sent",
  "authorized",
  "committed",
  "received",
]);

// ...schema moderno e tipado...
import { pgTable, text, uuid, timestamp, integer, decimal, enum as pgEnum, uniqueIndex, index } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

// Enums
export const roleEnum = pgEnum("role", ["admin", "operator"]);
export const orderStatusEnum = pgEnum("order_status", ["draft", "generated", "sent", "authorized", "committed", "received"]);
export const auditActionEnum = pgEnum("audit_action", ["create", "update", "delete", "dispensar", "import", "login", "logout"]);

// Tabelas principais (users, units, suppliers, items, orders, orderItems, importHistory, auditLogs)
// ...código igual ao modelo moderno...

// SESI tables (sesiPatients, sesiStock, sesiDispensations)
// ...código igual ao modelo moderno...

// Zod schemas
// ...código igual ao modelo moderno...

// Types
// ...código igual ao modelo moderno...
    role: roleEnum("role").notNull().default("operator"),
