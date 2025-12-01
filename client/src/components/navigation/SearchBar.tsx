import { useEffect, useMemo, useState } from "react";
import { useUI } from "@/context/UIContext";
import { appRoutes } from "@/routes";

export function SearchBar() {
  const [query, setQuery] = useState("");
  const { spotlightOpen, setSpotlightOpen } = useUI();

  const shortcuts = useMemo(() => appRoutes, []);

  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setSpotlightOpen(!spotlightOpen);
      }
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [setSpotlightOpen, spotlightOpen]);

  const filtered = shortcuts.filter((item) => item.label.toLowerCase().includes(query.toLowerCase()));

  return (
    <div className="bg-[color:var(--muted)]/30 border border-border rounded-xl px-4 py-3 shadow-sm">
      <div className="flex items-center gap-3">
        <input
          type="search"
          placeholder="Buscar módulos, pacientes ou medicamentos (Ctrl + K)"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          className="flex-1 bg-transparent outline-none text-sm placeholder:text-muted-foreground"
        />
        <span className="text-[11px] text-muted-foreground border border-border rounded-md px-2 py-1">Ctrl + K</span>
      </div>
      {spotlightOpen && (
        <div className="mt-3 grid gap-2 md:grid-cols-2">
          {filtered.map((item) => (
            <div key={item.path} className="text-sm text-muted-foreground flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[color:var(--primary)]" />
              <div className="leading-tight">
                <span className="block text-card-foreground font-semibold">{item.label}</span>
                <span className="block text-xs text-muted-foreground">{item.description}</span>
              </div>
            </div>
          ))}
          {filtered.length === 0 && <p className="text-sm text-muted-foreground">Nenhum resultado para "{query}"</p>}
        </div>
      )}
    </div>
  );
}
