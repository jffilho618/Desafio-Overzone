// ===========================================
// API de gerenciamento de produtos.
// GET: Lista produtos disponíveis (público)
// POST: Cria novo produto (apenas admin)
// ===========================================

import type { NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';
import { requireAdmin, NextApiRequestWithUser } from '@/lib/auth-middleware';

async function handler(
  req: NextApiRequestWithUser,
  res: NextApiResponse
) {
  // GET - Lista produtos (público lista apenas disponíveis, admin lista todos)
  if (req.method === 'GET') {
    try {
      const { all } = req.query;
      const isAdmin = req.user?.tipo === 'ADMIN';

      // Se o parâmetro 'all' estiver presente e o usuário é admin, retorna todos os produtos
      const produtos = await prisma.produto.findMany({
        where: all === 'true' && isAdmin ? {} : {
          quantidade: {
            gt: 0,
          },
        },
        orderBy: {
          criadoEm: 'desc',
        },
      });

      return res.status(200).json(produtos);
    } catch (error) {
      console.error('Erro ao buscar produtos:', error);
      return res.status(500).json({
        error: 'Erro ao buscar produtos',
        details: error instanceof Error ? error.message : 'Erro desconhecido',
      });
    }
  }

  // POST - Cria novo produto (apenas admin)
  if (req.method === 'POST') {
    try {
      const { nome, descricao, quantidade, preco } = req.body;

      // Validação dos campos obrigatórios
      if (!nome || !descricao || quantidade === undefined || preco === undefined) {
        return res.status(400).json({
          error: 'Campos obrigatórios: nome, descricao, quantidade, preco',
        });
      }

      // Validação de tipos
      if (typeof quantidade !== 'number' || quantidade < 0) {
        return res.status(400).json({
          error: 'Quantidade deve ser um número não negativo',
        });
      }

      if (typeof preco !== 'number' || preco <= 0) {
        return res.status(400).json({
          error: 'Preço deve ser um número positivo',
        });
      }

      // Verifica se já existe um produto com o mesmo nome
      const produtoExistente = await prisma.produto.findUnique({
        where: { nome },
      });

      if (produtoExistente) {
        return res.status(409).json({
          error: 'Já existe um produto com este nome',
        });
      }

      // Cria o produto
      const novoProduto = await prisma.produto.create({
        data: {
          nome,
          descricao,
          quantidade,
          preco,
        },
      });

      return res.status(201).json(novoProduto);
    } catch (error) {
      console.error('Erro ao criar produto:', error);
      return res.status(500).json({
        error: 'Erro ao criar produto',
        details: error instanceof Error ? error.message : 'Erro desconhecido',
      });
    }
  }

  return res.status(405).json({ error: 'Método não permitido' });
}

// GET é público, POST requer admin
export default async function publicHandler(
  req: NextApiRequestWithUser,
  res: NextApiResponse
) {
  if (req.method === 'GET') {
    return handler(req, res);
  }

  // Para outros métodos, exige autenticação de admin
  return requireAdmin(handler)(req, res);
}
