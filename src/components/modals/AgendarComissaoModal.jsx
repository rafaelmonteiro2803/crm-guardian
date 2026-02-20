import React, { useState } from "react";

export function AgendarComissaoModal({ comissao, getTecnicoNome, fmtBRL, onAgendar, onFechar }) {
  const [form, setForm] = useState({
    data_agendamento: comissao.data_agendamento || new Date().toISOString().split("T")[0],
    observacoes: comissao.observacoes || "",
  });

  const set = (field, value) => setForm((f) => ({ ...f, [field]: value }));

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg border border-gray-200 max-w-xs w-full p-4">
        <h3 className="text-sm font-semibold mb-3">Agendar Pagamento de Comissão</h3>
        <div className="bg-yellow-50 border border-yellow-200 rounded p-2.5 mb-3">
          <p className="text-xs font-semibold text-gray-700">{getTecnicoNome(comissao.tecnico_id)}</p>
          <p className="text-lg font-bold text-blue-700">R$ {fmtBRL(comissao.valor)}</p>
          {parseFloat(comissao.percentual || 0) > 0 && (
            <p className="text-[10px] text-gray-500">{comissao.percentual}% de comissão</p>
          )}
        </div>
        <div className="space-y-2.5">
          <div>
            <label className="block text-xs text-gray-600 mb-0.5">Data do Pagamento *</label>
            <input type="date" value={form.data_agendamento} onChange={(e) => set("data_agendamento", e.target.value)}
              className="w-full border border-gray-200 rounded px-2.5 py-1.5 text-sm focus:ring-1 focus:ring-gray-400 outline-none" />
          </div>
          <div>
            <label className="block text-xs text-gray-600 mb-0.5">Observações</label>
            <textarea value={form.observacoes} onChange={(e) => set("observacoes", e.target.value)}
              placeholder="Ex: transferência banco X, data combinada..."
              className="w-full border border-gray-200 rounded px-2.5 py-1.5 text-sm focus:ring-1 focus:ring-gray-400 outline-none" rows="2" />
          </div>
        </div>
        <div className="flex gap-2 mt-4">
          <button onClick={onFechar} className="flex-1 px-3 py-1.5 border border-gray-200 rounded text-xs hover:bg-gray-50">Cancelar</button>
          <button onClick={() => onAgendar(form)}
            className="flex-1 px-3 py-1.5 bg-yellow-600 text-white rounded text-xs hover:bg-yellow-700 font-medium">Agendar</button>
        </div>
      </div>
    </div>
  );
}
