import { useQuery } from "@tanstack/react-query";
import { apiRequest, queryKeys } from "@/lib/api";
import type { AuthStatus } from "@shared/types";

export function useAuth() {
  return useQuery<AuthStatus>({
    queryKey: queryKeys.auth,
    queryFn: async () => {
      const response = await apiRequest("GET", "/api/auth/status");
      return response.data;
    },
    retry: false,
  });
}

export function useIsAuthenticated() {
  const { data: auth, isLoading } = useAuth();
  return { isAuthenticated: auth?.isAuthenticated ?? false, isLoading, user: auth?.user };
}
