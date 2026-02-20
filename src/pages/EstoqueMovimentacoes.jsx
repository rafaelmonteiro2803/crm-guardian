import { useState } from "react";
import { DataGrid } from "../components/DataGrid";
import { Icons } from "../components/Icons";
import { MovimentacaoModal } from "../components/modals/MovimentacaoModal";

const MOTIVO_LABELS = {
  compra: "Compra",
  uso_servico: "Uso em Serviço",
  venda: "Venda",
  ajuste: "Ajuste",
  perda: "Perda",
  devolucao: "Devolução",
  inventario: "Inventário",
};

export function EstoqueMovimentacoesPage({
  estoqueMovimentacoes,
  estoqueItens,
  onSalvarMovimentacao,
  onExcluirMovimentacao,
  fmtBRL,
}) {
  const [modalMov, setModalMov] = useState(false);
  const [movItem, setMovItem] = useState(null);

  const abrirNova = () => {
    if (!estoqueItens.length) return alert("Cadastre itens de estoque primeiro!");
    setMovItem(estoqueItens[0]);
    setModalMov(true);
  };

  const fechar = () => { setMovItem(null); setModalMov(false); };

  const handleSalvar = async (form, item) => {
    await onSalvarMovimentacao(form, item);
    fechar();
  };

  const handleExcluir = async (id) => {
    if (!confirm("Excluir movimentação?")) return;
    await onExcluirMovimentacao(id);
  };

  const getItemNome = (id) => estoqueItens.find((e) => e.id === id)?.nome || "N/A";

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-gray-700">Movimentações de Estoque</h2>
        <button
          onClick={abrirNova}
          className="inline-flex items-center gap-1 bg-gray-800 hover:bg-gray-700 text-white px-3 py-1.5 rounded text-xs font-medium"
        >
          <Icons.Plus />Nova Movimentação
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "Entradas", tipo: "entrada", cls: "border-green-200", tcls: "text-green-700" },
          { label: "Saídas", tipo: "saida", cls: "border-orange-200", tcls: "text-orange-700" },
          { label: "Ajustes", tipo: "ajuste", cls: "border-blue-200", tcls: "text-blue-700" },
        ].map(({ label, tipo, cls, tcls }) => {
          const movs = estoqueMovimentacoes.filter((m) => m.tipo === tipo);
          return (
            <div key={tipo} className={`bg-white border rounded p-3 ${cls}`}>
              <p className={`text-xs font-medium ${tcls}`}>{label}</p>
              <p className={`text-lg font-semibold ${tcls}`}>{movs.length}</p>
              <p className="text-[11px] text-gray-400">movimentações</p>
            </div>
          );
        })}
        <div className="bg-white border border-gray-200 rounded p-3">
          <p className="text-xs font-medium text-gray-700">Total Registros</p>
          <p className="text-lg font-semibold text-gray-700">{estoqueMovimentacoes.length}</p>
          <p className="text-[11px] text-gray-400">movimentações</p>
        </div>
      </div>

      <DataGrid
        columns={[
          {
            key: "data_movimentacao",
            label: "Data",
            render: (m) => new Date(m.data_movimentacao + "T12:00:00").toLocaleDateString("pt-BR"),
            filterValue: (m) => new Date(m.data_movimentacao + "T12:00:00").toLocaleDateString("pt-BR"),
            sortValue: (m) => m.data_movimentacao,
          },
          {
            key: "estoque_item_id",
            label: "Item",
            render: (m) => <span className="font-medium text-gray-800">{getItemNome(m.estoque_item_id)}</span>,
            filterValue: (m) => getItemNome(m.estoque_item_id),
          },
          {
            key: "tipo",
            label: "Tipo",
            render: (m) =>
              m.tipo === "entrada" ? (
                <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[11px] bg-green-50 text-green-700">
                  <Icons.ArrowUpCircle className="w-3 h-3" />Entrada
                </span>
              ) : m.tipo === "saida" ? (
                <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[11px] bg-orange-50 text-orange-700">
                  <Icons.ArrowDownCircle className="w-3 h-3" />Saída
                </span>
              ) : (
                <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[11px] bg-blue-50 text-blue-700">
                  Ajuste
                </span>
              ),
            filterValue: (m) => m.tipo,
          },
          {
            key: "quantidade",
            label: "Quantidade",
            render: (m) => {
              const item = estoqueItens.find((e) => e.id === m.estoque_item_id);
              return (
                <span className="font-semibold">
                  {parseFloat(m.quantidade).toLocaleString("pt-BR", { maximumFractionDigits: 3 })}{" "}
                  {item?.unidade_medida || "un"}
                </span>
              );
            },
            sortValue: (m) => parseFloat(m.quantidade || 0),
          },
          {
            key: "motivo",
            label: "Motivo",
            render: (m) => MOTIVO_LABELS[m.motivo] || m.motivo,
            filterValue: (m) => m.motivo,
          },
          {
            key: "custo_unitario",
            label: "Custo Unit.",
            render: (m) =>
              parseFloat(m.custo_unitario || 0) > 0 ? (
                `R$ ${fmtBRL(m.custo_unitario)}`
              ) : (
                <span className="text-gray-300">-</span>
              ),
            sortValue: (m) => parseFloat(m.custo_unitario || 0),
          },
          {
            key: "observacoes",
            label: "Observações",
            render: (m) =>
              m.observacoes ? (
                <span className="text-gray-500 text-[11px]" title={m.observacoes}>
                  {m.observacoes.slice(0, 40)}{m.observacoes.length > 40 ? "..." : ""}
                </span>
              ) : (
                <span className="text-gray-300">-</span>
              ),
            filterValue: (m) => m.observacoes || "",
          },
        ]}
        data={estoqueMovimentacoes}
        actions={(m) => (
          <button
            onClick={() => handleExcluir(m.id)}
            className="text-gray-400 hover:text-red-600 hover:bg-red-50 p-1 rounded"
          >
            <Icons.Trash />
          </button>
        )}
        emptyMessage="Nenhuma movimentação registrada."
      />

      <MovimentacaoModal
        aberto={modalMov}
        item={movItem}
        tipoInicial="entrada"
        onClose={fechar}
        onSalvar={handleSalvar}
      />
    </div>
  );
}
