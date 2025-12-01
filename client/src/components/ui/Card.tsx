import { ReactNode } from "react";

interface CardProps {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
  children: ReactNode;
}

export function Card({ title, subtitle, actions, children }: CardProps) {
  return (
    <section className="bg-card text-card-foreground border border-card-border rounded-xl shadow-sm">
      <header className="px-5 py-4 border-b border-card-border flex items-center justify-between gap-4">
        <div>
          <h2 className="text-title-section">{title}</h2>
          {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
        </div>
        {actions && <div className="flex items-center gap-2">{actions}</div>}
      </header>
      <div className="p-5 space-y-4 text-body">{children}</div>
    </section>
  );
}
