import { useState } from "react";
import { DataGrid } from "../components/DataGrid";
import { Icons } from "../components/Icons";
import { ClienteModal } from "../components/modals/ClienteModal";

export function ClientesPage({ clientes, onSalvar, onExcluir }) {
  const [modalAberto, setModalAberto] = useState(false);
  const [editando, setEditando] = useState(null);

  const abrir = (c = null) => {
    setEditando(c);
    setModalAberto(true);
  };

  const fechar = () => {
    setEditando(null);
    setModalAberto(false);
  };

  const handleSalvar = async (form) => {
    await onSalvar(form, editando?.id || null);
    fechar();
  };

  const handleExcluir = async (id) => {
    if (!confirm("Excluir cliente?")) return;
    await onExcluir(id);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-gray-700">Clientes</h2>
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
            key: "nome",
            label: "Nome",
            render: (c) => <span className="font-medium text-gray-800">{c.nome}</span>,
            filterValue: (c) => c.nome || "",
          },
          {
            key: "cpf",
            label: "CPF",
            filterValue: (c) => c.cpf || "",
            render: (c) => c.cpf || <span className="text-gray-300">-</span>,
          },
          {
            key: "email",
            label: "Email",
            filterValue: (c) => c.email || "",
            render: (c) => c.email || <span className="text-gray-300">-</span>,
          },
          {
            key: "telefone",
            label: "Telefone / WhatsApp",
            filterValue: (c) => c.telefone || "",
            render: (c) => {
              if (!c.telefone) return <span className="text-gray-300">-</span>;
              const num = c.telefone.replace(/\D/g, "");
              const whatsNum = num.length <= 11 ? "55" + num : num;
              return (
                <span className="flex items-center gap-1.5">
                  {c.telefone}
                  <a
                    href={`https://wa.me/${whatsNum}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-0.5 text-green-600 hover:text-green-700 text-[11px] font-medium"
                    title="Enviar mensagem no WhatsApp"
                  >
                    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                    </svg>
                    WhatsApp
                  </a>
                </span>
              );
            },
          },
          {
            key: "empresa",
            label: "Empresa",
            filterValue: (c) => c.empresa || "",
            render: (c) => c.empresa || <span className="text-gray-300">-</span>,
          },
          {
            key: "data_cadastro",
            label: "Cadastro",
            render: (c) => (
              <span className="text-gray-500">
                {new Date(c.data_cadastro).toLocaleDateString("pt-BR")}
              </span>
            ),
            filterValue: (c) => new Date(c.data_cadastro).toLocaleDateString("pt-BR"),
            sortValue: (c) => c.data_cadastro,
          },
        ]}
        data={clientes}
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
        emptyMessage="Nenhum cliente cadastrado."
      />

      <ClienteModal
        aberto={modalAberto}
        editando={editando}
        onClose={fechar}
        onSalvar={handleSalvar}
      />
    </div>
  );
}
