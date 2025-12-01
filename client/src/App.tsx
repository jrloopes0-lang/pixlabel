import "./index.css";

function InfoCard({ title, description }: { title: string; description: string }) {
  return (
    <div className="rounded-lg border border-border bg-card p-4 shadow-sm">
      <h2 className="text-lg font-semibold text-foreground">{title}</h2>
      <p className="mt-2 text-sm text-muted-foreground">{description}</p>
    </div>
  );
}

export default function App() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 text-foreground">
      <header className="bg-white/80 shadow-sm backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-lg font-bold text-primary">
              PX
            </span>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Pixlabel</p>
              <h1 className="text-xl font-semibold leading-tight text-foreground">
                Plataforma de gestão farmacêutica
              </h1>
            </div>
          </div>
          <a
            className="rounded-md border border-border bg-white px-3 py-2 text-sm font-medium text-foreground shadow-sm transition hover:-translate-y-0.5 hover:shadow"
            href="/api/health"
            target="_blank"
            rel="noreferrer"
          >
            Verificar API
          </a>
        </div>
      </header>

      <main className="mx-auto flex max-w-5xl flex-col gap-6 px-6 py-10">
        <section className="space-y-4">
          <p className="text-base text-muted-foreground">
            Este esqueleto fornece um ponto de partida funcional para o frontend React e a API Express. Rode
            <code className="mx-1 rounded bg-slate-900 px-2 py-1 text-xs text-white">npm run dev</code>
            para iniciar o servidor com Vite em modo middleware. O build de produção servirá o conteúdo estático de
            <code className="mx-1 rounded bg-slate-900 px-2 py-1 text-xs text-white">dist/public</code>
            via Express.
          </p>
        </section>

        <section className="grid gap-4 md:grid-cols-3">
          <InfoCard
            title="Frontend"
            description="SPA em React + Vite, com Tailwind pré-configurado. Edite client/src para criar páginas e componentes."
          />
          <InfoCard
            title="API"
            description="Endpoints Express sob /api. O endpoint /api/health retorna status para verificações rápidas."
          />
          <InfoCard
            title="Banco de dados"
            description="Schemas Drizzle em shared/schema.ts. Configure DATABASE_URL para executar migrations ou acessar o Postgres."
          />
        </section>
      </main>
    </div>
  );
}
