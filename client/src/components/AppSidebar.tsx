import { useIsAuthenticated } from "@/hooks/use-auth";
import { Link, useLocation } from "wouter";

export function AppSidebar() {
  const { isAuthenticated, user } = useIsAuthenticated();
  const [location] = useLocation();

  if (!isAuthenticated) return null;

  const menuItems = [
    { label: "Dashboard", href: "/", icon: "📊" },
    { label: "Estoque Geral", href: "/estoque", icon: "📦" },
    { label: "Pedidos", href: "/pedidos", icon: "📋" },
    ...(user?.role === "admin" ? [
      { label: "Admin", href: "/admin", icon: "⚙️" },
    ] : []),
    { label: "SESI", href: "/sesi", icon: "🏥" },
  ];

  return (
    <aside className="w-64 bg-gray-900 text-white h-full shadow-lg">
      <div className="p-4 border-b border-gray-700">
        <h2 className="text-lg font-bold">Menu</h2>
      </div>

      <nav className="p-4 space-y-2">
        {menuItems.map((item) => (
          <Link key={item.href} href={item.href}>
            <a
              className={`block px-4 py-2 rounded transition ${
                location === item.href
                  ? "bg-blue-600 text-white"
                  : "hover:bg-gray-800 text-gray-300"
              }`}
            >
              <span className="mr-2">{item.icon}</span>
              {item.label}
            </a>
          </Link>
        ))}
      </nav>
    </aside>
  );
}
