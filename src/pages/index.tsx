import { useState } from 'react';
import Header from '@/components/layout/Header';
import CardProduto from '@/components/produtos/CardProduto';
import { produtosMockados } from '@/data/produtos';

export default function PaginaInicial() {
  // Estado para armazenar os produtos (inicialmente carrega os mockados)
  const [produtos] = useState(produtosMockados);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header com navegação */}
      <Header />

      {/* Hero Section */}
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

      {/* Produtos */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900">
            Nossos Produtos
          </h2>
          <p className="text-gray-600">
            {produtos.length} {produtos.length === 1 ? 'produto' : 'produtos'} disponíveis
          </p>
        </div>

        {/* Grid de produtos */}
        {produtos.length === 0 ? (
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

      {/* Footer */}
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
