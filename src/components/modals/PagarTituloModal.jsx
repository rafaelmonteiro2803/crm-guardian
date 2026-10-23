import React, { useState } from "react";

// Data local (yyyy-mm-dd), sem o deslocamento de fuso do toISOString
const hojeLocal = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};

export function PagarTituloModal({ titulo, fmtBRL, onConfirmar, onFechar }) {
  const [dataPagamento, setDataPagamento] = useState(hojeLocal());
  const [erro, setErro] = useState(false);
  const [salvando, setSalvando] = useState(false);

  const handleConfirmar = async () => {
    if (!dataPagamento) return setErro(true);
    setSalvando(true);
    try {
      await onConfirmar(dataPagamento);
    } finally {
      setSalvando(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg border border-gray-200 max-w-sm w-full p-4">
        <h3 className="text-sm font-semibold mb-1">Registrar Pagamento</h3>
        <p className="text-xs text-gray-500 mb-3">{titulo.descricao}</p>

        <div className="bg-gray-50 border border-gray-200 rounded p-2.5 mb-3 text-xs text-gray-700">
          <div className="flex justify-between">
            <span>Vencimento:</span>
            <span className="font-medium">{(titulo.data_vencimento || "").split("-").reverse().join("/")}</span>
          </div>
          <div className="flex justify-between mt-0.5">
            <span>Valor:</span>
            <span className="font-semibold">R$ {fmtBRL(titulo.valor)}</span>
          </div>
        </div>

        <div>
          <label className="block text-xs text-gray-600 mb-0.5">Data do Pagamento *</label>
          <input
            type="date"
            value={dataPagamento}
            onChange={(e) => {
              setDataPagamento(e.target.value);
              setErro(false);
            }}
            className={`w-full border ${erro ? "border-red-500" : "border-gray-200"} rounded px-2.5 py-1.5 text-sm focus:ring-1 focus:ring-gray-400 outline-none`}
            autoFocus
          />
        </div>

        <div className="flex gap-2 mt-4">
          <button onClick={onFechar} className="flex-1 px-3 py-1.5 border border-gray-200 rounded text-xs hover:bg-gray-50">
            Cancelar
          </button>
          <button
            onClick={handleConfirmar}
            disabled={salvando}
            className="flex-1 px-3 py-1.5 bg-green-600 text-white rounded text-xs hover:bg-green-700 disabled:opacity-50"
          >
            {salvando ? "Salvando..." : "Confirmar Pagamento"}
          </button>
        </div>
      </div>
    </div>
  );
}
