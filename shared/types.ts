import {
  medicamentosMestres,
  unidadesSaude,
  estoque,
  movimentacoesEstoque,
  pmsPacientes,
  pmsPareceres,
  pmsEvolucoes,
  pmsDispensacoes,
} from "./schema";
import { InferSelectModel } from "drizzle-orm";

export type Medication = InferSelectModel<typeof medicamentosMestres>;
export type UnidadeSaude = InferSelectModel<typeof unidadesSaude>;
export type Estoque = InferSelectModel<typeof estoque>;
export type MovimentacaoEstoque = InferSelectModel<typeof movimentacoesEstoque>;
export type PmsPaciente = InferSelectModel<typeof pmsPacientes>;
export type PmsParecer = InferSelectModel<typeof pmsPareceres>;
export type PmsEvolucao = InferSelectModel<typeof pmsEvolucoes>;
export type PmsDispensacao = InferSelectModel<typeof pmsDispensacoes>;
