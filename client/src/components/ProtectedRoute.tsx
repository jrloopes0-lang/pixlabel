import { useIsAuthenticated } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import { useEffect } from "react";

// Wrapper para rotas protegidas
export function ProtectedRoute({ component: Component, requiredRole }: { component: React.ComponentType; requiredRole?: string }) {
  const { isAuthenticated, isLoading, user } = useIsAuthenticated();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      setLocation("/login");
    }
    if (requiredRole && user?.role !== requiredRole && !isLoading) {
      setLocation("/unauthorized");
    }
  }, [isAuthenticated, isLoading, user, requiredRole, setLocation]);

  if (isLoading) {
    return <div className="flex items-center justify-center h-screen">Carregando...</div>;
  }

  if (!isAuthenticated) {
    return null;
  }

  if (requiredRole && user?.role !== requiredRole) {
    return null;
  }

  return <Component />;
}
