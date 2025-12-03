import { Router, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { useIsAuthenticated } from "@/hooks/use-auth";
import Home from "@/pages/Home";
import Login from "@/pages/Login";
import { EstoqueGeral } from "@/pages/EstoqueGeral";
import { Pedidos } from "@/pages/Pedidos";
import { SESI } from "@/pages/SESI";
import { SESIPacientes } from "@/pages/sesi/Pacientes";
import { SESIDispensar } from "@/pages/sesi/Dispensar";
import { SESIEstoque } from "@/pages/sesi/Estoque";

// Protected layout wrapper
function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useIsAuthenticated();

  // Still loading
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  // Not authenticated - redirect to login
  if (!isAuthenticated) {
    return <Login />;
  }

  // Authenticated - render protected content
  return <>{children}</>;
}

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        {/* Redirect OAuth callback to login */}
        <Route path="/auth/login">
          <Login />
        </Route>

        {/* Public login route */}
        <Route path="/login">
          <Login />
        </Route>

        {/* Home route */}
        <Route path="/">
          <Home />
        </Route>

        {/* Protected routes */}
        <Route path="/estoque">
          <ProtectedLayout>
            <EstoqueGeral />
          </ProtectedLayout>
        </Route>

        <Route path="/pedidos">
          <ProtectedLayout>
            <Pedidos />
          </ProtectedLayout>
        </Route>

        <Route path="/sesi">
          <ProtectedLayout>
            <SESI />
          </ProtectedLayout>
        </Route>

        <Route path="/sesi/pacientes">
          <ProtectedLayout>
            <SESIPacientes />
          </ProtectedLayout>
        </Route>

        <Route path="/sesi/dispensar">
          <ProtectedLayout>
            <SESIDispensar />
          </ProtectedLayout>
        </Route>

        <Route path="/sesi/estoque">
          <ProtectedLayout>
            <SESIEstoque />
          </ProtectedLayout>
        </Route>

        {/* Fallback for non-existent routes */}
        <Route path="*">
          <Home />
        </Route>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
