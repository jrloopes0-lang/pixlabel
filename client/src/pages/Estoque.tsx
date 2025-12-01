const fluxos = [
  "Entrada (compra, devolução, transferência)",
  "Saída (dispensação, ajuste, perda)",
  "Ajustes de inventário",
  "Vencimentos e quarentena",
  "Curva ABC e suficiência",
];

export default function Estoque() {
  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-border/80 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-foreground">Estoque</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Estruture as movimentações para manter rastreabilidade completa entre entradas, saídas e dispensações do PMS.
        </p>
        <div className="mt-4 grid gap-2 text-sm text-muted-foreground sm:grid-cols-2">
          {fluxos.map((fluxo) => (
            <div key={fluxo} className="rounded-lg bg-slate-50 px-3 py-2">{fluxo}</div>
          ))}
        </div>
      </div>

      <div className="rounded-xl border border-dashed border-border/80 bg-slate-50 p-6 text-sm text-muted-foreground">
        Conecte à tabela <code className="rounded bg-white px-1 py-0.5">estoque</code> e
        <code className="ml-1 rounded bg-white px-1 py-0.5">movimentacoes_estoque</code> do schema Drizzle. Use as rotas
        <code className="ml-1 rounded bg-white px-1 py-0.5">/api/estoque</code> e
        <code className="ml-1 rounded bg-white px-1 py-0.5">/api/movimentacoes</code> como base.
      </div>
    </div>
  );
}
