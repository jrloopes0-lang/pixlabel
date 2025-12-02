import { useState } from "react";
import { SelectPatient } from "@/components/SelectPatient";
import { DispenseMedicines } from "@/components/DispenseMedicines";

interface Patient {
  id: string;
  name: string;
  cpf: string;
  dateOfBirth: string;
  phone: string;
  address: string;
  active: boolean;
}

export function SESIDispensar() {
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);

  if (!selectedPatient) {
    return (
      <div className="p-8 max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Dispensar Medicamentos SESI</h1>
          <p className="text-gray-600 mt-2">
            Sistema de dispensação com rastreamento FIFO (First In, First Out)
          </p>
        </div>

        <div className="bg-white p-8 rounded-lg border border-gray-200 shadow-sm">
          <SelectPatient onSelect={setSelectedPatient} />
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Dispensar Medicamentos SESI</h1>
        <p className="text-gray-600 mt-2">
          Sistema de dispensação com rastreamento FIFO (First In, First Out)
        </p>
      </div>

      <div className="bg-white p-8 rounded-lg border border-gray-200 shadow-sm">
        <DispenseMedicines
          patient={selectedPatient}
          onBack={() => setSelectedPatient(null)}
          onSuccess={() => {
            setSelectedPatient(null);
            // Opcional: redirecionar ou mostrar mensagem de sucesso
          }}
        />
      </div>
    </div>
  );
}
