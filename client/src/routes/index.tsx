import { ReactElement } from "react";
import { HomePage } from "@/pages/Home";
import { LoginPage } from "@/pages/Login";
import { DashboardPrincipalPage } from "@/pages/Dashboard";
import { MedicamentosMestresPage } from "@/pages/MedicamentosMestres";
import { EstoquePage } from "@/pages/Estoque";
import { PMSPage } from "@/pages/PMS";
import { DeltaPage } from "@/pages/Delta";

export type AppRoute = {
  path: string;
  label: string;
  description: string;
  element: ReactElement;
};

export const appRoutes: AppRoute[] = [
  {
    path: "/login",
    label: "Login",
    description: "Autenticação inicial e acesso seguro à plataforma.",
    element: <LoginPage />,
  },
  {
    path: "/home",
    label: "Home",
    description: "Resumo inicial e atalhos para módulos do CAF.",
    element: <HomePage />,
  },
  {
    path: "/dashboard",
    label: "Dashboard Principal",
    description: "Indicadores operacionais e visão executiva.",
    element: <DashboardPrincipalPage />,
  },
  {
    path: "/medicamentos-mestres",
    label: "Medicamentos Mestres",
    description: "Base oficial de fármacos e apresentações.",
    element: <MedicamentosMestresPage />,
  },
  {
    path: "/estoque",
    label: "Estoque",
    description: "Entradas, saídas e curva ABC com vencimentos.",
    element: <EstoquePage />,
  },
  {
    path: "/pms",
    label: "PMS",
    description: "Cadastro, pareceres, evoluções e dispensações.",
    element: <PMSPage />,
  },
  {
    path: "/delta",
    label: "Delta Tracking",
    description: "Rastreamento de divergências e reconciliações.",
    element: <DeltaPage />,
  },
];

export const defaultRedirect = "/login";
