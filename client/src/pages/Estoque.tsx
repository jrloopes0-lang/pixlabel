import { Card } from "@/components/ui/Card";
import { StatGrid } from "@/components/ui/StatGrid";

export function EstoquePage() {
  return (
    <div className="space-y-6">
      <StatGrid
        stats={[
          { label: "Entradas no mês", value: "86" },
          { label: "Saídas no mês", value: "92" },
          { label: "Ajustes realizados", value: "14" },
          { label: "Lotes a vencer", value: "21", tone: "warning" },
        ]}
      />
      <Card title="Fluxos principais">
        <ul className="list-disc pl-6 space-y-2 text-sm text-muted-foreground">
          <li>Registro de entradas com lote, validade e fornecedor.</li>
          <li>Saídas com vínculo ao paciente ou setor e dedução FIFO.</li>
          <li>Ajustes de inventário com justificativa e auditoria.</li>
          <li>Análise de suficiência e curva ABC automática.</li>
        </ul>
      </Card>
      <Card title="Movimentações recentes">
        <div className="text-sm text-muted-foreground space-y-2">
          <p>08/01 - Entrada 120x Dipirona 1g (LOTE XPTO) - Unidade Central</p>
          <p>07/31 - Saída 30x Amoxicilina 500mg - Paciente PMS</p>
          <p>07/30 - Ajuste +12x Insulina NPH após contagem física</p>
        </div>
      </Card>
    </div>
  );
}
