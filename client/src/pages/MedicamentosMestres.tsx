import { Card } from "@/components/ui/Card";
import { Table } from "@/components/ui/Table";
import { useMedicamentos } from "@/hooks/useMedicamentos";

export function MedicamentosMestresPage() {
  const { data } = useMedicamentos();

  return (
    <div className="space-y-6">
      <Card
        title="Medicamentos Mestres"
        subtitle="Catálogo oficial para alimentar os demais módulos"
        actions={<button className="text-sm px-3 py-2 rounded-md border border-border">Adicionar</button>}
      >
        <p className="text-sm text-muted-foreground">
          Cada item aqui representa a fonte única de fármacos, com suas apresentações e status regulatório.
        </p>
      </Card>
      <Card title="Medicamentos cadastrados" subtitle="Dados de exemplo carregados localmente">
        <Table
          columns={[
            { header: "Nome comercial", accessor: "nomeComercial" },
            { header: "Apresentação", accessor: "apresentacao" },
            { header: "Classe", accessor: "classe" },
            { header: "Status", accessor: "status" },
          ]}
          data={data}
        />
      </Card>
    </div>
  );
}
