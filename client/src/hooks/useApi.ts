import axios from "axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL ?? "/api";

export const api = axios.create({
  baseURL: apiBaseUrl,
  headers: { "Content-Type": "application/json" },
});

export function useCollection<T>(path: string) {
  return useQuery({ queryKey: [path], queryFn: async () => (await api.get<T[]>(path)).data });
}

export function useEntity<T>(path: string, id?: string) {
  return useQuery({
    queryKey: [path, id],
    queryFn: async () => (await api.get<T>(`${path}/${id}`)).data,
    enabled: Boolean(id),
  });
}

export function useCrudMutation<T extends object>(path: string, shape: z.AnyZodObject) {
  const queryClient = useQueryClient();

  const create = useMutation({
    mutationFn: async (payload: T) => (await api.post<T>(path, shape.parse(payload as any))).data,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [path] }),
  });

  const update = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<T> }) =>
      (await api.put<T>(`${path}/${id}`, shape.partial().parse(data as any))).data,
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: [path] });
      queryClient.invalidateQueries({ queryKey: [path, id] });
    },
  });

  const remove = useMutation({
    mutationFn: async (id: string) => (await api.delete(`${path}/${id}`)).data,
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: [path] });
      queryClient.invalidateQueries({ queryKey: [path, id] });
    },
  });

  return { create, update, remove };
}
