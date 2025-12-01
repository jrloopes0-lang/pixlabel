const modules = [
  {
    title: "Dashboard",
    description: "KPIs clínicos, rupturas críticas, curva de consumo e ranking por unidade.",
    badge: "Monitoramento",
  },
  {
    title: "Medicamentos Mestres",
    description: "Catálogo único com princípio ativo, forma, dosagem, via e categoria terapêutica.",
    badge: "Base oficial",
  },
  {
    title: "Estoque",
    description: "Entradas, saídas, ajustes, vencimentos, suficiência e curva ABC." ,
    badge: "Inventário",
  },
  {
    title: "PMS",
    description: "Cadastro de pacientes, evoluções, pareceres e dispensação com baixa automática.",
    badge: "Pacientes",
  },
  {
    title: "Delta Tracking",
    description: "Painel de inconsistências para conciliação manual com medicamentos mestres.",
    badge: "Auditoria",
  },
];

function ModuleCard({ title, description, badge }: (typeof modules)[number]) {
  return (
    <div className="h-full rounded-xl border border-border/80 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-foreground">{title}</h3>
        <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">{badge}</span>
      </div>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{description}</p>
    </div>
  );
}

export default function Home() {
  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-border/80 bg-white p-6 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">Visão geral</p>
        <h2 className="mt-2 text-2xl font-bold text-foreground">PIXELLAB CAF</h2>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-muted-foreground">
          Estrutura completa para iniciar o desenvolvimento: front-end em React com Vite, API Express pronta para CRUD e
          schema Drizzle com as tabelas essenciais. Use esta página como ponto de partida para conectar o backend e ativar
          o fluxo end-to-end.
        </p>
        <div className="mt-4 grid gap-3 text-xs text-muted-foreground sm:grid-cols-3">
          <div className="rounded-lg bg-slate-50 px-3 py-2">HMR ativo na porta 5173</div>
          <div className="rounded-lg bg-slate-50 px-3 py-2">API Express /api/* na porta 3000</div>
          <div className="rounded-lg bg-slate-50 px-3 py-2">Schemas Drizzle em shared/schema.ts</div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {modules.map((module) => (
          <ModuleCard key={module.title} {...module} />
        ))}
      </div>
    </div>
  );
}
