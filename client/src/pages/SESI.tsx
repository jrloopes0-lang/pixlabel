export function SESI() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">SESI - Pacientes Excepcionais</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Pacientes</h3>
          <p className="text-gray-600 mb-4">Gerencie pacientes com condições especiais</p>
          <a href="/sesi/pacientes" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
            Acessar
          </a>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Dispensações</h3>
          <p className="text-gray-600 mb-4">Registre dispensações de medicamentos</p>
          <a href="/sesi/dispensar" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
            Dispensar
          </a>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Estoque SESI</h3>
          <p className="text-gray-600 mb-4">Gerencie estoque de medicamentos SESI</p>
          <a href="/sesi/estoque" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
            Acessar
          </a>
        </div>
      </div>
    </div>
  );
}
