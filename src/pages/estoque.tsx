// ===========================================
// Página de gerenciamento de estoque (apenas admin).
// Permite criar, editar e deletar produtos através de APIs.
// Sincroniza os dados com o back-end em tempo real.
// ===========================================

import { useState, useEffect } from 'react';
import { Produto } from '@/types/product';
import FormularioProduto from '@/components/FormularioProduto';
import ListaProdutos from '@/components/ListaProdutos';
import DialogoConfirmacao from '@/components/DialogoConfirmacao';
import ProtectedRoute from '@/components/layout/ProtectedRoute';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';

function PaginaEstoque() {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  // Busca todos os produtos do back-end ao montar o componente
  useEffect(() => {
    buscarProdutos();
  }, []);

  // Função para buscar produtos da API (busca todos, incluindo os com quantidade 0)
  const buscarProdutos = async () => {
    try {
      setCarregando(true);
      setErro(null);

      const resposta = await fetch('/api/produtos?all=true');

      if (!resposta.ok) {
        throw new Error('Erro ao carregar produtos');
      }

      const dados = await resposta.json();
      setProdutos(dados);
    } catch (error) {
      console.error('Erro ao buscar produtos:', error);
      setErro('Não foi possível carregar os produtos');
    } finally {
      setCarregando(false);
    }
  };

  const [produtoEmEdicao, setProdutoEmEdicao] = useState<Produto | null>(null);
  const [dialogoRemocao, setDialogoRemocao] = useState<{
    estaAberto: boolean;
    idProduto: string | null;
    nomeProduto: string;
  }>({
    estaAberto: false,
    idProduto: null,
    nomeProduto: '',
  });

  // Cria um novo produto via API
  const aoAdicionarProduto = async (dadosProduto: Omit<Produto, 'id'>) => {
    try {
      const resposta = await fetch('/api/produtos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dadosProduto),
      });

      const dados = await resposta.json();

      if (!resposta.ok) {
        alert(dados.error || 'Erro ao criar produto');
        return;
      }

      // Atualiza a lista de produtos
      await buscarProdutos();
      alert('Produto criado com sucesso!');
    } catch (error) {
      console.error('Erro ao criar produto:', error);
      alert('Erro ao criar produto');
    }
  };

  // Atualiza um produto existente via API
  const aoAtualizarProduto = async (dadosProduto: Omit<Produto, 'id'>) => {
    if (!produtoEmEdicao) return;

    try {
      const resposta = await fetch(`/api/produtos/${produtoEmEdicao.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dadosProduto),
      });

      const dados = await resposta.json();

      if (!resposta.ok) {
        alert(dados.error || 'Erro ao atualizar produto');
        return;
      }

      // Atualiza a lista e limpa o estado de edição
      await buscarProdutos();
      setProdutoEmEdicao(null);
      alert('Produto atualizado com sucesso!');
    } catch (error) {
      console.error('Erro ao atualizar produto:', error);
      alert('Erro ao atualizar produto');
    }
  };

  // Inicia a edição de um produto
  const aoEditarProduto = (produto: Produto) => {
    setProdutoEmEdicao(produto);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Cancela a edição
  const aoCancelarEdicao = () => {
    setProdutoEmEdicao(null);
  };

  // Abre o diálogo de confirmação de remoção
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

  // Confirma a remoção do produto via API
  const aoConfirmarRemocao = async () => {
    if (!dialogoRemocao.idProduto) return;

    try {
      const resposta = await fetch(`/api/produtos/${dialogoRemocao.idProduto}`, {
        method: 'DELETE',
      });

      const dados = await resposta.json();

      if (!resposta.ok) {
        alert(dados.error || 'Erro ao deletar produto');
        setDialogoRemocao({ estaAberto: false, idProduto: null, nomeProduto: '' });
        return;
      }

      // Se estava editando o produto removido, cancela a edição
      if (produtoEmEdicao?.id === dialogoRemocao.idProduto) {
        setProdutoEmEdicao(null);
      }

      // Atualiza a lista
      await buscarProdutos();
      alert('Produto deletado com sucesso!');
    } catch (error) {
      console.error('Erro ao deletar produto:', error);
      alert('Erro ao deletar produto');
    } finally {
      setDialogoRemocao({ estaAberto: false, idProduto: null, nomeProduto: '' });
    }
  };

  // Cancela a remoção
  const aoCancelarRemocao = () => {
    setDialogoRemocao({ estaAberto: false, idProduto: null, nomeProduto: '' });
  };

  // Aumenta a quantidade de um produto via API
  const aoAumentarQuantidade = async (id: string) => {
    const produto = produtos.find((p) => p.id === id);
    if (!produto) return;

    if (produto.quantidade >= 999999) {
      alert('Erro: Quantidade máxima atingida (999.999)!');
      return;
    }

    try {
      const resposta = await fetch(`/api/produtos/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nome: produto.nome,
          descricao: produto.descricao,
          preco: produto.preco,
          quantidade: produto.quantidade + 1,
        }),
      });

      if (!resposta.ok) {
        throw new Error('Erro ao atualizar quantidade');
      }

      await buscarProdutos();
    } catch (error) {
      console.error('Erro ao aumentar quantidade:', error);
      alert('Erro ao aumentar quantidade');
    }
  };

  // Diminui a quantidade de um produto via API
  const aoDiminuirQuantidade = async (id: string) => {
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

    try {
      const resposta = await fetch(`/api/produtos/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nome: produto.nome,
          descricao: produto.descricao,
          preco: produto.preco,
          quantidade: produto.quantidade - 1,
        }),
      });

      if (!resposta.ok) {
        throw new Error('Erro ao atualizar quantidade');
      }

      await buscarProdutos();
    } catch (error) {
      console.error('Erro ao diminuir quantidade:', error);
      alert('Erro ao diminuir quantidade');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="flex">
        <Sidebar />

        <main className="flex-1 p-8">
          <div className="max-w-6xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900">
                Gerenciador de Estoque
              </h1>
              <p className="text-gray-600 mt-1">
                Gerencie os produtos da loja
              </p>
            </div>

            {/* Exibe mensagem de erro se houver */}
            {erro && (
              <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
                <p className="text-red-700">{erro}</p>
                <button
                  onClick={buscarProdutos}
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
                <p className="ml-4 text-gray-600">Carregando produtos...</p>
              </div>
            ) : (
              <div className="space-y-8">
                <FormularioProduto
                  aoEnviar={produtoEmEdicao ? aoAtualizarProduto : aoAdicionarProduto}
                  aoCancelar={produtoEmEdicao ? aoCancelarEdicao : undefined}
                  dadosIniciais={produtoEmEdicao || undefined}
                  estaEditando={!!produtoEmEdicao}
                />

                <ListaProdutos
                  produtos={produtos}
                  aoEditar={aoEditarProduto}
                  aoRemover={aoClicarRemover}
                  aoAumentarQuantidade={aoAumentarQuantidade}
                  aoDiminuirQuantidade={aoDiminuirQuantidade}
                />
              </div>
            )}
          </div>
        </main>
      </div>

      <DialogoConfirmacao
        estaAberto={dialogoRemocao.estaAberto}
        titulo="Confirmar Remoção"
        mensagem={`Tem certeza que deseja remover completamente o produto "${dialogoRemocao.nomeProduto}"? Esta ação não pode ser desfeita.`}
        aoConfirmar={aoConfirmarRemocao}
        aoCancelar={aoCancelarRemocao}
      />
    </div>
  );
}

// Exporta página com proteção de rota (apenas admin)
export default function PaginaEstoqueProtegida() {
  return (
    <ProtectedRoute requiredRole="ADMIN">
      <PaginaEstoque />
    </ProtectedRoute>
  );
}
