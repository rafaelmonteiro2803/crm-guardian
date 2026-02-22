import { useState, useEffect } from "react";

const FORM_INICIAL = {
  nome: "",
  tipo: "banco",
  banco: "",
  agencia: "",
  conta: "",
  ativo: true,
  observacoes: "",
};

const TIPOS_CONTA = [
  { value: "banco", label: "Banco" },
  { value: "pagamento_digital", label: "Pagamento Digital (PagBank, Mercado Pago, etc.)" },
  { value: "caixa", label: "Caixa / Dinheiro" },
  { value: "carteira", label: "Carteira Digital" },
  { value: "outro", label: "Outro" },
];

export function ContaBancariaModal({ aberto, editando, onClose, onSalvar }) {
  const [form, setForm] = useState(FORM_INICIAL);

  useEffect(() => {
    setForm(editando ? { ...FORM_INICIAL, ...editando } : FORM_INICIAL);
  }, [editando, aberto]);

  if (!aberto) return null;

  const handleSalvar = () => {
    if (!form.nome.trim()) return alert("Nome é obrigatório!");
    onSalvar(form);
    onClose();
  };

  const f = (field) => (e) => setForm({ ...form, [field]: e.target.value });
  const inputCls = "w-full border border-gray-200 rounded px-2.5 py-1.5 text-sm focus:ring-1 focus:ring-gray-400 outline-none";

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg border border-gray-200 max-w-sm w-full p-4 max-h-[90vh] overflow-y-auto">
        <h3 className="text-sm font-semibold mb-3">
          {editando ? "Editar Conta" : "Nova Conta Bancária"}
        </h3>
        <div className="space-y-2.5">
          <div>
            <label className="block text-xs text-gray-600 mb-0.5">Nome *</label>
            <input
              type="text"
              value={form.nome}
              onChange={f("nome")}
              placeholder="Ex: Itaú, PagBank, Caixa..."
              className={inputCls}
            />
          </div>
          <div>
            <label className="block text-xs text-gray-600 mb-0.5">Tipo *</label>
            <select value={form.tipo} onChange={f("tipo")} className={inputCls}>
              {TIPOS_CONTA.map((t) => (
                <option key={t.value} value={t.value}>{t.label}</option>
              ))}
            </select>
          </div>
          {form.tipo === "banco" && (
            <>
              <div>
                <label className="block text-xs text-gray-600 mb-0.5">Banco</label>
                <input
                  type="text"
                  value={form.banco}
                  onChange={f("banco")}
                  placeholder="Ex: Itaú, Bradesco, Nubank..."
                  className={inputCls}
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs text-gray-600 mb-0.5">Agência</label>
                  <input
                    type="text"
                    value={form.agencia}
                    onChange={f("agencia")}
                    placeholder="0000"
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-0.5">Conta</label>
                  <input
                    type="text"
                    value={form.conta}
                    onChange={f("conta")}
                    placeholder="00000-0"
                    className={inputCls}
                  />
                </div>
              </div>
            </>
          )}
          <div>
            <label className="block text-xs text-gray-600 mb-0.5">Observações</label>
            <textarea
              value={form.observacoes}
              onChange={f("observacoes")}
              className={inputCls}
              rows="2"
            />
          </div>
          <div className="flex items-center gap-2">
            <input
              id="conta-ativa"
              type="checkbox"
              checked={!!form.ativo}
              onChange={(e) => setForm({ ...form, ativo: e.target.checked })}
            />
            <label htmlFor="conta-ativa" className="text-xs text-gray-600">Conta ativa</label>
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
            className="flex-1 px-3 py-1.5 bg-gray-800 text-white rounded text-xs hover:bg-gray-700"
          >
            {editando ? "Salvar" : "Adicionar"}
          </button>
        </div>
      </div>
    </div>
  );
}
