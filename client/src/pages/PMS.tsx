import { Card } from "@/components/ui/Card";
import { StatGrid } from "@/components/ui/StatGrid";

export function PMSPage() {
  return (
    <div className="space-y-6">
      <StatGrid
        stats={[
          { label: "Pacientes ativos", value: "214" },
          { label: "Pareceres emitidos", value: "38" },
          { label: "Dispensações", value: "129" },
          { label: "PDFs gerados", value: "42", tone: "info" },
        ]}
      />
      <Card title="Linha de cuidado PMS">
        <ol className="list-decimal pl-6 space-y-2 text-sm text-muted-foreground">
          <li>Cadastro do paciente com dados clínicos e vínculos a unidades.</li>
          <li>Parecer e evolução médica com histórico auditável.</li>
          <li>Dispensação integrada ao estoque (dedução FIFO por lote).</li>
          <li>Geração de PDF para recibos e comprovação.</li>
        </ol>
      </Card>
      <Card title="Atendimentos recentes">
        <div className="space-y-2 text-sm text-muted-foreground">
          <p>Paciente 88231 - Parecer concluído e dispensação de Insulina NPH.</p>
          <p>Paciente 55102 - Evolução registrada, curva temporal atualizada.</p>
          <p>Paciente 33018 - Dispensação de Amoxicilina 500mg, lote FIFO aplicado.</p>
        </div>
      </Card>
    </div>
  );
}
