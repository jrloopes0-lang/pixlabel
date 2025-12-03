import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';

// Mock data for MVP
const mockData = {
  caf: {
    estoque_total: "R$ 1.234.567",
    posicao_mes: "+12%",
    giro_mensal: "2.3x"
  },
  programa_social: {
    pacientes: 342,
    acoes_judiciais: 18,
    medicamentos_distribuidos: 1847,
    alertas: 2
  },
  componente_estrategico: {
    programas_ativos: 8,
    conformidade: "96%",
    taxa_adesao: "87%",
    alertas: 1
  },
  gestao_global: {
    fornecedores: 23,
    alertas: 5,
    giro_total: "2.1x"
  },
  consumo_semanal: [
    { nome: "Dipirona 500mg", unidades: 1243 },
    { nome: "Amoxicilina 500mg", unidades: 987 },
    { nome: "Metformina 850mg", unidades: 654 },
    { nome: "Losartana 50mg", unidades: 543 },
    { nome: "Omeprazol 20mg", unidades: 432 }
  ],
  alertas_criticos: [
    { tipo: "critical", mensagem: "Insulina NPH vence em 30 dias", medicamento: "Insulina NPH 100UI" },
    { tipo: "warning", mensagem: "Amoxicilina estoque baixo", medicamento: "Amoxicilina 500mg" },
    { tipo: "info", mensagem: "Fornecedor Medic+ atrasado 2 dias", medicamento: "Diversos" }
  ],
  financeiro: {
    gasto_mes: "R$ 45.230",
    orcamento: "R$ 50.000",
    margem: "9.5%"
  }
};

interface SphereProps {
  title: string;
  color: string;
  metrics: Array<{ label: string; value: string | number }>;
  alerts?: number;
  onClick: () => void;
}

function Sphere({ title, color, metrics, alerts, onClick }: SphereProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="relative">
      <div
        className={`
          relative w-32 h-32 md:w-40 md:h-40 rounded-full cursor-pointer
          transform transition-all duration-500 ease-out
          ${isHovered ? 'scale-110 shadow-2xl' : 'scale-100 shadow-lg'}
          animate-breathing
        `}
        style={{
          background: `linear-gradient(135deg, ${color}dd, ${color})`,
          boxShadow: isHovered ? `0 20px 60px ${color}80` : `0 10px 30px ${color}40`
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={onClick}
      >
        {/* Alert badge */}
        {alerts && alerts > 0 && (
          <div className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center text-sm font-bold shadow-lg animate-pulse">
            {alerts}
          </div>
        )}

        {/* Sphere inner content */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-white text-center px-4">
            <div className="text-xs md:text-sm font-semibold mb-1 opacity-90">{title}</div>
          </div>
        </div>

        {/* Hover overlay with metrics */}
        {isHovered && (
          <div 
            className="absolute inset-0 rounded-full flex items-center justify-center"
            style={{ background: `${color}f0` }}
          >
            <div className="text-white text-center px-3 space-y-0.5">
              {metrics.slice(0, 2).map((metric, idx) => (
                <div key={idx} className="text-xs">
                  <span className="font-semibold">{metric.value}</span>
                  <div className="text-[10px] opacity-90">{metric.label}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Label below sphere */}
      <div className="text-center mt-3 text-sm font-medium text-gray-700">
        {title}
      </div>
    </div>
  );
}

export default function HomeCommandCenter() {
  const [, setLocation] = useLocation();
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/40">
      {/* ZONA 1: HEADER EXECUTIVO */}
      <header className="bg-[#0E1226] text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-[#3EC6FF] to-[#6B40FF] rounded-lg flex items-center justify-center">
              <span className="text-xl font-bold">🔬</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold">
                <span className="text-white">PIXEL</span>
                <span className="text-[#6B40FF]">LAB</span>
              </h1>
              <p className="text-xs text-gray-400">Health & Data Intelligence</p>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="text-right hidden md:block">
              <div className="text-sm font-medium">{formatDate(currentTime)}</div>
              <div className="text-xl font-mono font-bold text-[#3EC6FF]">{formatTime(currentTime)}</div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-[#6B40FF] rounded-full flex items-center justify-center text-sm font-bold">
                NS
              </div>
              <div className="hidden md:block">
                <div className="text-sm font-medium">Nilson Soares</div>
                <div className="text-xs text-gray-400">Farmacêutico</div>
              </div>
            </div>
            <button className="p-2 hover:bg-white/10 rounded-lg transition">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* ZONA 2: ESFERA CENTRAL + 3 PEQUENAS ESFERAS */}
      <section className="py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Command Center Farmacêutico</h2>
            <p className="text-gray-600">Sistema integrado de gestão - São Bento do Sul, SC</p>
          </div>

          <div className="flex flex-col items-center gap-12">
            {/* CAF Central Sphere - Larger */}
            <div className="relative">
              <div
                className="relative w-48 h-48 md:w-56 md:h-56 rounded-full cursor-pointer
                  transform transition-all duration-500 ease-out hover:scale-105
                  animate-breathing shadow-2xl"
                style={{
                  background: 'linear-gradient(135deg, #0052CCdd, #0052CC)',
                  boxShadow: '0 20px 60px #0052CC60'
                }}
                onClick={() => setLocation('/estoque')}
              >
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-white text-center px-6">
                    <div className="text-2xl font-bold mb-2">CAF</div>
                    <div className="text-xs opacity-90">Central de</div>
                    <div className="text-xs opacity-90">Abastecimento</div>
                    <div className="text-xs opacity-90">Farmacêutico</div>
                  </div>
                </div>
              </div>
              
              {/* Metrics below central sphere */}
              <div className="mt-6 grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-[#0052CC]">{mockData.caf.estoque_total}</div>
                  <div className="text-xs text-gray-600">Estoque Total</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-600">{mockData.caf.posicao_mes}</div>
                  <div className="text-xs text-gray-600">Posição Mês</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-[#0052CC]">{mockData.caf.giro_mensal}</div>
                  <div className="text-xs text-gray-600">Giro/Mês</div>
                </div>
              </div>
            </div>

            {/* 3 Small Spheres */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-16">
              <Sphere
                title="Programa Social"
                color="#2EA43F"
                alerts={mockData.programa_social.alertas}
                metrics={[
                  { label: "Pacientes", value: mockData.programa_social.pacientes },
                  { label: "Ações Judiciais", value: mockData.programa_social.acoes_judiciais },
                  { label: "Medicamentos", value: mockData.programa_social.medicamentos_distribuidos }
                ]}
                onClick={() => setLocation('/sesi')}
              />

              <Sphere
                title="Componente Estratégico"
                color="#FF6E40"
                alerts={mockData.componente_estrategico.alertas}
                metrics={[
                  { label: "Programas", value: mockData.componente_estrategico.programas_ativos },
                  { label: "Conformidade", value: mockData.componente_estrategico.conformidade },
                  { label: "Taxa Adesão", value: mockData.componente_estrategico.taxa_adesao }
                ]}
                onClick={() => setLocation('/estoque')}
              />

              <Sphere
                title="Gestão Global"
                color="#7C3AED"
                alerts={mockData.gestao_global.alertas}
                metrics={[
                  { label: "Fornecedores", value: mockData.gestao_global.fornecedores },
                  { label: "Alertas", value: mockData.gestao_global.alertas },
                  { label: "Giro Total", value: mockData.gestao_global.giro_total }
                ]}
                onClick={() => setLocation('/pedidos')}
              />
            </div>
          </div>
        </div>
      </section>

      {/* ZONA 3: DASHBOARD INTERATIVO */}
      <section className="py-8 px-6 bg-white/50">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Card 1: Consumo Semanal */}
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-gray-900">Consumo Semanal</h3>
              </div>
              <div className="space-y-2">
                {mockData.consumo_semanal.slice(0, 3).map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center text-sm">
                    <span className="text-gray-600 truncate flex-1">{idx + 1}. {item.nome}</span>
                    <span className="font-semibold text-gray-900 ml-2">{item.unidades}</span>
                  </div>
                ))}
              </div>
              <button className="mt-4 text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1">
                Ver mais
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>

            {/* Card 2: Alertas Críticos */}
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-gray-900">Status do Estoque</h3>
              </div>
              <div className="space-y-2">
                {mockData.alertas_criticos.map((alerta, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-xs">
                    <span className={`
                      w-2 h-2 rounded-full mt-1 flex-shrink-0
                      ${alerta.tipo === 'critical' ? 'bg-red-500' : ''}
                      ${alerta.tipo === 'warning' ? 'bg-amber-500' : ''}
                      ${alerta.tipo === 'info' ? 'bg-blue-500' : ''}
                    `} />
                    <span className="text-gray-700">{alerta.mensagem}</span>
                  </div>
                ))}
              </div>
              <button className="mt-4 text-sm text-red-600 hover:text-red-700 font-medium flex items-center gap-1">
                Resolver agora
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>

            {/* Card 3: Financeiro */}
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-gray-900">Financeiro</h3>
              </div>
              <div className="space-y-3">
                <div>
                  <div className="text-xs text-gray-600 mb-1">Gasto Mês</div>
                  <div className="text-xl font-bold text-gray-900">{mockData.financeiro.gasto_mes}</div>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-600">Orçamento:</span>
                  <span className="font-semibold">{mockData.financeiro.orcamento}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-600">Margem:</span>
                  <span className="font-semibold text-green-600">{mockData.financeiro.margem}</span>
                </div>
              </div>
              <button className="mt-4 text-sm text-green-600 hover:text-green-700 font-medium flex items-center gap-1">
                Detalhes
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>

            {/* Card 4: Conectividade */}
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-gray-900">Subsistemas</h3>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    <span className="text-sm text-gray-700">Social</span>
                  </div>
                  <span className="text-xs text-gray-500">342 pacientes</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    <span className="text-sm text-gray-700">Estratégico</span>
                  </div>
                  <span className="text-xs text-gray-500">96% conf.</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    <span className="text-sm text-gray-700">Global</span>
                  </div>
                  <span className="text-xs text-gray-500">23 fornec.</span>
                </div>
              </div>
              <div className="mt-4 text-xs text-gray-500 text-center">
                Todos os sistemas operacionais ✓
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ZONA 4: FOOTER INTELIGENTE */}
      <footer className="bg-gray-900 text-white py-6 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-sm text-gray-400">
              Última atualização: <span className="text-white font-medium">agora</span>
              <span className="mx-2">•</span>
              Próxima sincronização: <span className="text-white font-medium">15:00</span>
            </div>
            <div className="flex gap-3">
              <button className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm font-medium transition">
                Importar CSV
              </button>
              <button className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm font-medium transition">
                Gerar Relatório
              </button>
              <button className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm font-medium transition">
                Suporte
              </button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
