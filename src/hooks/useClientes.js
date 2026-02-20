import { useState, useCallback } from "react";
import { fetchClientes, createCliente, updateCliente, deleteCliente } from "../services/clientesService";

export function useClientes(tenantId, userId) {
  const [clientes, setClientes] = useState([]);

  const carregar = useCallback(async () => {
    if (!tenantId) return;
    const data = await fetchClientes(tenantId);
    setClientes(data);
  }, [tenantId]);

  const salvar = useCallback(async (form, editandoId) => {
    if (editandoId) {
      const updated = await updateCliente(editandoId, form);
      setClientes((prev) => prev.map((c) => (c.id === editandoId ? updated : c)));
    } else {
      const created = await createCliente({ ...form, user_id: userId, tenant_id: tenantId });
      setClientes((prev) => [created, ...prev]);
    }
  }, [tenantId, userId]);

  const excluir = useCallback(async (id) => {
    await deleteCliente(id);
    setClientes((prev) => prev.filter((c) => c.id !== id));
  }, []);

  return { clientes, setClientes, carregar, salvar, excluir };
}
