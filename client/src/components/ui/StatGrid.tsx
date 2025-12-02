export interface Stat {
  label: string;
  value: string;
  tone?: "success" | "warning" | "critical" | "info";
}

const toneMap: Record<NonNullable<Stat["tone"]>, string> = {
  success: "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-100",
  warning: "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-100",
  critical: "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-100",
  info: "bg-sky-100 text-sky-800 dark:bg-sky-900/40 dark:text-sky-100",
};

export function StatGrid({ stats }: { stats: Stat[] }) {
  return (
    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="rounded-lg border border-card-border bg-card text-card-foreground px-4 py-5 shadow-sm"
        >
          <p className="text-sm text-muted-foreground">{stat.label}</p>
          <p className="text-kpi mt-3">{stat.value}</p>
          {stat.tone && (
            <span className={`text-xs px-2 py-1 rounded-full inline-flex mt-3 ${toneMap[stat.tone]}`}>
              {stat.tone === "success"
                ? "Estável"
                : stat.tone === "warning"
                  ? "Atenção"
                  : stat.tone === "critical"
                    ? "Crítico"
                    : "Informação"}
            </span>
          )}
        </div>
      ))}
    </div>
  );
}
