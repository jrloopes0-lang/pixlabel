import { useAuth } from "@/context/AuthContext";
import { useSettings } from "@/context/SettingsContext";
import { SearchBar } from "./SearchBar";

export function Topbar({ title, hint }: { title: string; hint?: string }) {
  const { user } = useAuth();
  const { environment } = useSettings();

  return (
    <header className="flex flex-col gap-4 border-b border-border bg-card/60 backdrop-blur-sm text-card-foreground px-6 py-4">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">PIXELLAB CAF</p>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-semibold leading-tight">{title}</h1>
            <span className="text-[11px] px-2 py-1 rounded-full border border-border text-muted-foreground">{environment}</span>
          </div>
          {hint && <p className="text-sm text-muted-foreground mt-1">{hint}</p>}
        </div>
        <div className="flex items-center gap-3 text-sm text-muted-foreground">
          <div className="hidden md:flex items-center gap-2 px-3 py-2 rounded-md bg-[color:var(--muted)]/40 border border-border">
            <div className="h-2 w-2 rounded-full bg-emerald-400" />
            <span>Operacional</span>
          </div>
          <div className="flex flex-col items-end">
            <span className="font-semibold text-card-foreground">{user.name}</span>
            <span>{user.role}</span>
          </div>
        </div>
      </div>
      <SearchBar />
    </header>
  );
}
