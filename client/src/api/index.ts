export const apiEndpoints = {
  home: "/api/home",
  dashboard: "/api/dashboard",
  medicamentos: "/api/medicamentos",
  estoque: "/api/estoque",
  pms: "/api/pms",
  delta: "/api/delta-tracking",
};

export type MedicamentoMestre = {
  id: string;
  nomeComercial: string;
  apresentacao: string;
  classe: string;
  status: "Liberado" | "Restrito" | "Indisponível";
};

export type EstoqueItem = {
  id: string;
  produto: string;
  lote: string;
  validade: string;
  saldo: number;
  unidade: string;
};

export type PMSPaciente = {
  id: string;
  nome: string;
  prontuario: string;
  risco: "baixo" | "moderado" | "alto";
  ultimaEvolucao: string;
};

export async function fetchMedicamentosMestres(): Promise<MedicamentoMestre[]> {
  return Promise.resolve([
    {
      id: "abacavir",
      nomeComercial: "Abacavir 300mg",
      apresentacao: "Comprimido revestido",
      classe: "Antirretroviral",
      status: "Liberado",
    },
    {
      id: "rivotril",
      nomeComercial: "Clonazepam 2,5mg/mL",
      apresentacao: "Solução oral",
      classe: "Ansiolítico",
      status: "Restrito",
    },
    {
      id: "dipirona",
      nomeComercial: "Dipirona 500mg",
      apresentacao: "Comprimido",
      classe: "Analgesia",
      status: "Liberado",
    },
  ]);
}

export async function fetchEstoqueResumo(): Promise<EstoqueItem[]> {
  return Promise.resolve([
    { id: "lote-001", produto: "Dipirona 500mg", lote: "A9211", validade: "2025-08-01", saldo: 220, unidade: "Unidade Central" },
    { id: "lote-002", produto: "Ceftriaxona 1g", lote: "B1222", validade: "2025-03-16", saldo: 84, unidade: "Pronto Atendimento" },
    { id: "lote-003", produto: "Clonazepam 2,5mg/mL", lote: "C7334", validade: "2024-12-30", saldo: 12, unidade: "UTI" },
  ]);
}

export async function fetchPMSPacientes(): Promise<PMSPaciente[]> {
  return Promise.resolve([
    { id: "pac-01", nome: "Nicolas Santana", prontuario: "124512", risco: "alto", ultimaEvolucao: "Pós-operatório imediato" },
    { id: "pac-02", nome: "Marina Lopes", prontuario: "124634", risco: "moderado", ultimaEvolucao: "Avaliação de dor crônica" },
    { id: "pac-03", nome: "Bruna Carvalho", prontuario: "124655", risco: "baixo", ultimaEvolucao: "Estabilidade clínica" },
  ]);
}

export async function fetchDashboardHighlights(): Promise<{ label: string; value: string; tone?: "success" | "warning" | "critical" | "info" }[]> {
  return Promise.resolve([
    { label: "Itens críticos", value: "12", tone: "critical" },
    { label: "Cobertura média (dias)", value: "38", tone: "warning" },
    { label: "Pacientes PMS ativos", value: "214", tone: "info" },
    { label: "Delta tracking sincronizado", value: "98%", tone: "success" },
  ]);
}

export async function fetchDeltaTrackingNotes(): Promise<string[]> {
  return Promise.resolve([
    "Monitoramento de divergências habilitado",
    "Última reconciliação há 2h",
    "Sem novas quebras de rastreabilidade",
  ]);
}
