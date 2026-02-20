import { useState, useEffect } from "react";
import { getCategorialLabel } from "../../constants/estoque";

const FORM_INICIAL = (tipo = "entrada", custoUnitario = "") => ({
  tipo,
  quantidade: "",
  custo_unitario: custoUnitario,
  motivo: tipo === "entrada" ? "compra" : tipo === "saida" ? "uso_servico" : "ajuste",
  observacoes: "",
  data_movimentacao: new Date().toISOString().split("T")[0],
});

export function MovimentacaoModal({ aberto, item, tipoInicial = "entrada", onClose, onSalvar }) {
  const [form, setForm] = useState(FORM_INICIAL());

  useEffect(() => {
    if (aberto && item) {
      setForm(FORM_INICIAL(tipoInicial, (item.custo_unitario ?? 0).toString()));
    }
  }, [aberto, item, tipoInicial]);

  if (!aberto || !item) return null;

  const handleTipoChange = (novoTipo) => {
    const motivo =
      novoTipo === "entrada" ? "compra" :
      novoTipo === "saida" ? "uso_servico" : "ajuste";
    setForm({ ...form, tipo: novoTipo, motivo });
  };

  const handleSalvar = () => {
    if (!form.quantidade || parseFloat(form.quantidade) <= 0)
      return alert("Informe uma quantidade válida!");
    onSalvar(form, item);
  };

  const f = (field) => (e) => setForm({ ...form, [field]: e.target.value });
  const inputCls = "w-full border border-gray-200 rounded px-2.5 py-1.5 text-sm focus:ring-1 focus:ring-gray-400 outline-none";

  const tipoCls =
    form.tipo === "entrada"
      ? "bg-green-50 border-green-200"
      : form.tipo === "saida"
      ? "bg-orange-50 border-orange-200"
      : "bg-blue-50 border-blue-200";

  const btnCls =
    form.tipo === "entrada"
      ? "bg-green-700 hover:bg-green-800"
      : form.tipo === "saida"
      ? "bg-orange-600 hover:bg-orange-700"
      : "bg-blue-700 hover:bg-blue-800";

  const titulo =
    form.tipo === "entrada" ? "Registrar Entrada" :
    form.tipo === "saida" ? "Registrar Saída" : "Ajuste de Estoque";

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg border border-gray-200 max-w-sm w-full p-4 max-h-[90vh] overflow-y-auto">
        <h3 className="text-sm font-semibold mb-1">{titulo}</h3>
        <div className={`rounded p-2.5 mb-3 border ${tipoCls}`}>
          <p className="text-xs font-semibold text-gray-800">{item.nome}</p>
          <p className="text-[11px] text-gray-500">
            {getCategorialLabel(item.categoria)} · Estoque atual:{" "}
            <span className="font-medium">
              {parseFloat(item.quantidade_atual || 0).toLocaleString("pt-BR", { maximumFractionDigits: 3 })}{" "}
              {item.unidade_medida || "un"}
            </span>
          </p>
        </div>
        <div className="space-y-2.5">
          <div>
            <label className="block text-xs text-gray-600 mb-0.5">Tipo *</label>
            <select
              value={form.tipo}
              onChange={(e) => handleTipoChange(e.target.value)}
              className={inputCls}
            >
              <option value="entrada">Entrada</option>
              <option value="saida">Saída</option>
              <option value="ajuste">Ajuste (definir quantidade)</option>
            </select>
          </div>
          <div>
            <label className="block text-xs text-gray-600 mb-0.5">Motivo *</label>
            <select value={form.motivo} onChange={f("motivo")} className={inputCls}>
              {form.tipo === "entrada" && (
                <>
                  <option value="compra">Compra</option>
                  <option value="devolucao">Devolução</option>
                  <option value="inventario">Inventário</option>
                </>
              )}
              {form.tipo === "saida" && (
                <>
                  <option value="uso_servico">Uso em Serviço</option>
                  <option value="venda">Venda</option>
                  <option value="perda">Perda / Vencimento</option>
                  <option value="inventario">Inventário</option>
                </>
              )}
              {form.tipo === "ajuste" && (
                <option value="ajuste">Ajuste de Estoque</option>
              )}
            </select>
          </div>
          <div>
            <label className="block text-xs text-gray-600 mb-0.5">
              {form.tipo === "ajuste" ? "Nova Quantidade *" : "Quantidade *"}
            </label>
            <input
              type="number"
              step="0.001"
              min="0"
              value={form.quantidade}
              onChange={f("quantidade")}
              placeholder="0"
              className={inputCls}
            />
          </div>
          {form.tipo === "entrada" && (
            <div>
              <label className="block text-xs text-gray-600 mb-0.5">Custo Unitário (R$)</label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={form.custo_unitario}
                onChange={f("custo_unitario")}
                className={inputCls}
              />
            </div>
          )}
          <div>
            <label className="block text-xs text-gray-600 mb-0.5">Data</label>
            <input type="date" value={form.data_movimentacao} onChange={f("data_movimentacao")} className={inputCls} />
          </div>
          <div>
            <label className="block text-xs text-gray-600 mb-0.5">Observações</label>
            <textarea value={form.observacoes} onChange={f("observacoes")} className={inputCls} rows="2" />
          </div>
        </div>
        <div className="flex gap-2 mt-4">
          <button onClick={onClose} className="flex-1 px-3 py-1.5 border border-gray-200 rounded text-xs hover:bg-gray-50">
            Cancelar
          </button>
          <button onClick={handleSalvar} className={`flex-1 px-3 py-1.5 text-white rounded text-xs font-medium ${btnCls}`}>
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
}
