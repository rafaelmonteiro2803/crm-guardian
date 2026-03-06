import React, { useState } from "react";

const FORM_INICIAL = {
  nome: "", cpf: "", email: "", telefone: "",
  especialidade: "", endereco: "", observacoes: "", ativo: true,
};

export function TecnicoModal({ editando, onSalvar, onFechar }) {
  const [form, setForm] = useState(() =>
    editando
      ? {
          nome: editando.nome || "", cpf: editando.cpf || "", email: editando.email || "",
          telefone: editando.telefone || "", especialidade: editando.especialidade || "",
          endereco: editando.endereco || "", observacoes: editando.observacoes || "",
          ativo: editando.ativo ?? true,
        }
      : FORM_INICIAL
  );
  const [erros, setErros] = useState({});

  const set = (field, value) => {
    setForm((f) => ({ ...f, [field]: value }));
    if (erros[field]) setErros((e) => ({ ...e, [field]: false }));
  };

  const handleCpf = (v) => {
    const d = v.replace(/\D/g, "").slice(0, 11);
    const f =
      d.length > 9 ? d.replace(/(\d{3})(\d{3})(\d{3})(\d{1,2})/, "$1.$2.$3-$4")
      : d.length > 6 ? d.replace(/(\d{3})(\d{3})(\d{1,3})/, "$1.$2.$3")
      : d.length > 3 ? d.replace(/(\d{3})(\d{1,3})/, "$1.$2")
      : d;
    setForm((prev) => ({ ...prev, cpf: f }));
  };

  const handleSalvar = () => {
    const e = {};
    if (!form.nome.trim()) e.nome = true;
    if (Object.keys(e).length) return setErros(e);
    onSalvar(form);
  };

  const ic = (field) =>
    `w-full border ${erros[field] ? "border-red-500" : "border-gray-200"} rounded px-2.5 py-1.5 text-sm focus:ring-1 focus:ring-gray-400 outline-none`;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg border border-gray-200 max-w-sm w-full p-4 max-h-[90vh] overflow-y-auto">
        <h3 className="text-sm font-semibold mb-3">{editando ? "Editar Técnico" : "Novo Técnico"}</h3>
        <div className="space-y-2.5">
          <div>
            <label className="block text-xs text-gray-600 mb-0.5">Nome *</label>
            <input type="text" value={form.nome} onChange={(e) => set("nome", e.target.value)}
              className={ic("nome")} />
          </div>
          <div>
            <label className="block text-xs text-gray-600 mb-0.5">CPF</label>
            <input type="text" value={form.cpf} onChange={(e) => handleCpf(e.target.value)}
              placeholder="000.000.000-00"
              className={ic("")} />
          </div>
          <div>
            <label className="block text-xs text-gray-600 mb-0.5">Email</label>
            <input type="email" value={form.email} onChange={(e) => set("email", e.target.value)}
              className={ic("")} />
          </div>
          <div>
            <label className="block text-xs text-gray-600 mb-0.5">Telefone</label>
            <input type="tel" value={form.telefone} onChange={(e) => set("telefone", e.target.value)}
              className={ic("")} />
          </div>
          <div>
            <label className="block text-xs text-gray-600 mb-0.5">Especialidade</label>
            <input type="text" value={form.especialidade} onChange={(e) => set("especialidade", e.target.value)}
              placeholder="Ex: Elétrica, Hidráulica, TI..."
              className={ic("")} />
          </div>
          <div>
            <label className="block text-xs text-gray-600 mb-0.5">Endereço</label>
            <input type="text" value={form.endereco} onChange={(e) => set("endereco", e.target.value)}
              className={ic("")} />
          </div>
          <div>
            <label className="block text-xs text-gray-600 mb-0.5">Observações</label>
            <textarea value={form.observacoes} onChange={(e) => set("observacoes", e.target.value)}
              className={ic("")} rows="2" />
          </div>
          <div className="flex items-center gap-2">
            <input id="ta" type="checkbox" checked={!!form.ativo} onChange={(e) => set("ativo", e.target.checked)} />
            <label htmlFor="ta" className="text-xs text-gray-600">Ativo</label>
          </div>
        </div>
        <div className="flex gap-2 mt-4">
          <button onClick={onFechar} className="flex-1 px-3 py-1.5 border border-gray-200 rounded text-xs hover:bg-gray-50">Cancelar</button>
          <button onClick={handleSalvar} className="flex-1 px-3 py-1.5 bg-gray-800 text-white rounded text-xs hover:bg-gray-700">
            {editando ? "Salvar" : "Adicionar"}
          </button>
        </div>
      </div>
    </div>
  );
}
