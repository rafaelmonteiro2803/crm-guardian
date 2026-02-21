import { useState } from "react";
import { DataGrid } from "../components/DataGrid";
import { Icons } from "../components/Icons";
import { TenantModal } from "../components/modals/TenantModal";

export function TenantsPage({ tenants, onSalvar, onExcluir }) {
  const [modalAberto, setModalAberto] = useState(false);
  const [editando, setEditando] = useState(null);

  const abrir = (t = null) => {
    setEditando(t);
    setModalAberto(true);
  };

  const fechar = () => {
    setEditando(null);
    setModalAberto(false);
  };

  const handleSalvar = async (form, logoFile) => {
    await onSalvar(form, logoFile, editando?.id || null);
    fechar();
  };

  const handleExcluir = async (id) => {
    if (!confirm("Excluir tenant? Esta ação não pode ser desfeita.")) return;
    await onExcluir(id);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-gray-700">Tenants</h2>
        <button
          onClick={() => abrir()}
          className="inline-flex items-center gap-1 bg-gray-800 hover:bg-gray-700 text-white px-3 py-1.5 rounded text-xs font-medium"
        >
          <Icons.Plus />Novo
        </button>
      </div>

      <DataGrid
        columns={[
          {
            key: "logo",
            label: "Logo",
            filterable: false,
            render: (t) =>
              t.logo_url ? (
                <img
                  src={t.logo_url}
                  alt={`Logo ${t.nome}`}
                  className="h-8 w-auto max-w-[64px] object-contain rounded bg-gray-50 border border-gray-100 p-0.5"
                />
              ) : (
                <span className="text-gray-300 text-[11px]">—</span>
              ),
          },
          {
            key: "nome",
            label: "Nome",
            render: (t) => <span className="font-medium text-gray-800">{t.nome}</span>,
            filterValue: (t) => t.nome || "",
          },
          {
            key: "slogan",
            label: "Slogan",
            filterValue: (t) => t.slogan || "",
            render: (t) =>
              t.slogan ? (
                <span className="text-gray-600 italic">{t.slogan}</span>
              ) : (
                <span className="text-gray-300">—</span>
              ),
          },
          {
            key: "cor",
            label: "Cor",
            filterable: false,
            render: (t) =>
              t.cor ? (
                <div className="flex items-center gap-1.5">
                  <span
                    className="inline-block w-4 h-4 rounded border border-gray-200"
                    style={{ backgroundColor: t.cor }}
                  />
                  <span className="text-[11px] text-gray-500">{t.cor}</span>
                </div>
              ) : (
                <span className="text-gray-300">—</span>
              ),
          },
          {
            key: "created_at",
            label: "Criado em",
            render: (t) => (
              <span className="text-gray-500">
                {new Date(t.created_at).toLocaleDateString("pt-BR")}
              </span>
            ),
            filterValue: (t) => new Date(t.created_at).toLocaleDateString("pt-BR"),
            sortValue: (t) => t.created_at,
          },
        ]}
        data={tenants}
        actions={(t) => (
          <div className="flex items-center gap-1">
            <button
              onClick={() => abrir(t)}
              className="text-gray-500 hover:text-gray-700 hover:bg-gray-100 p-1 rounded"
            >
              <Icons.Edit />
            </button>
            <button
              onClick={() => handleExcluir(t.id)}
              className="text-gray-400 hover:text-red-600 hover:bg-red-50 p-1 rounded"
            >
              <Icons.Trash />
            </button>
          </div>
        )}
        emptyMessage="Nenhum tenant cadastrado."
      />

      <TenantModal
        aberto={modalAberto}
        editando={editando}
        onClose={fechar}
        onSalvar={handleSalvar}
      />
    </div>
  );
}
