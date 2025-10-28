import { Pedido } from '@/types/pedido';
import { produtosMockados } from './produtos';

// Pedidos mockados para demonstração
export const pedidosMockados: Pedido[] = [
  {
    id: '1',
    usuarioId: '2', // João Silva
    itens: [
      {
        produto: produtosMockados[0], // Notebook Dell
        quantidade: 1
      },
      {
        produto: produtosMockados[1], // Mouse Logitech
        quantidade: 2
      }
    ],
    total: 4399.70,
    data: '2025-10-20T10:30:00.000Z',
    status: 'entregue'
  },
  {
    id: '2',
    usuarioId: '2', // João Silva
    itens: [
      {
        produto: produtosMockados[2], // Teclado Mecânico
        quantidade: 1
      }
    ],
    total: 599.90,
    data: '2025-10-25T14:15:00.000Z',
    status: 'enviado'
  },
  {
    id: '3',
    usuarioId: '3', // Maria Santos
    itens: [
      {
        produto: produtosMockados[3], // Monitor LG
        quantidade: 1
      },
      {
        produto: produtosMockados[4], // Webcam
        quantidade: 1
      }
    ],
    total: 1699.80,
    data: '2025-10-28T09:00:00.000Z',
    status: 'processando'
  }
];
