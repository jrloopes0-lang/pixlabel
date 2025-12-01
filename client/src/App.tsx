import { Navigate, Route, Routes } from "react-router-dom";
import { LayoutRoot } from "@/components/layout/LayoutRoot";
import { appRoutes, defaultRedirect } from "@/routes";

export default function App() {
  return (
    <LayoutRoot pageTitle="PIXELLAB CAF" hint="Estrutura visual inicial">
      <Routes>
        <Route path="/" element={<Navigate to={defaultRedirect} />} />
        {appRoutes.map((route) => (
          <Route key={route.path} path={route.path} element={route.element} />
        ))}
      </Routes>
    </LayoutRoot>
  );
}
