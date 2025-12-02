import { ReactElement } from "react";
import Home from "@/pages/Home";
import Dashboard from "@/pages/Dashboard";
import MedicamentosMestres from "@/pages/MedicamentosMestres";
import Estoque from "@/pages/Estoque";
import { PMSPage } from "@/pages/PMS";
import Delta from "@/pages/Delta";

export type AppRoute = {
  path: string;
  label: string;
  description: string;
  element: ReactElement;
};

export const appRoutes: AppRoute[] = [
  {
    path: "/home",
    label: "Home",
    description: "Resumo inicial e atalhos para módulos do CAF.",
    element: <Home />,
  },
  {
    path: "/dashboard",
    label: "Dashboard Principal",
    description: "Indicadores operacionais e visão executiva.",
    element: <Dashboard />,
  },
  {
    path: "/medicamentos-mestres",
    label: "Medicamentos Mestres",
    description: "Base oficial de fármacos e apresentações.",
    element: <MedicamentosMestres />,
  },
  {
    path: "/estoque",
    label: "Estoque",
    description: "Entradas, saídas e curva ABC com vencimentos.",
    element: <Estoque />,
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
    element: <Delta />,
  },
];

export const defaultRedirect = "/home";
