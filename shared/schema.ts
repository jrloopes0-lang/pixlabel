import { integer, pgTable, text, timestamp, uuid, varchar, date } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

export const medicamentosMestres = pgTable("medicamentos_mestres", {
  id: uuid("id").defaultRandom().primaryKey(),
  codigo: varchar("codigo", { length: 120 }).notNull(),
  nome: text("nome").notNull(),
  apresentacao: text("apresentacao").notNull(),
  classeTerapeutica: text("classe_terapeutica").notNull(),
  statusRegulatorio: varchar("status_regulatorio", { length: 64 }).default("ativo").notNull(),
  createdAt: timestamp("created_at", { mode: "string" }).defaultNow().notNull(),
});

export const unidadesSaude = pgTable("unidades_saude", {
  id: uuid("id").defaultRandom().primaryKey(),
  nome: text("nome").notNull(),
  tipo: varchar("tipo", { length: 64 }).default("unidade").notNull(),
  cidade: varchar("cidade", { length: 120 }),
  createdAt: timestamp("created_at", { mode: "string" }).defaultNow().notNull(),
});

export const estoque = pgTable("estoque", {
  id: uuid("id").defaultRandom().primaryKey(),
  medicamentoId: uuid("medicamento_id")
    .references(() => medicamentosMestres.id)
    .notNull(),
  unidadeId: uuid("unidade_id")
    .references(() => unidadesSaude.id)
    .notNull(),
  lote: varchar("lote", { length: 80 }).notNull(),
  validade: date("validade", { mode: "string" }).notNull(),
  quantidade: integer("quantidade").notNull(),
  suficienciaDias: integer("suficiencia_dias"),
  curvaAbc: varchar("curva_abc", { length: 2 }).default("C"),
  createdAt: timestamp("created_at", { mode: "string" }).defaultNow().notNull(),
});

export const movimentacoesEstoque = pgTable("movimentacoes_estoque", {
  id: uuid("id").defaultRandom().primaryKey(),
  estoqueId: uuid("estoque_id")
    .references(() => estoque.id)
    .notNull(),
  tipo: varchar("tipo", { length: 24 }).notNull(),
  quantidade: integer("quantidade").notNull(),
  motivo: text("motivo"),
  createdAt: timestamp("created_at", { mode: "string" }).defaultNow().notNull(),
});

export const pmsPacientes = pgTable("pms_pacientes", {
  id: uuid("id").defaultRandom().primaryKey(),
  nome: text("nome").notNull(),
  documento: varchar("documento", { length: 32 }).notNull(),
  dataNascimento: date("data_nascimento", { mode: "string" }),
  unidadeId: uuid("unidade_id").references(() => unidadesSaude.id),
  createdAt: timestamp("created_at", { mode: "string" }).defaultNow().notNull(),
});

export const pmsPareceres = pgTable("pms_pareceres", {
  id: uuid("id").defaultRandom().primaryKey(),
  pacienteId: uuid("paciente_id")
    .references(() => pmsPacientes.id)
    .notNull(),
  profissional: text("profissional"),
  parecer: text("parecer").notNull(),
  createdAt: timestamp("created_at", { mode: "string" }).defaultNow().notNull(),
});

export const pmsEvolucoes = pgTable("pms_evolucoes", {
  id: uuid("id").defaultRandom().primaryKey(),
  pacienteId: uuid("paciente_id")
    .references(() => pmsPacientes.id)
    .notNull(),
  observacao: text("observacao").notNull(),
  profissional: text("profissional"),
  createdAt: timestamp("created_at", { mode: "string" }).defaultNow().notNull(),
});

export const pmsDispensacoes = pgTable("pms_dispensacoes", {
  id: uuid("id").defaultRandom().primaryKey(),
  pacienteId: uuid("paciente_id")
    .references(() => pmsPacientes.id)
    .notNull(),
  estoqueId: uuid("estoque_id").references(() => estoque.id),
  medicamentoId: uuid("medicamento_id")
    .references(() => medicamentosMestres.id)
    .notNull(),
  quantidade: integer("quantidade").notNull(),
  comprovanteUrl: text("comprovante_url"),
  createdAt: timestamp("created_at", { mode: "string" }).defaultNow().notNull(),
});

export const insertMedicamentoSchema = createInsertSchema(medicamentosMestres);
export const insertUnidadeSchema = createInsertSchema(unidadesSaude);
export const insertEstoqueSchema = createInsertSchema(estoque);
export const insertMovimentacaoSchema = createInsertSchema(movimentacoesEstoque);
export const insertPacienteSchema = createInsertSchema(pmsPacientes);
export const insertParecerSchema = createInsertSchema(pmsPareceres);
export const insertEvolucaoSchema = createInsertSchema(pmsEvolucoes);
export const insertDispensacaoSchema = createInsertSchema(pmsDispensacoes);

export const selectMedicamentoSchema = createSelectSchema(medicamentosMestres);
export const selectUnidadeSchema = createSelectSchema(unidadesSaude);
export const selectEstoqueSchema = createSelectSchema(estoque);
export const selectMovimentacaoSchema = createSelectSchema(movimentacoesEstoque);
export const selectPacienteSchema = createSelectSchema(pmsPacientes);
export const selectParecerSchema = createSelectSchema(pmsPareceres);
export const selectEvolucaoSchema = createSelectSchema(pmsEvolucoes);
export const selectDispensacaoSchema = createSelectSchema(pmsDispensacoes);
