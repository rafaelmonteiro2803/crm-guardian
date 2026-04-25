import { useAuth } from '../../contexts/AuthContext';
import { useTenant } from '../../contexts/TenantContext';
import { useMobileRouter } from '../../contexts/MobileRouterContext';
import { MobileLoginPage } from './MobileLoginPage';
import { MobileDashboardPage } from './MobileDashboardPage';
import { MobileClientesListPage } from './MobileClientesListPage';
import { MobileClientesDetailPage } from './MobileClientesDetailPage';
import { MobilePipelinePage } from './MobilePipelinePage';
import { MobileVendasPage } from './MobileVendasPage';
import { MobileFinanceiroPage } from './MobileFinanceiroPage';

export function MobileApp() {
  const { session, loading: authLoading } = useAuth();
  const { tenantId, loading: tenantLoading } = useTenant();
  const { route } = useMobileRouter();

  if (authLoading || tenantLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg">
        <p className="text-ink-3">Carregando...</p>
      </div>
    );
  }

  if (!session) {
    return <MobileLoginPage />;
  }

  if (!tenantId) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg">
        <p className="text-ink-3">Selecionando empresa...</p>
      </div>
    );
  }

  // Route matching
  const segments = route.replace('/m/', '').split('/').filter(Boolean);
  const [page, ...rest] = segments;
  const id = rest?.[0];

  switch (page) {
    case 'login':
      return <MobileLoginPage />;
    case 'clientes':
      return id ? (
        <MobileClientesDetailPage clienteId={id} />
      ) : (
        <MobileClientesListPage />
      );
    case 'pipeline':
      return <MobilePipelinePage />;
    case 'vendas':
      return <MobileVendasPage />;
    case 'financeiro':
      return <MobileFinanceiroPage />;
    default:
      return <MobileDashboardPage />;
  }
}
