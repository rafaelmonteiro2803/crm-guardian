import { useState, useCallback } from "react";
import {
  fetchContasBancarias,
  createContaBancaria,
  updateContaBancaria,
  deleteContaBancaria,
  fetchMovimentosBancarios,
  createMovimentoBancario,
  updateMovimentoBancario,
  deleteMovimentoBancario,
  fetchConciliacoesBancarias,
  createConciliacao,
  deleteConciliacao,
} from "../services/movimentosBancariosService";

export function useMovimentosBancarios(tenantId, userId) {
  const [contasBancarias, setContasBancarias] = useState([]);
  const [movimentosBancarios, setMovimentosBancarios] = useState([]);
  const [conciliacoesBancarias, setConciliacoesBancarias] = useState([]);

  // --- Contas Bancárias ---

  const carregarContas = useCallback(async () => {
    if (!tenantId) return;
    const data = await fetchContasBancarias(tenantId);
    setContasBancarias(data);
  }, [tenantId]);

  const salvarConta = useCallback(async (form, editandoId) => {
    const payload = {
      ...form,
      user_id: userId,
      tenant_id: tenantId,
    };
    if (editandoId) {
      const updated = await updateContaBancaria(editandoId, payload);
      setContasBancarias((prev) =>
        prev.map((c) => (c.id === editandoId ? updated : c))
      );
    } else {
      const created = await createContaBancaria(payload);
      setContasBancarias((prev) =>
        [...prev, created].sort((a, b) => a.nome.localeCompare(b.nome))
      );
    }
  }, [tenantId, userId]);

  const excluirConta = useCallback(async (id) => {
    await deleteContaBancaria(id);
    setContasBancarias((prev) => prev.filter((c) => c.id !== id));
  }, []);

  // --- Movimentos Bancários ---

  const carregarMovimentos = useCallback(async () => {
    if (!tenantId) return;
    const data = await fetchMovimentosBancarios(tenantId);
    setMovimentosBancarios(data);
  }, [tenantId]);

  const salvarMovimento = useCallback(async (form, editandoId) => {
    const payload = {
      ...form,
      valor: parseFloat(form.valor || 0),
      user_id: userId,
      tenant_id: tenantId,
    };
    if (editandoId) {
      const updated = await updateMovimentoBancario(editandoId, payload);
      setMovimentosBancarios((prev) =>
        prev.map((m) => (m.id === editandoId ? updated : m))
      );
    } else {
      const created = await createMovimentoBancario(payload);
      setMovimentosBancarios((prev) => [created, ...prev]);
    }
  }, [tenantId, userId]);

  const excluirMovimento = useCallback(async (id) => {
    await deleteMovimentoBancario(id);
    setMovimentosBancarios((prev) => prev.filter((m) => m.id !== id));
  }, []);

  // --- Conciliações ---

  const carregarConciliacoes = useCallback(async () => {
    if (!tenantId) return;
    const data = await fetchConciliacoesBancarias(tenantId);
    setConciliacoesBancarias(data);
  }, [tenantId]);

  const salvarConciliacao = useCallback(async (form) => {
    const payload = {
      ...form,
      valor_titulo: parseFloat(form.valor_titulo || 0),
      valor_movimento: parseFloat(form.valor_movimento || 0),
      user_id: userId,
      tenant_id: tenantId,
    };
    const created = await createConciliacao(payload);
    setConciliacoesBancarias((prev) => [created, ...prev]);
  }, [tenantId, userId]);

  const excluirConciliacao = useCallback(async (id) => {
    await deleteConciliacao(id);
    setConciliacoesBancarias((prev) => prev.filter((c) => c.id !== id));
  }, []);

  return {
    contasBancarias,
    setContasBancarias,
    movimentosBancarios,
    setMovimentosBancarios,
    conciliacoesBancarias,
    setConciliacoesBancarias,
    carregarContas,
    salvarConta,
    excluirConta,
    carregarMovimentos,
    salvarMovimento,
    excluirMovimento,
    carregarConciliacoes,
    salvarConciliacao,
    excluirConciliacao,
  };
}
