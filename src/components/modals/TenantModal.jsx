import { useState, useEffect, useRef } from "react";

const FORM_INICIAL = {
  nome: "",
  slogan: "",
  cor: "",
  logo_url: "",
};

export function TenantModal({ aberto, editando, onClose, onSalvar }) {
  const [form, setForm] = useState(FORM_INICIAL);
  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (editando) {
      setForm({
        nome: editando.nome || "",
        slogan: editando.slogan || "",
        cor: editando.cor || "",
        logo_url: editando.logo_url || "",
      });
      setLogoPreview(editando.logo_url || null);
    } else {
      setForm(FORM_INICIAL);
      setLogoPreview(null);
    }
    setLogoFile(null);
  }, [editando, aberto]);

  if (!aberto) return null;

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setLogoFile(file);
    setLogoPreview(URL.createObjectURL(file));
  };

  const handleRemoverLogo = () => {
    setLogoFile(null);
    setLogoPreview(null);
    setForm({ ...form, logo_url: "" });
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSalvar = () => {
    if (!form.nome.trim()) return alert("Nome é obrigatório!");
    onSalvar(form, logoFile);
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg border border-gray-200 max-w-sm w-full p-4 max-h-[90vh] overflow-y-auto">
        <h3 className="text-sm font-semibold mb-3">
          {editando ? "Editar Tenant" : "Novo Tenant"}
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
            <label className="block text-xs text-gray-600 mb-0.5">Slogan</label>
            <input
              type="text"
              value={form.slogan}
              onChange={(e) => setForm({ ...form, slogan: e.target.value })}
              placeholder="Frase de destaque do tenant..."
              className="w-full border border-gray-200 rounded px-2.5 py-1.5 text-sm focus:ring-1 focus:ring-gray-400 outline-none"
            />
          </div>

          <div>
            <label className="block text-xs text-gray-600 mb-0.5">Cor do tema</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={form.cor || "#ffffff"}
                onChange={(e) => setForm({ ...form, cor: e.target.value })}
                className="h-8 w-12 border border-gray-200 rounded cursor-pointer p-0.5"
              />
              <input
                type="text"
                value={form.cor}
                onChange={(e) => setForm({ ...form, cor: e.target.value })}
                placeholder="#ffffff ou rgb(255, 255, 255)"
                className="flex-1 border border-gray-200 rounded px-2.5 py-1.5 text-sm focus:ring-1 focus:ring-gray-400 outline-none"
              />
              {form.cor && (
                <button
                  onClick={() => setForm({ ...form, cor: "" })}
                  className="text-gray-400 hover:text-gray-600 text-xs px-1"
                  title="Remover cor"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          <div>
            <label className="block text-xs text-gray-600 mb-0.5">Logo</label>
            {logoPreview && (
              <div className="mb-2 relative inline-block">
                <img
                  src={logoPreview}
                  alt="Preview do logo"
                  className="h-16 w-auto rounded border border-gray-200 object-contain bg-gray-50 p-1"
                />
                <button
                  onClick={handleRemoverLogo}
                  className="absolute -top-1.5 -right-1.5 bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-[10px] hover:bg-red-600"
                  title="Remover logo"
                >
                  ✕
                </button>
              </div>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              onChange={handleLogoChange}
              className="w-full text-xs text-gray-600 file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:text-xs file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200 cursor-pointer"
            />
            <p className="text-[10px] text-gray-400 mt-0.5">JPG, PNG, WebP ou GIF · máx. 5 MB</p>
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
