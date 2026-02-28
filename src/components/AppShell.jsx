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

import { buildNavGroups } from "../config/navigationConfig";
import { renderRoute } from "../config/routesConfig";
import { AppHeader } from "./shell/AppHeader";
import { AppFooter } from "./shell/AppFooter";
import { MobileBanner } from "./shell/MobileBanner";

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
  const [usuariosEditUserId, setUsuariosEditUserId] = useState(null);

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

  // Quando um título de venda é marcado como pago, gera conciliação automática (recebido)
  const marcarComoPagoComConciliacao = async (id) => {
    const titulo = await marcarComoPago(id);
    if (titulo) {
      try {
        const hoje = new Date().toISOString().split("T")[0];
        await salvarConciliacaoBancaria({
          titulo_id: titulo.id,
          conta_pagar_parcela_id: null,
          movimento_bancario_id: null,
          tipo: "recebido",
          status: "aguardando_confirmacao",
          valor_titulo: titulo.valor,
          valor_movimento: titulo.valor,
          data_conciliacao: titulo.data_pagamento || hoje,
          observacoes: "Gerado automaticamente ao marcar título como pago",
        });
      } catch (e) {
        console.warn("Erro ao criar conciliação automática (recebido):", e.message);
      }
    }
  };

  // ── Navigation ───────────────────────────────────────────────────────────────

  const isOwner = userRole === "owner";
  const navGroups = buildNavGroups({
    isOwner,
    tenants, usuarios, tecnicos, produtos,
    contasBancarias, movimentosBancarios, conciliacoesBancarias,
    parcelasContasPagar, fornecedores, centrosCusto,
    clientes, oportunidades, vendas,
    titulos, ordensServico, comissoes,
    estoqueItens, estoqueMovimentacoes,
  });

  // ── Layout ───────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-gray-50">
      <AppHeader
        tenantCor={tenantCor}
        tenantNome={tenantNome}
        tenantSlogan={tenantSlogan}
        session={session}
        navGroups={navGroups}
        viewMode={viewMode}
        setViewMode={setViewMode}
        openDropdown={openDropdown}
        setOpenDropdown={setOpenDropdown}
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
        isMobile={isMobile}
        onSignOut={onSignOut}
        onEditProfile={() => { setUsuariosEditUserId(session.user.id); setViewMode("usuarios"); setOpenDropdown(null); setMobileMenuOpen(false); }}
      />

      <main className={`max-w-7xl mx-auto px-4 py-4${isMobile ? " pb-20" : ""}`}>
        {renderRoute(viewMode, {
          isOwner, fmtBRL,
          clientes, salvarCliente, excluirCliente,
          usuariosEditUserId, onClearInitialEdit: () => setUsuariosEditUserId(null),
          produtos, estoqueItens, produtoEstoqueVinculos,
          salvarProduto, excluirProduto,
          modalProduto, editandoProduto, formProduto, setFormProduto,
          abrirModalProduto, fecharModalProduto,
          modalVincularEstoque, vinculoProduto,
          abrirModalVincular, fecharModalVincular,
          salvarVinculo, excluirVinculo,
          oportunidades, salvarOportunidade, excluirOportunidade, moverOportunidade,
          getClienteNome, getProdutoNome,
          vendas, salvarVenda, excluirVenda,
          titulos, salvarTitulo, excluirTitulo, marcarComoPago: marcarComoPagoComConciliacao,
          tecnicos, salvarTecnico, excluirTecnico,
          ordensServico, getTecnicoNome,
          encaminharParaTecnico, concluirOrdemServico, excluirOrdemServico, salvarEvolucao,
          modalEncaminhar, osEncaminhar, abrirModalEncaminhar, fecharModalEncaminhar,
          modalEvolucao, osEvolucao, abrirModalEvolucao, fecharModalEvolucao,
          comissoes, agendarComissao, pagarComissao, excluirComissao,
          estoqueMovimentacoes,
          salvarEstoqueItem, excluirEstoqueItem,
          salvarMovimentacaoComContaPagar, excluirMovimentacao,
          fornecedores,
          contasBancarias, salvarContaBancaria, excluirContaBancaria,
          movimentosBancarios, salvarMovimentoBancario, excluirMovimentoBancario,
          conciliacoesBancarias, salvarConciliacaoBancaria, excluirConciliacaoBancaria,
          tenants, salvarTenant, excluirTenant,
          contasPagar, parcelasContasPagar, salvarContaPagar, excluirContaPagar, pagarParcela,
          salvarFornecedor, excluirFornecedor,
          centrosCusto, salvarCentroCusto, excluirCentroCusto,
        })}
      </main>

      <AppFooter />

      {isMobile && <MobileBanner />}
    </div>
  );
}
