import { useState } from "react";
import { DataGrid } from "../components/DataGrid";
import { Icons } from "../components/Icons";
import { ConciliacaoModal } from "../components/modals/ConciliacaoModal";
import { FONTES_PAGAMENTO } from "../components/modals/MovimentoBancarioModal";

export function ConciliacaoBancariaPage({
  conciliacoesBancarias,
  titulos,
  movimentosBancarios,
  contasBancarias,
  onSalvar,
  onExcluir,
  fmtBRL,
}) {
  const [modalAberto, setModalAberto] = useState(false);

  const handleSalvar = async (form) => {
    await onSalvar(form);
    setModalAberto(false);
  };

  const handleExcluir = async (id) => {
    if (!confirm("Excluir esta conciliação? O título e o movimento voltarão a ficar disponíveis.")) return;
    await onExcluir(id);
  };

  const getTituloDesc = (tituloId) => {
    const t = titulos.find((t) => t.id === tituloId);
    return t ? t.descricao : "-";
  };

  const getMovimentoDesc = (movId) => {
    const m = movimentosBancarios.find((m) => m.id === movId);
    return m ? m.descricao : "-";
  };

  const getContaNome = (movId) => {
    const m = movimentosBancarios.find((m) => m.id === movId);
    if (!m) return "-";
    return contasBancarias.find((c) => c.id === m.conta_id)?.nome || "-";
  };

  const getFonteLabel = (movId) => {
    const m = movimentosBancarios.find((m) => m.id === movId);
    if (!m) return "-";
    return FONTES_PAGAMENTO.find((fp) => fp.value === m.fonte_pagamento)?.label || m.fonte_pagamento || "-";
  };

  // Resumo geral das taxas
  const totalVendido = conciliacoesBancarias.reduce((s, c) => s + parseFloat(c.valor_titulo || 0), 0);
  const totalRecebido = conciliacoesBancarias.reduce((s, c) => s + parseFloat(c.valor_movimento || 0), 0);
  const totalDiferenca = totalVendido - totalRecebido;
  const percentualMedio =
    totalVendido > 0 ? (totalDiferenca / totalVendido) * 100 : 0;

  const titulosPagosTotal = titulos.filter((t) => t.status === "pago").length;
  const titulosConciliados = new Set(conciliacoesBancarias.map((c) => c.titulo_id)).size;
  const titulosPendenteConciliacao = titulosPagosTotal - titulosConciliados;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sm font-semibold text-gray-700">Conciliação Bancária</h2>
          <p className="text-[11px] text-gray-400 mt-0.5">
            {titulosConciliados} conciliado{titulosConciliados !== 1 ? "s" : ""} ·{" "}
            {titulosPendenteConciliacao > 0 ? (
              <span className="text-amber-600 font-medium">{titulosPendenteConciliacao} pendente{titulosPendenteConciliacao !== 1 ? "s" : ""}</span>
            ) : (
              <span className="text-green-600 font-medium">todos conciliados</span>
            )}
          </p>
        </div>
        <button
          onClick={() => setModalAberto(true)}
          className="inline-flex items-center gap-1 bg-gray-800 hover:bg-gray-700 text-white px-3 py-1.5 rounded text-xs font-medium"
        >
          <Icons.Plus />Nova Conciliação
        </button>
      </div>

      {conciliacoesBancarias.length > 0 && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="bg-white border border-gray-200 rounded p-3">
            <span className="text-xs text-gray-500">Total Vendido</span>
            <p className="text-base font-semibold text-gray-800 mt-0.5">R$ {fmtBRL(totalVendido)}</p>
            <p className="text-[11px] text-gray-400">{conciliacoesBancarias.length} conciliações</p>
          </div>
          <div className="bg-white border border-green-200 rounded p-3">
            <span className="text-xs text-gray-500">Total Recebido</span>
            <p className="text-base font-semibold text-green-700 mt-0.5">R$ {fmtBRL(totalRecebido)}</p>
            <p className="text-[11px] text-green-600">valor creditado</p>
          </div>
          <div className="bg-white border border-amber-200 rounded p-3">
            <span className="text-xs text-gray-500">Total de Taxas</span>
            <p className="text-base font-semibold text-amber-700 mt-0.5">R$ {fmtBRL(totalDiferenca)}</p>
            <p className="text-[11px] text-amber-600">cobrado pelo banco/processadora</p>
          </div>
          <div className={`bg-white border rounded p-3 ${percentualMedio > 3 ? "border-red-200" : "border-blue-200"}`}>
            <span className="text-xs text-gray-500">Taxa Média</span>
            <p className={`text-base font-semibold mt-0.5 ${percentualMedio > 3 ? "text-red-700" : "text-blue-700"}`}>
              {percentualMedio.toFixed(2)}%
            </p>
            <p className={`text-[11px] ${percentualMedio > 3 ? "text-red-500" : "text-blue-500"}`}>
              {percentualMedio > 3 ? "acima do esperado" : "dentro do normal"}
            </p>
          </div>
        </div>
      )}

      {titulosPendenteConciliacao > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded p-3 flex items-start gap-2">
          <Icons.AlertCircle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-xs font-semibold text-amber-700">
              {titulosPendenteConciliacao} título{titulosPendenteConciliacao !== 1 ? "s" : ""} pago{titulosPendenteConciliacao !== 1 ? "s" : ""} aguardando conciliação
            </p>
            <p className="text-[11px] text-amber-600 mt-0.5">
              Relacione os títulos pagos com os respectivos movimentos bancários para calcular as taxas cobradas.
            </p>
          </div>
        </div>
      )}

      <DataGrid
        columns={[
          {
            key: "data_conciliacao",
            label: "Data",
            render: (c) => (
              <span className="text-gray-600 text-[11px]">
                {new Date(c.data_conciliacao + "T00:00:00").toLocaleDateString("pt-BR")}
              </span>
            ),
            filterValue: (c) => new Date(c.data_conciliacao + "T00:00:00").toLocaleDateString("pt-BR"),
            sortValue: (c) => c.data_conciliacao,
          },
          {
            key: "titulo_id",
            label: "Título",
            render: (c) => <span className="font-medium text-gray-800">{getTituloDesc(c.titulo_id)}</span>,
            filterValue: (c) => getTituloDesc(c.titulo_id),
          },
          {
            key: "movimento_bancario_id",
            label: "Movimento / Conta",
            render: (c) => (
              <div>
                <span className="text-gray-700">{getMovimentoDesc(c.movimento_bancario_id)}</span>
                <p className="text-[11px] text-gray-400">{getContaNome(c.movimento_bancario_id)}</p>
              </div>
            ),
            filterValue: (c) => getMovimentoDesc(c.movimento_bancario_id),
          },
          {
            key: "fonte",
            label: "Fonte",
            render: (c) => (
              <span className="px-1.5 py-0.5 rounded text-[11px] bg-blue-50 text-blue-700">
                {getFonteLabel(c.movimento_bancario_id)}
              </span>
            ),
            filterValue: (c) => getFonteLabel(c.movimento_bancario_id),
          },
          {
            key: "valor_titulo",
            label: "Vendido",
            render: (c) => <span className="font-medium text-gray-800">R$ {fmtBRL(c.valor_titulo)}</span>,
            sortValue: (c) => parseFloat(c.valor_titulo || 0),
          },
          {
            key: "valor_movimento",
            label: "Recebido",
            render: (c) => <span className="font-medium text-green-700">R$ {fmtBRL(c.valor_movimento)}</span>,
            sortValue: (c) => parseFloat(c.valor_movimento || 0),
          },
          {
            key: "diferenca",
            label: "Diferença",
            render: (c) => {
              const diff = parseFloat(c.diferenca || 0);
              return diff > 0.005 ? (
                <span className="font-medium text-amber-700">- R$ {fmtBRL(diff)}</span>
              ) : (
                <span className="text-green-600 text-[11px]">Sem taxa</span>
              );
            },
            sortValue: (c) => parseFloat(c.diferenca || 0),
          },
          {
            key: "percentual_taxa",
            label: "Taxa %",
            render: (c) => {
              const pct = parseFloat(c.percentual_taxa || 0);
              return pct > 0.005 ? (
                <span className={`font-semibold ${pct > 3 ? "text-red-600" : "text-amber-600"}`}>
                  {pct.toFixed(2)}%
                </span>
              ) : (
                <span className="text-green-600 text-[11px]">0%</span>
              );
            },
            sortValue: (c) => parseFloat(c.percentual_taxa || 0),
          },
        ]}
        data={conciliacoesBancarias}
        actions={(c) => (
          <button
            onClick={() => handleExcluir(c.id)}
            className="text-gray-400 hover:text-red-600 hover:bg-red-50 p-1 rounded"
          >
            <Icons.Trash />
          </button>
        )}
        rowClassName={(c) => {
          const pct = parseFloat(c.percentual_taxa || 0);
          return pct > 3 ? "bg-red-50/30" : pct > 0.005 ? "bg-amber-50/30" : "";
        }}
        emptyMessage="Nenhuma conciliação registrada. Relacione títulos pagos com movimentos bancários."
      />

      <ConciliacaoModal
        aberto={modalAberto}
        onClose={() => setModalAberto(false)}
        onSalvar={handleSalvar}
        titulos={titulos}
        movimentosBancarios={movimentosBancarios}
        contasBancarias={contasBancarias}
        conciliacoes={conciliacoesBancarias}
        fmtBRL={fmtBRL}
      />
    </div>
  );
}
