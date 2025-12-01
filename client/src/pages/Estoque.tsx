import { Card } from "@/components/ui/Card";
import { StatGrid } from "@/components/ui/StatGrid";
import { Table } from "@/components/ui/Table";
import { useEstoque } from "@/hooks/useEstoque";

const estatisticas = [
  { label: "Entradas no mês", value: "86" },
  { label: "Saídas no mês", value: "92" },
  { label: "Ajustes realizados", value: "14" },
  { label: "Lotes a vencer", value: "21", tone: "warning" as const },
];

export function EstoquePage() {
  const { data } = useEstoque();

  return (
    <div className="space-y-6">
      <StatGrid stats={estatisticas} />

      <Card title="Fluxos principais" subtitle="Entradas, saídas, ajustes e curva ABC">
        <ul className="list-disc pl-6 space-y-2 text-sm text-muted-foreground">
          <li>Registro de entradas com lote, validade e fornecedor.</li>
          <li>Saídas com vínculo ao paciente ou setor e dedução FIFO.</li>
          <li>Ajustes de inventário com justificativa e auditoria.</li>
          <li>Análise de suficiência e curva ABC automática.</li>
        </ul>
      </Card>

      <Card title="Movimentações recentes" subtitle="Dados simulados para visualização">
        <Table
          columns={[
            { header: "Produto", accessor: "produto" },
            { header: "Lote", accessor: "lote" },
            { header: "Validade", accessor: "validade" },
            { header: "Saldo", accessor: (row) => `${row.saldo} un.` },
            { header: "Unidade", accessor: "unidade" },
          ]}
          data={data}
        />
      </Card>
    </div>
  );
}
