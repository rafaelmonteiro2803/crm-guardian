import { useState, useEffect } from "react";
import {
  CATEGORIAS_CONTAS_PAGAR,
  TIPOS_DESPESA,
  calcularParcelas,
} from "../../constants/contasPagar";

const FORM_INICIAL = {
  descricao: "",
  categoria: "outros",
  tipo: "variavel",
  valor_total: "",
  numero_parcelas: "1",
  fornecedor_id: "",
  centro_custo_id: "",
  data_competencia: new Date().toISOString().split("T")[0],
  data_primeira_parcela: new Date().toISOString().split("T")[0],
  observacoes: "",
  recorrente: false,
  recorrencia_meses: "0",
};

export function ContaPagarModal({
  aberto,
  editando,
  fornecedores,
  centrosCusto,
  onClose,
  onSalvar,
}) {
  const [form, setForm] = useState(FORM_INICIAL);
  const [previewParcelas, setPreviewParcelas] = useState([]);

  useEffect(() => {
    if (editando) {
      setForm({
        descricao: editando.descricao || "",
        categoria: editando.categoria || "outros",
        tipo: editando.tipo || "variavel",
        valor_total: (editando.valor_total ?? "").toString(),
        numero_parcelas: (editando.numero_parcelas ?? 1).toString(),
        fornecedor_id: editando.fornecedor_id || "",
        centro_custo_id: editando.centro_custo_id || "",
        data_competencia: editando.data_competencia || new Date().toISOString().split("T")[0],
        data_primeira_parcela: editando.data_primeira_parcela || new Date().toISOString().split("T")[0],
        observacoes: editando.observacoes || "",
        recorrente: editando.recorrente || false,
        recorrencia_meses: (editando.recorrencia_meses ?? 0).toString(),
      });
    } else {
      setForm(FORM_INICIAL);
    }
  }, [editando, aberto]);

  useEffect(() => {
    const valor = parseFloat(form.valor_total || 0);
    const num = parseInt(form.numero_parcelas || 1);
    if (valor > 0 && num > 0 && form.data_primeira_parcela) {
      setPreviewParcelas(calcularParcelas(valor, num, form.data_primeira_parcela));
    } else {
      setPreviewParcelas([]);
    }
  }, [form.valor_total, form.numero_parcelas, form.data_primeira_parcela]);

  if (!aberto) return null;

  const handleSalvar = () => {
    if (!form.descricao.trim()) return alert("Descrição é obrigatória!");
    if (!form.valor_total || parseFloat(form.valor_total) <= 0) return alert("Valor deve ser maior que zero!");
    onSalvar(form);
  };

  const f = (field) => (e) => setForm({ ...form, [field]: e.target.value });
  const cls = "w-full border border-gray-200 rounded px-2.5 py-1.5 text-sm focus:ring-1 focus:ring-gray-400 outline-none";
  const fmtBRL = (v) => parseFloat(v || 0).toLocaleString("pt-BR", { minimumFractionDigits: 2 });

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg border border-gray-200 max-w-lg w-full p-4 max-h-[90vh] overflow-y-auto">
        <h3 className="text-sm font-semibold mb-3">
          {editando ? "Editar Conta a Pagar" : "Nova Conta a Pagar"}
        </h3>
        <div className="space-y-2.5">
          <div>
            <label className="block text-xs text-gray-600 mb-0.5">Descrição *</label>
            <input
              type="text"
              value={form.descricao}
              onChange={f("descricao")}
              className={cls}
              placeholder="Ex: Aluguel sede, Fatura energia, Salários..."
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs text-gray-600 mb-0.5">Categoria *</label>
              <select value={form.categoria} onChange={f("categoria")} className={cls}>
                {CATEGORIAS_CONTAS_PAGAR.map((c) => (
                  <option key={c.value} value={c.value}>{c.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs text-gray-600 mb-0.5">Tipo</label>
              <select value={form.tipo} onChange={f("tipo")} className={cls}>
                {TIPOS_DESPESA.map((t) => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs text-gray-600 mb-0.5">Valor Total (R$) *</label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={form.valor_total}
                onChange={f("valor_total")}
                className={cls}
                placeholder="0,00"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-600 mb-0.5">Nº de Parcelas</label>
              <input
                type="number"
                min="1"
                max="60"
                value={form.numero_parcelas}
                onChange={f("numero_parcelas")}
                className={cls}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs text-gray-600 mb-0.5">Competência</label>
              <input type="date" value={form.data_competencia} onChange={f("data_competencia")} className={cls} />
            </div>
            <div>
              <label className="block text-xs text-gray-600 mb-0.5">Venc. 1ª Parcela</label>
              <input type="date" value={form.data_primeira_parcela} onChange={f("data_primeira_parcela")} className={cls} />
            </div>
          </div>

          {fornecedores && fornecedores.length > 0 && (
            <div>
              <label className="block text-xs text-gray-600 mb-0.5">Fornecedor</label>
              <select value={form.fornecedor_id} onChange={f("fornecedor_id")} className={cls}>
                <option value="">Nenhum</option>
                {fornecedores.filter((f) => f.ativo).map((f) => (
                  <option key={f.id} value={f.id}>{f.nome}</option>
                ))}
              </select>
            </div>
          )}

          {centrosCusto && centrosCusto.length > 0 && (
            <div>
              <label className="block text-xs text-gray-600 mb-0.5">Centro de Custo</label>
              <select value={form.centro_custo_id} onChange={f("centro_custo_id")} className={cls}>
                <option value="">Nenhum</option>
                {centrosCusto.filter((c) => c.ativo).map((c) => (
                  <option key={c.id} value={c.id}>{c.nome}{c.codigo ? ` (${c.codigo})` : ""}</option>
                ))}
              </select>
            </div>
          )}

          <div className="flex items-center gap-2">
            <input
              id="cp-recorrente"
              type="checkbox"
              checked={!!form.recorrente}
              onChange={(e) => setForm({ ...form, recorrente: e.target.checked })}
            />
            <label htmlFor="cp-recorrente" className="text-xs text-gray-600">Despesa recorrente (mensal)</label>
          </div>

          <div>
            <label className="block text-xs text-gray-600 mb-0.5">Observações</label>
            <textarea value={form.observacoes} onChange={f("observacoes")} className={cls} rows="2" />
          </div>

          {/* Preview das parcelas */}
          {previewParcelas.length > 1 && (
            <div className="bg-blue-50 border border-blue-100 rounded p-3">
              <p className="text-[11px] font-semibold text-blue-700 mb-2">
                Parcelas geradas ({previewParcelas.length}x de R$ {fmtBRL(previewParcelas[0]?.valor)})
              </p>
              <div className="space-y-1 max-h-28 overflow-y-auto">
                {previewParcelas.map((p) => (
                  <div key={p.numero_parcela} className="flex justify-between text-[11px] text-blue-600">
                    <span>{p.numero_parcela}/{previewParcelas.length}</span>
                    <span>{new Date(p.data_vencimento + "T00:00:00").toLocaleDateString("pt-BR")}</span>
                    <span className="font-medium">R$ {fmtBRL(p.valor)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          {previewParcelas.length === 1 && parseFloat(form.valor_total) > 0 && (
            <div className="bg-gray-50 border border-gray-100 rounded p-2 text-[11px] text-gray-600 flex justify-between">
              <span>Vencimento: {new Date(previewParcelas[0].data_vencimento + "T00:00:00").toLocaleDateString("pt-BR")}</span>
              <span className="font-medium">R$ {fmtBRL(previewParcelas[0].valor)}</span>
            </div>
          )}
        </div>

        <div className="flex gap-2 mt-4">
          <button onClick={onClose} className="flex-1 px-3 py-1.5 border border-gray-200 rounded text-xs hover:bg-gray-50">
            Cancelar
          </button>
          <button onClick={handleSalvar} className="flex-1 px-3 py-1.5 bg-gray-800 text-white rounded text-xs hover:bg-gray-700">
            {editando ? "Salvar" : "Criar Conta"}
          </button>
        </div>
      </div>
    </div>
  );
}
