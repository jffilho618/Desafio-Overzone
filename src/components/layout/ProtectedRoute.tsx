import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/contexts/AuthContext';
import { TipoUsuario } from '@/types/usuario';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: TipoUsuario; // Se especificado, verifica o tipo de usuário
}

// Componente para proteger rotas que requerem autenticação
export default function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const { estaAutenticado, usuario, estaCarregando } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Aguarda o carregamento do estado de autenticação
    if (estaCarregando) return;

    // Se não está autenticado, redireciona para o login
    if (!estaAutenticado) {
      router.push(`/login?redirect=${router.pathname}`);
      return;
    }

    // Se um tipo específico de usuário é requerido, verifica
    if (requiredRole && usuario?.tipo !== requiredRole) {
      // Redireciona para página inicial se não tiver permissão
      router.push('/');
    }
  }, [estaAutenticado, usuario, requiredRole, estaCarregando, router]);

  // Mostra loading enquanto verifica autenticação
  if (estaCarregando) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  // Se não está autenticado ou não tem permissão, não renderiza nada
  // (o useEffect acima já faz o redirect)
  if (!estaAutenticado || (requiredRole && usuario?.tipo !== requiredRole)) {
    return null;
  }

  // Renderiza os children se tudo estiver ok
  return <>{children}</>;
}
