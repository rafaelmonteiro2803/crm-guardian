import { useState } from "react";
import { DataGrid } from "../components/DataGrid";
import { Icons } from "../components/Icons";
import { EstoqueItemModal } from "../components/modals/EstoqueItemModal";
import { MovimentacaoModal } from "../components/modals/MovimentacaoModal";
import { CATEGORIAS_ESTOQUE, getCategorialLabel } from "../constants/estoque";

export function EstoqueItensPage({ estoqueItens, onSalvarItem, onExcluirItem, onSalvarMovimentacao, fmtBRL }) {
  const [modalItem, setModalItem] = useState(false);
  const [editando, setEditando] = useState(null);
  const [modalMov, setModalMov] = useState(false);
  const [movItem, setMovItem] = useState(null);
  const [movTipo, setMovTipo] = useState("entrada");

  const abrirItem = (item = null) => { setEditando(item); setModalItem(true); };
  const fecharItem = () => { setEditando(null); setModalItem(false); };
  const abrirMov = (item, tipo = "entrada") => { setMovItem(item); setMovTipo(tipo); setModalMov(true); };
  const fecharMov = () => { setMovItem(null); setModalMov(false); };

  const handleSalvarItem = async (form) => {
    await onSalvarItem(form, editando?.id || null);
    fecharItem();
  };

  const handleSalvarMov = async (form, item) => {
    await onSalvarMovimentacao(form, item);
    fecharMov();
  };

  const handleExcluir = async (id) => {
    if (!confirm("Excluir item do estoque?")) return;
    await onExcluirItem(id);
  };

  const itensBaixoEstoque = estoqueItens.filter(
    (e) => e.ativo && parseFloat(e.quantidade_atual || 0) <= parseFloat(e.quantidade_minima || 0) && parseFloat(e.quantidade_minima || 0) > 0
  );
  const categoriaCount = CATEGORIAS_ESTOQUE
    .map((c) => ({ ...c, count: estoqueItens.filter((e) => e.categoria === c.value && e.ativo).length }))
    .filter((c) => c.count > 0);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-gray-700">Itens de Estoque</h2>
        <button
          onClick={() => abrirItem()}
          className="inline-flex items-center gap-1 bg-gray-800 hover:bg-gray-700 text-white px-3 py-1.5 rounded text-xs font-medium"
        >
          <Icons.Plus />Novo Item
        </button>
      </div>

      {itensBaixoEstoque.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded p-3 flex items-start gap-2">
          <Icons.AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-xs font-semibold text-red-700">
              Itens abaixo do estoque mínimo ({itensBaixoEstoque.length})
            </p>
            <p className="text-[11px] text-red-600 mt-0.5">
              {itensBaixoEstoque
                .map((e) => `${e.nome} (${parseFloat(e.quantidade_atual || 0)} ${e.unidade_medida || "un"})`)
                .join(" · ")}
            </p>
          </div>
        </div>
      )}

      {categoriaCount.length > 0 && (
        <div className="flex gap-2 flex-wrap">
          {categoriaCount.map((c) => (
            <span
              key={c.value}
              className="inline-flex items-center gap-1 px-2 py-0.5 bg-white border border-gray-200 rounded text-[11px] text-gray-600"
            >
              <span className="font-medium text-gray-800">{c.count}</span> {c.label}
            </span>
          ))}
        </div>
      )}

      <DataGrid
        columns={[
          {
            key: "nome",
            label: "Item",
            render: (e) => <span className="font-medium text-gray-800">{e.nome}</span>,
            filterValue: (e) => e.nome || "",
          },
          {
            key: "categoria",
            label: "Categoria",
            render: (e) => (
              <span className="px-1.5 py-0.5 rounded text-[11px] bg-blue-50 text-blue-700">
                {getCategorialLabel(e.categoria)}
              </span>
            ),
            filterValue: (e) => getCategorialLabel(e.categoria),
          },
          {
            key: "quantidade_atual",
            label: "Qtd Atual",
            render: (e) => {
              const qtd = parseFloat(e.quantidade_atual || 0);
              const min = parseFloat(e.quantidade_minima || 0);
              const abaixo = min > 0 && qtd <= min;
              return (
                <span className={`font-semibold ${abaixo ? "text-red-600" : "text-gray-800"}`}>
                  {qtd.toLocaleString("pt-BR", { maximumFractionDigits: 3 })} {e.unidade_medida || "un"}
                  {abaixo ? " ⚠" : ""}
                </span>
              );
            },
            sortValue: (e) => parseFloat(e.quantidade_atual || 0),
          },
          {
            key: "quantidade_minima",
            label: "Qtd Mínima",
            render: (e) =>
              `${parseFloat(e.quantidade_minima || 0).toLocaleString("pt-BR", { maximumFractionDigits: 3 })} ${e.unidade_medida || "un"}`,
            sortValue: (e) => parseFloat(e.quantidade_minima || 0),
          },
          {
            key: "custo_unitario",
            label: "Custo Unit.",
            render: (e) => `R$ ${fmtBRL(e.custo_unitario)}`,
            sortValue: (e) => parseFloat(e.custo_unitario || 0),
          },
          {
            key: "fornecedor",
            label: "Fornecedor",
            render: (e) => e.fornecedor || <span className="text-gray-300">-</span>,
            filterValue: (e) => e.fornecedor || "",
          },
          {
            key: "ativo",
            label: "Status",
            render: (e) =>
              e.ativo ? (
                <span className="px-1.5 py-0.5 rounded text-[11px] bg-green-50 text-green-700">Ativo</span>
              ) : (
                <span className="px-1.5 py-0.5 rounded text-[11px] bg-gray-100 text-gray-500">Inativo</span>
              ),
            filterValue: (e) => (e.ativo ? "Ativo" : "Inativo"),
          },
        ]}
        data={estoqueItens}
        actions={(e) => (
          <div className="flex items-center gap-1">
            <button
              onClick={() => abrirMov(e, "entrada")}
              title="Registrar Entrada"
              className="text-green-600 hover:bg-green-50 px-1.5 py-0.5 rounded text-[11px] font-medium flex items-center gap-0.5"
            >
              <Icons.ArrowUpCircle className="w-3 h-3" />Entrada
            </button>
            <button
              onClick={() => abrirMov(e, "saida")}
              title="Registrar Saída"
              className="text-orange-600 hover:bg-orange-50 px-1.5 py-0.5 rounded text-[11px] font-medium flex items-center gap-0.5"
            >
              <Icons.ArrowDownCircle className="w-3 h-3" />Saída
            </button>
            <button
              onClick={() => abrirItem(e)}
              className="text-gray-500 hover:text-gray-700 hover:bg-gray-100 p-1 rounded"
            >
              <Icons.Edit />
            </button>
            <button
              onClick={() => handleExcluir(e.id)}
              className="text-gray-400 hover:text-red-600 hover:bg-red-50 p-1 rounded"
            >
              <Icons.Trash />
            </button>
          </div>
        )}
        rowClassName={(e) => {
          const qtd = parseFloat(e.quantidade_atual || 0);
          const min = parseFloat(e.quantidade_minima || 0);
          return min > 0 && qtd <= min ? "bg-red-50/40" : "";
        }}
        emptyMessage="Nenhum item de estoque cadastrado."
      />

      <EstoqueItemModal
        aberto={modalItem}
        editando={editando}
        onClose={fecharItem}
        onSalvar={handleSalvarItem}
      />

      <MovimentacaoModal
        aberto={modalMov}
        item={movItem}
        tipoInicial={movTipo}
        onClose={fecharMov}
        onSalvar={handleSalvarMov}
      />
    </div>
  );
}
