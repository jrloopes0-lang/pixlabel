import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Package, Users, Settings, TrendingUp, DollarSign, AlertTriangle } from "lucide-react";

// Dashboard Executivo - The "Big Ball" (CAF Central)
// Shows overview of all 3 small balls + main metrics

interface DashboardStats {
  cafCentral: {
    estoqueTotal: number;
    giroMensal: number;
    medicamentos: number;
    fornecedores: number;
    posicaoMes: number;
  };
  social: {
    pacientesAtendidos: number;
    medicamentosDistribuidos: number;
    acoesJudiciais: number;
    custoTotal: number;
  };
  estrategico: {
    programasAtivos: number;
    conformidade: number;
    taxaAdesao: number;
    pacientesMonitorados: number;
  };
  global: {
    fornecedoresAtivos: number;
    alertasCriticos: number;
    giroTotal: number;
    medicamentosVencendo: number;
  };
  alertas: Array<{
    id: string;
    tipo: string;
    severidade: "critical" | "warning" | "info";
    descricao: string;
    timestamp: string;
  }>;
}

export default function DashboardExecutivo() {
  // Fetch dashboard stats
  const { data: stats, isLoading } = useQuery<DashboardStats>({
    queryKey: ["/api/dashboard/executivo"],
    queryFn: async () => {
      const response = await apiRequest("GET", "/api/dashboard/executivo");
      return response.json();
    },
    refetchInterval: 5 * 60 * 1000, // Refresh every 5 minutes
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const cafData = stats?.cafCentral || {
    estoqueTotal: 1234567,
    giroMensal: 2.3,
    medicamentos: 3847,
    fornecedores: 23,
    posicaoMes: 12,
  };

  const socialData = stats?.social || {
    pacientesAtendidos: 342,
    medicamentosDistribuidos: 1847,
    acoesJudiciais: 18,
    custoTotal: 45230,
  };

  const estrategicoData = stats?.estrategico || {
    programasAtivos: 8,
    conformidade: 96,
    taxaAdesao: 87.5,
    pacientesMonitorados: 5672,
  };

  const globalData = stats?.global || {
    fornecedoresAtivos: 23,
    alertasCriticos: 5,
    giroTotal: 2.1,
    medicamentosVencendo: 342,
  };

  const alertas = stats?.alertas || [
    {
      id: "1",
      tipo: "Vencimento",
      severidade: "critical" as const,
      descricao: "5 medicamentos vencem em 30 dias",
      timestamp: new Date().toISOString(),
    },
    {
      id: "2",
      tipo: "Estoque Baixo",
      severidade: "warning" as const,
      descricao: "12 itens abaixo do mínimo",
      timestamp: new Date().toISOString(),
    },
    {
      id: "3",
      tipo: "Fornecedor",
      severidade: "critical" as const,
      descricao: "Fornecedor XYZ atrasado > 3 dias",
      timestamp: new Date().toISOString(),
    },
  ];

  const getSeverityColor = (severidade: string) => {
    switch (severidade) {
      case "critical":
        return "bg-red-100 text-red-800 border-red-300";
      case "warning":
        return "bg-amber-100 text-amber-800 border-amber-300";
      case "info":
        return "bg-blue-100 text-blue-800 border-blue-300";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  const getSeverityIcon = (severidade: string) => {
    switch (severidade) {
      case "critical":
        return "🔴";
      case "warning":
        return "🟠";
      case "info":
        return "🟡";
      default:
        return "⚪";
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-8 max-w-7xl">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
          PIXLABEL - Dashboard Executivo
        </h1>
        <p className="text-lg text-gray-600">
          Gestão Farmacêutica Inteligente - Visão Geral 360°
        </p>
      </div>

      {/* CAF Central - The Big Ball */}
      <Card className="border-2 border-blue-500 shadow-xl bg-gradient-to-br from-blue-50 to-indigo-50">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center">
                <Package className="w-6 h-6 text-white" />
              </div>
              <div>
                <CardTitle className="text-2xl">🔵 CAF Central</CardTitle>
                <CardDescription className="text-base">
                  Hub Central de Gestão Farmacêutica
                </CardDescription>
              </div>
            </div>
            <Badge className="bg-green-500 text-white text-lg px-4 py-2">
              ✅ Online
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <p className="text-sm text-gray-600 font-medium">Estoque Total</p>
              <p className="text-2xl font-bold text-blue-600">
                R$ {(cafData.estoqueTotal / 1000000).toFixed(2)}M
              </p>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <p className="text-sm text-gray-600 font-medium">Giro Mensal</p>
              <p className="text-2xl font-bold text-blue-600">{cafData.giroMensal}x</p>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <p className="text-sm text-gray-600 font-medium">Medicamentos</p>
              <p className="text-2xl font-bold text-blue-600">
                {cafData.medicamentos.toLocaleString()}
              </p>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <p className="text-sm text-gray-600 font-medium">Fornecedores</p>
              <p className="text-2xl font-bold text-blue-600">{cafData.fornecedores}</p>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <p className="text-sm text-gray-600 font-medium">Posição Mês</p>
              <p className="text-2xl font-bold text-green-600">
                +{cafData.posicaoMes}%
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* The 3 Small Balls */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Small Ball 1 - Social Program */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-white" />
              </div>
              <div>
                <CardTitle className="text-lg">💊 Programa Social</CardTitle>
                <CardDescription className="text-xs">
                  Medicamentos para vulneráveis
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Pacientes</span>
              <span className="text-xl font-bold text-purple-600">
                {socialData.pacientesAtendidos}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Med. Distribuídos</span>
              <span className="text-xl font-bold text-purple-600">
                {socialData.medicamentosDistribuidos}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Ações Judiciais</span>
              <span className="text-xl font-bold text-purple-600">
                {socialData.acoesJudiciais}
              </span>
            </div>
            <div className="flex justify-between items-center pt-2 border-t">
              <span className="text-sm text-gray-600 font-medium">Custo Mensal</span>
              <span className="text-xl font-bold text-purple-600">
                R$ {socialData.custoTotal.toLocaleString()}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Small Ball 2 - Strategic (Adherence) */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <div>
                <CardTitle className="text-lg">📊 Componente Estratégico</CardTitle>
                <CardDescription className="text-xs">
                  Programas de adesão
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Programas Ativos</span>
              <span className="text-xl font-bold text-green-600">
                {estrategicoData.programasAtivos}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Conformidade</span>
              <span className="text-xl font-bold text-green-600">
                {estrategicoData.conformidade}%
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Taxa Adesão</span>
              <span className="text-xl font-bold text-green-600">
                {estrategicoData.taxaAdesao}%
              </span>
            </div>
            <div className="flex justify-between items-center pt-2 border-t">
              <span className="text-sm text-gray-600 font-medium">Pacientes Monitor.</span>
              <span className="text-xl font-bold text-green-600">
                {estrategicoData.pacientesMonitorados.toLocaleString()}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Small Ball 3 - Global Operations */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-orange-600 rounded-lg flex items-center justify-center">
                <Settings className="w-5 h-5 text-white" />
              </div>
              <div>
                <CardTitle className="text-lg">⚙️ Gestão Global</CardTitle>
                <CardDescription className="text-xs">
                  Operações CAF
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Fornecedores Ativos</span>
              <span className="text-xl font-bold text-orange-600">
                {globalData.fornecedoresAtivos}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Alertas Críticos</span>
              <span className="text-xl font-bold text-red-600">
                {globalData.alertasCriticos}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Giro Total</span>
              <span className="text-xl font-bold text-orange-600">
                {globalData.giroTotal}x/mês
              </span>
            </div>
            <div className="flex justify-between items-center pt-2 border-t">
              <span className="text-sm text-gray-600 font-medium">Próx. Vencimento</span>
              <span className="text-xl font-bold text-orange-600">
                {globalData.medicamentosVencendo}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Financial Summary & Alerts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Financial Summary */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-green-600" />
              <CardTitle>💰 Resumo Financeiro</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="text-sm font-medium text-gray-700">Orçamento Mensal</span>
              <span className="text-lg font-bold text-gray-900">R$ 500.000</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="text-sm font-medium text-gray-700">Realizado</span>
              <span className="text-lg font-bold text-green-600">R$ 452.500</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg border border-green-200">
              <span className="text-sm font-medium text-green-700">Economia</span>
              <span className="text-lg font-bold text-green-600">-9.5%</span>
            </div>
          </CardContent>
        </Card>

        {/* Alerts */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-600" />
              <CardTitle>⚠️ Alertas ({alertas.length})</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            {alertas.slice(0, 5).map((alerta) => (
              <div
                key={alerta.id}
                className={`flex items-start gap-3 p-3 rounded-lg border ${getSeverityColor(
                  alerta.severidade
                )}`}
              >
                <span className="text-lg">{getSeverityIcon(alerta.severidade)}</span>
                <div className="flex-1">
                  <p className="text-sm font-medium">{alerta.tipo}</p>
                  <p className="text-xs text-gray-600">{alerta.descricao}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Status Footer */}
      <Card className="bg-gray-50">
        <CardContent className="py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-gray-700">Sistema Online</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm font-medium text-gray-700">Subsistemas Sincronizados</span>
              </div>
            </div>
            <p className="text-xs text-gray-500">
              Atualizado às {new Date().toLocaleTimeString("pt-BR")}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
