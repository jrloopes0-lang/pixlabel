import { NavLink } from "react-router-dom";
import { useUI } from "@/context/UIContext";
import { brandPalette } from "@/design/tokens";

const navItems = [
  { to: "/home", label: "Home" },
  { to: "/dashboard", label: "Dashboard Principal" },
  { to: "/medicamentos-mestres", label: "Medicamentos Mestres" },
  { to: "/estoque", label: "Estoque" },
  { to: "/pms", label: "PMS" },
  { to: "/delta", label: "Delta Tracking" },
];

export function Sidebar() {
  const { sidebarCollapsed, toggleSidebar } = useUI();

  return (
    <aside
      className={`bg-[color:var(--sidebar)] text-[color:var(--sidebar-foreground)] border-r border-[color:var(--sidebar-border)] transition-all duration-300 ${sidebarCollapsed ? "w-20" : "w-64"}`}
    >
      <div className="px-5 py-6 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full" style={{ backgroundColor: brandPalette.techPurple }} />
          {!sidebarCollapsed && (
            <div>
              <p className="font-semibold leading-tight">PIXEL</p>
              <p className="text-[color:var(--sidebar-accent)] -mt-1 text-sm font-semibold">LAB</p>
            </div>
          )}
        </div>
        <button
          onClick={toggleSidebar}
          className="text-xs rounded-full border border-[color:var(--sidebar-border)] px-3 py-1 hover:border-[color:var(--sidebar-primary)]"
        >
          {sidebarCollapsed ? "›" : "‹"}
        </button>
      </div>
      <nav className="px-3 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }: { isActive: boolean }) =>
              `flex items-center gap-3 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive
                  ? "bg-[color:var(--sidebar-primary)]/20 text-[color:var(--sidebar-primary-foreground)]"
                  : "hover:bg-[color:var(--sidebar-border)]/60"
              }`
            }
          >
            {!sidebarCollapsed && <span>{item.label}</span>}
            {sidebarCollapsed && <span className="text-lg">•</span>}
          </NavLink>
        ))}
      </nav>
      {!sidebarCollapsed && (
        <div className="p-4 text-xs text-[color:var(--sidebar-foreground)]/70 space-y-2">
          <p>Health &amp; Data Intelligence</p>
          <p className="text-[color:var(--sidebar-accent)] font-semibold">CAF Plataforma</p>
        </div>
      )}
    </aside>
  );
}
