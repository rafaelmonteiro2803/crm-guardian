import { useState, useCallback } from "react";
import {
  fetchFornecedores,
  createFornecedor,
  updateFornecedor,
  deleteFornecedor,
} from "../services/fornecedoresService";

export function useFornecedores(tenantId, userId) {
  const [fornecedores, setFornecedores] = useState([]);

  const carregar = useCallback(async () => {
    if (!tenantId) return;
    const data = await fetchFornecedores(tenantId);
    setFornecedores(data);
  }, [tenantId]);

  const salvar = useCallback(
    async (form, editandoId) => {
      const payload = {
        ...form,
        ativo: form.ativo ?? true,
        user_id: userId,
        tenant_id: tenantId,
      };
      if (editandoId) {
        const updated = await updateFornecedor(editandoId, payload);
        setFornecedores((prev) =>
          prev.map((f) => (f.id === editandoId ? updated : f))
        );
      } else {
        const created = await createFornecedor(payload);
        setFornecedores((prev) =>
          [...prev, created].sort((a, b) => a.nome.localeCompare(b.nome))
        );
      }
    },
    [tenantId, userId]
  );

  const excluir = useCallback(async (id) => {
    await deleteFornecedor(id);
    setFornecedores((prev) => prev.filter((f) => f.id !== id));
  }, []);

  const getFornecedorNome = useCallback(
    (id) => fornecedores.find((f) => f.id === id)?.nome || "-",
    [fornecedores]
  );

  return {
    fornecedores,
    setFornecedores,
    carregar,
    salvar,
    excluir,
    getFornecedorNome,
  };
}
