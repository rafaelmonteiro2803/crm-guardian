import React, { useState, useEffect } from "react";
import { supabase } from "./lib/supabase";
import { Icons } from "./components/Icons";
import { DataGrid } from "./components/DataGrid";
import { useClientes } from "./hooks/useClientes";
import { ClientesPage } from "./pages/Clientes";
import { useEstoque } from "./hooks/useEstoque";
import { EstoqueItensPage } from "./pages/EstoqueItens";
import { useMovimentosBancarios } from "./hooks/useMovimentosBancarios";
import { ContasBancariasPage } from "./pages/ContasBancarias";
import { MovimentosBancariosPage } from "./pages/MovimentosBancarios";
import { ConciliacaoBancariaPage } from "./pages/ConciliacaoBancaria";
import { DocumentosPage } from "./pages/Documentos";
import { EstoqueMovimentacoesPage } from "./pages/EstoqueMovimentacoes";
import { VincularEstoqueModal } from "./components/modals/VincularEstoqueModal";
import { useTecnicos } from "./hooks/useTecnicos";
import { TecnicosPage } from "./pages/Tecnicos";
import { ComissoesPage } from "./pages/Comissoes";
import { EncaminharModal } from "./components/modals/EncaminharModal";
import { EvolucaoModal } from "./components/modals/EvolucaoModal";
import { useTenants } from "./hooks/useTenants";
import { TenantsPage } from "./pages/Tenants";
import { useFornecedores } from "./hooks/useFornecedores";
import { FornecedoresPage } from "./pages/Fornecedores";
import { useCentrosCusto } from "./hooks/useCentrosCusto";
import { CentrosCustoPage } from "./pages/CentrosCusto";
import { useContasPagar } from "./hooks/useContasPagar";
import { ContasPagarPage } from "./pages/ContasPagar";
import { ContasPagarDashboard } from "./pages/ContasPagarDashboard";

const checkIsMobile = () => {
  const isSmartphone = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  const isNarrow = window.innerWidth <= 768;
  return (isSmartphone || isNarrow) && !sessionStorage.getItem('crm-full-version');
};

function App() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tenantId, setTenantId] = useState(null);
  const [tenantNome, setTenantNome] = useState("");
  const [usuarios, setUsuarios] = useState([]);
  const [oportunidades, setOportunidades] = useState([]);
  const [vendas, setVendas] = useState([]);
  const [titulos, setTitulos] = useState([]);
  const [viewMode, setViewMode] = useState("dashboard");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [selectedTenantId, setSelectedTenantId] = useState(() => localStorage.getItem('crm_selectedTenantId') || "");
  const [tenantsList, setTenantsList] = useState([]);
  const [tenantLocked, setTenantLocked] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [authMessage, setAuthMessage] = useState("");
  const [modalOportunidade, setModalOportunidade] = useState(false);
  const [modalVenda, setModalVenda] = useState(false);
  const [modalTitulo, setModalTitulo] = useState(false);
  const [editandoOportunidade, setEditandoOportunidade] = useState(null);
  const [editandoVenda, setEditandoVenda] = useState(null);
  const [editandoTitulo, setEditandoTitulo] = useState(null);
  const [produtos, setProdutos] = useState([]);
  const [modalProduto, setModalProduto] = useState(false);
  const [modalUsuario, setModalUsuario] = useState(false);
  const [editandoProduto, setEditandoProduto] = useState(null);
  const [editandoUsuario, setEditandoUsuario] = useState(null);
  const [formOportunidade, setFormOportunidade] = useState({ titulo: "", cliente_id: "", produto_id: "", valor: "", estagio: "prospecção", data_inicio: new Date().toISOString().split("T")[0] });
  const [formVenda, setFormVenda] = useState({ cliente_id: "", descricao: "", valor: "", data_venda: new Date().toISOString().split("T")[0], forma_pagamento: "à vista", observacoes: "", desconto: "", itens: [] });
  const [formTitulo, setFormTitulo] = useState({ venda_id: "", descricao: "", valor: "", data_emissao: new Date().toISOString().split("T")[0], data_vencimento: "", status: "pendente" });
  const [formProduto, setFormProduto] = useState({ nome: "", tipo: "produto", descricao: "", categoria: "", preco_base: "", custo: "", unidade_medida: "", ativo: true, observacoes: "" });
  const [formUsuario, setFormUsuario] = useState({ user_id: "", role: "member" });
  const [usuariosSistema, setUsuariosSistema] = useState([]);
  const [modoModalUsuario, setModoModalUsuario] = useState("vincular"); // "vincular" | "criar"
  const [formNovoUsuario, setFormNovoUsuario] = useState({ email: "", role: "member" });
  const [ordensServico, setOrdensServico] = useState([]);
  const [modalEncaminhar, setModalEncaminhar] = useState(false);
  const [osEncaminhar, setOsEncaminhar] = useState(null);
  const [modalEvolucao, setModalEvolucao] = useState(false);
  const [osEvolucao, setOsEvolucao] = useState(null);
  const [atendimentoBusca, setAtendimentoBusca] = useState("");
  const [atendimentoClienteSelecionado, setAtendimentoClienteSelecionado] = useState(null);
  const [atendimentoVendaSelecionada, setAtendimentoVendaSelecionada] = useState(null);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(checkIsMobile);
  const [tenantCor, setTenantCor] = useState(null);
  const [tenantSlogan, setTenantSlogan] = useState("");
  const [userRole, setUserRole] = useState(null);
  const estagios = ["prospecção", "qualificação", "proposta", "negociação", "fechado", "cancelado"];
  // VincularEstoqueModal é acionado pela view de Produtos (ainda no App)
  const [modalVincularEstoque, setModalVincularEstoque] = useState(false);
  const [vinculoProduto, setVinculoProduto] = useState(null);

  const {
    clientes,
    setClientes,
    carregar: carregarClientes,
    salvar: salvarCliente,
    excluir: excluirCliente,
  } = useClientes(tenantId, session?.user?.id);

  const {
    estoqueItens,
    setEstoqueItens,
    estoqueMovimentacoes,
    setEstoqueMovimentacoes,
    produtoEstoqueVinculos,
    setProdutoEstoqueVinculos,
    carregarItens: carregarEstoqueItens,
    carregarMovimentacoes: carregarEstoqueMovimentacoes,
    carregarVinculos: carregarProdutoEstoqueVinculos,
    salvarItem: salvarEstoqueItem,
    excluirItem: excluirEstoqueItem,
    salvarMovimentacao,
    excluirMovimentacao,
    salvarVinculo,
    excluirVinculo,
  } = useEstoque(tenantId, session?.user?.id);

  const {
    tecnicos, setTecnicos,
    comissoes, setComissoes,
    carregarTecnicos,
    carregarComissoes,
    salvarTecnico,
    excluirTecnico,
    agendarComissao,
    pagarComissao,
    excluirComissao,
    adicionarComissao,
    getTecnicoNome,
  } = useTecnicos(tenantId, session?.user?.id);

  const {
    contasBancarias,
    setContasBancarias,
    movimentosBancarios,
    setMovimentosBancarios,
    conciliacoesBancarias,
    setConciliacoesBancarias,
    carregarContas: carregarContasBancarias,
    salvarConta: salvarContaBancaria,
    excluirConta: excluirContaBancaria,
    carregarMovimentos: carregarMovimentosBancarios,
    salvarMovimento: salvarMovimentoBancario,
    excluirMovimento: excluirMovimentoBancario,
    carregarConciliacoes: carregarConciliacoesBancarias,
    salvarConciliacao: salvarConciliacaoBancaria,
    excluirConciliacao: excluirConciliacaoBancaria,
  } = useMovimentosBancarios(tenantId, session?.user?.id);

  const {
    tenants,
    setTenants,
    carregar: carregarTodosTenants,
    salvar: salvarTenant,
    excluir: excluirTenant,
  } = useTenants();

  const {
    fornecedores,
    setFornecedores,
    carregar: carregarFornecedores,
    salvar: salvarFornecedor,
    excluir: excluirFornecedor,
  } = useFornecedores(tenantId, session?.user?.id);

  const {
    centrosCusto,
    setCentrosCusto,
    carregar: carregarCentrosCusto,
    salvar: salvarCentroCusto,
    excluir: excluirCentroCusto,
  } = useCentrosCusto(tenantId, session?.user?.id);

  const {
    contasPagar,
    setContasPagar,
    parcelas: parcelasContasPagar,
    setParcelas: setParcelasContasPagar,
    carregarContas: carregarContasPagar,
    carregarParcelas: carregarParcelasContasPagar,
    salvarConta: salvarContaPagar,
    excluirConta: excluirContaPagar,
    pagarParcela,
    criarContaDaCompraEstoque,
  } = useContasPagar(tenantId, session?.user?.id);

  useEffect(() => { supabase.auth.getSession().then(({ data: { session } }) => { setSession(session); setLoading(false); }); const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => setSession(session)); return () => subscription.unsubscribe(); }, []);

  useEffect(() => { carregarTenants(); }, []);
  useEffect(() => {
    if (selectedTenantId) {
      localStorage.setItem('crm_selectedTenantId', selectedTenantId);
    }
  }, [selectedTenantId]);
  useEffect(() => {
    if (!openDropdown) return;
    const close = () => setOpenDropdown(null);
    document.addEventListener("click", close);
    return () => document.removeEventListener("click", close);
  }, [openDropdown]);

  useEffect(() => {
    const handleResize = () => setIsMobile(checkIsMobile());
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (isMobile && viewMode !== 'dashboard') setViewMode('dashboard');
  }, [isMobile]);
  const carregarTenants = async () => {
    const { data } = await supabase.rpc("get_all_tenants");
    if (data) {
      setTenantsList(data);
      if (window.location.hostname === 'admin.salaisis.com') {
        const tenant = data.find(t => t.nome.toLowerCase().replace(/\s+/g, '') === 'salaisis');
        if (tenant) {
          setSelectedTenantId(tenant.id);
          setTenantLocked(true);
        }
      }
    }
  };

  useEffect(() => {
    if (session) {
      carregarTenant();
    } else {
      setTenantId(null);
      setTenantNome("");
      setTenantSlogan("");
    }
  }, [session]);

  const carregarTenant = async () => {
    if (selectedTenantId) {
      const { data } = await supabase
        .from("tenant_members")
        .select("tenant_id, role, tenants(id, nome, slogan, cor)")
        .eq("user_id", session.user.id)
        .eq("tenant_id", selectedTenantId)
        .single();
      if (data) {
        setTenantId(data.tenant_id);
        setTenantNome(data.tenants?.nome || "");
        setTenantSlogan(data.tenants?.slogan || "");
        setTenantCor(data.tenants?.cor || null);
        setUserRole(data.role || "member");
      } else {
        setAuthMessage("Erro: Você não tem acesso a este tenant.");
        await supabase.auth.signOut();
      }
    } else {
      const { data } = await supabase
        .from("tenant_members")
        .select("tenant_id, role, tenants(id, nome, slogan, cor)")
        .eq("user_id", session.user.id)
        .limit(1)
        .single();
      if (data) {
        setTenantId(data.tenant_id);
        setTenantNome(data.tenants?.nome || "");
        setTenantSlogan(data.tenants?.slogan || "");
        setTenantCor(data.tenants?.cor || null);
        setUserRole(data.role || "member");
      }
    }
  };

  useEffect(() => { if (session && tenantId) carregarTodosDados(); }, [session, tenantId]);
  useEffect(() => { if (session && tenantId && userRole === "owner") carregarDadosOwner(); }, [session, tenantId, userRole]);

  const carregarTodosDados = async () => { await Promise.all([carregarClientes(), carregarUsuarios(), carregarOportunidades(), carregarVendas(), carregarTitulos(), carregarProdutos(), carregarTecnicos(), carregarOrdensServico(), carregarComissoes(), carregarEstoqueItens(), carregarEstoqueMovimentacoes(), carregarProdutoEstoqueVinculos(), carregarContasBancarias(), carregarMovimentosBancarios(), carregarConciliacoesBancarias(), carregarFornecedores(), carregarCentrosCusto(), carregarContasPagar(), carregarParcelasContasPagar()]); };
  const carregarDadosOwner = async () => { try { await carregarTodosTenants(); } catch (e) { /* usuário sem permissão de owner — ignorar */ } };
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
  const carregarOrdensServico = async () => { const { data } = await supabase.from("ordens_servico").select("*").eq("tenant_id", tenantId).order("created_at", { ascending: false }); if (data) setOrdensServico(data); };

  const handleSignUp = async (e) => { e.preventDefault(); setAuthMessage(""); const { error } = await supabase.auth.signUp({ email, password }); setAuthMessage(error ? "Erro: " + error.message : "Conta criada! Verifique seu email."); };
  const handleSignIn = async (e) => { e.preventDefault(); setAuthMessage(""); const { error } = await supabase.auth.signInWithPassword({ email, password }); if (error) setAuthMessage("Erro: " + error.message); };
  const handleSignOut = async () => { await supabase.auth.signOut(); localStorage.removeItem('crm_selectedTenantId'); setClientes([]); setUsuarios([]); setUsuariosSistema([]); setOportunidades([]); setVendas([]); setTitulos([]); setProdutos([]); setTecnicos([]); setOrdensServico([]); setComissoes([]); setEstoqueItens([]); setEstoqueMovimentacoes([]); setProdutoEstoqueVinculos([]); setContasBancarias([]); setMovimentosBancarios([]); setConciliacoesBancarias([]); setTenants([]); setFornecedores([]); setCentrosCusto([]); setContasPagar([]); setParcelasContasPagar([]); setTenantId(null); setTenantNome(""); setTenantSlogan(""); setSelectedTenantId(""); setUserRole(null); };

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

  const encaminharParaTecnico = async (form) => {
    if (!form.tecnico_id) return alert("Selecione um técnico!");
    const payload = { tecnico_id: form.tecnico_id, comissao_percentual: parseFloat(form.comissao_percentual || 0), comissao_valor: parseFloat(form.comissao_valor || 0), status: "em_atendimento", data_atribuicao: new Date().toISOString() };
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
        if (comissaoData) adicionarComissao(comissaoData[0]);
      }
    }
  };
  const excluirOrdemServico = async (id) => { if (!confirm("Excluir ordem de serviço?")) return; await supabase.from("ordens_servico").delete().eq("id", id); setOrdensServico(ordensServico.filter((o) => o.id !== id)); };

  const salvarUsuario = async () => {
    if (editandoUsuario) {
      const { data, error } = await supabase.rpc("update_tenant_member_role", { p_member_id: editandoUsuario.id, p_tenant_id: tenantId, p_role: formUsuario.role || "member" });
      if (error) return alert(`Erro ao atualizar membro: ${error.message}`);
      if (data && data.length > 0) { setUsuarios(usuarios.map((u) => (u.id === editandoUsuario.id ? data[0] : u))); } else { await carregarUsuarios(); }
    } else {
      if (!formUsuario.user_id) return alert("Selecione um usuário!");
      const { data, error } = await supabase.rpc("add_tenant_member_by_userid", { p_tenant_id: tenantId, p_user_id: formUsuario.user_id, p_role: formUsuario.role || "member" });
      if (error) return alert(`Erro ao vincular usuário: ${error.message}`);
      if (data && data.length > 0) { setUsuarios([data[0], ...usuarios]); } else { await carregarUsuarios(); }
    }
    fecharModalUsuario();
  };

  const criarEVincularUsuario = async () => {
    if (!formNovoUsuario.email?.trim()) return alert("Digite o email do novo usuário!");
    const { data: { session: adminSession } } = await supabase.auth.getSession();
    const tempPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-4).toUpperCase() + "1!";
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({ email: formNovoUsuario.email.trim(), password: tempPassword });
    if (signUpError) return alert(`Erro ao criar usuário: ${signUpError.message}`);
    if (!signUpData?.user?.id) return alert("Erro ao criar usuário: dados não retornados.");
    const newUserId = signUpData.user.id;
    if (adminSession) {
      const { data: { session: currentSession } } = await supabase.auth.getSession();
      if (!currentSession || currentSession.user.id !== adminSession.user.id) {
        await supabase.auth.setSession({ access_token: adminSession.access_token, refresh_token: adminSession.refresh_token });
      }
    }
    const { data, error } = await supabase.rpc("add_tenant_member_by_userid", { p_tenant_id: tenantId, p_user_id: newUserId, p_role: formNovoUsuario.role || "member" });
    if (error) return alert(`Usuário criado mas erro ao vincular ao tenant: ${error.message}`);
    if (data && data.length > 0) { setUsuarios([data[0], ...usuarios]); } else { await carregarUsuarios(); }
    fecharModalUsuario();
    alert(`Usuário criado! Um email de confirmação foi enviado para ${formNovoUsuario.email.trim()}.`);
  };

  const excluirUsuario = async (id) => {
    if (!confirm("Excluir usuário?")) return;
    const { error } = await supabase.rpc("remove_tenant_member", { p_member_id: id, p_tenant_id: tenantId });
    if (error) return alert(`Erro ao remover membro: ${error.message}`);
    setUsuarios(usuarios.filter((u) => u.id !== id));
  };

  const abrirModalOportunidade = (o = null) => { if (o) { setEditandoOportunidade(o); setFormOportunidade({ titulo: o.titulo, cliente_id: o.cliente_id, produto_id: o.produto_id || "", valor: o.valor.toString(), estagio: o.estagio, data_inicio: o.data_inicio }); } setModalOportunidade(true); };
  const fecharModalOportunidade = () => { setModalOportunidade(false); setEditandoOportunidade(null); setFormOportunidade({ titulo: "", cliente_id: "", produto_id: "", valor: "", estagio: "prospecção", data_inicio: new Date().toISOString().split("T")[0] }); };
  const abrirModalVenda = (v = null) => { if (v) { setEditandoVenda(v); setFormVenda({ cliente_id: v.cliente_id, descricao: v.descricao, valor: v.valor.toString(), data_venda: v.data_venda, forma_pagamento: v.forma_pagamento, observacoes: v.observacoes || "", desconto: (v.desconto ?? 0).toString(), itens: v.itens || [] }); } setModalVenda(true); };
  const fecharModalVenda = () => { setModalVenda(false); setEditandoVenda(null); setFormVenda({ cliente_id: "", descricao: "", valor: "", data_venda: new Date().toISOString().split("T")[0], forma_pagamento: "à vista", observacoes: "", desconto: "", itens: [] }); };
  const abrirModalTitulo = (t = null) => { if (t) { setEditandoTitulo(t); setFormTitulo({ venda_id: t.venda_id || "", descricao: t.descricao, valor: t.valor.toString(), data_emissao: t.data_emissao, data_vencimento: t.data_vencimento, status: t.status }); } setModalTitulo(true); };
  const fecharModalTitulo = () => { setModalTitulo(false); setEditandoTitulo(null); setFormTitulo({ venda_id: "", descricao: "", valor: "", data_emissao: new Date().toISOString().split("T")[0], data_vencimento: "", status: "pendente" }); };
  const abrirModalProduto = (p = null) => { if (p) { setEditandoProduto(p); setFormProduto({ nome: p.nome || "", tipo: p.tipo || "produto", descricao: p.descricao || "", categoria: p.categoria || "", preco_base: (p.preco_base ?? 0).toString(), custo: (p.custo ?? 0).toString(), unidade_medida: p.unidade_medida || "", ativo: p.ativo ?? true, observacoes: p.observacoes || "" }); } setModalProduto(true); };
  const fecharModalProduto = () => { setModalProduto(false); setEditandoProduto(null); setFormProduto({ nome: "", tipo: "produto", descricao: "", categoria: "", preco_base: "", custo: "", unidade_medida: "", ativo: true, observacoes: "" }); };

  const abrirModalUsuario = async (u = null) => {
    if (u) {
      setEditandoUsuario(u);
      setFormUsuario({ user_id: u.user_id || "", role: u.role || "member" });
    } else {
      setEditandoUsuario(null);
      setFormUsuario({ user_id: "", role: "member" });
      const { data, error } = await supabase.rpc("get_system_users_for_tenant", { p_tenant_id: tenantId });
      if (!error && data) setUsuariosSistema(data);
    }
    setModalUsuario(true);
  };
  const fecharModalUsuario = () => { setModalUsuario(false); setEditandoUsuario(null); setFormUsuario({ user_id: "", role: "member" }); setUsuariosSistema([]); setModoModalUsuario("vincular"); setFormNovoUsuario({ email: "", role: "member" }); };

  const abrirModalEncaminhar = (os) => { setOsEncaminhar(os); setModalEncaminhar(true); };
  const fecharModalEncaminhar = () => { setModalEncaminhar(false); setOsEncaminhar(null); };
  const abrirModalEvolucao = (os) => { setOsEvolucao(os); setModalEvolucao(true); };
  const fecharModalEvolucao = () => { setModalEvolucao(false); setOsEvolucao(null); };
  const salvarEvolucao = async (osId, textoFinal) => {
    const { data } = await supabase.from("ordens_servico").update({ observacoes: textoFinal }).eq("id", osId).select();
    if (data) setOrdensServico(ordensServico.map((o) => (o.id === osId ? data[0] : o)));
    fecharModalEvolucao();
  };

  const getClienteNome = (id) => clientes.find((c) => c.id === id)?.nome || "N/A";
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
          <div><label className="block text-xs font-medium text-gray-600 mb-1">Tenant</label><select value={selectedTenantId} onChange={(e) => setSelectedTenantId(e.target.value)} className={`w-full border border-gray-200 rounded px-2.5 py-1.5 text-sm focus:ring-1 focus:ring-gray-400 outline-none${tenantLocked ? " bg-gray-100 cursor-not-allowed" : ""}`} disabled={tenantLocked} required><option value="">Selecione o tenant...</option>{tenantsList.map((t) => <option key={t.id} value={t.id}>{t.nome}</option>)}</select></div>
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
  const isOwner = userRole === "owner";
  const navGroups = [
    {
      key: "relatorios",
      label: "Relatórios",
      icon: <Icons.BarChart />,
      items: [
        { key: "dashboard", label: "Dashboard", icon: <Icons.BarChart /> },
        { key: "atendimentos_relatorio", label: "Atendimentos", icon: <Icons.ClipboardCheck /> },
      ],
    },
    ...(isOwner ? [{
      key: "sistema",
      label: "Sistema",
      icon: <Icons.Cog />,
      items: [
        { key: "tenants", label: "Tenants", icon: <Icons.Cog />, count: tenants.length },
      ],
    }] : []),
    {
      key: "admin",
      label: "Administrativo",
      icon: <Icons.Cog />,
      items: [
        { key: "usuarios", label: "Usuários", icon: <Icons.User />, count: usuarios.length },
        { key: "tecnicos", label: "Profissionais / Técnicos", icon: <Icons.Cog />, count: tecnicos.length },
        { key: "produtos", label: "Produtos", icon: <Icons.ShoppingCart />, count: produtos.length },
      ],
    },
    {
      key: "financeiro_menu",
      label: "Financeiro",
      icon: <Icons.DollarSign />,
      subgroups: [
        {
          key: "bancario",
          label: "Bancário",
          icon: <Icons.CreditCard />,
          items: [
            { key: "contas_bancarias", label: "Contas Bancárias", icon: <Icons.CreditCard />, count: contasBancarias.filter((c) => c.ativo).length },
            { key: "movimentos_bancarios", label: "Movimentos Bancários", icon: <Icons.ArrowUpCircle />, count: movimentosBancarios.length },
            { key: "conciliacao_bancaria", label: "Conciliação Bancária", icon: <Icons.CheckCircle />, count: conciliacoesBancarias.length },
          ],
        },
        {
          key: "financeiro_pagar",
          label: "Contas a Pagar",
          icon: <Icons.DollarSign />,
          items: [
            { key: "contas_pagar_dashboard", label: "Dashboard Financeiro", icon: <Icons.BarChart />, count: undefined },
            { key: "contas_pagar", label: "Contas a Pagar", icon: <Icons.DollarSign />, count: parcelasContasPagar.filter((p) => p.status === "em_aberto").length },
            { key: "fornecedores", label: "Fornecedores", icon: <Icons.User />, count: fornecedores.filter((f) => f.ativo).length },
            { key: "centros_custo", label: "Centros de Custo", icon: <Icons.ClipboardList />, count: centrosCusto.filter((c) => c.ativo).length },
          ],
        },
      ],
    },
    {
      key: "comercial",
      label: "Vendas",
      icon: <Icons.TrendingUp />,
      items: [
        { key: "clientes", label: "Clientes", icon: <Icons.User />, count: clientes.length },
        { key: "pipeline", label: "Pipeline", icon: <Icons.TrendingUp />, count: oportunidades.length },
        { key: "vendas", label: "Vendas", icon: <Icons.ShoppingCart />, count: vendas.length },
        { key: "documentos", label: "Documentos", icon: <Icons.FileText />, count: undefined },
      ],
    },
    {
      key: "operacional",
      label: "Operacional",
      icon: <Icons.ClipboardList />,
      items: [
        { key: "financeiro", label: "Financeiro", icon: <Icons.CreditCard />, count: titulos.length },
        { key: "ordens_servico", label: "Ordens de Serviço", icon: <Icons.ClipboardList />, count: ordensServico.length },
        { key: "comissoes", label: "Comissões", icon: <Icons.DollarSign />, count: comissoes.filter((c) => c.status !== "pago").length },
      ],
    },
    {
      key: "estoque",
      label: "Estoque",
      icon: <Icons.Package />,
      items: [
        { key: "estoque_itens", label: "Itens de Estoque", icon: <Icons.Package />, count: estoqueItens.filter((e) => e.ativo).length },
        { key: "estoque_movimentacoes", label: "Movimentações", icon: <Icons.ArrowUpCircle />, count: estoqueMovimentacoes.length },
      ],
    },
  ];
  // Wrapper para salvarMovimentacao que auto-cria conta a pagar quando motivo = 'compra'
  const salvarMovimentacaoComContaPagar = async (form, item) => {
    await salvarMovimentacao(form, item);
    if (form.tipo === "entrada" && form.motivo === "compra") {
      const movimentacaoFake = {
        id: null, // será null porque não temos o id real aqui ainda
        custo_unitario: form.custo_unitario || item.custo_unitario || 0,
        quantidade: form.quantidade,
        data_movimentacao: form.data_movimentacao || new Date().toISOString().split("T")[0],
      };
      try {
        await criarContaDaCompraEstoque(movimentacaoFake, item);
      } catch (e) {
        console.warn("Erro ao criar conta a pagar automática:", e.message);
      }
    }
  };

  const actBtns = (onEdit, onDel) => (<div className="flex items-center gap-1"><button onClick={onEdit} className="text-gray-500 hover:text-gray-700 hover:bg-gray-100 p-1 rounded"><Icons.Edit /></button><button onClick={onDel} className="text-gray-400 hover:text-red-600 hover:bg-red-50 p-1 rounded"><Icons.Trash /></button></div>);

  return (
    <div className="min-h-screen bg-gray-50">
      <header style={tenantCor ? { backgroundColor: tenantCor } : {}} className={`${tenantCor ? "" : "bg-white"} border-b border-gray-200 px-4 py-2`}>
        <div className="max-w-7xl mx-auto flex items-center gap-3">
          {/* Logo */}
          <h1 className="text-sm font-semibold text-gray-800 tracking-wide whitespace-nowrap flex-shrink-0">{tenantNome || "CRM GuardIAn"}</h1>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-0.5 flex-1">
            {navGroups.map(group => {
              const allItems = group.subgroups ? group.subgroups.flatMap(sg => sg.items) : (group.items || []);
              const isActive = allItems.some(i => i.key === viewMode);
              const isOpen = openDropdown === group.key;
              return (
                <div key={group.key} className="relative">
                  <button onClick={(e) => { e.stopPropagation(); setOpenDropdown(isOpen ? null : group.key); }} className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-medium transition-colors ${isActive ? "bg-gray-800 text-white" : "text-gray-600 hover:text-gray-900 hover:bg-black/5"}`}>
                    {group.icon}<span>{group.label}</span><Icons.ChevronDown className={`w-3 h-3 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
                  </button>
                  {isOpen && (
                    <div className="absolute top-full left-0 mt-1 w-56 bg-white border border-gray-200 rounded-lg shadow-lg z-50 py-1 overflow-hidden">
                      {group.subgroups ? (
                        group.subgroups.map((subgroup, sgIdx) => (
                          <div key={subgroup.key}>
                            {sgIdx > 0 && <div className="border-t border-gray-100 my-1" />}
                            <div className="px-3 py-1.5 text-[10px] font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">{subgroup.icon}<span>{subgroup.label}</span></div>
                            {subgroup.items.map(item => (
                              <button key={item.key} onClick={() => { setViewMode(item.key); setOpenDropdown(null); }} className={`w-full flex items-center gap-2 px-5 py-2 text-xs text-left transition-colors ${viewMode === item.key ? "bg-gray-100 text-gray-900 font-medium" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"}`}>
                                {item.icon}<span className="flex-1">{item.label}</span>{item.count !== undefined && <span className="text-gray-400 text-[10px] tabular-nums">{item.count}</span>}
                              </button>
                            ))}
                          </div>
                        ))
                      ) : (
                        group.items.map(item => (
                          <button key={item.key} onClick={() => { setViewMode(item.key); setOpenDropdown(null); }} className={`w-full flex items-center gap-2 px-3 py-2 text-xs text-left transition-colors ${viewMode === item.key ? "bg-gray-100 text-gray-900 font-medium" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"}`}>
                            {item.icon}<span className="flex-1">{item.label}</span>{item.count !== undefined && <span className="text-gray-400 text-[10px] tabular-nums">{item.count}</span>}
                          </button>
                        ))
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </nav>

          {/* Desktop: user info + logout */}
          <div className="hidden md:flex items-center gap-2 flex-shrink-0 ml-auto">
            {tenantSlogan && <span className="text-xs text-gray-500 italic">{tenantSlogan}</span>}
            {tenantSlogan && <span className="text-gray-300">|</span>}
            <span className="text-xs text-gray-400">{session.user.email}</span>
            <button onClick={handleSignOut} className="inline-flex items-center gap-1 text-xs text-gray-500 hover:text-gray-700 px-2 py-1 rounded hover:bg-black/5"><Icons.LogOut />Sair</button>
          </div>

          {/* Mobile: logout + hamburger (ou apenas logout no modo smartphone) */}
          <div className="md:hidden ml-auto flex items-center gap-1">
            {isMobile ? (
              <>
                {tenantSlogan && <span className="text-xs text-gray-500 italic mr-1">{tenantSlogan}</span>}
                <button onClick={handleSignOut} className="inline-flex items-center gap-1 text-xs text-gray-500 hover:text-gray-700 px-2 py-1 rounded hover:bg-black/5"><Icons.LogOut />Sair</button>
              </>
            ) : (
              <>
                <button onClick={handleSignOut} className="inline-flex items-center p-1.5 rounded text-gray-500 hover:text-gray-700 hover:bg-black/5"><Icons.LogOut /></button>
                <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="inline-flex items-center justify-center p-1.5 rounded text-gray-600 hover:text-gray-900 hover:bg-black/5">
                  {mobileMenuOpen ? <Icons.X /> : <Icons.Menu />}
                </button>
              </>
            )}
          </div>
        </div>

        {/* Mobile menu panel */}
        {!isMobile && mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 mt-2 py-2 max-w-7xl mx-auto">
            {navGroups.map(group => (
              <div key={group.key} className="mt-1">
                <div className="px-3 py-1.5 text-[10px] font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">{group.icon}{group.label}</div>
                {group.subgroups ? (
                  group.subgroups.map((subgroup, sgIdx) => (
                    <div key={subgroup.key}>
                      {sgIdx > 0 && <div className="border-t border-gray-100 mx-3 my-1" />}
                      <div className="px-5 py-1 text-[10px] font-medium text-gray-400 flex items-center gap-1.5">{subgroup.icon}<span>{subgroup.label}</span></div>
                      {subgroup.items.map(item => (
                        <button key={item.key} onClick={() => { setViewMode(item.key); setMobileMenuOpen(false); }} className={`w-full flex items-center gap-2 px-7 py-2 text-xs rounded transition-colors ${viewMode === item.key ? "bg-gray-800 text-white" : "text-gray-600 hover:bg-black/5"}`}>
                          {item.icon}<span className="flex-1">{item.label}</span>{item.count !== undefined && <span className="text-[10px] tabular-nums opacity-60">{item.count}</span>}
                        </button>
                      ))}
                    </div>
                  ))
                ) : (
                  group.items.map(item => (
                    <button key={item.key} onClick={() => { setViewMode(item.key); setMobileMenuOpen(false); }} className={`w-full flex items-center gap-2 px-5 py-2 text-xs rounded transition-colors ${viewMode === item.key ? "bg-gray-800 text-white" : "text-gray-600 hover:bg-black/5"}`}>
                      {item.icon}<span className="flex-1">{item.label}</span>{item.count !== undefined && <span className="text-[10px] tabular-nums opacity-60">{item.count}</span>}
                    </button>
                  ))
                )}
              </div>
            ))}
            <div className="border-t border-gray-100 mt-2 pt-2 px-3">
              <div className="text-xs font-medium text-gray-600">{tenantNome}</div>
              <div className="text-[11px] text-gray-400">{session.user.email}</div>
            </div>
          </div>
        )}
      </header>

      <main className={`max-w-7xl mx-auto px-4 py-4${isMobile ? " pb-20" : ""}`}>
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
          <ClientesPage
            clientes={clientes}
            onSalvar={salvarCliente}
            onExcluir={excluirCliente}
          />
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
              { key: "insumos", label: "Insumos Vinculados", filterable: false, render: (p) => { const vinculos = produtoEstoqueVinculos.filter((v) => v.produto_id === p.id); if (!vinculos.length) return <span className="text-gray-300 text-[11px]">Nenhum</span>; return <div className="space-y-0.5">{vinculos.slice(0, 2).map((v) => <div key={v.id} className="text-[11px] text-gray-600"><span className="font-medium">{estoqueItens.find((e) => e.id === v.estoque_item_id)?.nome || "N/A"}</span> <span className="text-gray-400">× {parseFloat(v.quantidade_usada).toLocaleString("pt-BR", { maximumFractionDigits: 3 })}</span></div>)}{vinculos.length > 2 && <div className="text-[10px] text-gray-400">+{vinculos.length - 2} mais</div>}</div>; } },
              { key: "ativo", label: "Status", render: (p) => p.ativo ? <span className="px-1.5 py-0.5 rounded text-[11px] bg-green-50 text-green-700">Ativo</span> : <span className="px-1.5 py-0.5 rounded text-[11px] bg-gray-100 text-gray-500">Inativo</span>, filterValue: (p) => p.ativo ? "Ativo" : "Inativo" },
            ]} data={produtos} actions={(p) => (
              <div className="flex items-center gap-1">
                <button onClick={() => { setVinculoProduto(p); setModalVincularEstoque(true); }} title="Gerenciar insumos do estoque vinculados" className="text-blue-600 hover:bg-blue-50 px-1.5 py-0.5 rounded text-[11px] font-medium flex items-center gap-0.5"><Icons.Link className="w-3 h-3" />Insumos</button>
                <button onClick={() => abrirModalProduto(p)} className="text-gray-500 hover:text-gray-700 hover:bg-gray-100 p-1 rounded"><Icons.Edit /></button>
                <button onClick={() => excluirProduto(p.id)} className="text-gray-400 hover:text-red-600 hover:bg-red-50 p-1 rounded"><Icons.Trash /></button>
              </div>
            )} emptyMessage="Nenhum produto cadastrado." />
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

        {viewMode === "documentos" && (
          <DocumentosPage
            vendas={vendas}
            clientes={clientes}
            fmtBRL={fmtBRL}
          />
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
          <TecnicosPage tecnicos={tecnicos} onSalvar={salvarTecnico} onExcluir={excluirTecnico} />
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
                <button onClick={() => abrirModalEvolucao(o)} title="Evolução do Atendimento" className="text-purple-600 hover:bg-purple-50 p-1 rounded"><Icons.BookOpen /></button>
                {o.status !== "atendimento_concluido" && <button onClick={() => abrirModalEncaminhar(o)} className="text-blue-600 hover:bg-blue-50 px-1.5 py-0.5 rounded text-[11px] font-medium whitespace-nowrap">Encaminhar</button>}
                {o.status === "em_atendimento" && <button onClick={() => concluirOrdemServico(o.id)} className="text-green-600 hover:bg-green-50 px-1.5 py-0.5 rounded text-[11px] font-medium whitespace-nowrap">Concluir</button>}
                <button onClick={() => excluirOrdemServico(o.id)} className="text-gray-400 hover:text-red-600 hover:bg-red-50 p-1 rounded"><Icons.Trash /></button>
              </div>
            )} emptyMessage="Nenhuma ordem de serviço. Registre uma venda para gerar automaticamente." />
          </div>
        )}

        {viewMode === "atendimentos_relatorio" && (
          <div className="space-y-4">
            <h2 className="text-sm font-semibold text-gray-700">Atendimentos</h2>
            <div className="bg-white border border-gray-200 rounded p-4 space-y-3">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Buscar Cliente</label>
                <div className="relative">
                  <Icons.Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                  <input
                    type="text"
                    value={atendimentoBusca}
                    onChange={(e) => { setAtendimentoBusca(e.target.value); setAtendimentoClienteSelecionado(null); setAtendimentoVendaSelecionada(null); }}
                    placeholder="Digite o nome do cliente..."
                    className="w-full border border-gray-200 rounded pl-8 pr-2.5 py-1.5 text-sm focus:ring-1 focus:ring-gray-400 outline-none"
                  />
                </div>
              </div>
              {atendimentoBusca.trim().length > 0 && !atendimentoClienteSelecionado && (
                <div className="border border-gray-200 rounded overflow-hidden">
                  {clientes.filter((c) => c.nome.toLowerCase().includes(atendimentoBusca.toLowerCase())).length === 0 ? (
                    <p className="text-xs text-gray-400 p-3 text-center">Nenhum cliente encontrado.</p>
                  ) : (
                    clientes.filter((c) => c.nome.toLowerCase().includes(atendimentoBusca.toLowerCase())).map((c) => (
                      <button key={c.id} onClick={() => { setAtendimentoClienteSelecionado(c); setAtendimentoBusca(c.nome); setAtendimentoVendaSelecionada(null); }} className="w-full flex items-center gap-2 px-3 py-2 text-xs text-left hover:bg-gray-50 border-b border-gray-100 last:border-b-0">
                        <Icons.User className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                        <span className="font-medium text-gray-800">{c.nome}</span>
                        {c.telefone && <span className="text-gray-400 ml-auto">{c.telefone}</span>}
                      </button>
                    ))
                  )}
                </div>
              )}
            </div>

            {atendimentoClienteSelecionado && (
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <h3 className="text-xs font-semibold text-gray-700">Vendas de {atendimentoClienteSelecionado.nome}</h3>
                  <button onClick={() => { setAtendimentoClienteSelecionado(null); setAtendimentoVendaSelecionada(null); setAtendimentoBusca(""); }} className="text-[11px] text-gray-400 hover:text-gray-600 underline">limpar</button>
                </div>
                {vendas.filter((v) => v.cliente_id === atendimentoClienteSelecionado.id).length === 0 ? (
                  <div className="bg-white border border-gray-200 rounded p-6 text-center text-xs text-gray-400">Nenhuma venda encontrada para este cliente.</div>
                ) : (
                  <div className="grid gap-2">
                    {vendas.filter((v) => v.cliente_id === atendimentoClienteSelecionado.id).map((v) => (
                      <button key={v.id} onClick={() => setAtendimentoVendaSelecionada(atendimentoVendaSelecionada?.id === v.id ? null : v)} className={`w-full text-left bg-white border rounded p-3 hover:border-gray-400 transition-colors ${atendimentoVendaSelecionada?.id === v.id ? "border-gray-800 ring-1 ring-gray-800" : "border-gray-200"}`}>
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-medium text-gray-800">{v.descricao}</span>
                          <span className="text-xs font-semibold text-green-700">R$ {fmtBRL(v.valor)}</span>
                        </div>
                        <div className="flex items-center gap-3 mt-1">
                          <span className="text-[11px] text-gray-400">{new Date(v.data_venda).toLocaleDateString("pt-BR")}</span>
                          <span className="text-[11px] text-gray-400 capitalize">{v.forma_pagamento}</span>
                          {(() => { const os = ordensServico.find((o) => o.venda_id === v.id); return os ? <span className="text-[11px] text-purple-600 font-medium">OS: {os.numero_os}</span> : null; })()}
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {atendimentoVendaSelecionada && (
              <div className="bg-white border border-gray-200 rounded p-4 space-y-3">
                <h3 className="text-xs font-semibold text-gray-700 flex items-center gap-1.5"><Icons.BookOpen className="w-3.5 h-3.5 text-purple-600" />Evolução do Atendimento</h3>
                {(() => {
                  const os = ordensServico.find((o) => o.venda_id === atendimentoVendaSelecionada.id);
                  if (!os) return <p className="text-xs text-gray-400 italic">Nenhuma ordem de serviço encontrada para esta venda.</p>;
                  return (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-[11px] text-gray-500">
                        <span>OS: <span className="font-mono font-medium">{os.numero_os}</span></span>
                        <span>·</span>
                        <span className={os.status === "atendimento_concluido" ? "text-green-600 font-medium" : os.status === "em_atendimento" ? "text-blue-600 font-medium" : "text-gray-500"}>{os.status === "atendimento_concluido" ? "Concluído" : os.status === "em_atendimento" ? "Em Atendimento" : "Aguardando"}</span>
                      </div>
                      {os.observacoes ? (
                        <div className="bg-gray-50 border border-gray-200 rounded p-3 text-xs text-gray-700 whitespace-pre-wrap leading-relaxed font-mono">
                          {os.observacoes}
                        </div>
                      ) : (
                        <p className="text-xs text-gray-400 italic bg-gray-50 border border-gray-100 rounded p-3">Nenhuma evolução registrada para este atendimento.</p>
                      )}
                    </div>
                  );
                })()}
              </div>
            )}
          </div>
        )}

        {viewMode === "comissoes" && (
          <ComissoesPage
            comissoes={comissoes}
            tecnicos={tecnicos}
            ordensServico={ordensServico}
            getTecnicoNome={getTecnicoNome}
            getClienteNome={getClienteNome}
            fmtBRL={fmtBRL}
            onAgendar={agendarComissao}
            onPagar={pagarComissao}
            onExcluir={excluirComissao}
          />
        )}
        {viewMode === "estoque_itens" && (
          <EstoqueItensPage
            estoqueItens={estoqueItens}
            onSalvarItem={salvarEstoqueItem}
            onExcluirItem={excluirEstoqueItem}
            onSalvarMovimentacao={salvarMovimentacaoComContaPagar}
            fmtBRL={fmtBRL}
          />
        )}

        {viewMode === "estoque_movimentacoes" && (
          <EstoqueMovimentacoesPage
            estoqueMovimentacoes={estoqueMovimentacoes}
            estoqueItens={estoqueItens}
            onSalvarMovimentacao={salvarMovimentacaoComContaPagar}
            onExcluirMovimentacao={excluirMovimentacao}
            fmtBRL={fmtBRL}
          />
        )}

        {viewMode === "contas_bancarias" && (
          <ContasBancariasPage
            contasBancarias={contasBancarias}
            onSalvar={salvarContaBancaria}
            onExcluir={excluirContaBancaria}
          />
        )}

        {viewMode === "movimentos_bancarios" && (
          <MovimentosBancariosPage
            movimentosBancarios={movimentosBancarios}
            contasBancarias={contasBancarias}
            onSalvar={salvarMovimentoBancario}
            onExcluir={excluirMovimentoBancario}
            fmtBRL={fmtBRL}
          />
        )}

        {viewMode === "conciliacao_bancaria" && (
          <ConciliacaoBancariaPage
            conciliacoesBancarias={conciliacoesBancarias}
            titulos={titulos}
            movimentosBancarios={movimentosBancarios}
            contasBancarias={contasBancarias}
            onSalvar={salvarConciliacaoBancaria}
            onExcluir={excluirConciliacaoBancaria}
            fmtBRL={fmtBRL}
          />
        )}

        {viewMode === "tenants" && isOwner && (
          <TenantsPage
            tenants={tenants}
            onSalvar={salvarTenant}
            onExcluir={excluirTenant}
          />
        )}

        {viewMode === "contas_pagar_dashboard" && (
          <ContasPagarDashboard
            contasPagar={contasPagar}
            parcelas={parcelasContasPagar}
            fornecedores={fornecedores}
            fmtBRL={fmtBRL}
          />
        )}

        {viewMode === "contas_pagar" && (
          <ContasPagarPage
            contasPagar={contasPagar}
            parcelas={parcelasContasPagar}
            fornecedores={fornecedores}
            centrosCusto={centrosCusto}
            contasBancarias={contasBancarias}
            onSalvar={salvarContaPagar}
            onExcluir={excluirContaPagar}
            onPagar={(parcela, formPagamento) => pagarParcela(parcela, formPagamento, contasBancarias)}
            fmtBRL={fmtBRL}
          />
        )}

        {viewMode === "fornecedores" && (
          <FornecedoresPage
            fornecedores={fornecedores}
            onSalvar={salvarFornecedor}
            onExcluir={excluirFornecedor}
          />
        )}

        {viewMode === "centros_custo" && (
          <CentrosCustoPage
            centrosCusto={centrosCusto}
            onSalvar={salvarCentroCusto}
            onExcluir={excluirCentroCusto}
          />
        )}
      </main>

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
        {!editandoUsuario && (<div className="flex gap-1 mb-1"><button onClick={() => setModoModalUsuario("vincular")} className={`flex-1 px-2 py-1 text-xs rounded border ${modoModalUsuario === "vincular" ? "bg-gray-800 text-white border-gray-800" : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"}`}>Vincular existente</button><button onClick={() => setModoModalUsuario("criar")} className={`flex-1 px-2 py-1 text-xs rounded border ${modoModalUsuario === "criar" ? "bg-gray-800 text-white border-gray-800" : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"}`}>Criar novo</button></div>)}
        {!editandoUsuario && modoModalUsuario === "vincular" && (<div><label className="block text-xs text-gray-600 mb-0.5">Usuário *</label>{usuariosSistema.length === 0 ? (<p className="text-xs text-gray-400 italic">Nenhum usuário disponível. Use "Criar novo" para cadastrar.</p>) : (<select value={formUsuario.user_id} onChange={(e) => setFormUsuario({...formUsuario, user_id: e.target.value})} className="w-full border border-gray-200 rounded px-2.5 py-1.5 text-sm focus:ring-1 focus:ring-gray-400 outline-none"><option value="">Selecione um usuário...</option>{usuariosSistema.map((u) => <option key={u.user_id} value={u.user_id}>{u.email}</option>)}</select>)}</div>)}
        {!editandoUsuario && modoModalUsuario === "criar" && (<div className="space-y-2"><div><label className="block text-xs text-gray-600 mb-0.5">Email *</label><input type="email" value={formNovoUsuario.email} onChange={(e) => setFormNovoUsuario({...formNovoUsuario, email: e.target.value})} placeholder="email@exemplo.com" className="w-full border border-gray-200 rounded px-2.5 py-1.5 text-sm focus:ring-1 focus:ring-gray-400 outline-none" /></div><p className="text-[11px] text-gray-400">Uma senha temporária será gerada e um email de confirmação enviado ao usuário.</p></div>)}
        {editandoUsuario && (<div className="bg-gray-50 border border-gray-100 rounded px-2.5 py-1.5"><p className="text-xs text-gray-500">Email: <span className="font-medium text-gray-700">{editandoUsuario.email}</span></p></div>)}
        <div><label className="block text-xs text-gray-600 mb-0.5">Perfil</label><select value={editandoUsuario ? formUsuario.role : (modoModalUsuario === "criar" ? formNovoUsuario.role : formUsuario.role)} onChange={(e) => { if (editandoUsuario) { setFormUsuario({...formUsuario, role: e.target.value}); } else if (modoModalUsuario === "criar") { setFormNovoUsuario({...formNovoUsuario, role: e.target.value}); } else { setFormUsuario({...formUsuario, role: e.target.value}); } }} className="w-full border border-gray-200 rounded px-2.5 py-1.5 text-sm focus:ring-1 focus:ring-gray-400 outline-none"><option value="owner">Owner</option><option value="admin">Admin</option><option value="member">Member</option></select></div>
        {editandoUsuario && editandoUsuario.created_at && (<div className="bg-gray-50 border border-gray-200 rounded p-2.5"><p className="text-[11px] text-gray-500">Membro desde: <span className="font-medium text-gray-700">{new Date(editandoUsuario.created_at).toLocaleDateString("pt-BR")}</span></p></div>)}
        </div><div className="flex gap-2 mt-4"><button onClick={fecharModalUsuario} className="flex-1 px-3 py-1.5 border border-gray-200 rounded text-xs hover:bg-gray-50">Cancelar</button><button onClick={!editandoUsuario && modoModalUsuario === "criar" ? criarEVincularUsuario : salvarUsuario} disabled={!editandoUsuario && modoModalUsuario === "vincular" && !formUsuario.user_id} className="flex-1 px-3 py-1.5 bg-gray-800 text-white rounded text-xs hover:bg-gray-700 disabled:opacity-50">{editandoUsuario ? "Salvar" : modoModalUsuario === "criar" ? "Criar e Vincular" : "Vincular"}</button></div></div></div>)}

      {modalEvolucao && osEvolucao && (
        <EvolucaoModal
          aberto={modalEvolucao}
          os={osEvolucao}
          onFechar={fecharModalEvolucao}
          onSalvar={salvarEvolucao}
        />
      )}

      {modalEncaminhar && osEncaminhar && (
        <EncaminharModal
          os={osEncaminhar}
          tecnicos={tecnicos}
          getClienteNome={getClienteNome}
          fmtBRL={fmtBRL}
          onEncaminhar={encaminharParaTecnico}
          onFechar={fecharModalEncaminhar}
        />
      )}

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



      <VincularEstoqueModal
        aberto={modalVincularEstoque}
        produto={vinculoProduto}
        estoqueItens={estoqueItens}
        vinculos={produtoEstoqueVinculos}
        onSalvar={(form) => salvarVinculo(form, vinculoProduto?.id)}
        onExcluir={excluirVinculo}
        onClose={() => { setModalVincularEstoque(false); setVinculoProduto(null); }}
      />

      {/* Rodapé */}
      <footer className="border-t border-gray-200 bg-white mt-6">
        <div className="max-w-7xl mx-auto px-4 py-3 text-center">
          <p className="text-xs text-gray-400">© 2026 Guardian Tech. Todos os direitos reservados.</p>
        </div>
      </footer>

      {/* Barra fixa de acesso à versão completa — visível apenas em smartphones */}
      {isMobile && (
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 py-3 text-center shadow-md">
          <p className="text-[11px] text-gray-400 mb-1">Você está na versão mobile</p>
          <button
            onClick={() => { sessionStorage.setItem('crm-full-version', '1'); window.location.reload(); }}
            className="text-xs text-blue-600 hover:text-blue-800 font-medium underline underline-offset-2"
          >
            Abrir versão completa →
          </button>
        </div>
      )}
    </div>
  );
}

export default App;
