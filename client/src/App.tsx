import { Navigate, Route, Routes } from "react-router-dom";
import { LayoutRoot } from "@/components/layout/LayoutRoot";
import { HomePage } from "@/pages/Home";
import { DashboardPrincipalPage } from "@/pages/Dashboard";
import { MedicamentosMestresPage } from "@/pages/MedicamentosMestres";
import { EstoquePage } from "@/pages/Estoque";
import { PMSPage } from "@/pages/PMS";
import { DeltaPage } from "@/pages/Delta";

export default function App() {
  return (
    <LayoutRoot pageTitle="PIXELLAB CAF" hint="Estrutura visual inicial">
      <Routes>
        <Route path="/" element={<Navigate to="/home" />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/dashboard" element={<DashboardPrincipalPage />} />
        <Route path="/medicamentos-mestres" element={<MedicamentosMestresPage />} />
        <Route path="/estoque" element={<EstoquePage />} />
        <Route path="/pms" element={<PMSPage />} />
        <Route path="/delta" element={<DeltaPage />} />
      </Routes>
    </LayoutRoot>
  );
}
