import React from "react";
import { DataGrid } from "../components/DataGrid";
import { Icons } from "../components/Icons";
import { VincularEstoqueModal } from "../components/modals/VincularEstoqueModal";

export function ProdutosPage({
  produtos,
  estoqueItens,
  produtoEstoqueVinculos,
  fmtBRL,
  salvarProduto,
  excluirProduto,
  modalProduto,
  editandoProduto,
  formProduto,
  setFormProduto,
  abrirModalProduto,
  fecharModalProduto,
  modalVincularEstoque,
  vinculoProduto,
  abrirModalVincular,
  fecharModalVincular,
  salvarVinculo,
  excluirVinculo,
}) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-gray-700">Produtos / Serviços</h2>
        <button
          onClick={() => abrirModalProduto()}
          className="inline-flex items-center gap-1 bg-gray-800 hover:bg-gray-700 text-white px-3 py-1.5 rounded text-xs font-medium"
        >
          <Icons.Plus />Novo
        </button>
      </div>

      <DataGrid
        columns={[
          { key: "nome", label: "Nome", render: (p) => <span className="font-medium text-gray-800">{p.nome}</span>, filterValue: (p) => p.nome || "" },
          { key: "tipo", label: "Tipo", render: (p) => <span className="capitalize">{p.tipo}</span>, filterValue: (p) => p.tipo || "" },
          { key: "categoria", label: "Categoria", render: (p) => p.categoria || <span className="text-gray-300">-</span>, filterValue: (p) => p.categoria || "" },
          { key: "preco_base", label: "Preço", render: (p) => <span className="font-medium text-green-700">R$ {fmtBRL(p.preco_base)}</span>, sortValue: (p) => parseFloat(p.preco_base || 0) },
          { key: "custo", label: "Custo", render: (p) => `R$ ${fmtBRL(p.custo)}`, sortValue: (p) => parseFloat(p.custo || 0) },
          {
            key: "insumos",
            label: "Insumos Vinculados",
            filterable: false,
            render: (p) => {
              const vinculos = produtoEstoqueVinculos.filter((v) => v.produto_id === p.id);
              if (!vinculos.length) return <span className="text-gray-300 text-[11px]">Nenhum</span>;
              return (
                <div className="space-y-0.5">
                  {vinculos.slice(0, 2).map((v) => (
                    <div key={v.id} className="text-[11px] text-gray-600">
                      <span className="font-medium">{estoqueItens.find((e) => e.id === v.estoque_item_id)?.nome || "N/A"}</span>{" "}
                      <span className="text-gray-400">× {parseFloat(v.quantidade_usada).toLocaleString("pt-BR", { maximumFractionDigits: 3 })}</span>
                    </div>
                  ))}
                  {vinculos.length > 2 && <div className="text-[10px] text-gray-400">+{vinculos.length - 2} mais</div>}
                </div>
              );
            },
          },
          { key: "ativo", label: "Status", render: (p) => p.ativo ? <span className="px-1.5 py-0.5 rounded text-[11px] bg-green-50 text-green-700">Ativo</span> : <span className="px-1.5 py-0.5 rounded text-[11px] bg-gray-100 text-gray-500">Inativo</span>, filterValue: (p) => p.ativo ? "Ativo" : "Inativo" },
        ]}
        data={produtos}
        actions={(p) => (
          <div className="flex items-center gap-1">
            <button onClick={() => abrirModalVincular(p)} title="Gerenciar insumos do estoque vinculados" className="text-blue-600 hover:bg-blue-50 px-1.5 py-0.5 rounded text-[11px] font-medium flex items-center gap-0.5">
              <Icons.Link className="w-3 h-3" />Insumos
            </button>
            <button onClick={() => abrirModalProduto(p)} className="text-gray-500 hover:text-gray-700 hover:bg-gray-100 p-1 rounded"><Icons.Edit /></button>
            <button onClick={() => excluirProduto(p.id)} className="text-gray-400 hover:text-red-600 hover:bg-red-50 p-1 rounded"><Icons.Trash /></button>
          </div>
        )}
        emptyMessage="Nenhum produto cadastrado."
      />

      {modalProduto && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg border border-gray-200 max-w-sm w-full p-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-sm font-semibold mb-3">{editandoProduto ? "Editar Produto" : "Novo Produto"}</h3>
            <div className="space-y-2.5">
              <div><label className="block text-xs text-gray-600 mb-0.5">Nome *</label><input type="text" value={formProduto.nome} onChange={(e) => setFormProduto({ ...formProduto, nome: e.target.value })} className="w-full border border-gray-200 rounded px-2.5 py-1.5 text-sm focus:ring-1 focus:ring-gray-400 outline-none" /></div>
              <div><label className="block text-xs text-gray-600 mb-0.5">Tipo</label><select value={formProduto.tipo} onChange={(e) => setFormProduto({ ...formProduto, tipo: e.target.value })} className="w-full border border-gray-200 rounded px-2.5 py-1.5 text-sm focus:ring-1 focus:ring-gray-400 outline-none"><option value="produto">Produto</option><option value="servico">Serviço</option></select></div>
              <div><label className="block text-xs text-gray-600 mb-0.5">Categoria</label><input type="text" value={formProduto.categoria} onChange={(e) => setFormProduto({ ...formProduto, categoria: e.target.value })} className="w-full border border-gray-200 rounded px-2.5 py-1.5 text-sm focus:ring-1 focus:ring-gray-400 outline-none" /></div>
              <div><label className="block text-xs text-gray-600 mb-0.5">Descrição</label><textarea value={formProduto.descricao} onChange={(e) => setFormProduto({ ...formProduto, descricao: e.target.value })} className="w-full border border-gray-200 rounded px-2.5 py-1.5 text-sm focus:ring-1 focus:ring-gray-400 outline-none" rows="2" /></div>
              <div className="grid grid-cols-2 gap-2">
                <div><label className="block text-xs text-gray-600 mb-0.5">Preço (R$)</label><input type="number" step="0.01" value={formProduto.preco_base} onChange={(e) => setFormProduto({ ...formProduto, preco_base: e.target.value })} className="w-full border border-gray-200 rounded px-2.5 py-1.5 text-sm focus:ring-1 focus:ring-gray-400 outline-none" /></div>
                <div><label className="block text-xs text-gray-600 mb-0.5">Custo (R$)</label><input type="number" step="0.01" value={formProduto.custo} onChange={(e) => setFormProduto({ ...formProduto, custo: e.target.value })} className="w-full border border-gray-200 rounded px-2.5 py-1.5 text-sm focus:ring-1 focus:ring-gray-400 outline-none" /></div>
              </div>
              <div><label className="block text-xs text-gray-600 mb-0.5">Unidade</label><input type="text" value={formProduto.unidade_medida} onChange={(e) => setFormProduto({ ...formProduto, unidade_medida: e.target.value })} className="w-full border border-gray-200 rounded px-2.5 py-1.5 text-sm focus:ring-1 focus:ring-gray-400 outline-none" placeholder="un, hora, kg..." /></div>
              <div className="flex items-center gap-2"><input id="pa" type="checkbox" checked={!!formProduto.ativo} onChange={(e) => setFormProduto({ ...formProduto, ativo: e.target.checked })} /><label htmlFor="pa" className="text-xs text-gray-600">Ativo</label></div>
              <div><label className="block text-xs text-gray-600 mb-0.5">Observações</label><textarea value={formProduto.observacoes} onChange={(e) => setFormProduto({ ...formProduto, observacoes: e.target.value })} className="w-full border border-gray-200 rounded px-2.5 py-1.5 text-sm focus:ring-1 focus:ring-gray-400 outline-none" rows="2" /></div>
            </div>
            <div className="flex gap-2 mt-4">
              <button onClick={fecharModalProduto} className="flex-1 px-3 py-1.5 border border-gray-200 rounded text-xs hover:bg-gray-50">Cancelar</button>
              <button onClick={salvarProduto} className="flex-1 px-3 py-1.5 bg-gray-800 text-white rounded text-xs hover:bg-gray-700">{editandoProduto ? "Salvar" : "Adicionar"}</button>
            </div>
          </div>
        </div>
      )}

      <VincularEstoqueModal
        aberto={modalVincularEstoque}
        produto={vinculoProduto}
        estoqueItens={estoqueItens}
        vinculos={produtoEstoqueVinculos}
        onSalvar={(form) => salvarVinculo(form, vinculoProduto?.id)}
        onExcluir={excluirVinculo}
        onClose={fecharModalVincular}
      />
    </div>
  );
}
