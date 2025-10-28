import { Produto } from './product';

// Item do carrinho ou pedido
export interface ItemCarrinho {
  produto: Produto;
  quantidade: number;
}

// Status possíveis do pedido
export type StatusPedido = 'pendente' | 'processando' | 'enviado' | 'entregue' | 'cancelado';

// Interface que representa um pedido
export interface Pedido {
  id: string;
  usuarioId: string;
  itens: ItemCarrinho[];
  total: number;
  data: string; // ISO date string
  status: StatusPedido;
}
