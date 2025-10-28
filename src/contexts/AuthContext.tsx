import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { UsuarioAutenticado } from '@/types/usuario';
import { usuariosMockados } from '@/data/usuarios';

// Interface do contexto de autenticação
interface AuthContextData {
  usuario: UsuarioAutenticado | null;
  estaAutenticado: boolean;
  estaCarregando: boolean;
  login: (email: string, senha: string) => boolean;
  logout: () => void;
}

// Cria o contexto
const AuthContext = createContext<AuthContextData>({} as AuthContextData);

// Props do provider
interface AuthProviderProps {
  children: ReactNode;
}

// Chave para armazenar no localStorage
const STORAGE_KEY = 'overzone_usuario';

// Provider do contexto de autenticação
export function AuthProvider({ children }: AuthProviderProps) {
  const [usuario, setUsuario] = useState<UsuarioAutenticado | null>(null);
  const [estaCarregando, setEstaCarregando] = useState(true);

  // Carrega dados do usuário do localStorage ao montar
  useEffect(() => {
    try {
      const usuarioSalvo = localStorage.getItem(STORAGE_KEY);
      if (usuarioSalvo) {
        const usuarioParseado = JSON.parse(usuarioSalvo);
        setUsuario(usuarioParseado);
      }
    } catch (erro) {
      console.error('Erro ao carregar usuário do localStorage:', erro);
      localStorage.removeItem(STORAGE_KEY);
    } finally {
      setEstaCarregando(false);
    }
  }, []);

  // Função para fazer login
  const login = (email: string, senha: string): boolean => {
    // Busca o usuário nos dados mockados
    const usuarioEncontrado = usuariosMockados.find(
      (u) => u.email === email && u.senha === senha
    );

    if (!usuarioEncontrado) {
      return false; // Credenciais inválidas
    }

    // Gera um token simulado (apenas para demonstração)
    const tokenSimulado = `token_${usuarioEncontrado.id}_${Date.now()}`;

    // Cria objeto do usuário autenticado (sem a senha)
    const usuarioAutenticado: UsuarioAutenticado = {
      id: usuarioEncontrado.id,
      nome: usuarioEncontrado.nome,
      email: usuarioEncontrado.email,
      tipo: usuarioEncontrado.tipo,
      token: tokenSimulado
    };

    // Salva no estado e no localStorage
    setUsuario(usuarioAutenticado);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(usuarioAutenticado));

    return true; // Login bem-sucedido
  };

  // Função para fazer logout
  const logout = () => {
    setUsuario(null);
    localStorage.removeItem(STORAGE_KEY);
  };

  return (
    <AuthContext.Provider
      value={{
        usuario,
        estaAutenticado: !!usuario,
        estaCarregando,
        login,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// Hook personalizado para usar o contexto de autenticação
export function useAuth() {
  const contexto = useContext(AuthContext);

  if (!contexto) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }

  return contexto;
}
