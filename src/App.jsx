import React from "react";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { TenantProvider, useTenant } from "./contexts/TenantContext";
import { LoginPage } from "./pages/LoginPage";
import { AppShell } from "./components/AppShell";

function AppRouter() {
  const { session, loading } = useAuth();
  const { tenantId } = useTenant();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="text-gray-400 text-sm">Carregando...</span>
      </div>
    );
  }

  if (!session) return <LoginPage />;

  if (!tenantId) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="text-gray-400 text-sm">Carregando dados do tenant...</span>
      </div>
    );
  }

  return <AppShell />;
}

export default function App() {
  return (
    <AuthProvider>
      <TenantProvider>
        <AppRouter />
      </TenantProvider>
    </AuthProvider>
  );
}
