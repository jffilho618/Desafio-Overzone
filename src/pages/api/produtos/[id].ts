// ===========================================
// API de gerenciamento individual de produtos.
// PUT: Atualiza produto existente (apenas admin)
// DELETE: Remove produto (apenas admin)
// ===========================================

import type { NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';
import { requireAdmin, NextApiRequestWithUser } from '@/lib/auth-middleware';

async function handler(
  req: NextApiRequestWithUser,
  res: NextApiResponse
) {
  const { id } = req.query;

  // Valida se o ID foi fornecido
  if (typeof id !== 'string') {
    return res.status(400).json({ error: 'ID inválido' });
  }

  // PUT - Atualiza produto existente
  if (req.method === 'PUT') {
    try {
      const { nome, descricao, quantidade, preco } = req.body;

      // Validação dos campos e construção do objeto de atualização
      const dadosAtualizacao: {
        nome?: string;
        descricao?: string;
        quantidade?: number;
        preco?: number;
      } = {};

      if (nome !== undefined) {
        if (typeof nome !== 'string' || nome.trim() === '') {
          return res.status(400).json({ error: 'Nome inválido' });
        }
        dadosAtualizacao.nome = nome;
      }

      if (descricao !== undefined) {
        if (typeof descricao !== 'string') {
          return res.status(400).json({ error: 'Descrição inválida' });
        }
        dadosAtualizacao.descricao = descricao;
      }

      if (quantidade !== undefined) {
        if (typeof quantidade !== 'number' || quantidade < 0) {
          return res.status(400).json({
            error: 'Quantidade deve ser um número não negativo',
          });
        }
        dadosAtualizacao.quantidade = quantidade;
      }

      if (preco !== undefined) {
        if (typeof preco !== 'number' || preco <= 0) {
          return res.status(400).json({
            error: 'Preço deve ser um número positivo',
          });
        }
        dadosAtualizacao.preco = preco;
      }

      // Verifica se há dados para atualizar
      if (Object.keys(dadosAtualizacao).length === 0) {
        return res.status(400).json({
          error: 'Nenhum dado fornecido para atualização',
        });
      }

      // Se está atualizando o nome, verifica se já existe outro produto com esse nome
      if (nome) {
        const produtoComMesmoNome = await prisma.produto.findFirst({
          where: {
            nome,
            id: { not: id },
          },
        });

        if (produtoComMesmoNome) {
          return res.status(409).json({
            error: 'Já existe outro produto com este nome',
          });
        }
      }

      // Atualiza o produto
      const produtoAtualizado = await prisma.produto.update({
        where: { id },
        data: dadosAtualizacao,
      });

      return res.status(200).json(produtoAtualizado);
    } catch (error) {
      // Se o produto não foi encontrado
      if (error instanceof Error && error.message.includes('Record to update not found')) {
        return res.status(404).json({ error: 'Produto não encontrado' });
      }

      console.error('Erro ao atualizar produto:', error);
      return res.status(500).json({
        error: 'Erro ao atualizar produto',
        details: error instanceof Error ? error.message : 'Erro desconhecido',
      });
    }
  }

  // DELETE - Remove produto
  if (req.method === 'DELETE') {
    try {
      // Verifica se o produto existe
      const produto = await prisma.produto.findUnique({
        where: { id },
      });

      if (!produto) {
        return res.status(404).json({ error: 'Produto não encontrado' });
      }

      // Verifica se há itens de pedido associados a este produto
      const itensPedido = await prisma.itemPedido.findFirst({
        where: { produtoId: id },
      });

      if (itensPedido) {
        return res.status(409).json({
          error: 'Não é possível deletar este produto pois existem pedidos associados a ele',
        });
      }

      // Deleta o produto
      await prisma.produto.delete({
        where: { id },
      });

      return res.status(200).json({
        message: 'Produto deletado com sucesso',
        produto,
      });
    } catch (error) {
      console.error('Erro ao deletar produto:', error);
      return res.status(500).json({
        error: 'Erro ao deletar produto',
        details: error instanceof Error ? error.message : 'Erro desconhecido',
      });
    }
  }

  return res.status(405).json({ error: 'Método não permitido' });
}

// Exporta o handler protegido pelo middleware de admin
export default requireAdmin(handler);
