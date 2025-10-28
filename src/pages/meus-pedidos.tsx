import ProtectedRoute from '@/components/layout/ProtectedRoute';
import Header from '@/components/layout/Header';
import Sidebar from '@/components/layout/Sidebar';
import { useAuth } from '@/contexts/AuthContext';
import { pedidosMockados } from '@/data/pedidos';

function PaginaMeusPedidos() {
  const { usuario } = useAuth();

  // Filtra pedidos do usuário logado
  const pedidosDoUsuario = pedidosMockados.filter((p) => p.usuarioId === usuario?.id);

  const formatarPreco = (preco: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(preco);
  };

  const formatarData = (dataISO: string) => {
    return new Date(dataISO).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const obterCorStatus = (status: string) => {
    const cores: { [key: string]: string } = {
      pendente: 'bg-yellow-100 text-yellow-800',
      processando: 'bg-blue-100 text-blue-800',
      enviado: 'bg-purple-100 text-purple-800',
      entregue: 'bg-green-100 text-green-800',
      cancelado: 'bg-red-100 text-red-800',
    };
    return cores[status] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="flex">
        <Sidebar />

        <main className="flex-1 p-8">
          <div className="max-w-6xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900">Meus Pedidos</h1>
              <p className="text-gray-600 mt-1">Acompanhe seus pedidos realizados</p>
            </div>

            {pedidosDoUsuario.length === 0 ? (
              <div className="bg-white rounded-lg shadow-md p-12 text-center">
                <p className="text-xl text-gray-600 mb-4">Você ainda não fez nenhum pedido</p>
                <a
                  href="/"
                  className="inline-block bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
                >
                  Começar a Comprar
                </a>
              </div>
            ) : (
              <div className="space-y-4">
                {pedidosDoUsuario.map((pedido) => (
                  <div key={pedido.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                    <div className="bg-gray-50 px-6 py-4 border-b flex justify-between items-center">
                      <div>
                        <p className="text-sm text-gray-600">Pedido #{pedido.id}</p>
                        <p className="text-sm text-gray-500">{formatarData(pedido.data)}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${obterCorStatus(pedido.status)}`}>
                        {pedido.status.charAt(0).toUpperCase() + pedido.status.slice(1)}
                      </span>
                    </div>

                    <div className="p-6">
                      <div className="space-y-3 mb-4">
                        {pedido.itens.map((item, idx) => (
                          <div key={idx} className="flex justify-between text-sm">
                            <span className="text-gray-700">
                              {item.quantidade}x {item.produto.nome}
                            </span>
                            <span className="font-medium text-gray-900">
                              {formatarPreco(item.produto.preco * item.quantidade)}
                            </span>
                          </div>
                        ))}
                      </div>

                      <div className="border-t pt-4 flex justify-between items-center">
                        <span className="font-semibold text-gray-900">Total:</span>
                        <span className="text-xl font-bold text-blue-600">
                          {formatarPreco(pedido.total)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

export default function PaginaMeusPedidosProtegida() {
  return (
    <ProtectedRoute>
      <PaginaMeusPedidos />
    </ProtectedRoute>
  );
}
