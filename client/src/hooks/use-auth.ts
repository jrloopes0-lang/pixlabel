import { useQuery } from "@tanstack/react-query";
import { apiRequest, queryKeys } from "@/lib/api";
import type { AuthStatus } from "@shared/types";

// Get demo token from localStorage if available
function getDemoToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("x-demo-token");
}

export function useAuth() {
  return useQuery<AuthStatus>({
    queryKey: queryKeys.auth,
    queryFn: async () => {
      const demoToken = getDemoToken();
      const headers: Record<string, string> = {};
      if (demoToken) {
        headers["x-demo-token"] = demoToken;
      }
      
      const response = await fetch("/api/auth/status", {
        credentials: "include",
        headers,
      });
      
      if (!response.ok) {
        throw new Error(`Auth status check failed: ${response.statusText}`);
      }
      
      const json = await response.json();
      return json.data;
    },
    retry: 1,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useIsAuthenticated() {
  const { data: auth, isLoading, isError } = useAuth();
  
  // Se houver erro na auth, considere como não autenticado (não carregando)
  if (isError) {
    return { isAuthenticated: false, isLoading: false, user: undefined };
  }
  
  return { isAuthenticated: auth?.isAuthenticated ?? false, isLoading, user: auth?.user };
}
