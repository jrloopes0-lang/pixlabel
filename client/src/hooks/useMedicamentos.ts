import { useFetch } from "./useFetch";
import { fetchMedicamentosMestres, MedicamentoMestre } from "@/api";

export function useMedicamentos() {
  return useFetch<MedicamentoMestre[]>("medicamentos", fetchMedicamentosMestres);
}
