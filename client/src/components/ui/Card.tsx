import { ReactNode } from "react";

export function Card({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="bg-card text-card-foreground border border-card-border rounded-lg shadow-sm">
      <header className="px-5 py-4 border-b border-card-border flex items-center justify-between">
        <h2 className="text-title-section">{title}</h2>
      </header>
      <div className="p-5 space-y-4 text-body">{children}</div>
    </section>
  );
}
