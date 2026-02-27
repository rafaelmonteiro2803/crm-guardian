import { useState, useEffect } from "react";

const FORM_INICIAL = {
  nome: "",
  codigo: "",
  descricao: "",
  ativo: true,
};

export function CentroCustoModal({ aberto, editando, onClose, onSalvar }) {
  const [form, setForm] = useState(FORM_INICIAL);

  useEffect(() => {
    if (editando) {
      setForm({
        nome: editando.nome || "",
        codigo: editando.codigo || "",
        descricao: editando.descricao || "",
        ativo: editando.ativo ?? true,
      });
    } else {
      setForm(FORM_INICIAL);
    }
  }, [editando, aberto]);

  if (!aberto) return null;

  const handleSalvar = () => {
    if (!form.nome.trim()) return alert("Nome é obrigatório!");
    onSalvar(form);
  };

  const f = (field) => (e) => setForm({ ...form, [field]: e.target.value });
  const cls = "w-full border border-gray-200 rounded px-2.5 py-1.5 text-sm focus:ring-1 focus:ring-gray-400 outline-none";

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg border border-gray-200 max-w-sm w-full p-4">
        <h3 className="text-sm font-semibold mb-3">
          {editando ? "Editar Centro de Custo" : "Novo Centro de Custo"}
        </h3>
        <div className="space-y-2.5">
          <div>
            <label className="block text-xs text-gray-600 mb-0.5">Nome *</label>
            <input type="text" value={form.nome} onChange={f("nome")} className={cls} placeholder="Ex: Administrativo, Operacional..." />
          </div>
          <div>
            <label className="block text-xs text-gray-600 mb-0.5">Código</label>
            <input type="text" value={form.codigo} onChange={f("codigo")} className={cls} placeholder="Ex: ADM-001" />
          </div>
          <div>
            <label className="block text-xs text-gray-600 mb-0.5">Descrição</label>
            <textarea value={form.descricao} onChange={f("descricao")} className={cls} rows="2" />
          </div>
          <div className="flex items-center gap-2">
            <input
              id="cc-ativo"
              type="checkbox"
              checked={!!form.ativo}
              onChange={(e) => setForm({ ...form, ativo: e.target.checked })}
            />
            <label htmlFor="cc-ativo" className="text-xs text-gray-600">Ativo</label>
          </div>
        </div>
        <div className="flex gap-2 mt-4">
          <button onClick={onClose} className="flex-1 px-3 py-1.5 border border-gray-200 rounded text-xs hover:bg-gray-50">
            Cancelar
          </button>
          <button onClick={handleSalvar} className="flex-1 px-3 py-1.5 bg-gray-800 text-white rounded text-xs hover:bg-gray-700">
            {editando ? "Salvar" : "Adicionar"}
          </button>
        </div>
      </div>
    </div>
  );
}
