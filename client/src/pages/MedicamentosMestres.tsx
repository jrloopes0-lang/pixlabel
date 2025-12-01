import { Card } from "@/components/ui/Card";
import { useCollection } from "@/hooks/useApi";
import { Medication } from "@shared/types";

export function MedicamentosMestresPage() {
  const { data } = useCollection<Medication>("/medicamentos-mestres");

  return (
    <div className="space-y-6">
      <Card title="Base oficial de medicamentos">
        <p className="text-sm text-muted-foreground">
          Catálogo unificado com atributos clínicos, códigos e status regulatório. Esta base alimenta todas as operações de
          estoque e PMS.
        </p>
      </Card>
      <Card title="Medicamentos cadastrados">
        <div className="overflow-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left text-muted-foreground">
                <th className="py-2">Nome</th>
                <th className="py-2">Apresentação</th>
                <th className="py-2">Classe</th>
                <th className="py-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {(data ?? []).map((item: Medication) => (
                <tr key={item.id} className="border-t border-border">
                  <td className="py-2 font-medium">{item.nome}</td>
                  <td className="py-2">{item.apresentacao}</td>
                  <td className="py-2">{item.classeTerapeutica}</td>
                  <td className="py-2">
                    <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-800">
                      {item.statusRegulatorio}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
