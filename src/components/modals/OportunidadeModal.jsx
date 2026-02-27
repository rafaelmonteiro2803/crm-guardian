import React, { useState } from "react";
import { Icons } from "../Icons";
import { ESTAGIOS } from "../../constants/oportunidades";

const FORM_INICIAL = {
  titulo: "",
  cliente_id: "",
  produto_id: "",
  valor: "",
  estagio: "prospecção",
  data_inicio: new Date().toISOString().split("T")[0],
};

export function OportunidadeModal({ editando, clientes, produtos, fmtBRL, onSalvar, onFechar }) {
  const clienteInicial = editando ? clientes.find((c) => c.id === editando.cliente_id) : null;
  const produtoInicial = editando && editando.produto_id
    ? produtos.find((p) => p.id === editando.produto_id)
    : null;

  const [form, setForm] = useState(() =>
    editando
      ? {
          titulo: editando.titulo,
          cliente_id: editando.cliente_id,
          produto_id: editando.produto_id || "",
          valor: editando.valor.toString(),
          estagio: editando.estagio,
          data_inicio: editando.data_inicio,
        }
      : FORM_INICIAL
  );

  const [clienteBusca, setClienteBusca] = useState(clienteInicial?.nome || "");
  const [clienteSelecionado, setClienteSelecionado] = useState(clienteInicial || null);
  const [produtoBusca, setProdutoBusca] = useState(
    produtoInicial ? `${produtoInicial.nome} — R$ ${fmtBRL(produtoInicial.preco_base)}` : ""
  );
  const [produtoSelecionado, setProdutoSelecionado] = useState(produtoInicial || null);

  const set = (field, value) => setForm((f) => ({ ...f, [field]: value }));

  const clientesFiltrados = clientes.filter((c) =>
    c.nome.toLowerCase().includes(clienteBusca.toLowerCase())
  );

  const produtosFiltrados = produtos
    .filter((p) => p.ativo !== false)
    .filter((p) => p.nome.toLowerCase().includes(produtoBusca.toLowerCase()));

  const selecionarCliente = (c) => {
    setClienteSelecionado(c);
    setClienteBusca(c.nome);
    set("cliente_id", c.id);
  };

  const selecionarProduto = (p) => {
    setProdutoSelecionado(p);
    setProdutoBusca(`${p.nome} — R$ ${fmtBRL(p.preco_base)}`);
    setForm((f) => ({ ...f, produto_id: p.id, valor: p.preco_base.toString() }));
  };

  const limparProduto = () => {
    setProdutoSelecionado(null);
    setProdutoBusca("");
    set("produto_id", "");
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg border border-gray-200 max-w-sm w-full p-4">
        <h3 className="text-sm font-semibold mb-3">
          {editando ? "Editar Oportunidade" : "Nova Oportunidade"}
        </h3>
        <div className="space-y-2.5">
          <div>
            <label className="block text-xs text-gray-600 mb-0.5">Título *</label>
            <input type="text" value={form.titulo} onChange={(e) => set("titulo", e.target.value)}
              className="w-full border border-gray-200 rounded px-2.5 py-1.5 text-sm focus:ring-1 focus:ring-gray-400 outline-none" />
          </div>

          <div>
            <label className="block text-xs text-gray-600 mb-0.5">Cliente *</label>
            <div className="relative">
              <Icons.Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
              <input
                type="text"
                value={clienteBusca}
                onChange={(e) => { setClienteBusca(e.target.value); setClienteSelecionado(null); set("cliente_id", ""); }}
                placeholder="Digite o nome do cliente..."
                className="w-full border border-gray-200 rounded pl-8 pr-2.5 py-1.5 text-sm focus:ring-1 focus:ring-gray-400 outline-none"
              />
            </div>
            {clienteBusca.trim().length > 0 && !clienteSelecionado && (
              <div className="border border-gray-200 rounded overflow-hidden mt-1">
                {clientesFiltrados.length === 0 ? (
                  <p className="text-xs text-gray-400 p-3 text-center">Nenhum cliente encontrado.</p>
                ) : (
                  clientesFiltrados.map((c) => (
                    <button
                      key={c.id}
                      type="button"
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

          <div>
            <label className="block text-xs text-gray-600 mb-0.5">
              Produto
              {produtoSelecionado && (
                <button type="button" onClick={limparProduto} className="ml-2 text-gray-400 hover:text-gray-600 underline font-normal">
                  limpar
                </button>
              )}
            </label>
            <div className="relative">
              <Icons.Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
              <input
                type="text"
                value={produtoBusca}
                onChange={(e) => { setProdutoBusca(e.target.value); setProdutoSelecionado(null); set("produto_id", ""); }}
                placeholder="Digite o nome do produto..."
                className="w-full border border-gray-200 rounded pl-8 pr-2.5 py-1.5 text-sm focus:ring-1 focus:ring-gray-400 outline-none"
              />
            </div>
            {produtoBusca.trim().length > 0 && !produtoSelecionado && (
              <div className="border border-gray-200 rounded overflow-hidden mt-1">
                {produtosFiltrados.length === 0 ? (
                  <p className="text-xs text-gray-400 p-3 text-center">Nenhum produto encontrado.</p>
                ) : (
                  produtosFiltrados.map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => selecionarProduto(p)}
                      className="w-full flex items-center gap-2 px-3 py-2 text-xs text-left hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
                    >
                      <span className="font-medium text-gray-800">{p.nome}</span>
                      <span className="text-gray-400 ml-auto">R$ {fmtBRL(p.preco_base)}</span>
                    </button>
                  ))
                )}
              </div>
            )}
          </div>

          <div>
            <label className="block text-xs text-gray-600 mb-0.5">Valor (R$)</label>
            <input type="number" step="0.01" value={form.valor} onChange={(e) => set("valor", e.target.value)}
              className="w-full border border-gray-200 rounded px-2.5 py-1.5 text-sm focus:ring-1 focus:ring-gray-400 outline-none" />
          </div>
          <div>
            <label className="block text-xs text-gray-600 mb-0.5">Estágio</label>
            <select value={form.estagio} onChange={(e) => set("estagio", e.target.value)}
              className="w-full border border-gray-200 rounded px-2.5 py-1.5 text-sm focus:ring-1 focus:ring-gray-400 outline-none">
              {ESTAGIOS.map((e) => (
                <option key={e} value={e}>{e.charAt(0).toUpperCase() + e.slice(1)}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs text-gray-600 mb-0.5">Data de Início</label>
            <input type="date" value={form.data_inicio} onChange={(e) => set("data_inicio", e.target.value)}
              className="w-full border border-gray-200 rounded px-2.5 py-1.5 text-sm focus:ring-1 focus:ring-gray-400 outline-none" />
          </div>
        </div>
        <div className="flex gap-2 mt-4">
          <button onClick={onFechar} className="flex-1 px-3 py-1.5 border border-gray-200 rounded text-xs hover:bg-gray-50">Cancelar</button>
          <button onClick={() => onSalvar(form)} className="flex-1 px-3 py-1.5 bg-gray-800 text-white rounded text-xs hover:bg-gray-700">
            {editando ? "Salvar" : "Adicionar"}
          </button>
        </div>
      </div>
    </div>
  );
}
