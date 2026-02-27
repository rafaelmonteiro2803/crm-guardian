import React, { useState } from "react";
import { Icons } from "../Icons";

const formInicial = () => ({
  cliente_id: "",
  descricao: "",
  valor: "",
  data_venda: new Date().toISOString().split("T")[0],
  forma_pagamento: "à vista",
  observacoes: "",
  desconto: "",
  itens: [],
});

const fmtItens = (itens, desconto) => {
  const sub = itens.reduce(
    (s, i) => s + parseFloat(i.valor_unitario || 0) * parseFloat(i.quantidade || 1),
    0
  );
  return Math.max(sub - parseFloat(desconto || 0), 0);
};

export function VendaModal({ editando, clientes, produtos, fmtBRL, onSalvar, onFechar }) {
  const [form, setForm] = useState(() => {
    if (editando) {
      return {
        cliente_id: editando.cliente_id,
        descricao: editando.descricao,
        valor: editando.valor.toString(),
        data_venda: editando.data_venda,
        forma_pagamento: editando.forma_pagamento,
        observacoes: editando.observacoes || "",
        desconto: (editando.desconto ?? 0).toString(),
        itens: editando.itens || [],
      };
    }
    return formInicial();
  });

  const set = (patch) => setForm((f) => ({ ...f, ...patch }));

  const adicionarItem = () => {
    const sel = document.getElementById("venda-produto-select");
    const pid = sel?.value;
    if (!pid) return;
    const prod = produtos.find((p) => p.id === pid);
    if (!prod) return;
    set({
      itens: [
        ...form.itens,
        { produto_id: prod.id, nome: prod.nome, quantidade: 1, valor_unitario: parseFloat(prod.preco_base || 0) },
      ],
    });
    if (sel) sel.value = "";
  };

  const atualizarItem = (idx, patch) => {
    const n = [...form.itens];
    n[idx] = { ...n[idx], ...patch };
    set({ itens: n });
  };

  const removerItem = (idx) => set({ itens: form.itens.filter((_, i) => i !== idx) });

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg border border-gray-200 max-w-xl w-full p-4 max-h-[90vh] overflow-y-auto">
        <h3 className="text-sm font-semibold mb-3">{editando ? "Editar Venda" : "Nova Venda"}</h3>
        <div className="space-y-2.5">

          <div>
            <label className="block text-xs text-gray-600 mb-0.5">Cliente *</label>
            <select
              value={form.cliente_id}
              onChange={(e) => set({ cliente_id: e.target.value })}
              className="w-full border border-gray-200 rounded px-2.5 py-1.5 text-sm focus:ring-1 focus:ring-gray-400 outline-none"
            >
              <option value="">Selecione</option>
              {clientes.map((c) => <option key={c.id} value={c.id}>{c.nome}</option>)}
            </select>
          </div>

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
            <label className="block text-xs text-gray-600 mb-1">Produtos</label>
            <div className="flex gap-2 mb-2">
              <select
                id="venda-produto-select"
                className="flex-1 border border-gray-200 rounded px-2.5 py-1.5 text-sm focus:ring-1 focus:ring-gray-400 outline-none"
                defaultValue=""
              >
                <option value="">Selecione um produto</option>
                {produtos.filter((p) => p.ativo !== false).map((p) => (
                  <option key={p.id} value={p.id}>{p.nome} — R$ {fmtBRL(p.preco_base)}</option>
                ))}
              </select>
              <button
                type="button"
                onClick={adicionarItem}
                className="px-2.5 py-1.5 bg-gray-800 text-white rounded text-xs hover:bg-gray-700 flex items-center gap-1"
              >
                <Icons.Plus className="w-3 h-3" />Add
              </button>
            </div>
            {form.itens.length > 0 && (
              <div className="border border-gray-200 rounded overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="px-2 py-1 text-left text-[11px] text-gray-500">Produto</th>
                      <th className="px-2 py-1 text-left text-[11px] text-gray-500 w-16">Qtd</th>
                      <th className="px-2 py-1 text-left text-[11px] text-gray-500 w-24">Unit.</th>
                      <th className="px-2 py-1 text-left text-[11px] text-gray-500 w-24">Subtotal</th>
                      <th className="px-2 py-1 w-8"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {form.itens.map((item, idx) => (
                      <tr key={idx}>
                        <td className="px-2 py-1 text-xs">{item.nome}</td>
                        <td className="px-2 py-1">
                          <input
                            type="number"
                            min="1"
                            value={item.quantidade}
                            onChange={(e) => atualizarItem(idx, { quantidade: parseInt(e.target.value) || 1 })}
                            className="w-14 border rounded px-1.5 py-0.5 text-xs text-center"
                          />
                        </td>
                        <td className="px-2 py-1">
                          <input
                            type="number"
                            step="0.01"
                            value={item.valor_unitario}
                            onChange={(e) => atualizarItem(idx, { valor_unitario: parseFloat(e.target.value) || 0 })}
                            className="w-20 border rounded px-1.5 py-0.5 text-xs"
                          />
                        </td>
                        <td className="px-2 py-1 text-xs font-medium text-green-700">
                          R$ {fmtBRL(parseFloat(item.valor_unitario || 0) * parseFloat(item.quantidade || 1))}
                        </td>
                        <td className="px-2 py-1">
                          <button
                            type="button"
                            onClick={() => removerItem(idx)}
                            className="text-gray-400 hover:text-red-600 p-0.5"
                          >
                            <Icons.Trash className="w-3 h-3" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <div>
            <label className="block text-xs text-gray-600 mb-0.5">Desconto (R$)</label>
            <input
              type="number"
              step="0.01"
              value={form.desconto}
              onChange={(e) => set({ desconto: e.target.value })}
              className="w-full border border-gray-200 rounded px-2.5 py-1.5 text-sm focus:ring-1 focus:ring-gray-400 outline-none"
              placeholder="0,00"
            />
          </div>

          {form.itens.length > 0 ? (
            <div className="bg-gray-50 rounded p-3 text-sm">
              <div className="flex justify-between text-gray-600 text-xs">
                <span>Subtotal:</span>
                <span>R$ {fmtBRL(form.itens.reduce((s, i) => s + parseFloat(i.valor_unitario || 0) * parseFloat(i.quantidade || 1), 0))}</span>
              </div>
              {parseFloat(form.desconto || 0) > 0 && (
                <div className="flex justify-between text-red-600 text-xs">
                  <span>Desconto:</span>
                  <span>- R$ {fmtBRL(form.desconto)}</span>
                </div>
              )}
              <div className="flex justify-between font-semibold text-green-700 border-t pt-1.5 mt-1.5">
                <span>Total:</span>
                <span>R$ {fmtBRL(fmtItens(form.itens, form.desconto))}</span>
              </div>
            </div>
          ) : (
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
          )}

          <div>
            <label className="block text-xs text-gray-600 mb-0.5">Data</label>
            <input
              type="date"
              value={form.data_venda}
              onChange={(e) => set({ data_venda: e.target.value })}
              className="w-full border border-gray-200 rounded px-2.5 py-1.5 text-sm focus:ring-1 focus:ring-gray-400 outline-none"
            />
          </div>

          <div>
            <label className="block text-xs text-gray-600 mb-0.5">Pagamento</label>
            <select
              value={form.forma_pagamento}
              onChange={(e) => set({ forma_pagamento: e.target.value })}
              className="w-full border border-gray-200 rounded px-2.5 py-1.5 text-sm focus:ring-1 focus:ring-gray-400 outline-none"
            >
              {["à vista", "parcelado", "boleto", "cartão", "pix"].map((f) => (
                <option key={f} value={f}>{f.charAt(0).toUpperCase() + f.slice(1)}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs text-gray-600 mb-0.5">Observações</label>
            <textarea
              value={form.observacoes}
              onChange={(e) => set({ observacoes: e.target.value })}
              className="w-full border border-gray-200 rounded px-2.5 py-1.5 text-sm focus:ring-1 focus:ring-gray-400 outline-none"
              rows="2"
            />
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
