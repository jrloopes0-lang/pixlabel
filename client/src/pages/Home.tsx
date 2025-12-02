import { Card } from "@/components/ui/Card";
import { StatGrid } from "@/components/ui/StatGrid";
import { fetchDashboardHighlights } from "@/api";
import { useFetch } from "@/hooks/useFetch";

const modules = [
  { title: "Medicamentos Mestres", description: "Catálogo oficial de fármacos e apresentações clínicas." },
  { title: "Estoque", description: "Entradas, saídas, ajustes e curva ABC com vencimentos." },
  { title: "PMS", description: "Cadastros de pacientes, pareceres, evoluções e dispensações." },
  { title: "Delta Tracking", description: "Reconciliação de divergências e rastreabilidade completa." },
];

export function HomePage() {
  const { data: stats } = useFetch("home", fetchDashboardHighlights);

  return (
    <div className="space-y-6">
      <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
        <p className="text-eyebrow text-muted-foreground">PIXELLAB CAF</p>
        <h1 className="text-hero">Bem-vindo à operação</h1>
        <p className="text-muted-foreground mt-2 max-w-2xl">
          Base visual completa para navegar entre módulos, testar rotas e validar a fundação do sistema.
        </p>
      </div>

      <StatGrid stats={stats ?? []} />

      <Card title="Módulos ativos" subtitle="Navegue para validar cada experiência visual">
        <div className="grid md:grid-cols-2 gap-4 text-sm text-muted-foreground">
          {modules.map((module) => (
            <div key={module.title} className="p-4 rounded-lg bg-[color:var(--muted)]/30 border border-border/60">
              <h3 className="text-title-section mb-1 text-card-foreground">{module.title}</h3>
              <p>{module.description}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
