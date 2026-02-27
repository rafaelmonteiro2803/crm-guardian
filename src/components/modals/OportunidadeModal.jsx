import React, { useState } from "react";
import { ESTAGIOS } from "../../constants/oportunidades";

const FORM_INICIAL = {
  titulo: "",
  cliente_id: "",
  produto_id: "",
  valor: "",
  estagio: "prospecção",
  data_inicio: new Date().toISOString().split("T")[0],
};

export function OportunidadeModal({ editando, clientes, produtos, fmtBRL, onSalvar, onFechar }) {
  const [form, setForm] = useState(() =>
    editando
      ? {
          titulo: editando.titulo,
          cliente_id: editando.cliente_id,
          produto_id: editando.produto_id || "",
          valor: editando.valor.toString(),
          estagio: editando.estagio,
          data_inicio: editando.data_inicio,
        }
      : FORM_INICIAL
  );

  const set = (field, value) => setForm((f) => ({ ...f, [field]: value }));

  const handleProduto = (pid) => {
    const prod = produtos.find((p) => p.id === pid);
    setForm((f) => ({ ...f, produto_id: pid, valor: prod ? prod.preco_base.toString() : f.valor }));
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg border border-gray-200 max-w-sm w-full p-4">
        <h3 className="text-sm font-semibold mb-3">
          {editando ? "Editar Oportunidade" : "Nova Oportunidade"}
        </h3>
        <div className="space-y-2.5">
          <div>
            <label className="block text-xs text-gray-600 mb-0.5">Título *</label>
            <input type="text" value={form.titulo} onChange={(e) => set("titulo", e.target.value)}
              className="w-full border border-gray-200 rounded px-2.5 py-1.5 text-sm focus:ring-1 focus:ring-gray-400 outline-none" />
          </div>
          <div>
            <label className="block text-xs text-gray-600 mb-0.5">Cliente *</label>
            <select value={form.cliente_id} onChange={(e) => set("cliente_id", e.target.value)}
              className="w-full border border-gray-200 rounded px-2.5 py-1.5 text-sm focus:ring-1 focus:ring-gray-400 outline-none">
              <option value="">Selecione</option>
              {clientes.map((c) => <option key={c.id} value={c.id}>{c.nome}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs text-gray-600 mb-0.5">Produto</label>
            <select value={form.produto_id} onChange={(e) => handleProduto(e.target.value)}
              className="w-full border border-gray-200 rounded px-2.5 py-1.5 text-sm focus:ring-1 focus:ring-gray-400 outline-none">
              <option value="">Nenhum</option>
              {produtos.filter((p) => p.ativo !== false).map((p) => (
                <option key={p.id} value={p.id}>{p.nome} — R$ {fmtBRL(p.preco_base)}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs text-gray-600 mb-0.5">Valor (R$)</label>
            <input type="number" step="0.01" value={form.valor} onChange={(e) => set("valor", e.target.value)}
              className="w-full border border-gray-200 rounded px-2.5 py-1.5 text-sm focus:ring-1 focus:ring-gray-400 outline-none" />
          </div>
          <div>
            <label className="block text-xs text-gray-600 mb-0.5">Estágio</label>
            <select value={form.estagio} onChange={(e) => set("estagio", e.target.value)}
              className="w-full border border-gray-200 rounded px-2.5 py-1.5 text-sm focus:ring-1 focus:ring-gray-400 outline-none">
              {ESTAGIOS.map((e) => (
                <option key={e} value={e}>{e.charAt(0).toUpperCase() + e.slice(1)}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs text-gray-600 mb-0.5">Data de Início</label>
            <input type="date" value={form.data_inicio} onChange={(e) => set("data_inicio", e.target.value)}
              className="w-full border border-gray-200 rounded px-2.5 py-1.5 text-sm focus:ring-1 focus:ring-gray-400 outline-none" />
          </div>
        </div>
        <div className="flex gap-2 mt-4">
          <button onClick={onFechar} className="flex-1 px-3 py-1.5 border border-gray-200 rounded text-xs hover:bg-gray-50">Cancelar</button>
          <button onClick={() => onSalvar(form)} className="flex-1 px-3 py-1.5 bg-gray-800 text-white rounded text-xs hover:bg-gray-700">
            {editando ? "Salvar" : "Adicionar"}
          </button>
        </div>
      </div>
    </div>
  );
}
