import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAuth } from '@/contexts/AuthContext';
import { useCarrinho } from '@/contexts/CarrinhoContext';

export default function Header() {
  const { usuario, estaAutenticado, logout } = useAuth();
  const { quantidadeTotal } = useCarrinho();
  const router = useRouter();

  const aoClicarLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <h1 className="text-2xl font-bold text-blue-600">Overzone</h1>
          </Link>

          {/* Navegação */}
          <nav className="flex items-center gap-4">
            {/* Carrinho */}
            <Link
              href="/carrinho"
              className="relative p-2 text-gray-600 hover:text-blue-600 transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              {/* Badge de quantidade */}
              {quantidadeTotal > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {quantidadeTotal}
                </span>
              )}
            </Link>

            {/* Menu do usuário */}
            {estaAutenticado ? (
              <div className="flex items-center gap-3">
                {/* Botão Meus Pedidos */}
                <Link
                  href="/meus-pedidos"
                  className="text-sm text-gray-700 hover:text-blue-600 transition-colors"
                >
                  Meus Pedidos
                </Link>

                {/* Botão Estoque (apenas para admin) */}
                {usuario?.tipo === 'admin' && (
                  <Link
                    href="/estoque"
                    className="text-sm text-gray-700 hover:text-blue-600 transition-colors"
                  >
                    Estoque
                  </Link>
                )}

                {/* Nome do usuário */}
                <span className="text-sm text-gray-600">
                  Olá, {usuario?.nome}
                </span>

                {/* Botão Sair */}
                <button
                  onClick={aoClicarLogout}
                  className="text-sm bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded-md transition-colors"
                >
                  Sair
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="text-sm bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors"
              >
                Entrar
              </Link>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}
