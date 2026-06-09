import React, { useState, useMemo } from "react";
import { Icons } from "../components/Icons";
import { DataGrid } from "../components/DataGrid";

export function RelatorioVendasClientesPage({ vendas, titulos, clientes, fmtBRL, getClienteNome }) {
  const [clienteFiltro, setClienteFiltro] = useState("");
  const [clienteSelecionado, setClienteSelecionado] = useState(null);
  const [titulosModal, setTitulosModal] = useState(null);
  const [titulosModalAberto, setTitulosModalAberto] = useState(false);

  const getVendasPorCliente = useMemo(() => {
    const mapa = {};
    vendas.forEach((v) => {
      if (!mapa[v.cliente_id]) {
        mapa[v.cliente_id] = [];
      }
      mapa[v.cliente_id].push(v);
    });

    // Ordenar vendas de cada cliente por data_venda
    Object.keys(mapa).forEach((clienteId) => {
      mapa[clienteId].sort((a, b) => new Date(a.data_venda) - new Date(b.data_venda));
    });

    return mapa;
  }, [vendas]);

  const clientesFiltrados = useMemo(() => {
    const clientesComVendas = Object.keys(getVendasPorCliente).map((clienteId) => {
      const cliente = clientes.find((c) => c.id === clienteId);
      return { id: clienteId, nome: cliente?.nome || "N/A" };
    });

    if (!clienteFiltro.trim()) {
      return clientesComVendas;
    }

    return clientesComVendas.filter((c) =>
      c.nome.toLowerCase().includes(clienteFiltro.toLowerCase())
    );
  }, [clienteFiltro, getVendasPorCliente, clientes]);

  const getTitulosPorVenda = (vendaId) => {
    return titulos.filter((t) => t.venda_id === vendaId);
  };

  const temTituloEmAberto = (vendaId) => {
    const titulosVenda = getTitulosPorVenda(vendaId);
    return titulosVenda.some((t) => t.status !== "pago" && t.status !== "cancelado");
  };

  const abrirTitulosModal = (vendaId) => {
    const titulosDaVenda = getTitulosPorVenda(vendaId);
    setTitulosModal({ vendaId, titulos: titulosDaVenda });
    setTitulosModalAberto(true);
  };

  const fecharTitulosModal = () => {
    setTitulosModal(null);
    setTitulosModalAberto(false);
  };

  const vendaParaExibir = clienteSelecionado
    ? getVendasPorCliente[clienteSelecionado.id] || []
    : [];

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

        {clienteFiltro.trim().length > 0 && !clienteSelecionado && (
          <div className="mt-3 border border-gray-200 rounded overflow-hidden max-h-48 overflow-y-auto">
            {clientesFiltrados.length === 0 ? (
              <p className="text-xs text-gray-400 p-3 text-center">Nenhum cliente encontrado.</p>
            ) : (
              clientesFiltrados.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setClienteSelecionado(c)}
                  className="w-full flex items-center gap-2 px-3 py-2 text-xs text-left hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
                >
                  <Icons.User className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                  <span className="font-medium text-gray-800">{c.nome}</span>
                  <span className="text-gray-400 text-[11px] ml-auto">
                    {getVendasPorCliente[c.id]?.length || 0} venda(s)
                  </span>
                </button>
              ))
            )}
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
              onClick={() => setClienteSelecionado(null)}
              className="text-xs text-gray-400 hover:text-gray-600 underline flex items-center gap-1"
            >
              <Icons.X className="w-3 h-3" /> limpar
            </button>
          </div>

          {vendaParaExibir.length === 0 ? (
            <div className="bg-white border border-gray-200 rounded p-6 text-center text-xs text-gray-400">
              Nenhuma venda encontrada para este cliente.
            </div>
          ) : (
            <DataGrid
              columns={[
                {
                  key: "data_venda",
                  label: "Data da Venda",
                  render: (v) => new Date(v.data_venda).toLocaleDateString("pt-BR"),
                  sortValue: (v) => v.data_venda,
                },
                {
                  key: "descricao",
                  label: "Descrição",
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
                  render: (v) => (
                    <span className="font-medium text-green-700">R$ {fmtBRL(v.valor)}</span>
                  ),
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
              data={vendaParaExibir}
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
                <p className="text-xs text-gray-400 text-center py-4">Nenhum título vinculado a esta venda.</p>
              ) : (
                <div className="space-y-3">
                  {titulosModal.titulos.map((t) => (
                    <div key={t.id} className="border border-gray-200 rounded p-3 space-y-2">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-xs font-medium text-gray-800">{t.descricao}</p>
                          <p className="text-[11px] text-gray-500 mt-1">
                            Emissão: {new Date(t.data_emissao).toLocaleDateString("pt-BR")} • Vencimento: {new Date(t.data_vencimento).toLocaleDateString("pt-BR")}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs font-semibold text-gray-800">R$ {fmtBRL(t.valor)}</p>
                          <span
                            className={`inline-flex text-[11px] font-medium px-2 py-1 rounded mt-1 ${
                              t.status === "pago"
                                ? "text-green-700 bg-green-50"
                                : t.status === "cancelado"
                                ? "text-gray-500 bg-gray-50"
                                : "text-orange-700 bg-orange-50"
                            }`}
                          >
                            {t.status === "pendente" ? "Pendente" : t.status === "pago" ? "Pago" : "Cancelado"}
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
