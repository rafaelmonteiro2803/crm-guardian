import React from "react";
import { Icons } from "../components/Icons";

/**
 * Builds the navigation groups array with dynamic counts.
 * Receives runtime data to populate badge counts and role-based items.
 */
export const buildNavGroups = ({
  isOwner,
  tenants,
  usuarios,
  tecnicos,
  produtos,
  contasBancarias,
  movimentosBancarios,
  conciliacoesBancarias,
  parcelasContasPagar,
  fornecedores,
  centrosCusto,
  clientes,
  oportunidades,
  vendas,
  titulos,
  ordensServico,
  comissoes,
  estoqueItens,
  estoqueMovimentacoes,
}) => [
  {
    key: "admin",
    label: "Administrativo",
    icon: <Icons.Cog />,
    ...(isOwner
      ? {
          subgroups: [
            {
              key: "sistema",
              label: "Sistema",
              icon: <Icons.Cog />,
              items: [
                { key: "tenants", label: "Tenants", icon: <Icons.Cog />, count: tenants.length },
              ],
            },
            {
              key: "admin_geral",
              label: "Geral",
              icon: <Icons.User />,
              items: [
                { key: "usuarios", label: "Usuários", icon: <Icons.User />, count: usuarios.length },
                { key: "tecnicos", label: "Profissionais / Técnicos", icon: <Icons.Cog />, count: tecnicos.length },
                { key: "produtos", label: "Produtos", icon: <Icons.ShoppingCart />, count: produtos.length },
              ],
            },
          ],
        }
      : {
          items: [
            { key: "usuarios", label: "Usuários", icon: <Icons.User />, count: usuarios.length },
            { key: "tecnicos", label: "Profissionais / Técnicos", icon: <Icons.Cog />, count: tecnicos.length },
            { key: "produtos", label: "Produtos", icon: <Icons.ShoppingCart />, count: produtos.length },
          ],
        }),
  },
  {
    key: "operacional",
    label: "Operacional",
    icon: <Icons.ClipboardList />,
    subgroups: [
      {
        key: "operacional_geral",
        label: "Operacional",
        icon: <Icons.ClipboardList />,
        items: [
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
    key: "financeiro_menu",
    label: "Financeiro",
    icon: <Icons.DollarSign />,
    subgroups: [
      {
        key: "financeiro_geral",
        label: "Financeiro",
        icon: <Icons.DollarSign />,
        items: [
          { key: "financeiro", label: "Financeiro", icon: <Icons.CreditCard />, count: titulos.length },
        ],
      },
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
    key: "relatorios",
    label: "Relatórios",
    icon: <Icons.BarChart />,
    items: [
      { key: "dashboard", label: "Dashboard", icon: <Icons.BarChart /> },
      { key: "atendimentos_relatorio", label: "Atendimentos", icon: <Icons.ClipboardCheck /> },
    ],
  },
];
