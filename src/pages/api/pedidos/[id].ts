// ===========================================
// API de gerenciamento individual de pedidos.
// GET: Busca detalhes de um pedido específico
// PATCH: Atualiza status do pedido (apenas admin)
// ===========================================

import type { NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';
import { requireAuth, requireAdmin, NextApiRequestWithUser } from '@/lib/auth-middleware';

async function handlerGet(
  req: NextApiRequestWithUser,
  res: NextApiResponse
) {
  const { id } = req.query;

  // Valida se o ID foi fornecido
  if (typeof id !== 'string') {
    return res.status(400).json({ error: 'ID inválido' });
  }

  try {
    const isAdmin = req.user!.tipo === 'ADMIN';

    // Busca o pedido
    const pedido = await prisma.pedido.findUnique({
      where: { id },
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
                preco: true,
              },
            },
          },
        },
      },
    });

    if (!pedido) {
      return res.status(404).json({ error: 'Pedido não encontrado' });
    }

    // Verifica se o usuário tem permissão para ver este pedido
    if (!isAdmin && pedido.usuarioId !== req.user!.userId) {
      return res.status(403).json({
        error: 'Você não tem permissão para visualizar este pedido',
      });
    }

    return res.status(200).json(pedido);
  } catch (error) {
    console.error('Erro ao buscar pedido:', error);
    return res.status(500).json({
      error: 'Erro ao buscar pedido',
      details: error instanceof Error ? error.message : 'Erro desconhecido',
    });
  }
}

async function handlerPatch(
  req: NextApiRequestWithUser,
  res: NextApiResponse
) {
  const { id } = req.query;
  const { status } = req.body;

  // Valida se o ID foi fornecido
  if (typeof id !== 'string') {
    return res.status(400).json({ error: 'ID inválido' });
  }

  // Valida o status
  const statusValidos = ['PENDENTE', 'PROCESSANDO', 'ENVIADO', 'ENTREGUE', 'CANCELADO'];
  if (!status || !statusValidos.includes(status)) {
    return res.status(400).json({
      error: `Status inválido. Valores aceitos: ${statusValidos.join(', ')}`,
    });
  }

  try {
    // Verifica se o pedido existe
    const pedidoExistente = await prisma.pedido.findUnique({
      where: { id },
    });

    if (!pedidoExistente) {
      return res.status(404).json({ error: 'Pedido não encontrado' });
    }

    // Atualiza o status do pedido
    const pedidoAtualizado = await prisma.pedido.update({
      where: { id },
      data: { status },
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
            produto: true,
          },
        },
      },
    });

    return res.status(200).json(pedidoAtualizado);
  } catch (error) {
    console.error('Erro ao atualizar pedido:', error);
    return res.status(500).json({
      error: 'Erro ao atualizar pedido',
      details: error instanceof Error ? error.message : 'Erro desconhecido',
    });
  }
}

// Exporta handlers com proteção apropriada
export default async function handler(
  req: NextApiRequestWithUser,
  res: NextApiResponse
) {
  if (req.method === 'GET') {
    // GET requer autenticação
    return requireAuth(handlerGet)(req, res);
  }

  if (req.method === 'PATCH') {
    // PATCH requer permissão de admin
    return requireAdmin(handlerPatch)(req, res);
  }

  return res.status(405).json({ error: 'Método não permitido' });
}
