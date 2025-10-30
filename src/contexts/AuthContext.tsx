// ===========================================
// Contexto de autenticação da aplicação.
// Gerencia o estado do usuário logado, fornece funções de login e logout,
// e persiste a sessão no localStorage.
// ===========================================

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { UsuarioAutenticado } from '@/types/usuario';

// Interface do contexto de autenticação
interface AuthContextData {
  usuario: UsuarioAutenticado | null;
  estaAutenticado: boolean;
  estaCarregando: boolean;
  login: (email: string, senha: string) => Promise<boolean>;
  logout: () => Promise<void>;
}

// Cria o contexto
const AuthContext = createContext<AuthContextData>({} as AuthContextData);

// Props do provider
interface AuthProviderProps {
  children: ReactNode;
}

// Chave para armazenar os dados do usuário no localStorage
const STORAGE_KEY = 'overzone_usuario';

// Provider do contexto de autenticação
export function AuthProvider({ children }: AuthProviderProps) {
  const [usuario, setUsuario] = useState<UsuarioAutenticado | null>(null);
  const [estaCarregando, setEstaCarregando] = useState(true);

  // Carrega o usuário do localStorage ao montar e valida com o servidor
  useEffect(() => {
    const carregarUsuario = async () => {
      try {
        const usuarioSalvo = localStorage.getItem(STORAGE_KEY);
        if (usuarioSalvo) {
          const usuarioParseado = JSON.parse(usuarioSalvo);

          // Valida o token com o servidor
          const resposta = await fetch('/api/auth/me');
          if (resposta.ok) {
            const dadosUsuario = await resposta.json();
            const usuarioAtualizado: UsuarioAutenticado = {
              ...dadosUsuario,
              token: usuarioParseado.token,
            };
            setUsuario(usuarioAtualizado);
            localStorage.setItem(STORAGE_KEY, JSON.stringify(usuarioAtualizado));
          } else {
            // Token inválido, remove do localStorage
            localStorage.removeItem(STORAGE_KEY);
          }
        }
      } catch (erro) {
        console.error('Erro ao carregar usuário:', erro);
        localStorage.removeItem(STORAGE_KEY);
      } finally {
        setEstaCarregando(false);
      }
    };

    carregarUsuario();
  }, []);

  // Realiza o login do usuário
  const login = async (email: string, senha: string): Promise<boolean> => {
    try {
      const resposta = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, senha }),
      });

      if (!resposta.ok) {
        return false;
      }

      const dados = await resposta.json();

      const usuarioAutenticado: UsuarioAutenticado = {
        id: dados.usuario.id,
        nome: dados.usuario.nome,
        email: dados.usuario.email,
        tipo: dados.usuario.tipo,
        token: dados.token,
      };

      setUsuario(usuarioAutenticado);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(usuarioAutenticado));

      return true;
    } catch (erro) {
      console.error('Erro no login:', erro);
      return false;
    }
  };

  // Realiza o logout do usuário
  const logout = async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
      });
    } catch (erro) {
      console.error('Erro no logout:', erro);
    } finally {
      setUsuario(null);
      localStorage.removeItem(STORAGE_KEY);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        usuario,
        estaAutenticado: !!usuario,
        estaCarregando,
        login,
        logout,
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
