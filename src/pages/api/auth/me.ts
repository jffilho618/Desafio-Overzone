// ===========================================
// API para buscar dados do usuário autenticado.
// Retorna as informações do usuário logado com base no token JWT.
// Rota protegida que exige autenticação.
// ===========================================

import type { NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';
import { requireAuth, NextApiRequestWithUser } from '@/lib/auth-middleware';

async function handler(
  req: NextApiRequestWithUser,
  res: NextApiResponse
) {
  // Aceita apenas requisições GET
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  try {
    // Busca os dados do usuário autenticado no banco de dados
    const usuario = await prisma.usuario.findUnique({
      where: { id: req.user!.userId },
      select: {
        id: true,
        nome: true,
        email: true,
        tipo: true,
        criadoEm: true,
      },
    });

    if (!usuario) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    return res.status(200).json(usuario);
  } catch (error) {
    console.error('Erro ao buscar usuário:', error);
    return res.status(500).json({ error: 'Erro ao buscar dados do usuário' });
  }
}

// Exporta o handler protegido pelo middleware de autenticação
export default requireAuth(handler);
