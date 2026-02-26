import { useState } from "react";
import {
  fetchOportunidades,
  createOportunidade,
  updateOportunidade,
  deleteOportunidade,
} from "../services/oportunidadesService";

export function useOportunidades(tenantId, userId) {
  const [oportunidades, setOportunidades] = useState([]);

  const carregarOportunidades = async () => {
    const data = await fetchOportunidades(tenantId);
    setOportunidades(data);
  };

  const salvarOportunidade = async (form, editando, onSuccess) => {
    if (!form.titulo.trim()) { alert("Título é obrigatório!"); return; }
    const payload = { ...form, produto_id: form.produto_id || null };
    if (editando) {
      const updated = await updateOportunidade(editando.id, payload);
      if (updated) setOportunidades((prev) => prev.map((o) => (o.id === editando.id ? updated : o)));
    } else {
      const created = await createOportunidade({ ...payload, user_id: userId, tenant_id: tenantId });
      if (created) setOportunidades((prev) => [created, ...prev]);
    }
    onSuccess?.();
  };

  const excluirOportunidade = async (id) => {
    if (!confirm("Excluir oportunidade?")) return;
    await deleteOportunidade(id);
    setOportunidades((prev) => prev.filter((o) => o.id !== id));
  };

  const moverOportunidade = async (id, estagio) => {
    const updated = await updateOportunidade(id, { estagio });
    if (updated) setOportunidades((prev) => prev.map((o) => (o.id === id ? updated : o)));
  };

  return {
    oportunidades,
    setOportunidades,
    carregarOportunidades,
    salvarOportunidade,
    excluirOportunidade,
    moverOportunidade,
  };
}
