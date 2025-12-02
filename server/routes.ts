type EntityName =
type EntityStore<T extends Record<string, unknown>> = {
buildCrudRoutes(router, "/medicamentos-mestres", "medicamentosMestres", ["nome", "categoria"]);
buildCrudRoutes(router, "/estoque", "estoque", ["medicamentoId", "quantidade"]);
buildCrudRoutes(router, "/movimentacoes", "movimentacoes", ["tipo", "quantidade"]);
buildCrudRoutes(router, "/pms/pacientes", "pmsPacientes", ["nome"]);
buildCrudRoutes(router, "/pms/evolucoes", "pmsEvolucoes", ["pacienteId"]);
buildCrudRoutes(router, "/pms/pareceres", "pmsPareceres", ["pacienteId"]);
buildCrudRoutes(router, "/pms/dispensacoes", "pmsDispensacoes", ["pacienteId", "medicamentoId"]);
buildCrudRoutes(router, "/delta", "deltaPendencias", ["descricao"]);

import express from "express";

const router = express.Router();

router.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

// Adicione aqui suas rotas customizadas e integrações

export default router;
