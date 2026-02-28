import { useState, useEffect } from "react";
import { FONTES_PAGAMENTO } from "./MovimentoBancarioModal";

const FORM_INICIAL = {
  tipo: "recebido",
  titulo_id: "",
  conta_pagar_parcela_id: "",
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
  parcelas,
  contasPagar,
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

  const isPago = form.tipo === "pago";

  // Parcelas pagas de contas a pagar sem conciliação (tipo pago)
  const idsParcelasConciliadas = new Set(
    conciliacoes.filter((c) => c.conta_pagar_parcela_id).map((c) => c.conta_pagar_parcela_id)
  );
  const parcelasPagas = (parcelas || []).filter(
    (p) => p.status === "pago" && !idsParcelasConciliadas.has(p.id)
  );

  // Títulos de venda pagos sem conciliação (tipo recebido)
  const idsTitulosConciliados = new Set(
    conciliacoes.filter((c) => c.titulo_id).map((c) => c.titulo_id)
  );
  const titulosDisponiveis = titulos.filter(
    (t) => t.status === "pago" && !idsTitulosConciliados.has(t.id)
  );

  // Movimentos disponíveis baseados no tipo
  const idsMovimentosConciliados = new Set(
    conciliacoes.filter((c) => c.movimento_bancario_id).map((c) => c.movimento_bancario_id)
  );
  const movimentosFiltrados = movimentosBancarios.filter((m) => {
    if (idsMovimentosConciliados.has(m.id)) return false;
    return isPago ? m.tipo === "saida" : m.tipo === "entrada";
  });

  const getContaPagarDescricao = (parcelaId) => {
    const parcela = (parcelas || []).find((p) => p.id === parcelaId);
    if (!parcela) return "-";
    const conta = (contasPagar || []).find((c) => c.id === parcela.conta_pagar_id);
    return conta
      ? `${conta.descricao} - Parc. ${parcela.numero_parcela}`
      : `Parcela ${parcela.numero_parcela}`;
  };

  const handleTipoChange = (novoTipo) => {
    setForm({ ...FORM_INICIAL, tipo: novoTipo });
  };

  const handleTituloChange = (e) => {
    const titulo = titulos.find((t) => t.id === e.target.value);
    setForm({
      ...form,
      titulo_id: e.target.value,
      conta_pagar_parcela_id: "",
      valor_titulo: titulo ? titulo.valor.toString() : "",
    });
  };

  const handleParcelaChange = (e) => {
    const parcela = (parcelas || []).find((p) => p.id === e.target.value);
    setForm({
      ...form,
      conta_pagar_parcela_id: e.target.value,
      titulo_id: "",
      valor_titulo: parcela ? parcela.valor.toString() : "",
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
    if (isPago && !form.conta_pagar_parcela_id) return alert("Selecione o título relacionado (conta a pagar)!");
    if (!isPago && !form.titulo_id) return alert("Selecione o título relacionado (venda)!");
    if (!form.movimento_bancario_id) return alert("Selecione um movimento bancário!");
    if (!form.valor_titulo || parseFloat(form.valor_titulo) <= 0) return alert("Valor do título inválido!");
    if (!form.valor_movimento || parseFloat(form.valor_movimento) <= 0) return alert("Valor do movimento inválido!");

    const payload = {
      tipo: form.tipo,
      status: "aguardando_confirmacao",
      titulo_id: isPago ? null : form.titulo_id,
      conta_pagar_parcela_id: isPago ? form.conta_pagar_parcela_id : null,
      movimento_bancario_id: form.movimento_bancario_id,
      valor_titulo: form.valor_titulo,
      valor_movimento: form.valor_movimento,
      data_conciliacao: form.data_conciliacao,
      observacoes: form.observacoes,
    };
    onSalvar(payload);
    onClose();
  };

  const f = (field) => (e) => setForm({ ...form, [field]: e.target.value });
  const inputCls = "w-full border border-gray-200 rounded px-2.5 py-1.5 text-sm focus:ring-1 focus:ring-gray-400 outline-none";

  const getContaNome = (contaId) =>
    contasBancarias.find((c) => c.id === contaId)?.nome || "-";

  const getFonteLabel = (fonte) =>
    FONTES_PAGAMENTO.find((fp) => fp.value === fonte)?.label || fonte || "-";

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg border border-gray-200 max-w-lg w-full p-4 max-h-[90vh] overflow-y-auto">
        <h3 className="text-sm font-semibold mb-3">Nova Conciliação Bancária</h3>

        {/* Toggle PAGO / RECEBIDO */}
        <div className="flex gap-2 mb-3">
          <button
            onClick={() => handleTipoChange("pago")}
            className={`flex-1 py-2 rounded text-xs font-semibold border transition-colors ${
              isPago
                ? "bg-red-600 text-white border-red-600"
                : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
            }`}
          >
            Pago
          </button>
          <button
            onClick={() => handleTipoChange("recebido")}
            className={`flex-1 py-2 rounded text-xs font-semibold border transition-colors ${
              !isPago
                ? "bg-green-600 text-white border-green-600"
                : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
            }`}
          >
            Recebido
          </button>
        </div>

        <div className="space-y-2.5">
          {/* Título Relacionado */}
          <div>
            <label className="block text-xs text-gray-600 mb-0.5">Título Relacionado *</label>
            {isPago ? (
              <>
                <select value={form.conta_pagar_parcela_id} onChange={handleParcelaChange} className={inputCls}>
                  <option value="">Selecione a conta a pagar...</option>
                  {parcelasPagas.map((p) => (
                    <option key={p.id} value={p.id}>
                      {getContaPagarDescricao(p.id)} — R$ {fmtBRL(p.valor)} — Pago em {p.data_pagamento ? new Date(p.data_pagamento + "T00:00:00").toLocaleDateString("pt-BR") : "-"}
                    </option>
                  ))}
                </select>
                {parcelasPagas.length === 0 && (
                  <p className="text-[11px] text-yellow-600 mt-1">
                    Nenhuma conta a pagar disponível para conciliação.
                  </p>
                )}
              </>
            ) : (
              <>
                <select value={form.titulo_id} onChange={handleTituloChange} className={inputCls}>
                  <option value="">Selecione o título de venda...</option>
                  {titulosDisponiveis.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.descricao} — R$ {fmtBRL(t.valor)} — Pago em {t.data_pagamento ? new Date(t.data_pagamento + "T00:00:00").toLocaleDateString("pt-BR") : "-"}
                    </option>
                  ))}
                </select>
                {titulosDisponiveis.length === 0 && (
                  <p className="text-[11px] text-yellow-600 mt-1">
                    Nenhum título de venda disponível para conciliação.
                  </p>
                )}
              </>
            )}
          </div>

          <div>
            <label className="block text-xs text-gray-600 mb-0.5">
              Movimento Bancário ({isPago ? "Saída" : "Entrada"}) *
            </label>
            <select value={form.movimento_bancario_id} onChange={handleMovimentoChange} className={inputCls}>
              <option value="">Selecione o movimento bancário...</option>
              {movimentosFiltrados.map((m) => (
                <option key={m.id} value={m.id}>
                  {new Date(m.data_movimento + "T00:00:00").toLocaleDateString("pt-BR")} — {m.descricao} — {getContaNome(m.conta_id)} — {getFonteLabel(m.fonte_pagamento)} — R$ {fmtBRL(m.valor)}
                </option>
              ))}
            </select>
            {movimentosFiltrados.length === 0 && (
              <p className="text-[11px] text-yellow-600 mt-1">
                Nenhum movimento de {isPago ? "saída" : "entrada"} disponível.
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs text-gray-600 mb-0.5">
                {isPago ? "Valor a Pagar (R$)" : "Valor do Título (R$)"} *
              </label>
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
              <label className="block text-xs text-gray-600 mb-0.5">
                {isPago ? "Valor Pago (R$)" : "Valor Recebido (R$)"} *
              </label>
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
              <p className="text-[11px] font-semibold text-gray-700 mb-1">Análise</p>
              <div className="grid grid-cols-3 gap-2 text-center">
                <div>
                  <p className="text-[10px] text-gray-500">{isPago ? "A Pagar" : "Vendido"}</p>
                  <p className="text-sm font-semibold text-gray-800">R$ {fmtBRL(form.valor_titulo)}</p>
                </div>
                <div>
                  <p className="text-[10px] text-gray-500">{isPago ? "Pago" : "Recebido"}</p>
                  <p className={`text-sm font-semibold ${isPago ? "text-red-700" : "text-green-700"}`}>
                    R$ {fmtBRL(form.valor_movimento)}
                  </p>
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
                  Diferença de R$ {fmtBRL(diferencaValor)} cobrada pelo banco/processadora
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
            className={`flex-1 px-3 py-1.5 text-white rounded text-xs ${
              isPago ? "bg-red-600 hover:bg-red-700" : "bg-green-600 hover:bg-green-700"
            }`}
          >
            Conciliar
          </button>
        </div>
      </div>
    </div>
  );
}
