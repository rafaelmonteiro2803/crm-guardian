import { useState } from "react";
import { DataGrid } from "../components/DataGrid";
import { Icons } from "../components/Icons";
import { MovimentoBancarioModal, FONTES_PAGAMENTO } from "../components/modals/MovimentoBancarioModal";

export function MovimentosBancariosPage({
  movimentosBancarios,
  contasBancarias,
  onSalvar,
  onExcluir,
  fmtBRL,
}) {
  const [modalAberto, setModalAberto] = useState(false);
  const [editando, setEditando] = useState(null);

  const abrirModal = (mov = null) => { setEditando(mov); setModalAberto(true); };
  const fecharModal = () => { setEditando(null); setModalAberto(false); };

  const handleSalvar = async (form) => {
    await onSalvar(form, editando?.id || null);
    fecharModal();
  };

  const handleExcluir = async (id) => {
    if (!confirm("Excluir este movimento bancário?")) return;
    await onExcluir(id);
  };

  const getContaNome = (contaId) =>
    contasBancarias.find((c) => c.id === contaId)?.nome || "-";

  const getFonteLabel = (fonte) =>
    FONTES_PAGAMENTO.find((fp) => fp.value === fonte)?.label || fonte || "-";

  // Apenas movimentos aprovados entram no cálculo de saldo
  const aprovados = movimentosBancarios.filter((m) => m.status === "aprovado");
  const totalEntradas = aprovados
    .filter((m) => m.tipo === "entrada")
    .reduce((s, m) => s + parseFloat(m.valor || 0), 0);
  const totalSaidas = aprovados
    .filter((m) => m.tipo === "saida")
    .reduce((s, m) => s + parseFloat(m.valor || 0), 0);
  const saldo = totalEntradas - totalSaidas;

  const qtdEmAprovacao = movimentosBancarios.filter((m) => m.status === "em_aprovacao").length;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sm font-semibold text-gray-700">Movimentos Bancários</h2>
          {qtdEmAprovacao > 0 && (
            <p className="text-[11px] text-yellow-600 mt-0.5">
              {qtdEmAprovacao} movimento{qtdEmAprovacao !== 1 ? "s" : ""} aguardando aprovação
            </p>
          )}
        </div>
        <button
          onClick={() => abrirModal()}
          className="inline-flex items-center gap-1 bg-gray-800 hover:bg-gray-700 text-white px-3 py-1.5 rounded text-xs font-medium"
        >
          <Icons.Plus />Novo Movimento
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="bg-white border border-green-200 rounded p-3">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-medium text-green-700">Total Entradas</span>
            <Icons.ArrowUpCircle className="w-4 h-4 text-green-500" />
          </div>
          <p className="text-lg font-semibold text-green-700">R$ {fmtBRL(totalEntradas)}</p>
          <p className="text-[11px] text-green-600">
            {aprovados.filter((m) => m.tipo === "entrada").length} aprovados
          </p>
        </div>
        <div className="bg-white border border-red-200 rounded p-3">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-medium text-red-700">Total Saídas</span>
            <Icons.ArrowDownCircle className="w-4 h-4 text-red-400" />
          </div>
          <p className="text-lg font-semibold text-red-700">R$ {fmtBRL(totalSaidas)}</p>
          <p className="text-[11px] text-red-600">
            {aprovados.filter((m) => m.tipo === "saida").length} aprovados
          </p>
        </div>
        <div className={`bg-white border rounded p-3 ${saldo >= 0 ? "border-blue-200" : "border-red-300"}`}>
          <div className="flex items-center justify-between mb-1">
            <span className={`text-xs font-medium ${saldo >= 0 ? "text-blue-700" : "text-red-700"}`}>Saldo</span>
            <Icons.CreditCard className={`w-4 h-4 ${saldo >= 0 ? "text-blue-400" : "text-red-400"}`} />
          </div>
          <p className={`text-lg font-semibold ${saldo >= 0 ? "text-blue-700" : "text-red-700"}`}>
            R$ {fmtBRL(saldo)}
          </p>
          <p className={`text-[11px] ${saldo >= 0 ? "text-blue-600" : "text-red-600"}`}>
            {movimentosBancarios.length} total · {qtdEmAprovacao} em aprovação
          </p>
        </div>
      </div>

      {qtdEmAprovacao > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded p-3 flex items-start gap-2">
          <Icons.AlertCircle className="w-4 h-4 text-yellow-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-xs font-semibold text-yellow-700">
              {qtdEmAprovacao} movimento{qtdEmAprovacao !== 1 ? "s" : ""} em aprovação
            </p>
            <p className="text-[11px] text-yellow-600 mt-0.5">
              Clique em "Aprovar" para confirmar a conta bancária e a forma de pagamento.
            </p>
          </div>
        </div>
      )}

      <DataGrid
        columns={[
          {
            key: "data_movimento",
            label: "Data",
            render: (m) => (
              <span className="text-gray-600 text-[11px]">
                {new Date(m.data_movimento + "T00:00:00").toLocaleDateString("pt-BR")}
              </span>
            ),
            filterValue: (m) => new Date(m.data_movimento + "T00:00:00").toLocaleDateString("pt-BR"),
            sortValue: (m) => m.data_movimento,
          },
          {
            key: "tipo",
            label: "Tipo",
            render: (m) =>
              m.tipo === "entrada" ? (
                <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[11px] bg-green-50 text-green-700">
                  <Icons.ArrowUpCircle className="w-3 h-3" />Entrada
                </span>
              ) : (
                <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[11px] bg-red-50 text-red-700">
                  <Icons.ArrowDownCircle className="w-3 h-3" />Saída
                </span>
              ),
            filterValue: (m) => (m.tipo === "entrada" ? "Entrada" : "Saída"),
          },
          {
            key: "descricao",
            label: "Descrição",
            render: (m) => <span className="font-medium text-gray-800">{m.descricao}</span>,
            filterValue: (m) => m.descricao || "",
          },
          {
            key: "conta_id",
            label: "Conta",
            render: (m) =>
              m.conta_id ? (
                <span className="text-gray-600">{getContaNome(m.conta_id)}</span>
              ) : (
                <span className="text-yellow-600 text-[11px] italic">Não definida</span>
              ),
            filterValue: (m) => getContaNome(m.conta_id),
          },
          {
            key: "fonte_pagamento",
            label: "Fonte",
            render: (m) =>
              m.fonte_pagamento ? (
                <span className="px-1.5 py-0.5 rounded text-[11px] bg-blue-50 text-blue-700">
                  {getFonteLabel(m.fonte_pagamento)}
                </span>
              ) : (
                <span className="text-yellow-600 text-[11px] italic">Não definida</span>
              ),
            filterValue: (m) => getFonteLabel(m.fonte_pagamento),
          },
          {
            key: "valor",
            label: "Valor",
            render: (m) => (
              <span className={`font-semibold ${m.tipo === "entrada" ? "text-green-700" : "text-red-700"} ${m.status === "em_aprovacao" ? "opacity-60" : ""}`}>
                {m.tipo === "saida" ? "- " : ""}R$ {fmtBRL(m.valor)}
              </span>
            ),
            sortValue: (m) => parseFloat(m.valor || 0),
          },
          {
            key: "status",
            label: "Status",
            render: (m) =>
              m.status === "em_aprovacao" ? (
                <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[11px] font-medium bg-yellow-50 text-yellow-700 border border-yellow-200">
                  Em Aprovação
                </span>
              ) : (
                <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[11px] font-medium bg-green-50 text-green-700">
                  Aprovado
                </span>
              ),
            filterValue: (m) => m.status === "em_aprovacao" ? "Em Aprovação" : "Aprovado",
          },
        ]}
        data={movimentosBancarios}
        actions={(m) => (
          <div className="flex items-center gap-1">
            {m.status === "em_aprovacao" && (
              <button
                onClick={() => abrirModal(m)}
                className="text-blue-600 hover:bg-blue-50 px-1.5 py-0.5 rounded text-[11px] font-medium flex items-center gap-0.5 border border-blue-200"
              >
                <Icons.CheckCircle className="w-3 h-3" />Aprovar
              </button>
            )}
            {m.status === "aprovado" && (
              <button
                onClick={() => abrirModal(m)}
                className="text-gray-500 hover:text-gray-700 hover:bg-gray-100 p-1 rounded"
              >
                <Icons.Edit />
              </button>
            )}
            <button
              onClick={() => handleExcluir(m.id)}
              className="text-gray-400 hover:text-red-600 hover:bg-red-50 p-1 rounded"
            >
              <Icons.Trash />
            </button>
          </div>
        )}
        rowClassName={(m) => {
          if (m.status === "em_aprovacao") return "bg-yellow-50/40 opacity-80";
          return m.tipo === "saida" ? "bg-red-50/20" : "";
        }}
        emptyMessage="Nenhum movimento bancário registrado."
      />

      <MovimentoBancarioModal
        aberto={modalAberto}
        editando={editando}
        contasBancarias={contasBancarias}
        onClose={fecharModal}
        onSalvar={handleSalvar}
      />
    </div>
  );
}
