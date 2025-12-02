import { randomUUID } from "crypto";
import { Router } from "express";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "./db";
import { mockData } from "./mockData";
import {
  estoque,
  insertDispensacaoSchema,
  insertEvolucaoSchema,
  insertEstoqueSchema,
  insertMedicamentoSchema,
  insertMovimentacaoSchema,
  insertPacienteSchema,
  insertParecerSchema,
  insertUnidadeSchema,
  unidadesSaude,
  medicamentosMestres,
  movimentacoesEstoque,
  pmsDispensacoes,
  pmsEvolucoes,
  pmsPacientes,
  pmsPareceres,
  selectDispensacaoSchema,
  selectEvolucaoSchema,
  selectEstoqueSchema,
  selectMedicamentoSchema,
  selectMovimentacaoSchema,
  selectPacienteSchema,
  selectParecerSchema,
  selectUnidadeSchema,
} from "@shared/schema";

interface CrudAdapter<TSelect extends { id: string }, TInsert extends Record<string, unknown>> {
  list(): Promise<TSelect[]>;
  get(id: string): Promise<TSelect | undefined>;
  create(payload: TInsert): Promise<TSelect>;
  update(id: string, payload: Partial<TInsert>): Promise<TSelect | undefined>;
  delete(id: string): Promise<void>;
}

interface CrudConfig<TSelect extends { id: string }, TInsert extends Record<string, unknown>> {
  path: string;
  adapter: CrudAdapter<TSelect, TInsert>;
  selectSchema: z.AnyZodObject;
  insertSchema: z.AnyZodObject;
}

function createDrizzleAdapter<TSelect extends { id: string }, TInsert extends Record<string, unknown>>({
  table,
  selectSchema,
  insertSchema,
}: {
  table: any;
  selectSchema: z.AnyZodObject;
  insertSchema: z.AnyZodObject;
}): CrudAdapter<TSelect, TInsert> {
  if (!db) {
    throw new Error("Attempted to use database adapter without a database connection");
  }
  const database = db;

  return {
    list: async () => {
      const items = await database.select().from(table as any);
      return selectSchema.array().parse(items) as TSelect[];
    },
    get: async (id: string) => {
      const [item] = await database.select().from(table as any).where(eq((table as any).id, id));
      return item ? (selectSchema.parse(item) as TSelect) : undefined;
    },
    create: async (payload: TInsert) => {
      const parsed = insertSchema.parse(payload);
      const [record] = (await database.insert(table as any).values(parsed as any).returning()) as any[];
      return selectSchema.parse(record) as TSelect;
    },
    update: async (id: string, payload: Partial<TInsert>) => {
      const parsed = insertSchema.partial().parse(payload);
      const [record] = (await database
        .update(table as any)
        .set(parsed as any)
        .where(eq((table as any).id, id))
        .returning()) as any[];
      return record ? (selectSchema.parse(record) as TSelect) : undefined;
    },
    delete: async (id: string) => {
      await database.delete(table as any).where(eq((table as any).id, id));
    },
  };
}

function createMockAdapter<TSelect extends { id: string }, TInsert extends Record<string, unknown>>({
  seed,
  selectSchema,
  insertSchema,
}: {
  seed: TSelect[];
  selectSchema: z.AnyZodObject;
  insertSchema: z.AnyZodObject;
}): CrudAdapter<TSelect, TInsert> {
  const data = [...seed];

  return {
    list: async () => data,
    get: async (id: string) => data.find((item) => item.id === id),
    create: async (payload: TInsert) => {
      const parsed = insertSchema.parse(payload);
      const record = selectSchema.parse({
        id: randomUUID(),
        createdAt: new Date().toISOString(),
        ...parsed,
      });
      data.push(record as TSelect);
      return record as TSelect;
    },
    update: async (id: string, payload: Partial<TInsert>) => {
      const parsed = insertSchema.partial().parse(payload);
      const index = data.findIndex((item) => item.id === id);
      if (index === -1) return undefined;
      const updated = selectSchema.parse({ ...data[index], ...parsed });
      data[index] = updated as TSelect;
      return updated as TSelect;
    },
    delete: async (id: string) => {
      const index = data.findIndex((item) => item.id === id);
      if (index >= 0) data.splice(index, 1);
    },
  };
}

function createCrudRoutes<TSelect extends { id: string }, TInsert extends Record<string, unknown>>({
  path,
  adapter,
  selectSchema,
  insertSchema,
}: CrudConfig<TSelect, TInsert>) {
  const router = Router();

  router.get(path, async (_req, res) => {
    const items = await adapter.list();
    res.json(selectSchema.array().parse(items));
  });

  router.get(`${path}/:id`, async (req, res) => {
    const item = await adapter.get(req.params.id);
    if (!item) return res.status(404).json({ message: "Not found" });
    res.json(selectSchema.parse(item));
  });

  router.post(path, async (req, res) => {
    const payload = insertSchema.parse(req.body);
    const record = await adapter.create(payload as TInsert);
    res.status(201).json(selectSchema.parse(record));
  });

  router.put(`${path}/:id`, async (req, res) => {
    const payload = insertSchema.partial().parse(req.body);
    const record = await adapter.update(req.params.id, payload as Partial<TInsert>);
    if (!record) return res.status(404).json({ message: "Not found" });
    res.json(selectSchema.parse(record));
  });

  router.delete(`${path}/:id`, async (req, res) => {
    await adapter.delete(req.params.id);
    res.status(204).send();
  });

  return router;
}

const usingMock = !db;

const medicamentosAdapter = usingMock
  ? createMockAdapter({ seed: mockData.medicamentosMestres, selectSchema: selectMedicamentoSchema, insertSchema: insertMedicamentoSchema })
  : createDrizzleAdapter({ table: medicamentosMestres, selectSchema: selectMedicamentoSchema, insertSchema: insertMedicamentoSchema });

const unidadesAdapter = usingMock
  ? createMockAdapter({ seed: mockData.unidadesSaude, selectSchema: selectUnidadeSchema, insertSchema: insertUnidadeSchema })
  : createDrizzleAdapter({ table: unidadesSaude, selectSchema: selectUnidadeSchema, insertSchema: insertUnidadeSchema });

const estoqueAdapter = usingMock
  ? createMockAdapter({ seed: mockData.estoque, selectSchema: selectEstoqueSchema, insertSchema: insertEstoqueSchema })
  : createDrizzleAdapter({ table: estoque, selectSchema: selectEstoqueSchema, insertSchema: insertEstoqueSchema });

const movimentacoesAdapter = usingMock
  ? createMockAdapter({
      seed: mockData.movimentacoesEstoque,
      selectSchema: selectMovimentacaoSchema,
      insertSchema: insertMovimentacaoSchema,
    })
  : createDrizzleAdapter({ table: movimentacoesEstoque, selectSchema: selectMovimentacaoSchema, insertSchema: insertMovimentacaoSchema });

const pacientesAdapter = usingMock
  ? createMockAdapter({ seed: mockData.pmsPacientes, selectSchema: selectPacienteSchema, insertSchema: insertPacienteSchema })
  : createDrizzleAdapter({ table: pmsPacientes, selectSchema: selectPacienteSchema, insertSchema: insertPacienteSchema });

const pareceresAdapter = usingMock
  ? createMockAdapter({ seed: mockData.pmsPareceres, selectSchema: selectParecerSchema, insertSchema: insertParecerSchema })
  : createDrizzleAdapter({ table: pmsPareceres, selectSchema: selectParecerSchema, insertSchema: insertParecerSchema });

const evolucoesAdapter = usingMock
  ? createMockAdapter({ seed: mockData.pmsEvolucoes, selectSchema: selectEvolucaoSchema, insertSchema: insertEvolucaoSchema })
  : createDrizzleAdapter({ table: pmsEvolucoes, selectSchema: selectEvolucaoSchema, insertSchema: insertEvolucaoSchema });

const dispensacoesAdapter = usingMock
  ? createMockAdapter({ seed: mockData.pmsDispensacoes, selectSchema: selectDispensacaoSchema, insertSchema: insertDispensacaoSchema })
  : createDrizzleAdapter({ table: pmsDispensacoes, selectSchema: selectDispensacaoSchema, insertSchema: insertDispensacaoSchema });

export function buildApiRouter() {
  const router = Router();

  router.use(
    createCrudRoutes({
      path: "/medicamentos-mestres",
      adapter: medicamentosAdapter,
      insertSchema: insertMedicamentoSchema,
      selectSchema: selectMedicamentoSchema,
    }),
  );

  router.use(
    createCrudRoutes({
      path: "/unidades-saude",
      adapter: unidadesAdapter,
      insertSchema: insertUnidadeSchema,
      selectSchema: selectUnidadeSchema,
    }),
  );

  router.use(
    createCrudRoutes({
      path: "/estoque",
      adapter: estoqueAdapter,
      insertSchema: insertEstoqueSchema,
      selectSchema: selectEstoqueSchema,
    }),
  );

  router.use(
    createCrudRoutes({
      path: "/movimentacoes-estoque",
      adapter: movimentacoesAdapter,
      insertSchema: insertMovimentacaoSchema,
      selectSchema: selectMovimentacaoSchema,
    }),
  );

  router.use(
    createCrudRoutes({
      path: "/pms/pacientes",
      adapter: pacientesAdapter,
      insertSchema: insertPacienteSchema,
      selectSchema: selectPacienteSchema,
    }),
  );

  router.use(
    createCrudRoutes({
      path: "/pms/pareceres",
      adapter: pareceresAdapter,
      insertSchema: insertParecerSchema,
      selectSchema: selectParecerSchema,
    }),
  );

  router.use(
    createCrudRoutes({
      path: "/pms/evolucoes",
      adapter: evolucoesAdapter,
      insertSchema: insertEvolucaoSchema,
      selectSchema: selectEvolucaoSchema,
    }),
  );

  router.use(
    createCrudRoutes({
      path: "/pms/dispensacoes",
      adapter: dispensacoesAdapter,
      insertSchema: insertDispensacaoSchema,
      selectSchema: selectDispensacaoSchema,
    }),
  );

  return router;
}
