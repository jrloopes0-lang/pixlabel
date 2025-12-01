import { createContext, ReactNode, useContext, useMemo, useState } from "react";

interface UIContextValue {
  sidebarCollapsed: boolean;
  toggleSidebar: () => void;
  spotlightOpen: boolean;
  setSpotlightOpen: (open: boolean) => void;
}

const UIContext = createContext<UIContextValue | undefined>(undefined);

export function UIProvider({ children }: { children: ReactNode }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [spotlightOpen, setSpotlightOpen] = useState(false);

  const value = useMemo(
    () => ({
      sidebarCollapsed,
      toggleSidebar: () => setSidebarCollapsed((prev) => !prev),
      spotlightOpen,
      setSpotlightOpen,
    }),
    [sidebarCollapsed, spotlightOpen],
  );

  return <UIContext.Provider value={value}>{children}</UIContext.Provider>;
}

export function useUI() {
  const ctx = useContext(UIContext);
  if (!ctx) throw new Error("useUI must be used within UIProvider");
  return ctx;
}
