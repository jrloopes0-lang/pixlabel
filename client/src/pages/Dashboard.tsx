import { Card } from "@/components/ui/Card";
import { StatGrid, type Stat } from "@/components/ui/StatGrid";

const kpi: Stat[] = [
  { label: "Itens monitorados", value: "1.248" },
  { label: "Cobertura média", value: "2.8 meses", tone: "warning" },
  { label: "Pacientes PMS", value: "214" },
  { label: "Itens críticos", value: "12", tone: "critical" },
];

export function DashboardPage() {
  return (
    <div className="space-y-6">
      <StatGrid stats={kpi} />
      <div className="grid xl:grid-cols-2 gap-4">
        <Card title="Ranking de Consumo">
          <p className="text-sm text-muted-foreground">Top 10 medicamentos por consumo mensal.</p>
          <div className="h-40 rounded-md border border-dashed border-border flex items-center justify-center text-muted-foreground">
            Gráfico de barras (placeholder)
          </div>
        </Card>
        <Card title="Curva Temporal">
          <p className="text-sm text-muted-foreground">Cobertura prevista para os próximos 12 meses.</p>
          <div className="h-40 rounded-md border border-dashed border-border flex items-center justify-center text-muted-foreground">
            Gráfico de linhas (placeholder)
          </div>
        </Card>
      </div>
      <Card title="Itens Críticos">
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li>Amoxicilina 500mg - estoque para 7 dias</li>
          <li>Insulina NPH - estoque para 5 dias</li>
          <li>Dipirona 1g - ruptura prevista em 3 dias</li>
        </ul>
      </Card>
    </div>
  );
}
