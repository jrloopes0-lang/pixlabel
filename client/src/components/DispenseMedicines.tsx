import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/api";

interface Medication {
  id: string;
  name: string;
  code: string;
  sesiQuantity: number;
}

interface MedicationDispense {
  medicationId: string;
  quantity: number;
  batchNumber: string;
}

interface Patient {
  id: string;
  name: string;
  cpf: string;
}

interface Props {
  patient: Patient;
  onSuccess?: () => void;
  onBack?: () => void;
}

export function DispenseMedicines({ patient, onSuccess, onBack }: Props) {
  const [medicines, setMedicines] = useState<MedicationDispense[]>([
    { medicationId: "", quantity: 0, batchNumber: "" },
  ]);

  // Query medicamentos disponíveis no SESI
  const { data: availableMeds = [], isLoading: isLoadingMeds } = useQuery({
    queryKey: ["sesi-medicamentos"],
    queryFn: () => apiRequest("GET", "/api/sesi/medicamentos"),
  });

  // Mutation para dispensar
  const mutation = useMutation({
    mutationFn: () =>
      apiRequest("POST", "/api/sesi/dispensacoes", {
        patientId: patient.id,
        medicamentos: medicines.filter(
          (m) => m.medicationId && m.quantity > 0
        ),
      }),
    onSuccess: () => {
      alert("✅ Dispensação realizada com sucesso!");
      setMedicines([{ medicationId: "", quantity: 0, batchNumber: "" }]);
      onSuccess?.();
    },
    onError: (err: any) => {
      alert(`❌ Erro: ${err.message}`);
    },
  });

  const handleAddMedicine = () => {
    setMedicines([
      ...medicines,
      { medicationId: "", quantity: 0, batchNumber: "" },
    ]);
  };

  const handleRemoveMedicine = (index: number) => {
    setMedicines(medicines.filter((_, i) => i !== index));
  };

  const handleMedicineChange = (
    index: number,
    field: keyof MedicationDispense,
    value: string | number
  ) => {
    const newMeds = [...medicines];
    if (field === "quantity") {
      newMeds[index][field] = Math.max(0, Number(value));
    } else {
      newMeds[index][field] = String(value);
    }
    setMedicines(newMeds);
  };

  const isFormValid = medicines.some(
    (m) => m.medicationId && m.quantity > 0
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold mb-2">Etapa 2: Dispensar Medicamentos</h2>
        <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
          <p>
            <strong>Paciente:</strong> {patient.name}
          </p>
          <p className="text-sm text-gray-600">CPF: {patient.cpf}</p>
        </div>
      </div>

      {/* Medicines List */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="font-semibold">Medicamentos</h3>
          <button
            onClick={handleAddMedicine}
            className="px-3 py-1 text-sm bg-green-500 hover:bg-green-600 text-white rounded-lg transition"
          >
            + Adicionar
          </button>
        </div>

        {medicines.map((med, idx) => (
          <div
            key={idx}
            className="p-4 border border-gray-200 rounded-lg space-y-3"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Medication Select */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Medicamento:
                </label>
                <select
                  value={med.medicationId}
                  onChange={(e) =>
                    handleMedicineChange(idx, "medicationId", e.target.value)
                  }
                  disabled={isLoadingMeds || mutation.isPending}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                >
                  <option value="">Selecione...</option>
                  {availableMeds.map((m: Medication) => (
                    <option key={m.id} value={m.id}>
                      {m.name} ({m.code}) - Disp: {m.sesiQuantity}
                    </option>
                  ))}
                </select>
              </div>

              {/* Quantity */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Quantidade:
                </label>
                <input
                  type="number"
                  min="0"
                  value={med.quantity || ""}
                  onChange={(e) =>
                    handleMedicineChange(idx, "quantity", e.target.value)
                  }
                  disabled={mutation.isPending}
                  placeholder="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                />
              </div>

              {/* Batch Number */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Lote (opcional):
                </label>
                <input
                  type="text"
                  value={med.batchNumber}
                  onChange={(e) =>
                    handleMedicineChange(idx, "batchNumber", e.target.value)
                  }
                  disabled={mutation.isPending}
                  placeholder="Ex: LOTE-2025-001"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                />
              </div>
            </div>

            {/* Remove Button */}
            {medicines.length > 1 && (
              <button
                onClick={() => handleRemoveMedicine(idx)}
                disabled={mutation.isPending}
                className="w-full px-3 py-1 text-sm bg-red-100 hover:bg-red-200 text-red-700 rounded-lg transition disabled:bg-gray-100 disabled:text-gray-400"
              >
                Remover
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 justify-end pt-6 border-t">
        <button
          onClick={onBack}
          disabled={mutation.isPending}
          className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition disabled:bg-gray-100"
        >
          ← Voltar
        </button>
        <button
          onClick={() => mutation.mutate()}
          disabled={!isFormValid || mutation.isPending}
          className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition disabled:bg-gray-400 cursor-pointer"
        >
          {mutation.isPending ? "Processando..." : "✓ Dispensar"}
        </button>
      </div>

      {/* Error Display */}
      {mutation.isError && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {(mutation.error as any)?.message || "Erro ao dispensar medicamentos"}
        </div>
      )}
    </div>
  );
}
