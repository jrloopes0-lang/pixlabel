import { createContext, ReactNode, useContext, useMemo, useState } from "react";

type UserProfile = {
  name: string;
  role: string;
  unit: string;
};

interface AuthContextValue {
  user: UserProfile;
  signOut: () => void;
  setUser: (profile: UserProfile) => void;
}

const defaultUser: UserProfile = {
  name: "Dra. Camila Ribeiro",
  role: "Farmacêutica Clínica",
  unit: "Hospital Central PIXELLAB",
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile>(defaultUser);

  const value = useMemo(
    () => ({
      user,
      setUser,
      signOut: () => setUser({ ...defaultUser, name: "Visitante" }),
    }),
    [user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
