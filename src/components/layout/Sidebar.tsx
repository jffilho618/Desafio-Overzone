import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAuth } from '@/contexts/AuthContext';

export default function Sidebar() {
  const router = useRouter();
  const { usuario } = useAuth();

  // Define se um link está ativo baseado na rota atual
  const estaAtivo = (caminho: string) => router.pathname === caminho;

  return (
    <aside className="w-64 bg-white border-r border-gray-200 min-h-screen">
      <div className="p-6">
        {/* Logo / Título */}
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Painel</h2>

        {/* Menu de navegação */}
        <nav className="space-y-2">
          {/* Link Meus Pedidos - Todos podem ver */}
          <Link
            href="/meus-pedidos"
            className={`block px-4 py-3 rounded-md transition-colors ${
              estaAtivo('/meus-pedidos')
                ? 'bg-blue-50 text-blue-600 font-medium'
                : 'text-gray-700 hover:bg-gray-50'
            }`}
          >
            <div className="flex items-center gap-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
              <span>Meus Pedidos</span>
            </div>
          </Link>

          {/* Link Estoque - Apenas Admin */}
          {usuario?.tipo === 'ADMIN' && (
            <Link
              href="/estoque"
              className={`block px-4 py-3 rounded-md transition-colors ${
                estaAtivo('/estoque')
                  ? 'bg-blue-50 text-blue-600 font-medium'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center gap-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                  />
                </svg>
                <span>Estoque</span>
              </div>
            </Link>
          )}
        </nav>

        {/* Informações do usuário */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <div className="px-4">
            <p className="text-xs text-gray-500 mb-1">Logado como:</p>
            <p className="text-sm font-medium text-gray-900">{usuario?.nome}</p>
            <p className="text-xs text-gray-500 mt-1">
              {usuario?.tipo === 'ADMIN' ? 'Administrador' : 'Cliente'}
            </p>
          </div>
        </div>

        {/* Botão Voltar à Loja */}
        <div className="mt-6">
          <Link
            href="/"
            className="block px-4 py-2 text-center text-sm text-gray-600 hover:text-gray-900 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
          >
            ← Voltar à Loja
          </Link>
        </div>
      </div>
    </aside>
  );
}
