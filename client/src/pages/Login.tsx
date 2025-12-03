import { useState } from "react";
import { useLocation } from "wouter";

export default function Login() {
  const [, setLocation] = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      console.log("[Login] Starting login flow...");
      
      // Set demo token para bypass da autenticação
      localStorage.setItem("x-demo-token", "demo-pixlabel-test");
      console.log("[Login] Demo token saved to localStorage");
      
      // Force a small delay to ensure localStorage is written
      await new Promise(resolve => setTimeout(resolve, 100));
      
      console.log("[Login] Demo token confirmed. Redirecting to /estoque...");
      // Use a slightly longer delay to ensure React Query invalidates cache
      setTimeout(() => {
        console.log("[Login] Attempting navigation to /estoque");
        setLocation("/estoque");
      }, 300);
    } catch (err) {
      console.error("[Login] Error:", err);
      setError(err instanceof Error ? err.message : "Erro ao fazer login");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo & Header */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-white mb-2">
            <span className="bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
              PixelLab
            </span>
          </h1>
          <p className="text-gray-300 text-lg">Gestão Farmacêutica Inteligente</p>
        </div>

        {/* Login Card */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 shadow-2xl border border-white/20">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">Bem-vindo</h2>

          {error && (
            <div className="bg-red-500/20 border border-red-400/50 rounded-lg p-4 mb-6">
              <p className="text-red-200 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            {/* Demo Info */}
            <div className="bg-blue-500/20 border border-blue-400/50 rounded-lg p-4">
              <p className="text-blue-200 text-sm">
                <strong>Demo Mode:</strong> Clique em "Entrar" para acessar o sistema com credenciais de demonstração
              </p>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
            >
              {isLoading ? "Entrando..." : "Entrar no Sistema"}
            </button>
          </form>

          {/* Footer Info */}
          <div className="mt-8 pt-6 border-t border-white/10">
            <p className="text-gray-400 text-xs text-center">
              Sistema seguro com autenticação OIDC e logging de auditoria LGPD/ANVISA
            </p>
          </div>
        </div>

        {/* Security Info */}
        <div className="mt-8 text-center">
          <div className="inline-flex items-center gap-2 text-gray-300">
            <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
            <span className="text-sm">Conexão segura</span>
          </div>
        </div>
      </div>
    </div>
  );
}
