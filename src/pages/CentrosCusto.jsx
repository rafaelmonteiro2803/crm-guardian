import { useState } from "react";
import { DataGrid } from "../components/DataGrid";
import { Icons } from "../components/Icons";
import { CentroCustoModal } from "../components/modals/CentroCustoModal";

export function CentrosCustoPage({ centrosCusto, onSalvar, onExcluir }) {
  const [modal, setModal] = useState(false);
  const [editando, setEditando] = useState(null);

  const abrir = (item = null) => { setEditando(item); setModal(true); };
  const fechar = () => { setEditando(null); setModal(false); };

  const handleSalvar = async (form) => {
    await onSalvar(form, editando?.id || null);
    fechar();
  };

  const handleExcluir = async (id) => {
    if (!confirm("Excluir centro de custo?")) return;
    await onExcluir(id);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sm font-semibold text-gray-700">Centros de Custo</h2>
          <p className="text-[11px] text-gray-400">
            {centrosCusto.filter((c) => c.ativo).length} ativo(s)
          </p>
        </div>
        <button
          onClick={() => abrir()}
          className="inline-flex items-center gap-1 bg-gray-800 hover:bg-gray-700 text-white px-3 py-1.5 rounded text-xs font-medium"
        >
          <Icons.Plus />Novo Centro de Custo
        </button>
      </div>

      <DataGrid
        columns={[
          {
            key: "nome",
            label: "Nome",
            render: (c) => <span className="font-medium text-gray-800">{c.nome}</span>,
            filterValue: (c) => c.nome || "",
          },
          {
            key: "codigo",
            label: "Código",
            render: (c) => c.codigo ? (
              <span className="font-mono text-xs bg-gray-100 px-1.5 py-0.5 rounded">{c.codigo}</span>
            ) : <span className="text-gray-300">-</span>,
            filterValue: (c) => c.codigo || "",
          },
          {
            key: "descricao",
            label: "Descrição",
            render: (c) => c.descricao || <span className="text-gray-300">-</span>,
            filterValue: (c) => c.descricao || "",
          },
          {
            key: "ativo",
            label: "Status",
            render: (c) =>
              c.ativo ? (
                <span className="px-1.5 py-0.5 rounded text-[11px] bg-green-50 text-green-700">Ativo</span>
              ) : (
                <span className="px-1.5 py-0.5 rounded text-[11px] bg-gray-100 text-gray-500">Inativo</span>
              ),
            filterValue: (c) => (c.ativo ? "Ativo" : "Inativo"),
          },
        ]}
        data={centrosCusto}
        actions={(c) => (
          <div className="flex items-center gap-1">
            <button
              onClick={() => abrir(c)}
              className="text-gray-500 hover:text-gray-700 hover:bg-gray-100 p-1 rounded"
            >
              <Icons.Edit />
            </button>
            <button
              onClick={() => handleExcluir(c.id)}
              className="text-gray-400 hover:text-red-600 hover:bg-red-50 p-1 rounded"
            >
              <Icons.Trash />
            </button>
          </div>
        )}
        emptyMessage="Nenhum centro de custo cadastrado."
      />

      <CentroCustoModal
        aberto={modal}
        editando={editando}
        onClose={fechar}
        onSalvar={handleSalvar}
      />
    </div>
  );
}
