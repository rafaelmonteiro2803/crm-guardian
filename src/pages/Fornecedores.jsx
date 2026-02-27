import { useState } from "react";
import { DataGrid } from "../components/DataGrid";
import { Icons } from "../components/Icons";
import { FornecedorModal } from "../components/modals/FornecedorModal";

const CATEGORIAS_LABEL = {
  produto: "Produtos",
  servico: "Serviços",
  utilidades: "Utilidades",
  aluguel: "Aluguel",
  outro: "Outro",
};

export function FornecedoresPage({ fornecedores, onSalvar, onExcluir }) {
  const [modal, setModal] = useState(false);
  const [editando, setEditando] = useState(null);

  const abrir = (item = null) => { setEditando(item); setModal(true); };
  const fechar = () => { setEditando(null); setModal(false); };

  const handleSalvar = async (form) => {
    await onSalvar(form, editando?.id || null);
    fechar();
  };

  const handleExcluir = async (id) => {
    if (!confirm("Excluir fornecedor?")) return;
    await onExcluir(id);
  };

  const ativos = fornecedores.filter((f) => f.ativo).length;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sm font-semibold text-gray-700">Fornecedores</h2>
          <p className="text-[11px] text-gray-400">{ativos} ativo{ativos !== 1 ? "s" : ""}</p>
        </div>
        <button
          onClick={() => abrir()}
          className="inline-flex items-center gap-1 bg-gray-800 hover:bg-gray-700 text-white px-3 py-1.5 rounded text-xs font-medium"
        >
          <Icons.Plus />Novo Fornecedor
        </button>
      </div>

      <DataGrid
        columns={[
          {
            key: "nome",
            label: "Nome",
            render: (f) => <span className="font-medium text-gray-800">{f.nome}</span>,
            filterValue: (f) => f.nome || "",
          },
          {
            key: "categoria",
            label: "Categoria",
            render: (f) => (
              <span className="px-1.5 py-0.5 rounded text-[11px] bg-blue-50 text-blue-700">
                {CATEGORIAS_LABEL[f.categoria] || f.categoria}
              </span>
            ),
            filterValue: (f) => CATEGORIAS_LABEL[f.categoria] || f.categoria,
          },
          {
            key: "contato",
            label: "Contato",
            render: (f) => f.contato || <span className="text-gray-300">-</span>,
            filterValue: (f) => f.contato || "",
          },
          {
            key: "telefone",
            label: "Telefone",
            render: (f) => f.telefone || <span className="text-gray-300">-</span>,
            filterValue: (f) => f.telefone || "",
          },
          {
            key: "email",
            label: "Email",
            render: (f) => f.email ? (
              <a href={`mailto:${f.email}`} className="text-blue-600 hover:underline">{f.email}</a>
            ) : <span className="text-gray-300">-</span>,
            filterValue: (f) => f.email || "",
          },
          {
            key: "cnpj",
            label: "CNPJ / CPF",
            render: (f) => f.cnpj || f.cpf || <span className="text-gray-300">-</span>,
            filterValue: (f) => (f.cnpj || f.cpf || ""),
          },
          {
            key: "ativo",
            label: "Status",
            render: (f) =>
              f.ativo ? (
                <span className="px-1.5 py-0.5 rounded text-[11px] bg-green-50 text-green-700">Ativo</span>
              ) : (
                <span className="px-1.5 py-0.5 rounded text-[11px] bg-gray-100 text-gray-500">Inativo</span>
              ),
            filterValue: (f) => (f.ativo ? "Ativo" : "Inativo"),
          },
        ]}
        data={fornecedores}
        actions={(f) => (
          <div className="flex items-center gap-1">
            <button
              onClick={() => abrir(f)}
              className="text-gray-500 hover:text-gray-700 hover:bg-gray-100 p-1 rounded"
            >
              <Icons.Edit />
            </button>
            <button
              onClick={() => handleExcluir(f.id)}
              className="text-gray-400 hover:text-red-600 hover:bg-red-50 p-1 rounded"
            >
              <Icons.Trash />
            </button>
          </div>
        )}
        emptyMessage="Nenhum fornecedor cadastrado."
      />

      <FornecedorModal
        aberto={modal}
        editando={editando}
        onClose={fechar}
        onSalvar={handleSalvar}
      />
    </div>
  );
}
