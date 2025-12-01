import { Card } from "@/components/ui/Card";
import { StatGrid } from "@/components/ui/StatGrid";
import { Table } from "@/components/ui/Table";
import { fetchDashboardHighlights } from "@/api";
import { useFetch } from "@/hooks/useFetch";
import { brandPalette } from "@/design/tokens";

const rankingMock = [
  { item: "Ceftriaxona 1g", consumo: "412 doses" },
  { item: "Dipirona 500mg", consumo: "388 doses" },
  { item: "Clonazepam 2,5mg/mL", consumo: "143 doses" },
];

const criticMock = [
  { item: "Midazolam 5mg/mL", risco: "Cobertura 5 dias" },
  { item: "Noradrenalina", risco: "Lote próximo ao vencimento" },
];

export function DashboardPrincipalPage() {
  const { data: highlights } = useFetch("dashboard", fetchDashboardHighlights);

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-[color:var(--primary)]/10 via-[color:var(--primary)]/15 to-transparent border border-border rounded-2xl p-6">
        <p className="text-eyebrow text-muted-foreground">Painel principal</p>
        <h1 className="text-hero" style={{ color: brandPalette.techPurple }}>
          Operação CAF em tempo real
        </h1>
        <p className="text-sm text-muted-foreground max-w-2xl mt-2">
          Visão consolidada do estoque, PMS e rastreamento para acelerar decisões táticas.
        </p>
      </div>

      <StatGrid stats={highlights ?? []} />

      <div className="grid gap-4 lg:grid-cols-2">
        <Card title="Ranking de consumo" subtitle="Top itens mais movimentados no período">
          <ul className="space-y-3 text-sm text-muted-foreground">
            {rankingMock.map((row) => (
              <li key={row.item} className="flex items-center justify-between bg-[color:var(--muted)]/30 rounded-lg px-3 py-2">
                <span className="font-semibold text-card-foreground">{row.item}</span>
                <span>{row.consumo}</span>
              </li>
            ))}
          </ul>
        </Card>

        <Card title="Alertas críticos" subtitle="Itens que precisam de atenção imediata">
          <ul className="space-y-3 text-sm text-muted-foreground">
            {criticMock.map((alert) => (
              <li key={alert.item} className="flex items-center justify-between bg-[color:var(--muted)]/30 rounded-lg px-3 py-2">
                <span className="font-semibold text-card-foreground">{alert.item}</span>
                <span>{alert.risco}</span>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      <Card title="Curva temporal" subtitle="Evolução das movimentações em linhas gerais">
        <Table
          columns={[
            { header: "Linha do tempo", accessor: (row: { label: string; valor: string }) => row.label },
            { header: "Valor", accessor: (row: { label: string; valor: string }) => row.valor },
          ]}
          data={[
            { label: "Últimas 24h", valor: "+128 saídas" },
            { label: "Semana", valor: "+864 saídas" },
            { label: "Mês", valor: "+3.420 saídas" },
          ]}
        />
      </Card>
    </div>
  );
}
