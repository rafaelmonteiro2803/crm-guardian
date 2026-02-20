import { useState } from "react";
import {
  fetchTecnicos, createTecnico, updateTecnico, deleteTecnico,
  fetchComissoes, updateComissao, deleteComissao,
} from "../services/tecnicosService";

export function useTecnicos(tenantId, userId) {
  const [tecnicos, setTecnicos] = useState([]);
  const [comissoes, setComissoes] = useState([]);

  const carregarTecnicos = async () => {
    const data = await fetchTecnicos(tenantId);
    setTecnicos(data);
  };

  const carregarComissoes = async () => {
    const data = await fetchComissoes(tenantId);
    setComissoes(data);
  };

  const salvarTecnico = async (form, editando, onSuccess) => {
    if (!form.nome.trim()) { alert("Nome é obrigatório!"); return; }
    const payload = { ...form, user_id: userId, tenant_id: tenantId };
    if (editando) {
      const updated = await updateTecnico(editando.id, payload);
      if (updated) setTecnicos((prev) => prev.map((t) => (t.id === editando.id ? updated : t)));
    } else {
      const created = await createTecnico(payload);
      if (created) setTecnicos((prev) => [created, ...prev]);
    }
    onSuccess?.();
  };

  const excluirTecnico = async (id) => {
    if (!confirm("Excluir técnico?")) return;
    await deleteTecnico(id);
    setTecnicos((prev) => prev.filter((t) => t.id !== id));
  };

  const agendarComissao = async (comissaoId, form, onSuccess) => {
    if (!form.data_agendamento) { alert("Informe a data de agendamento!"); return; }
    const updated = await updateComissao(comissaoId, {
      status: "agendado",
      data_agendamento: form.data_agendamento,
      observacoes: form.observacoes,
    });
    if (updated) setComissoes((prev) => prev.map((c) => (c.id === comissaoId ? updated : c)));
    onSuccess?.();
  };

  const pagarComissao = async (id) => {
    if (!confirm("Confirmar pagamento desta comissão?")) return;
    const updated = await updateComissao(id, { status: "pago", data_pagamento: new Date().toISOString().split("T")[0] });
    if (updated) setComissoes((prev) => prev.map((c) => (c.id === id ? updated : c)));
  };

  const excluirComissao = async (id) => {
    if (!confirm("Excluir comissão?")) return;
    await deleteComissao(id);
    setComissoes((prev) => prev.filter((c) => c.id !== id));
  };

  // Chamado pelo App.jsx quando uma OS é concluída (gera comissão automaticamente)
  const adicionarComissao = (comissao) => {
    setComissoes((prev) => [comissao, ...prev]);
  };

  const getTecnicoNome = (id) => tecnicos.find((t) => t.id === id)?.nome || "N/A";

  return {
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
  };
}
