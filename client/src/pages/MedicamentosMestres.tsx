const campos = [
  "Princípio ativo",
  "Forma farmacêutica",
  "Dosagem",
  "Unidade de dispensação",
  "Categoria terapêutica",
  "Via de administração",
  "Estoque permitido",
  "Delta tracking",
];

export default function MedicamentosMestres() {
  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-border/80 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-foreground">Medicamentos Mestres</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Catálogo oficial para normalizar apresentações, categorias e vínculos de estoque. Use este módulo como fonte única
          de verdade para todas as dispensações e integrações.
        </p>
        <div className="mt-4 grid gap-2 text-sm text-muted-foreground sm:grid-cols-2 lg:grid-cols-4">
          {campos.map((campo) => (
            <div key={campo} className="rounded-lg bg-slate-50 px-3 py-2">{campo}</div>
          ))}
        </div>
      </div>

      <div className="rounded-xl border border-dashed border-border/80 bg-slate-50 p-6 text-sm text-muted-foreground">
        Conecte aqui a tabela <code className="rounded bg-white px-1 py-0.5">medicamentos_mestres</code> do schema Drizzle e
        exponha os endpoints <code className="rounded bg-white px-1 py-0.5">/api/medicamentos-mestres</code> para CRUD.
      </div>
    </div>
  );
}
