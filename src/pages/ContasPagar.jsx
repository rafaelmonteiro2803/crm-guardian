import { useState, useMemo } from "react";
import { DataGrid } from "../components/DataGrid";
import { Icons } from "../components/Icons";
import { ContaPagarModal } from "../components/modals/ContaPagarModal";
import { PagamentoContaModal } from "../components/modals/PagamentoContaModal";
import {
  getCategoriaLabel,
  getTipoLabel,
  isVencida,
  isVencendoHoje,
} from "../constants/contasPagar";

const FILTROS = [
  { key: "todos", label: "Todos" },
  { key: "em_aberto", label: "Em Aberto" },
  { key: "vencendo_hoje", label: "Vencendo Hoje" },
  { key: "vencidas", label: "Vencidas" },
  { key: "pagas", label: "Pagas" },
];

export function ContasPagarPage({
  contasPagar,
  parcelas,
  fornecedores,
  centrosCusto,
  contasBancarias,
  onSalvar,
  onExcluir,
  onPagar,
  fmtBRL,
}) {
  const [modal, setModal] = useState(false);
  const [editando, setEditando] = useState(null);
  const [modalPagamento, setModalPagamento] = useState(false);
  const [parcelaSelecionada, setParcelaSelecionada] = useState(null);
  const [filtroAtivo, setFiltroAtivo] = useState("em_aberto");
  const [filtroFornecedor, setFiltroFornecedor] = useState("");
  const [filtroCentroCusto, setFiltroCentroCusto] = useState("");
  const [filtroCategoria, setFiltroCategoria] = useState("");

  const abrir = (item = null) => { setEditando(item); setModal(true); };
  const fechar = () => { setEditando(null); setModal(false); };

  const abrirPagamento = (parcela) => {
    setParcelaSelecionada(parcela);
    setModalPagamento(true);
  };
  const fecharPagamento = () => {
    setParcelaSelecionada(null);
    setModalPagamento(false);
  };

  const handleSalvar = async (form) => {
    await onSalvar(form, editando?.id || null);
    fechar();
  };

  const handleExcluir = async (id) => {
    if (!confirm("Excluir conta a pagar e todas as parcelas?")) return;
    await onExcluir(id);
  };

  const getFornecedorNome = (id) =>
    fornecedores.find((f) => f.id === id)?.nome || "-";
  const getCentroCustoNome = (id) =>
    centrosCusto.find((c) => c.id === id)?.nome || "-";
  const getContaPagar = (id) =>
    contasPagar.find((c) => c.id === id);

  // Junta parcelas com dados da conta pai para exibição
  const parcelasEnriquecidas = useMemo(() => {
    return parcelas.map((p) => {
      const conta = getContaPagar(p.conta_pagar_id);
      return {
        ...p,
        _descricao: conta?.descricao || "-",
        _categoria: conta?.categoria || "-",
        _tipo: conta?.tipo || "-",
        _fornecedor_id: conta?.fornecedor_id || null,
        _centro_custo_id: conta?.centro_custo_id || null,
      };
    });
  }, [parcelas, contasPagar]);

  // Aplica filtros
  const parcelasFiltradas = useMemo(() => {
    let lista = parcelasEnriquecidas;

    if (filtroAtivo === "em_aberto") {
      lista = lista.filter((p) => p.status === "em_aberto" && !isVencida(p));
    } else if (filtroAtivo === "vencendo_hoje") {
      lista = lista.filter((p) => isVencendoHoje(p));
    } else if (filtroAtivo === "vencidas") {
      lista = lista.filter((p) => isVencida(p));
    } else if (filtroAtivo === "pagas") {
      lista = lista.filter((p) => p.status === "pago");
    }

    if (filtroFornecedor) {
      lista = lista.filter((p) => p._fornecedor_id === filtroFornecedor);
    }
    if (filtroCentroCusto) {
      lista = lista.filter((p) => p._centro_custo_id === filtroCentroCusto);
    }
    if (filtroCategoria) {
      lista = lista.filter((p) => p._categoria === filtroCategoria);
    }

    return lista;
  }, [parcelasEnriquecidas, filtroAtivo, filtroFornecedor, filtroCentroCusto, filtroCategoria]);

  // Contadores para badges dos filtros
  const contadores = useMemo(() => {
    return {
      todos: parcelasEnriquecidas.length,
      em_aberto: parcelasEnriquecidas.filter((p) => p.status === "em_aberto" && !isVencida(p)).length,
      vencendo_hoje: parcelasEnriquecidas.filter((p) => isVencendoHoje(p)).length,
      vencidas: parcelasEnriquecidas.filter((p) => isVencida(p)).length,
      pagas: parcelasEnriquecidas.filter((p) => p.status === "pago").length,
    };
  }, [parcelasEnriquecidas]);

  const totalFiltrado = parcelasFiltradas.reduce(
    (s, p) => s + parseFloat(p.valor || 0), 0
  );

  const categorias = useMemo(() => {
    const cats = [...new Set(parcelasEnriquecidas.map((p) => p._categoria).filter(Boolean))];
    return cats;
  }, [parcelasEnriquecidas]);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-gray-700">Contas a Pagar</h2>
        <button
          onClick={() => abrir()}
          className="inline-flex items-center gap-1 bg-gray-800 hover:bg-gray-700 text-white px-3 py-1.5 rounded text-xs font-medium"
        >
          <Icons.Plus />Nova Conta
        </button>
      </div>

      {/* Filtros principais */}
      <div className="flex flex-wrap gap-1.5">
        {FILTROS.map((filtro) => (
          <button
            key={filtro.key}
            onClick={() => setFiltroAtivo(filtro.key)}
            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded text-xs font-medium transition-colors ${
              filtroAtivo === filtro.key
                ? "bg-gray-800 text-white"
                : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
            }`}
          >
            {filtro.label}
            <span className={`text-[10px] px-1 rounded-full ${
              filtroAtivo === filtro.key ? "bg-white/20 text-white" : "bg-gray-100 text-gray-500"
            }`}>
              {contadores[filtro.key]}
            </span>
          </button>
        ))}
      </div>

      {/* Filtros secundários */}
      <div className="flex flex-wrap gap-2">
        {fornecedores.length > 0 && (
          <select
            value={filtroFornecedor}
            onChange={(e) => setFiltroFornecedor(e.target.value)}
            className="border border-gray-200 rounded px-2 py-1 text-xs text-gray-600 outline-none focus:ring-1 focus:ring-gray-400"
          >
            <option value="">Por Fornecedor</option>
            {fornecedores.map((f) => (
              <option key={f.id} value={f.id}>{f.nome}</option>
            ))}
          </select>
        )}
        {centrosCusto.length > 0 && (
          <select
            value={filtroCentroCusto}
            onChange={(e) => setFiltroCentroCusto(e.target.value)}
            className="border border-gray-200 rounded px-2 py-1 text-xs text-gray-600 outline-none focus:ring-1 focus:ring-gray-400"
          >
            <option value="">Por Centro de Custo</option>
            {centrosCusto.map((c) => (
              <option key={c.id} value={c.id}>{c.nome}</option>
            ))}
          </select>
        )}
        {categorias.length > 0 && (
          <select
            value={filtroCategoria}
            onChange={(e) => setFiltroCategoria(e.target.value)}
            className="border border-gray-200 rounded px-2 py-1 text-xs text-gray-600 outline-none focus:ring-1 focus:ring-gray-400"
          >
            <option value="">Por Categoria</option>
            {categorias.map((cat) => (
              <option key={cat} value={cat}>{getCategoriaLabel(cat)}</option>
            ))}
          </select>
        )}
        {(filtroFornecedor || filtroCentroCusto || filtroCategoria) && (
          <button
            onClick={() => { setFiltroFornecedor(""); setFiltroCentroCusto(""); setFiltroCategoria(""); }}
            className="text-xs text-gray-400 hover:text-gray-700 px-1"
          >
            Limpar filtros
          </button>
        )}
      </div>

      {/* Total filtrado */}
      {parcelasFiltradas.length > 0 && (
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <span>{parcelasFiltradas.length} parcela(s)</span>
          <span>·</span>
          <span className="font-semibold text-gray-700">
            Total: R$ {fmtBRL(totalFiltrado)}
          </span>
        </div>
      )}

      <DataGrid
        columns={[
          {
            key: "_descricao",
            label: "Descrição",
            render: (p) => (
              <div>
                <span className="font-medium text-gray-800">{p._descricao}</span>
                {parseInt(getContaPagar(p.conta_pagar_id)?.numero_parcelas || 1) > 1 && (
                  <span className="ml-1 text-[10px] text-gray-400">
                    {p.numero_parcela}/{getContaPagar(p.conta_pagar_id)?.numero_parcelas}
                  </span>
                )}
              </div>
            ),
            filterValue: (p) => p._descricao || "",
          },
          {
            key: "_categoria",
            label: "Categoria",
            render: (p) => (
              <span className="px-1.5 py-0.5 rounded text-[11px] bg-purple-50 text-purple-700">
                {getCategoriaLabel(p._categoria)}
              </span>
            ),
            filterValue: (p) => getCategoriaLabel(p._categoria),
          },
          {
            key: "_tipo",
            label: "Tipo",
            render: (p) => (
              <span className={`px-1.5 py-0.5 rounded text-[11px] ${
                p._tipo === "fixo"
                  ? "bg-blue-50 text-blue-700"
                  : "bg-orange-50 text-orange-700"
              }`}>
                {getTipoLabel(p._tipo)}
              </span>
            ),
            filterValue: (p) => getTipoLabel(p._tipo),
          },
          {
            key: "_fornecedor",
            label: "Fornecedor",
            render: (p) => p._fornecedor_id
              ? <span className="text-gray-700">{getFornecedorNome(p._fornecedor_id)}</span>
              : <span className="text-gray-300">-</span>,
            filterValue: (p) => p._fornecedor_id ? getFornecedorNome(p._fornecedor_id) : "",
          },
          {
            key: "_centro_custo",
            label: "Centro de Custo",
            render: (p) => p._centro_custo_id
              ? <span className="text-gray-600 text-[11px]">{getCentroCustoNome(p._centro_custo_id)}</span>
              : <span className="text-gray-300">-</span>,
            filterValue: (p) => p._centro_custo_id ? getCentroCustoNome(p._centro_custo_id) : "",
          },
          {
            key: "data_vencimento",
            label: "Vencimento",
            render: (p) => {
              const vencida = isVencida(p);
              const hoje = isVencendoHoje(p);
              return (
                <span className={`font-medium ${vencida ? "text-red-600" : hoje ? "text-orange-600" : "text-gray-700"}`}>
                  {new Date(p.data_vencimento + "T00:00:00").toLocaleDateString("pt-BR")}
                  {hoje && <span className="ml-1 text-[10px]">hoje</span>}
                </span>
              );
            },
            filterValue: (p) => new Date(p.data_vencimento + "T00:00:00").toLocaleDateString("pt-BR"),
            sortValue: (p) => p.data_vencimento,
          },
          {
            key: "valor",
            label: "Valor",
            render: (p) => <span className="font-semibold text-gray-800">R$ {fmtBRL(p.valor)}</span>,
            sortValue: (p) => parseFloat(p.valor || 0),
          },
          {
            key: "status",
            label: "Status",
            render: (p) => {
              const vencida = isVencida(p);
              if (p.status === "pago") {
                return <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[11px] bg-green-50 text-green-700"><Icons.CheckCircle className="w-3 h-3" />Pago</span>;
              }
              if (vencida) {
                return <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[11px] bg-red-50 text-red-700"><Icons.AlertCircle className="w-3 h-3" />Vencida</span>;
              }
              if (isVencendoHoje(p)) {
                return <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[11px] bg-orange-50 text-orange-700"><Icons.Clock className="w-3 h-3" />Hoje</span>;
              }
              return <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[11px] bg-yellow-50 text-yellow-700"><Icons.Clock className="w-3 h-3" />Em Aberto</span>;
            },
            filterValue: (p) => {
              if (p.status === "pago") return "Pago";
              if (isVencida(p)) return "Vencida";
              if (isVencendoHoje(p)) return "Hoje";
              return "Em Aberto";
            },
          },
        ]}
        data={parcelasFiltradas}
        actions={(p) => (
          <div className="flex items-center gap-1">
            {p.status === "em_aberto" && (
              <button
                onClick={() => abrirPagamento(p)}
                className="text-green-600 hover:bg-green-50 px-1.5 py-0.5 rounded text-[11px] font-medium flex items-center gap-0.5"
              >
                <Icons.CheckCircle className="w-3 h-3" />Pagar
              </button>
            )}
            <button
              onClick={() => abrir(getContaPagar(p.conta_pagar_id))}
              className="text-gray-500 hover:text-gray-700 hover:bg-gray-100 p-1 rounded"
              title="Editar conta"
            >
              <Icons.Edit />
            </button>
            <button
              onClick={() => handleExcluir(p.conta_pagar_id)}
              className="text-gray-400 hover:text-red-600 hover:bg-red-50 p-1 rounded"
              title="Excluir conta"
            >
              <Icons.Trash />
            </button>
          </div>
        )}
        rowClassName={(p) => {
          if (p.status === "pago") return "opacity-60";
          if (isVencida(p)) return "bg-red-50/40";
          if (isVencendoHoje(p)) return "bg-orange-50/40";
          return "";
        }}
        emptyMessage="Nenhuma conta a pagar encontrada para o filtro selecionado."
      />

      <ContaPagarModal
        aberto={modal}
        editando={editando}
        fornecedores={fornecedores}
        centrosCusto={centrosCusto}
        onClose={fechar}
        onSalvar={handleSalvar}
      />

      <PagamentoContaModal
        aberto={modalPagamento}
        parcela={parcelaSelecionada}
        contaPagar={parcelaSelecionada ? getContaPagar(parcelaSelecionada.conta_pagar_id) : null}
        contasBancarias={contasBancarias}
        onClose={fecharPagamento}
        onPagar={onPagar}
      />
    </div>
  );
}
