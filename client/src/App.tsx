import { Navigate, Route, Routes } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import { HomePage } from "@/pages/Home";
import { DashboardPage } from "@/pages/Dashboard";
import { MedicamentosMestresPage } from "@/pages/MedicamentosMestres";
import { EstoquePage } from "@/pages/Estoque";
import { PMSPage } from "@/pages/PMS";
import { DeltaPage } from "@/pages/Delta";

function LayoutWrapper({ title, children }: { title: string; children: React.ReactNode }) {
  return <AppLayout title={title}>{children}</AppLayout>;
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/home" />} />
      <Route
        path="/home"
        element={
          <LayoutWrapper title="Home">
            <HomePage />
          </LayoutWrapper>
        }
      />
      <Route
        path="/dashboard"
        element={
          <LayoutWrapper title="Dashboard">
            <DashboardPage />
          </LayoutWrapper>
        }
      />
      <Route
        path="/medicamentos-mestres"
        element={
          <LayoutWrapper title="Medicamentos Mestres">
            <MedicamentosMestresPage />
          </LayoutWrapper>
        }
      />
      <Route
        path="/estoque"
        element={
          <LayoutWrapper title="Estoque">
            <EstoquePage />
          </LayoutWrapper>
        }
      />
      <Route
        path="/pms"
        element={
          <LayoutWrapper title="PMS">
            <PMSPage />
          </LayoutWrapper>
        }
      />
      <Route
        path="/delta"
        element={
          <LayoutWrapper title="Delta Tracking">
            <DeltaPage />
          </LayoutWrapper>
        }
      />
    </Routes>
  );
}
