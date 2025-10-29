// ===========================================
// API de login de usuários.
// Valida as credenciais, gera um token JWT e o armazena em um cookie httpOnly
// para manter a sessão do usuário de forma segura.
// ===========================================

import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';
import { gerarToken } from '@/lib/jwt';
import * as bcrypt from 'bcryptjs';
import { serialize } from 'cookie';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Aceita apenas requisições POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  try {
    const { email, senha } = req.body;

    // Valida se email e senha foram fornecidos
    if (!email || !senha) {
      return res.status(400).json({ error: 'Email e senha são obrigatórios' });
    }

    // Busca o usuário no banco de dados
    const usuario = await prisma.usuario.findUnique({
      where: { email },
    });

    if (!usuario) {
      return res.status(401).json({ error: 'Email ou senha inválidos' });
    }

    // Verifica se a senha está correta usando bcrypt
    const senhaValida = await bcrypt.compare(senha, usuario.senhaHash);

    if (!senhaValida) {
      return res.status(401).json({ error: 'Email ou senha inválidos' });
    }

    // Gera o token JWT com os dados do usuário
    const token = gerarToken({
      userId: usuario.id,
      email: usuario.email,
      tipo: usuario.tipo,
    });

    // Cria um cookie httpOnly com o token para segurança
    const cookie = serialize('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7, // 7 dias
      path: '/',
    });

    res.setHeader('Set-Cookie', cookie);

    // Retorna os dados do usuário (sem a senha)
    return res.status(200).json({
      usuario: {
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
        tipo: usuario.tipo,
      },
      token,
    });
  } catch (error) {
    console.error('Erro no login:', error);
    return res.status(500).json({ error: 'Erro ao realizar login' });
  }
}
