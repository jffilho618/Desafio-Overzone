import { useState, useEffect } from 'react';
import { Produto } from '@/types/product';

interface FormularioProdutoProps {
  aoEnviar: (produto: Omit<Produto, 'id'>) => void;
  aoCancelar?: () => void;
  dadosIniciais?: Produto;
  estaEditando?: boolean;
}

export default function FormularioProduto({
  aoEnviar,
  aoCancelar,
  dadosIniciais,
  estaEditando = false
}: FormularioProdutoProps) {
  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState('');
  const [quantidade, setQuantidade] = useState('');
  const [preco, setPreco] = useState('');
  const [erros, setErros] = useState<{ [chave: string]: string }>({});

  // Preenche o formulário quando está editando
  useEffect(() => {
    if (dadosIniciais) {
      setNome(dadosIniciais.nome);
      setDescricao(dadosIniciais.descricao);
      setQuantidade(dadosIniciais.quantidade.toString());
      setPreco(dadosIniciais.preco.toString());
    }
  }, [dadosIniciais]);

  const validar = (): boolean => {
    const novosErros: { [chave: string]: string } = {};

    if (!nome.trim()) {
      novosErros.nome = 'Nome é obrigatório';
    }

    if (!descricao.trim()) {
      novosErros.descricao = 'Descrição é obrigatória';
    }

    const quantidadeNum = parseInt(quantidade);
    if (!quantidade || isNaN(quantidadeNum) || quantidadeNum < 0) {
      novosErros.quantidade = 'Quantidade deve ser um número válido e não negativo';
    }

    const precoNum = parseFloat(preco);
    if (!preco || isNaN(precoNum) || precoNum < 0) {
      novosErros.preco = 'Preço deve ser um número válido e não negativo';
    }

    setErros(novosErros);
    return Object.keys(novosErros).length === 0;
  };

  const aoEnviarFormulario = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validar()) {
      return;
    }

    aoEnviar({
      nome: nome.trim(),
      descricao: descricao.trim(),
      quantidade: parseInt(quantidade),
      preco: parseFloat(preco),
    });

    // Limpa o formulário após o envio (somente ao adicionar)
    if (!estaEditando) {
      setNome('');
      setDescricao('');
      setQuantidade('');
      setPreco('');
    }
    setErros({});
  };

  return (
    <form onSubmit={aoEnviarFormulario} className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">
        {estaEditando ? 'Editar Produto' : 'Adicionar Novo Produto'}
      </h2>

      <div className="space-y-4">
        {/* Campo Nome */}
        <div>
          <label htmlFor="nome" className="block text-sm font-medium text-gray-700 mb-1">
            Nome do Produto
          </label>
          <input
            id="nome"
            type="text"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
              erros.nome
                ? 'border-red-500 focus:ring-red-500'
                : 'border-gray-300 focus:ring-blue-500'
            }`}
            placeholder="Ex: Notebook Dell"
          />
          {erros.nome && (
            <p className="mt-1 text-sm text-red-600">{erros.nome}</p>
          )}
        </div>

        {/* Campo Descrição */}
        <div>
          <label htmlFor="descricao" className="block text-sm font-medium text-gray-700 mb-1">
            Descrição
          </label>
          <textarea
            id="descricao"
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 resize-none ${
              erros.descricao
                ? 'border-red-500 focus:ring-red-500'
                : 'border-gray-300 focus:ring-blue-500'
            }`}
            placeholder="Ex: Notebook Dell Inspiron 15 com Intel Core i7, 16GB RAM, SSD 512GB"
            rows={3}
          />
          {erros.descricao && (
            <p className="mt-1 text-sm text-red-600">{erros.descricao}</p>
          )}
        </div>

        {/* Campo Quantidade */}
        <div>
          <label htmlFor="quantidade" className="block text-sm font-medium text-gray-700 mb-1">
            Quantidade
          </label>
          <input
            id="quantidade"
            type="number"
            value={quantidade}
            onChange={(e) => setQuantidade(e.target.value)}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
              erros.quantidade
                ? 'border-red-500 focus:ring-red-500'
                : 'border-gray-300 focus:ring-blue-500'
            }`}
            placeholder="Ex: 10"
            min="0"
          />
          {erros.quantidade && (
            <p className="mt-1 text-sm text-red-600">{erros.quantidade}</p>
          )}
        </div>

        {/* Campo Preço */}
        <div>
          <label htmlFor="preco" className="block text-sm font-medium text-gray-700 mb-1">
            Preço (R$)
          </label>
          <input
            id="preco"
            type="number"
            step="0.01"
            value={preco}
            onChange={(e) => setPreco(e.target.value)}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
              erros.preco
                ? 'border-red-500 focus:ring-red-500'
                : 'border-gray-300 focus:ring-blue-500'
            }`}
            placeholder="Ex: 3500.00"
            min="0"
          />
          {erros.preco && (
            <p className="mt-1 text-sm text-red-600">{erros.preco}</p>
          )}
        </div>
      </div>

      {/* Botões */}
      <div className="flex gap-3 mt-6">
        <button
          type="submit"
          className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors font-medium"
        >
          {estaEditando ? 'Atualizar' : 'Adicionar'}
        </button>
        {aoCancelar && (
          <button
            type="button"
            onClick={aoCancelar}
            className="flex-1 bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300 transition-colors font-medium"
          >
            Cancelar
          </button>
        )}
      </div>
    </form>
  );
}
