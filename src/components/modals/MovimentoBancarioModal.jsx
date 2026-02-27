import { useState, useEffect } from "react";

export const FONTES_PAGAMENTO = [
  { value: "pix", label: "PIX" },
  { value: "cartao_credito", label: "Cartão de Crédito" },
  { value: "cartao_debito", label: "Cartão de Débito" },
  { value: "dinheiro", label: "Dinheiro" },
  { value: "boleto", label: "Boleto" },
  { value: "transferencia", label: "Transferência Bancária" },
  { value: "deposito", label: "Depósito" },
  { value: "cheque", label: "Cheque" },
  { value: "outro", label: "Outro" },
];

const FORM_INICIAL = {
  conta_id: "",
  tipo: "entrada",
  valor: "",
  descricao: "",
  fonte_pagamento: "pix",
  data_movimento: new Date().toISOString().split("T")[0],
  observacoes: "",
};

export function MovimentoBancarioModal({ aberto, editando, contasBancarias, onClose, onSalvar }) {
  const [form, setForm] = useState(FORM_INICIAL);

  useEffect(() => {
    if (aberto) {
      setForm(editando ? { ...FORM_INICIAL, ...editando, valor: editando.valor?.toString() || "" } : FORM_INICIAL);
    }
  }, [editando, aberto]);

  if (!aberto) return null;

  const contasAtivas = contasBancarias.filter((c) => c.ativo);

  const handleSalvar = () => {
    if (!form.conta_id) return alert("Selecione uma conta!");
    if (!form.descricao.trim()) return alert("Descrição é obrigatória!");
    if (!form.valor || parseFloat(form.valor) <= 0) return alert("Informe um valor válido!");
    onSalvar(form);
    onClose();
  };

  const f = (field) => (e) => setForm({ ...form, [field]: e.target.value });
  const inputCls = "w-full border border-gray-200 rounded px-2.5 py-1.5 text-sm focus:ring-1 focus:ring-gray-400 outline-none";

  const tipoCls = form.tipo === "entrada"
    ? "bg-green-50 border-green-200"
    : "bg-red-50 border-red-200";

  const btnCls = form.tipo === "entrada"
    ? "bg-green-700 hover:bg-green-800"
    : "bg-red-600 hover:bg-red-700";

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg border border-gray-200 max-w-sm w-full p-4 max-h-[90vh] overflow-y-auto">
        <h3 className="text-sm font-semibold mb-3">
          {editando ? "Editar Movimento" : "Novo Movimento Bancário"}
        </h3>
        <div className="space-y-2.5">
          <div>
            <label className="block text-xs text-gray-600 mb-0.5">Tipo *</label>
            <div className="grid grid-cols-2 gap-1.5">
              <button
                type="button"
                onClick={() => setForm({ ...form, tipo: "entrada" })}
                className={`px-3 py-1.5 rounded text-xs font-medium border transition-colors ${
                  form.tipo === "entrada"
                    ? "bg-green-700 text-white border-green-700"
                    : "bg-white text-gray-600 border-gray-200 hover:bg-green-50"
                }`}
              >
                Entrada
              </button>
              <button
                type="button"
                onClick={() => setForm({ ...form, tipo: "saida" })}
                className={`px-3 py-1.5 rounded text-xs font-medium border transition-colors ${
                  form.tipo === "saida"
                    ? "bg-red-600 text-white border-red-600"
                    : "bg-white text-gray-600 border-gray-200 hover:bg-red-50"
                }`}
              >
                Saída
              </button>
            </div>
          </div>
          <div>
            <label className="block text-xs text-gray-600 mb-0.5">Conta de Destino *</label>
            <select value={form.conta_id} onChange={f("conta_id")} className={inputCls}>
              <option value="">Selecione a conta...</option>
              {contasAtivas.map((c) => (
                <option key={c.id} value={c.id}>{c.nome}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs text-gray-600 mb-0.5">Descrição *</label>
            <input
              type="text"
              value={form.descricao}
              onChange={f("descricao")}
              placeholder="Ex: Recebimento de venda, Pagamento fornecedor..."
              className={inputCls}
            />
          </div>
          <div>
            <label className="block text-xs text-gray-600 mb-0.5">Valor (R$) *</label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={form.valor}
              onChange={f("valor")}
              placeholder="0,00"
              className={inputCls}
            />
          </div>
          {form.tipo === "entrada" && (
            <div>
              <label className="block text-xs text-gray-600 mb-0.5">Fonte de Pagamento *</label>
              <select value={form.fonte_pagamento} onChange={f("fonte_pagamento")} className={inputCls}>
                {FONTES_PAGAMENTO.map((fp) => (
                  <option key={fp.value} value={fp.value}>{fp.label}</option>
                ))}
              </select>
            </div>
          )}
          <div>
            <label className="block text-xs text-gray-600 mb-0.5">Data *</label>
            <input
              type="date"
              value={form.data_movimento}
              onChange={f("data_movimento")}
              className={inputCls}
            />
          </div>
          <div>
            <label className="block text-xs text-gray-600 mb-0.5">Observações</label>
            <textarea
              value={form.observacoes}
              onChange={f("observacoes")}
              className={inputCls}
              rows="2"
            />
          </div>
        </div>
        <div className="flex gap-2 mt-4">
          <button
            onClick={onClose}
            className="flex-1 px-3 py-1.5 border border-gray-200 rounded text-xs hover:bg-gray-50"
          >
            Cancelar
          </button>
          <button
            onClick={handleSalvar}
            className={`flex-1 px-3 py-1.5 text-white rounded text-xs font-medium ${btnCls}`}
          >
            {editando ? "Salvar" : "Registrar"}
          </button>
        </div>
      </div>
    </div>
  );
}
