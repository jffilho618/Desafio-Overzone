import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ItemCarrinho } from '@/types/pedido';
import { Produto } from '@/types/product';

// Interface do contexto do carrinho
interface CarrinhoContextData {
  itens: ItemCarrinho[];
  quantidadeTotal: number;
  valorTotal: number;
  adicionarAoCarrinho: (produto: Produto, quantidade?: number) => void;
  removerDoCarrinho: (produtoId: string) => void;
  atualizarQuantidade: (produtoId: string, quantidade: number) => void;
  limparCarrinho: () => void;
}

// Cria o contexto
const CarrinhoContext = createContext<CarrinhoContextData>({} as CarrinhoContextData);

// Props do provider
interface CarrinhoProviderProps {
  children: ReactNode;
}

// Chave para armazenar no localStorage
const STORAGE_KEY = 'overzone_carrinho';

// Provider do contexto do carrinho
export function CarrinhoProvider({ children }: CarrinhoProviderProps) {
  const [itens, setItens] = useState<ItemCarrinho[]>([]);

  // Carrega carrinho do localStorage ao montar
  useEffect(() => {
    try {
      const carrinhoSalvo = localStorage.getItem(STORAGE_KEY);
      if (carrinhoSalvo) {
        const itensParseados = JSON.parse(carrinhoSalvo);
        setItens(itensParseados);
      }
    } catch (erro) {
      console.error('Erro ao carregar carrinho do localStorage:', erro);
      localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  // Salva carrinho no localStorage sempre que mudar
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(itens));
  }, [itens]);

  // Calcula quantidade total de itens
  const quantidadeTotal = itens.reduce((total, item) => total + item.quantidade, 0);

  // Calcula valor total do carrinho
  const valorTotal = itens.reduce(
    (total, item) => total + item.produto.preco * item.quantidade,
    0
  );

  // Adiciona produto ao carrinho
  const adicionarAoCarrinho = (produto: Produto, quantidade: number = 1) => {
    setItens((itensAtuais) => {
      // Verifica se o produto já está no carrinho
      const itemExistente = itensAtuais.find((item) => item.produto.id === produto.id);

      if (itemExistente) {
        // Se já existe, aumenta a quantidade
        return itensAtuais.map((item) =>
          item.produto.id === produto.id
            ? { ...item, quantidade: item.quantidade + quantidade }
            : item
        );
      } else {
        // Se não existe, adiciona novo item
        return [...itensAtuais, { produto, quantidade }];
      }
    });
  };

  // Remove produto do carrinho
  const removerDoCarrinho = (produtoId: string) => {
    setItens((itensAtuais) => itensAtuais.filter((item) => item.produto.id !== produtoId));
  };

  // Atualiza quantidade de um produto no carrinho
  const atualizarQuantidade = (produtoId: string, quantidade: number) => {
    if (quantidade <= 0) {
      // Se a quantidade for 0 ou negativa, remove o item
      removerDoCarrinho(produtoId);
      return;
    }

    setItens((itensAtuais) =>
      itensAtuais.map((item) =>
        item.produto.id === produtoId ? { ...item, quantidade } : item
      )
    );
  };

  // Limpa todo o carrinho
  const limparCarrinho = () => {
    setItens([]);
  };

  return (
    <CarrinhoContext.Provider
      value={{
        itens,
        quantidadeTotal,
        valorTotal,
        adicionarAoCarrinho,
        removerDoCarrinho,
        atualizarQuantidade,
        limparCarrinho
      }}
    >
      {children}
    </CarrinhoContext.Provider>
  );
}

// Hook personalizado para usar o contexto do carrinho
export function useCarrinho() {
  const contexto = useContext(CarrinhoContext);

  if (!contexto) {
    throw new Error('useCarrinho deve ser usado dentro de um CarrinhoProvider');
  }

  return contexto;
}
