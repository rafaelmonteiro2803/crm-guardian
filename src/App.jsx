import React, { useMemo } from "react";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { TenantProvider, useTenant } from "./contexts/TenantContext";
import { MobileRouterProvider } from "./contexts/MobileRouterContext";
import { LoginPage } from "./pages/LoginPage";
import { AppShell } from "./components/AppShell";
import { MobileApp } from "./pages/mobile/MobileApp";

function AppRouter() {
  const { session, loading } = useAuth();
  const { tenantId } = useTenant();
  const isMobileRoute = useMemo(() => window.location.pathname.startsWith('/m/'), []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="text-gray-400 text-sm">Carregando...</span>
      </div>
    );
  }

  // Mobile routes
  if (isMobileRoute) {
    return (
      <MobileRouterProvider>
        <MobileApp />
      </MobileRouterProvider>
    );
  }

  // Web routes
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
