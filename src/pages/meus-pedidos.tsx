// ===========================================
// Página de pedidos do usuário.
// Lista todos os pedidos realizados pelo usuário logado,
// buscando os dados via API do back-end.
// ===========================================

import { useState, useEffect } from 'react';
import ProtectedRoute from '@/components/layout/ProtectedRoute';
import Header from '@/components/layout/Header';
import Sidebar from '@/components/layout/Sidebar';

interface ItemPedido {
  id: string;
  quantidade: number;
  precoUnitario: number;
  subtotal: number;
  produto: {
    id: string;
    nome: string;
    descricao: string;
  };
}

interface Pedido {
  id: string;
  total: number;
  status: string;
  data: string;
  criadoEm: string;
  itens: ItemPedido[];
}

function PaginaMeusPedidos() {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  // Busca os pedidos do usuário ao carregar a página
  useEffect(() => {
    buscarPedidos();
  }, []);

  const buscarPedidos = async () => {
    try {
      setCarregando(true);
      setErro(null);

      const resposta = await fetch('/api/pedidos');

      if (!resposta.ok) {
        throw new Error('Erro ao carregar pedidos');
      }

      const dados = await resposta.json();
      setPedidos(dados);
    } catch (error) {
      console.error('Erro ao buscar pedidos:', error);
      setErro('Não foi possível carregar os pedidos');
    } finally {
      setCarregando(false);
    }
  };

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
      PENDENTE: 'bg-yellow-100 text-yellow-800',
      PROCESSANDO: 'bg-blue-100 text-blue-800',
      ENVIADO: 'bg-purple-100 text-purple-800',
      ENTREGUE: 'bg-green-100 text-green-800',
      CANCELADO: 'bg-red-100 text-red-800',
    };
    return cores[status] || 'bg-gray-100 text-gray-800';
  };

  const traduzirStatus = (status: string) => {
    const traducoes: { [key: string]: string } = {
      PENDENTE: 'Pendente',
      PROCESSANDO: 'Processando',
      ENVIADO: 'Enviado',
      ENTREGUE: 'Entregue',
      CANCELADO: 'Cancelado',
    };
    return traducoes[status] || status;
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

            {/* Exibe mensagem de erro se houver */}
            {erro && (
              <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
                <p className="text-red-700">{erro}</p>
                <button
                  onClick={buscarPedidos}
                  className="mt-2 text-sm text-red-600 hover:text-red-800 underline"
                >
                  Tentar novamente
                </button>
              </div>
            )}

            {/* Exibe loading enquanto carrega */}
            {carregando && !erro ? (
              <div className="flex justify-center items-center py-16">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                <p className="ml-4 text-gray-600">Carregando pedidos...</p>
              </div>
            ) : pedidos.length === 0 ? (
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
                {pedidos.map((pedido) => (
                  <div key={pedido.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                    <div className="bg-gray-50 px-6 py-4 border-b flex justify-between items-center">
                      <div>
                        <p className="text-sm text-gray-600">Pedido #{pedido.id.substring(0, 8)}</p>
                        <p className="text-sm text-gray-500">{formatarData(pedido.criadoEm)}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${obterCorStatus(pedido.status)}`}>
                        {traduzirStatus(pedido.status)}
                      </span>
                    </div>

                    <div className="p-6">
                      <div className="space-y-3 mb-4">
                        {pedido.itens.map((item) => (
                          <div key={item.id} className="flex justify-between text-sm">
                            <span className="text-gray-700">
                              {item.quantidade}x {item.produto.nome}
                            </span>
                            <span className="font-medium text-gray-900">
                              {formatarPreco(item.subtotal)}
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
