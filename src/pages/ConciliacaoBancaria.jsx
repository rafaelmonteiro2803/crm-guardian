import { useState } from "react";
import { DataGrid } from "../components/DataGrid";
import { Icons } from "../components/Icons";
import { ConciliacaoModal } from "../components/modals/ConciliacaoModal";
import { FONTES_PAGAMENTO } from "../components/modals/MovimentoBancarioModal";

export function ConciliacaoBancariaPage({
  conciliacoesBancarias,
  titulos,
  parcelas,
  contasPagar,
  movimentosBancarios,
  contasBancarias,
  onSalvar,
  onExcluir,
  fmtBRL,
}) {
  const [modalAberto, setModalAberto] = useState(false);
  const [filtroTipo, setFiltroTipo] = useState("todos");

  const handleSalvar = async (form) => {
    await onSalvar(form);
    setModalAberto(false);
  };

  const handleExcluir = async (id) => {
    if (!confirm("Excluir esta conciliação? O título e o movimento voltarão a ficar disponíveis.")) return;
    await onExcluir(id);
  };

  const getTituloRelacionado = (c) => {
    if (c.tipo === "pago" && c.conta_pagar_parcela_id) {
      const parcela = (parcelas || []).find((p) => p.id === c.conta_pagar_parcela_id);
      if (!parcela) return "-";
      const conta = (contasPagar || []).find((cp) => cp.id === parcela.conta_pagar_id);
      return conta
        ? `${conta.descricao} - Parc. ${parcela.numero_parcela}`
        : `Parcela ${parcela.numero_parcela}`;
    }
    const t = titulos.find((t) => t.id === c.titulo_id);
    return t ? t.descricao : "-";
  };

  const getMovimentoDesc = (movId) => {
    const m = movimentosBancarios.find((m) => m.id === movId);
    return m ? m.descricao : "-";
  };

  const getContaNome = (movId) => {
    const m = movimentosBancarios.find((m) => m.id === movId);
    if (!m || !m.conta_id) return "-";
    return contasBancarias.find((c) => c.id === m.conta_id)?.nome || "-";
  };

  const getFonteLabel = (movId) => {
    const m = movimentosBancarios.find((m) => m.id === movId);
    if (!m || !m.fonte_pagamento) return "-";
    return FONTES_PAGAMENTO.find((fp) => fp.value === m.fonte_pagamento)?.label || m.fonte_pagamento || "-";
  };

  // Filtra conciliações por tipo
  const conciliacoesFiltradas = filtroTipo === "todos"
    ? conciliacoesBancarias
    : conciliacoesBancarias.filter((c) => c.tipo === filtroTipo);

  // Resumo geral das taxas (apenas confirmados e recebido para compatibilidade)
  const totalVendido = conciliacoesBancarias.reduce((s, c) => s + parseFloat(c.valor_titulo || 0), 0);
  const totalRecebido = conciliacoesBancarias.reduce((s, c) => s + parseFloat(c.valor_movimento || 0), 0);
  const totalDiferenca = totalVendido - totalRecebido;
  const percentualMedio =
    totalVendido > 0 ? (totalDiferenca / totalVendido) * 100 : 0;

  // Contadores para badges
  const qtdPago = conciliacoesBancarias.filter((c) => c.tipo === "pago").length;
  const qtdRecebido = conciliacoesBancarias.filter((c) => c.tipo === "recebido").length;

  // Títulos de venda pagos aguardando conciliação
  const idsTitulosConciliados = new Set(
    conciliacoesBancarias.filter((c) => c.titulo_id).map((c) => c.titulo_id)
  );
  const titulosVendaPendentesConciliacao = titulos.filter(
    (t) => t.status === "pago" && !idsTitulosConciliados.has(t.id)
  ).length;

  // Parcelas pagas aguardando conciliação
  const idsParcelasConciliadas = new Set(
    conciliacoesBancarias.filter((c) => c.conta_pagar_parcela_id).map((c) => c.conta_pagar_parcela_id)
  );
  const parcelasPagosPendentesConciliacao = (parcelas || []).filter(
    (p) => p.status === "pago" && !idsParcelasConciliadas.has(p.id)
  ).length;

  const totalPendentes = titulosVendaPendentesConciliacao + parcelasPagosPendentesConciliacao;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sm font-semibold text-gray-700">Conciliação Bancária</h2>
          <p className="text-[11px] text-gray-400 mt-0.5">
            {conciliacoesBancarias.length} conciliação{conciliacoesBancarias.length !== 1 ? "ões" : ""} ·{" "}
            {totalPendentes > 0 ? (
              <span className="text-amber-600 font-medium">{totalPendentes} pendente{totalPendentes !== 1 ? "s" : ""}</span>
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

      {/* Filtros PAGO / RECEBIDO */}
      <div className="flex gap-2">
        <button
          onClick={() => setFiltroTipo("todos")}
          className={`px-3 py-1.5 rounded text-xs font-medium border transition-colors ${
            filtroTipo === "todos"
              ? "bg-gray-800 text-white border-gray-800"
              : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
          }`}
        >
          Todos
          <span className={`ml-1 text-[10px] px-1 rounded-full ${filtroTipo === "todos" ? "bg-white/20" : "bg-gray-100"}`}>
            {conciliacoesBancarias.length}
          </span>
        </button>
        <button
          onClick={() => setFiltroTipo("pago")}
          className={`px-3 py-1.5 rounded text-xs font-medium border transition-colors ${
            filtroTipo === "pago"
              ? "bg-red-600 text-white border-red-600"
              : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
          }`}
        >
          Pago
          <span className={`ml-1 text-[10px] px-1 rounded-full ${filtroTipo === "pago" ? "bg-white/20" : "bg-gray-100"}`}>
            {qtdPago}
          </span>
        </button>
        <button
          onClick={() => setFiltroTipo("recebido")}
          className={`px-3 py-1.5 rounded text-xs font-medium border transition-colors ${
            filtroTipo === "recebido"
              ? "bg-green-600 text-white border-green-600"
              : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
          }`}
        >
          Recebido
          <span className={`ml-1 text-[10px] px-1 rounded-full ${filtroTipo === "recebido" ? "bg-white/20" : "bg-gray-100"}`}>
            {qtdRecebido}
          </span>
        </button>
      </div>

      {conciliacoesBancarias.length > 0 && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="bg-white border border-gray-200 rounded p-3">
            <span className="text-xs text-gray-500">Total (Títulos)</span>
            <p className="text-base font-semibold text-gray-800 mt-0.5">R$ {fmtBRL(totalVendido)}</p>
            <p className="text-[11px] text-gray-400">{conciliacoesBancarias.length} conciliações</p>
          </div>
          <div className="bg-white border border-green-200 rounded p-3">
            <span className="text-xs text-gray-500">Total (Movimentos)</span>
            <p className="text-base font-semibold text-green-700 mt-0.5">R$ {fmtBRL(totalRecebido)}</p>
            <p className="text-[11px] text-green-600">valor efetivo</p>
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

      {totalPendentes > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded p-3 flex items-start gap-2">
          <Icons.AlertCircle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-xs font-semibold text-amber-700">
              {totalPendentes} item{totalPendentes !== 1 ? "s" : ""} aguardando conciliação
            </p>
            <p className="text-[11px] text-amber-600 mt-0.5">
              {titulosVendaPendentesConciliacao > 0 && `${titulosVendaPendentesConciliacao} título${titulosVendaPendentesConciliacao !== 1 ? "s" : ""} de venda pago${titulosVendaPendentesConciliacao !== 1 ? "s" : ""}`}
              {titulosVendaPendentesConciliacao > 0 && parcelasPagosPendentesConciliacao > 0 && " · "}
              {parcelasPagosPendentesConciliacao > 0 && `${parcelasPagosPendentesConciliacao} conta${parcelasPagosPendentesConciliacao !== 1 ? "s" : ""} a pagar paga${parcelasPagosPendentesConciliacao !== 1 ? "s" : ""}`}
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
            key: "tipo",
            label: "Tipo",
            render: (c) => (
              <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[11px] font-medium ${
                c.tipo === "pago"
                  ? "bg-red-50 text-red-700"
                  : "bg-green-50 text-green-700"
              }`}>
                {c.tipo === "pago" ? "Pago" : "Recebido"}
              </span>
            ),
            filterValue: (c) => c.tipo === "pago" ? "Pago" : "Recebido",
          },
          {
            key: "titulo_relacionado",
            label: "Título Relacionado",
            render: (c) => <span className="font-medium text-gray-800">{getTituloRelacionado(c)}</span>,
            filterValue: (c) => getTituloRelacionado(c),
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
            label: "Valor Título",
            render: (c) => <span className="font-medium text-gray-800">R$ {fmtBRL(c.valor_titulo)}</span>,
            sortValue: (c) => parseFloat(c.valor_titulo || 0),
          },
          {
            key: "valor_movimento",
            label: "Valor Movimento",
            render: (c) => (
              <span className={`font-medium ${c.tipo === "pago" ? "text-red-700" : "text-green-700"}`}>
                R$ {fmtBRL(c.valor_movimento)}
              </span>
            ),
            sortValue: (c) => parseFloat(c.valor_movimento || 0),
          },
          {
            key: "status",
            label: "Status",
            render: (c) => (
              <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[11px] font-medium ${
                c.status === "confirmado"
                  ? "bg-green-50 text-green-700"
                  : "bg-yellow-50 text-yellow-700"
              }`}>
                {c.status === "confirmado" ? "Confirmado" : "Aguard. Confirmação"}
              </span>
            ),
            filterValue: (c) => c.status === "confirmado" ? "Confirmado" : "Aguardando Confirmação",
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
        data={conciliacoesFiltradas}
        actions={(c) => (
          <button
            onClick={() => handleExcluir(c.id)}
            className="text-gray-400 hover:text-red-600 hover:bg-red-50 p-1 rounded"
          >
            <Icons.Trash />
          </button>
        )}
        rowClassName={(c) => {
          if (c.status === "aguardando_confirmacao") return "bg-yellow-50/30";
          const pct = parseFloat(c.percentual_taxa || 0);
          return pct > 3 ? "bg-red-50/30" : pct > 0.005 ? "bg-amber-50/30" : "";
        }}
        emptyMessage="Nenhuma conciliação encontrada para o filtro selecionado."
      />

      <ConciliacaoModal
        aberto={modalAberto}
        onClose={() => setModalAberto(false)}
        onSalvar={handleSalvar}
        titulos={titulos}
        parcelas={parcelas}
        contasPagar={contasPagar}
        movimentosBancarios={movimentosBancarios}
        contasBancarias={contasBancarias}
        conciliacoes={conciliacoesBancarias}
        fmtBRL={fmtBRL}
      />
    </div>
  );
}
