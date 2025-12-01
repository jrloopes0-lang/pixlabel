import { ReactNode } from "react";
import { LayoutRoot } from "./LayoutRoot";

export function AppLayout({ title, children }: { title: string; children: ReactNode }) {
  return <LayoutRoot pageTitle={title}>{children}</LayoutRoot>;
}
