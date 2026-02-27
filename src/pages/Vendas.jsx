import React, { useState } from "react";
import { Icons } from "../components/Icons";
import { DataGrid } from "../components/DataGrid";
import { VendaModal } from "../components/modals/VendaModal";

export function VendasPage({ vendas, clientes, produtos, fmtBRL, onSalvar, onExcluir, getClienteNome }) {
  const [editando, setEditando] = useState(null);
  const [modalAberto, setModalAberto] = useState(false);

  const abrirModal = (venda = null) => {
    setEditando(venda);
    setModalAberto(true);
  };

  const fecharModal = () => {
    setEditando(null);
    setModalAberto(false);
  };

  const handleSalvar = (form) => {
    onSalvar(form, editando, fecharModal);
  };

  const actBtns = (onEdit, onDelete) => (
    <div className="flex items-center gap-1">
      <button onClick={onEdit} className="text-gray-500 hover:text-gray-700 hover:bg-gray-100 p-1 rounded">
        <Icons.Edit />
      </button>
      <button onClick={onDelete} className="text-gray-400 hover:text-red-600 hover:bg-red-50 p-1 rounded">
        <Icons.Trash />
      </button>
    </div>
  );

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-gray-700">Vendas</h2>
        <button
          onClick={() => abrirModal()}
          className="inline-flex items-center gap-1 bg-gray-800 hover:bg-gray-700 text-white px-3 py-1.5 rounded text-xs font-medium"
          disabled={!clientes.length}
        >
          <Icons.Plus />Nova Venda
        </button>
      </div>

      <DataGrid
        columns={[
          {
            key: "data_venda",
            label: "Data",
            render: (v) => new Date(v.data_venda).toLocaleDateString("pt-BR"),
            filterValue: (v) => new Date(v.data_venda).toLocaleDateString("pt-BR"),
            sortValue: (v) => v.data_venda,
          },
          {
            key: "cliente_id",
            label: "Cliente",
            render: (v) => <span className="font-medium">{getClienteNome(v.cliente_id)}</span>,
            filterValue: (v) => getClienteNome(v.cliente_id),
          },
          { key: "descricao", label: "Descrição", filterValue: (v) => v.descricao || "" },
          {
            key: "itens",
            label: "Produtos",
            filterable: false,
            render: (v) =>
              v.itens && v.itens.length > 0
                ? v.itens.map((it, i) => (
                    <div key={i} className="text-[11px]">
                      <span className="font-medium">{it.nome}</span>{" "}
                      <span className="text-gray-400">x{it.quantidade}</span>
                    </div>
                  ))
                : <span className="text-gray-300">-</span>,
          },
          {
            key: "desconto",
            label: "Desconto",
            render: (v) =>
              parseFloat(v.desconto || 0) > 0
                ? <span className="text-red-600">-R$ {fmtBRL(v.desconto)}</span>
                : <span className="text-gray-300">-</span>,
            sortValue: (v) => parseFloat(v.desconto || 0),
          },
          {
            key: "forma_pagamento",
            label: "Pgto",
            render: (v) => <span className="capitalize">{v.forma_pagamento}</span>,
            filterValue: (v) => v.forma_pagamento || "",
          },
          {
            key: "valor",
            label: "Valor",
            render: (v) => <span className="font-medium text-green-700">R$ {fmtBRL(v.valor)}</span>,
            sortValue: (v) => parseFloat(v.valor || 0),
          },
        ]}
        data={vendas}
        actions={(v) => actBtns(() => abrirModal(v), () => onExcluir(v.id))}
        emptyMessage="Nenhuma venda registrada."
      />

      {modalAberto && (
        <VendaModal
          editando={editando}
          clientes={clientes}
          produtos={produtos}
          fmtBRL={fmtBRL}
          onSalvar={handleSalvar}
          onFechar={fecharModal}
        />
      )}
    </div>
  );
}
