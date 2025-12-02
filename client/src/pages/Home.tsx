import { useIsAuthenticated } from "@/hooks/use-auth";
import { Link } from "wouter";

export default function Home() {
  const { isAuthenticated, user } = useIsAuthenticated();

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">PIXLABEL</h1>
          <p className="text-xl text-gray-600 mb-8">Sistema de Gestão Farmacêutica para Saúde Pública</p>
          <a
            href="/auth/login"
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
          >
            Entrar
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-900">Estoque Geral</h3>
          <p className="text-gray-600 mt-2">Gerencie medicamentos e pedidos</p>
          <Link href="/estoque">
            <a className="mt-4 inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
              Acessar
            </a>
          </Link>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-900">SESI</h3>
          <p className="text-gray-600 mt-2">Pacientes e dispensações excepcionais</p>
          <Link href="/sesi">
            <a className="mt-4 inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
              Acessar
            </a>
          </Link>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-900">Pedidos</h3>
          <p className="text-gray-600 mt-2">Acompanhe status de pedidos</p>
          <Link href="/pedidos">
            <a className="mt-4 inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
              Acessar
            </a>
          </Link>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Bem-vindo, {user?.firstName}!</h2>
        <p className="text-gray-600">Você está logado como: <strong>{user?.role}</strong></p>
      </div>
    </div>
  );
}
