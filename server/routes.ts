import { Router } from "express";
import { db } from "./db";
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
  unidadesSaude,
} from "@shared/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";

interface CrudConfig {
  path: string;
  table: any;
  selectSchema: z.AnyZodObject;
  insertSchema: z.AnyZodObject;
}

function createCrudRoutes({ path, table, insertSchema, selectSchema }: CrudConfig) {
  const router = Router();

  router.get(path, async (_req, res) => {
    const items = await db.select().from(table as any);
    res.json(selectSchema.array().parse(items));
  });

  router.get(`${path}/:id`, async (req, res) => {
    const [item] = await db.select().from(table as any).where(eq((table as any).id, req.params.id));
    if (!item) return res.status(404).json({ message: "Not found" });
    res.json(selectSchema.parse(item));
  });

  router.post(path, async (req, res) => {
    const payload = insertSchema.parse(req.body);
    const [record] = (await db.insert(table as any).values(payload as any).returning()) as any[];
    res.status(201).json(selectSchema.parse(record));
  });

  router.put(`${path}/:id`, async (req, res) => {
    const payload = insertSchema.partial().parse(req.body);
    const [record] = (await db
      .update(table as any)
      .set(payload as any)
      .where(eq((table as any).id, req.params.id))
      .returning()) as any[];
    if (!record) return res.status(404).json({ message: "Not found" });
    res.json(selectSchema.parse(record));
  });

  router.delete(`${path}/:id`, async (req, res) => {
    await db.delete(table as any).where(eq((table as any).id, req.params.id));
    res.status(204).send();
  });

  return router;
}

export function buildApiRouter() {
  const router = Router();

  router.use(
    createCrudRoutes({
      path: "/medicamentos-mestres",
      table: medicamentosMestres,
      insertSchema: insertMedicamentoSchema,
      selectSchema: selectMedicamentoSchema,
    }),
  );

  router.use(createCrudRoutes({ path: "/unidades-saude", table: unidadesSaude, insertSchema: insertUnidadeSchema, selectSchema: selectUnidadeSchema }));
  router.use(createCrudRoutes({ path: "/estoque", table: estoque, insertSchema: insertEstoqueSchema, selectSchema: selectEstoqueSchema }));
  router.use(
    createCrudRoutes({
      path: "/movimentacoes-estoque",
      table: movimentacoesEstoque,
      insertSchema: insertMovimentacaoSchema,
      selectSchema: selectMovimentacaoSchema,
    }),
  );
  router.use(createCrudRoutes({ path: "/pms/pacientes", table: pmsPacientes, insertSchema: insertPacienteSchema, selectSchema: selectPacienteSchema }));
  router.use(createCrudRoutes({ path: "/pms/pareceres", table: pmsPareceres, insertSchema: insertParecerSchema, selectSchema: selectParecerSchema }));
  router.use(createCrudRoutes({ path: "/pms/evolucoes", table: pmsEvolucoes, insertSchema: insertEvolucaoSchema, selectSchema: selectEvolucaoSchema }));
  router.use(createCrudRoutes({ path: "/pms/dispensacoes", table: pmsDispensacoes, insertSchema: insertDispensacaoSchema, selectSchema: selectDispensacaoSchema }));

  return router;
}
