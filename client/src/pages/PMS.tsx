import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { StatGrid } from "@/components/ui/StatGrid";
import { Table } from "@/components/ui/Table";
import { usePMS } from "@/hooks/usePMS";

const estatisticas = [
  { label: "Pacientes ativos", value: "214" },
  { label: "Pareceres emitidos", value: "38" },
  { label: "Dispensações", value: "129" },
  { label: "PDFs gerados", value: "42", tone: "info" as const },
];

export function PMSPage() {
  const { data } = usePMS();

  return (
    <div className="space-y-6">
      <StatGrid stats={estatisticas} />

      <Card>
        <CardHeader>
          <CardTitle>Linha de cuidado PMS</CardTitle>
          <CardDescription>Fluxo completo ilustrado</CardDescription>
        </CardHeader>
        <CardContent>
          <ol className="list-decimal pl-6 space-y-2 text-sm text-muted-foreground">
            <li>Cadastro do paciente com dados clínicos e vínculos a unidades.</li>
            <li>Parecer e evolução médica com histórico auditável.</li>
            <li>Dispensação integrada ao estoque (dedução FIFO por lote).</li>
            <li>Geração de PDF para recibos e comprovação.</li>
          </ol>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Pacientes em acompanhamento</CardTitle>
          <CardDescription>Dados fictícios para visualização</CardDescription>
        </CardHeader>
        <CardContent>
          <Table
            columns={[
              { header: "Paciente", accessor: "nome" },
              { header: "Prontuário", accessor: "prontuario" },
              { header: "Risco", accessor: (row) => row.risco.toUpperCase() },
              { header: "Última evolução", accessor: "ultimaEvolucao" },
            ]}
            data={data}
          />
        </CardContent>
      </Card>
    </div>
  );
}
