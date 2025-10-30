import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    // Buscar contagem de registros
    const [usuariosCount, produtosCount, pedidosCount, itensCount] = await Promise.all([
      prisma.usuario.count(),
      prisma.produto.count(),
      prisma.pedido.count(),
      prisma.itemPedido.count(),
    ]);

    // Buscar alguns produtos como exemplo
    const produtosExemplo = await prisma.produto.findMany({
      take: 3,
      select: {
        id: true,
        nome: true,
        preco: true,
        quantidade: true,
      },
    });

    // Buscar alguns usuários
    const usuarios = await prisma.usuario.findMany({
      select: {
        id: true,
        nome: true,
        email: true,
        tipo: true,
      },
    });

    // Retornar sucesso com informações
    res.status(200).json({
      success: true,
      message: 'Conexão com SQLite + Prisma estabelecida com sucesso!',
      database: {
        type: 'SQLite',
        file: 'prisma/dev.db',
        connection: 'OK',
      },
      statistics: {
        usuarios: usuariosCount,
        produtos: produtosCount,
        pedidos: pedidosCount,
        itensPedido: itensCount,
      },
      sample_data: {
        produtos: produtosExemplo,
        usuarios: usuarios,
      },
    });
  } catch (error) {
    console.error('Erro ao conectar com o banco:', error);

    res.status(500).json({
      success: false,
      message: 'Erro ao conectar com o banco de dados',
      error: error instanceof Error ? error.message : 'Erro desconhecido',
    });
  }
}
