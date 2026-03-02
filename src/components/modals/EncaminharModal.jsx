import React, { useState } from "react";
import { Icons } from "../Icons";

export function EncaminharModal({ os, tecnicos, getClienteNome, fmtBRL, onEncaminhar, onFechar }) {
  const itens = Array.isArray(os.itens) ? os.itens : [];
  const jasSelecionados = Array.isArray(os.itens_selecionados) ? os.itens_selecionados : [];

  // Expand items by quantity so each unit gets its own checkbox
  const expandedItems = itens.flatMap((item, itemIdx) => {
    const qty = parseInt(item.quantidade) || 1;
    if (qty <= 1) return [{ ...item, itemIdx, unitIdx: null }];
    return Array.from({ length: qty }, (_, i) => ({ ...item, itemIdx, unitIdx: i + 1 }));
  });

  const [form, setForm] = useState({
    tecnico_id: os.tecnico_id || "",
    comissao_percentual: os.comissao_percentual?.toString() || "",
    comissao_valor: os.comissao_valor?.toString() || "",
  });

  const [itensSelecionados, setItensSelecionados] = useState(
    expandedItems.map((ei) => jasSelecionados.includes(ei.itemIdx))
  );

  const set = (field, value) => setForm((f) => ({ ...f, [field]: value }));

  const handlePct = (v) => {
    const pct = parseFloat(v) || 0;
    const val = ((pct / 100) * parseFloat(os.valor_total || 0)).toFixed(2);
    setForm((f) => ({ ...f, comissao_percentual: v, comissao_valor: val }));
  };

  const toggleItem = (idx) => {
    setItensSelecionados((prev) => {
      const next = [...prev];
      next[idx] = !next[idx];
      return next;
    });
  };

  const todosSelecionados = expandedItems.length > 0 && itensSelecionados.every(Boolean);
  const algumSelecionado = itensSelecionados.some(Boolean);

  const handleSubmit = () => {
    if (expandedItems.length > 0 && !algumSelecionado) {
      alert("Selecione pelo menos 1 produto/serviço para encaminhar!");
      return;
    }
    const indicesSelecionados = [
      ...new Set(expandedItems.filter((_, idx) => itensSelecionados[idx]).map((ei) => ei.itemIdx)),
    ];
    onEncaminhar({ ...form, itens_selecionados: indicesSelecionados });
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

        {expandedItems.length > 0 && (
          <div className="mb-3">
            <p className="text-xs font-medium text-gray-700 mb-1.5">
              Produtos/Serviços contratados *
              <span className="ml-1 text-[10px] font-normal text-gray-400">(selecione ao menos 1)</span>
            </p>
            <div className="border border-gray-200 rounded divide-y divide-gray-100 max-h-36 overflow-y-auto">
              {expandedItems.map((item, idx) => (
                <label key={idx} className="flex items-center gap-2 px-2.5 py-1.5 cursor-pointer hover:bg-gray-50">
                  <input
                    type="checkbox"
                    checked={!!itensSelecionados[idx]}
                    onChange={() => toggleItem(idx)}
                    className="accent-blue-700 w-3.5 h-3.5 shrink-0"
                  />
                  <span className="text-[11px] text-gray-700 flex-1">{item.nome}</span>
                  {item.unitIdx !== null && (
                    <span className="text-[10px] text-gray-400 shrink-0">({item.unitIdx}/{item.quantidade})</span>
                  )}
                </label>
              ))}
            </div>
            {!algumSelecionado && (
              <p className="text-[10px] text-red-500 mt-1">Nenhum item selecionado — ao menos 1 é obrigatório.</p>
            )}
            {!todosSelecionados && algumSelecionado && (
              <p className="text-[10px] text-orange-500 mt-1">Itens não selecionados permanecerão como atividade pendente.</p>
            )}
          </div>
        )}

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
          <button onClick={handleSubmit}
            className="flex-1 px-3 py-1.5 bg-blue-700 text-white rounded text-xs hover:bg-blue-800 inline-flex items-center justify-center gap-1">
            <Icons.ArrowRight className="w-3 h-3" />Encaminhar
          </button>
        </div>
      </div>
    </div>
  );
}
