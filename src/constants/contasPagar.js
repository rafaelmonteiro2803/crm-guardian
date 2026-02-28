export const CATEGORIAS_CONTAS_PAGAR = [
  { value: "aluguel", label: "Aluguel" },
  { value: "fornecedores", label: "Fornecedores" },
  { value: "equipamentos", label: "Equipamentos" },
  { value: "marketing", label: "Marketing" },
  { value: "funcionarios", label: "Funcionários" },
  { value: "impostos", label: "Impostos" },
  { value: "taxas_cartao", label: "Taxas de Cartão" },
  { value: "servicos_publicos", label: "Serviços Públicos" },
  { value: "seguros", label: "Seguros" },
  { value: "manutencao", label: "Manutenção" },
  { value: "contabilidade", label: "Contabilidade" },
  { value: "juridico", label: "Jurídico" },
  { value: "ti_software", label: "TI / Software" },
  { value: "transporte", label: "Transporte" },
  { value: "combustivel", label: "Combustível" },
  { value: "alimentacao", label: "Alimentação" },
  { value: "treinamento", label: "Treinamento" },
  { value: "outros", label: "Outros" },
];

export const TIPOS_DESPESA = [
  { value: "fixo", label: "Fixa" },
  { value: "variavel", label: "Variável" },
];

export const STATUS_PARCELA = [
  { value: "aguardando_pagamento", label: "Aguardando Pagamento" },
  { value: "em_aberto", label: "Em Aberto" },
  { value: "pago", label: "Pago" },
  { value: "vencido", label: "Vencido" },
  { value: "cancelado", label: "Cancelado" },
];

export const FORMAS_PAGAMENTO = [
  { value: "pix", label: "PIX" },
  { value: "cartao_credito", label: "Cartão de Crédito" },
  { value: "cartao_debito", label: "Cartão de Débito" },
  { value: "dinheiro", label: "Dinheiro" },
  { value: "boleto", label: "Boleto" },
  { value: "transferencia", label: "Transferência" },
  { value: "deposito", label: "Depósito" },
  { value: "cheque", label: "Cheque" },
  { value: "outro", label: "Outro" },
];

export const getCategoriaLabel = (v) =>
  CATEGORIAS_CONTAS_PAGAR.find((c) => c.value === v)?.label || v;

export const getTipoLabel = (v) =>
  TIPOS_DESPESA.find((t) => t.value === v)?.label || v;

export const getStatusParcelaLabel = (v) =>
  STATUS_PARCELA.find((s) => s.value === v)?.label || v;

export const getFormaPagamentoLabel = (v) =>
  FORMAS_PAGAMENTO.find((f) => f.value === v)?.label || v;

/** Calcula valor de cada parcela */
export const calcularParcelas = (valorTotal, numeroParcelas, dataPrimeiraParcela) => {
  const num = parseInt(numeroParcelas) || 1;
  const valorParcela = parseFloat(valorTotal) / num;
  const parcelas = [];
  for (let i = 0; i < num; i++) {
    const d = new Date(dataPrimeiraParcela + "T00:00:00");
    d.setMonth(d.getMonth() + i);
    parcelas.push({
      numero_parcela: i + 1,
      valor: parseFloat(valorParcela.toFixed(2)),
      data_vencimento: d.toISOString().split("T")[0],
      status: "em_aberto",
    });
  }
  return parcelas;
};

/** Verifica se uma parcela está vencida */
export const isVencida = (parcela) => {
  if (parcela.status !== "em_aberto" && parcela.status !== "aguardando_pagamento") return false;
  return new Date(parcela.data_vencimento + "T23:59:59") < new Date();
};

/** Verifica se uma parcela vence hoje */
export const isVencendoHoje = (parcela) => {
  if (parcela.status !== "em_aberto" && parcela.status !== "aguardando_pagamento") return false;
  const hoje = new Date().toISOString().split("T")[0];
  return parcela.data_vencimento === hoje;
};
