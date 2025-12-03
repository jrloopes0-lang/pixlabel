import { useQuery } from "@tanstack/react-query";
import { apiRequest, queryKeys, extractData } from "@/lib/api";
import type { Order } from "@shared/schema";

export function Pedidos() {
  const { data: orders, isLoading } = useQuery({
    queryKey: queryKeys.orders,
    queryFn: async () => {
      const response = await apiRequest("GET", "/api/orders");
      return extractData(response) as Order[];
    },
  });

  const statusColors: Record<string, string> = {
    draft: "bg-gray-100 text-gray-800",
    generated: "bg-blue-100 text-blue-800",
    sent: "bg-yellow-100 text-yellow-800",
    authorized: "bg-purple-100 text-purple-800",
    committed: "bg-green-100 text-green-800",
    received: "bg-emerald-100 text-emerald-800",
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">Pedidos</h1>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">ID</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Status</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Horizon</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Criado em</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {isLoading ? (
              <tr>
                <td colSpan={4} className="px-6 py-4 text-center text-gray-500">
                  Carregando...
                </td>
              </tr>
            ) : orders && orders.length > 0 ? (
              orders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-900">{order.id.slice(0, 8)}</td>
                  <td className="px-6 py-4 text-sm">
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${statusColors[order.status] || "bg-gray-100"}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">{order.horizonMonths} meses</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{new Date(order.createdAt).toLocaleDateString("pt-BR")}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="px-6 py-4 text-center text-gray-500">
                  Nenhum pedido encontrado
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
