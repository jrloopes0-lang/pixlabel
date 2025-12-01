import "./index.css";
import { Route, Switch } from "wouter";
import AppLayout from "./layout/AppLayout";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import MedicamentosMestres from "./pages/MedicamentosMestres";
import Estoque from "./pages/Estoque";
import Pms from "./pages/Pms";
import DeltaTracking from "./pages/DeltaTracking";

function NotFound() {
  return (
    <div className="rounded-xl border border-border/80 bg-white p-6 text-sm text-muted-foreground">
      Página não encontrada. Verifique a rota ou volte para a Home.
    </div>
  );
}

export default function App() {
  return (
    <AppLayout>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/dashboard" component={Dashboard} />
        <Route path="/medicamentos-mestres" component={MedicamentosMestres} />
        <Route path="/estoque" component={Estoque} />
        <Route path="/pms" component={Pms} />
        <Route path="/delta" component={DeltaTracking} />
        <Route component={NotFound} />
      </Switch>
    </AppLayout>
  );
}
