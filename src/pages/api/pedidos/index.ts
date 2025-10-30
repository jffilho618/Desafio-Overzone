// ===========================================
// API de gerenciamento de pedidos.
// GET: Lista pedidos do usuário autenticado (ou todos se for admin)
// POST: Cria novo pedido com itens do carrinho
// ===========================================

import type { NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';
import { requireAuth, NextApiRequestWithUser } from '@/lib/auth-middleware';

async function handler(
  req: NextApiRequestWithUser,
  res: NextApiResponse
) {
  // GET - Lista pedidos
  if (req.method === 'GET') {
    try {
      const isAdmin = req.user!.tipo === 'ADMIN';

      // Admin vê todos os pedidos, usuário comum vê apenas os seus
      const pedidos = await prisma.pedido.findMany({
        where: isAdmin ? {} : {
          usuarioId: req.user!.userId,
        },
        include: {
          usuario: {
            select: {
              id: true,
              nome: true,
              email: true,
            },
          },
          itens: {
            include: {
              produto: {
                select: {
                  id: true,
                  nome: true,
                  descricao: true,
                },
              },
            },
          },
        },
        orderBy: {
          criadoEm: 'desc',
        },
      });

      return res.status(200).json(pedidos);
    } catch (error) {
      console.error('Erro ao buscar pedidos:', error);
      return res.status(500).json({
        error: 'Erro ao buscar pedidos',
        details: error instanceof Error ? error.message : 'Erro desconhecido',
      });
    }
  }

  // POST - Cria novo pedido
  if (req.method === 'POST') {
    try {
      const { itens } = req.body;

      // Validação dos itens
      if (!Array.isArray(itens) || itens.length === 0) {
        return res.status(400).json({
          error: 'O pedido deve conter pelo menos um item',
        });
      }

      // Valida estrutura de cada item
      for (const item of itens) {
        if (!item.produtoId || !item.quantidade || item.quantidade <= 0) {
          return res.status(400).json({
            error: 'Cada item deve ter produtoId e quantidade válida',
          });
        }
      }

      // Verifica se os produtos existem e têm estoque suficiente
      const produtosIds = itens.map((item: any) => item.produtoId);
      const produtos = await prisma.produto.findMany({
        where: {
          id: {
            in: produtosIds,
          },
        },
      });

      // Verifica se todos os produtos foram encontrados
      if (produtos.length !== produtosIds.length) {
        return res.status(404).json({
          error: 'Um ou mais produtos não foram encontrados',
        });
      }

      // Valida estoque e calcula valores
      let totalPedido = 0;
      const itensPedido = [];

      for (const item of itens) {
        const produto = produtos.find((p) => p.id === item.produtoId);

        if (!produto) {
          return res.status(404).json({
            error: `Produto ${item.produtoId} não encontrado`,
          });
        }

        // Verifica estoque
        if (produto.quantidade < item.quantidade) {
          return res.status(400).json({
            error: `Estoque insuficiente para o produto "${produto.nome}". Disponível: ${produto.quantidade}`,
          });
        }

        const subtotal = produto.preco * item.quantidade;
        totalPedido += subtotal;

        itensPedido.push({
          produtoId: produto.id,
          quantidade: item.quantidade,
          precoUnitario: produto.preco,
          subtotal,
        });
      }

      // Cria o pedido com seus itens em uma transação
      const pedido = await prisma.$transaction(async (tx) => {
        // Cria o pedido
        const novoPedido = await tx.pedido.create({
          data: {
            usuarioId: req.user!.userId,
            total: totalPedido,
            status: 'PENDENTE',
            itens: {
              create: itensPedido,
            },
          },
          include: {
            itens: {
              include: {
                produto: true,
              },
            },
          },
        });

        // Atualiza o estoque dos produtos
        for (const item of itens) {
          await tx.produto.update({
            where: { id: item.produtoId },
            data: {
              quantidade: {
                decrement: item.quantidade,
              },
            },
          });
        }

        return novoPedido;
      });

      return res.status(201).json(pedido);
    } catch (error) {
      console.error('Erro ao criar pedido:', error);
      return res.status(500).json({
        error: 'Erro ao criar pedido',
        details: error instanceof Error ? error.message : 'Erro desconhecido',
      });
    }
  }

  return res.status(405).json({ error: 'Método não permitido' });
}

// Exporta o handler protegido pelo middleware de autenticação
export default requireAuth(handler);
