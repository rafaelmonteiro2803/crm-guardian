import React, { useState, useMemo } from "react";
import { Icons } from "../components/Icons";
import { DataGrid } from "../components/DataGrid";

export function RelatorioVendasClientesPage({ vendas, titulos, clientes, fmtBRL, getClienteNome }) {
  const [clienteFiltro, setClienteFiltro] = useState("");
  const [clienteSelecionado, setClienteSelecionado] = useState(null);
  const [titulosModal, setTitulosModal] = useState(null);
  const [titulosModalAberto, setTitulosModalAberto] = useState(false);

  // Agrupar vendas por cliente
  const vendasPorCliente = useMemo(() => {
    const mapa = {};
    (vendas || []).forEach((v) => {
      const cid = v.cliente_id;
      if (!mapa[cid]) {
        mapa[cid] = [];
      }
      mapa[cid].push(v);
    });

    // Ordenar vendas de cada cliente por data
    Object.keys(mapa).forEach((cid) => {
      mapa[cid].sort((a, b) => new Date(a.data_venda || 0) - new Date(b.data_venda || 0));
    });

    return mapa;
  }, [vendas]);

  // Lista de clientes com vendas
  const clientesComVendas = useMemo(() => {
    return Object.keys(vendasPorCliente).map((cid) => {
      const cliente = clientes.find((c) => c.id === cid);
      return {
        id: cid,
        nome: cliente?.nome || "N/A",
        quantidadeVendas: vendasPorCliente[cid].length
      };
    });
  }, [vendasPorCliente, clientes]);

  // Filtrar clientes
  const clientesFiltrados = useMemo(() => {
    if (!clienteFiltro.trim()) {
      return clientesComVendas;
    }
    return clientesComVendas.filter((c) =>
      c.nome.toLowerCase().includes(clienteFiltro.toLowerCase())
    );
  }, [clienteFiltro, clientesComVendas]);

  // Vendas do cliente selecionado
  const vendasSelecionadas = useMemo(() => {
    if (!clienteSelecionado || !vendasPorCliente[clienteSelecionado.id]) {
      return [];
    }
    return vendasPorCliente[clienteSelecionado.id];
  }, [clienteSelecionado, vendasPorCliente]);

  // Títulos de uma venda
  const getTitulosPorVenda = (vendaId) => {
    return (titulos || []).filter((t) => t.venda_id === vendaId);
  };

  // Verifica se há título em aberto
  const temTituloEmAberto = (vendaId) => {
    const titulosDaVenda = getTitulosPorVenda(vendaId);
    return titulosDaVenda.some((t) => t.status !== "pago" && t.status !== "cancelado");
  };

  // Abrir modal de títulos
  const abrirTitulosModal = (vendaId) => {
    const titulosDaVenda = getTitulosPorVenda(vendaId);
    setTitulosModal({ vendaId, titulos: titulosDaVenda });
    setTitulosModalAberto(true);
  };

  const fecharTitulosModal = () => {
    setTitulosModal(null);
    setTitulosModalAberto(false);
  };

  const limparFiltro = () => {
    setClienteSelecionado(null);
    setClienteFiltro("");
  };

  return (
    <div className="space-y-4">
      <h2 className="text-sm font-semibold text-gray-700">Relatório de Vendas por Cliente</h2>

      <div className="bg-white border border-gray-200 rounded p-4">
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Filtrar Cliente</label>
          <div className="relative">
            <Icons.Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
            <input
              type="text"
              value={clienteFiltro}
              onChange={(e) => setClienteFiltro(e.target.value)}
              placeholder="Digite o nome do cliente..."
              className="w-full border border-gray-200 rounded pl-8 pr-2.5 py-1.5 text-sm focus:ring-1 focus:ring-gray-400 outline-none"
            />
          </div>
        </div>

        {clienteFiltro.trim().length > 0 && !clienteSelecionado && clientesFiltrados.length > 0 && (
          <div className="mt-3 border border-gray-200 rounded overflow-hidden max-h-48 overflow-y-auto">
            {clientesFiltrados.map((c) => (
              <button
                key={c.id}
                onClick={() => setClienteSelecionado(c)}
                className="w-full flex items-center gap-2 px-3 py-2 text-xs text-left hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
              >
                <Icons.User className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                <span className="font-medium text-gray-800">{c.nome}</span>
                <span className="text-gray-400 text-[11px] ml-auto">
                  {c.quantidadeVendas} venda(s)
                </span>
              </button>
            ))}
          </div>
        )}
      </div>

      {clienteSelecionado && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-semibold text-gray-700">
              Vendas de {clienteSelecionado.nome}
            </h3>
            <button
              onClick={limparFiltro}
              className="text-xs text-gray-400 hover:text-gray-600 underline flex items-center gap-1"
            >
              <Icons.X className="w-3 h-3" /> limpar
            </button>
          </div>

          {vendasSelecionadas.length === 0 ? (
            <div className="bg-white border border-gray-200 rounded p-6 text-center text-xs text-gray-400">
              Nenhuma venda encontrada para este cliente.
            </div>
          ) : (
            <DataGrid
              columns={[
                {
                  key: "data_venda",
                  label: "Data da Venda",
                  render: (v) => {
                    try {
                      return new Date(v.data_venda).toLocaleDateString("pt-BR");
                    } catch {
                      return "N/A";
                    }
                  },
                  sortValue: (v) => v.data_venda || "",
                },
                {
                  key: "descricao",
                  label: "Descrição",
                  render: (v) => <span className="text-xs">{v.descricao || "-"}</span>,
                  filterValue: (v) => v.descricao || "",
                },
                {
                  key: "forma_pagamento",
                  label: "Forma de Pgto",
                  render: (v) => <span className="capitalize text-xs">{v.forma_pagamento || "-"}</span>,
                  filterValue: (v) => v.forma_pagamento || "",
                },
                {
                  key: "valor",
                  label: "Valor",
                  render: (v) => {
                    try {
                      return (
                        <span className="font-medium text-green-700">
                          R$ {fmtBRL(v.valor)}
                        </span>
                      );
                    } catch {
                      return <span className="text-xs text-gray-400">N/A</span>;
                    }
                  },
                  sortValue: (v) => parseFloat(v.valor || 0),
                },
                {
                  key: "titulo_status",
                  label: "Título Aberto?",
                  filterable: false,
                  render: (v) => {
                    const aberto = temTituloEmAberto(v.id);
                    return aberto ? (
                      <span className="inline-flex items-center gap-1 text-xs font-medium text-orange-600 bg-orange-50 px-2 py-1 rounded">
                        <Icons.AlertCircle className="w-3 h-3" /> Sim
                      </span>
                    ) : (
                      <span className="text-xs text-gray-400">Não</span>
                    );
                  },
                },
                {
                  key: "titulos_action",
                  label: "Títulos",
                  filterable: false,
                  render: (v) => {
                    const titulosDaVenda = getTitulosPorVenda(v.id);
                    return (
                      <button
                        onClick={() => abrirTitulosModal(v.id)}
                        className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-2 py-1 rounded flex items-center gap-1"
                      >
                        <Icons.Eye className="w-3 h-3" />
                        Ver ({titulosDaVenda.length})
                      </button>
                    );
                  },
                },
              ]}
              data={vendasSelecionadas}
              emptyMessage="Nenhuma venda encontrada."
            />
          )}
        </div>
      )}

      {titulosModalAberto && titulosModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full mx-4 max-h-[80vh] overflow-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-gray-800">
                Títulos da Venda
              </h3>
              <button
                onClick={fecharTitulosModal}
                className="text-gray-500 hover:text-gray-700 p-1"
              >
                <Icons.X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4">
              {titulosModal.titulos.length === 0 ? (
                <p className="text-xs text-gray-400 text-center py-4">
                  Nenhum título vinculado a esta venda.
                </p>
              ) : (
                <div className="space-y-3">
                  {titulosModal.titulos.map((t) => (
                    <div key={t.id} className="border border-gray-200 rounded p-3 space-y-2">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-xs font-medium text-gray-800">
                            {t.descricao || "Sem descrição"}
                          </p>
                          <p className="text-[11px] text-gray-500 mt-1">
                            Emissão: {new Date(t.data_emissao || 0).toLocaleDateString("pt-BR")} • Vencimento: {new Date(t.data_vencimento || 0).toLocaleDateString("pt-BR")}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs font-semibold text-gray-800">
                            R$ {fmtBRL(t.valor || 0)}
                          </p>
                          <span
                            className={`inline-flex text-[11px] font-medium px-2 py-1 rounded mt-1 ${
                              t.status === "pago"
                                ? "text-green-700 bg-green-50"
                                : t.status === "cancelado"
                                ? "text-gray-500 bg-gray-50"
                                : "text-orange-700 bg-orange-50"
                            }`}
                          >
                            {t.status === "pendente"
                              ? "Pendente"
                              : t.status === "pago"
                              ? "Pago"
                              : "Cancelado"}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
