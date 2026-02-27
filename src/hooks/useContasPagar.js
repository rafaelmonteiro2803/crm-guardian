import { useState, useCallback } from "react";
import {
  fetchContasPagar,
  createContaPagar,
  updateContaPagar,
  deleteContaPagar,
  fetchParcelasDeContas,
  createParcelas,
  updateParcela,
  deleteParcelasByContaPagar,
} from "../services/contasPagarService";
import { createMovimentoBancario } from "../services/movimentosBancariosService";
import { calcularParcelas } from "../constants/contasPagar";

export function useContasPagar(tenantId, userId) {
  const [contasPagar, setContasPagar] = useState([]);
  const [parcelas, setParcelas] = useState([]);

  const carregarContas = useCallback(async () => {
    if (!tenantId) return;
    const data = await fetchContasPagar(tenantId);
    setContasPagar(data);
  }, [tenantId]);

  const carregarParcelas = useCallback(async () => {
    if (!tenantId) return;
    const data = await fetchParcelasDeContas(tenantId);
    setParcelas(data);
  }, [tenantId]);

  const salvarConta = useCallback(
    async (form, editandoId) => {
      const valorTotal = parseFloat(form.valor_total || 0);
      const numParcelas = parseInt(form.numero_parcelas || 1);

      const payload = {
        descricao: form.descricao,
        categoria: form.categoria,
        tipo: form.tipo,
        valor_total: valorTotal,
        numero_parcelas: numParcelas,
        fornecedor_id: form.fornecedor_id || null,
        centro_custo_id: form.centro_custo_id || null,
        estoque_movimentacao_id: form.estoque_movimentacao_id || null,
        data_competencia: form.data_competencia,
        data_primeira_parcela: form.data_primeira_parcela,
        observacoes: form.observacoes || null,
        recorrente: form.recorrente || false,
        recorrencia_meses: parseInt(form.recorrencia_meses || 0),
        ativo: true,
        user_id: userId,
        tenant_id: tenantId,
      };

      if (editandoId) {
        // Atualiza a conta
        const updated = await updateContaPagar(editandoId, payload);
        setContasPagar((prev) =>
          prev.map((c) => (c.id === editandoId ? updated : c))
        );
        // Recria as parcelas
        await deleteParcelasByContaPagar(editandoId);
        const novasParcelas = calcularParcelas(
          valorTotal,
          numParcelas,
          form.data_primeira_parcela
        );
        const parcelasPayload = novasParcelas.map((p) => ({
          ...p,
          conta_pagar_id: editandoId,
          user_id: userId,
          tenant_id: tenantId,
        }));
        const criadas = await createParcelas(parcelasPayload);
        setParcelas((prev) => [
          ...prev.filter((p) => p.conta_pagar_id !== editandoId),
          ...criadas,
        ]);
      } else {
        // Cria a conta
        const created = await createContaPagar(payload);
        setContasPagar((prev) => [created, ...prev]);
        // Cria as parcelas
        const novasParcelas = calcularParcelas(
          valorTotal,
          numParcelas,
          form.data_primeira_parcela
        );
        const parcelasPayload = novasParcelas.map((p) => ({
          ...p,
          conta_pagar_id: created.id,
          user_id: userId,
          tenant_id: tenantId,
        }));
        const criadas = await createParcelas(parcelasPayload);
        setParcelas((prev) => [...prev, ...criadas]);
      }
    },
    [tenantId, userId]
  );

  const excluirConta = useCallback(async (id) => {
    await deleteContaPagar(id);
    setContasPagar((prev) => prev.filter((c) => c.id !== id));
    setParcelas((prev) => prev.filter((p) => p.conta_pagar_id !== id));
  }, []);

  /**
   * Registra o pagamento de uma parcela:
   * 1. Cria um movimento bancário de saída
   * 2. Marca a parcela como "pago"
   */
  const pagarParcela = useCallback(
    async (parcela, formPagamento, contasBancarias) => {
      const conta = contasBancarias.find(
        (c) => c.id === formPagamento.conta_bancaria_id
      );
      if (!conta) throw new Error("Conta bancária não encontrada.");

      const contaPagar = contasPagar.find(
        (c) => c.id === parcela.conta_pagar_id
      );
      const descricaoMov = contaPagar
        ? `${contaPagar.descricao} - Parc. ${parcela.numero_parcela}`
        : `Pagamento parcela ${parcela.id}`;

      // Cria movimento bancário de saída
      const movPayload = {
        conta_id: formPagamento.conta_bancaria_id,
        tipo: "saida",
        valor: parseFloat(formPagamento.valor_pago || parcela.valor),
        descricao: descricaoMov,
        fonte_pagamento: formPagamento.forma_pagamento,
        data_movimento: formPagamento.data_pagamento,
        observacoes: formPagamento.observacoes || null,
        user_id: userId,
        tenant_id: tenantId,
      };
      const mov = await createMovimentoBancario(movPayload);

      // Marca parcela como paga
      const parcelaAtualizada = await updateParcela(parcela.id, {
        status: "pago",
        data_pagamento: formPagamento.data_pagamento,
        valor_pago: parseFloat(formPagamento.valor_pago || parcela.valor),
        movimento_bancario_id: mov.id,
        conta_bancaria_id: formPagamento.conta_bancaria_id,
        forma_pagamento: formPagamento.forma_pagamento,
        observacoes: formPagamento.observacoes || null,
      });

      setParcelas((prev) =>
        prev.map((p) => (p.id === parcela.id ? parcelaAtualizada : p))
      );

      return { mov, parcelaAtualizada };
    },
    [tenantId, userId, contasPagar]
  );

  /**
   * Cria automaticamente uma conta a pagar a partir de uma movimentação de estoque (entrada por compra)
   */
  const criarContaDaCompraEstoque = useCallback(
    async (movimentacao, estoqueItem, fornecedorId = null) => {
      const valorTotal =
        parseFloat(movimentacao.custo_unitario || 0) *
        parseFloat(movimentacao.quantidade || 1);
      if (valorTotal <= 0) return null;

      const hoje = new Date().toISOString().split("T")[0];
      const payload = {
        descricao: `Compra: ${estoqueItem.nome} (${parseFloat(movimentacao.quantidade)} ${estoqueItem.unidade_medida || "un"})`,
        categoria: "fornecedores",
        tipo: "variavel",
        valor_total: valorTotal,
        numero_parcelas: 1,
        fornecedor_id: fornecedorId,
        centro_custo_id: null,
        estoque_movimentacao_id: movimentacao.id,
        data_competencia: movimentacao.data_movimentacao || hoje,
        data_primeira_parcela: movimentacao.data_movimentacao || hoje,
        observacoes: `Gerado automaticamente pela entrada de estoque.`,
        recorrente: false,
        recorrencia_meses: 0,
        ativo: true,
        user_id: userId,
        tenant_id: tenantId,
      };

      const created = await createContaPagar(payload);
      setContasPagar((prev) => [created, ...prev]);

      const parcelasPayload = [
        {
          conta_pagar_id: created.id,
          numero_parcela: 1,
          valor: valorTotal,
          data_vencimento: movimentacao.data_movimentacao || hoje,
          status: "em_aberto",
          user_id: userId,
          tenant_id: tenantId,
        },
      ];
      const criadas = await createParcelas(parcelasPayload);
      setParcelas((prev) => [...prev, ...criadas]);

      return created;
    },
    [tenantId, userId]
  );

  return {
    contasPagar,
    setContasPagar,
    parcelas,
    setParcelas,
    carregarContas,
    carregarParcelas,
    salvarConta,
    excluirConta,
    pagarParcela,
    criarContaDaCompraEstoque,
  };
}
