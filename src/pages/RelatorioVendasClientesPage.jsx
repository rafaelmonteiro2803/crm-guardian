import React, { useState, useMemo } from "react";
import { Icons } from "../components/Icons";

export function RelatorioVendasClientesPage({ vendas = [], titulos = [], clientes = [], fmtBRL: formatBRL }) {
  const [clienteFiltro, setClienteFiltro] = useState("");
  const [clienteSelecionado, setClienteSelecionado] = useState(null);
  const [titulosModal, setTitulosModal] = useState(null);

  // Garantir que fmtBRL é uma função válida
  const fmtBRL = typeof formatBRL === 'function'
    ? formatBRL
    : (v) => parseFloat(v || 0).toLocaleString("pt-BR", { minimumFractionDigits: 2 });

  // Agrupar vendas por cliente
  const vendasPorCliente = useMemo(() => {
    const mapa = {};
    vendas.forEach((v) => {
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
    if (!clienteSelecionado) return [];
    const vendasCliente = vendasPorCliente[clienteSelecionado.id];
    return Array.isArray(vendasCliente) ? vendasCliente : [];
  }, [clienteSelecionado, vendasPorCliente]);

  // Títulos de uma venda
  const getTitulosPorVenda = (vendaId) => {
    return titulos.filter((t) => t.venda_id === vendaId);
  };

  // Verifica se há título em aberto
  const temTituloEmAberto = (vendaId) => {
    const titulosDaVenda = getTitulosPorVenda(vendaId);
    return titulosDaVenda.some((t) => t.status !== "pago" && t.status !== "cancelado");
  };

  return (
    <div className="space-y-4">
      <h2 className="text-sm font-semibold text-gray-700">Relatório de Vendas por Cliente</h2>

      <div className="bg-white border border-gray-200 rounded p-4">
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Filtrar Cliente</label>
          <input
            type="text"
            value={clienteFiltro}
            onChange={(e) => setClienteFiltro(e.target.value)}
            placeholder="Digite o nome do cliente..."
            className="w-full border border-gray-200 rounded px-2.5 py-1.5 text-sm focus:ring-1 focus:ring-gray-400 outline-none"
          />
        </div>

        {clienteFiltro.trim().length > 0 && !clienteSelecionado && clientesFiltrados.length > 0 && (
          <div className="mt-3 border border-gray-200 rounded overflow-hidden max-h-48 overflow-y-auto">
            {clientesFiltrados.map((c) => (
              <button
                key={c.id}
                onClick={() => setClienteSelecionado(c)}
                className="w-full flex items-center gap-2 px-3 py-2 text-xs text-left hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
              >
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
              onClick={() => {
                setClienteSelecionado(null);
                setClienteFiltro("");
              }}
              className="text-xs text-gray-400 hover:text-gray-600 underline"
            >
              limpar
            </button>
          </div>

          {vendasSelecionadas.length === 0 ? (
            <div className="bg-white border border-gray-200 rounded p-6 text-center text-xs text-gray-400">
              Nenhuma venda encontrada.
            </div>
          ) : (
            <div className="bg-white border border-gray-200 rounded overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b bg-gray-50">
                      <th className="px-3 py-2 text-left font-medium text-gray-600">Data</th>
                      <th className="px-3 py-2 text-left font-medium text-gray-600">Descrição</th>
                      <th className="px-3 py-2 text-left font-medium text-gray-600">Pgto</th>
                      <th className="px-3 py-2 text-left font-medium text-gray-600">Valor</th>
                      <th className="px-3 py-2 text-left font-medium text-gray-600">Título?</th>
                      <th className="px-3 py-2 text-left font-medium text-gray-600">Ação</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {vendasSelecionadas.map((venda) => {
                      const aberto = temTituloEmAberto(venda.id);
                      const titulosDaVenda = getTitulosPorVenda(venda.id);
                      const dataFormatada = new Date(venda.data_venda).toLocaleDateString("pt-BR");
                      const descricao = venda.descricao || "-";
                      const pgto = (venda.forma_pagamento || "-").toLowerCase();
                      const valorFormatado = fmtBRL(venda.valor);
                      const statusTitulo = aberto ? "Sim" : "Não";

                      return (
                        <tr key={venda.id} className="hover:bg-gray-50">
                          <td className="px-3 py-2">{dataFormatada}</td>
                          <td className="px-3 py-2">{descricao}</td>
                          <td className="px-3 py-2">{pgto}</td>
                          <td className="px-3 py-2 text-green-700 font-medium">R$ {valorFormatado}</td>
                          <td className="px-3 py-2">{statusTitulo}</td>
                          <td className="px-3 py-2">
                            <button
                              onClick={() => setTitulosModal({ vendaId: venda.id, titulos: titulosDaVenda })}
                              className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-2 py-1 rounded"
                            >
                              Ver ({titulosDaVenda.length})
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {titulosModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full mx-4 max-h-[80vh] overflow-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-gray-800">Títulos da Venda</h3>
              <button
                onClick={() => setTitulosModal(null)}
                className="text-gray-500 hover:text-gray-700 p-1"
              >
                ✕
              </button>
            </div>

            <div className="p-4">
              {titulosModal.titulos.length === 0 ? (
                <p className="text-xs text-gray-400 text-center py-4">
                  Nenhum título vinculado.
                </p>
              ) : (
                <div className="space-y-3">
                  {titulosModal.titulos.map((t) => (
                    <div key={t.id} className="border border-gray-200 rounded p-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-xs font-medium text-gray-800">{t.descricao || "Sem descrição"}</p>
                          <p className="text-[11px] text-gray-500 mt-1">
                            Emissão: {new Date(t.data_emissao).toLocaleDateString("pt-BR")} • Vencimento: {new Date(t.data_vencimento).toLocaleDateString("pt-BR")}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs font-semibold text-gray-800">R$ {fmtBRL(t.valor)}</p>
                          <span className="inline-flex text-[11px] font-medium px-2 py-1 rounded mt-1 bg-gray-50 text-gray-600">
                            {t.status === "pago" ? "Pago" : t.status === "cancelado" ? "Cancelado" : "Pendente"}
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
