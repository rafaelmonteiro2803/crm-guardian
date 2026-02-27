import { useState } from "react";
import { DataGrid } from "../components/DataGrid";
import { Icons } from "../components/Icons";
import { ContaBancariaModal } from "../components/modals/ContaBancariaModal";

const TIPOS_LABEL = {
  banco: "Banco",
  pagamento_digital: "Pagamento Digital",
  caixa: "Caixa",
  carteira: "Carteira Digital",
  outro: "Outro",
};

const TIPOS_COR = {
  banco: "bg-blue-50 text-blue-700",
  pagamento_digital: "bg-purple-50 text-purple-700",
  caixa: "bg-green-50 text-green-700",
  carteira: "bg-indigo-50 text-indigo-700",
  outro: "bg-gray-100 text-gray-600",
};

export function ContasBancariasPage({ contasBancarias, onSalvar, onExcluir }) {
  const [modalAberto, setModalAberto] = useState(false);
  const [editando, setEditando] = useState(null);

  const abrirModal = (conta = null) => { setEditando(conta); setModalAberto(true); };
  const fecharModal = () => { setEditando(null); setModalAberto(false); };

  const handleSalvar = async (form) => {
    await onSalvar(form, editando?.id || null);
    fecharModal();
  };

  const handleExcluir = async (id) => {
    if (!confirm("Excluir esta conta bancária?")) return;
    await onExcluir(id);
  };

  const ativas = contasBancarias.filter((c) => c.ativo).length;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sm font-semibold text-gray-700">Contas Bancárias</h2>
          <p className="text-[11px] text-gray-400 mt-0.5">
            {ativas} conta{ativas !== 1 ? "s" : ""} ativa{ativas !== 1 ? "s" : ""}
          </p>
        </div>
        <button
          onClick={() => abrirModal()}
          className="inline-flex items-center gap-1 bg-gray-800 hover:bg-gray-700 text-white px-3 py-1.5 rounded text-xs font-medium"
        >
          <Icons.Plus />Nova Conta
        </button>
      </div>

      <DataGrid
        columns={[
          {
            key: "nome",
            label: "Conta",
            render: (c) => <span className="font-medium text-gray-800">{c.nome}</span>,
            filterValue: (c) => c.nome || "",
          },
          {
            key: "tipo",
            label: "Tipo",
            render: (c) => (
              <span className={`px-1.5 py-0.5 rounded text-[11px] ${TIPOS_COR[c.tipo] || "bg-gray-100 text-gray-600"}`}>
                {TIPOS_LABEL[c.tipo] || c.tipo}
              </span>
            ),
            filterValue: (c) => TIPOS_LABEL[c.tipo] || c.tipo,
          },
          {
            key: "banco",
            label: "Banco / Instituição",
            render: (c) => c.banco || <span className="text-gray-300">-</span>,
            filterValue: (c) => c.banco || "",
          },
          {
            key: "agencia",
            label: "Agência / Conta",
            render: (c) =>
              c.agencia || c.conta ? (
                <span className="text-gray-600 font-mono text-[11px]">
                  {[c.agencia, c.conta].filter(Boolean).join(" / ")}
                </span>
              ) : (
                <span className="text-gray-300">-</span>
              ),
            filterValue: (c) => [c.agencia, c.conta].filter(Boolean).join(" "),
          },
          {
            key: "ativo",
            label: "Status",
            render: (c) =>
              c.ativo ? (
                <span className="px-1.5 py-0.5 rounded text-[11px] bg-green-50 text-green-700">Ativa</span>
              ) : (
                <span className="px-1.5 py-0.5 rounded text-[11px] bg-gray-100 text-gray-500">Inativa</span>
              ),
            filterValue: (c) => (c.ativo ? "Ativa" : "Inativa"),
          },
        ]}
        data={contasBancarias}
        actions={(c) => (
          <div className="flex items-center gap-1">
            <button
              onClick={() => abrirModal(c)}
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
        emptyMessage="Nenhuma conta bancária cadastrada."
      />

      <ContaBancariaModal
        aberto={modalAberto}
        editando={editando}
        onClose={fecharModal}
        onSalvar={handleSalvar}
      />
    </div>
  );
}
