const etapas = [
  { title: "Cadastro de paciente", hint: "Dados demográficos e unidade de saúde" },
  { title: "Evolução clínica", hint: "Histórico estruturado e anotações" },
  { title: "Parecer", hint: "Assistente social / farmacêutico" },
  { title: "Dispensação", hint: "Baixa automática do estoque" },
  { title: "Documentos", hint: "Geração de PDF e anexos" },
];

export default function Pms() {
  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-border/80 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-foreground">PMS</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Pipeline completo para pacientes excepcionais. Cada etapa deve se conectar às tabelas de pacientes, evoluções,
          pareceres e dispensações.
        </p>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {etapas.map((etapa) => (
            <div key={etapa.title} className="rounded-lg border border-border/70 bg-slate-50 p-3">
              <p className="text-sm font-semibold text-foreground">{etapa.title}</p>
              <p className="text-xs text-muted-foreground">{etapa.hint}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-xl border border-dashed border-border/80 bg-slate-50 p-6 text-sm text-muted-foreground">
        Endpoints esperados:
        <code className="ml-1 rounded bg-white px-1 py-0.5">/api/pms/pacientes</code>,
        <code className="ml-1 rounded bg-white px-1 py-0.5">/api/pms/evolucoes</code>,
        <code className="ml-1 rounded bg-white px-1 py-0.5">/api/pms/pareceres</code> e
        <code className="ml-1 rounded bg-white px-1 py-0.5">/api/pms/dispensacoes</code>.
      </div>
    </div>
  );
}
