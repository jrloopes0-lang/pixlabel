import { ReactNode, useMemo } from "react";
import { useLocation } from "react-router-dom";
import { Sidebar } from "@/components/navigation/Sidebar";
import { Topbar } from "@/components/navigation/Topbar";
import { brandPalette } from "@/design/tokens";
import { appRoutes } from "@/routes";

interface LayoutRootProps {
  pageTitle: string;
  hint?: string;
  children: ReactNode;
}

export function LayoutRoot({ pageTitle, hint, children }: LayoutRootProps) {
  const { pathname } = useLocation();

  const resolvedTitle = useMemo(() => {
    const match = appRoutes.find((route) => route.path === pathname);
    return match?.label ?? pageTitle;
  }, [pageTitle, pathname]);

  return (
    <div className="min-h-screen bg-[color:var(--background)] text-foreground flex">
      <Sidebar />
      <div className="flex-1 min-h-screen flex flex-col" style={{ background: `radial-gradient(circle at 20% 20%, ${brandPalette.techPurple}0d, transparent 35%)` }}>
        <Topbar title={resolvedTitle} hint={hint} />
        <div className="flex-1 p-6 space-y-6">{children}</div>
      </div>
    </div>
  );
}
