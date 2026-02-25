import { useState, useEffect } from "react";

const CATEGORIAS_FORNECEDOR = [
  { value: "produto", label: "Produtos" },
  { value: "servico", label: "Serviços" },
  { value: "utilidades", label: "Utilidades" },
  { value: "aluguel", label: "Aluguel" },
  { value: "outro", label: "Outro" },
];

const FORM_INICIAL = {
  nome: "",
  cnpj: "",
  cpf: "",
  email: "",
  telefone: "",
  contato: "",
  categoria: "outro",
  endereco: "",
  observacoes: "",
  ativo: true,
};

export function FornecedorModal({ aberto, editando, onClose, onSalvar }) {
  const [form, setForm] = useState(FORM_INICIAL);

  useEffect(() => {
    if (editando) {
      setForm({
        nome: editando.nome || "",
        cnpj: editando.cnpj || "",
        cpf: editando.cpf || "",
        email: editando.email || "",
        telefone: editando.telefone || "",
        contato: editando.contato || "",
        categoria: editando.categoria || "outro",
        endereco: editando.endereco || "",
        observacoes: editando.observacoes || "",
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
      <div className="bg-white rounded-lg border border-gray-200 max-w-md w-full p-4 max-h-[90vh] overflow-y-auto">
        <h3 className="text-sm font-semibold mb-3">
          {editando ? "Editar Fornecedor" : "Novo Fornecedor"}
        </h3>
        <div className="space-y-2.5">
          <div>
            <label className="block text-xs text-gray-600 mb-0.5">Nome *</label>
            <input type="text" value={form.nome} onChange={f("nome")} className={cls} placeholder="Nome do fornecedor ou empresa" />
          </div>
          <div>
            <label className="block text-xs text-gray-600 mb-0.5">Categoria</label>
            <select value={form.categoria} onChange={f("categoria")} className={cls}>
              {CATEGORIAS_FORNECEDOR.map((c) => (
                <option key={c.value} value={c.value}>{c.label}</option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs text-gray-600 mb-0.5">CNPJ</label>
              <input type="text" value={form.cnpj} onChange={f("cnpj")} className={cls} placeholder="00.000.000/0001-00" />
            </div>
            <div>
              <label className="block text-xs text-gray-600 mb-0.5">CPF</label>
              <input type="text" value={form.cpf} onChange={f("cpf")} className={cls} placeholder="000.000.000-00" />
            </div>
          </div>
          <div>
            <label className="block text-xs text-gray-600 mb-0.5">Contato / Responsável</label>
            <input type="text" value={form.contato} onChange={f("contato")} className={cls} />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs text-gray-600 mb-0.5">Telefone</label>
              <input type="text" value={form.telefone} onChange={f("telefone")} className={cls} />
            </div>
            <div>
              <label className="block text-xs text-gray-600 mb-0.5">Email</label>
              <input type="email" value={form.email} onChange={f("email")} className={cls} />
            </div>
          </div>
          <div>
            <label className="block text-xs text-gray-600 mb-0.5">Endereço</label>
            <input type="text" value={form.endereco} onChange={f("endereco")} className={cls} />
          </div>
          <div>
            <label className="block text-xs text-gray-600 mb-0.5">Observações</label>
            <textarea value={form.observacoes} onChange={f("observacoes")} className={cls} rows="2" />
          </div>
          <div className="flex items-center gap-2">
            <input
              id="forn-ativo"
              type="checkbox"
              checked={!!form.ativo}
              onChange={(e) => setForm({ ...form, ativo: e.target.checked })}
            />
            <label htmlFor="forn-ativo" className="text-xs text-gray-600">Ativo</label>
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
