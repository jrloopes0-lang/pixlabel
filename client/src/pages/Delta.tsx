import { Card } from "@/components/ui/Card";

export function DeltaPage() {
  return (
    <div className="space-y-6">
      <Card title="Delta Tracking">
        <p className="text-sm text-muted-foreground">
          Módulo auxiliar para conciliar divergências entre estoque físico e registros sistêmicos, permitindo auditorias
          rápidas e ações corretivas.
        </p>
      </Card>
      <Card title="Painéis">
        <ul className="list-disc pl-6 text-sm text-muted-foreground space-y-2">
          <li>Comparativo de saldo por unidade e lote.</li>
          <li>Histórico de ajustes com justificativa e responsável.</li>
          <li>Alertas de delta acima do tolerado (threshold configurável).</li>
        </ul>
      </Card>
    </div>
  );
}
