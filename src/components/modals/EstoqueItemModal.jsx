import { useState, useEffect } from "react";
import { CATEGORIAS_ESTOQUE } from "../../constants/estoque";

const FORM_INICIAL = {
  nome: "",
  categoria: "insumo",
  descricao: "",
  unidade_medida: "un",
  quantidade_atual: "0",
  quantidade_minima: "0",
  custo_unitario: "0",
  fornecedor_id: "",
  lote: "",
  validade: "",
  codigo_referencia: "",
  ativo: true,
};

export function EstoqueItemModal({ aberto, editando, onClose, onSalvar, fornecedores = [] }) {
  const [form, setForm] = useState(FORM_INICIAL);

  useEffect(() => {
    if (editando) {
      setForm({
        nome: editando.nome || "",
        categoria: editando.categoria || "insumo",
        descricao: editando.descricao || "",
        unidade_medida: editando.unidade_medida || "un",
        quantidade_atual: (editando.quantidade_atual ?? 0).toString(),
        quantidade_minima: (editando.quantidade_minima ?? 0).toString(),
        custo_unitario: (editando.custo_unitario ?? 0).toString(),
        fornecedor_id: editando.fornecedor_id || "",
        lote: editando.lote || "",
        validade: editando.validade || "",
        codigo_referencia: editando.codigo_referencia || "",
        ativo: editando.ativo ?? true,
      });
    } else {
      setForm(FORM_INICIAL);
    }
  }, [editando, aberto]);

  if (!aberto) return null;

  const handleSalvar = () => {
    if (!form.nome.trim()) return alert("Nome é obrigatório!");
    onSalvar({
      ...form,
      fornecedor_id: form.fornecedor_id || null,
      lote: form.lote || null,
      validade: form.validade || null,
    });
  };

  const f = (field) => (e) => setForm({ ...form, [field]: e.target.value });
  const inputCls = "w-full border border-gray-200 rounded px-2.5 py-1.5 text-sm focus:ring-1 focus:ring-gray-400 outline-none";

  const fornecedoresAtivos = fornecedores.filter((f) => f.ativo !== false);

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg border border-gray-200 max-w-md w-full p-4 max-h-[90vh] overflow-y-auto">
        <h3 className="text-sm font-semibold mb-3">
          {editando ? "Editar Item de Estoque" : "Novo Item de Estoque"}
        </h3>
        <div className="space-y-2.5">
          <div>
            <label className="block text-xs text-gray-600 mb-0.5">Nome *</label>
            <input
              type="text"
              value={form.nome}
              onChange={f("nome")}
              placeholder="Ex: Creme hidratante, Luva descartável..."
              className={inputCls}
            />
          </div>
          <div>
            <label className="block text-xs text-gray-600 mb-0.5">Categoria *</label>
            <select value={form.categoria} onChange={f("categoria")} className={inputCls}>
              {CATEGORIAS_ESTOQUE.map((c) => (
                <option key={c.value} value={c.value}>{c.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs text-gray-600 mb-0.5">Descrição</label>
            <textarea value={form.descricao} onChange={f("descricao")} className={inputCls} rows="2" />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs text-gray-600 mb-0.5">Unidade de Medida</label>
              <input
                type="text"
                value={form.unidade_medida}
                onChange={f("unidade_medida")}
                placeholder="un, kg, ml, L, cx..."
                className={inputCls}
              />
            </div>
            <div>
              <label className="block text-xs text-gray-600 mb-0.5">Custo Unitário (R$)</label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={form.custo_unitario}
                onChange={f("custo_unitario")}
                className={inputCls}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs text-gray-600 mb-0.5">Quantidade Atual</label>
              <input
                type="number"
                step="0.001"
                min="0"
                value={form.quantidade_atual}
                onChange={f("quantidade_atual")}
                className={inputCls}
              />
            </div>
            <div>
              <label className="block text-xs text-gray-600 mb-0.5">Quantidade Mínima</label>
              <input
                type="number"
                step="0.001"
                min="0"
                value={form.quantidade_minima}
                onChange={f("quantidade_minima")}
                className={inputCls}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs text-gray-600 mb-0.5">Lote</label>
              <input
                type="text"
                value={form.lote}
                onChange={f("lote")}
                placeholder="Ex: L20240115..."
                className={inputCls}
              />
            </div>
            <div>
              <label className="block text-xs text-gray-600 mb-0.5">Validade</label>
              <input
                type="date"
                value={form.validade}
                onChange={f("validade")}
                className={inputCls}
              />
            </div>
          </div>
          <div>
            <label className="block text-xs text-gray-600 mb-0.5">Fornecedor</label>
            <select value={form.fornecedor_id} onChange={f("fornecedor_id")} className={inputCls}>
              <option value="">— Selecione um fornecedor —</option>
              {fornecedoresAtivos.map((forn) => (
                <option key={forn.id} value={forn.id}>{forn.nome}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs text-gray-600 mb-0.5">Código / Referência</label>
            <input
              type="text"
              value={form.codigo_referencia}
              onChange={f("codigo_referencia")}
              placeholder="SKU, código interno..."
              className={inputCls}
            />
          </div>
          <div className="flex items-center gap-2">
            <input
              id="ei-ativo"
              type="checkbox"
              checked={!!form.ativo}
              onChange={(e) => setForm({ ...form, ativo: e.target.checked })}
            />
            <label htmlFor="ei-ativo" className="text-xs text-gray-600">Ativo</label>
          </div>
        </div>
        <div className="flex gap-2 mt-4">
          <button onClick={onClose} className="flex-1 px-3 py-1.5 border border-gray-200 rounded text-xs hover:bg-gray-50">
            Cancelar
          </button>
          <button onClick={handleSalvar} className="flex-1 px-3 py-1.5 bg-gray-800 text-white rounded text-xs hover:bg-gray-700">
            {editando ? "Salvar" : "Adicionar"}
          </button>
        </div>
      </div>
    </div>
  );
}
