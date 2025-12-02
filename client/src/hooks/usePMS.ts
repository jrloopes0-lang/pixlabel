import { useFetch } from "./useFetch";
import { fetchPMSPacientes, PMSPaciente } from "@/api";

export function usePMS() {
  return useFetch<PMSPaciente[]>("pms", fetchPMSPacientes);
}
