import React, { useState } from "react";
import { supabase } from "../lib/supabase";
import { DataGrid } from "../components/DataGrid";
import { Icons } from "../components/Icons";
import { useTenant } from "../contexts/TenantContext";

export function UsuariosPage() {
  const { tenantId, usuarios, salvarUsuario, criarEVincularUsuario, excluirUsuario } = useTenant();

  const [modalUsuario, setModalUsuario] = useState(false);
  const [editandoUsuario, setEditandoUsuario] = useState(null);
  const [formUsuario, setFormUsuario] = useState({ user_id: "", role: "member" });
  const [usuariosSistema, setUsuariosSistema] = useState([]);
  const [modoModalUsuario, setModoModalUsuario] = useState("vincular");
  const [formNovoUsuario, setFormNovoUsuario] = useState({ email: "", role: "member" });

  const abrirModalUsuario = async (u = null) => {
    if (u) {
      setEditandoUsuario(u);
      setFormUsuario({ user_id: u.user_id || "", role: u.role || "member" });
    } else {
      setEditandoUsuario(null);
      setFormUsuario({ user_id: "", role: "member" });
      const { data, error } = await supabase.rpc("get_system_users_for_tenant", {
        p_tenant_id: tenantId,
      });
      if (!error && data) setUsuariosSistema(data);
    }
    setModalUsuario(true);
  };

  const fecharModalUsuario = () => {
    setModalUsuario(false);
    setEditandoUsuario(null);
    setFormUsuario({ user_id: "", role: "member" });
    setUsuariosSistema([]);
    setModoModalUsuario("vincular");
    setFormNovoUsuario({ email: "", role: "member" });
  };

  const handleSalvar = async () => {
    try {
      await salvarUsuario(editandoUsuario, formUsuario);
      fecharModalUsuario();
    } catch (e) {
      alert(e.message);
    }
  };

  const handleCriar = async () => {
    try {
      const email = await criarEVincularUsuario(formNovoUsuario);
      fecharModalUsuario();
      alert(`Usuário criado! Um email de confirmação foi enviado para ${email}.`);
    } catch (e) {
      alert(e.message);
    }
  };

  const handleExcluir = async (id) => {
    if (!confirm("Excluir usuário?")) return;
    try {
      await excluirUsuario(id);
    } catch (e) {
      alert(e.message);
    }
  };

  const actBtns = (onEdit, onDel) => (
    <div className="flex items-center gap-1">
      <button onClick={onEdit} className="text-gray-500 hover:text-gray-700 hover:bg-gray-100 p-1 rounded">
        <Icons.Edit />
      </button>
      <button onClick={onDel} className="text-gray-400 hover:text-red-600 hover:bg-red-50 p-1 rounded">
        <Icons.Trash />
      </button>
    </div>
  );

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-gray-700">Usuários</h2>
        <button
          onClick={() => abrirModalUsuario()}
          className="inline-flex items-center gap-1 bg-gray-800 hover:bg-gray-700 text-white px-3 py-1.5 rounded text-xs font-medium"
        >
          <Icons.Plus />Novo
        </button>
      </div>

      <DataGrid
        columns={[
          { key: "email", label: "Email", render: (u) => <span className="font-medium text-gray-800">{u.email || "-"}</span>, filterValue: (u) => u.email || "" },
          { key: "role", label: "Perfil", render: (u) => { const r = u.role || "member"; const cls = r === "owner" ? "bg-purple-50 text-purple-700" : r === "admin" ? "bg-blue-50 text-blue-700" : "bg-gray-100 text-gray-600"; return <span className={`px-1.5 py-0.5 rounded text-[11px] capitalize ${cls}`}>{r}</span>; }, filterValue: (u) => u.role || "" },
          { key: "created_at", label: "Cadastro", render: (u) => <span className="text-gray-500">{u.created_at ? new Date(u.created_at).toLocaleDateString("pt-BR") : "-"}</span>, filterValue: (u) => u.created_at ? new Date(u.created_at).toLocaleDateString("pt-BR") : "", sortValue: (u) => u.created_at },
        ]}
        data={usuarios}
        actions={(u) => actBtns(() => abrirModalUsuario(u), () => handleExcluir(u.id))}
        emptyMessage="Nenhum usuário cadastrado."
      />

      {modalUsuario && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg border border-gray-200 max-w-sm w-full p-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-sm font-semibold mb-3">{editandoUsuario ? "Editar Usuário" : "Novo Usuário"}</h3>
            <div className="space-y-2.5">
              {!editandoUsuario && (
                <div className="flex gap-1 mb-1">
                  <button onClick={() => setModoModalUsuario("vincular")} className={`flex-1 px-2 py-1 text-xs rounded border ${modoModalUsuario === "vincular" ? "bg-gray-800 text-white border-gray-800" : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"}`}>Vincular existente</button>
                  <button onClick={() => setModoModalUsuario("criar")} className={`flex-1 px-2 py-1 text-xs rounded border ${modoModalUsuario === "criar" ? "bg-gray-800 text-white border-gray-800" : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"}`}>Criar novo</button>
                </div>
              )}

              {!editandoUsuario && modoModalUsuario === "vincular" && (
                <div>
                  <label className="block text-xs text-gray-600 mb-0.5">Usuário *</label>
                  {usuariosSistema.length === 0 ? (
                    <p className="text-xs text-gray-400 italic">Nenhum usuário disponível. Use "Criar novo" para cadastrar.</p>
                  ) : (
                    <select value={formUsuario.user_id} onChange={(e) => setFormUsuario({ ...formUsuario, user_id: e.target.value })} className="w-full border border-gray-200 rounded px-2.5 py-1.5 text-sm focus:ring-1 focus:ring-gray-400 outline-none">
                      <option value="">Selecione um usuário...</option>
                      {usuariosSistema.map((u) => <option key={u.user_id} value={u.user_id}>{u.email}</option>)}
                    </select>
                  )}
                </div>
              )}

              {!editandoUsuario && modoModalUsuario === "criar" && (
                <div className="space-y-2">
                  <div>
                    <label className="block text-xs text-gray-600 mb-0.5">Email *</label>
                    <input type="email" value={formNovoUsuario.email} onChange={(e) => setFormNovoUsuario({ ...formNovoUsuario, email: e.target.value })} placeholder="email@exemplo.com" className="w-full border border-gray-200 rounded px-2.5 py-1.5 text-sm focus:ring-1 focus:ring-gray-400 outline-none" />
                  </div>
                  <p className="text-[11px] text-gray-400">Uma senha temporária será gerada e um email de confirmação enviado ao usuário.</p>
                </div>
              )}

              {editandoUsuario && (
                <div className="bg-gray-50 border border-gray-100 rounded px-2.5 py-1.5">
                  <p className="text-xs text-gray-500">Email: <span className="font-medium text-gray-700">{editandoUsuario.email}</span></p>
                </div>
              )}

              <div>
                <label className="block text-xs text-gray-600 mb-0.5">Perfil</label>
                <select
                  value={editandoUsuario ? formUsuario.role : (modoModalUsuario === "criar" ? formNovoUsuario.role : formUsuario.role)}
                  onChange={(e) => {
                    if (editandoUsuario || modoModalUsuario === "vincular") setFormUsuario({ ...formUsuario, role: e.target.value });
                    else setFormNovoUsuario({ ...formNovoUsuario, role: e.target.value });
                  }}
                  className="w-full border border-gray-200 rounded px-2.5 py-1.5 text-sm focus:ring-1 focus:ring-gray-400 outline-none"
                >
                  <option value="owner">Owner</option>
                  <option value="admin">Admin</option>
                  <option value="member">Member</option>
                </select>
              </div>

              {editandoUsuario?.created_at && (
                <div className="bg-gray-50 border border-gray-200 rounded p-2.5">
                  <p className="text-[11px] text-gray-500">Membro desde: <span className="font-medium text-gray-700">{new Date(editandoUsuario.created_at).toLocaleDateString("pt-BR")}</span></p>
                </div>
              )}
            </div>

            <div className="flex gap-2 mt-4">
              <button onClick={fecharModalUsuario} className="flex-1 px-3 py-1.5 border border-gray-200 rounded text-xs hover:bg-gray-50">Cancelar</button>
              <button
                onClick={!editandoUsuario && modoModalUsuario === "criar" ? handleCriar : handleSalvar}
                disabled={!editandoUsuario && modoModalUsuario === "vincular" && !formUsuario.user_id}
                className="flex-1 px-3 py-1.5 bg-gray-800 text-white rounded text-xs hover:bg-gray-700 disabled:opacity-50"
              >
                {editandoUsuario ? "Salvar" : modoModalUsuario === "criar" ? "Criar e Vincular" : "Vincular"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
