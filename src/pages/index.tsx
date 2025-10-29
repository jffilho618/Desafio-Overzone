import { useState, useEffect } from 'react';
import Header from '@/components/layout/Header';
import CardProduto from '@/components/produtos/CardProduto';
import { Produto } from '@/types/product';

export default function PaginaInicial() {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    const buscarProdutos = async () => {
      try {
        setCarregando(true);
        setErro(null);

        const resposta = await fetch('/api/produtos');

        if (!resposta.ok) {
          throw new Error('Erro ao carregar produtos');
        }

        const dados = await resposta.json();
        setProdutos(dados);
      } catch (error) {
        console.error('Erro ao buscar produtos:', error);
        setErro('Não foi possível carregar os produtos. Tente novamente mais tarde.');
      } finally {
        setCarregando(false);
      }
    };

    buscarProdutos();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <section className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Bem-vindo à Overzone
          </h1>
          <p className="text-xl md:text-2xl text-blue-100 mb-8">
            Os melhores produtos de tecnologia você encontra aqui
          </p>
          <p className="text-lg text-blue-200">
            Navegue pelo nosso catálogo e aproveite as ofertas
          </p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900">
            Nossos Produtos
          </h2>
          {!carregando && !erro && (
            <p className="text-gray-600">
              {produtos.length} {produtos.length === 1 ? 'produto' : 'produtos'} disponíveis
            </p>
          )}
        </div>

        {carregando ? (
          <div className="flex justify-center items-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="ml-4 text-gray-600">Carregando produtos...</p>
          </div>
        ) : erro ? (
          <div className="text-center py-16">
            <p className="text-red-600 text-lg mb-4">{erro}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Tentar novamente
            </button>
          </div>
        ) : produtos.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-500 text-lg">Nenhum produto disponível no momento.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {produtos.map((produto) => (
              <CardProduto key={produto.id} produto={produto} />
            ))}
          </div>
        )}
      </section>

      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-center text-gray-500 text-sm">
            © 2025 Overzone - Desafio Técnico
          </p>
        </div>
      </footer>
    </div>
  );
}
