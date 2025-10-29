import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'GET') {
    try {
      const produtos = await prisma.produto.findMany({
        where: {
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

  return res.status(405).json({ error: 'Método não permitido' });
}
