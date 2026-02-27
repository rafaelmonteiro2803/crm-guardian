import React, { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import { useAuth } from "./AuthContext";

const TenantContext = createContext(null);

export function TenantProvider({ children }) {
  const { session, handleSignOut } = useAuth();

  const [tenantId, setTenantId] = useState(null);
  const [tenantNome, setTenantNome] = useState("");
  const [tenantSlogan, setTenantSlogan] = useState("");
  const [tenantCor, setTenantCor] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [selectedTenantId, setSelectedTenantId] = useState(
    () => localStorage.getItem("crm_selectedTenantId") || ""
  );
  const [tenantsList, setTenantsList] = useState([]);
  const [tenantLocked, setTenantLocked] = useState(false);
  const [usuarios, setUsuarios] = useState([]);

  useEffect(() => { carregarTenants(); }, []);

  useEffect(() => {
    if (selectedTenantId) localStorage.setItem("crm_selectedTenantId", selectedTenantId);
  }, [selectedTenantId]);

  useEffect(() => {
    if (session) {
      carregarTenant();
    } else {
      setTenantId(null);
      setTenantNome("");
      setTenantSlogan("");
      setTenantCor(null);
      setUserRole(null);
    }
  }, [session]);

  const carregarTenants = async () => {
    const { data } = await supabase.rpc("get_all_tenants");
    if (data) {
      setTenantsList(data);
      if (window.location.hostname === "admin.salaisis.com") {
        const tenant = data.find(
          (t) => t.nome.toLowerCase().replace(/\s+/g, "") === "salaisis"
        );
        if (tenant) {
          setSelectedTenantId(tenant.id);
          setTenantLocked(true);
        }
      }
    }
  };

  const carregarTenant = async () => {
    if (!session) return;
    const query = supabase
      .from("tenant_members")
      .select("tenant_id, role, tenants(id, nome, slogan, cor)")
      .eq("user_id", session.user.id);

    const { data } = selectedTenantId
      ? await query.eq("tenant_id", selectedTenantId).single()
      : await query.limit(1).single();

    if (data) {
      setTenantId(data.tenant_id);
      setTenantNome(data.tenants?.nome || "");
      setTenantSlogan(data.tenants?.slogan || "");
      setTenantCor(data.tenants?.cor || null);
      setUserRole(data.role || "member");
    } else if (selectedTenantId) {
      await handleSignOut();
    }
  };

  const carregarUsuarios = async () => {
    if (!tenantId) return;
    const { data, error } = await supabase.rpc("get_tenant_members_with_email", {
      p_tenant_id: tenantId,
    });
    if (!error && data) { setUsuarios(data); return; }
    const { data: fallback } = await supabase
      .from("tenant_members")
      .select("id, user_id, role, created_at")
      .eq("tenant_id", tenantId)
      .order("created_at", { ascending: false });
    if (fallback) setUsuarios(fallback);
  };

  const salvarUsuario = async (editandoUsuario, formUsuario) => {
    if (editandoUsuario) {
      const { data, error } = await supabase.rpc("update_tenant_member_role", {
        p_member_id: editandoUsuario.id,
        p_tenant_id: tenantId,
        p_role: formUsuario.role || "member",
      });
      if (error) throw new Error(`Erro ao atualizar membro: ${error.message}`);
      if (data?.length > 0) {
        setUsuarios((prev) => prev.map((u) => (u.id === editandoUsuario.id ? data[0] : u)));
      } else {
        await carregarUsuarios();
      }
    } else {
      if (!formUsuario.user_id) throw new Error("Selecione um usuário!");
      const { data, error } = await supabase.rpc("add_tenant_member_by_userid", {
        p_tenant_id: tenantId,
        p_user_id: formUsuario.user_id,
        p_role: formUsuario.role || "member",
      });
      if (error) throw new Error(`Erro ao vincular usuário: ${error.message}`);
      if (data?.length > 0) {
        setUsuarios((prev) => [data[0], ...prev]);
      } else {
        await carregarUsuarios();
      }
    }
  };

  const criarEVincularUsuario = async (formNovoUsuario) => {
    if (!formNovoUsuario.email?.trim()) throw new Error("Digite o email do novo usuário!");
    if (!formNovoUsuario.nome?.trim()) throw new Error("Digite o nome do novo usuário!");
    if (!formNovoUsuario.senha?.trim()) throw new Error("Digite a senha do novo usuário!");
    const { data: { session: adminSession } } = await supabase.auth.getSession();
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email: formNovoUsuario.email.trim(),
      password: formNovoUsuario.senha,
      options: { data: { nome: formNovoUsuario.nome.trim() } },
    });
    if (signUpError) throw new Error(`Erro ao criar usuário: ${signUpError.message}`);
    if (!signUpData?.user?.id) throw new Error("Erro ao criar usuário: dados não retornados.");
    const newUserId = signUpData.user.id;
    if (adminSession) {
      const { data: { session: currentSession } } = await supabase.auth.getSession();
      if (!currentSession || currentSession.user.id !== adminSession.user.id) {
        await supabase.auth.setSession({
          access_token: adminSession.access_token,
          refresh_token: adminSession.refresh_token,
        });
      }
    }
    const { data, error } = await supabase.rpc("add_tenant_member_by_userid", {
      p_tenant_id: tenantId,
      p_user_id: newUserId,
      p_role: formNovoUsuario.role || "member",
    });
    if (error) throw new Error(`Usuário criado mas erro ao vincular ao tenant: ${error.message}`);
    if (data?.length > 0) {
      setUsuarios((prev) => [data[0], ...prev]);
    } else {
      await carregarUsuarios();
    }
    return formNovoUsuario.email.trim();
  };

  const excluirUsuario = async (id) => {
    const { error } = await supabase.rpc("remove_tenant_member", {
      p_member_id: id,
      p_tenant_id: tenantId,
    });
    if (error) throw new Error(`Erro ao remover membro: ${error.message}`);
    setUsuarios((prev) => prev.filter((u) => u.id !== id));
  };

  const limparDadosTenant = () => {
    setUsuarios([]);
    setTenantId(null);
    setTenantNome("");
    setTenantSlogan("");
    setTenantCor(null);
    setSelectedTenantId("");
    setUserRole(null);
  };

  return (
    <TenantContext.Provider
      value={{
        tenantId,
        tenantNome,
        tenantSlogan,
        tenantCor,
        userRole,
        selectedTenantId,
        setSelectedTenantId,
        tenantsList,
        tenantLocked,
        usuarios,
        setUsuarios,
        carregarUsuarios,
        salvarUsuario,
        criarEVincularUsuario,
        excluirUsuario,
        limparDadosTenant,
      }}
    >
      {children}
    </TenantContext.Provider>
  );
}

export function useTenant() {
  return useContext(TenantContext);
}
