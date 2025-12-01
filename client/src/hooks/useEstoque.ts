import { useFetch } from "./useFetch";
import { EstoqueItem, fetchEstoqueResumo } from "@/api";

export function useEstoque() {
  return useFetch<EstoqueItem[]>("estoque", fetchEstoqueResumo);
}
