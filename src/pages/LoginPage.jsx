import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useTenant } from "../contexts/TenantContext";

export function LoginPage() {
  const { handleSignIn, handleSignUp } = useAuth();
  const { selectedTenantId, setSelectedTenantId, tenantsList, tenantLocked } = useTenant();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [authMessage, setAuthMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAuthMessage("");
    if (isSignUp) {
      const msg = await handleSignUp(email, password);
      setAuthMessage(msg || "");
    } else {
      const err = await handleSignIn(email, password);
      if (err) setAuthMessage(err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white border border-gray-200 rounded-lg max-w-sm w-full p-6">
        <h1 className="text-lg font-semibold text-center text-gray-800 mb-1">CRM GuardIAn</h1>
        <p className="text-center text-gray-400 text-xs mb-5">Sistema de Gestão</p>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Tenant</label>
            <select
              value={selectedTenantId}
              onChange={(e) => setSelectedTenantId(e.target.value)}
              className={`w-full border border-gray-200 rounded px-2.5 py-1.5 text-sm focus:ring-1 focus:ring-gray-400 outline-none${tenantLocked ? " bg-gray-100 cursor-not-allowed" : ""}`}
              disabled={tenantLocked}
              required
            >
              <option value="">Selecione o tenant...</option>
              {tenantsList.map((t) => (
                <option key={t.id} value={t.id}>{t.nome}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-200 rounded px-2.5 py-1.5 text-sm focus:ring-1 focus:ring-gray-400 outline-none"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Senha</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-200 rounded px-2.5 py-1.5 text-sm focus:ring-1 focus:ring-gray-400 outline-none"
              required
            />
          </div>
          {authMessage && (
            <div className={`p-2 rounded text-xs ${authMessage.includes("Erro") ? "bg-red-50 text-red-600" : "bg-green-50 text-green-600"}`}>
              {authMessage}
            </div>
          )}
          <button
            type="submit"
            className="w-full bg-gray-800 hover:bg-gray-700 text-white py-1.5 rounded text-sm font-medium"
          >
            {isSignUp ? "Criar Conta" : "Entrar"}
          </button>
        </form>
        <button
          onClick={() => { setIsSignUp(!isSignUp); setAuthMessage(""); }}
          className="w-full mt-3 text-gray-500 text-xs hover:text-gray-700"
        >
          {isSignUp ? "Já tem conta? Faça login" : "Não tem conta? Criar uma"}
        </button>
      </div>
    </div>
  );
}
