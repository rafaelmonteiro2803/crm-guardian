import React, { useState } from "react";
import { Icons } from "../components/Icons";

export function AtendimentosRelatorioPage({ clientes, vendas, ordensServico, fmtBRL }) {
  const [busca, setBusca] = useState("");
  const [clienteSelecionado, setClienteSelecionado] = useState(null);
  const [vendaSelecionada, setVendaSelecionada] = useState(null);

  const handleBuscaChange = (e) => {
    setBusca(e.target.value);
    setClienteSelecionado(null);
    setVendaSelecionada(null);
  };

  const selecionarCliente = (c) => {
    setClienteSelecionado(c);
    setBusca(c.nome);
    setVendaSelecionada(null);
  };

  const limpar = () => {
    setClienteSelecionado(null);
    setVendaSelecionada(null);
    setBusca("");
  };

  const clientesFiltrados = clientes.filter((c) =>
    c.nome.toLowerCase().includes(busca.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <h2 className="text-sm font-semibold text-gray-700">Atendimentos</h2>

      <div className="bg-white border border-gray-200 rounded p-4 space-y-3">
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Buscar Cliente</label>
          <div className="relative">
            <Icons.Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
            <input
              type="text"
              value={busca}
              onChange={handleBuscaChange}
              placeholder="Digite o nome do cliente..."
              className="w-full border border-gray-200 rounded pl-8 pr-2.5 py-1.5 text-sm focus:ring-1 focus:ring-gray-400 outline-none"
            />
          </div>
        </div>

        {busca.trim().length > 0 && !clienteSelecionado && (
          <div className="border border-gray-200 rounded overflow-hidden">
            {clientesFiltrados.length === 0 ? (
              <p className="text-xs text-gray-400 p-3 text-center">Nenhum cliente encontrado.</p>
            ) : (
              clientesFiltrados.map((c) => (
                <button
                  key={c.id}
                  onClick={() => selecionarCliente(c)}
                  className="w-full flex items-center gap-2 px-3 py-2 text-xs text-left hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
                >
                  <Icons.User className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                  <span className="font-medium text-gray-800">{c.nome}</span>
                  {c.telefone && <span className="text-gray-400 ml-auto">{c.telefone}</span>}
                </button>
              ))
            )}
          </div>
        )}
      </div>

      {clienteSelecionado && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <h3 className="text-xs font-semibold text-gray-700">Vendas de {clienteSelecionado.nome}</h3>
            <button onClick={limpar} className="text-[11px] text-gray-400 hover:text-gray-600 underline">limpar</button>
          </div>

          {vendas.filter((v) => v.cliente_id === clienteSelecionado.id).length === 0 ? (
            <div className="bg-white border border-gray-200 rounded p-6 text-center text-xs text-gray-400">
              Nenhuma venda encontrada para este cliente.
            </div>
          ) : (
            <div className="grid gap-2">
              {vendas
                .filter((v) => v.cliente_id === clienteSelecionado.id)
                .map((v) => (
                  <button
                    key={v.id}
                    onClick={() => setVendaSelecionada(vendaSelecionada?.id === v.id ? null : v)}
                    className={`w-full text-left bg-white border rounded p-3 hover:border-gray-400 transition-colors ${vendaSelecionada?.id === v.id ? "border-gray-800 ring-1 ring-gray-800" : "border-gray-200"}`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-gray-800">{v.descricao}</span>
                      <span className="text-xs font-semibold text-green-700">R$ {fmtBRL(v.valor)}</span>
                    </div>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-[11px] text-gray-400">{new Date(v.data_venda).toLocaleDateString("pt-BR")}</span>
                      <span className="text-[11px] text-gray-400 capitalize">{v.forma_pagamento}</span>
                      {(() => {
                        const os = ordensServico.find((o) => o.venda_id === v.id);
                        return os ? <span className="text-[11px] text-purple-600 font-medium">OS: {os.numero_os}</span> : null;
                      })()}
                    </div>
                  </button>
                ))}
            </div>
          )}
        </div>
      )}

      {vendaSelecionada && (
        <div className="bg-white border border-gray-200 rounded p-4 space-y-3">
          <h3 className="text-xs font-semibold text-gray-700 flex items-center gap-1.5">
            <Icons.BookOpen className="w-3.5 h-3.5 text-purple-600" />Evolução do Atendimento
          </h3>
          {(() => {
            const os = ordensServico.find((o) => o.venda_id === vendaSelecionada.id);
            if (!os) return <p className="text-xs text-gray-400 italic">Nenhuma ordem de serviço encontrada para esta venda.</p>;
            return (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-[11px] text-gray-500">
                  <span>OS: <span className="font-mono font-medium">{os.numero_os}</span></span>
                  <span>·</span>
                  <span className={os.status === "atendimento_concluido" ? "text-green-600 font-medium" : os.status === "em_atendimento" ? "text-blue-600 font-medium" : "text-gray-500"}>
                    {os.status === "atendimento_concluido" ? "Concluído" : os.status === "em_atendimento" ? "Em Atendimento" : "Aguardando"}
                  </span>
                </div>
                {os.observacoes ? (
                  <div className="bg-gray-50 border border-gray-200 rounded p-3 text-xs text-gray-700 whitespace-pre-wrap leading-relaxed font-mono">
                    {os.observacoes}
                  </div>
                ) : (
                  <p className="text-xs text-gray-400 italic bg-gray-50 border border-gray-100 rounded p-3">
                    Nenhuma evolução registrada para este atendimento.
                  </p>
                )}
              </div>
            );
          })()}
        </div>
      )}
    </div>
  );
}
