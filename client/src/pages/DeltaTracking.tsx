const itens = [
  "Inconsistências de cadastro vindas do portal",
  "Itens sem vínculo com medicamentos mestres",
  "Pendências para conciliação manual",
  "Histórico de decisões de vínculo",
];

export default function DeltaTracking() {
  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-border/80 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-foreground">Delta Tracking</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Painel auxiliar para investigar divergências e alinhar cadastros do portal com o catálogo de medicamentos mestres.
        </p>
        <div className="mt-4 grid gap-2 text-sm text-muted-foreground sm:grid-cols-2">
          {itens.map((item) => (
            <div key={item} className="rounded-lg bg-slate-50 px-3 py-2">{item}</div>
          ))}
        </div>
      </div>

      <div className="rounded-xl border border-dashed border-border/80 bg-slate-50 p-6 text-sm text-muted-foreground">
        Utilize o endpoint <code className="rounded bg-white px-1 py-0.5">/api/delta</code> para listar e resolver pendências de
        conciliação.
      </div>
    </div>
  );
}
