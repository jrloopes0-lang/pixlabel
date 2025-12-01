import { createContext, ReactNode, useContext, useMemo, useState } from "react";

export type Environment = "produção" | "homologação" | "lab";

interface SettingsContextValue {
  environment: Environment;
  locale: string;
  setEnvironment: (env: Environment) => void;
  setLocale: (locale: string) => void;
}

const SettingsContext = createContext<SettingsContextValue | undefined>(undefined);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [environment, setEnvironment] = useState<Environment>("homologação");
  const [locale, setLocale] = useState("pt-BR");

  const value = useMemo(
    () => ({
      environment,
      locale,
      setEnvironment,
      setLocale,
    }),
    [environment, locale],
  );

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
}

export function useSettings() {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error("useSettings must be used within SettingsProvider");
  return ctx;
}
