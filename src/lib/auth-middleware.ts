// ===========================================
// Arquivo responsável por middlewares de autenticação para rotas de API.
// Fornece funções para proteger rotas com base no status de autenticação
// e tipo de usuário (admin ou cliente).
// ===========================================

import type { NextApiRequest, NextApiResponse } from 'next';
import { parse } from 'cookie';
import { verificarToken, JwtPayload } from './jwt';

// Interface estendida da requisição que inclui os dados do usuário autenticado
export interface NextApiRequestWithUser extends NextApiRequest {
  user?: JwtPayload;
}

// Extrai e verifica o token de autenticação da requisição
export function autenticarRequisicao(
  req: NextApiRequestWithUser
): JwtPayload | null {
  const cookies = parse(req.headers.cookie || '');
  const token = cookies.auth_token;

  if (!token) {
    return null;
  }

  const payload = verificarToken(token);
  return payload;
}

// Middleware que exige autenticação para acessar a rota
export function requireAuth(
  handler: (req: NextApiRequestWithUser, res: NextApiResponse) => Promise<void>
) {
  return async (req: NextApiRequestWithUser, res: NextApiResponse) => {
    const user = autenticarRequisicao(req);

    if (!user) {
      return res.status(401).json({ error: 'Não autenticado' });
    }

    // Adiciona os dados do usuário à requisição
    req.user = user;
    return handler(req, res);
  };
}

// Middleware que exige autenticação e permissão de administrador
export function requireAdmin(
  handler: (req: NextApiRequestWithUser, res: NextApiResponse) => Promise<void>
) {
  return async (req: NextApiRequestWithUser, res: NextApiResponse) => {
    const user = autenticarRequisicao(req);

    if (!user) {
      return res.status(401).json({ error: 'Não autenticado' });
    }

    // Verifica se o usuário é administrador
    if (user.tipo !== 'ADMIN') {
      return res.status(403).json({ error: 'Acesso negado. Apenas administradores.' });
    }

    req.user = user;
    return handler(req, res);
  };
}
