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

  const [pagarParcial, setPagarParcial] = useState(false);
  const [valorParcial, setValorParcial] = useState("");
  const [confirmandoSaldo, setConfirmandoSaldo] = useState(false);

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

  const valorOriginal = parseFloat(form.valor || 0);
  const valorParcialNum = parseFloat(valorParcial || 0);
  const saldoParcial = valorParcialNum > 0 ? valorOriginal - valorParcialNum : 0;

  const handleSalvar = () => {
    if (pagarParcial && valorParcialNum > 0 && saldoParcial > 0.01) {
      setConfirmandoSaldo(true);
    } else {
      onSalvar({ ...form, pagarParcial: false });
    }
  };

  const confirmarPagamentoParcial = () => {
    setConfirmandoSaldo(false);
    onSalvar({
      ...form,
      pagarParcial: true,
      valor_parcial: valorParcialNum,
      status: "pago",
    });
  };

  if (confirmandoSaldo) {
    return (
      <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg border border-gray-200 max-w-sm w-full p-4">
          <h3 className="text-sm font-semibold mb-3">Confirmar Pagamento Parcial</h3>
          <div className="bg-yellow-50 border border-yellow-200 rounded p-3 space-y-2 text-xs text-yellow-800 mb-4">
            <p>
              Este título será marcado como <strong>pago</strong> pelo valor de{" "}
              <strong>R$ {valorParcialNum.toFixed(2)}</strong>.
            </p>
            <p>Um novo título pendente será gerado automaticamente com o saldo:</p>
            <div className="flex justify-between font-semibold text-sm pt-1.5 border-t border-yellow-300">
              <span>Saldo a gerar:</span>
              <span>R$ {saldoParcial.toFixed(2)}</span>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setConfirmandoSaldo(false)}
              className="flex-1 px-3 py-1.5 border border-gray-200 rounded text-xs hover:bg-gray-50"
            >
              Voltar
            </button>
            <button
              onClick={confirmarPagamentoParcial}
              className="flex-1 px-3 py-1.5 bg-gray-800 text-white rounded text-xs hover:bg-gray-700"
            >
              Confirmar
            </button>
          </div>
        </div>
      </div>
    );
  }

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
            <div className="flex items-center justify-between mb-0.5">
              <label className="text-xs text-gray-600">Valor (R$)</label>
              {editando && (
                <label className="flex items-center gap-1.5 text-xs text-gray-600 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={pagarParcial}
                    onChange={(e) => {
                      setPagarParcial(e.target.checked);
                      if (!e.target.checked) setValorParcial("");
                    }}
                    className="rounded border-gray-300"
                  />
                  Pagar Parcial
                </label>
              )}
            </div>
            <input
              type="number"
              step="0.01"
              value={form.valor}
              readOnly={!!editando}
              onChange={editando ? undefined : (e) => set({ valor: e.target.value })}
              className={`w-full border border-gray-200 rounded px-2.5 py-1.5 text-sm outline-none ${
                editando
                  ? "bg-gray-50 text-gray-700 cursor-not-allowed"
                  : "focus:ring-1 focus:ring-gray-400"
              }`}
            />
          </div>

          {pagarParcial && (
            <div>
              <label className="block text-xs text-gray-600 mb-0.5">Valor a Pagar (R$) *</label>
              <input
                type="number"
                step="0.01"
                min="0.01"
                max={valorOriginal}
                value={valorParcial}
                onChange={(e) => setValorParcial(e.target.value)}
                className="w-full border border-gray-200 rounded px-2.5 py-1.5 text-sm focus:ring-1 focus:ring-gray-400 outline-none"
                placeholder="0,00"
                autoFocus
              />
              {saldoParcial > 0.01 && (
                <div className="mt-1 flex justify-between text-xs text-yellow-700 bg-yellow-50 border border-yellow-100 rounded px-2 py-1">
                  <span>Saldo a gerar como novo título:</span>
                  <span className="font-semibold">R$ {saldoParcial.toFixed(2)}</span>
                </div>
              )}
            </div>
          )}

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

          {!pagarParcial && (
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
          )}
        </div>

        <div className="flex gap-2 mt-4">
          <button onClick={onFechar} className="flex-1 px-3 py-1.5 border border-gray-200 rounded text-xs hover:bg-gray-50">
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
