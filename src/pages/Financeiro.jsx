import React, { useState } from "react";
import { Icons } from "../components/Icons";
import { DataGrid } from "../components/DataGrid";
import { TituloModal } from "../components/modals/TituloModal";

export function FinanceiroPage({ titulos, vendas, fmtBRL, onSalvar, onExcluir, onMarcarPago }) {
  const [editando, setEditando] = useState(null);
  const [modalAberto, setModalAberto] = useState(false);

  const abrirModal = (titulo = null) => {
    setEditando(titulo);
    setModalAberto(true);
  };

  const fecharModal = () => {
    setEditando(null);
    setModalAberto(false);
  };

  const handleSalvar = (form) => {
    onSalvar(form, editando, fecharModal);
  };

  const pend = titulos.filter((t) => t.status === "pendente");
  const pagos = titulos.filter((t) => t.status === "pago");
  const venc = pend.filter((t) => new Date(t.data_vencimento) < new Date());

  const totalRecebido = pagos.reduce((s, t) => s + parseFloat(t.valor || 0), 0);
  const totalReceber = pend.reduce((s, t) => s + parseFloat(t.valor || 0), 0);
  const totalVencido = venc.reduce((s, t) => s + parseFloat(t.valor || 0), 0);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-gray-700">Financeiro</h2>
        <button
          onClick={() => abrirModal()}
          className="inline-flex items-center gap-1 bg-gray-800 hover:bg-gray-700 text-white px-3 py-1.5 rounded text-xs font-medium"
        >
          <Icons.Plus />Novo Título
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="bg-white border border-green-200 rounded p-3">
          <span className="text-xs font-medium text-green-700">Pagos</span>
          <p className="text-lg font-semibold text-green-700">R$ {fmtBRL(totalRecebido)}</p>
          <p className="text-[11px] text-green-600">{pagos.length} títulos</p>
        </div>
        <div className="bg-white border border-yellow-200 rounded p-3">
          <span className="text-xs font-medium text-yellow-700">Pendentes</span>
          <p className="text-lg font-semibold text-yellow-700">R$ {fmtBRL(totalReceber)}</p>
          <p className="text-[11px] text-yellow-600">{pend.length} títulos</p>
        </div>
        <div className="bg-white border border-red-200 rounded p-3">
          <span className="text-xs font-medium text-red-700">Vencidos</span>
          <p className="text-lg font-semibold text-red-700">R$ {fmtBRL(totalVencido)}</p>
          <p className="text-[11px] text-red-600">{venc.length} títulos</p>
        </div>
      </div>

      <DataGrid
        columns={[
          { key: "descricao", label: "Descrição", filterValue: (t) => t.descricao || "" },
          {
            key: "data_emissao",
            label: "Emissão",
            render: (t) => new Date(t.data_emissao).toLocaleDateString("pt-BR"),
            filterValue: (t) => new Date(t.data_emissao).toLocaleDateString("pt-BR"),
            sortValue: (t) => t.data_emissao,
          },
          {
            key: "data_vencimento",
            label: "Vencimento",
            render: (t) => new Date(t.data_vencimento).toLocaleDateString("pt-BR"),
            filterValue: (t) => new Date(t.data_vencimento).toLocaleDateString("pt-BR"),
            sortValue: (t) => t.data_vencimento,
          },
          {
            key: "valor",
            label: "Valor",
            render: (t) => <span className="font-medium">R$ {fmtBRL(t.valor)}</span>,
            sortValue: (t) => parseFloat(t.valor || 0),
          },
          {
            key: "status",
            label: "Status",
            render: (t) => {
              const vencido = t.status === "pendente" && new Date(t.data_vencimento) < new Date();
              if (t.status === "pago")
                return <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[11px] bg-green-50 text-green-700"><Icons.CheckCircle className="w-3 h-3" />Pago</span>;
              if (vencido)
                return <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[11px] bg-red-50 text-red-700"><Icons.XCircle className="w-3 h-3" />Vencido</span>;
              return <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[11px] bg-yellow-50 text-yellow-700"><Icons.Clock className="w-3 h-3" />Pendente</span>;
            },
            filterValue: (t) => {
              const vencido = t.status === "pendente" && new Date(t.data_vencimento) < new Date();
              return t.status === "pago" ? "Pago" : vencido ? "Vencido" : "Pendente";
            },
          },
        ]}
        data={titulos}
        actions={(t) => (
          <div className="flex items-center gap-1">
            {t.status === "pendente" && (
              <button
                onClick={() => onMarcarPago(t.id)}
                className="text-green-600 hover:bg-green-50 px-1.5 py-0.5 rounded text-[11px] font-medium"
              >
                Pagar
              </button>
            )}
            <button
              onClick={() => abrirModal(t)}
              className="text-gray-500 hover:text-gray-700 hover:bg-gray-100 p-1 rounded"
            >
              <Icons.Edit />
            </button>
            <button
              onClick={() => onExcluir(t.id)}
              className="text-gray-400 hover:text-red-600 hover:bg-red-50 p-1 rounded"
            >
              <Icons.Trash />
            </button>
          </div>
        )}
        rowClassName={(t) =>
          t.status === "pendente" && new Date(t.data_vencimento) < new Date() ? "bg-red-50/50" : ""
        }
        emptyMessage="Nenhum título cadastrado."
      />

      {modalAberto && (
        <TituloModal
          editando={editando}
          vendas={vendas}
          titulos={titulos}
          fmtBRL={fmtBRL}
          onSalvar={handleSalvar}
          onFechar={fecharModal}
        />
      )}
    </div>
  );
}
