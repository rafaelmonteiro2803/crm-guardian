import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useTenant } from "../contexts/TenantContext";

import { useClientes } from "../hooks/useClientes";
import { useEstoque } from "../hooks/useEstoque";
import { useMovimentosBancarios } from "../hooks/useMovimentosBancarios";
import { useTecnicos } from "../hooks/useTecnicos";
import { useOportunidades } from "../hooks/useOportunidades";
import { useVendas } from "../hooks/useVendas";
import { useTenants } from "../hooks/useTenants";
import { useFornecedores } from "../hooks/useFornecedores";
import { useCentrosCusto } from "../hooks/useCentrosCusto";
import { useContasPagar } from "../hooks/useContasPagar";
import { useProdutos } from "../hooks/useProdutos";
import { useOrdensServico } from "../hooks/useOrdensServico";

import { Icons } from "./Icons";

import { DashboardPage } from "../pages/DashboardPage";
import { ClientesPage } from "../pages/Clientes";
import { UsuariosPage } from "../pages/UsuariosPage";
import { ProdutosPage } from "../pages/ProdutosPage";
import { OrdensServicoPage } from "../pages/OrdensServicoPage";
import { AtendimentosRelatorioPage } from "../pages/AtendimentosRelatorioPage";
import { PipelinePage } from "../pages/Pipeline";
import { VendasPage } from "../pages/Vendas";
import { DocumentosPage } from "../pages/Documentos";
import { FinanceiroPage } from "../pages/Financeiro";
import { TecnicosPage } from "../pages/Tecnicos";
import { ComissoesPage } from "../pages/Comissoes";
import { EstoqueItensPage } from "../pages/EstoqueItens";
import { EstoqueMovimentacoesPage } from "../pages/EstoqueMovimentacoes";
import { ContasBancariasPage } from "../pages/ContasBancarias";
import { MovimentosBancariosPage } from "../pages/MovimentosBancarios";
import { ConciliacaoBancariaPage } from "../pages/ConciliacaoBancaria";
import { TenantsPage } from "../pages/Tenants";
import { FornecedoresPage } from "../pages/Fornecedores";
import { CentrosCustoPage } from "../pages/CentrosCusto";
import { ContasPagarPage } from "../pages/ContasPagar";
import { ContasPagarDashboard } from "../pages/ContasPagarDashboard";

const checkIsMobile = () => {
  const isSmartphone = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  const isNarrow = window.innerWidth <= 768;
  return (isSmartphone || isNarrow) && !sessionStorage.getItem("crm-full-version");
};

const fmtBRL = (v) => parseFloat(v || 0).toLocaleString("pt-BR", { minimumFractionDigits: 2 });

export function AppShell() {
  const { session, handleSignOut } = useAuth();
  const {
    tenantId, tenantNome, tenantSlogan, tenantCor, userRole,
    usuarios, carregarUsuarios, limparDadosTenant,
  } = useTenant();

  const [viewMode, setViewMode] = useState("dashboard");
  const [openDropdown, setOpenDropdown] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(checkIsMobile);

  // ── Feature hooks ────────────────────────────────────────────────────────────

  const { clientes, setClientes, carregar: carregarClientes, salvar: salvarCliente, excluir: excluirCliente } =
    useClientes(tenantId, session?.user?.id);

  const {
    estoqueItens, setEstoqueItens,
    estoqueMovimentacoes, setEstoqueMovimentacoes,
    produtoEstoqueVinculos, setProdutoEstoqueVinculos,
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

  const { oportunidades, setOportunidades, carregarOportunidades, salvarOportunidade, excluirOportunidade, moverOportunidade } =
    useOportunidades(tenantId, session?.user?.id);

  const {
    ordensServico, setOrdensServico,
    carregarOrdensServico, adicionarOrdemServico,
    encaminharParaTecnico, concluirOrdemServico, excluirOrdemServico, salvarEvolucao,
    modalEncaminhar, osEncaminhar, abrirModalEncaminhar, fecharModalEncaminhar,
    modalEvolucao, osEvolucao, abrirModalEvolucao, fecharModalEvolucao,
  } = useOrdensServico(tenantId, session?.user?.id, adicionarComissao);

  const {
    vendas, setVendas,
    titulos, setTitulos,
    carregarVendas, carregarTitulos,
    salvarVenda, excluirVenda,
    salvarTitulo, excluirTitulo,
    marcarComoPago,
  } = useVendas(tenantId, session?.user?.id, adicionarOrdemServico);

  const {
    contasBancarias, setContasBancarias,
    movimentosBancarios, setMovimentosBancarios,
    conciliacoesBancarias, setConciliacoesBancarias,
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

  const { tenants, setTenants, carregar: carregarTodosTenants, salvar: salvarTenant, excluir: excluirTenant } =
    useTenants();

  const { fornecedores, setFornecedores, carregar: carregarFornecedores, salvar: salvarFornecedor, excluir: excluirFornecedor } =
    useFornecedores(tenantId, session?.user?.id);

  const { centrosCusto, setCentrosCusto, carregar: carregarCentrosCusto, salvar: salvarCentroCusto, excluir: excluirCentroCusto } =
    useCentrosCusto(tenantId, session?.user?.id);

  const {
    contasPagar, setContasPagar,
    parcelas: parcelasContasPagar, setParcelas: setParcelasContasPagar,
    carregarContas: carregarContasPagar,
    carregarParcelas: carregarParcelasContasPagar,
    salvarConta: salvarContaPagar,
    excluirConta: excluirContaPagar,
    pagarParcela,
    criarContaDaCompraEstoque,
  } = useContasPagar(tenantId, session?.user?.id);

  const {
    produtos, setProdutos,
    carregarProdutos,
    salvarProduto, excluirProduto,
    modalProduto, editandoProduto, formProduto, setFormProduto,
    abrirModalProduto, fecharModalProduto,
    modalVincularEstoque, vinculoProduto,
    abrirModalVincular, fecharModalVincular,
  } = useProdutos(tenantId, session?.user?.id);

  // ── Data loading ─────────────────────────────────────────────────────────────

  useEffect(() => {
    if (session && tenantId) {
      Promise.all([
        carregarClientes(), carregarUsuarios(), carregarOportunidades(),
        carregarVendas(), carregarTitulos(), carregarProdutos(),
        carregarTecnicos(), carregarOrdensServico(), carregarComissoes(),
        carregarEstoqueItens(), carregarEstoqueMovimentacoes(), carregarProdutoEstoqueVinculos(),
        carregarContasBancarias(), carregarMovimentosBancarios(), carregarConciliacoesBancarias(),
        carregarFornecedores(), carregarCentrosCusto(), carregarContasPagar(), carregarParcelasContasPagar(),
      ]);
    }
  }, [session, tenantId]);

  useEffect(() => {
    if (session && tenantId && userRole === "owner") {
      carregarTodosTenants().catch(() => {});
    }
  }, [session, tenantId, userRole]);

  // ── UI effects ───────────────────────────────────────────────────────────────

  useEffect(() => {
    const handleResize = () => setIsMobile(checkIsMobile());
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (isMobile && viewMode !== "dashboard") setViewMode("dashboard");
  }, [isMobile]);

  useEffect(() => {
    if (!openDropdown) return;
    const close = () => setOpenDropdown(null);
    document.addEventListener("click", close);
    return () => document.removeEventListener("click", close);
  }, [openDropdown]);

  // ── Sign out ─────────────────────────────────────────────────────────────────

  const onSignOut = async () => {
    await handleSignOut();
    limparDadosTenant();
    setClientes([]); setOportunidades([]); setVendas([]); setTitulos([]);
    setProdutos([]); setTecnicos([]); setOrdensServico([]); setComissoes([]);
    setEstoqueItens([]); setEstoqueMovimentacoes([]); setProdutoEstoqueVinculos([]);
    setContasBancarias([]); setMovimentosBancarios([]); setConciliacoesBancarias([]);
    setTenants([]); setFornecedores([]); setCentrosCusto([]);
    setContasPagar([]); setParcelasContasPagar([]);
  };

  // ── Helpers ──────────────────────────────────────────────────────────────────

  const getClienteNome = (id) => clientes.find((c) => c.id === id)?.nome || "N/A";
  const getProdutoNome = (id) => produtos.find((p) => p.id === id)?.nome || null;

  const salvarMovimentacaoComContaPagar = async (form, item) => {
    await salvarMovimentacao(form, item);
    if (form.tipo === "entrada" && form.motivo === "compra") {
      const movimentacaoFake = {
        id: null,
        custo_unitario: form.custo_unitario || item.custo_unitario || 0,
        quantidade: form.quantidade,
        data_movimentacao: form.data_movimentacao || new Date().toISOString().split("T")[0],
      };
      try { await criarContaDaCompraEstoque(movimentacaoFake, item); } catch (e) { console.warn("Erro ao criar conta a pagar automática:", e.message); }
    }
  };

  // ── Navigation ───────────────────────────────────────────────────────────────

  const isOwner = userRole === "owner";
  const navGroups = [
    {
      key: "admin", label: "Administrativo", icon: <Icons.Cog />,
      ...(isOwner ? {
        subgroups: [
          { key: "sistema", label: "Sistema", icon: <Icons.Cog />, items: [{ key: "tenants", label: "Tenants", icon: <Icons.Cog />, count: tenants.length }] },
          { key: "admin_geral", label: "Geral", icon: <Icons.User />, items: [{ key: "usuarios", label: "Usuários", icon: <Icons.User />, count: usuarios.length }, { key: "tecnicos", label: "Profissionais / Técnicos", icon: <Icons.Cog />, count: tecnicos.length }, { key: "produtos", label: "Produtos", icon: <Icons.ShoppingCart />, count: produtos.length }] },
        ],
      } : {
        items: [{ key: "usuarios", label: "Usuários", icon: <Icons.User />, count: usuarios.length }, { key: "tecnicos", label: "Profissionais / Técnicos", icon: <Icons.Cog />, count: tecnicos.length }, { key: "produtos", label: "Produtos", icon: <Icons.ShoppingCart />, count: produtos.length }],
      }),
    },
    {
      key: "financeiro_menu", label: "Financeiro", icon: <Icons.DollarSign />,
      subgroups: [
        { key: "bancario", label: "Bancário", icon: <Icons.CreditCard />, items: [{ key: "contas_bancarias", label: "Contas Bancárias", icon: <Icons.CreditCard />, count: contasBancarias.filter((c) => c.ativo).length }, { key: "movimentos_bancarios", label: "Movimentos Bancários", icon: <Icons.ArrowUpCircle />, count: movimentosBancarios.length }, { key: "conciliacao_bancaria", label: "Conciliação Bancária", icon: <Icons.CheckCircle />, count: conciliacoesBancarias.length }] },
        { key: "financeiro_pagar", label: "Contas a Pagar", icon: <Icons.DollarSign />, items: [{ key: "contas_pagar_dashboard", label: "Dashboard Financeiro", icon: <Icons.BarChart />, count: undefined }, { key: "contas_pagar", label: "Contas a Pagar", icon: <Icons.DollarSign />, count: parcelasContasPagar.filter((p) => p.status === "em_aberto").length }, { key: "fornecedores", label: "Fornecedores", icon: <Icons.User />, count: fornecedores.filter((f) => f.ativo).length }, { key: "centros_custo", label: "Centros de Custo", icon: <Icons.ClipboardList />, count: centrosCusto.filter((c) => c.ativo).length }] },
      ],
    },
    {
      key: "comercial", label: "Vendas", icon: <Icons.TrendingUp />,
      items: [{ key: "clientes", label: "Clientes", icon: <Icons.User />, count: clientes.length }, { key: "pipeline", label: "Pipeline", icon: <Icons.TrendingUp />, count: oportunidades.length }, { key: "vendas", label: "Vendas", icon: <Icons.ShoppingCart />, count: vendas.length }, { key: "documentos", label: "Documentos", icon: <Icons.FileText />, count: undefined }],
    },
    {
      key: "operacional", label: "Operacional", icon: <Icons.ClipboardList />,
      subgroups: [
        { key: "operacional_geral", label: "Operacional", icon: <Icons.ClipboardList />, items: [{ key: "financeiro", label: "Financeiro", icon: <Icons.CreditCard />, count: titulos.length }, { key: "ordens_servico", label: "Ordens de Serviço", icon: <Icons.ClipboardList />, count: ordensServico.length }, { key: "comissoes", label: "Comissões", icon: <Icons.DollarSign />, count: comissoes.filter((c) => c.status !== "pago").length }] },
        { key: "estoque", label: "Estoque", icon: <Icons.Package />, items: [{ key: "estoque_itens", label: "Itens de Estoque", icon: <Icons.Package />, count: estoqueItens.filter((e) => e.ativo).length }, { key: "estoque_movimentacoes", label: "Movimentações", icon: <Icons.ArrowUpCircle />, count: estoqueMovimentacoes.length }] },
      ],
    },
    {
      key: "relatorios", label: "Relatórios", icon: <Icons.BarChart />,
      items: [{ key: "dashboard", label: "Dashboard", icon: <Icons.BarChart /> }, { key: "atendimentos_relatorio", label: "Atendimentos", icon: <Icons.ClipboardCheck /> }],
    },
  ];

  // ── Render helpers ───────────────────────────────────────────────────────────

  const renderNavItem = (item) => (
    <button
      key={item.key}
      onClick={() => { setViewMode(item.key); setOpenDropdown(null); }}
      className={`w-full flex items-center gap-2 px-3 py-2 text-xs text-left transition-colors ${viewMode === item.key ? "bg-gray-100 text-gray-900 font-medium" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"}`}
    >
      {item.icon}<span className="flex-1">{item.label}</span>
      {item.count !== undefined && <span className="text-gray-400 text-[10px] tabular-nums">{item.count}</span>}
    </button>
  );

  const renderNavItemIndented = (item) => (
    <button
      key={item.key}
      onClick={() => { setViewMode(item.key); setOpenDropdown(null); }}
      className={`w-full flex items-center gap-2 px-5 py-2 text-xs text-left transition-colors ${viewMode === item.key ? "bg-gray-100 text-gray-900 font-medium" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"}`}
    >
      {item.icon}<span className="flex-1">{item.label}</span>
      {item.count !== undefined && <span className="text-gray-400 text-[10px] tabular-nums">{item.count}</span>}
    </button>
  );

  const renderMobileNavItem = (item, indent = false) => (
    <button
      key={item.key}
      onClick={() => { setViewMode(item.key); setMobileMenuOpen(false); }}
      className={`w-full flex items-center gap-2 ${indent ? "px-7" : "px-5"} py-2 text-xs rounded transition-colors ${viewMode === item.key ? "bg-gray-800 text-white" : "text-gray-600 hover:bg-black/5"}`}
    >
      {item.icon}<span className="flex-1">{item.label}</span>
      {item.count !== undefined && <span className="text-[10px] tabular-nums opacity-60">{item.count}</span>}
    </button>
  );

  // ── Page routing ─────────────────────────────────────────────────────────────

  const renderPage = () => {
    switch (viewMode) {
      case "dashboard":
        return <DashboardPage clientes={clientes} oportunidades={oportunidades} vendas={vendas} titulos={titulos} fmtBRL={fmtBRL} />;
      case "clientes":
        return <ClientesPage clientes={clientes} onSalvar={salvarCliente} onExcluir={excluirCliente} />;
      case "usuarios":
        return <UsuariosPage />;
      case "produtos":
        return (
          <ProdutosPage
            produtos={produtos}
            estoqueItens={estoqueItens}
            produtoEstoqueVinculos={produtoEstoqueVinculos}
            fmtBRL={fmtBRL}
            salvarProduto={salvarProduto}
            excluirProduto={excluirProduto}
            modalProduto={modalProduto}
            editandoProduto={editandoProduto}
            formProduto={formProduto}
            setFormProduto={setFormProduto}
            abrirModalProduto={abrirModalProduto}
            fecharModalProduto={fecharModalProduto}
            modalVincularEstoque={modalVincularEstoque}
            vinculoProduto={vinculoProduto}
            abrirModalVincular={abrirModalVincular}
            fecharModalVincular={fecharModalVincular}
            salvarVinculo={salvarVinculo}
            excluirVinculo={excluirVinculo}
          />
        );
      case "pipeline":
        return <PipelinePage oportunidades={oportunidades} clientes={clientes} produtos={produtos} fmtBRL={fmtBRL} getClienteNome={getClienteNome} getProdutoNome={getProdutoNome} onSalvar={salvarOportunidade} onExcluir={excluirOportunidade} onMover={moverOportunidade} />;
      case "vendas":
        return <VendasPage vendas={vendas} clientes={clientes} produtos={produtos} fmtBRL={fmtBRL} onSalvar={salvarVenda} onExcluir={excluirVenda} getClienteNome={getClienteNome} />;
      case "documentos":
        return <DocumentosPage vendas={vendas} clientes={clientes} fmtBRL={fmtBRL} />;
      case "financeiro":
        return <FinanceiroPage titulos={titulos} vendas={vendas} fmtBRL={fmtBRL} onSalvar={salvarTitulo} onExcluir={excluirTitulo} onMarcarPago={marcarComoPago} />;
      case "tecnicos":
        return <TecnicosPage tecnicos={tecnicos} onSalvar={salvarTecnico} onExcluir={excluirTecnico} />;
      case "ordens_servico":
        return (
          <OrdensServicoPage
            ordensServico={ordensServico}
            tecnicos={tecnicos}
            getClienteNome={getClienteNome}
            getTecnicoNome={getTecnicoNome}
            fmtBRL={fmtBRL}
            encaminharParaTecnico={encaminharParaTecnico}
            concluirOrdemServico={concluirOrdemServico}
            excluirOrdemServico={excluirOrdemServico}
            salvarEvolucao={salvarEvolucao}
            modalEncaminhar={modalEncaminhar}
            osEncaminhar={osEncaminhar}
            abrirModalEncaminhar={abrirModalEncaminhar}
            fecharModalEncaminhar={fecharModalEncaminhar}
            modalEvolucao={modalEvolucao}
            osEvolucao={osEvolucao}
            abrirModalEvolucao={abrirModalEvolucao}
            fecharModalEvolucao={fecharModalEvolucao}
          />
        );
      case "atendimentos_relatorio":
        return <AtendimentosRelatorioPage clientes={clientes} vendas={vendas} ordensServico={ordensServico} fmtBRL={fmtBRL} />;
      case "comissoes":
        return <ComissoesPage comissoes={comissoes} tecnicos={tecnicos} ordensServico={ordensServico} getTecnicoNome={getTecnicoNome} getClienteNome={getClienteNome} fmtBRL={fmtBRL} onAgendar={agendarComissao} onPagar={pagarComissao} onExcluir={excluirComissao} />;
      case "estoque_itens":
        return <EstoqueItensPage estoqueItens={estoqueItens} onSalvarItem={salvarEstoqueItem} onExcluirItem={excluirEstoqueItem} onSalvarMovimentacao={salvarMovimentacaoComContaPagar} fmtBRL={fmtBRL} fornecedores={fornecedores} />;
      case "estoque_movimentacoes":
        return <EstoqueMovimentacoesPage estoqueMovimentacoes={estoqueMovimentacoes} estoqueItens={estoqueItens} onSalvarMovimentacao={salvarMovimentacaoComContaPagar} onExcluirMovimentacao={excluirMovimentacao} fmtBRL={fmtBRL} />;
      case "contas_bancarias":
        return <ContasBancariasPage contasBancarias={contasBancarias} onSalvar={salvarContaBancaria} onExcluir={excluirContaBancaria} />;
      case "movimentos_bancarios":
        return <MovimentosBancariosPage movimentosBancarios={movimentosBancarios} contasBancarias={contasBancarias} onSalvar={salvarMovimentoBancario} onExcluir={excluirMovimentoBancario} fmtBRL={fmtBRL} />;
      case "conciliacao_bancaria":
        return <ConciliacaoBancariaPage conciliacoesBancarias={conciliacoesBancarias} titulos={titulos} movimentosBancarios={movimentosBancarios} contasBancarias={contasBancarias} onSalvar={salvarConciliacaoBancaria} onExcluir={excluirConciliacaoBancaria} fmtBRL={fmtBRL} />;
      case "tenants":
        return isOwner ? <TenantsPage tenants={tenants} onSalvar={salvarTenant} onExcluir={excluirTenant} /> : null;
      case "contas_pagar_dashboard":
        return <ContasPagarDashboard contasPagar={contasPagar} parcelas={parcelasContasPagar} fornecedores={fornecedores} fmtBRL={fmtBRL} />;
      case "contas_pagar":
        return <ContasPagarPage contasPagar={contasPagar} parcelas={parcelasContasPagar} fornecedores={fornecedores} centrosCusto={centrosCusto} contasBancarias={contasBancarias} onSalvar={salvarContaPagar} onExcluir={excluirContaPagar} onPagar={(parcela, formPagamento) => pagarParcela(parcela, formPagamento, contasBancarias)} fmtBRL={fmtBRL} />;
      case "fornecedores":
        return <FornecedoresPage fornecedores={fornecedores} onSalvar={salvarFornecedor} onExcluir={excluirFornecedor} />;
      case "centros_custo":
        return <CentrosCustoPage centrosCusto={centrosCusto} onSalvar={salvarCentroCusto} onExcluir={excluirCentroCusto} />;
      default:
        return null;
    }
  };

  // ── Layout ───────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-gray-50">
      <header
        style={tenantCor ? { backgroundColor: tenantCor } : {}}
        className={`${tenantCor ? "" : "bg-white"} border-b border-gray-200 px-4 py-2`}
      >
        <div className="max-w-7xl mx-auto flex items-center gap-3">
          <h1 className="text-sm font-semibold text-gray-800 tracking-wide whitespace-nowrap flex-shrink-0">
            {tenantNome || "CRM GuardIAn"}
          </h1>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-0.5 flex-1">
            {navGroups.map((group) => {
              const allItems = group.subgroups ? group.subgroups.flatMap((sg) => sg.items) : (group.items || []);
              const isActive = allItems.some((i) => i.key === viewMode);
              const isOpen = openDropdown === group.key;
              return (
                <div key={group.key} className="relative">
                  <button
                    onClick={(e) => { e.stopPropagation(); setOpenDropdown(isOpen ? null : group.key); }}
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-medium transition-colors ${isActive ? "bg-gray-800 text-white" : "text-gray-600 hover:text-gray-900 hover:bg-black/5"}`}
                  >
                    {group.icon}<span>{group.label}</span>
                    <Icons.ChevronDown className={`w-3 h-3 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
                  </button>
                  {isOpen && (
                    <div className="absolute top-full left-0 mt-1 w-56 bg-white border border-gray-200 rounded-lg shadow-lg z-50 py-1 overflow-hidden">
                      {group.subgroups ? (
                        group.subgroups.map((subgroup, sgIdx) => (
                          <div key={subgroup.key}>
                            {sgIdx > 0 && <div className="border-t border-gray-100 my-1" />}
                            <div className="px-3 py-1.5 text-[10px] font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
                              {subgroup.icon}<span>{subgroup.label}</span>
                            </div>
                            {subgroup.items.map(renderNavItemIndented)}
                          </div>
                        ))
                      ) : (
                        group.items.map(renderNavItem)
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </nav>

          {/* Desktop: user + logout */}
          <div className="hidden md:flex items-center gap-2 flex-shrink-0 ml-auto">
            {tenantSlogan && <span className="text-xs text-gray-500 italic">{tenantSlogan}</span>}
            {tenantSlogan && <span className="text-gray-300">|</span>}
            <span className="text-xs text-gray-400">{session.user.email}</span>
            <button onClick={onSignOut} className="inline-flex items-center gap-1 text-xs text-gray-500 hover:text-gray-700 px-2 py-1 rounded hover:bg-black/5">
              <Icons.LogOut />Sair
            </button>
          </div>

          {/* Mobile: logout + hamburger */}
          <div className="md:hidden ml-auto flex items-center gap-1">
            {isMobile ? (
              <>
                {tenantSlogan && <span className="text-xs text-gray-500 italic mr-1">{tenantSlogan}</span>}
                <button onClick={onSignOut} className="inline-flex items-center gap-1 text-xs text-gray-500 hover:text-gray-700 px-2 py-1 rounded hover:bg-black/5"><Icons.LogOut />Sair</button>
              </>
            ) : (
              <>
                <button onClick={onSignOut} className="inline-flex items-center p-1.5 rounded text-gray-500 hover:text-gray-700 hover:bg-black/5"><Icons.LogOut /></button>
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
            {navGroups.map((group) => (
              <div key={group.key} className="mt-1">
                <div className="px-3 py-1.5 text-[10px] font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
                  {group.icon}{group.label}
                </div>
                {group.subgroups ? (
                  group.subgroups.map((subgroup, sgIdx) => (
                    <div key={subgroup.key}>
                      {sgIdx > 0 && <div className="border-t border-gray-100 mx-3 my-1" />}
                      <div className="px-5 py-1 text-[10px] font-medium text-gray-400 flex items-center gap-1.5">{subgroup.icon}<span>{subgroup.label}</span></div>
                      {subgroup.items.map((item) => renderMobileNavItem(item, true))}
                    </div>
                  ))
                ) : (
                  group.items.map((item) => renderMobileNavItem(item))
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
        {renderPage()}
      </main>

      <footer className="border-t border-gray-200 bg-white mt-6">
        <div className="max-w-7xl mx-auto px-4 py-3 text-center">
          <p className="text-xs text-gray-400">© 2026 Guardian Tech. Todos os direitos reservados.</p>
        </div>
      </footer>

      {isMobile && (
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 py-3 text-center shadow-md">
          <p className="text-[11px] text-gray-400 mb-1">Você está na versão mobile</p>
          <button
            onClick={() => { sessionStorage.setItem("crm-full-version", "1"); window.location.reload(); }}
            className="text-xs text-blue-600 hover:text-blue-800 font-medium underline underline-offset-2"
          >
            Abrir versão completa →
          </button>
        </div>
      )}
    </div>
  );
}
