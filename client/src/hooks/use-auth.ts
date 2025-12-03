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
      console.log("[useAuth] Demo token found:", !!demoToken);
      
      // Se tiver token de demo, considere autenticado sem chamar API
      if (demoToken === "demo-pixlabel-test") {
        console.log("[useAuth] Using demo token - returning hardcoded auth status");
        return {
          isAuthenticated: true,
          user: {
            id: "demo-user",
            email: "demo@pixlabel.local",
            firstName: "Demo",
            lastName: "User",
            role: "admin",
          },
        };
      }
      
      const headers: Record<string, string> = {};
      if (demoToken) {
        headers["x-demo-token"] = demoToken;
      }
      
      try {
        console.log("[useAuth] Calling /api/auth/status...");
        const response = await fetch("/api/auth/status", {
          credentials: "include",
          headers,
        });
        
        console.log("[useAuth] Response status:", response.status);
        
        if (!response.ok) {
          console.warn("[useAuth] Auth check failed:", response.statusText);
          throw new Error(`Auth status check failed: ${response.statusText}`);
        }
        
        const json = await response.json();
        console.log("[useAuth] Auth data received:", json.data);
        return json.data;
      } catch (error) {
        console.error("[useAuth] Error:", error);
        throw error;
      }
    },
    retry: 1,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useIsAuthenticated() {
  const { data: auth, isLoading, isError } = useAuth();
  
  console.log("[useIsAuthenticated]", { isLoading, isError, hasData: !!auth });
  
  // Se houver erro na auth, considere como não autenticado (não carregando)
  if (isError) {
    console.warn("[useIsAuthenticated] Auth error - returning not authenticated");
    return { isAuthenticated: false, isLoading: false, user: undefined };
  }
  
  return { isAuthenticated: auth?.isAuthenticated ?? false, isLoading, user: auth?.user };
}
