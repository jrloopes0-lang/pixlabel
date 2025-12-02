import { Card } from "@/components/ui/Card";
import { useFetch } from "@/hooks/useFetch";
import { fetchDeltaTrackingNotes } from "@/api";

export default function Delta() {
  const { data } = useFetch("delta", fetchDeltaTrackingNotes);

  return (
    <div className="space-y-6">
      <Card title="Delta Tracking" subtitle="Módulo de apoio para conciliar divergências">
        <p className="text-sm text-muted-foreground">
          Sincronize inventário, rastreie deltas e acompanhe reconciliações para manter estoque confiável.
        </p>
      </Card>
      <Card title="Observações rápidas" subtitle="Dados simulados para navegação visual">
        <ul className="list-disc pl-6 text-sm text-muted-foreground space-y-2">
          {(data ?? []).map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </Card>
    </div>
  );
}

export { Delta as DeltaPage };
