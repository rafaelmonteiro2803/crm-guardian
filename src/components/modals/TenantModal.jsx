import { useState, useEffect, useRef } from "react";

const FORM_INICIAL = {
  nome: "",
  slogan: "",
  cor: "",
  logo_url: "",
  cnpj: "",
  razao_social: "",
  inscricao_municipal: "",
  codigo_servico_cnae: "",
  cpf_cnpj_cliente: "",
  endereco_cep: "",
  endereco_logradouro: "",
  endereco_numero: "",
  endereco_complemento: "",
  endereco_bairro: "",
  endereco_cidade: "",
  endereco_estado: "",
};

const ESTADOS_BR = [
  "AC","AL","AP","AM","BA","CE","DF","ES","GO","MA",
  "MT","MS","MG","PA","PB","PR","PE","PI","RJ","RN",
  "RS","RO","RR","SC","SP","SE","TO",
];

function formatCnpj(v) {
  const d = v.replace(/\D/g, "").slice(0, 14);
  if (d.length > 12) return d.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{1,2})/, "$1.$2.$3/$4-$5");
  if (d.length > 8)  return d.replace(/(\d{2})(\d{3})(\d{3})(\d{1,4})/, "$1.$2.$3/$4");
  if (d.length > 5)  return d.replace(/(\d{2})(\d{3})(\d{1,3})/, "$1.$2.$3");
  if (d.length > 2)  return d.replace(/(\d{2})(\d{1,3})/, "$1.$2");
  return d;
}

function formatCpfCnpj(v) {
  const d = v.replace(/\D/g, "");
  if (d.length > 11) return formatCnpj(v);
  // CPF
  const c = d.slice(0, 11);
  if (c.length > 9) return c.replace(/(\d{3})(\d{3})(\d{3})(\d{1,2})/, "$1.$2.$3-$4");
  if (c.length > 6) return c.replace(/(\d{3})(\d{3})(\d{1,3})/, "$1.$2.$3");
  if (c.length > 3) return c.replace(/(\d{3})(\d{1,3})/, "$1.$2");
  return c;
}

function formatCep(v) {
  const d = v.replace(/\D/g, "").slice(0, 8);
  if (d.length > 5) return d.replace(/(\d{5})(\d{1,3})/, "$1-$2");
  return d;
}

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
        cnpj: editando.cnpj || "",
        razao_social: editando.razao_social || "",
        inscricao_municipal: editando.inscricao_municipal || "",
        codigo_servico_cnae: editando.codigo_servico_cnae || "",
        cpf_cnpj_cliente: editando.cpf_cnpj_cliente || "",
        endereco_cep: editando.endereco_cep || "",
        endereco_logradouro: editando.endereco_logradouro || "",
        endereco_numero: editando.endereco_numero || "",
        endereco_complemento: editando.endereco_complemento || "",
        endereco_bairro: editando.endereco_bairro || "",
        endereco_cidade: editando.endereco_cidade || "",
        endereco_estado: editando.endereco_estado || "",
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
    if (!form.razao_social.trim()) return alert("Razão Social é obrigatória!");
    if (!form.cnpj.trim()) return alert("CNPJ é obrigatório!");
    if (!form.endereco_logradouro.trim()) return alert("Logradouro é obrigatório!");
    if (!form.endereco_numero.trim()) return alert("Número é obrigatório!");
    if (!form.endereco_bairro.trim()) return alert("Bairro é obrigatório!");
    if (!form.endereco_cidade.trim()) return alert("Cidade é obrigatória!");
    if (!form.endereco_estado.trim()) return alert("Estado é obrigatório!");
    if (!form.endereco_cep.trim()) return alert("CEP é obrigatório!");
    onSalvar(form, logoFile);
  };

  const field = (label, key, inputProps = {}) => (
    <div>
      <label className="block text-xs text-gray-600 mb-0.5">{label}</label>
      <input
        type="text"
        value={form[key]}
        onChange={(e) => setForm({ ...form, [key]: e.target.value })}
        className="w-full border border-gray-200 rounded px-2.5 py-1.5 text-sm focus:ring-1 focus:ring-gray-400 outline-none"
        {...inputProps}
      />
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg border border-gray-200 max-w-lg w-full p-4 max-h-[90vh] overflow-y-auto">
        <h3 className="text-sm font-semibold mb-3">
          {editando ? "Editar Tenant" : "Novo Tenant"}
        </h3>

        <div className="space-y-2.5">

          {/* Dados gerais */}
          <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide pt-1">Dados Gerais</p>

          {field("Nome *", "nome")}
          {field("Slogan", "slogan", { placeholder: "Frase de destaque do tenant..." })}

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
                placeholder="#ffffff"
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

          {/* Dados fiscais */}
          <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide pt-1">Dados Fiscais</p>

          <div>
            <label className="block text-xs text-gray-600 mb-0.5">CNPJ *</label>
            <input
              type="text"
              value={form.cnpj}
              onChange={(e) => setForm({ ...form, cnpj: formatCnpj(e.target.value) })}
              placeholder="00.000.000/0000-00"
              className="w-full border border-gray-200 rounded px-2.5 py-1.5 text-sm focus:ring-1 focus:ring-gray-400 outline-none"
            />
          </div>

          {field("Razão Social *", "razao_social")}
          {field("Inscrição Municipal", "inscricao_municipal")}
          {field("Código de Serviço (CNAE)", "codigo_servico_cnae", { placeholder: "Ex.: 9602-5/01" })}

          <div>
            <label className="block text-xs text-gray-600 mb-0.5">CPF / CNPJ do Cliente</label>
            <input
              type="text"
              value={form.cpf_cnpj_cliente}
              onChange={(e) => setForm({ ...form, cpf_cnpj_cliente: formatCpfCnpj(e.target.value) })}
              placeholder="000.000.000-00 ou 00.000.000/0000-00"
              className="w-full border border-gray-200 rounded px-2.5 py-1.5 text-sm focus:ring-1 focus:ring-gray-400 outline-none"
            />
          </div>

          {/* Endereço */}
          <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide pt-1">Endereço</p>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs text-gray-600 mb-0.5">CEP *</label>
              <input
                type="text"
                value={form.endereco_cep}
                onChange={(e) => setForm({ ...form, endereco_cep: formatCep(e.target.value) })}
                placeholder="00000-000"
                className="w-full border border-gray-200 rounded px-2.5 py-1.5 text-sm focus:ring-1 focus:ring-gray-400 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-600 mb-0.5">Número *</label>
              <input
                type="text"
                value={form.endereco_numero}
                onChange={(e) => setForm({ ...form, endereco_numero: e.target.value })}
                className="w-full border border-gray-200 rounded px-2.5 py-1.5 text-sm focus:ring-1 focus:ring-gray-400 outline-none"
              />
            </div>
          </div>

          {field("Logradouro *", "endereco_logradouro", { placeholder: "Rua, Avenida, Praça..." })}
          {field("Complemento", "endereco_complemento", { placeholder: "Apto, Sala, Bloco..." })}
          {field("Bairro *", "endereco_bairro")}

          <div className="grid grid-cols-2 gap-2">
            {field("Cidade *", "endereco_cidade")}
            <div>
              <label className="block text-xs text-gray-600 mb-0.5">Estado *</label>
              <select
                value={form.endereco_estado}
                onChange={(e) => setForm({ ...form, endereco_estado: e.target.value })}
                className="w-full border border-gray-200 rounded px-2.5 py-1.5 text-sm focus:ring-1 focus:ring-gray-400 outline-none bg-white"
              >
                <option value="">UF</option>
                {ESTADOS_BR.map((uf) => (
                  <option key={uf} value={uf}>{uf}</option>
                ))}
              </select>
            </div>
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
