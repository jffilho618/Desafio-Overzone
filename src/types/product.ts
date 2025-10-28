// Interface que representa um produto no estoque
export interface Produto {
  id: string;
  nome: string;
  descricao: string;
  quantidade: number;
  preco: number;
}
