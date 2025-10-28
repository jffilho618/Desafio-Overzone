interface DialogoConfirmacaoProps {
  estaAberto: boolean;
  titulo: string;
  mensagem: string;
  aoConfirmar: () => void;
  aoCancelar: () => void;
}

export default function DialogoConfirmacao({
  estaAberto,
  titulo,
  mensagem,
  aoConfirmar,
  aoCancelar,
}: DialogoConfirmacaoProps) {
  // Não renderiza nada se o diálogo estiver fechado
  if (!estaAberto) return null;

  return (
    // Overlay escuro de fundo
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      {/* Modal centralizado */}
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        <div className="p-6">
          {/* Título do diálogo */}
          <h3 className="text-lg font-bold text-gray-900 mb-2">{titulo}</h3>

          {/* Mensagem do diálogo */}
          <p className="text-gray-600 mb-6">{mensagem}</p>

          {/* Botões de ação */}
          <div className="flex gap-3">
            <button
              onClick={aoCancelar}
              className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors font-medium"
            >
              Cancelar
            </button>
            <button
              onClick={aoConfirmar}
              className="flex-1 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors font-medium"
            >
              Confirmar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
