import { useState, useCallback } from "react";
import {
  fetchAllTenants,
  createTenant,
  updateTenant,
  deleteTenant,
  uploadTenantLogo,
} from "../services/tenantsService";

export function useTenants() {
  const [tenants, setTenants] = useState([]);

  const carregar = useCallback(async () => {
    const data = await fetchAllTenants();
    setTenants(data);
  }, []);

  const salvar = useCallback(async (form, logoFile, editandoId) => {
    let logoUrl = form.logo_url || null;

    if (logoFile) {
      if (editandoId) {
        logoUrl = await uploadTenantLogo(logoFile, editandoId);
        const updated = await updateTenant(editandoId, { ...form, logo_url: logoUrl });
        setTenants((prev) => prev.map((t) => (t.id === editandoId ? updated : t)));
        return updated;
      } else {
        // Para novo tenant: criar primeiro, depois subir logo e atualizar
        const created = await createTenant({ ...form, logo_url: null });
        logoUrl = await uploadTenantLogo(logoFile, created.id);
        const updated = await updateTenant(created.id, { ...form, logo_url: logoUrl });
        setTenants((prev) => [updated, ...prev]);
        return updated;
      }
    }

    if (editandoId) {
      const updated = await updateTenant(editandoId, { ...form, logo_url: logoUrl });
      setTenants((prev) => prev.map((t) => (t.id === editandoId ? updated : t)));
      return updated;
    } else {
      const created = await createTenant({ ...form, logo_url: logoUrl });
      setTenants((prev) => [created, ...prev]);
      return created;
    }
  }, []);

  const excluir = useCallback(async (id) => {
    await deleteTenant(id);
    setTenants((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return { tenants, setTenants, carregar, salvar, excluir };
}
