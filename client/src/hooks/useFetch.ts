import { useQuery, UseQueryResult } from "@tanstack/react-query";

export function useFetch<T>(key: string, fetcher: () => Promise<T>): UseQueryResult<T> {
  return useQuery({ queryKey: [key], queryFn: fetcher });
}
