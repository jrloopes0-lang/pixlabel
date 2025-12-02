import { randomUUID } from "crypto";
import {
  selectDispensacaoSchema,
  selectEstoqueSchema,
  selectEvolucaoSchema,
  selectMedicamentoSchema,
  selectMovimentacaoSchema,
  selectPacienteSchema,
  selectParecerSchema,
  selectUnidadeSchema,
} from "@shared/schema";
import { z } from "zod";

export type MockData = {
  medicamentosMestres: z.infer<typeof selectMedicamentoSchema>[];
  unidadesSaude: z.infer<typeof selectUnidadeSchema>[];
  estoque: z.infer<typeof selectEstoqueSchema>[];
  movimentacoesEstoque: z.infer<typeof selectMovimentacaoSchema>[];
  pmsPacientes: z.infer<typeof selectPacienteSchema>[];
  pmsPareceres: z.infer<typeof selectParecerSchema>[];
  pmsEvolucoes: z.infer<typeof selectEvolucaoSchema>[];
  pmsDispensacoes: z.infer<typeof selectDispensacaoSchema>[];
};

const now = new Date();
const today = now.toISOString();
const defaultValidity = now.toISOString().slice(0, 10);

const unidadeCentralId = randomUUID();
const unidadeNorteId = randomUUID();
const paracetamolId = randomUUID();
const amoxicilinaId = randomUUID();
const dipironaId = randomUUID();
const estoqueParacetamolId = randomUUID();
const estoqueAmoxicilinaId = randomUUID();
const estoqueDipironaId = randomUUID();
const pacienteId = randomUUID();
const dispensacaoId = randomUUID();
const parecerId = randomUUID();
const evolucaoId = randomUUID();
const movimentacaoEntradaId = randomUUID();
const movimentacaoSaidaId = randomUUID();

export const mockData: MockData = {
  medicamentosMestres: [
    {
      id: paracetamolId,
      codigo: "MED-001",
      nome: "Paracetamol",
      apresentacao: "Comprimido 500mg",
      classeTerapeutica: "Analgésico",
      statusRegulatorio: "ativo",
      createdAt: today,
    },
    {
      id: amoxicilinaId,
      codigo: "MED-002",
      nome: "Amoxicilina",
      apresentacao: "Cápsula 500mg",
      classeTerapeutica: "Antibiótico",
      statusRegulatorio: "ativo",
      createdAt: today,
    },
    {
      id: dipironaId,
      codigo: "MED-003",
      nome: "Dipirona",
      apresentacao: "Solução oral 500mg/ml",
      classeTerapeutica: "Analgésico",
      statusRegulatorio: "ativo",
      createdAt: today,
    },
  ],
  unidadesSaude: [
    {
      id: unidadeCentralId,
      nome: "Hospital Central",
      tipo: "hospital",
      cidade: "São Paulo",
      createdAt: today,
    },
    {
      id: unidadeNorteId,
      nome: "UPA Zona Norte",
      tipo: "upa",
      cidade: "São Paulo",
      createdAt: today,
    },
  ],
  estoque: [
    {
      id: estoqueParacetamolId,
      medicamentoId: paracetamolId,
      unidadeId: unidadeCentralId,
      lote: "L-2024-01",
      validade: defaultValidity,
      quantidade: 120,
      suficienciaDias: 45,
      curvaAbc: "A",
      createdAt: today,
    },
    {
      id: estoqueAmoxicilinaId,
      medicamentoId: amoxicilinaId,
      unidadeId: unidadeCentralId,
      lote: "L-2024-02",
      validade: defaultValidity,
      quantidade: 60,
      suficienciaDias: 30,
      curvaAbc: "B",
      createdAt: today,
    },
    {
      id: estoqueDipironaId,
      medicamentoId: dipironaId,
      unidadeId: unidadeNorteId,
      lote: "L-2024-03",
      validade: defaultValidity,
      quantidade: 200,
      suficienciaDias: 50,
      curvaAbc: "A",
      createdAt: today,
    },
  ],
  movimentacoesEstoque: [
    {
      id: movimentacaoEntradaId,
      estoqueId: estoqueParacetamolId,
      tipo: "entrada",
      quantidade: 100,
      motivo: "Reposição mensal",
      createdAt: today,
    },
    {
      id: movimentacaoSaidaId,
      estoqueId: estoqueDipironaId,
      tipo: "saida",
      quantidade: 20,
      motivo: "Dispensação UPA",
      createdAt: today,
    },
  ],
  pmsPacientes: [
    {
      id: pacienteId,
      nome: "Maria Silva",
      documento: "123.456.789-00",
      dataNascimento: defaultValidity,
      unidadeId: unidadeCentralId,
      createdAt: today,
    },
  ],
  pmsPareceres: [
    {
      id: parecerId,
      pacienteId,
      profissional: "Dr. João",
      parecer: "Paciente em acompanhamento, manter analgesia.",
      createdAt: today,
    },
  ],
  pmsEvolucoes: [
    {
      id: evolucaoId,
      pacienteId,
      observacao: "Dor reduzida após medicação.",
      profissional: "Enf. Carla",
      createdAt: today,
    },
  ],
  pmsDispensacoes: [
    {
      id: dispensacaoId,
      pacienteId,
      estoqueId: estoqueParacetamolId,
      medicamentoId: paracetamolId,
      quantidade: 10,
      comprovanteUrl: null,
      createdAt: today,
    },
  ],
};
