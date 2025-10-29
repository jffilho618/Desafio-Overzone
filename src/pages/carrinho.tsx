// ===========================================
// Página do carrinho de compras.
// Exibe itens do carrinho e permite finalizar a compra,
// criando um pedido via API e atualizando o estoque.
// ===========================================

import { useState } from 'react';
import { useRouter } from 'next/router';
import Header from '@/components/layout/Header';
import { useCarrinho } from '@/contexts/CarrinhoContext';
import { useAuth } from '@/contexts/AuthContext';

export default function PaginaCarrinho() {
  const router = useRouter();
  const { itens, valorTotal, removerDoCarrinho, atualizarQuantidade, limparCarrinho } = useCarrinho();
  const { estaAutenticado } = useAuth();
  const [processando, setProcessando] = useState(false);

  const formatarPreco = (preco: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(preco);
  };

  // Finaliza a compra criando um pedido via API
  const aoFinalizarCompra = async () => {
    if (!estaAutenticado) {
      router.push('/login?redirect=/carrinho');
      return;
    }

    if (itens.length === 0) {
      alert('Erro: O carrinho está vazio!');
      return;
    }

    const produtoInvalido = itens.find((item) => item.quantidade <= 0);
    if (produtoInvalido) {
      alert('Erro: Há produtos com quantidade inválida no carrinho!');
      return;
    }

    try {
      setProcessando(true);

      // Prepara os itens no formato esperado pela API
      const itensPedido = itens.map((item) => ({
        produtoId: item.produto.id,
        quantidade: item.quantidade,
      }));

      // Cria o pedido via API
      const resposta = await fetch('/api/pedidos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          itens: itensPedido,
        }),
      });

      const dados = await resposta.json();

      if (!resposta.ok) {
        alert(dados.error || 'Erro ao criar pedido');
        return;
      }

      // Limpa o carrinho e redireciona
      limparCarrinho();
      alert('Pedido realizado com sucesso!');
      router.push('/meus-pedidos');
    } catch (error) {
      console.error('Erro ao finalizar compra:', error);
      alert('Erro ao finalizar compra. Tente novamente.');
    } finally {
      setProcessando(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Carrinho de Compras</h1>

        {itens.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-24 w-24 text-gray-400 mx-auto mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <p className="text-xl text-gray-600 mb-4">Seu carrinho está vazio</p>
            <button
              onClick={() => router.push('/')}
              className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              Continuar Comprando
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Itens do carrinho */}
            <div className="bg-white rounded-lg shadow-md divide-y">
              {itens.map((item) => (
                <div key={item.produto.id} className="p-6 flex items-center gap-4">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{item.produto.nome}</h3>
                    <p className="text-sm text-gray-600 mt-1">{formatarPreco(item.produto.preco)}</p>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => atualizarQuantidade(item.produto.id, item.quantidade - 1)}
                      disabled={item.quantidade <= 1}
                      className="w-8 h-8 flex items-center justify-center bg-gray-200 hover:bg-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                      title={item.quantidade <= 1 ? 'Quantidade mínima: 1' : 'Diminuir quantidade'}
                    >
                      -
                    </button>
                    <span className="w-12 text-center font-medium">{item.quantidade}</span>
                    <button
                      onClick={() => {
                        if (item.quantidade >= item.produto.quantidade) {
                          alert(`Erro: Quantidade máxima disponível em estoque: ${item.produto.quantidade}`);
                          return;
                        }
                        if (item.quantidade >= 99) {
                          alert('Erro: Quantidade máxima por produto: 99');
                          return;
                        }
                        atualizarQuantidade(item.produto.id, item.quantidade + 1);
                      }}
                      disabled={item.quantidade >= item.produto.quantidade || item.quantidade >= 99}
                      className="w-8 h-8 flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed"
                      title={item.quantidade >= item.produto.quantidade ? 'Estoque insuficiente' : 'Aumentar quantidade'}
                    >
                      +
                    </button>
                  </div>

                  <div className="w-32 text-right font-semibold text-gray-900">
                    {formatarPreco(item.produto.preco * item.quantidade)}
                  </div>

                  <button
                    onClick={() => removerDoCarrinho(item.produto.id)}
                    className="text-red-600 hover:text-red-800 p-2"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>

            {/* Resumo e Finalizar */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-center mb-6">
                <span className="text-xl font-semibold text-gray-900">Total:</span>
                <span className="text-2xl font-bold text-blue-600">{formatarPreco(valorTotal)}</span>
              </div>

              <button
                onClick={aoFinalizarCompra}
                disabled={processando}
                className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 transition-colors font-medium text-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {processando ? 'Processando...' : 'Finalizar Compra'}
              </button>

              <button
                onClick={() => router.push('/')}
                className="w-full mt-3 border border-gray-300 text-gray-700 py-2 rounded-md hover:bg-gray-50 transition-colors"
              >
                Continuar Comprando
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
