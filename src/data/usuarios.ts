import { Usuario } from '@/types/usuario';

// Usuários mockados para teste
// Senha em texto plano apenas para demonstração (nunca fazer isso em produção!)
export const usuariosMockados: Usuario[] = [
  {
    id: '1',
    nome: 'Administrador',
    email: 'admin@overzone.com',
    senha: 'admin123',
    tipo: 'admin'
  },
  {
    id: '2',
    nome: 'João Silva',
    email: 'joao@email.com',
    senha: '123456',
    tipo: 'cliente'
  },
  {
    id: '3',
    nome: 'Maria Santos',
    email: 'maria@email.com',
    senha: '123456',
    tipo: 'cliente'
  }
];
