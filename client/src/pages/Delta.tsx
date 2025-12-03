import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { useFetch } from "@/hooks/useFetch";
import { fetchDeltaTrackingNotes } from "@/api";

export default function Delta() {
  const { data } = useFetch("delta", fetchDeltaTrackingNotes);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Delta Tracking</CardTitle>
          <CardDescription>Módulo de apoio para conciliar divergências</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Sincronize inventário, rastreie deltas e acompanhe reconciliações para manter estoque confiável.
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Observações rápidas</CardTitle>
          <CardDescription>Dados simulados para navegação visual</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="list-disc pl-6 text-sm text-muted-foreground space-y-2">
            {(data ?? []).map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}

export { Delta as DeltaPage };
