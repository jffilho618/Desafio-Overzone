// ===========================================
// Página de login da aplicação.
// Permite que usuários façam login com email e senha,
// exibe credenciais de teste e redireciona após autenticação.
// ===========================================

import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useAuth } from "@/contexts/AuthContext";

export default function PaginaLogin() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [estaCarregando, setEstaCarregando] = useState(false);

  const { login, estaAutenticado } = useAuth();
  const router = useRouter();
  const { redirect } = router.query;

  // Se já está autenticado, redireciona para a página de destino
  useEffect(() => {
    if (estaAutenticado) {
      const destino = typeof redirect === "string" ? redirect : "/";
      router.push(destino);
    }
  }, [estaAutenticado, redirect, router]);

  // Manipula o envio do formulário de login
  const aoEnviarFormulario = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro("");
    setEstaCarregando(true);

    const sucesso = await login(email, senha);

    if (sucesso) {
      const destino = typeof redirect === "string" ? redirect : "/";
      router.push(destino);
    } else {
      setErro("Email ou senha incorretos");
      setEstaCarregando(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Card de Login */}
        <div className="bg-white rounded-lg shadow-xl p-8">
          {/* Logo/Título */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Overzone</h1>
            <p className="text-gray-600">Entre na sua conta</p>
          </div>

          {/* Formulário */}
          <form onSubmit={aoEnviarFormulario} className="space-y-6">
            {/* Mensagem de erro */}
            {erro && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
                {erro}
              </div>
            )}

            {/* Campo Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="seu@email.com"
              />
            </div>

            {/* Campo Senha */}
            <div>
              <label
                htmlFor="senha"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Senha
              </label>
              <input
                id="senha"
                type="password"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="••••••••"
              />
            </div>

            {/* Botão de Login */}
            <button
              type="submit"
              disabled={estaCarregando}
              className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {estaCarregando ? "Entrando..." : "Entrar"}
            </button>
          </form>

          {/* Contas de teste */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-600 mb-3 text-center font-medium">
              Contas de teste:
            </p>
            <div className="space-y-2 text-xs text-gray-500">
              <div className="bg-gray-50 p-3 rounded">
                <p className="font-medium text-gray-700 mb-1">Admin:</p>
                <p>Email: admin@overzone.com</p>
                <p>Senha: admin123</p>
              </div>
              <div className="bg-gray-50 p-3 rounded">
                <p className="font-medium text-gray-700 mb-1">Cliente:</p>
                <p>Email: joao@email.com</p>
                <p>Senha: 123456</p>
              </div>
            </div>
          </div>
        </div>

        {/* Botão Voltar */}
        <div className="text-center mt-4">
          <button
            onClick={() => router.push("/")}
            className="text-gray-600 hover:text-gray-900 text-sm"
          >
            ← Voltar para a loja
          </button>
        </div>
      </div>
    </div>
  );
}
