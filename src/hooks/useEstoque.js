import { useState, useCallback } from "react";
import {
  fetchEstoqueItens,
  createEstoqueItem,
  updateEstoqueItem,
  deleteEstoqueItem,
  fetchEstoqueMovimentacoes,
  createMovimentacao,
  deleteMovimentacao,
  fetchProdutoEstoqueVinculos,
  createVinculo,
  deleteVinculo,
} from "../services/estoqueService";

export function useEstoque(tenantId, userId) {
  const [estoqueItens, setEstoqueItens] = useState([]);
  const [estoqueMovimentacoes, setEstoqueMovimentacoes] = useState([]);
  const [produtoEstoqueVinculos, setProdutoEstoqueVinculos] = useState([]);

  const carregarItens = useCallback(async () => {
    if (!tenantId) return;
    const data = await fetchEstoqueItens(tenantId);
    setEstoqueItens(data);
  }, [tenantId]);

  const carregarMovimentacoes = useCallback(async () => {
    if (!tenantId) return;
    const data = await fetchEstoqueMovimentacoes(tenantId);
    setEstoqueMovimentacoes(data);
  }, [tenantId]);

  const carregarVinculos = useCallback(async () => {
    if (!tenantId) return;
    const data = await fetchProdutoEstoqueVinculos(tenantId);
    setProdutoEstoqueVinculos(data);
  }, [tenantId]);

  const salvarItem = useCallback(async (form, editandoId) => {
    const payload = {
      ...form,
      quantidade_atual: parseFloat(form.quantidade_atual || 0),
      quantidade_minima: parseFloat(form.quantidade_minima || 0),
      custo_unitario: parseFloat(form.custo_unitario || 0),
      user_id: userId,
      tenant_id: tenantId,
    };
    if (editandoId) {
      const updated = await updateEstoqueItem(editandoId, payload);
      setEstoqueItens((prev) => prev.map((e) => (e.id === editandoId ? updated : e)));
    } else {
      const created = await createEstoqueItem(payload);
      setEstoqueItens((prev) =>
        [...prev, created].sort((a, b) => a.nome.localeCompare(b.nome))
      );
    }
  }, [tenantId, userId]);

  const excluirItem = useCallback(async (id) => {
    await deleteEstoqueItem(id);
    setEstoqueItens((prev) => prev.filter((e) => e.id !== id));
  }, []);

  const salvarMovimentacao = useCallback(async (form, item) => {
    const qtd = parseFloat(form.quantidade);
    let novaQtd = parseFloat(item.quantidade_atual || 0);
    if (form.tipo === "entrada") novaQtd += qtd;
    else if (form.tipo === "saida") novaQtd = Math.max(0, novaQtd - qtd);
    else novaQtd = qtd;

    const mov = {
      estoque_item_id: item.id,
      tipo: form.tipo,
      quantidade: qtd,
      custo_unitario: parseFloat(form.custo_unitario || item.custo_unitario || 0),
      motivo: form.motivo,
      observacoes: form.observacoes,
      data_movimentacao: form.data_movimentacao,
      user_id: userId,
      tenant_id: tenantId,
    };

    const movCreated = await createMovimentacao(mov);
    setEstoqueMovimentacoes((prev) => [movCreated, ...prev]);

    const itemAtualizado = await updateEstoqueItem(item.id, { quantidade_atual: novaQtd });
    setEstoqueItens((prev) =>
      prev.map((e) => (e.id === item.id ? itemAtualizado : e))
    );
  }, [tenantId, userId]);

  const excluirMovimentacao = useCallback(async (id) => {
    await deleteMovimentacao(id);
    setEstoqueMovimentacoes((prev) => prev.filter((m) => m.id !== id));
  }, []);

  const salvarVinculo = useCallback(async (form, produtoId) => {
    const payload = {
      produto_id: produtoId,
      estoque_item_id: form.estoque_item_id,
      quantidade_usada: parseFloat(form.quantidade_usada),
      observacoes: form.observacoes,
      tenant_id: tenantId,
    };
    const created = await createVinculo(payload);
    setProdutoEstoqueVinculos((prev) => [...prev, created]);
  }, [tenantId]);

  const excluirVinculo = useCallback(async (id) => {
    await deleteVinculo(id);
    setProdutoEstoqueVinculos((prev) => prev.filter((v) => v.id !== id));
  }, []);

  return {
    estoqueItens,
    setEstoqueItens,
    estoqueMovimentacoes,
    setEstoqueMovimentacoes,
    produtoEstoqueVinculos,
    setProdutoEstoqueVinculos,
    carregarItens,
    carregarMovimentacoes,
    carregarVinculos,
    salvarItem,
    excluirItem,
    salvarMovimentacao,
    excluirMovimentacao,
    salvarVinculo,
    excluirVinculo,
  };
}
