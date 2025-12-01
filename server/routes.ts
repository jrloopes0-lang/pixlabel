import { Router } from "express";

type EntityName =
  | "medicamentosMestres"
  | "estoque"
  | "pmsPacientes"
  | "pmsEvolucoes"
  | "pmsPareceres"
  | "pmsDispensacoes"
  | "deltaPendencias"
  | "movimentacoes";

type EntityStore<T extends Record<string, unknown>> = {
  nextId: number;
  items: Array<T & { id: number }>;
};

const stores: Record<EntityName, EntityStore<Record<string, unknown>>> = {
  medicamentosMestres: {
    nextId: 3,
    items: [
      {
        id: 1,
        nome: "Amoxicilina 500mg",
        via: "oral",
        categoria: "Antibiótico",
        unidadeDispensacao: "cápsula",
      },
      {
        id: 2,
        nome: "Dipirona 1g",
        via: "oral",
        categoria: "Analgésico",
        unidadeDispensacao: "comprimido",
      },
    ],
  },
  estoque: {
    nextId: 2,
    items: [
      {
        id: 1,
        medicamentoId: 1,
        unidadeSaude: "Unidade Central",
        quantidade: 120,
        validade: "2025-12-01",
      },
    ],
  },
  pmsPacientes: { nextId: 1, items: [] },
  pmsEvolucoes: { nextId: 1, items: [] },
  pmsPareceres: { nextId: 1, items: [] },
  pmsDispensacoes: { nextId: 1, items: [] },
  deltaPendencias: {
    nextId: 1,
    items: [
      { id: 1, descricao: "Cadastro externo sem vínculo", status: "pendente" },
    ],
  },
  movimentacoes: { nextId: 1, items: [] },
};

function buildCrudRoutes(
  router: Router,
  path: string,
  entityName: EntityName,
  extraFields: string[] = []
) {
  router.get(path, (_req, res) => {
    res.json(stores[entityName].items);
  });

  router.post(path, (req, res) => {
    const payload = req.body || {};
    const record = { id: stores[entityName].nextId++, ...payload };

    for (const field of extraFields) {
      if (!(field in record)) {
        return res.status(400).json({ error: `Campo obrigatório ausente: ${field}` });
      }
    }

    stores[entityName].items.push(record);
    res.status(201).json(record);
  });

  router.get(`${path}/:id`, (req, res) => {
    const id = Number(req.params.id);
    const record = stores[entityName].items.find((item) => item.id === id);
    if (!record) {
      return res.status(404).json({ error: "Registro não encontrado" });
    }
    res.json(record);
  });

  router.put(`${path}/:id`, (req, res) => {
    const id = Number(req.params.id);
    const index = stores[entityName].items.findIndex((item) => item.id === id);
    if (index === -1) {
      return res.status(404).json({ error: "Registro não encontrado" });
    }

    const payload = req.body || {};
    const updated = { ...stores[entityName].items[index], ...payload, id };
    stores[entityName].items[index] = updated;
    res.json(updated);
  });

  router.delete(`${path}/:id`, (req, res) => {
    const id = Number(req.params.id);
    const index = stores[entityName].items.findIndex((item) => item.id === id);
    if (index === -1) {
      return res.status(404).json({ error: "Registro não encontrado" });
    }

    stores[entityName].items.splice(index, 1);
    res.status(204).send();
  });
}

const router = Router();

router.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

router.get("/summary", (_req, res) => {
  res.json({
    modules: Object.keys(stores),
    hint: "Endpoints básicos prontos para iniciar a integração front-end → back-end",
  });
});

buildCrudRoutes(router, "/medicamentos-mestres", "medicamentosMestres", ["nome", "categoria"]);
buildCrudRoutes(router, "/estoque", "estoque", ["medicamentoId", "quantidade"]);
buildCrudRoutes(router, "/movimentacoes", "movimentacoes", ["tipo", "quantidade"]);
buildCrudRoutes(router, "/pms/pacientes", "pmsPacientes", ["nome"]);
buildCrudRoutes(router, "/pms/evolucoes", "pmsEvolucoes", ["pacienteId"]);
buildCrudRoutes(router, "/pms/pareceres", "pmsPareceres", ["pacienteId"]);
buildCrudRoutes(router, "/pms/dispensacoes", "pmsDispensacoes", ["pacienteId", "medicamentoId"]);
buildCrudRoutes(router, "/delta", "deltaPendencias", ["descricao"]);

export default router;
