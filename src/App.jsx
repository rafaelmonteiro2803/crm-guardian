import React, { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const Icons = {
  User: ({ className = "w-4 h-4" }) => (<svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>),
  Plus: ({ className = "w-4 h-4" }) => (<svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>),
  Edit: ({ className = "w-3.5 h-3.5" }) => (<svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>),
  Trash: ({ className = "w-3.5 h-3.5" }) => (<svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>),
  Mail: ({ className = "w-3.5 h-3.5" }) => (<svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>),
  Phone: ({ className = "w-3.5 h-3.5" }) => (<svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>),
  Calendar: ({ className = "w-3 h-3" }) => (<svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>),
  LogOut: ({ className = "w-4 h-4" }) => (<svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>),
  BarChart: ({ className = "w-4 h-4" }) => (<svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>),
  TrendingUp: ({ className = "w-4 h-4" }) => (<svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>),
  ShoppingCart: ({ className = "w-4 h-4" }) => (<svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>),
  CreditCard: ({ className = "w-4 h-4" }) => (<svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>),
  DollarSign: ({ className = "w-4 h-4" }) => (<svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>),
  CheckCircle: ({ className = "w-4 h-4" }) => (<svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>),
  XCircle: ({ className = "w-4 h-4" }) => (<svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>),
  Clock: ({ className = "w-4 h-4" }) => (<svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>),
  AlertCircle: ({ className = "w-4 h-4" }) => (<svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>),
  ClipboardList: ({ className = "w-4 h-4" }) => (<svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>),
  Cog: ({ className = "w-4 h-4" }) => (<svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>),
  ArrowRight: ({ className = "w-4 h-4" }) => (<svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>),
};

function DataGrid({ columns, data, actions, emptyMessage, rowClassName }) {
  const [filters, setFilters] = useState({});
  const [sortCfg, setSortCfg] = useState({ key: null, dir: "asc" });
  const [page, setPage] = useState(1);
  const perPage = 10;
  useEffect(() => { setPage(1); }, [filters, data.length]);
  const filtered = data.filter((item) => columns.every((col) => { const f = filters[col.key]; if (!f) return true; const v = col.filterValue ? col.filterValue(item) : String(item[col.key] || ""); return v.toLowerCase().includes(f.toLowerCase()); }));
  const sorted = [...filtered].sort((a, b) => { if (!sortCfg.key) return 0; const col = columns.find((c) => c.key === sortCfg.key); const av = col?.sortValue ? col.sortValue(a) : (a[sortCfg.key] ?? ""); const bv = col?.sortValue ? col.sortValue(b) : (b[sortCfg.key] ?? ""); if (av < bv) return sortCfg.dir === "asc" ? -1 : 1; if (av > bv) return sortCfg.dir === "asc" ? 1 : -1; return 0; });
  const totalPages = Math.max(1, Math.ceil(sorted.length / perPage));
  const rows = sorted.slice((page - 1) * perPage, page * perPage);
  return (
    <div className="bg-white border border-gray-200 rounded overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-gray-50">
              {columns.map((col) => (<th key={col.key} className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer select-none hover:bg-gray-100" onClick={() => setSortCfg((p) => ({ key: col.key, dir: p.key === col.key && p.dir === "asc" ? "desc" : "asc" }))}><span className="inline-flex items-center gap-1">{col.label}{sortCfg.key === col.key && <span className="text-gray-400">{sortCfg.dir === "asc" ? "↑" : "↓"}</span>}</span></th>))}
              {actions && <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>}
            </tr>
            <tr className="border-b">
              {columns.map((col) => (<th key={col.key} className="px-3 py-1">{col.filterable !== false && <input type="text" placeholder="Filtrar..." value={filters[col.key] || ""} onChange={(e) => setFilters((p) => ({ ...p, [col.key]: e.target.value }))} className="w-full border border-gray-200 rounded px-2 py-1 text-xs font-normal text-gray-600 focus:ring-1 focus:ring-gray-300 outline-none" />}</th>))}
              {actions && <th className="px-3 py-1" />}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {rows.length === 0 ? (<tr><td colSpan={columns.length + (actions ? 1 : 0)} className="px-3 py-8 text-center text-gray-400">{emptyMessage || "Nenhum registro."}</td></tr>) : rows.map((item, i) => (<tr key={item.id || i} className={`hover:bg-gray-50 ${rowClassName ? rowClassName(item) : ""}`}>{columns.map((col) => (<td key={col.key} className={`px-3 py-2 ${col.className || ""}`}>{col.render ? col.render(item) : (item[col.key] ?? "-")}</td>))}{actions && <td className="px-3 py-2 whitespace-nowrap">{actions(item)}</td>}</tr>))}
          </tbody>
        </table>
      </div>
      <div className="flex items-center justify-between px-3 py-1.5 border-t bg-gray-50 text-xs text-gray-500">
        <span>{sorted.length} registro(s)</span>
        <div className="flex items-center gap-1">
          <button onClick={() => setPage(1)} disabled={page <= 1} className="px-1.5 py-0.5 rounded hover:bg-gray-200 disabled:opacity-30">«</button>
          <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page <= 1} className="px-1.5 py-0.5 rounded hover:bg-gray-200 disabled:opacity-30">‹</button>
          <span className="px-2">{page}/{totalPages}</span>
          <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page >= totalPages} className="px-1.5 py-0.5 rounded hover:bg-gray-200 disabled:opacity-30">›</button>
          <button onClick={() => setPage(totalPages)} disabled={page >= totalPages} className="px-1.5 py-0.5 rounded hover:bg-gray-200 disabled:opacity-30">»</button>
        </div>
      </div>
    </div>
  );
}

function App() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tenantId, setTenantId] = useState(null);
  const [tenantNome, setTenantNome] = useState("");
  const [clientes, setClientes] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [oportunidades, setOportunidades] = useState([]);
  const [vendas, setVendas] = useState([]);
  const [titulos, setTitulos] = useState([]);
  const [viewMode, setViewMode] = useState("dashboard");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [selectedTenantId, setSelectedTenantId] = useState("");
  const [tenantsList, setTenantsList] = useState([]);
  const [isSignUp, setIsSignUp] = useState(false);
  const [authMessage, setAuthMessage] = useState("");
  const [modalCliente, setModalCliente] = useState(false);
  const [modalOportunidade, setModalOportunidade] = useState(false);
  const [modalVenda, setModalVenda] = useState(false);
  const [modalTitulo, setModalTitulo] = useState(false);
  const [editandoCliente, setEditandoCliente] = useState(null);
  const [editandoOportunidade, setEditandoOportunidade] = useState(null);
  const [editandoVenda, setEditandoVenda] = useState(null);
  const [editandoTitulo, setEditandoTitulo] = useState(null);
  const [produtos, setProdutos] = useState([]);
  const [modalProduto, setModalProduto] = useState(false);
  const [modalUsuario, setModalUsuario] = useState(false);
  const [editandoProduto, setEditandoProduto] = useState(null);
  const [editandoUsuario, setEditandoUsuario] = useState(null);
  const [formCliente, setFormCliente] = useState({ nome: "", cpf: "", email: "", telefone: "", empresa: "", observacoes: "" });
  const [formOportunidade, setFormOportunidade] = useState({ titulo: "", cliente_id: "", produto_id: "", valor: "", estagio: "prospecção", data_inicio: new Date().toISOString().split("T")[0] });
  const [formVenda, setFormVenda] = useState({ cliente_id: "", descricao: "", valor: "", data_venda: new Date().toISOString().split("T")[0], forma_pagamento: "à vista", observacoes: "", desconto: "", itens: [] });
  const [formTitulo, setFormTitulo] = useState({ venda_id: "", descricao: "", valor: "", data_emissao: new Date().toISOString().split("T")[0], data_vencimento: "", status: "pendente" });
  const [formProduto, setFormProduto] = useState({ nome: "", tipo: "produto", descricao: "", categoria: "", preco_base: "", custo: "", unidade_medida: "", ativo: true, observacoes: "" });
  const [formUsuario, setFormUsuario] = useState({ email: "", role: "member" });
  const [tecnicos, setTecnicos] = useState([]);
  const [ordensServico, setOrdensServico] = useState([]);
  const [modalTecnico, setModalTecnico] = useState(false);
  const [modalEncaminhar, setModalEncaminhar] = useState(false);
  const [editandoTecnico, setEditandoTecnico] = useState(null);
  const [osEncaminhar, setOsEncaminhar] = useState(null);
  const [formTecnico, setFormTecnico] = useState({ nome: "", cpf: "", email: "", telefone: "", especialidade: "", endereco: "", observacoes: "", ativo: true });
  const [formEncaminhar, setFormEncaminhar] = useState({ tecnico_id: "", comissao_percentual: "", comissao_valor: "" });
  const [comissoes, setComissoes] = useState([]);
  const [modalAgendarComissao, setModalAgendarComissao] = useState(false);
  const [comissaoAgendar, setComissaoAgendar] = useState(null);
  const [formAgendarComissao, setFormAgendarComissao] = useState({ data_agendamento: new Date().toISOString().split("T")[0], observacoes: "" });
  const estagios = ["prospecção", "qualificação", "proposta", "negociação", "fechado", "cancelado"];

  useEffect(() => { supabase.auth.getSession().then(({ data: { session } }) => { setSession(session); setLoading(false); }); const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => setSession(session)); return () => subscription.unsubscribe(); }, []);

  useEffect(() => { carregarTenants(); }, []);
  const carregarTenants = async () => { const { data } = await supabase.rpc("get_all_tenants"); if (data) setTenantsList(data); };

  useEffect(() => {
    if (session) {
      carregarTenant();
    } else {
      setTenantId(null);
      setTenantNome("");
    }
  }, [session]);

  const carregarTenant = async () => {
    if (selectedTenantId) {
      const { data } = await supabase
        .from("tenant_members")
        .select("tenant_id, tenants(id, nome)")
        .eq("user_id", session.user.id)
        .eq("tenant_id", selectedTenantId)
        .single();
      if (data) {
        setTenantId(data.tenant_id);
        setTenantNome(data.tenants?.nome || "");
      } else {
        setAuthMessage("Erro: Você não tem acesso a este tenant.");
        await supabase.auth.signOut();
      }
    } else {
      const { data } = await supabase
        .from("tenant_members")
        .select("tenant_id, tenants(id, nome)")
        .eq("user_id", session.user.id)
        .limit(1)
        .single();
      if (data) {
        setTenantId(data.tenant_id);
        setTenantNome(data.tenants?.nome || "");
      }
    }
  };

  useEffect(() => { if (session && tenantId) carregarTodosDados(); }, [session, tenantId]);

  const carregarTodosDados = async () => { await Promise.all([carregarClientes(), carregarUsuarios(), carregarOportunidades(), carregarVendas(), carregarTitulos(), carregarProdutos(), carregarTecnicos(), carregarOrdensServico(), carregarComissoes()]); };
  const carregarClientes = async () => { const { data } = await supabase.from("clientes").select("*").eq("tenant_id", tenantId).order("data_cadastro", { ascending: false }); if (data) setClientes(data); };
  const carregarUsuarios = async () => {
    const { data, error } = await supabase.rpc("get_tenant_members_with_email", { p_tenant_id: tenantId });
    if (!error && data) {
      setUsuarios(data);
      return;
    }
    const { data: fallback } = await supabase.from("tenant_members").select("id, user_id, role, created_at").eq("tenant_id", tenantId).order("created_at", { ascending: false });
    if (fallback) setUsuarios(fallback);
  };
  const carregarOportunidades = async () => { const { data } = await supabase.from("oportunidades").select("*").eq("tenant_id", tenantId).order("created_at", { ascending: false }); if (data) setOportunidades(data); };
  const carregarVendas = async () => { const { data } = await supabase.from("vendas").select("*").eq("tenant_id", tenantId).order("data_venda", { ascending: false }); if (data) setVendas(data); };
  const carregarTitulos = async () => { const { data } = await supabase.from("titulos").select("*").eq("tenant_id", tenantId).order("data_vencimento", { ascending: true }); if (data) setTitulos(data); };
  const carregarProdutos = async () => { const { data } = await supabase.from("produtos").select("*").eq("tenant_id", tenantId).order("created_at", { ascending: false }); if (data) setProdutos(data); };
  const carregarTecnicos = async () => { const { data } = await supabase.from("tecnicos").select("*").eq("tenant_id", tenantId).order("created_at", { ascending: false }); if (data) setTecnicos(data); };
  const carregarOrdensServico = async () => { const { data } = await supabase.from("ordens_servico").select("*").eq("tenant_id", tenantId).order("created_at", { ascending: false }); if (data) setOrdensServico(data); };
  const carregarComissoes = async () => { const { data } = await supabase.from("comissoes").select("*").eq("tenant_id", tenantId).order("created_at", { ascending: false }); if (data) setComissoes(data); };

  const handleSignUp = async (e) => { e.preventDefault(); setAuthMessage(""); const { error } = await supabase.auth.signUp({ email, password }); setAuthMessage(error ? "Erro: " + error.message : "Conta criada! Verifique seu email."); };
  const handleSignIn = async (e) => { e.preventDefault(); setAuthMessage(""); const { error } = await supabase.auth.signInWithPassword({ email, password }); if (error) setAuthMessage("Erro: " + error.message); };
  const handleSignOut = async () => { await supabase.auth.signOut(); setClientes([]); setUsuarios([]); setOportunidades([]); setVendas([]); setTitulos([]); setProdutos([]); setTecnicos([]); setOrdensServico([]); setComissoes([]); setTenantId(null); setTenantNome(""); setSelectedTenantId(""); };

  const salvarCliente = async () => {
    if (!formCliente.nome.trim()) return alert("Nome é obrigatório!");
    if (editandoCliente) { const { data } = await supabase.from("clientes").update(formCliente).eq("id", editandoCliente.id).select(); if (data) setClientes(clientes.map((c) => (c.id === editandoCliente.id ? data[0] : c))); }
    else { const { data } = await supabase.from("clientes").insert([{ ...formCliente, user_id: session.user.id, tenant_id: tenantId }]).select(); if (data) setClientes([data[0], ...clientes]); }
    fecharModalCliente();
  };
  const excluirCliente = async (id) => { if (!confirm("Excluir cliente?")) return; await supabase.from("clientes").delete().eq("id", id); setClientes(clientes.filter((c) => c.id !== id)); };

  const salvarOportunidade = async () => {
    if (!formOportunidade.titulo.trim()) return alert("Título é obrigatório!");
    const payload = { ...formOportunidade, produto_id: formOportunidade.produto_id || null };
    if (editandoOportunidade) { const { data } = await supabase.from("oportunidades").update(payload).eq("id", editandoOportunidade.id).select(); if (data) setOportunidades(oportunidades.map((o) => (o.id === editandoOportunidade.id ? data[0] : o))); }
    else { const { data } = await supabase.from("oportunidades").insert([{ ...payload, user_id: session.user.id, tenant_id: tenantId }]).select(); if (data) setOportunidades([data[0], ...oportunidades]); }
    fecharModalOportunidade();
  };
  const excluirOportunidade = async (id) => { if (!confirm("Excluir oportunidade?")) return; await supabase.from("oportunidades").delete().eq("id", id); setOportunidades(oportunidades.filter((o) => o.id !== id)); };
  const moverOportunidade = async (id, estagio) => { const { data } = await supabase.from("oportunidades").update({ estagio }).eq("id", id).select(); if (data) setOportunidades(oportunidades.map((o) => (o.id === id ? data[0] : o))); };

  const calcularTotalVenda = (itens, desconto) => { const sub = itens.reduce((s, i) => s + parseFloat(i.valor_unitario || 0) * parseFloat(i.quantidade || 1), 0); return Math.max(sub - parseFloat(desconto || 0), 0); };

  const salvarVenda = async () => {
    if (!formVenda.descricao.trim()) return alert("Descrição é obrigatória!");
    const valorTotal = formVenda.itens.length > 0 ? calcularTotalVenda(formVenda.itens, formVenda.desconto) : parseFloat(formVenda.valor || 0);
    const payload = { cliente_id: formVenda.cliente_id, descricao: formVenda.descricao, valor: valorTotal, data_venda: formVenda.data_venda, forma_pagamento: formVenda.forma_pagamento, observacoes: formVenda.observacoes, desconto: formVenda.desconto === "" ? 0 : parseFloat(formVenda.desconto), itens: formVenda.itens };
    if (editandoVenda) { const { data } = await supabase.from("vendas").update(payload).eq("id", editandoVenda.id).select(); if (data) setVendas(vendas.map((v) => (v.id === editandoVenda.id ? data[0] : v))); }
    else {
      const { data } = await supabase.from("vendas").insert([{ ...payload, user_id: session.user.id, tenant_id: tenantId }]).select();
      if (data) {
        setVendas([data[0], ...vendas]);
        const novoTitulo = { venda_id: data[0].id, descricao: data[0].descricao, valor: data[0].valor, data_emissao: new Date().toISOString().split("T")[0], data_vencimento: data[0].data_venda || new Date().toISOString().split("T")[0], status: "pendente", user_id: session.user.id, tenant_id: tenantId };
        const { data: tituloData } = await supabase.from("titulos").insert([novoTitulo]).select(); if (tituloData) setTitulos([...titulos, tituloData[0]]);
        const novaOS = { numero_os: "OS" + new Date().getFullYear() + "-" + String(Date.now()).slice(-6), venda_id: data[0].id, cliente_id: data[0].cliente_id, descricao: data[0].descricao, itens: data[0].itens || [], valor_total: data[0].valor, status: "aguardando_atendimento", data_abertura: data[0].data_venda || new Date().toISOString().split("T")[0], user_id: session.user.id, tenant_id: tenantId };
        const { data: osData } = await supabase.from("ordens_servico").insert([novaOS]).select(); if (osData) setOrdensServico((prev) => [osData[0], ...prev]);
      }
    }
    fecharModalVenda();
  };
  const excluirVenda = async (id) => { if (!confirm("Excluir venda?")) return; await supabase.from("vendas").delete().eq("id", id); setVendas(vendas.filter((v) => v.id !== id)); };

  const salvarTitulo = async () => {
    if (!formTitulo.descricao.trim()) return alert("Descrição é obrigatória!");
    const dadosTitulo = { ...formTitulo, user_id: session.user.id, tenant_id: tenantId, data_pagamento: formTitulo.status === "pago" ? new Date().toISOString().split("T")[0] : null };
    let novosTitulos = [...titulos];
    if (editandoTitulo) { const { data } = await supabase.from("titulos").update(dadosTitulo).eq("id", editandoTitulo.id).select(); if (data) novosTitulos = novosTitulos.map((t) => (t.id === editandoTitulo.id ? data[0] : t)); }
    else { const { data } = await supabase.from("titulos").insert([dadosTitulo]).select(); if (data) novosTitulos = [...novosTitulos, data[0]]; }
    if (formTitulo.status === "pago" && formTitulo.venda_id) {
      const vendaRel = vendas.find((v) => v.id === formTitulo.venda_id);
      if (vendaRel) { const totalPago = novosTitulos.filter((t) => t.venda_id === vendaRel.id && t.status === "pago").reduce((a, t) => a + Number(t.valor), 0); const saldo = Number(vendaRel.valor) - totalPago;
        if (saldo > 0.01) { const ts = { venda_id: vendaRel.id, descricao: `${vendaRel.descricao} (saldo)`, valor: saldo.toFixed(2), data_emissao: new Date().toISOString().split("T")[0], data_vencimento: formTitulo.data_vencimento || new Date().toISOString().split("T")[0], status: "pendente", user_id: session.user.id, tenant_id: tenantId }; const { data: sd } = await supabase.from("titulos").insert([ts]).select(); if (sd) novosTitulos = [...novosTitulos, sd[0]]; } }
    }
    setTitulos(novosTitulos); fecharModalTitulo();
  };
  const excluirTitulo = async (id) => { if (!confirm("Excluir título?")) return; await supabase.from("titulos").delete().eq("id", id); setTitulos(titulos.filter((t) => t.id !== id)); };

  const marcarComoPago = async (id) => {
    const { data } = await supabase.from("titulos").update({ status: "pago", data_pagamento: new Date().toISOString().split("T")[0] }).eq("id", id).select();
    if (data) {
      let nt = titulos.map((t) => (t.id === id ? data[0] : t)); const tp = data[0];
      if (tp.venda_id) { const vr = vendas.find((v) => v.id === tp.venda_id);
        if (vr) { const totalP = nt.filter((t) => t.venda_id === vr.id && t.status === "pago").reduce((a, t) => a + Number(t.valor), 0); const saldo = Number(vr.valor) - totalP;
          if (saldo > 0.01) { const ts = { venda_id: vr.id, descricao: `${vr.descricao} (saldo)`, valor: saldo.toFixed(2), data_emissao: new Date().toISOString().split("T")[0], data_vencimento: tp.data_vencimento || new Date().toISOString().split("T")[0], status: "pendente", user_id: session.user.id, tenant_id: tenantId }; const { data: sd } = await supabase.from("titulos").insert([ts]).select(); if (sd) nt = [...nt, sd[0]]; } } }
      setTitulos(nt);
    }
  };

  const salvarProduto = async () => {
    if (!formProduto.nome.trim()) return alert("Nome é obrigatório!");
    const payload = { ...formProduto, preco_base: formProduto.preco_base === "" ? 0 : parseFloat(formProduto.preco_base), custo: formProduto.custo === "" ? 0 : parseFloat(formProduto.custo), user_id: session.user.id, tenant_id: tenantId };
    if (editandoProduto) { const { data } = await supabase.from("produtos").update(payload).eq("id", editandoProduto.id).select(); if (data) setProdutos(produtos.map((p) => (p.id === editandoProduto.id ? data[0] : p))); }
    else { const { data } = await supabase.from("produtos").insert([payload]).select(); if (data) setProdutos([data[0], ...produtos]); }
    fecharModalProduto();
  };
  const excluirProduto = async (id) => { if (!confirm("Excluir produto?")) return; await supabase.from("produtos").delete().eq("id", id); setProdutos(produtos.filter((p) => p.id !== id)); };

  const salvarTecnico = async () => {
    if (!formTecnico.nome.trim()) return alert("Nome é obrigatório!");
    const payload = { ...formTecnico, user_id: session.user.id, tenant_id: tenantId };
    if (editandoTecnico) { const { data } = await supabase.from("tecnicos").update(payload).eq("id", editandoTecnico.id).select(); if (data) setTecnicos(tecnicos.map((t) => (t.id === editandoTecnico.id ? data[0] : t))); }
    else { const { data } = await supabase.from("tecnicos").insert([payload]).select(); if (data) setTecnicos([data[0], ...tecnicos]); }
    fecharModalTecnico();
  };
  const excluirTecnico = async (id) => { if (!confirm("Excluir técnico?")) return; await supabase.from("tecnicos").delete().eq("id", id); setTecnicos(tecnicos.filter((t) => t.id !== id)); };

  const encaminharParaTecnico = async () => {
    if (!formEncaminhar.tecnico_id) return alert("Selecione um técnico!");
    const payload = { tecnico_id: formEncaminhar.tecnico_id, comissao_percentual: parseFloat(formEncaminhar.comissao_percentual || 0), comissao_valor: parseFloat(formEncaminhar.comissao_valor || 0), status: "em_atendimento", data_atribuicao: new Date().toISOString() };
    const { data } = await supabase.from("ordens_servico").update(payload).eq("id", osEncaminhar.id).select();
    if (data) setOrdensServico(ordensServico.map((o) => (o.id === osEncaminhar.id ? data[0] : o)));
    fecharModalEncaminhar();
  };
  const concluirOrdemServico = async (id) => {
    if (!confirm("Marcar atendimento como concluído?")) return;
    const { data } = await supabase.from("ordens_servico").update({ status: "atendimento_concluido", data_conclusao: new Date().toISOString() }).eq("id", id).select();
    if (data) {
      setOrdensServico(ordensServico.map((o) => (o.id === id ? data[0] : o)));
      const os = data[0];
      if (os.tecnico_id && parseFloat(os.comissao_valor || 0) > 0) {
        const novaComissao = { ordem_servico_id: os.id, tecnico_id: os.tecnico_id, valor: os.comissao_valor, percentual: os.comissao_percentual, status: "pendente", user_id: session.user.id, tenant_id: tenantId };
        const { data: comissaoData } = await supabase.from("comissoes").insert([novaComissao]).select();
        if (comissaoData) setComissoes((prev) => [comissaoData[0], ...prev]);
      }
    }
  };
  const excluirOrdemServico = async (id) => { if (!confirm("Excluir ordem de serviço?")) return; await supabase.from("ordens_servico").delete().eq("id", id); setOrdensServico(ordensServico.filter((o) => o.id !== id)); };

  const agendarComissao = async () => {
    if (!formAgendarComissao.data_agendamento) return alert("Informe a data de agendamento!");
    const { data } = await supabase.from("comissoes").update({ status: "agendado", data_agendamento: formAgendarComissao.data_agendamento, observacoes: formAgendarComissao.observacoes }).eq("id", comissaoAgendar.id).select();
    if (data) setComissoes(comissoes.map((c) => (c.id === comissaoAgendar.id ? data[0] : c)));
    fecharModalAgendarComissao();
  };
  const pagarComissao = async (id) => {
    if (!confirm("Confirmar pagamento desta comissão?")) return;
    const { data } = await supabase.from("comissoes").update({ status: "pago", data_pagamento: new Date().toISOString().split("T")[0] }).eq("id", id).select();
    if (data) setComissoes(comissoes.map((c) => (c.id === id ? data[0] : c)));
  };
  const excluirComissao = async (id) => { if (!confirm("Excluir comissão?")) return; await supabase.from("comissoes").delete().eq("id", id); setComissoes(comissoes.filter((c) => c.id !== id)); };

  const salvarUsuario = async () => {
    if (!formUsuario.email.trim()) return alert("Email é obrigatório!");
    if (editandoUsuario) {
      const { data, error } = await supabase.rpc("update_tenant_member_role", { p_member_id: editandoUsuario.id, p_tenant_id: tenantId, p_role: formUsuario.role || "member" });
      if (error) return alert(`Erro ao atualizar membro: ${error.message}`);
      if (data && data.length > 0) { setUsuarios(usuarios.map((u) => (u.id === editandoUsuario.id ? data[0] : u))); } else { await carregarUsuarios(); }
    } else {
      const { data, error } = await supabase.rpc("add_tenant_member_by_email", { p_tenant_id: tenantId, p_email: formUsuario.email.trim(), p_role: formUsuario.role || "member" });
      if (error) return alert(`Erro ao adicionar membro: ${error.message}`);
      if (data && data.length > 0) { setUsuarios([data[0], ...usuarios]); } else { await carregarUsuarios(); }
    }
    fecharModalUsuario();
  };
  const excluirUsuario = async (id) => {
    if (!confirm("Excluir usuário?")) return;
    const { error } = await supabase.rpc("remove_tenant_member", { p_member_id: id, p_tenant_id: tenantId });
    if (error) return alert(`Erro ao remover membro: ${error.message}`);
    setUsuarios(usuarios.filter((u) => u.id !== id));
  };

  const abrirModalCliente = (c = null) => { if (c) { setEditandoCliente(c); setFormCliente({ nome: c.nome, cpf: c.cpf || "", email: c.email || "", telefone: c.telefone || "", empresa: c.empresa || "", observacoes: c.observacoes || "" }); } setModalCliente(true); };
  const fecharModalCliente = () => { setModalCliente(false); setEditandoCliente(null); setFormCliente({ nome: "", cpf: "", email: "", telefone: "", empresa: "", observacoes: "" }); };
  const abrirModalOportunidade = (o = null) => { if (o) { setEditandoOportunidade(o); setFormOportunidade({ titulo: o.titulo, cliente_id: o.cliente_id, produto_id: o.produto_id || "", valor: o.valor.toString(), estagio: o.estagio, data_inicio: o.data_inicio }); } setModalOportunidade(true); };
  const fecharModalOportunidade = () => { setModalOportunidade(false); setEditandoOportunidade(null); setFormOportunidade({ titulo: "", cliente_id: "", produto_id: "", valor: "", estagio: "prospecção", data_inicio: new Date().toISOString().split("T")[0] }); };
  const abrirModalVenda = (v = null) => { if (v) { setEditandoVenda(v); setFormVenda({ cliente_id: v.cliente_id, descricao: v.descricao, valor: v.valor.toString(), data_venda: v.data_venda, forma_pagamento: v.forma_pagamento, observacoes: v.observacoes || "", desconto: (v.desconto ?? 0).toString(), itens: v.itens || [] }); } setModalVenda(true); };
  const fecharModalVenda = () => { setModalVenda(false); setEditandoVenda(null); setFormVenda({ cliente_id: "", descricao: "", valor: "", data_venda: new Date().toISOString().split("T")[0], forma_pagamento: "à vista", observacoes: "", desconto: "", itens: [] }); };
  const abrirModalTitulo = (t = null) => { if (t) { setEditandoTitulo(t); setFormTitulo({ venda_id: t.venda_id || "", descricao: t.descricao, valor: t.valor.toString(), data_emissao: t.data_emissao, data_vencimento: t.data_vencimento, status: t.status }); } setModalTitulo(true); };
  const fecharModalTitulo = () => { setModalTitulo(false); setEditandoTitulo(null); setFormTitulo({ venda_id: "", descricao: "", valor: "", data_emissao: new Date().toISOString().split("T")[0], data_vencimento: "", status: "pendente" }); };
  const abrirModalProduto = (p = null) => { if (p) { setEditandoProduto(p); setFormProduto({ nome: p.nome || "", tipo: p.tipo || "produto", descricao: p.descricao || "", categoria: p.categoria || "", preco_base: (p.preco_base ?? 0).toString(), custo: (p.custo ?? 0).toString(), unidade_medida: p.unidade_medida || "", ativo: p.ativo ?? true, observacoes: p.observacoes || "" }); } setModalProduto(true); };
  const fecharModalProduto = () => { setModalProduto(false); setEditandoProduto(null); setFormProduto({ nome: "", tipo: "produto", descricao: "", categoria: "", preco_base: "", custo: "", unidade_medida: "", ativo: true, observacoes: "" }); };

  const abrirModalUsuario = (u = null) => { if (u) { setEditandoUsuario(u); setFormUsuario({ email: u.email || "", role: u.role || "member" }); } setModalUsuario(true); };
  const fecharModalUsuario = () => { setModalUsuario(false); setEditandoUsuario(null); setFormUsuario({ email: "", role: "member" }); };

  const abrirModalTecnico = (t = null) => { if (t) { setEditandoTecnico(t); setFormTecnico({ nome: t.nome || "", cpf: t.cpf || "", email: t.email || "", telefone: t.telefone || "", especialidade: t.especialidade || "", endereco: t.endereco || "", observacoes: t.observacoes || "", ativo: t.ativo ?? true }); } setModalTecnico(true); };
  const fecharModalTecnico = () => { setModalTecnico(false); setEditandoTecnico(null); setFormTecnico({ nome: "", cpf: "", email: "", telefone: "", especialidade: "", endereco: "", observacoes: "", ativo: true }); };
  const abrirModalEncaminhar = (os) => { setOsEncaminhar(os); setFormEncaminhar({ tecnico_id: os.tecnico_id || "", comissao_percentual: os.comissao_percentual?.toString() || "", comissao_valor: os.comissao_valor?.toString() || "" }); setModalEncaminhar(true); };
  const fecharModalEncaminhar = () => { setModalEncaminhar(false); setOsEncaminhar(null); setFormEncaminhar({ tecnico_id: "", comissao_percentual: "", comissao_valor: "" }); };

  const abrirModalAgendarComissao = (c) => { setComissaoAgendar(c); setFormAgendarComissao({ data_agendamento: c.data_agendamento || new Date().toISOString().split("T")[0], observacoes: c.observacoes || "" }); setModalAgendarComissao(true); };
  const fecharModalAgendarComissao = () => { setModalAgendarComissao(false); setComissaoAgendar(null); setFormAgendarComissao({ data_agendamento: new Date().toISOString().split("T")[0], observacoes: "" }); };

  const getClienteNome = (id) => clientes.find((c) => c.id === id)?.nome || "N/A";
  const getTecnicoNome = (id) => tecnicos.find((t) => t.id === id)?.nome || "N/A";
  const getProdutoNome = (id) => produtos.find((p) => p.id === id)?.nome || null;
  const fmtBRL = (v) => parseFloat(v || 0).toLocaleString("pt-BR", { minimumFractionDigits: 2 });

  const calcularIndicadores = () => {
    const abertas = oportunidades.filter((o) => !["fechado", "cancelado"].includes(o.estagio));
    const totalOp = abertas.reduce((s, o) => s + parseFloat(o.valor || 0), 0);
    const fechadas = oportunidades.filter((o) => o.estagio === "fechado");
    const taxa = oportunidades.length > 0 ? ((fechadas.length / oportunidades.length) * 100).toFixed(1) : 0;
    const totalV = vendas.reduce((s, v) => s + parseFloat(v.valor || 0), 0);
    const vm = vendas.filter((v) => { const d = new Date(v.data_venda); const h = new Date(); return d.getMonth() === h.getMonth() && d.getFullYear() === h.getFullYear(); });
    const totalVM = vm.reduce((s, v) => s + parseFloat(v.valor || 0), 0);
    const pend = titulos.filter((t) => t.status === "pendente");
    const pagos = titulos.filter((t) => t.status === "pago");
    const venc = pend.filter((t) => new Date(t.data_vencimento) < new Date());
    return { totalOportunidades: totalOp, numOportunidades: abertas.length, taxaConversao: taxa, totalVendas: totalV, numVendas: vendas.length, totalVendasMes: totalVM, numVendasMes: vm.length, totalReceber: pend.reduce((s, t) => s + parseFloat(t.valor || 0), 0), totalRecebido: pagos.reduce((s, t) => s + parseFloat(t.valor || 0), 0), totalVencido: venc.reduce((s, t) => s + parseFloat(t.valor || 0), 0), numPendentes: pend.length, numPagos: pagos.length, numVencidos: venc.length };
  };

  const calcularVendasPorMes = () => {
    const meses = {}; const nm = ["Jan","Fev","Mar","Abr","Mai","Jun","Jul","Ago","Set","Out","Nov","Dez"];
    vendas.forEach((v) => { const d = new Date(v.data_venda); const k = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}`; const l = `${nm[d.getMonth()]}/${d.getFullYear()}`; if (!meses[k]) meses[k] = { label: l, total: 0, count: 0 }; meses[k].total += parseFloat(v.valor || 0); meses[k].count += 1; });
    return Object.entries(meses).sort(([a],[b]) => a.localeCompare(b)).slice(-12).map(([,v]) => v);
  };

  const calcularFaturamentoMensal = () => {
    const meses = {}; const nm = ["Jan","Fev","Mar","Abr","Mai","Jun","Jul","Ago","Set","Out","Nov","Dez"];
    vendas.forEach((v) => {
      const d = new Date(v.data_venda); const k = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}`;
      const l = `${nm[d.getMonth()]}/${d.getFullYear()}`; if (!meses[k]) meses[k] = { label: l, pago: 0, pendente: 0 };
      const tv = titulos.filter((t) => t.venda_id === v.id);
      meses[k].pago += tv.filter((t) => t.status === "pago").reduce((s, t) => s + parseFloat(t.valor || 0), 0);
      meses[k].pendente += tv.filter((t) => t.status === "pendente").reduce((s, t) => s + parseFloat(t.valor || 0), 0);
    });
    return Object.entries(meses).sort(([a],[b]) => a.localeCompare(b)).slice(-12).map(([,v]) => v);
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><span className="text-gray-400 text-sm">Carregando...</span></div>;
  if (session && !tenantId) return <div className="min-h-screen flex items-center justify-center"><span className="text-gray-400 text-sm">Carregando dados do tenant...</span></div>;

  if (!session) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white border border-gray-200 rounded-lg max-w-sm w-full p-6">
        <h1 className="text-lg font-semibold text-center text-gray-800 mb-1">CRM GuardIAn</h1>
        <p className="text-center text-gray-400 text-xs mb-5">Sistema de Gestão</p>
        <form onSubmit={isSignUp ? handleSignUp : handleSignIn} className="space-y-3">
          <div><label className="block text-xs font-medium text-gray-600 mb-1">Tenant</label><select value={selectedTenantId} onChange={(e) => setSelectedTenantId(e.target.value)} className="w-full border border-gray-200 rounded px-2.5 py-1.5 text-sm focus:ring-1 focus:ring-gray-400 outline-none" required><option value="">Selecione o tenant...</option>{tenantsList.map((t) => <option key={t.id} value={t.id}>{t.nome}</option>)}</select></div>
          <div><label className="block text-xs font-medium text-gray-600 mb-1">Email</label><input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full border border-gray-200 rounded px-2.5 py-1.5 text-sm focus:ring-1 focus:ring-gray-400 outline-none" required /></div>
          <div><label className="block text-xs font-medium text-gray-600 mb-1">Senha</label><input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full border border-gray-200 rounded px-2.5 py-1.5 text-sm focus:ring-1 focus:ring-gray-400 outline-none" required /></div>
          {authMessage && <div className={`p-2 rounded text-xs ${authMessage.includes("Erro") ? "bg-red-50 text-red-600" : "bg-green-50 text-green-600"}`}>{authMessage}</div>}
          <button type="submit" className="w-full bg-gray-800 hover:bg-gray-700 text-white py-1.5 rounded text-sm font-medium">{isSignUp ? "Criar Conta" : "Entrar"}</button>
        </form>
        <button onClick={() => { setIsSignUp(!isSignUp); setAuthMessage(""); }} className="w-full mt-3 text-gray-500 text-xs hover:text-gray-700">{isSignUp ? "Já tem conta? Faça login" : "Não tem conta? Criar uma"}</button>
      </div>
    </div>
  );

  const ind = calcularIndicadores();
  const navItems = [
    { key: "dashboard", icon: <Icons.BarChart />, label: "Dashboard" },
    { key: "clientes", icon: <Icons.User />, label: "Clientes", count: clientes.length },
    { key: "usuarios", icon: <Icons.User />, label: "Usuários", count: usuarios.length },
    { key: "produtos", icon: <Icons.ShoppingCart />, label: "Produtos", count: produtos.length },
    { key: "pipeline", icon: <Icons.TrendingUp />, label: "Pipeline", count: oportunidades.length },
    { key: "vendas", icon: <Icons.ShoppingCart />, label: "Vendas", count: vendas.length },
    { key: "financeiro", icon: <Icons.CreditCard />, label: "Financeiro", count: titulos.length },
    { key: "tecnicos", icon: <Icons.Cog />, label: "Técnicos", count: tecnicos.length },
    { key: "ordens_servico", icon: <Icons.ClipboardList />, label: "Ordens de Serviço", count: ordensServico.length },
    { key: "comissoes", icon: <Icons.DollarSign />, label: "Comissões", count: comissoes.filter((c) => c.status !== "pago").length },
  ];
  const actBtns = (onEdit, onDel) => (<div className="flex items-center gap-1"><button onClick={onEdit} className="text-gray-500 hover:text-gray-700 hover:bg-gray-100 p-1 rounded"><Icons.Edit /></button><button onClick={onDel} className="text-gray-400 hover:text-red-600 hover:bg-red-50 p-1 rounded"><Icons.Trash /></button></div>);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-4 py-2">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <h1 className="text-sm font-semibold text-gray-800 tracking-wide">CRM GuardIAn</h1>
          <nav className="flex items-center gap-1">{navItems.map((n) => (<button key={n.key} onClick={() => setViewMode(n.key)} className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-medium transition-colors ${viewMode === n.key ? "bg-gray-100 text-gray-900" : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"}`}>{n.icon}<span className="hidden sm:inline">{n.label}</span>{n.count !== undefined && <span className="text-gray-400 text-[10px]">{n.count}</span>}</button>))}</nav>
          <div className="flex items-center gap-2">{tenantNome && <span className="text-xs font-medium text-gray-600 hidden md:inline">{tenantNome}</span>}{tenantNome && <span className="text-gray-300 hidden md:inline">|</span>}<span className="text-xs text-gray-400 hidden md:inline">{session.user.email}</span><button onClick={handleSignOut} className="inline-flex items-center gap-1 text-xs text-gray-500 hover:text-gray-700 px-2 py-1 rounded hover:bg-gray-100"><Icons.LogOut />Sair</button></div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-4">
        {viewMode === "dashboard" && (
          <div className="space-y-4">
            <h2 className="text-sm font-semibold text-gray-700">Visão Geral</h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              {[{ l: "Clientes", v: clientes.length, s: "Total cadastrados", ic: <Icons.User className="w-5 h-5 text-gray-400" /> },{ l: "Oportunidades", v: `R$ ${fmtBRL(ind.totalOportunidades)}`, s: `${ind.numOportunidades} ativas · ${ind.taxaConversao}%`, ic: <Icons.TrendingUp className="w-5 h-5 text-gray-400" /> },{ l: "Vendas", v: `R$ ${fmtBRL(ind.totalVendas)}`, s: `${ind.numVendas} vendas · R$ ${fmtBRL(ind.totalVendasMes)} mês`, ic: <Icons.ShoppingCart className="w-5 h-5 text-gray-400" /> },{ l: "A Receber", v: `R$ ${fmtBRL(ind.totalReceber)}`, s: `${ind.numPendentes} pendentes`, ic: <Icons.CreditCard className="w-5 h-5 text-gray-400" /> }].map((c, i) => (
                <div key={i} className="bg-white border border-gray-200 rounded p-3"><div className="flex items-center justify-between mb-1"><span className="text-xs text-gray-500">{c.l}</span>{c.ic}</div><p className="text-lg font-semibold text-gray-800">{c.v}</p><p className="text-[11px] text-gray-400 mt-0.5">{c.s}</p></div>
              ))}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
              <div className="bg-white border border-green-200 rounded p-3"><div className="flex items-center justify-between mb-1"><span className="text-xs font-medium text-green-700">Recebido</span><Icons.CheckCircle className="w-4 h-4 text-green-500" /></div><p className="text-lg font-semibold text-green-700">R$ {fmtBRL(ind.totalRecebido)}</p><p className="text-[11px] text-green-600">{ind.numPagos} pagos</p></div>
              <div className="bg-white border border-yellow-200 rounded p-3"><div className="flex items-center justify-between mb-1"><span className="text-xs font-medium text-yellow-700">A Receber</span><Icons.Clock className="w-4 h-4 text-yellow-500" /></div><p className="text-lg font-semibold text-yellow-700">R$ {fmtBRL(ind.totalReceber)}</p><p className="text-[11px] text-yellow-600">{ind.numPendentes} pendentes</p></div>
              <div className="bg-white border border-red-200 rounded p-3"><div className="flex items-center justify-between mb-1"><span className="text-xs font-medium text-red-700">Vencidos</span><Icons.AlertCircle className="w-4 h-4 text-red-500" /></div><p className="text-lg font-semibold text-red-700">R$ {fmtBRL(ind.totalVencido)}</p><p className="text-[11px] text-red-600">{ind.numVencidos} vencidos</p></div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
              <div className="bg-white border border-gray-200 rounded p-4">
                <h3 className="text-xs font-medium text-gray-500 mb-3 flex items-center gap-1"><Icons.BarChart className="w-3.5 h-3.5" />Vendas por Mês</h3>
                {(() => { const d = calcularVendasPorMes(); if (!d.length) return <p className="text-gray-400 text-center py-6 text-xs">Nenhuma venda registrada.</p>; const mx = Math.max(...d.map((m) => m.total)); return (<div><div className="flex items-end gap-1" style={{ height: "180px" }}>{d.map((m, i) => { const h = mx > 0 ? (m.total / mx) * 100 : 0; return (<div key={i} className="flex-1 flex flex-col items-center justify-end h-full"><span className="text-[10px] text-gray-500 mb-1">R$ {m.total.toLocaleString("pt-BR",{maximumFractionDigits:0})}</span><div className="w-full bg-gray-700 rounded-t hover:bg-gray-600 transition-colors" style={{ height:`${Math.max(h,2)}%`, minHeight:"3px" }} title={`${m.label}: R$ ${fmtBRL(m.total)} (${m.count})`} /><span className="text-[10px] text-gray-400 mt-1">{m.label}</span></div>); })}</div></div>); })()}
              </div>
              <div className="bg-white border border-gray-200 rounded p-4">
                <h3 className="text-xs font-medium text-gray-500 mb-3 flex items-center gap-1"><Icons.TrendingUp className="w-3.5 h-3.5" />Oportunidades - Pago x Pendente</h3>
                {(() => { const d = calcularFaturamentoMensal(); if (!d.length) return <p className="text-gray-400 text-center py-6 text-xs">Nenhuma venda registrada.</p>; const mx = Math.max(...d.map((m) => m.pago + m.pendente)); return (<div><div className="flex items-end gap-1" style={{ height: "180px" }}>{d.map((m, i) => { const total = m.pago + m.pendente; const h = mx > 0 ? (total / mx) * 100 : 0; const pctPago = total > 0 ? (m.pago / total) * 100 : 0; return (<div key={i} className="flex-1 flex flex-col items-center justify-end h-full"><span className="text-[10px] text-gray-500 mb-1">R$ {total.toLocaleString("pt-BR",{maximumFractionDigits:0})}</span><div className="w-full rounded-t overflow-hidden" style={{ height:`${Math.max(h,2)}%`, minHeight:"3px" }} title={`${m.label}: Pago R$ ${fmtBRL(m.pago)} · Pendente R$ ${fmtBRL(m.pendente)}`}><div className="w-full h-full flex flex-col justify-end"><div className="w-full transition-colors" style={{ height:`${100-pctPago}%`, background:"#e84672" }} /><div className="w-full transition-colors" style={{ height:`${pctPago}%`, background:"#22c55e" }} /></div></div><span className="text-[10px] text-gray-400 mt-1">{m.label}</span></div>); })}</div><div className="flex items-center justify-center gap-4 mt-2"><span className="flex items-center gap-1 text-[10px] text-gray-500"><span className="inline-block w-2.5 h-2.5 rounded-sm" style={{background:"#22c55e"}} />Pago</span><span className="flex items-center gap-1 text-[10px] text-gray-500"><span className="inline-block w-2.5 h-2.5 rounded-sm" style={{background:"#e84672"}} />Pendente</span></div></div>); })()}
              </div>
            </div>
          </div>
        )}

        {viewMode === "clientes" && (
          <div className="space-y-3">
            <div className="flex items-center justify-between"><h2 className="text-sm font-semibold text-gray-700">Clientes</h2><button onClick={() => abrirModalCliente()} className="inline-flex items-center gap-1 bg-gray-800 hover:bg-gray-700 text-white px-3 py-1.5 rounded text-xs font-medium"><Icons.Plus />Novo</button></div>
            <DataGrid columns={[
              { key: "nome", label: "Nome", render: (c) => <span className="font-medium text-gray-800">{c.nome}</span>, filterValue: (c) => c.nome || "" },
              { key: "cpf", label: "CPF", filterValue: (c) => c.cpf || "", render: (c) => c.cpf || <span className="text-gray-300">-</span> },
              { key: "email", label: "Email", filterValue: (c) => c.email || "", render: (c) => c.email || <span className="text-gray-300">-</span> },
              { key: "telefone", label: "Telefone / WhatsApp", filterValue: (c) => c.telefone || "", render: (c) => { if (!c.telefone) return <span className="text-gray-300">-</span>; const num = c.telefone.replace(/\D/g, ""); const whatsNum = num.length <= 11 ? "55" + num : num; return <span className="flex items-center gap-1.5">{c.telefone}<a href={`https://wa.me/${whatsNum}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-0.5 text-green-600 hover:text-green-700 text-[11px] font-medium" title="Enviar mensagem no WhatsApp"><svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>WhatsApp</a></span>; } },
              { key: "empresa", label: "Empresa", filterValue: (c) => c.empresa || "", render: (c) => c.empresa || <span className="text-gray-300">-</span> },
              { key: "data_cadastro", label: "Cadastro", render: (c) => <span className="text-gray-500">{new Date(c.data_cadastro).toLocaleDateString("pt-BR")}</span>, filterValue: (c) => new Date(c.data_cadastro).toLocaleDateString("pt-BR"), sortValue: (c) => c.data_cadastro },
            ]} data={clientes} actions={(c) => actBtns(() => abrirModalCliente(c), () => excluirCliente(c.id))} emptyMessage="Nenhum cliente cadastrado." />
          </div>
        )}

        {viewMode === "usuarios" && (
          <div className="space-y-3">
            <div className="flex items-center justify-between"><h2 className="text-sm font-semibold text-gray-700">Usuários</h2><button onClick={() => abrirModalUsuario()} className="inline-flex items-center gap-1 bg-gray-800 hover:bg-gray-700 text-white px-3 py-1.5 rounded text-xs font-medium"><Icons.Plus />Novo</button></div>
            <DataGrid columns={[
              { key: "email", label: "Email", render: (u) => <span className="font-medium text-gray-800">{u.email || "-"}</span>, filterValue: (u) => u.email || "" },
              { key: "role", label: "Perfil", render: (u) => { const r = u.role || "member"; const cls = r === "owner" ? "bg-purple-50 text-purple-700" : r === "admin" ? "bg-blue-50 text-blue-700" : "bg-gray-100 text-gray-600"; return <span className={`px-1.5 py-0.5 rounded text-[11px] capitalize ${cls}`}>{r}</span>; }, filterValue: (u) => u.role || "" },
              { key: "created_at", label: "Cadastro", render: (u) => <span className="text-gray-500">{u.created_at ? new Date(u.created_at).toLocaleDateString("pt-BR") : "-"}</span>, filterValue: (u) => u.created_at ? new Date(u.created_at).toLocaleDateString("pt-BR") : "", sortValue: (u) => u.created_at },
            ]} data={usuarios} actions={(u) => actBtns(() => abrirModalUsuario(u), () => excluirUsuario(u.id))} emptyMessage="Nenhum usuário cadastrado." />
          </div>
        )}

        {viewMode === "produtos" && (
          <div className="space-y-3">
            <div className="flex items-center justify-between"><h2 className="text-sm font-semibold text-gray-700">Produtos / Serviços</h2><button onClick={() => abrirModalProduto()} className="inline-flex items-center gap-1 bg-gray-800 hover:bg-gray-700 text-white px-3 py-1.5 rounded text-xs font-medium"><Icons.Plus />Novo</button></div>
            <DataGrid columns={[
              { key: "nome", label: "Nome", render: (p) => <span className="font-medium text-gray-800">{p.nome}</span>, filterValue: (p) => p.nome || "" },
              { key: "tipo", label: "Tipo", render: (p) => <span className="capitalize">{p.tipo}</span>, filterValue: (p) => p.tipo || "" },
              { key: "categoria", label: "Categoria", render: (p) => p.categoria || <span className="text-gray-300">-</span>, filterValue: (p) => p.categoria || "" },
              { key: "preco_base", label: "Preço", render: (p) => <span className="font-medium text-green-700">R$ {fmtBRL(p.preco_base)}</span>, sortValue: (p) => parseFloat(p.preco_base || 0) },
              { key: "custo", label: "Custo", render: (p) => `R$ ${fmtBRL(p.custo)}`, sortValue: (p) => parseFloat(p.custo || 0) },
              { key: "ativo", label: "Status", render: (p) => p.ativo ? <span className="px-1.5 py-0.5 rounded text-[11px] bg-green-50 text-green-700">Ativo</span> : <span className="px-1.5 py-0.5 rounded text-[11px] bg-gray-100 text-gray-500">Inativo</span>, filterValue: (p) => p.ativo ? "Ativo" : "Inativo" },
            ]} data={produtos} actions={(p) => actBtns(() => abrirModalProduto(p), () => excluirProduto(p.id))} emptyMessage="Nenhum produto cadastrado." />
          </div>
        )}

        {viewMode === "pipeline" && (
          <div className="space-y-3">
            <div className="flex items-center justify-between"><h2 className="text-sm font-semibold text-gray-700">Pipeline</h2><button onClick={() => abrirModalOportunidade()} className="inline-flex items-center gap-1 bg-gray-800 hover:bg-gray-700 text-white px-3 py-1.5 rounded text-xs font-medium" disabled={!clientes.length}><Icons.Plus />Nova Oportunidade</button></div>
            {!clientes.length ? <div className="bg-white border border-gray-200 rounded p-8 text-center"><p className="text-gray-400 text-xs">Cadastre clientes primeiro.</p></div> : (
              <div className="flex gap-2 overflow-x-auto pb-2">{estagios.map((est) => { const ops = oportunidades.filter((o) => o.estagio === est); const tot = ops.reduce((s, o) => s + parseFloat(o.valor || 0), 0); return (
                <div key={est} className="flex-shrink-0 w-56">
                  <div className={`rounded p-2 mb-2 ${est === "cancelado" ? "bg-red-50 border border-red-200" : "bg-gray-100 border border-gray-200"}`}><h3 className={`text-xs font-semibold capitalize ${est === "cancelado" ? "text-red-700" : "text-gray-700"}`}>{est}</h3><p className="text-[11px] text-gray-500">{ops.length} · R$ {fmtBRL(tot)}</p></div>
                  <div className="space-y-1.5">{ops.map((op) => (
                    <div key={op.id} className="bg-white border border-gray-200 rounded p-2">
                      <div className="flex justify-between items-start mb-1"><h4 className="text-xs font-semibold text-gray-800 leading-tight">{op.titulo}</h4><div className="flex gap-0.5 ml-1"><button onClick={() => abrirModalOportunidade(op)} className="text-gray-400 hover:text-gray-600 p-0.5"><Icons.Edit className="w-3 h-3" /></button><button onClick={() => excluirOportunidade(op.id)} className="text-gray-400 hover:text-red-600 p-0.5"><Icons.Trash className="w-3 h-3" /></button></div></div>
                      <p className="text-[11px] text-gray-500">{getClienteNome(op.cliente_id)}</p>
                      {getProdutoNome(op.produto_id) && <p className="text-[11px] text-gray-400">{getProdutoNome(op.produto_id)}</p>}
                      <p className="text-sm font-semibold text-green-700 my-1">R$ {fmtBRL(op.valor)}</p>
                      <div className="flex gap-1">{estagios.map((e2, idx) => { const at = estagios.indexOf(op.estagio); if (idx !== at + 1 && idx !== at - 1) return null; const av = idx === at + 1; return <button key={e2} onClick={() => moverOportunidade(op.id, e2)} className="flex-1 px-1 py-0.5 text-[10px] rounded bg-gray-50 text-gray-600 hover:bg-gray-100">{av ? "→ Avançar" : "← Voltar"}</button>; })}</div>
                    </div>
                  ))}</div>
                </div>
              ); })}</div>
            )}
          </div>
        )}

        {viewMode === "vendas" && (
          <div className="space-y-3">
            <div className="flex items-center justify-between"><h2 className="text-sm font-semibold text-gray-700">Vendas</h2><button onClick={() => abrirModalVenda()} className="inline-flex items-center gap-1 bg-gray-800 hover:bg-gray-700 text-white px-3 py-1.5 rounded text-xs font-medium" disabled={!clientes.length}><Icons.Plus />Nova Venda</button></div>
            <DataGrid columns={[
              { key: "data_venda", label: "Data", render: (v) => new Date(v.data_venda).toLocaleDateString("pt-BR"), filterValue: (v) => new Date(v.data_venda).toLocaleDateString("pt-BR"), sortValue: (v) => v.data_venda },
              { key: "cliente_id", label: "Cliente", render: (v) => <span className="font-medium">{getClienteNome(v.cliente_id)}</span>, filterValue: (v) => getClienteNome(v.cliente_id) },
              { key: "descricao", label: "Descrição", filterValue: (v) => v.descricao || "" },
              { key: "itens", label: "Produtos", filterable: false, render: (v) => v.itens && v.itens.length > 0 ? v.itens.map((it, i) => <div key={i} className="text-[11px]"><span className="font-medium">{it.nome}</span> <span className="text-gray-400">x{it.quantidade}</span></div>) : <span className="text-gray-300">-</span> },
              { key: "desconto", label: "Desconto", render: (v) => parseFloat(v.desconto||0) > 0 ? <span className="text-red-600">-R$ {fmtBRL(v.desconto)}</span> : <span className="text-gray-300">-</span>, sortValue: (v) => parseFloat(v.desconto||0) },
              { key: "forma_pagamento", label: "Pgto", render: (v) => <span className="capitalize">{v.forma_pagamento}</span>, filterValue: (v) => v.forma_pagamento || "" },
              { key: "valor", label: "Valor", render: (v) => <span className="font-medium text-green-700">R$ {fmtBRL(v.valor)}</span>, sortValue: (v) => parseFloat(v.valor||0) },
            ]} data={vendas} actions={(v) => actBtns(() => abrirModalVenda(v), () => excluirVenda(v.id))} emptyMessage="Nenhuma venda registrada." />
          </div>
        )}

        {viewMode === "financeiro" && (
          <div className="space-y-3">
            <div className="flex items-center justify-between"><h2 className="text-sm font-semibold text-gray-700">Financeiro</h2><button onClick={() => abrirModalTitulo()} className="inline-flex items-center gap-1 bg-gray-800 hover:bg-gray-700 text-white px-3 py-1.5 rounded text-xs font-medium"><Icons.Plus />Novo Título</button></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="bg-white border border-green-200 rounded p-3"><span className="text-xs font-medium text-green-700">Pagos</span><p className="text-lg font-semibold text-green-700">R$ {fmtBRL(ind.totalRecebido)}</p><p className="text-[11px] text-green-600">{ind.numPagos} títulos</p></div>
              <div className="bg-white border border-yellow-200 rounded p-3"><span className="text-xs font-medium text-yellow-700">Pendentes</span><p className="text-lg font-semibold text-yellow-700">R$ {fmtBRL(ind.totalReceber)}</p><p className="text-[11px] text-yellow-600">{ind.numPendentes} títulos</p></div>
              <div className="bg-white border border-red-200 rounded p-3"><span className="text-xs font-medium text-red-700">Vencidos</span><p className="text-lg font-semibold text-red-700">R$ {fmtBRL(ind.totalVencido)}</p><p className="text-[11px] text-red-600">{ind.numVencidos} títulos</p></div>
            </div>
            <DataGrid columns={[
              { key: "descricao", label: "Descrição", filterValue: (t) => t.descricao || "" },
              { key: "data_emissao", label: "Emissão", render: (t) => new Date(t.data_emissao).toLocaleDateString("pt-BR"), filterValue: (t) => new Date(t.data_emissao).toLocaleDateString("pt-BR"), sortValue: (t) => t.data_emissao },
              { key: "data_vencimento", label: "Vencimento", render: (t) => new Date(t.data_vencimento).toLocaleDateString("pt-BR"), filterValue: (t) => new Date(t.data_vencimento).toLocaleDateString("pt-BR"), sortValue: (t) => t.data_vencimento },
              { key: "valor", label: "Valor", render: (t) => <span className="font-medium">R$ {fmtBRL(t.valor)}</span>, sortValue: (t) => parseFloat(t.valor||0) },
              { key: "status", label: "Status", render: (t) => { const vc = t.status === "pendente" && new Date(t.data_vencimento) < new Date(); return t.status === "pago" ? <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[11px] bg-green-50 text-green-700"><Icons.CheckCircle className="w-3 h-3" />Pago</span> : vc ? <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[11px] bg-red-50 text-red-700"><Icons.XCircle className="w-3 h-3" />Vencido</span> : <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[11px] bg-yellow-50 text-yellow-700"><Icons.Clock className="w-3 h-3" />Pendente</span>; }, filterValue: (t) => { const vc = t.status === "pendente" && new Date(t.data_vencimento) < new Date(); return t.status === "pago" ? "Pago" : vc ? "Vencido" : "Pendente"; } },
            ]} data={titulos} actions={(t) => (<div className="flex items-center gap-1">{t.status === "pendente" && <button onClick={() => marcarComoPago(t.id)} className="text-green-600 hover:bg-green-50 px-1.5 py-0.5 rounded text-[11px] font-medium">Pagar</button>}<button onClick={() => abrirModalTitulo(t)} className="text-gray-500 hover:text-gray-700 hover:bg-gray-100 p-1 rounded"><Icons.Edit /></button><button onClick={() => excluirTitulo(t.id)} className="text-gray-400 hover:text-red-600 hover:bg-red-50 p-1 rounded"><Icons.Trash /></button></div>)} rowClassName={(t) => t.status === "pendente" && new Date(t.data_vencimento) < new Date() ? "bg-red-50/50" : ""} emptyMessage="Nenhum título cadastrado." />
          </div>
        )}

        {viewMode === "tecnicos" && (
          <div className="space-y-3">
            <div className="flex items-center justify-between"><h2 className="text-sm font-semibold text-gray-700">Técnicos Responsáveis</h2><button onClick={() => abrirModalTecnico()} className="inline-flex items-center gap-1 bg-gray-800 hover:bg-gray-700 text-white px-3 py-1.5 rounded text-xs font-medium"><Icons.Plus />Novo</button></div>
            <DataGrid columns={[
              { key: "nome", label: "Nome", render: (t) => <span className="font-medium text-gray-800">{t.nome}</span>, filterValue: (t) => t.nome || "" },
              { key: "especialidade", label: "Especialidade", render: (t) => t.especialidade || <span className="text-gray-300">-</span>, filterValue: (t) => t.especialidade || "" },
              { key: "cpf", label: "CPF", render: (t) => t.cpf || <span className="text-gray-300">-</span>, filterValue: (t) => t.cpf || "" },
              { key: "email", label: "Email", render: (t) => t.email || <span className="text-gray-300">-</span>, filterValue: (t) => t.email || "" },
              { key: "telefone", label: "Telefone", render: (t) => t.telefone || <span className="text-gray-300">-</span>, filterValue: (t) => t.telefone || "" },
              { key: "endereco", label: "Endereço", render: (t) => t.endereco || <span className="text-gray-300">-</span>, filterValue: (t) => t.endereco || "" },
              { key: "ativo", label: "Status", render: (t) => t.ativo ? <span className="px-1.5 py-0.5 rounded text-[11px] bg-green-50 text-green-700">Ativo</span> : <span className="px-1.5 py-0.5 rounded text-[11px] bg-gray-100 text-gray-500">Inativo</span>, filterValue: (t) => t.ativo ? "Ativo" : "Inativo" },
            ]} data={tecnicos} actions={(t) => actBtns(() => abrirModalTecnico(t), () => excluirTecnico(t.id))} emptyMessage="Nenhum técnico cadastrado." />
          </div>
        )}

        {viewMode === "ordens_servico" && (
          <div className="space-y-3">
            <div className="flex items-center justify-between"><h2 className="text-sm font-semibold text-gray-700">Ordens de Serviço</h2></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="bg-white border border-gray-200 rounded p-3"><div className="flex items-center justify-between mb-1"><span className="text-xs font-medium text-gray-700">Aguardando Atendimento</span><Icons.Clock className="w-4 h-4 text-gray-400" /></div><p className="text-lg font-semibold text-gray-700">{ordensServico.filter((o) => o.status === "aguardando_atendimento").length}</p><p className="text-[11px] text-gray-500">ordens pendentes</p></div>
              <div className="bg-white border border-blue-200 rounded p-3"><div className="flex items-center justify-between mb-1"><span className="text-xs font-medium text-blue-700">Em Atendimento</span><Icons.ArrowRight className="w-4 h-4 text-blue-400" /></div><p className="text-lg font-semibold text-blue-700">{ordensServico.filter((o) => o.status === "em_atendimento").length}</p><p className="text-[11px] text-blue-500">em execução</p></div>
              <div className="bg-white border border-green-200 rounded p-3"><div className="flex items-center justify-between mb-1"><span className="text-xs font-medium text-green-700">Atendimento Concluído</span><Icons.CheckCircle className="w-4 h-4 text-green-500" /></div><p className="text-lg font-semibold text-green-700">{ordensServico.filter((o) => o.status === "atendimento_concluido").length}</p><p className="text-[11px] text-green-500">concluídas</p></div>
            </div>
            <DataGrid columns={[
              { key: "numero_os", label: "Nº OS", render: (o) => <span className="font-mono font-medium text-gray-800 text-[11px]">{o.numero_os}</span>, filterValue: (o) => o.numero_os || "" },
              { key: "data_abertura", label: "Abertura", render: (o) => o.data_abertura ? new Date(o.data_abertura).toLocaleDateString("pt-BR") : "-", filterValue: (o) => o.data_abertura ? new Date(o.data_abertura).toLocaleDateString("pt-BR") : "", sortValue: (o) => o.data_abertura },
              { key: "cliente_id", label: "Cliente", render: (o) => <span className="font-medium">{getClienteNome(o.cliente_id)}</span>, filterValue: (o) => getClienteNome(o.cliente_id) },
              { key: "descricao", label: "Descrição", filterValue: (o) => o.descricao || "" },
              { key: "valor_total", label: "Valor", render: (o) => <span className="font-medium text-green-700">R$ {fmtBRL(o.valor_total)}</span>, sortValue: (o) => parseFloat(o.valor_total || 0) },
              { key: "tecnico_id", label: "Técnico", render: (o) => o.tecnico_id ? <span className="text-gray-700">{getTecnicoNome(o.tecnico_id)}</span> : <span className="text-gray-300">-</span>, filterValue: (o) => o.tecnico_id ? getTecnicoNome(o.tecnico_id) : "" },
              { key: "comissao_valor", label: "Comissão", render: (o) => parseFloat(o.comissao_valor || 0) > 0 ? <span className="text-blue-700 font-medium">R$ {fmtBRL(o.comissao_valor)}</span> : <span className="text-gray-300">-</span>, sortValue: (o) => parseFloat(o.comissao_valor || 0) },
              { key: "status", label: "Status", render: (o) => { if (o.status === "aguardando_atendimento") return <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[11px] bg-gray-100 text-gray-700"><Icons.Clock className="w-3 h-3" />Aguardando</span>; if (o.status === "em_atendimento") return <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[11px] bg-blue-50 text-blue-700"><Icons.ArrowRight className="w-3 h-3" />Em Atendimento</span>; return <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[11px] bg-green-50 text-green-700"><Icons.CheckCircle className="w-3 h-3" />Concluído</span>; }, filterValue: (o) => o.status === "aguardando_atendimento" ? "Aguardando" : o.status === "em_atendimento" ? "Em Atendimento" : "Concluído" },
            ]} data={ordensServico} actions={(o) => (
              <div className="flex items-center gap-1">
                {o.status !== "atendimento_concluido" && <button onClick={() => abrirModalEncaminhar(o)} className="text-blue-600 hover:bg-blue-50 px-1.5 py-0.5 rounded text-[11px] font-medium whitespace-nowrap">Encaminhar</button>}
                {o.status === "em_atendimento" && <button onClick={() => concluirOrdemServico(o.id)} className="text-green-600 hover:bg-green-50 px-1.5 py-0.5 rounded text-[11px] font-medium whitespace-nowrap">Concluir</button>}
                <button onClick={() => excluirOrdemServico(o.id)} className="text-gray-400 hover:text-red-600 hover:bg-red-50 p-1 rounded"><Icons.Trash /></button>
              </div>
            )} emptyMessage="Nenhuma ordem de serviço. Registre uma venda para gerar automaticamente." />
          </div>
        )}

        {viewMode === "comissoes" && (
          <div className="space-y-4">
            <h2 className="text-sm font-semibold text-gray-700">Gestão de Comissões</h2>

            {/* Cards consolidados por técnico — valores em aberto */}
            {(() => {
              const porTecnico = tecnicos
                .map((t) => {
                  const abertas = comissoes.filter((c) => c.tecnico_id === t.id && c.status !== "pago");
                  return { t, total: abertas.reduce((s, c) => s + parseFloat(c.valor || 0), 0), pendente: abertas.filter((c) => c.status === "pendente").length, agendado: abertas.filter((c) => c.status === "agendado").length };
                })
                .filter((x) => x.pendente + x.agendado > 0);
              if (!porTecnico.length) return (
                <div className="bg-gray-50 border border-gray-200 rounded p-4 text-center text-xs text-gray-400">
                  Nenhuma comissão em aberto. Conclua um atendimento com técnico e comissão para gerar cards.
                </div>
              );
              return (
                <div>
                  <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide mb-2">Valores em Aberto por Técnico</p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {porTecnico.map(({ t, total, pendente, agendado }) => (
                      <div key={t.id} className="bg-white border border-blue-200 rounded p-3">
                        <p className="text-xs font-semibold text-gray-800 truncate">{t.nome}</p>
                        {t.especialidade && <p className="text-[10px] text-gray-400">{t.especialidade}</p>}
                        <p className="text-xl font-bold text-blue-700 mt-1">R$ {fmtBRL(total)}</p>
                        <p className="text-[10px] text-gray-500 mt-0.5">
                          {pendente > 0 && <span className="text-gray-600">{pendente} pendente{pendente > 1 ? "s" : ""}</span>}
                          {pendente > 0 && agendado > 0 && " · "}
                          {agendado > 0 && <span className="text-yellow-600">{agendado} agendado{agendado > 1 ? "s" : ""}</span>}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })()}

            {/* Kanban de comissões */}
            {(() => {
              const colunas = [
                { key: "pendente", label: "Pendente de Pagamento", hClass: "bg-gray-100 border-gray-300 text-gray-700" },
                { key: "agendado", label: "Pagamento Agendado", hClass: "bg-yellow-50 border-yellow-300 text-yellow-800" },
                { key: "pago", label: "Pagamento Efetuado", hClass: "bg-green-50 border-green-300 text-green-800" },
              ];
              return (
                <div className="flex gap-3 overflow-x-auto pb-2">
                  {colunas.map((col) => {
                    const cards = comissoes.filter((c) => c.status === col.key);
                    const totalCol = cards.reduce((s, c) => s + parseFloat(c.valor || 0), 0);
                    return (
                      <div key={col.key} className="flex-shrink-0 w-64">
                        <div className={`rounded p-2.5 mb-2 border ${col.hClass}`}>
                          <h3 className="text-xs font-semibold">{col.label}</h3>
                          <p className="text-[11px] opacity-75">{cards.length} {cards.length === 1 ? "card" : "cards"} · R$ {fmtBRL(totalCol)}</p>
                        </div>
                        <div className="space-y-2">
                          {cards.length === 0 && <div className="bg-white border border-dashed border-gray-200 rounded p-4 text-center text-[11px] text-gray-400">Sem comissões</div>}
                          {cards.map((c) => {
                            const os = ordensServico.find((o) => o.id === c.ordem_servico_id) || {};
                            return (
                              <div key={c.id} className="bg-white border border-gray-200 rounded p-3 shadow-sm">
                                <div className="flex justify-between items-start mb-1.5">
                                  <span className="font-mono text-[10px] text-gray-400 bg-gray-50 px-1 rounded">{os.numero_os || "—"}</span>
                                  <span className="text-sm font-bold text-blue-700">R$ {fmtBRL(c.valor)}</span>
                                </div>
                                <p className="text-xs font-semibold text-gray-800">{getTecnicoNome(c.tecnico_id)}</p>
                                <p className="text-[11px] text-gray-500 mb-1">{getClienteNome(os.cliente_id)}</p>
                                {parseFloat(c.percentual || 0) > 0 && <p className="text-[10px] text-gray-400">{c.percentual}% s/ R$ {fmtBRL(os.valor_total)}</p>}
                                {c.data_agendamento && <p className="text-[10px] text-yellow-700 mt-1 font-medium">📅 Agendado: {new Date(c.data_agendamento + "T12:00:00").toLocaleDateString("pt-BR")}</p>}
                                {c.data_pagamento && <p className="text-[10px] text-green-700 mt-1 font-medium">✓ Pago em: {new Date(c.data_pagamento + "T12:00:00").toLocaleDateString("pt-BR")}</p>}
                                {c.observacoes && <p className="text-[10px] text-gray-400 mt-1 italic truncate" title={c.observacoes}>{c.observacoes}</p>}
                                <div className="flex gap-1 mt-2 pt-2 border-t border-gray-100">
                                  {c.status === "pendente" && <button onClick={() => abrirModalAgendarComissao(c)} className="flex-1 px-1.5 py-1 text-[11px] rounded bg-yellow-50 text-yellow-700 hover:bg-yellow-100 border border-yellow-200 font-medium">Agendar</button>}
                                  {c.status === "agendado" && <button onClick={() => pagarComissao(c.id)} className="flex-1 px-1.5 py-1 text-[11px] rounded bg-green-50 text-green-700 hover:bg-green-100 border border-green-200 font-medium">Confirmar Pago</button>}
                                  {c.status !== "pago" && <button onClick={() => excluirComissao(c.id)} className="text-gray-300 hover:text-red-500 p-1 rounded hover:bg-red-50"><Icons.Trash className="w-3 h-3" /></button>}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              );
            })()}
          </div>
        )}
      </main>

      {modalCliente && (<div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50"><div className="bg-white rounded-lg border border-gray-200 max-w-sm w-full p-4 max-h-[90vh] overflow-y-auto"><h3 className="text-sm font-semibold mb-3">{editandoCliente ? "Editar Cliente" : "Novo Cliente"}</h3><div className="space-y-2.5"><div><label className="block text-xs text-gray-600 mb-0.5">Nome *</label><input type="text" value={formCliente.nome} onChange={(e) => setFormCliente({...formCliente, nome: e.target.value})} className="w-full border border-gray-200 rounded px-2.5 py-1.5 text-sm focus:ring-1 focus:ring-gray-400 outline-none" /></div><div><label className="block text-xs text-gray-600 mb-0.5">CPF</label><input type="text" value={formCliente.cpf} onChange={(e) => { const v = e.target.value.replace(/\D/g, "").slice(0, 11); const f = v.length > 9 ? v.replace(/(\d{3})(\d{3})(\d{3})(\d{1,2})/, "$1.$2.$3-$4") : v.length > 6 ? v.replace(/(\d{3})(\d{3})(\d{1,3})/, "$1.$2.$3") : v.length > 3 ? v.replace(/(\d{3})(\d{1,3})/, "$1.$2") : v; setFormCliente({...formCliente, cpf: f}); }} placeholder="000.000.000-00" className="w-full border border-gray-200 rounded px-2.5 py-1.5 text-sm focus:ring-1 focus:ring-gray-400 outline-none" /></div><div><label className="block text-xs text-gray-600 mb-0.5">Email</label><input type="email" value={formCliente.email} onChange={(e) => setFormCliente({...formCliente, email: e.target.value})} className="w-full border border-gray-200 rounded px-2.5 py-1.5 text-sm focus:ring-1 focus:ring-gray-400 outline-none" /></div><div><label className="block text-xs text-gray-600 mb-0.5">Telefone</label><input type="tel" value={formCliente.telefone} onChange={(e) => setFormCliente({...formCliente, telefone: e.target.value})} className="w-full border border-gray-200 rounded px-2.5 py-1.5 text-sm focus:ring-1 focus:ring-gray-400 outline-none" /></div><div><label className="block text-xs text-gray-600 mb-0.5">Empresa</label><input type="text" value={formCliente.empresa} onChange={(e) => setFormCliente({...formCliente, empresa: e.target.value})} className="w-full border border-gray-200 rounded px-2.5 py-1.5 text-sm focus:ring-1 focus:ring-gray-400 outline-none" /></div><div><label className="block text-xs text-gray-600 mb-0.5">Observações</label><textarea value={formCliente.observacoes} onChange={(e) => setFormCliente({...formCliente, observacoes: e.target.value})} className="w-full border border-gray-200 rounded px-2.5 py-1.5 text-sm focus:ring-1 focus:ring-gray-400 outline-none" rows="2" /></div></div><div className="flex gap-2 mt-4"><button onClick={fecharModalCliente} className="flex-1 px-3 py-1.5 border border-gray-200 rounded text-xs hover:bg-gray-50">Cancelar</button><button onClick={salvarCliente} className="flex-1 px-3 py-1.5 bg-gray-800 text-white rounded text-xs hover:bg-gray-700">{editandoCliente ? "Salvar" : "Adicionar"}</button></div></div></div>)}

      {modalProduto && (<div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50"><div className="bg-white rounded-lg border border-gray-200 max-w-sm w-full p-4 max-h-[90vh] overflow-y-auto"><h3 className="text-sm font-semibold mb-3">{editandoProduto ? "Editar Produto" : "Novo Produto"}</h3><div className="space-y-2.5"><div><label className="block text-xs text-gray-600 mb-0.5">Nome *</label><input type="text" value={formProduto.nome} onChange={(e) => setFormProduto({...formProduto, nome: e.target.value})} className="w-full border border-gray-200 rounded px-2.5 py-1.5 text-sm focus:ring-1 focus:ring-gray-400 outline-none" /></div><div><label className="block text-xs text-gray-600 mb-0.5">Tipo</label><select value={formProduto.tipo} onChange={(e) => setFormProduto({...formProduto, tipo: e.target.value})} className="w-full border border-gray-200 rounded px-2.5 py-1.5 text-sm focus:ring-1 focus:ring-gray-400 outline-none"><option value="produto">Produto</option><option value="servico">Serviço</option></select></div><div><label className="block text-xs text-gray-600 mb-0.5">Categoria</label><input type="text" value={formProduto.categoria} onChange={(e) => setFormProduto({...formProduto, categoria: e.target.value})} className="w-full border border-gray-200 rounded px-2.5 py-1.5 text-sm focus:ring-1 focus:ring-gray-400 outline-none" /></div><div><label className="block text-xs text-gray-600 mb-0.5">Descrição</label><textarea value={formProduto.descricao} onChange={(e) => setFormProduto({...formProduto, descricao: e.target.value})} className="w-full border border-gray-200 rounded px-2.5 py-1.5 text-sm focus:ring-1 focus:ring-gray-400 outline-none" rows="2" /></div><div className="grid grid-cols-2 gap-2"><div><label className="block text-xs text-gray-600 mb-0.5">Preço (R$)</label><input type="number" step="0.01" value={formProduto.preco_base} onChange={(e) => setFormProduto({...formProduto, preco_base: e.target.value})} className="w-full border border-gray-200 rounded px-2.5 py-1.5 text-sm focus:ring-1 focus:ring-gray-400 outline-none" /></div><div><label className="block text-xs text-gray-600 mb-0.5">Custo (R$)</label><input type="number" step="0.01" value={formProduto.custo} onChange={(e) => setFormProduto({...formProduto, custo: e.target.value})} className="w-full border border-gray-200 rounded px-2.5 py-1.5 text-sm focus:ring-1 focus:ring-gray-400 outline-none" /></div></div><div><label className="block text-xs text-gray-600 mb-0.5">Unidade</label><input type="text" value={formProduto.unidade_medida} onChange={(e) => setFormProduto({...formProduto, unidade_medida: e.target.value})} className="w-full border border-gray-200 rounded px-2.5 py-1.5 text-sm focus:ring-1 focus:ring-gray-400 outline-none" placeholder="un, hora, kg..." /></div><div className="flex items-center gap-2"><input id="pa" type="checkbox" checked={!!formProduto.ativo} onChange={(e) => setFormProduto({...formProduto, ativo: e.target.checked})} /><label htmlFor="pa" className="text-xs text-gray-600">Ativo</label></div><div><label className="block text-xs text-gray-600 mb-0.5">Observações</label><textarea value={formProduto.observacoes} onChange={(e) => setFormProduto({...formProduto, observacoes: e.target.value})} className="w-full border border-gray-200 rounded px-2.5 py-1.5 text-sm focus:ring-1 focus:ring-gray-400 outline-none" rows="2" /></div></div><div className="flex gap-2 mt-4"><button onClick={fecharModalProduto} className="flex-1 px-3 py-1.5 border border-gray-200 rounded text-xs hover:bg-gray-50">Cancelar</button><button onClick={salvarProduto} className="flex-1 px-3 py-1.5 bg-gray-800 text-white rounded text-xs hover:bg-gray-700">{editandoProduto ? "Salvar" : "Adicionar"}</button></div></div></div>)}

      {modalOportunidade && (<div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50"><div className="bg-white rounded-lg border border-gray-200 max-w-sm w-full p-4"><h3 className="text-sm font-semibold mb-3">{editandoOportunidade ? "Editar Oportunidade" : "Nova Oportunidade"}</h3><div className="space-y-2.5"><div><label className="block text-xs text-gray-600 mb-0.5">Título *</label><input type="text" value={formOportunidade.titulo} onChange={(e) => setFormOportunidade({...formOportunidade, titulo: e.target.value})} className="w-full border border-gray-200 rounded px-2.5 py-1.5 text-sm focus:ring-1 focus:ring-gray-400 outline-none" /></div><div><label className="block text-xs text-gray-600 mb-0.5">Cliente *</label><select value={formOportunidade.cliente_id} onChange={(e) => setFormOportunidade({...formOportunidade, cliente_id: e.target.value})} className="w-full border border-gray-200 rounded px-2.5 py-1.5 text-sm focus:ring-1 focus:ring-gray-400 outline-none"><option value="">Selecione</option>{clientes.map((c) => <option key={c.id} value={c.id}>{c.nome}</option>)}</select></div><div><label className="block text-xs text-gray-600 mb-0.5">Produto</label><select value={formOportunidade.produto_id} onChange={(e) => { const pid = e.target.value; const ps = produtos.find((p) => p.id === pid); setFormOportunidade({...formOportunidade, produto_id: pid, valor: ps ? ps.preco_base.toString() : formOportunidade.valor}); }} className="w-full border border-gray-200 rounded px-2.5 py-1.5 text-sm focus:ring-1 focus:ring-gray-400 outline-none"><option value="">Nenhum</option>{produtos.filter((p) => p.ativo !== false).map((p) => <option key={p.id} value={p.id}>{p.nome} — R$ {fmtBRL(p.preco_base)}</option>)}</select></div><div><label className="block text-xs text-gray-600 mb-0.5">Valor (R$)</label><input type="number" step="0.01" value={formOportunidade.valor} onChange={(e) => setFormOportunidade({...formOportunidade, valor: e.target.value})} className="w-full border border-gray-200 rounded px-2.5 py-1.5 text-sm focus:ring-1 focus:ring-gray-400 outline-none" /></div><div><label className="block text-xs text-gray-600 mb-0.5">Estágio</label><select value={formOportunidade.estagio} onChange={(e) => setFormOportunidade({...formOportunidade, estagio: e.target.value})} className="w-full border border-gray-200 rounded px-2.5 py-1.5 text-sm focus:ring-1 focus:ring-gray-400 outline-none">{estagios.map((e) => <option key={e} value={e}>{e.charAt(0).toUpperCase()+e.slice(1)}</option>)}</select></div><div><label className="block text-xs text-gray-600 mb-0.5">Data de Início</label><input type="date" value={formOportunidade.data_inicio} onChange={(e) => setFormOportunidade({...formOportunidade, data_inicio: e.target.value})} className="w-full border border-gray-200 rounded px-2.5 py-1.5 text-sm focus:ring-1 focus:ring-gray-400 outline-none" /></div></div><div className="flex gap-2 mt-4"><button onClick={fecharModalOportunidade} className="flex-1 px-3 py-1.5 border border-gray-200 rounded text-xs hover:bg-gray-50">Cancelar</button><button onClick={salvarOportunidade} className="flex-1 px-3 py-1.5 bg-gray-800 text-white rounded text-xs hover:bg-gray-700">{editandoOportunidade ? "Salvar" : "Adicionar"}</button></div></div></div>)}

      {modalVenda && (<div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50"><div className="bg-white rounded-lg border border-gray-200 max-w-xl w-full p-4 max-h-[90vh] overflow-y-auto"><h3 className="text-sm font-semibold mb-3">{editandoVenda ? "Editar Venda" : "Nova Venda"}</h3><div className="space-y-2.5"><div><label className="block text-xs text-gray-600 mb-0.5">Cliente *</label><select value={formVenda.cliente_id} onChange={(e) => setFormVenda({...formVenda, cliente_id: e.target.value})} className="w-full border border-gray-200 rounded px-2.5 py-1.5 text-sm focus:ring-1 focus:ring-gray-400 outline-none"><option value="">Selecione</option>{clientes.map((c) => <option key={c.id} value={c.id}>{c.nome}</option>)}</select></div><div><label className="block text-xs text-gray-600 mb-0.5">Descrição *</label><input type="text" value={formVenda.descricao} onChange={(e) => setFormVenda({...formVenda, descricao: e.target.value})} className="w-full border border-gray-200 rounded px-2.5 py-1.5 text-sm focus:ring-1 focus:ring-gray-400 outline-none" /></div>
      <div><label className="block text-xs text-gray-600 mb-1">Produtos</label><div className="flex gap-2 mb-2"><select id="venda-produto-select" className="flex-1 border border-gray-200 rounded px-2.5 py-1.5 text-sm focus:ring-1 focus:ring-gray-400 outline-none" defaultValue=""><option value="">Selecione um produto</option>{produtos.filter((p) => p.ativo !== false).map((p) => <option key={p.id} value={p.id}>{p.nome} — R$ {fmtBRL(p.preco_base)}</option>)}</select><button type="button" onClick={() => { const sel = document.getElementById("venda-produto-select"); const pid = sel.value; if (!pid) return; const prod = produtos.find((p) => p.id === pid); if (!prod) return; setFormVenda({...formVenda, itens: [...formVenda.itens, { produto_id: prod.id, nome: prod.nome, quantidade: 1, valor_unitario: parseFloat(prod.preco_base || 0) }]}); sel.value = ""; }} className="px-2.5 py-1.5 bg-gray-800 text-white rounded text-xs hover:bg-gray-700 flex items-center gap-1"><Icons.Plus className="w-3 h-3" />Add</button></div>
      {formVenda.itens.length > 0 && (<div className="border border-gray-200 rounded overflow-hidden"><table className="w-full text-sm"><thead className="bg-gray-50 border-b"><tr><th className="px-2 py-1 text-left text-[11px] text-gray-500">Produto</th><th className="px-2 py-1 text-left text-[11px] text-gray-500 w-16">Qtd</th><th className="px-2 py-1 text-left text-[11px] text-gray-500 w-24">Unit.</th><th className="px-2 py-1 text-left text-[11px] text-gray-500 w-24">Subtotal</th><th className="px-2 py-1 w-8"></th></tr></thead><tbody className="divide-y">{formVenda.itens.map((item, idx) => (<tr key={idx}><td className="px-2 py-1 text-xs">{item.nome}</td><td className="px-2 py-1"><input type="number" min="1" value={item.quantidade} onChange={(e) => { const n = [...formVenda.itens]; n[idx] = {...n[idx], quantidade: parseInt(e.target.value)||1}; setFormVenda({...formVenda, itens: n}); }} className="w-14 border rounded px-1.5 py-0.5 text-xs text-center" /></td><td className="px-2 py-1"><input type="number" step="0.01" value={item.valor_unitario} onChange={(e) => { const n = [...formVenda.itens]; n[idx] = {...n[idx], valor_unitario: parseFloat(e.target.value)||0}; setFormVenda({...formVenda, itens: n}); }} className="w-20 border rounded px-1.5 py-0.5 text-xs" /></td><td className="px-2 py-1 text-xs font-medium text-green-700">R$ {fmtBRL(parseFloat(item.valor_unitario||0)*parseFloat(item.quantidade||1))}</td><td className="px-2 py-1"><button type="button" onClick={() => setFormVenda({...formVenda, itens: formVenda.itens.filter((_,i) => i !== idx)})} className="text-gray-400 hover:text-red-600 p-0.5"><Icons.Trash className="w-3 h-3" /></button></td></tr>))}</tbody></table></div>)}</div>
      <div><label className="block text-xs text-gray-600 mb-0.5">Desconto (R$)</label><input type="number" step="0.01" value={formVenda.desconto} onChange={(e) => setFormVenda({...formVenda, desconto: e.target.value})} className="w-full border border-gray-200 rounded px-2.5 py-1.5 text-sm focus:ring-1 focus:ring-gray-400 outline-none" placeholder="0,00" /></div>
      {formVenda.itens.length > 0 ? (<div className="bg-gray-50 rounded p-3 text-sm"><div className="flex justify-between text-gray-600 text-xs"><span>Subtotal:</span><span>R$ {fmtBRL(formVenda.itens.reduce((s, i) => s + parseFloat(i.valor_unitario||0)*parseFloat(i.quantidade||1), 0))}</span></div>{parseFloat(formVenda.desconto||0) > 0 && <div className="flex justify-between text-red-600 text-xs"><span>Desconto:</span><span>- R$ {fmtBRL(formVenda.desconto)}</span></div>}<div className="flex justify-between font-semibold text-green-700 border-t pt-1.5 mt-1.5"><span>Total:</span><span>R$ {fmtBRL(calcularTotalVenda(formVenda.itens, formVenda.desconto))}</span></div></div>) : (<div><label className="block text-xs text-gray-600 mb-0.5">Valor (R$) *</label><input type="number" step="0.01" value={formVenda.valor} onChange={(e) => setFormVenda({...formVenda, valor: e.target.value})} className="w-full border border-gray-200 rounded px-2.5 py-1.5 text-sm focus:ring-1 focus:ring-gray-400 outline-none" /></div>)}
      <div><label className="block text-xs text-gray-600 mb-0.5">Data</label><input type="date" value={formVenda.data_venda} onChange={(e) => setFormVenda({...formVenda, data_venda: e.target.value})} className="w-full border border-gray-200 rounded px-2.5 py-1.5 text-sm focus:ring-1 focus:ring-gray-400 outline-none" /></div>
      <div><label className="block text-xs text-gray-600 mb-0.5">Pagamento</label><select value={formVenda.forma_pagamento} onChange={(e) => setFormVenda({...formVenda, forma_pagamento: e.target.value})} className="w-full border border-gray-200 rounded px-2.5 py-1.5 text-sm focus:ring-1 focus:ring-gray-400 outline-none">{["à vista","parcelado","boleto","cartão","pix"].map((f) => <option key={f} value={f}>{f.charAt(0).toUpperCase()+f.slice(1)}</option>)}</select></div>
      <div><label className="block text-xs text-gray-600 mb-0.5">Observações</label><textarea value={formVenda.observacoes} onChange={(e) => setFormVenda({...formVenda, observacoes: e.target.value})} className="w-full border border-gray-200 rounded px-2.5 py-1.5 text-sm focus:ring-1 focus:ring-gray-400 outline-none" rows="2" /></div></div><div className="flex gap-2 mt-4"><button onClick={fecharModalVenda} className="flex-1 px-3 py-1.5 border border-gray-200 rounded text-xs hover:bg-gray-50">Cancelar</button><button onClick={salvarVenda} className="flex-1 px-3 py-1.5 bg-gray-800 text-white rounded text-xs hover:bg-gray-700">{editandoVenda ? "Salvar" : "Adicionar"}</button></div></div></div>)}

      {modalUsuario && (<div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50"><div className="bg-white rounded-lg border border-gray-200 max-w-sm w-full p-4 max-h-[90vh] overflow-y-auto"><h3 className="text-sm font-semibold mb-3">{editandoUsuario ? "Editar Usuário" : "Novo Usuário"}</h3><div className="space-y-2.5">
        <div><label className="block text-xs text-gray-600 mb-0.5">Email *</label><input type="email" value={formUsuario.email} onChange={(e) => setFormUsuario({...formUsuario, email: e.target.value})} className="w-full border border-gray-200 rounded px-2.5 py-1.5 text-sm focus:ring-1 focus:ring-gray-400 outline-none" placeholder="email@exemplo.com" disabled={!!editandoUsuario} /></div>
        <div><label className="block text-xs text-gray-600 mb-0.5">Perfil</label><select value={formUsuario.role} onChange={(e) => setFormUsuario({...formUsuario, role: e.target.value})} className="w-full border border-gray-200 rounded px-2.5 py-1.5 text-sm focus:ring-1 focus:ring-gray-400 outline-none"><option value="owner">Owner</option><option value="admin">Admin</option><option value="member">Member</option></select></div>
        {editandoUsuario && editandoUsuario.created_at && (<div className="bg-gray-50 border border-gray-200 rounded p-2.5"><p className="text-[11px] text-gray-500">Membro desde: <span className="font-medium text-gray-700">{new Date(editandoUsuario.created_at).toLocaleDateString("pt-BR")}</span></p></div>)}
        </div><div className="flex gap-2 mt-4"><button onClick={fecharModalUsuario} className="flex-1 px-3 py-1.5 border border-gray-200 rounded text-xs hover:bg-gray-50">Cancelar</button><button onClick={salvarUsuario} className="flex-1 px-3 py-1.5 bg-gray-800 text-white rounded text-xs hover:bg-gray-700">{editandoUsuario ? "Salvar" : "Adicionar"}</button></div></div></div>)}

      {modalAgendarComissao && comissaoAgendar && (<div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50"><div className="bg-white rounded-lg border border-gray-200 max-w-xs w-full p-4"><h3 className="text-sm font-semibold mb-3">Agendar Pagamento de Comissão</h3>
        <div className="bg-yellow-50 border border-yellow-200 rounded p-2.5 mb-3">
          <p className="text-xs font-semibold text-gray-700">{getTecnicoNome(comissaoAgendar.tecnico_id)}</p>
          <p className="text-lg font-bold text-blue-700">R$ {fmtBRL(comissaoAgendar.valor)}</p>
          {parseFloat(comissaoAgendar.percentual || 0) > 0 && <p className="text-[10px] text-gray-500">{comissaoAgendar.percentual}% de comissão</p>}
        </div>
        <div className="space-y-2.5">
          <div><label className="block text-xs text-gray-600 mb-0.5">Data do Pagamento *</label><input type="date" value={formAgendarComissao.data_agendamento} onChange={(e) => setFormAgendarComissao({...formAgendarComissao, data_agendamento: e.target.value})} className="w-full border border-gray-200 rounded px-2.5 py-1.5 text-sm focus:ring-1 focus:ring-gray-400 outline-none" /></div>
          <div><label className="block text-xs text-gray-600 mb-0.5">Observações</label><textarea value={formAgendarComissao.observacoes} onChange={(e) => setFormAgendarComissao({...formAgendarComissao, observacoes: e.target.value})} className="w-full border border-gray-200 rounded px-2.5 py-1.5 text-sm focus:ring-1 focus:ring-gray-400 outline-none" rows="2" placeholder="Ex: transferência banco X, data combinada..." /></div>
        </div>
        <div className="flex gap-2 mt-4"><button onClick={fecharModalAgendarComissao} className="flex-1 px-3 py-1.5 border border-gray-200 rounded text-xs hover:bg-gray-50">Cancelar</button><button onClick={agendarComissao} className="flex-1 px-3 py-1.5 bg-yellow-600 text-white rounded text-xs hover:bg-yellow-700 font-medium">Agendar</button></div>
        </div></div>)}

      {modalTecnico && (<div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50"><div className="bg-white rounded-lg border border-gray-200 max-w-sm w-full p-4 max-h-[90vh] overflow-y-auto"><h3 className="text-sm font-semibold mb-3">{editandoTecnico ? "Editar Técnico" : "Novo Técnico"}</h3><div className="space-y-2.5">
        <div><label className="block text-xs text-gray-600 mb-0.5">Nome *</label><input type="text" value={formTecnico.nome} onChange={(e) => setFormTecnico({...formTecnico, nome: e.target.value})} className="w-full border border-gray-200 rounded px-2.5 py-1.5 text-sm focus:ring-1 focus:ring-gray-400 outline-none" /></div>
        <div><label className="block text-xs text-gray-600 mb-0.5">CPF</label><input type="text" value={formTecnico.cpf} onChange={(e) => { const v = e.target.value.replace(/\D/g, "").slice(0, 11); const f = v.length > 9 ? v.replace(/(\d{3})(\d{3})(\d{3})(\d{1,2})/, "$1.$2.$3-$4") : v.length > 6 ? v.replace(/(\d{3})(\d{3})(\d{1,3})/, "$1.$2.$3") : v.length > 3 ? v.replace(/(\d{3})(\d{1,3})/, "$1.$2") : v; setFormTecnico({...formTecnico, cpf: f}); }} placeholder="000.000.000-00" className="w-full border border-gray-200 rounded px-2.5 py-1.5 text-sm focus:ring-1 focus:ring-gray-400 outline-none" /></div>
        <div><label className="block text-xs text-gray-600 mb-0.5">Email</label><input type="email" value={formTecnico.email} onChange={(e) => setFormTecnico({...formTecnico, email: e.target.value})} className="w-full border border-gray-200 rounded px-2.5 py-1.5 text-sm focus:ring-1 focus:ring-gray-400 outline-none" /></div>
        <div><label className="block text-xs text-gray-600 mb-0.5">Telefone</label><input type="tel" value={formTecnico.telefone} onChange={(e) => setFormTecnico({...formTecnico, telefone: e.target.value})} className="w-full border border-gray-200 rounded px-2.5 py-1.5 text-sm focus:ring-1 focus:ring-gray-400 outline-none" /></div>
        <div><label className="block text-xs text-gray-600 mb-0.5">Especialidade</label><input type="text" value={formTecnico.especialidade} onChange={(e) => setFormTecnico({...formTecnico, especialidade: e.target.value})} className="w-full border border-gray-200 rounded px-2.5 py-1.5 text-sm focus:ring-1 focus:ring-gray-400 outline-none" placeholder="Ex: Elétrica, Hidráulica, TI..." /></div>
        <div><label className="block text-xs text-gray-600 mb-0.5">Endereço</label><input type="text" value={formTecnico.endereco} onChange={(e) => setFormTecnico({...formTecnico, endereco: e.target.value})} className="w-full border border-gray-200 rounded px-2.5 py-1.5 text-sm focus:ring-1 focus:ring-gray-400 outline-none" /></div>
        <div><label className="block text-xs text-gray-600 mb-0.5">Observações</label><textarea value={formTecnico.observacoes} onChange={(e) => setFormTecnico({...formTecnico, observacoes: e.target.value})} className="w-full border border-gray-200 rounded px-2.5 py-1.5 text-sm focus:ring-1 focus:ring-gray-400 outline-none" rows="2" /></div>
        <div className="flex items-center gap-2"><input id="ta" type="checkbox" checked={!!formTecnico.ativo} onChange={(e) => setFormTecnico({...formTecnico, ativo: e.target.checked})} /><label htmlFor="ta" className="text-xs text-gray-600">Ativo</label></div>
        </div><div className="flex gap-2 mt-4"><button onClick={fecharModalTecnico} className="flex-1 px-3 py-1.5 border border-gray-200 rounded text-xs hover:bg-gray-50">Cancelar</button><button onClick={salvarTecnico} className="flex-1 px-3 py-1.5 bg-gray-800 text-white rounded text-xs hover:bg-gray-700">{editandoTecnico ? "Salvar" : "Adicionar"}</button></div></div></div>)}

      {modalEncaminhar && osEncaminhar && (<div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50"><div className="bg-white rounded-lg border border-gray-200 max-w-sm w-full p-4"><h3 className="text-sm font-semibold mb-3">Encaminhar para Técnico</h3>
        <div className="bg-gray-50 border border-gray-200 rounded p-2.5 mb-3 space-y-1"><p className="text-[10px] font-semibold text-gray-500 uppercase tracking-wide">Ordem de Serviço</p><div className="flex justify-between text-xs"><span className="font-mono text-gray-700">{osEncaminhar.numero_os}</span><span className="font-medium text-green-700">R$ {fmtBRL(osEncaminhar.valor_total)}</span></div><p className="text-[11px] text-gray-600">{osEncaminhar.descricao}</p><p className="text-[11px] text-gray-500">Cliente: {getClienteNome(osEncaminhar.cliente_id)}</p></div>
        <div className="space-y-2.5">
          <div><label className="block text-xs text-gray-600 mb-0.5">Técnico Responsável *</label><select value={formEncaminhar.tecnico_id} onChange={(e) => setFormEncaminhar({...formEncaminhar, tecnico_id: e.target.value})} className="w-full border border-gray-200 rounded px-2.5 py-1.5 text-sm focus:ring-1 focus:ring-gray-400 outline-none"><option value="">Selecione um técnico</option>{tecnicos.filter((t) => t.ativo !== false).map((t) => <option key={t.id} value={t.id}>{t.nome}{t.especialidade ? ` — ${t.especialidade}` : ""}</option>)}</select></div>
          <div className="grid grid-cols-2 gap-2">
            <div><label className="block text-xs text-gray-600 mb-0.5">Comissão (%)</label><input type="number" step="0.01" min="0" max="100" value={formEncaminhar.comissao_percentual} onChange={(e) => { const pct = parseFloat(e.target.value) || 0; const val = ((pct / 100) * parseFloat(osEncaminhar.valor_total || 0)).toFixed(2); setFormEncaminhar({...formEncaminhar, comissao_percentual: e.target.value, comissao_valor: val}); }} className="w-full border border-gray-200 rounded px-2.5 py-1.5 text-sm focus:ring-1 focus:ring-gray-400 outline-none" placeholder="0" /></div>
            <div><label className="block text-xs text-gray-600 mb-0.5">Comissão (R$)</label><input type="number" step="0.01" min="0" value={formEncaminhar.comissao_valor} onChange={(e) => setFormEncaminhar({...formEncaminhar, comissao_valor: e.target.value})} className="w-full border border-gray-200 rounded px-2.5 py-1.5 text-sm focus:ring-1 focus:ring-gray-400 outline-none" placeholder="0,00" /></div>
          </div>
        </div>
        <div className="flex gap-2 mt-4"><button onClick={fecharModalEncaminhar} className="flex-1 px-3 py-1.5 border border-gray-200 rounded text-xs hover:bg-gray-50">Cancelar</button><button onClick={encaminharParaTecnico} className="flex-1 px-3 py-1.5 bg-blue-700 text-white rounded text-xs hover:bg-blue-800 inline-flex items-center justify-center gap-1"><Icons.ArrowRight className="w-3 h-3" />Encaminhar</button></div></div></div>)}

      {modalTitulo && (() => { const vr = formTitulo.venda_id ? vendas.find((v) => v.id === formTitulo.venda_id) : null; const sv = vr ? vr.valor - titulos.filter((t) => t.venda_id === vr.id && t.status === "pago" && (!editandoTitulo || t.id !== editandoTitulo.id)).reduce((a, t) => a + Number(t.valor), 0) : null; return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50"><div className="bg-white rounded-lg border border-gray-200 max-w-sm w-full p-4"><h3 className="text-sm font-semibold mb-3">{editandoTitulo ? "Editar Título" : "Novo Título"}</h3><div className="space-y-2.5">
        {vr && (<div className="bg-gray-50 border border-gray-200 rounded p-2.5 space-y-1"><p className="text-[10px] font-semibold text-gray-500 uppercase tracking-wide">Venda Relacionada</p><div className="flex justify-between text-xs"><span className="text-gray-700">{vr.descricao}</span><span className="font-medium">R$ {Number(vr.valor).toFixed(2)}</span></div><div className="flex justify-between border-t border-gray-200 pt-1 text-xs"><span className="font-medium text-gray-700">Saldo</span><span className={`font-semibold ${sv > 0 ? "text-yellow-600" : "text-green-600"}`}>R$ {sv.toFixed(2)}</span></div></div>)}
        <div><label className="block text-xs text-gray-600 mb-0.5">Descrição *</label><input type="text" value={formTitulo.descricao} onChange={(e) => setFormTitulo({...formTitulo, descricao: e.target.value})} className="w-full border border-gray-200 rounded px-2.5 py-1.5 text-sm focus:ring-1 focus:ring-gray-400 outline-none" /></div>
        <div><label className="block text-xs text-gray-600 mb-0.5">Valor (R$) *</label><input type="number" step="0.01" value={formTitulo.valor} onChange={(e) => setFormTitulo({...formTitulo, valor: e.target.value})} className="w-full border border-gray-200 rounded px-2.5 py-1.5 text-sm focus:ring-1 focus:ring-gray-400 outline-none" /></div>
        <div><label className="block text-xs text-gray-600 mb-0.5">Emissão</label><input type="date" value={formTitulo.data_emissao} onChange={(e) => setFormTitulo({...formTitulo, data_emissao: e.target.value})} className="w-full border border-gray-200 rounded px-2.5 py-1.5 text-sm focus:ring-1 focus:ring-gray-400 outline-none" /></div>
        <div><label className="block text-xs text-gray-600 mb-0.5">Vencimento *</label><input type="date" value={formTitulo.data_vencimento} onChange={(e) => setFormTitulo({...formTitulo, data_vencimento: e.target.value})} className="w-full border border-gray-200 rounded px-2.5 py-1.5 text-sm focus:ring-1 focus:ring-gray-400 outline-none" /></div>
        <div><label className="block text-xs text-gray-600 mb-0.5">Status</label><select value={formTitulo.status} onChange={(e) => setFormTitulo({...formTitulo, status: e.target.value})} className="w-full border border-gray-200 rounded px-2.5 py-1.5 text-sm focus:ring-1 focus:ring-gray-400 outline-none"><option value="pendente">Pendente</option><option value="pago">Pago</option></select></div>
        </div><div className="flex gap-2 mt-4"><button onClick={fecharModalTitulo} className="flex-1 px-3 py-1.5 border border-gray-200 rounded text-xs hover:bg-gray-50">Cancelar</button><button onClick={salvarTitulo} className="flex-1 px-3 py-1.5 bg-gray-800 text-white rounded text-xs hover:bg-gray-700">{editandoTitulo ? "Salvar" : "Adicionar"}</button></div></div></div>
      ); })()}
    </div>
  );
}

export default App;
