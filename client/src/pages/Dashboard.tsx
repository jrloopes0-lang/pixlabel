const stats = [
  { label: "Itens críticos", value: "12", tone: "text-red-600", description: "Rupturas ou abaixo do mínimo" },
  { label: "Cobertura média", value: "34 dias", tone: "text-emerald-600", description: "Projeção pelos estoques" },
  { label: "Dispensações hoje", value: "58", tone: "text-blue-600", description: "Pacientes atendidos" },
  { label: "Vencimentos em 30d", value: "7", tone: "text-amber-600", description: "Itens para ajuste" },
];

const panels = [
  {
    title: "Curva de consumo",
    body: "Use esta área para conectar gráficos (Recharts) e visualizar a curva de consumo dos últimos 12 meses.",
  },
  {
    title: "Top 5 medicamentos",
    body: "Liste aqui os medicamentos mais dispensados e acompanhe as unidades com maior demanda.",
  },
  {
    title: "Alertas operacionais",
    body: "Central de avisos para vencimentos, rupturas e inconformidades de movimentação.",
  },
];

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl border border-border/70 bg-white p-4 shadow-sm"
          >
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{stat.label}</p>
            <p className={`mt-2 text-3xl font-bold ${stat.tone}`}>{stat.value}</p>
            <p className="text-sm text-muted-foreground">{stat.description}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {panels.map((panel) => (
          <div
            key={panel.title}
            className="h-full rounded-xl border border-border/80 bg-white p-4 shadow-sm"
          >
            <h3 className="text-lg font-semibold text-foreground">{panel.title}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{panel.body}</p>
            <div className="mt-4 h-32 rounded-lg border border-dashed border-border/70 bg-slate-50" />
          </div>
        ))}
      </div>
    </div>
  );
}
