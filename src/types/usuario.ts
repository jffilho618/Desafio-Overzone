// Tipos de usuário no sistema (deve corresponder ao enum do Prisma)
export type TipoUsuario = 'ADMIN' | 'CLIENTE';

// Interface que representa um usuário
export interface Usuario {
  id: string;
  nome: string;
  email: string;
  senha: string; // Em produção, seria hash
  tipo: TipoUsuario;
}

// Dados do usuário autenticado (sem senha)
export interface UsuarioAutenticado {
  id: string;
  nome: string;
  email: string;
  tipo: TipoUsuario;
  token: string; // Token simulado
}
