import { Produto } from '@/types/product';

interface ListaProdutosProps {
  produtos: Produto[];
  aoEditar: (produto: Produto) => void;
  aoRemover: (id: string) => void;
  aoAumentarQuantidade: (id: string) => void;
  aoDiminuirQuantidade: (id: string) => void;
}

export default function ListaProdutos({
  produtos,
  aoEditar,
  aoRemover,
  aoAumentarQuantidade,
  aoDiminuirQuantidade
}: ListaProdutosProps) {
  // Formata o preço para exibição em Real (BRL)
  const formatarPreco = (preco: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(preco);
  };

  // Renderiza mensagem quando não há produtos
  if (produtos.length === 0) {
    return (
      <div className="bg-white p-8 rounded-lg shadow-md text-center">
        <p className="text-gray-500 text-lg">Nenhum produto cadastrado ainda.</p>
        <p className="text-gray-400 text-sm mt-2">
          Use o formulário acima para adicionar seu primeiro produto.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {/* Cabeçalho da lista */}
      <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
        <h2 className="text-xl font-bold text-gray-800">Lista de Produtos</h2>
        <p className="text-sm text-gray-600 mt-1">
          Total: {produtos.length} {produtos.length === 1 ? 'produto' : 'produtos'}
        </p>
      </div>

      {/* Tabela de produtos */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Nome
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Descrição
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Quantidade
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Preço Unit.
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Valor Total
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ações
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {produtos.map((produto) => (
              <tr key={produto.id} className="hover:bg-gray-50 transition-colors">
                {/* Nome do produto */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{produto.nome}</div>
                </td>

                {/* Descrição do produto */}
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-700 max-w-xs truncate" title={produto.descricao}>
                    {produto.descricao}
                  </div>
                </td>

                {/* Controles de quantidade */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => aoDiminuirQuantidade(produto.id)}
                      className="w-7 h-7 flex items-center justify-center bg-gray-200 hover:bg-gray-300 text-gray-700 rounded transition-colors font-bold"
                      title="Diminuir quantidade"
                    >
                      -
                    </button>
                    <span className="text-sm text-gray-900 font-medium min-w-8 text-center">
                      {produto.quantidade}
                    </span>
                    <button
                      onClick={() => aoAumentarQuantidade(produto.id)}
                      className="w-7 h-7 flex items-center justify-center bg-green-500 hover:bg-green-600 text-white rounded transition-colors font-bold"
                      title="Aumentar quantidade"
                    >
                      +
                    </button>
                  </div>
                </td>

                {/* Preço unitário */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-700">{formatarPreco(produto.preco)}</div>
                </td>

                {/* Valor total do produto (preço × quantidade) */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {formatarPreco(produto.preco * produto.quantidade)}
                  </div>
                </td>

                {/* Botões de ação */}
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => aoEditar(produto)}
                    className="text-blue-600 hover:text-blue-800 mr-3 transition-colors"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => aoRemover(produto.id)}
                    className="text-red-600 hover:text-red-800 transition-colors"
                  >
                    Remover
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Resumo do estoque - Valor total */}
      <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-gray-700">Valor Total do Estoque:</span>
          <span className="text-lg font-bold text-gray-900">
            {formatarPreco(
              produtos.reduce((total, produto) => total + produto.preco * produto.quantidade, 0)
            )}
          </span>
        </div>
      </div>
    </div>
  );
}
