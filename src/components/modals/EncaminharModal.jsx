import React, { useState } from "react";
import { Icons } from "../Icons";

export function EncaminharModal({ os, tecnicos, getClienteNome, fmtBRL, onEncaminhar, onFechar }) {
  const [form, setForm] = useState({
    tecnico_id: os.tecnico_id || "",
    comissao_percentual: os.comissao_percentual?.toString() || "",
    comissao_valor: os.comissao_valor?.toString() || "",
  });

  const set = (field, value) => setForm((f) => ({ ...f, [field]: value }));

  const handlePct = (v) => {
    const pct = parseFloat(v) || 0;
    const val = ((pct / 100) * parseFloat(os.valor_total || 0)).toFixed(2);
    setForm((f) => ({ ...f, comissao_percentual: v, comissao_valor: val }));
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg border border-gray-200 max-w-sm w-full p-4">
        <h3 className="text-sm font-semibold mb-3">Encaminhar para Técnico</h3>
        <div className="bg-gray-50 border border-gray-200 rounded p-2.5 mb-3 space-y-1">
          <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-wide">Ordem de Serviço</p>
          <div className="flex justify-between text-xs">
            <span className="font-mono text-gray-700">{os.numero_os}</span>
            <span className="font-medium text-green-700">R$ {fmtBRL(os.valor_total)}</span>
          </div>
          <p className="text-[11px] text-gray-600">{os.descricao}</p>
          <p className="text-[11px] text-gray-500">Cliente: {getClienteNome(os.cliente_id)}</p>
        </div>
        <div className="space-y-2.5">
          <div>
            <label className="block text-xs text-gray-600 mb-0.5">Técnico Responsável *</label>
            <select value={form.tecnico_id} onChange={(e) => set("tecnico_id", e.target.value)}
              className="w-full border border-gray-200 rounded px-2.5 py-1.5 text-sm focus:ring-1 focus:ring-gray-400 outline-none">
              <option value="">Selecione um técnico</option>
              {tecnicos.filter((t) => t.ativo !== false).map((t) => (
                <option key={t.id} value={t.id}>{t.nome}{t.especialidade ? ` — ${t.especialidade}` : ""}</option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs text-gray-600 mb-0.5">Comissão (%)</label>
              <input type="number" step="0.01" min="0" max="100" value={form.comissao_percentual}
                onChange={(e) => handlePct(e.target.value)} placeholder="0"
                className="w-full border border-gray-200 rounded px-2.5 py-1.5 text-sm focus:ring-1 focus:ring-gray-400 outline-none" />
            </div>
            <div>
              <label className="block text-xs text-gray-600 mb-0.5">Comissão (R$)</label>
              <input type="number" step="0.01" min="0" value={form.comissao_valor}
                onChange={(e) => set("comissao_valor", e.target.value)} placeholder="0,00"
                className="w-full border border-gray-200 rounded px-2.5 py-1.5 text-sm focus:ring-1 focus:ring-gray-400 outline-none" />
            </div>
          </div>
        </div>
        <div className="flex gap-2 mt-4">
          <button onClick={onFechar} className="flex-1 px-3 py-1.5 border border-gray-200 rounded text-xs hover:bg-gray-50">Cancelar</button>
          <button onClick={() => onEncaminhar(form)}
            className="flex-1 px-3 py-1.5 bg-blue-700 text-white rounded text-xs hover:bg-blue-800 inline-flex items-center justify-center gap-1">
            <Icons.ArrowRight className="w-3 h-3" />Encaminhar
          </button>
        </div>
      </div>
    </div>
  );
}
