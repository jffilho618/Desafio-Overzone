// ===========================================
// API de logout de usuários.
// Remove o cookie de autenticação, encerrando a sessão do usuário.
// ===========================================

import type { NextApiRequest, NextApiResponse } from 'next';
import { serialize } from 'cookie';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Aceita apenas requisições POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  // Remove o cookie de autenticação configurando maxAge como 0
  const cookie = serialize('auth_token', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 0,
    path: '/',
  });

  res.setHeader('Set-Cookie', cookie);

  return res.status(200).json({ message: 'Logout realizado com sucesso' });
}
