import { useState, useEffect } from "react";

const FORM_INICIAL = {
  nome: "",
  cpf: "",
  email: "",
  telefone: "",
  empresa: "",
  data_nascimento: "",
  observacoes: "",
};

export function ClienteModal({ aberto, editando, onClose, onSalvar }) {
  const [form, setForm] = useState(FORM_INICIAL);

  useEffect(() => {
    if (editando) {
      setForm({
        nome: editando.nome,
        cpf: editando.cpf || "",
        email: editando.email || "",
        telefone: editando.telefone || "",
        empresa: editando.empresa || "",
        data_nascimento: editando.data_nascimento || "",
        observacoes: editando.observacoes || "",
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

  const handleCpf = (e) => {
    const v = e.target.value.replace(/\D/g, "").slice(0, 11);
    const f =
      v.length > 9 ? v.replace(/(\d{3})(\d{3})(\d{3})(\d{1,2})/, "$1.$2.$3-$4") :
      v.length > 6 ? v.replace(/(\d{3})(\d{3})(\d{1,3})/, "$1.$2.$3") :
      v.length > 3 ? v.replace(/(\d{3})(\d{1,3})/, "$1.$2") : v;
    setForm({ ...form, cpf: f });
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg border border-gray-200 max-w-sm w-full p-4 max-h-[90vh] overflow-y-auto">
        <h3 className="text-sm font-semibold mb-3">
          {editando ? "Editar Cliente" : "Novo Cliente"}
        </h3>
        <div className="space-y-2.5">
          <div>
            <label className="block text-xs text-gray-600 mb-0.5">Nome *</label>
            <input
              type="text"
              value={form.nome}
              onChange={(e) => setForm({ ...form, nome: e.target.value })}
              className="w-full border border-gray-200 rounded px-2.5 py-1.5 text-sm focus:ring-1 focus:ring-gray-400 outline-none"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-600 mb-0.5">CPF</label>
            <input
              type="text"
              value={form.cpf}
              onChange={handleCpf}
              placeholder="000.000.000-00"
              className="w-full border border-gray-200 rounded px-2.5 py-1.5 text-sm focus:ring-1 focus:ring-gray-400 outline-none"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-600 mb-0.5">Data de Nascimento</label>
            <input
              type="date"
              value={form.data_nascimento}
              onChange={(e) => setForm({ ...form, data_nascimento: e.target.value })}
              className="w-full border border-gray-200 rounded px-2.5 py-1.5 text-sm focus:ring-1 focus:ring-gray-400 outline-none"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-600 mb-0.5">Email</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full border border-gray-200 rounded px-2.5 py-1.5 text-sm focus:ring-1 focus:ring-gray-400 outline-none"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-600 mb-0.5">Telefone</label>
            <input
              type="tel"
              value={form.telefone}
              onChange={(e) => setForm({ ...form, telefone: e.target.value })}
              className="w-full border border-gray-200 rounded px-2.5 py-1.5 text-sm focus:ring-1 focus:ring-gray-400 outline-none"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-600 mb-0.5">Empresa</label>
            <input
              type="text"
              value={form.empresa}
              onChange={(e) => setForm({ ...form, empresa: e.target.value })}
              className="w-full border border-gray-200 rounded px-2.5 py-1.5 text-sm focus:ring-1 focus:ring-gray-400 outline-none"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-600 mb-0.5">Observações</label>
            <textarea
              value={form.observacoes}
              onChange={(e) => setForm({ ...form, observacoes: e.target.value })}
              className="w-full border border-gray-200 rounded px-2.5 py-1.5 text-sm focus:ring-1 focus:ring-gray-400 outline-none"
              rows="2"
            />
          </div>
        </div>
        <div className="flex gap-2 mt-4">
          <button
            onClick={onClose}
            className="flex-1 px-3 py-1.5 border border-gray-200 rounded text-xs hover:bg-gray-50"
          >
            Cancelar
          </button>
          <button
            onClick={handleSalvar}
            className="flex-1 px-3 py-1.5 bg-gray-800 text-white rounded text-xs hover:bg-gray-700"
          >
            {editando ? "Salvar" : "Adicionar"}
          </button>
        </div>
      </div>
    </div>
  );
}
