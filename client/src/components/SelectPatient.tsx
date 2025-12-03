import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { apiRequest, extractData } from "@/lib/api";

interface Patient {
  id: string;
  name: string;
  cpf: string;
  dateOfBirth: string;
  phone: string;
  address: string;
  active: boolean;
}

interface Props {
  onSelect: (patient: Patient) => void;
  isLoading?: boolean;
}

export function SelectPatient({ onSelect, isLoading: isLoadingProp }: Props) {
  const [search, setSearch] = useState("");

  // Query todos pacientes
  const { data: allPatients = [], isLoading } = useQuery({
    queryKey: ["sesi-pacientes"],
    queryFn: async () => {
      const response = await apiRequest("GET", "/api/sesi/pacientes");
      return extractData(response);
    },
  });

  // Filtrar em memória (cliente-side)
  const filteredPatients = useMemo(() => {
    if (!search.trim()) return allPatients;

    const lowerSearch = search.toLowerCase();
    return allPatients.filter(
      (p: Patient) =>
        p.name.toLowerCase().includes(lowerSearch) ||
        p.cpf.includes(lowerSearch)
    );
  }, [allPatients, search]);

  const isLoading_ = isLoading || isLoadingProp;

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Etapa 1: Selecionar Paciente</h2>

      {/* Search Input */}
      <div>
        <label className="block text-sm font-medium mb-2">
          Buscar Paciente (Nome ou CPF):
        </label>
        <input
          type="text"
          placeholder="Ex: João Silva ou 123.456.789-00"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          disabled={isLoading_}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
        />
      </div>

      {/* Results */}
      <div className="space-y-2">
        {isLoading_ ? (
          <p className="text-center text-gray-500 py-8">Carregando pacientes...</p>
        ) : filteredPatients.length === 0 ? (
          <p className="text-center text-gray-500 py-8">
            {allPatients.length === 0
              ? "Nenhum paciente cadastrado"
              : "Nenhum paciente encontrado"}
          </p>
        ) : (
          <div className="max-h-96 overflow-y-auto border border-gray-200 rounded-lg">
            {filteredPatients.map((patient: Patient) => (
              <button
                key={patient.id}
                onClick={() => onSelect(patient)}
                className="w-full text-left p-4 hover:bg-blue-50 border-b border-gray-100 last:border-b-0 transition-colors"
              >
                <div className="font-medium">{patient.name}</div>
                <div className="text-sm text-gray-500">CPF: {patient.cpf}</div>
                <div className="text-sm text-gray-500">
                  {patient.phone} | {patient.address}
                </div>
                <div className="text-xs text-gray-400 mt-1">
                  {patient.active ? "✅ Ativo" : "❌ Inativo"}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="text-sm text-gray-500 text-center">
        Mostrando {filteredPatients.length} de {allPatients.length} pacientes
      </div>
    </div>
  );
}
