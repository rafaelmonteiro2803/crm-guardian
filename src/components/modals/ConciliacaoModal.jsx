import { useState, useEffect } from "react";
import { FONTES_PAGAMENTO } from "./MovimentoBancarioModal";

const FORM_INICIAL = {
  titulo_id: "",
  movimento_bancario_id: "",
  valor_titulo: "",
  valor_movimento: "",
  data_conciliacao: new Date().toISOString().split("T")[0],
  observacoes: "",
};

export function ConciliacaoModal({
  aberto,
  onClose,
  onSalvar,
  titulos,
  movimentosBancarios,
  contasBancarias,
  conciliacoes,
  fmtBRL,
}) {
  const [form, setForm] = useState(FORM_INICIAL);

  useEffect(() => {
    if (aberto) setForm(FORM_INICIAL);
  }, [aberto]);

  if (!aberto) return null;

  const titulosPagos = titulos.filter((t) => t.status === "pago");
  const idsJaConciliados = new Set(conciliacoes.map((c) => c.titulo_id));
  const titulosDisponiveis = titulosPagos.filter((t) => !idsJaConciliados.has(t.id));

  const movimentosEntrada = movimentosBancarios.filter((m) => m.tipo === "entrada");
  const idsMovimentosConciliados = new Set(conciliacoes.map((c) => c.movimento_bancario_id));
  const movimentosDisponiveis = movimentosEntrada.filter((m) => !idsMovimentosConciliados.has(m.id));

  const handleTituloChange = (e) => {
    const titulo = titulos.find((t) => t.id === e.target.value);
    setForm({
      ...form,
      titulo_id: e.target.value,
      valor_titulo: titulo ? titulo.valor.toString() : "",
    });
  };

  const handleMovimentoChange = (e) => {
    const mov = movimentosBancarios.find((m) => m.id === e.target.value);
    setForm({
      ...form,
      movimento_bancario_id: e.target.value,
      valor_movimento: mov ? mov.valor.toString() : "",
    });
  };

  const diferencaValor = parseFloat(form.valor_titulo || 0) - parseFloat(form.valor_movimento || 0);
  const percentualTaxa =
    parseFloat(form.valor_titulo || 0) > 0
      ? (diferencaValor / parseFloat(form.valor_titulo)) * 100
      : 0;

  const handleSalvar = () => {
    if (!form.titulo_id) return alert("Selecione um título!");
    if (!form.movimento_bancario_id) return alert("Selecione um movimento bancário!");
    if (!form.valor_titulo || parseFloat(form.valor_titulo) <= 0) return alert("Valor do título inválido!");
    if (!form.valor_movimento || parseFloat(form.valor_movimento) <= 0) return alert("Valor do movimento inválido!");
    onSalvar(form);
    onClose();
  };

  const f = (field) => (e) => setForm({ ...form, [field]: e.target.value });
  const inputCls = "w-full border border-gray-200 rounded px-2.5 py-1.5 text-sm focus:ring-1 focus:ring-gray-400 outline-none";

  const getContaNome = (contaId) =>
    contasBancarias.find((c) => c.id === contaId)?.nome || "-";

  const getFonteLabel = (fonte) =>
    FONTES_PAGAMENTO.find((fp) => fp.value === fonte)?.label || fonte;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg border border-gray-200 max-w-lg w-full p-4 max-h-[90vh] overflow-y-auto">
        <h3 className="text-sm font-semibold mb-3">Nova Conciliação Bancária</h3>
        <div className="space-y-2.5">
          <div>
            <label className="block text-xs text-gray-600 mb-0.5">Título Pago *</label>
            <select value={form.titulo_id} onChange={handleTituloChange} className={inputCls}>
              <option value="">Selecione o título pago...</option>
              {titulosDisponiveis.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.descricao} — R$ {fmtBRL(t.valor)} — Pago em {t.data_pagamento ? new Date(t.data_pagamento + "T00:00:00").toLocaleDateString("pt-BR") : "-"}
                </option>
              ))}
            </select>
            {titulosDisponiveis.length === 0 && (
              <p className="text-[11px] text-yellow-600 mt-1">
                Nenhum título pago disponível para conciliação.
              </p>
            )}
          </div>

          <div>
            <label className="block text-xs text-gray-600 mb-0.5">Movimento Bancário *</label>
            <select value={form.movimento_bancario_id} onChange={handleMovimentoChange} className={inputCls}>
              <option value="">Selecione o movimento bancário...</option>
              {movimentosDisponiveis.map((m) => (
                <option key={m.id} value={m.id}>
                  {new Date(m.data_movimento + "T00:00:00").toLocaleDateString("pt-BR")} — {m.descricao} — {getContaNome(m.conta_id)} — {getFonteLabel(m.fonte_pagamento)} — R$ {fmtBRL(m.valor)}
                </option>
              ))}
            </select>
            {movimentosDisponiveis.length === 0 && (
              <p className="text-[11px] text-yellow-600 mt-1">
                Nenhum movimento de entrada disponível para conciliação.
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs text-gray-600 mb-0.5">Valor do Título (R$) *</label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={form.valor_titulo}
                onChange={f("valor_titulo")}
                placeholder="0,00"
                className={inputCls}
              />
            </div>
            <div>
              <label className="block text-xs text-gray-600 mb-0.5">Valor Recebido (R$) *</label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={form.valor_movimento}
                onChange={f("valor_movimento")}
                placeholder="0,00"
                className={inputCls}
              />
            </div>
          </div>

          {(form.valor_titulo || form.valor_movimento) && (
            <div className={`rounded p-3 border ${diferencaValor > 0.005 ? "bg-amber-50 border-amber-200" : "bg-green-50 border-green-200"}`}>
              <p className="text-[11px] font-semibold text-gray-700 mb-1">Análise da Taxa</p>
              <div className="grid grid-cols-3 gap-2 text-center">
                <div>
                  <p className="text-[10px] text-gray-500">Vendido</p>
                  <p className="text-sm font-semibold text-gray-800">R$ {fmtBRL(form.valor_titulo)}</p>
                </div>
                <div>
                  <p className="text-[10px] text-gray-500">Recebido</p>
                  <p className="text-sm font-semibold text-green-700">R$ {fmtBRL(form.valor_movimento)}</p>
                </div>
                <div>
                  <p className="text-[10px] text-gray-500">Taxa</p>
                  <p className={`text-sm font-semibold ${diferencaValor > 0.005 ? "text-amber-700" : "text-green-700"}`}>
                    {percentualTaxa.toFixed(2)}%
                  </p>
                </div>
              </div>
              {diferencaValor > 0.005 && (
                <p className="text-[11px] text-amber-700 mt-1.5 text-center">
                  Desconto de R$ {fmtBRL(diferencaValor)} cobrado pelo banco/processadora
                </p>
              )}
            </div>
          )}

          <div>
            <label className="block text-xs text-gray-600 mb-0.5">Data da Conciliação</label>
            <input
              type="date"
              value={form.data_conciliacao}
              onChange={f("data_conciliacao")}
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
            className="flex-1 px-3 py-1.5 bg-gray-800 text-white rounded text-xs hover:bg-gray-700"
          >
            Conciliar
          </button>
        </div>
      </div>
    </div>
  );
}
