import { useState } from 'react';
import { Produto } from '@/types/product';
import FormularioProduto from '@/components/FormularioProduto';
import ListaProdutos from '@/components/ListaProdutos';
import DialogoConfirmacao from '@/components/DialogoConfirmacao';

export default function PaginaInicial() {
  // Estado para armazenar os produtos em memória
  const [produtos, setProdutos] = useState<Produto[]>([]);

  // Estado para controlar o modo de edição
  const [produtoEmEdicao, setProdutoEmEdicao] = useState<Produto | null>(null);

  // Estado para controlar o diálogo de confirmação de remoção
  const [dialogoRemocao, setDialogoRemocao] = useState<{
    estaAberto: boolean;
    idProduto: string | null;
    nomeProduto: string;
  }>({
    estaAberto: false,
    idProduto: null,
    nomeProduto: '',
  });

  // Função para adicionar um novo produto
  const aoAdicionarProduto = (dadosProduto: Omit<Produto, 'id'>) => {
    // Verifica se já existe um produto com o mesmo nome (case-insensitive)
    const produtoDuplicado = produtos.find(
      (p) => p.nome.toLowerCase() === dadosProduto.nome.toLowerCase()
    );

    if (produtoDuplicado) {
      alert('Erro: Já existe um produto com este nome!');
      return;
    }

    // Cria novo produto com ID único baseado no timestamp
    const novoProduto: Produto = {
      ...dadosProduto,
      id: Date.now().toString(),
    };

    setProdutos([...produtos, novoProduto]);
  };

  // Função para atualizar um produto existente
  const aoAtualizarProduto = (dadosProduto: Omit<Produto, 'id'>) => {
    if (!produtoEmEdicao) return;

    // Verifica se o novo nome já está sendo usado por outro produto
    const produtoDuplicado = produtos.find(
      (p) =>
        p.id !== produtoEmEdicao.id &&
        p.nome.toLowerCase() === dadosProduto.nome.toLowerCase()
    );

    if (produtoDuplicado) {
      alert('Erro: Já existe outro produto com este nome!');
      return;
    }

    // Atualiza o produto mantendo o ID original
    setProdutos(
      produtos.map((p) =>
        p.id === produtoEmEdicao.id ? { ...dadosProduto, id: p.id } : p
      )
    );

    // Limpa o estado de edição
    setProdutoEmEdicao(null);
  };

  // Função para iniciar a edição de um produto
  const aoEditarProduto = (produto: Produto) => {
    setProdutoEmEdicao(produto);
    // Scroll suave para o topo da página onde está o formulário
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Função para cancelar a edição
  const aoCancelarEdicao = () => {
    setProdutoEmEdicao(null);
  };

  // Função para abrir o diálogo de confirmação de remoção
  const aoClicarRemover = (id: string) => {
    const produto = produtos.find((p) => p.id === id);
    if (produto) {
      setDialogoRemocao({
        estaAberto: true,
        idProduto: id,
        nomeProduto: produto.nome,
      });
    }
  };

  // Função para confirmar a remoção do produto
  const aoConfirmarRemocao = () => {
    if (dialogoRemocao.idProduto) {
      // Remove o produto da lista
      setProdutos(produtos.filter((p) => p.id !== dialogoRemocao.idProduto));

      // Se estava editando o produto removido, cancela a edição
      if (produtoEmEdicao?.id === dialogoRemocao.idProduto) {
        setProdutoEmEdicao(null);
      }
    }

    // Fecha o diálogo
    setDialogoRemocao({ estaAberto: false, idProduto: null, nomeProduto: '' });
  };

  // Função para cancelar a remoção
  const aoCancelarRemocao = () => {
    setDialogoRemocao({ estaAberto: false, idProduto: null, nomeProduto: '' });
  };

  // Função para aumentar a quantidade de um produto em 1 unidade
  const aoAumentarQuantidade = (id: string) => {
    setProdutos(
      produtos.map((p) =>
        p.id === id ? { ...p, quantidade: p.quantidade + 1 } : p
      )
    );
  };

  // Função para diminuir a quantidade de um produto em 1 unidade
  const aoDiminuirQuantidade = (id: string) => {
    const produto = produtos.find((p) => p.id === id);

    if (!produto) return;

    // Se a quantidade for 1, abre o diálogo para confirmar remoção completa
    if (produto.quantidade === 1) {
      setDialogoRemocao({
        estaAberto: true,
        idProduto: id,
        nomeProduto: produto.nome,
      });
      return;
    }

    // Caso contrário, apenas diminui a quantidade
    setProdutos(
      produtos.map((p) =>
        p.id === id ? { ...p, quantidade: p.quantidade - 1 } : p
      )
    );
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Cabeçalho */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-3xl font-bold text-gray-900">
            Gerenciador de Estoque
          </h1>
          <p className="text-gray-600 mt-1">Sistema simples para gerenciar produtos</p>
        </div>
      </header>

      {/* Conteúdo Principal */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Formulário de Produto */}
          <FormularioProduto
            aoEnviar={produtoEmEdicao ? aoAtualizarProduto : aoAdicionarProduto}
            aoCancelar={produtoEmEdicao ? aoCancelarEdicao : undefined}
            dadosIniciais={produtoEmEdicao || undefined}
            estaEditando={!!produtoEmEdicao}
          />

          {/* Lista de Produtos */}
          <ListaProdutos
            produtos={produtos}
            aoEditar={aoEditarProduto}
            aoRemover={aoClicarRemover}
            aoAumentarQuantidade={aoAumentarQuantidade}
            aoDiminuirQuantidade={aoDiminuirQuantidade}
          />
        </div>
      </main>

      {/* Diálogo de Confirmação de Remoção */}
      <DialogoConfirmacao
        estaAberto={dialogoRemocao.estaAberto}
        titulo="Confirmar Remoção"
        mensagem={`Tem certeza que deseja remover completamente o produto "${dialogoRemocao.nomeProduto}"? Esta ação não pode ser desfeita.`}
        aoConfirmar={aoConfirmarRemocao}
        aoCancelar={aoCancelarRemocao}
      />

      {/* Rodapé */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <p className="text-center text-gray-500 text-sm">
            Desafio Técnico - Overzone
          </p>
        </div>
      </footer>
    </div>
  );
}
