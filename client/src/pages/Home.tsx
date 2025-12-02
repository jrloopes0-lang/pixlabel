export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="text-center max-w-2xl px-4">
        <h1 className="text-5xl font-bold text-gray-900 mb-4">PIXLABEL</h1>
        <p className="text-xl text-gray-600 mb-8">Sistema de Gestão Farmacêutica para Saúde Pública</p>
        
        <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Bem-vindo ao Sistema</h2>
          <p className="text-gray-600 mb-6">
            Gerencie estoque de medicamentos, pedidos e dispensações SESI de forma integrada.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="p-4 border rounded">
              <h3 className="font-semibold text-gray-800">Estoque</h3>
              <p className="text-sm text-gray-600">Gestão completa</p>
            </div>
            <div className="p-4 border rounded">
              <h3 className="font-semibold text-gray-800">SESI</h3>
              <p className="text-sm text-gray-600">Pacientes excepcionais</p>
            </div>
            <div className="p-4 border rounded">
              <h3 className="font-semibold text-gray-800">Pedidos</h3>
              <p className="text-sm text-gray-600">Tracking completo</p>
            </div>
          </div>
          
          <a
            href="/login"
            className="inline-block px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium text-lg"
          >
            Entrar no Sistema
          </a>
        </div>
        
        <p className="text-sm text-gray-500">
          Sistema desenvolvido para Campo Alegre - CE
        </p>
      </div>
    </div>
  );
}
