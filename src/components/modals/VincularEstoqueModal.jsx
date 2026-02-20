import { useState } from "react";
import { Icons } from "../Icons";
import { getCategorialLabel } from "../../constants/estoque";

const FORM_INICIAL = { estoque_item_id: "", quantidade_usada: "1", observacoes: "" };

export function VincularEstoqueModal({
  aberto,
  produto,
  estoqueItens,
  vinculos,
  onSalvar,
  onExcluir,
  onClose,
}) {
  const [form, setForm] = useState(FORM_INICIAL);

  if (!aberto || !produto) return null;

  const vinculosDoProduto = vinculos.filter((v) => v.produto_id === produto.id);
  const itensDisponiveis = estoqueItens.filter(
    (e) => e.ativo && !vinculosDoProduto.some((v) => v.estoque_item_id === e.id)
  );

  const handleSalvar = () => {
    if (!form.estoque_item_id) return alert("Selecione um item de estoque!");
    if (!form.quantidade_usada || parseFloat(form.quantidade_usada) <= 0)
      return alert("Informe a quantidade usada!");
    onSalvar(form);
    setForm(FORM_INICIAL);
  };

  const handleExcluir = (id) => {
    if (!confirm("Remover vínculo?")) return;
    onExcluir(id);
  };

  const inputCls = "w-full border border-gray-200 rounded px-2.5 py-1.5 text-sm focus:ring-1 focus:ring-gray-400 outline-none";

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg border border-gray-200 max-w-md w-full p-4 max-h-[90vh] overflow-y-auto">
        <h3 className="text-sm font-semibold mb-1">Insumos de Estoque</h3>
        <div className="bg-gray-50 border border-gray-200 rounded p-2.5 mb-3">
          <p className="text-xs font-semibold text-gray-800">{produto.nome}</p>
          <p className="text-[11px] text-gray-500 capitalize">
            {produto.tipo}
            {produto.categoria ? ` · ${produto.categoria}` : ""}
          </p>
        </div>

        <div className="mb-3">
          <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-wide mb-2">
            Insumos Vinculados
          </p>
          {vinculosDoProduto.length === 0 ? (
            <p className="text-xs text-gray-400 text-center py-3 border border-dashed border-gray-200 rounded">
              Nenhum insumo vinculado
            </p>
          ) : (
            <div className="space-y-1.5">
              {vinculosDoProduto.map((v) => {
                const itemEstoque = estoqueItens.find((e) => e.id === v.estoque_item_id);
                return (
                  <div key={v.id} className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded p-2">
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-gray-800 truncate">
                        {itemEstoque?.nome || "Item removido"}
                      </p>
                      <p className="text-[11px] text-gray-500">
                        {itemEstoque ? getCategorialLabel(itemEstoque.categoria) : ""} ·{" "}
                        <span className="font-semibold">
                          {parseFloat(v.quantidade_usada).toLocaleString("pt-BR", { maximumFractionDigits: 3 })}{" "}
                          {itemEstoque?.unidade_medida || "un"}
                        </span>{" "}
                        por uso
                      </p>
                      {v.observacoes && (
                        <p className="text-[10px] text-gray-400 italic">{v.observacoes}</p>
                      )}
                    </div>
                    <button
                      onClick={() => handleExcluir(v.id)}
                      className="text-gray-400 hover:text-red-600 hover:bg-red-50 p-1 rounded flex-shrink-0"
                    >
                      <Icons.Trash className="w-3 h-3" />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {itensDisponiveis.length > 0 && (
          <div className="border-t border-gray-100 pt-3">
            <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-wide mb-2">
              Adicionar Insumo
            </p>
            <div className="space-y-2">
              <div>
                <label className="block text-xs text-gray-600 mb-0.5">Item de Estoque *</label>
                <select
                  value={form.estoque_item_id}
                  onChange={(e) => setForm({ ...form, estoque_item_id: e.target.value })}
                  className={inputCls}
                >
                  <option value="">Selecione um item</option>
                  {itensDisponiveis.map((e) => (
                    <option key={e.id} value={e.id}>
                      {e.nome} ({getCategorialLabel(e.categoria)}) · Estoque:{" "}
                      {parseFloat(e.quantidade_atual || 0).toLocaleString("pt-BR", { maximumFractionDigits: 3 })}{" "}
                      {e.unidade_medida || "un"}
                    </option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs text-gray-600 mb-0.5">Qtd por Uso *</label>
                  <input
                    type="number"
                    step="0.001"
                    min="0.001"
                    value={form.quantidade_usada}
                    onChange={(e) => setForm({ ...form, quantidade_usada: e.target.value })}
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-0.5">Observações</label>
                  <input
                    type="text"
                    value={form.observacoes}
                    onChange={(e) => setForm({ ...form, observacoes: e.target.value })}
                    className={inputCls}
                  />
                </div>
              </div>
              <button
                onClick={handleSalvar}
                className="w-full px-3 py-1.5 bg-blue-700 text-white rounded text-xs hover:bg-blue-800 font-medium flex items-center justify-center gap-1"
              >
                <Icons.Link className="w-3 h-3" />Vincular Insumo
              </button>
            </div>
          </div>
        )}

        <div className="flex gap-2 mt-4">
          <button onClick={onClose} className="flex-1 px-3 py-1.5 bg-gray-800 text-white rounded text-xs hover:bg-gray-700">
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}
