import React, { useState } from "react";

const formInicial = () => ({
  venda_id: "",
  descricao: "",
  valor: "",
  data_emissao: new Date().toISOString().split("T")[0],
  data_vencimento: "",
  status: "pendente",
});

export function TituloModal({ editando, vendas, titulos, fmtBRL, onSalvar, onFechar }) {
  const [form, setForm] = useState(() => {
    if (editando) {
      return {
        venda_id: editando.venda_id || "",
        descricao: editando.descricao,
        valor: editando.valor.toString(),
        data_emissao: editando.data_emissao,
        data_vencimento: editando.data_vencimento,
        status: editando.status,
      };
    }
    return formInicial();
  });

  const set = (patch) => setForm((f) => ({ ...f, ...patch }));

  const vendaRel = form.venda_id ? vendas.find((v) => v.id === form.venda_id) : null;
  const saldoVenda = vendaRel
    ? vendaRel.valor -
      titulos
        .filter(
          (t) =>
            t.venda_id === vendaRel.id &&
            t.status === "pago" &&
            (!editando || t.id !== editando.id)
        )
        .reduce((a, t) => a + Number(t.valor), 0)
    : null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg border border-gray-200 max-w-sm w-full p-4">
        <h3 className="text-sm font-semibold mb-3">{editando ? "Editar Título" : "Novo Título"}</h3>
        <div className="space-y-2.5">

          {vendaRel && (
            <div className="bg-gray-50 border border-gray-200 rounded p-2.5 space-y-1">
              <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-wide">Venda Relacionada</p>
              <div className="flex justify-between text-xs">
                <span className="text-gray-700">{vendaRel.descricao}</span>
                <span className="font-medium">R$ {Number(vendaRel.valor).toFixed(2)}</span>
              </div>
              <div className="flex justify-between border-t border-gray-200 pt-1 text-xs">
                <span className="font-medium text-gray-700">Saldo</span>
                <span className={`font-semibold ${saldoVenda > 0 ? "text-yellow-600" : "text-green-600"}`}>
                  R$ {saldoVenda.toFixed(2)}
                </span>
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs text-gray-600 mb-0.5">Descrição *</label>
            <input
              type="text"
              value={form.descricao}
              onChange={(e) => set({ descricao: e.target.value })}
              className="w-full border border-gray-200 rounded px-2.5 py-1.5 text-sm focus:ring-1 focus:ring-gray-400 outline-none"
            />
          </div>

          <div>
            <label className="block text-xs text-gray-600 mb-0.5">Valor (R$) *</label>
            <input
              type="number"
              step="0.01"
              value={form.valor}
              onChange={(e) => set({ valor: e.target.value })}
              className="w-full border border-gray-200 rounded px-2.5 py-1.5 text-sm focus:ring-1 focus:ring-gray-400 outline-none"
            />
          </div>

          <div>
            <label className="block text-xs text-gray-600 mb-0.5">Emissão</label>
            <input
              type="date"
              value={form.data_emissao}
              onChange={(e) => set({ data_emissao: e.target.value })}
              className="w-full border border-gray-200 rounded px-2.5 py-1.5 text-sm focus:ring-1 focus:ring-gray-400 outline-none"
            />
          </div>

          <div>
            <label className="block text-xs text-gray-600 mb-0.5">Vencimento *</label>
            <input
              type="date"
              value={form.data_vencimento}
              onChange={(e) => set({ data_vencimento: e.target.value })}
              className="w-full border border-gray-200 rounded px-2.5 py-1.5 text-sm focus:ring-1 focus:ring-gray-400 outline-none"
            />
          </div>

          <div>
            <label className="block text-xs text-gray-600 mb-0.5">Status</label>
            <select
              value={form.status}
              onChange={(e) => set({ status: e.target.value })}
              className="w-full border border-gray-200 rounded px-2.5 py-1.5 text-sm focus:ring-1 focus:ring-gray-400 outline-none"
            >
              <option value="pendente">Pendente</option>
              <option value="pago">Pago</option>
            </select>
          </div>
        </div>

        <div className="flex gap-2 mt-4">
          <button onClick={onFechar} className="flex-1 px-3 py-1.5 border border-gray-200 rounded text-xs hover:bg-gray-50">
            Cancelar
          </button>
          <button onClick={() => onSalvar(form)} className="flex-1 px-3 py-1.5 bg-gray-800 text-white rounded text-xs hover:bg-gray-700">
            {editando ? "Salvar" : "Adicionar"}
          </button>
        </div>
      </div>
    </div>
  );
}
