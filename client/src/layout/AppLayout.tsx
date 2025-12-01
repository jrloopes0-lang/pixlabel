import { Link } from "wouter";
import { NavLink } from "../components/NavLink";

const navItems = [
  { path: "/", label: "Home" },
  { path: "/dashboard", label: "Dashboard" },
  { path: "/medicamentos-mestres", label: "Medicamentos Mestres" },
  { path: "/estoque", label: "Estoque" },
  { path: "/pms", label: "PMS" },
  { path: "/delta", label: "Delta Tracking" },
];

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50 text-foreground">
      <header className="sticky top-0 z-20 border-b border-border/60 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <Link href="/">
              <a className="flex items-center gap-2">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-lg font-bold text-primary">
                  PX
                </span>
                <div>
                  <p className="text-xs font-semibold text-muted-foreground">PIXELLAB</p>
                  <p className="text-sm font-semibold leading-tight text-foreground">
                    Health &amp; Data Intelligence
                  </p>
                </div>
              </a>
            </Link>
          </div>
          <nav className="hidden items-center gap-4 text-sm font-medium text-muted-foreground md:flex">
            <a
              className="rounded-md border border-border px-3 py-2 transition hover:-translate-y-0.5 hover:text-primary hover:shadow-sm"
              href="/api/health"
              target="_blank"
              rel="noreferrer"
            >
              /api/health
            </a>
            <a
              className="rounded-md border border-border px-3 py-2 transition hover:-translate-y-0.5 hover:text-primary hover:shadow-sm"
              href="/api/summary"
              target="_blank"
              rel="noreferrer"
            >
              /api/summary
            </a>
          </nav>
        </div>
      </header>

      <div className="mx-auto flex max-w-6xl gap-6 px-6 py-8 lg:py-10">
        <aside className="hidden w-64 shrink-0 flex-col gap-2 self-start rounded-xl border border-border/70 bg-white p-4 shadow-sm lg:flex">
          <p className="pb-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Módulos</p>
          <div className="flex flex-col gap-1">
            {navItems.map((item) => (
              <NavLink key={item.path} href={item.path} label={item.label} />
            ))}
          </div>
          <div className="mt-4 rounded-lg bg-slate-50 p-3 text-xs text-muted-foreground">
            <p className="font-semibold text-foreground">Dicas rápidas</p>
            <ul className="mt-2 space-y-1 list-disc list-inside">
              <li>HMR ativo via Vite (porta 5173)</li>
              <li>Backend Express em 3000</li>
              <li>Schema Drizzle em shared/schema.ts</li>
            </ul>
          </div>
        </aside>

        <main className="flex-1">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.15em] text-primary">Pixlabel CAF</p>
              <h1 className="text-2xl font-bold text-foreground">Gestão farmacêutica integrada</h1>
              <p className="text-sm text-muted-foreground">
                Front-end React + API Express + Drizzle ORM — prontos para expansão.
              </p>
            </div>
            <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
              <span className="rounded-full bg-emerald-50 px-3 py-1 text-emerald-700">SPA React</span>
              <span className="rounded-full bg-blue-50 px-3 py-1 text-blue-700">API Express</span>
              <span className="rounded-full bg-purple-50 px-3 py-1 text-purple-700">Drizzle ORM</span>
            </div>
          </div>
          <div className="space-y-6">{children}</div>
        </main>
      </div>
    </div>
  );
}
