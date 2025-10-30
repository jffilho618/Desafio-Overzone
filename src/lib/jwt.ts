// ===========================================
// Arquivo responsável por gerenciar tokens JWT de autenticação.
// Centraliza a lógica de geração e verificação de tokens,
// garantindo a segurança das sessões dos usuários.
// ===========================================

import jwt, { Secret } from 'jsonwebtoken';

// Chave secreta para assinar os tokens JWT
const JWT_SECRET: Secret = process.env.JWT_SECRET || 'sua-chave-super-secreta-jwt-aqui-troque-em-producao';

// Interface que define os dados armazenados no token
export interface JwtPayload {
  userId: string;
  email: string;
  tipo: 'ADMIN' | 'CLIENTE';
}

// Gera um novo token JWT com os dados do usuário
export function gerarToken(payload: JwtPayload): string {
  // @ts-expect-error - O TypeScript tem problemas com a tipagem do expiresIn, mas funciona corretamente em runtime
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
}

// Verifica e decodifica um token JWT, retornando os dados ou null se inválido
export function verificarToken(token: string): JwtPayload | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
    return decoded;
  } catch (error) {
    console.error('Erro ao verificar token:', error);
    return null;
  }
}
