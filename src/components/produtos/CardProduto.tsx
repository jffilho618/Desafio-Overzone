import { Produto } from "@/types/product";
import { useCarrinho } from "@/contexts/CarrinhoContext";

interface CardProdutoProps {
  produto: Produto;
}

export default function CardProduto({ produto }: CardProdutoProps) {
  const { adicionarAoCarrinho } = useCarrinho();

  const formatarPreco = (preco: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(preco);
  };

  const aoAdicionarAoCarrinho = () => {
    adicionarAoCarrinho(produto, 1);
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <div className="bg-linear-to-br from-blue-100 to-indigo-100 h-48 flex items-center justify-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-20 w-20 text-blue-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
          />
        </svg>
      </div>

      {/* Informações do produto */}
      <div className="p-4">
        {/* Nome */}
        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-1">
          {produto.nome}
        </h3>

        {/* Descrição */}
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
          {produto.descricao}
        </p>

        {/* Preço e estoque */}
        <div className="flex justify-between items-center mb-4">
          <span className="text-2xl font-bold text-blue-600">
            {formatarPreco(produto.preco)}
          </span>
          <span className="text-sm text-gray-500">
            {produto.quantidade > 0 ? (
              <span className="text-green-600">
                {produto.quantidade} em estoque
              </span>
            ) : (
              <span className="text-red-600">Indisponível</span>
            )}
          </span>
        </div>

        {/* Botão Adicionar ao Carrinho */}
        <button
          onClick={aoAdicionarAoCarrinho}
          disabled={produto.quantidade === 0}
          className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-blue-600"
        >
          {produto.quantidade > 0 ? "Adicionar ao Carrinho" : "Indisponível"}
        </button>
      </div>
    </div>
  );
}
