import { Card } from "@/components/ui/Card";
import { StatGrid } from "@/components/ui/StatGrid";

export function HomePage() {
  return (
    <div className="space-y-6">
      <StatGrid
        stats={[
          { label: "Itens críticos", value: "12", tone: "critical" },
          { label: "Cobertura média (dias)", value: "38", tone: "warning" },
          { label: "Pacientes PMS ativos", value: "214", tone: "info" },
          { label: "Delta tracking sincronizado", value: "98%", tone: "success" },
        ]}
      />
      <Card title="Módulos Ativos">
        <div className="grid md:grid-cols-2 gap-4 text-sm text-muted-foreground">
          <div>
            <h3 className="text-title-section mb-2">Medicamentos Mestres</h3>
            <p>Catálogo oficial de fármacos com apresentação, classe terapêutica e status regulatório.</p>
          </div>
          <div>
            <h3 className="text-title-section mb-2">Estoque</h3>
            <p>Entradas, saídas, ajustes e curva ABC com monitoramento de vencimentos e suficiência.</p>
          </div>
          <div>
            <h3 className="text-title-section mb-2">PMS</h3>
            <p>Cadastros de pacientes, pareceres clínicos, evoluções, dispensações e geração de PDF.</p>
          </div>
          <div>
            <h3 className="text-title-section mb-2">Delta Tracking</h3>
            <p>Camada auxiliar para conciliar diferenças de estoque e garantir rastreabilidade.</p>
          </div>
        </div>
      </Card>
    </div>
  );
}
