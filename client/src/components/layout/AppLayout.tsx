import { ReactNode } from "react";
import { NavLink } from "react-router-dom";
import { useTheme } from "@/context/ThemeContext";
import { brandPalette } from "@/design/tokens";

const navItems = [
  { to: "/home", label: "Home" },
  { to: "/dashboard", label: "Dashboard" },
  { to: "/medicamentos-mestres", label: "Medicamentos Mestres" },
  { to: "/estoque", label: "Estoque" },
  { to: "/pms", label: "PMS" },
  { to: "/delta", label: "Delta Tracking" },
];

export function AppLayout({ title, children }: { title: string; children: ReactNode }) {
  const { theme, toggle } = useTheme();

  return (
    <div className="min-h-screen bg-background text-foreground grid grid-cols-[260px_1fr]">
      <aside className="bg-[color:var(--sidebar)] text-[color:var(--sidebar-foreground)] border-r border-[color:var(--sidebar-border)] flex flex-col">
        <div className="p-6 font-semibold tracking-wide text-lg flex items-center gap-2">
          <div className="h-10 w-10 rounded-full bg-[color:var(--sidebar-primary)]" />
          <div>
            <div>PIXEL</div>
            <div className="text-[color:var(--sidebar-accent)] -mt-1">LAB</div>
          </div>
        </div>
        <nav className="flex-1 px-3 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }: { isActive: boolean }) =>
                `flex items-center gap-3 px-4 py-2 rounded-md transition-colors ${
                  isActive
                    ? "bg-[color:var(--sidebar-primary)]/20 text-[color:var(--sidebar-primary-foreground)]"
                    : "hover:bg-[color:var(--sidebar-border)]/60"
                }`
              }
            >
              <span className="text-sm font-medium">{item.label}</span>
            </NavLink>
          ))}
        </nav>
        <div className="p-4 text-xs text-[color:var(--sidebar-foreground)]/70 space-y-2">
          <p>Health &amp; Data Intelligence</p>
          <button
            onClick={toggle}
            className="w-full rounded-md bg-[color:var(--sidebar-primary)] text-[color:var(--sidebar-primary-foreground)] py-2 text-sm font-medium"
          >
            Alternar para modo {theme === "light" ? "escuro" : "claro"}
          </button>
        </div>
      </aside>
      <main className="min-h-screen bg-[color:var(--background)]">
        <header className="flex items-center justify-between p-6 border-b border-border bg-card text-card-foreground">
          <div>
            <p className="text-sm uppercase tracking-wide text-muted-foreground">PIXELLAB</p>
            <h1 className="text-2xl font-semibold" style={{ color: brandPalette.techPurple }}>
              {title}
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <div className="px-3 py-1 rounded-full text-xs bg-[color:var(--muted)] text-[color:var(--muted-foreground)]">
              Sistema operacional
            </div>
          </div>
        </header>
        <div className="p-6 space-y-6">{children}</div>
      </main>
    </div>
  );
}
