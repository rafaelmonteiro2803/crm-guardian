import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabase";
import { Icons } from "../Icons";

const ROLES = [
  { value: "owner", label: "Owner" },
  { value: "admin", label: "Admin" },
  { value: "member", label: "Member" },
];

const FORM_INICIAL = { user_id: "", role: "member" };

export function TenantMembersModal({ aberto, tenant, onClose }) {
  const [membros, setMembros] = useState([]);
  const [usuariosSistema, setUsuariosSistema] = useState([]);
  const [carregandoUsuarios, setCarregandoUsuarios] = useState(false);
  const [carregando, setCarregando] = useState(false);
  const [salvando, setSalvando] = useState(false);
  const [editando, setEditando] = useState(null);
  const [form, setForm] = useState(FORM_INICIAL);
  const [mostrarForm, setMostrarForm] = useState(false);
  const [erro, setErro] = useState("");

  useEffect(() => {
    if (aberto && tenant) {
      carregarMembros();
      carregarUsuariosSistema();
      setEditando(null);
      setForm(FORM_INICIAL);
      setMostrarForm(false);
      setErro("");
    }
  }, [aberto, tenant]);

  const carregarMembros = async () => {
    setCarregando(true);
    setErro("");
    const { data, error } = await supabase.rpc("get_tenant_members_for_owner", {
      p_tenant_id: tenant.id,
    });
    setCarregando(false);
    if (error) {
      setErro("Erro ao carregar membros: " + error.message);
    } else {
      setMembros(data || []);
    }
  };

  const carregarUsuariosSistema = async () => {
    setCarregandoUsuarios(true);
    const { data, error } = await supabase.rpc("get_all_system_users_for_owner");
    setCarregandoUsuarios(false);
    if (error) {
      setErro("Erro ao carregar usuários: " + error.message);
    } else {
      setUsuariosSistema(data || []);
    }
  };

  // Usuários disponíveis = todos do sistema que ainda não são membros deste tenant
  const usuariosDisponiveis = usuariosSistema.filter(
    (u) => !membros.some((m) => m.user_id === u.user_id)
  );

  const abrirNovoMembro = () => {
    setEditando(null);
    setForm(FORM_INICIAL);
    setErro("");
    setMostrarForm(true);
  };

  const abrirEditarMembro = (membro) => {
    setEditando(membro);
    setForm({ user_id: membro.user_id || "", role: membro.role || "member" });
    setErro("");
    setMostrarForm(true);
  };

  const cancelarForm = () => {
    setMostrarForm(false);
    setEditando(null);
    setForm(FORM_INICIAL);
    setErro("");
  };

  const salvar = async () => {
    setErro("");
    if (!editando && !form.user_id) {
      setErro("Selecione um usuário.");
      return;
    }
    setSalvando(true);

    if (editando) {
      const { data, error } = await supabase.rpc("update_tenant_member_role_for_owner", {
        p_member_id: editando.id,
        p_tenant_id: tenant.id,
        p_role: form.role,
      });
      setSalvando(false);
      if (error) {
        setErro("Erro ao atualizar: " + error.message);
        return;
      }
      if (data && data.length > 0) {
        setMembros((prev) => prev.map((m) => (m.id === editando.id ? data[0] : m)));
      } else {
        await carregarMembros();
      }
    } else {
      const { data, error } = await supabase.rpc("add_tenant_member_by_userid_for_owner", {
        p_tenant_id: tenant.id,
        p_user_id: form.user_id,
        p_role: form.role,
      });
      setSalvando(false);
      if (error) {
        setErro("Erro ao adicionar: " + error.message);
        return;
      }
      if (data && data.length > 0) {
        setMembros((prev) => [data[0], ...prev]);
      } else {
        await carregarMembros();
      }
    }

    cancelarForm();
  };

  const remover = async (membro) => {
    if (!confirm(`Remover "${membro.email}" deste tenant?`)) return;
    const { error } = await supabase.rpc("remove_tenant_member_for_owner", {
      p_member_id: membro.id,
      p_tenant_id: tenant.id,
    });
    if (error) {
      alert("Erro ao remover: " + error.message);
      return;
    }
    setMembros((prev) => prev.filter((m) => m.id !== membro.id));
  };

  const roleBadge = (role) => {
    const cls =
      role === "owner"
        ? "bg-purple-50 text-purple-700"
        : role === "admin"
        ? "bg-blue-50 text-blue-700"
        : "bg-gray-100 text-gray-600";
    return (
      <span className={`px-1.5 py-0.5 rounded text-[11px] capitalize ${cls}`}>{role}</span>
    );
  };

  if (!aberto || !tenant) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg border border-gray-200 w-full max-w-lg max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
          <div>
            <h3 className="text-sm font-semibold text-gray-800">
              Membros — {tenant.nome}
            </h3>
            <p className="text-[11px] text-gray-400 mt-0.5">
              Vincule usuários cadastrados no sistema a este tenant
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-1 rounded hover:bg-gray-100"
          >
            <Icons.X />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {/* Formulário de adição / edição */}
          {mostrarForm ? (
            <div className="border border-gray-200 rounded-lg p-3 bg-gray-50 space-y-2.5">
              <h4 className="text-xs font-semibold text-gray-700">
                {editando ? "Editar Perfil do Membro" : "Vincular Usuário"}
              </h4>

              {!editando && (
                <div>
                  <label className="block text-xs text-gray-600 mb-0.5">
                    Usuário *
                  </label>
                  {carregandoUsuarios ? (
                    <p className="text-xs text-gray-400 italic">Carregando usuários...</p>
                  ) : usuariosDisponiveis.length === 0 ? (
                    <p className="text-xs text-gray-400 italic">
                      Todos os usuários do sistema já são membros deste tenant.
                    </p>
                  ) : (
                    <select
                      value={form.user_id}
                      onChange={(e) => setForm({ ...form, user_id: e.target.value })}
                      className="w-full border border-gray-200 rounded px-2.5 py-1.5 text-sm focus:ring-1 focus:ring-gray-400 outline-none bg-white"
                    >
                      <option value="">Selecione um usuário...</option>
                      {usuariosDisponiveis.map((u) => (
                        <option key={u.user_id} value={u.user_id}>
                          {u.email}
                        </option>
                      ))}
                    </select>
                  )}
                </div>
              )}

              {editando && (
                <div className="bg-white border border-gray-100 rounded px-2.5 py-1.5">
                  <p className="text-xs text-gray-500">
                    <span className="font-medium text-gray-700">{editando.email}</span>
                  </p>
                </div>
              )}

              <div>
                <label className="block text-xs text-gray-600 mb-0.5">Perfil</label>
                <select
                  value={form.role}
                  onChange={(e) => setForm({ ...form, role: e.target.value })}
                  className="w-full border border-gray-200 rounded px-2.5 py-1.5 text-sm focus:ring-1 focus:ring-gray-400 outline-none bg-white"
                >
                  {ROLES.map((r) => (
                    <option key={r.value} value={r.value}>
                      {r.label}
                    </option>
                  ))}
                </select>
              </div>

              {erro && (
                <p className="text-xs text-red-600 bg-red-50 px-2.5 py-1.5 rounded">
                  {erro}
                </p>
              )}

              <div className="flex gap-2">
                <button
                  onClick={cancelarForm}
                  className="flex-1 px-3 py-1.5 border border-gray-200 rounded text-xs hover:bg-white"
                >
                  Cancelar
                </button>
                <button
                  onClick={salvar}
                  disabled={salvando || (!editando && !form.user_id)}
                  className="flex-1 px-3 py-1.5 bg-gray-800 text-white rounded text-xs hover:bg-gray-700 disabled:opacity-50"
                >
                  {salvando ? "Salvando..." : editando ? "Salvar" : "Vincular"}
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={abrirNovoMembro}
              className="w-full inline-flex items-center justify-center gap-1 border border-dashed border-gray-300 rounded-lg px-3 py-2 text-xs text-gray-500 hover:border-gray-400 hover:text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <Icons.Plus />
              Vincular usuário
            </button>
          )}

          {/* Lista de membros */}
          {carregando ? (
            <div className="text-center py-6">
              <span className="text-xs text-gray-400">Carregando...</span>
            </div>
          ) : membros.length === 0 ? (
            <div className="text-center py-6">
              <p className="text-xs text-gray-400">Nenhum usuário vinculado a este tenant.</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100 border border-gray-200 rounded-lg overflow-hidden">
              {membros.map((membro) => (
                <div
                  key={membro.id}
                  className="flex items-center gap-3 px-3 py-2.5 bg-white hover:bg-gray-50"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-gray-800 truncate">
                      {membro.email || "-"}
                    </p>
                    <p className="text-[11px] text-gray-400 mt-0.5">
                      Desde {membro.created_at
                        ? new Date(membro.created_at).toLocaleDateString("pt-BR")
                        : "-"}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {roleBadge(membro.role)}
                    <button
                      onClick={() => abrirEditarMembro(membro)}
                      className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-1 rounded"
                      title="Editar perfil"
                    >
                      <Icons.Edit />
                    </button>
                    <button
                      onClick={() => remover(membro)}
                      className="text-gray-400 hover:text-red-600 hover:bg-red-50 p-1 rounded"
                      title="Remover vínculo"
                    >
                      <Icons.Trash />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {erro && !mostrarForm && (
            <p className="text-xs text-red-600 bg-red-50 px-2.5 py-1.5 rounded">{erro}</p>
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-3 border-t border-gray-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 border border-gray-200 rounded text-xs hover:bg-gray-50"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}
