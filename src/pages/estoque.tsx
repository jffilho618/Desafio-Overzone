import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Produto } from '@/types/product';
import FormularioProduto from '@/components/FormularioProduto';
import ListaProdutos from '@/components/ListaProdutos';
import DialogoConfirmacao from '@/components/DialogoConfirmacao';
import ProtectedRoute from '@/components/layout/ProtectedRoute';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';
import { produtosMockados } from '@/data/produtos';

function PaginaEstoque() {
  // Estado para armazenar os produtos (carrega produtos mockados inicialmente)
  const [produtos, setProdutos] = useState<Produto[]>([]);

  // Carrega produtos mockados ao montar o componente
  useEffect(() => {
    setProdutos(produtosMockados);
  }, []);

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
    // Normaliza o nome para comparação (remove espaços extras e converte para minúsculas)
    const nomeNormalizado = dadosProduto.nome.trim().toLowerCase().replace(/\s+/g, ' ');

    // Verifica se já existe um produto com o mesmo nome (comparação normalizada)
    const produtoDuplicado = produtos.find((p) => {
      const nomeExistenteNormalizado = p.nome.trim().toLowerCase().replace(/\s+/g, ' ');
      return nomeExistenteNormalizado === nomeNormalizado;
    });

    if (produtoDuplicado) {
      alert(`Erro: Já existe um produto com o nome "${produtoDuplicado.nome}"!`);
      return;
    }

    // Validação adicional: quantidade não pode ser negativa
    if (dadosProduto.quantidade < 0) {
      alert('Erro: A quantidade não pode ser negativa!');
      return;
    }

    // Validação adicional: preço deve ser maior que zero
    if (dadosProduto.preco <= 0) {
      alert('Erro: O preço deve ser maior que zero!');
      return;
    }

    // Cria novo produto com ID único usando UUID
    const novoProduto: Produto = {
      ...dadosProduto,
      id: uuidv4(),
    };

    setProdutos([...produtos, novoProduto]);
  };

  // Função para atualizar um produto existente
  const aoAtualizarProduto = (dadosProduto: Omit<Produto, 'id'>) => {
    if (!produtoEmEdicao) return;

    // Normaliza o nome para comparação
    const nomeNormalizado = dadosProduto.nome.trim().toLowerCase().replace(/\s+/g, ' ');

    // Verifica se o novo nome já está sendo usado por outro produto
    const produtoDuplicado = produtos.find((p) => {
      if (p.id === produtoEmEdicao.id) return false; // Ignora o próprio produto
      const nomeExistenteNormalizado = p.nome.trim().toLowerCase().replace(/\s+/g, ' ');
      return nomeExistenteNormalizado === nomeNormalizado;
    });

    if (produtoDuplicado) {
      alert(`Erro: Já existe outro produto com o nome "${produtoDuplicado.nome}"!`);
      return;
    }

    // Validação adicional: quantidade não pode ser negativa
    if (dadosProduto.quantidade < 0) {
      alert('Erro: A quantidade não pode ser negativa!');
      return;
    }

    // Validação adicional: preço deve ser maior que zero
    if (dadosProduto.preco <= 0) {
      alert('Erro: O preço deve ser maior que zero!');
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
      produtos.map((p) => {
        if (p.id === id) {
          // Validação: não permite ultrapassar 999.999
          if (p.quantidade >= 999999) {
            alert('Erro: Quantidade máxima atingida (999.999)!');
            return p;
          }
          return { ...p, quantidade: p.quantidade + 1 };
        }
        return p;
      })
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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Header />

      <div className="flex">
        {/* Sidebar */}
        <Sidebar />

        {/* Conteúdo Principal */}
        <main className="flex-1 p-8">
          <div className="max-w-6xl mx-auto">
            {/* Cabeçalho da página */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900">
                Gerenciador de Estoque
              </h1>
              <p className="text-gray-600 mt-1">
                Gerencie os produtos da loja
              </p>
            </div>

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
          </div>
        </main>
      </div>

      {/* Diálogo de Confirmação de Remoção */}
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
    <ProtectedRoute requiredRole="admin">
      <PaginaEstoque />
    </ProtectedRoute>
  );
}
