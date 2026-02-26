import React, { useState } from "react";

export function EvolucaoModal({ aberto, os, onFechar, onSalvar }) {
  const [novoTexto, setNovoTexto] = useState("");

  if (!aberto || !os) return null;

  const handleSalvar = () => {
    if (!novoTexto.trim()) return;
    const agora = new Date().toLocaleString("pt-BR", {
      day: "2-digit", month: "2-digit", year: "numeric",
      hour: "2-digit", minute: "2-digit",
    });
    const entrada = `[${agora}]\n${novoTexto.trim()}`;
    const textoFinal = os.observacoes
      ? `${os.observacoes}\n\n${entrada}`
      : entrada;
    onSalvar(os.id, textoFinal);
    setNovoTexto("");
  };

  const handleFechar = () => {
    setNovoTexto("");
    onFechar();
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg border border-gray-200 max-w-lg w-full p-4 max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="text-sm font-semibold text-gray-800">Evolução do Atendimento</h3>
            <p className="text-[11px] text-gray-400 mt-0.5">OS: {os.numero_os}</p>
          </div>
          <button onClick={handleFechar} className="text-gray-400 hover:text-gray-600 p-1 rounded hover:bg-gray-100">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {os.observacoes ? (
          <div className="mb-3 flex-1 overflow-y-auto">
            <label className="block text-xs font-medium text-gray-500 mb-1">Histórico</label>
            <div className="bg-gray-50 border border-gray-200 rounded p-3 text-xs text-gray-700 whitespace-pre-wrap leading-relaxed max-h-48 overflow-y-auto font-mono">
              {os.observacoes}
            </div>
          </div>
        ) : (
          <div className="mb-3 bg-gray-50 border border-gray-100 rounded p-3 text-xs text-gray-400 italic">
            Nenhuma evolução registrada ainda.
          </div>
        )}

        <div className="mb-3">
          <label className="block text-xs font-medium text-gray-600 mb-1">Nova Entrada</label>
          <textarea
            value={novoTexto}
            onChange={(e) => setNovoTexto(e.target.value)}
            placeholder="Descreva a evolução do atendimento..."
            className="w-full border border-gray-200 rounded px-2.5 py-1.5 text-sm focus:ring-1 focus:ring-gray-400 outline-none resize-none"
            rows={4}
            autoFocus
          />
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleFechar}
            className="flex-1 px-3 py-1.5 border border-gray-200 rounded text-xs hover:bg-gray-50"
          >
            Cancelar
          </button>
          <button
            onClick={handleSalvar}
            disabled={!novoTexto.trim()}
            className="flex-1 px-3 py-1.5 bg-gray-800 text-white rounded text-xs hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Salvar Evolução
          </button>
        </div>
      </div>
    </div>
  );
}
