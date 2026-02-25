import { useState, useCallback } from "react";
import {
  fetchCentrosCusto,
  createCentroCusto,
  updateCentroCusto,
  deleteCentroCusto,
} from "../services/centrosCustoService";

export function useCentrosCusto(tenantId, userId) {
  const [centrosCusto, setCentrosCusto] = useState([]);

  const carregar = useCallback(async () => {
    if (!tenantId) return;
    const data = await fetchCentrosCusto(tenantId);
    setCentrosCusto(data);
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
        const updated = await updateCentroCusto(editandoId, payload);
        setCentrosCusto((prev) =>
          prev.map((c) => (c.id === editandoId ? updated : c))
        );
      } else {
        const created = await createCentroCusto(payload);
        setCentrosCusto((prev) =>
          [...prev, created].sort((a, b) => a.nome.localeCompare(b.nome))
        );
      }
    },
    [tenantId, userId]
  );

  const excluir = useCallback(async (id) => {
    await deleteCentroCusto(id);
    setCentrosCusto((prev) => prev.filter((c) => c.id !== id));
  }, []);

  const getCentroCustoNome = useCallback(
    (id) => centrosCusto.find((c) => c.id === id)?.nome || "-",
    [centrosCusto]
  );

  return {
    centrosCusto,
    setCentrosCusto,
    carregar,
    salvar,
    excluir,
    getCentroCustoNome,
  };
}
