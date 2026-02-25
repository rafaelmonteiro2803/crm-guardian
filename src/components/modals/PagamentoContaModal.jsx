import { useState, useEffect } from "react";
import { FORMAS_PAGAMENTO } from "../../constants/contasPagar";

export function PagamentoContaModal({
  aberto,
  parcela,
  contaPagar,
  contasBancarias,
  onClose,
  onPagar,
}) {
  const [form, setForm] = useState({
    data_pagamento: new Date().toISOString().split("T")[0],
    valor_pago: "",
    conta_bancaria_id: "",
    forma_pagamento: "pix",
    observacoes: "",
  });
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    if (parcela) {
      setForm({
        data_pagamento: new Date().toISOString().split("T")[0],
        valor_pago: (parcela.valor ?? "").toString(),
        conta_bancaria_id: contasBancarias?.[0]?.id || "",
        forma_pagamento: "pix",
        observacoes: "",
      });
    }
  }, [parcela, aberto, contasBancarias]);

  if (!aberto || !parcela) return null;

  const handlePagar = async () => {
    if (!form.conta_bancaria_id) return alert("Selecione a conta bancária!");
    if (!form.valor_pago || parseFloat(form.valor_pago) <= 0) return alert("Valor do pagamento inválido!");
    setSalvando(true);
    try {
      await onPagar(parcela, form);
      onClose();
    } catch (err) {
      alert("Erro ao registrar pagamento: " + err.message);
    } finally {
      setSalvando(false);
    }
  };

  const f = (field) => (e) => setForm({ ...form, [field]: e.target.value });
  const cls = "w-full border border-gray-200 rounded px-2.5 py-1.5 text-sm focus:ring-1 focus:ring-gray-400 outline-none";
  const fmtBRL = (v) => parseFloat(v || 0).toLocaleString("pt-BR", { minimumFractionDigits: 2 });

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg border border-gray-200 max-w-sm w-full p-4">
        <h3 className="text-sm font-semibold mb-1">Registrar Pagamento</h3>
        {contaPagar && (
          <p className="text-xs text-gray-500 mb-3">
            {contaPagar.descricao} — Parcela {parcela.numero_parcela}
          </p>
        )}

        <div className="bg-yellow-50 border border-yellow-200 rounded p-2.5 mb-3 text-xs text-yellow-800">
          <div className="flex justify-between">
            <span>Vencimento:</span>
            <span className="font-medium">{new Date(parcela.data_vencimento + "T00:00:00").toLocaleDateString("pt-BR")}</span>
          </div>
          <div className="flex justify-between mt-0.5">
            <span>Valor original:</span>
            <span className="font-semibold">R$ {fmtBRL(parcela.valor)}</span>
          </div>
        </div>

        <div className="space-y-2.5">
          <div>
            <label className="block text-xs text-gray-600 mb-0.5">Data do Pagamento</label>
            <input type="date" value={form.data_pagamento} onChange={f("data_pagamento")} className={cls} />
          </div>
          <div>
            <label className="block text-xs text-gray-600 mb-0.5">Valor Pago (R$)</label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={form.valor_pago}
              onChange={f("valor_pago")}
              className={cls}
            />
          </div>
          <div>
            <label className="block text-xs text-gray-600 mb-0.5">Conta Bancária *</label>
            {contasBancarias && contasBancarias.length > 0 ? (
              <select value={form.conta_bancaria_id} onChange={f("conta_bancaria_id")} className={cls}>
                <option value="">Selecione...</option>
                {contasBancarias.filter((c) => c.ativo).map((c) => (
                  <option key={c.id} value={c.id}>{c.nome}</option>
                ))}
              </select>
            ) : (
              <p className="text-xs text-red-500 italic">Nenhuma conta bancária ativa. Cadastre uma conta bancária primeiro.</p>
            )}
          </div>
          <div>
            <label className="block text-xs text-gray-600 mb-0.5">Forma de Pagamento</label>
            <select value={form.forma_pagamento} onChange={f("forma_pagamento")} className={cls}>
              {FORMAS_PAGAMENTO.map((fp) => (
                <option key={fp.value} value={fp.value}>{fp.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs text-gray-600 mb-0.5">Observações</label>
            <textarea value={form.observacoes} onChange={f("observacoes")} className={cls} rows="2" />
          </div>
        </div>

        <p className="text-[11px] text-gray-400 mt-3">
          Um movimento bancário de saída será criado automaticamente.
        </p>

        <div className="flex gap-2 mt-3">
          <button onClick={onClose} disabled={salvando} className="flex-1 px-3 py-1.5 border border-gray-200 rounded text-xs hover:bg-gray-50">
            Cancelar
          </button>
          <button
            onClick={handlePagar}
            disabled={salvando || !form.conta_bancaria_id}
            className="flex-1 px-3 py-1.5 bg-green-700 text-white rounded text-xs hover:bg-green-600 disabled:opacity-50"
          >
            {salvando ? "Registrando..." : "Confirmar Pagamento"}
          </button>
        </div>
      </div>
    </div>
  );
}
