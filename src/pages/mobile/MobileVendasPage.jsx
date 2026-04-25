import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useTenant } from '../../contexts/TenantContext';
import { useVendas } from '../../hooks/useVendas';
import { useMobileRouter } from '../../contexts/MobileRouterContext';
import { MobileLayout } from '../../templates/MobileLayout';
import { Header, Card, KpiCard, Pill, SwipeCard, EmptyState } from '../../components/mobile';
import { ShoppingCart } from 'lucide-react';

export function MobileVendasPage() {
  const { session } = useAuth();
  const { tenantId } = useTenant();
  const { vendas } = useVendas(tenantId, session?.user?.id);
  const { navigate } = useMobileRouter();
  const [activeStatus, setActiveStatus] = useState('todas');

  const handleTabChange = (tab) => {
    const routes = {
      dashboard: '/m/',
      clientes: '/m/clientes',
      pipeline: '/m/pipeline',
      vendas: '/m/vendas',
      financeiro: '/m/financeiro',
    };
    navigate(routes[tab]);
  };

  const statuses = [
    { id: 'todas', label: 'Todas' },
    { id: 'pagas', label: 'Pagas' },
    { id: 'pendentes', label: 'Pendentes' },
    { id: 'vencidas', label: 'Vencidas' },
  ];

  const totalMes = vendas.reduce((sum, v) => sum + (parseFloat(v.valor) || 0), 0);
  const ticketMedio = vendas.length > 0 ? (totalMes / vendas.length).toFixed(2) : 0;

  return (
    <MobileLayout
      activeTab="vendas"
      onTabChange={handleTabChange}
      headerProps={{
        title: 'Vendas',
        eyebrow: 'ABRIL',
        big: true,
      }}
    >
      <div className="space-y-s5 pb-s6">
        {/* Hero KPI */}
        <KpiCard
          label="TOTAL MÊS"
          value={`R$ ${(totalMes / 1000).toFixed(1)}k`}
          sub={`${vendas.length} vendas · Ticket médio R$ ${ticketMedio}`}
          variant="hero"
        />

        {/* Status Chips */}
        <div className="overflow-x-auto flex gap-s2 px-s5 -mx-s5">
          {statuses.map((status) => (
            <button
              key={status.id}
              onClick={() => setActiveStatus(status.id)}
              className={`px-s4 py-s2 rounded-pill text-xs font-semibold whitespace-nowrap border-thick ${
                activeStatus === status.id
                  ? 'bg-accent border-accent text-accent-ink'
                  : 'bg-surface border-line text-ink'
              }`}
            >
              {status.label}
            </button>
          ))}
        </div>

        {/* Sales Cards */}
        <div className="space-y-s3 px-s5 -mx-s5">
          {vendas.map((venda) => (
            <SwipeCard
              key={venda.id}
              onClick={() => navigate(`/m/vendas/${venda.id}`)}
              actions={[
                {
                  label: 'Registrar\npagamento',
                  color: 'bg-pos',
                  onPress: () => {
                    // TODO: Open payment modal
                  },
                },
                {
                  label: 'Ver\ntítulos',
                  color: 'bg-info',
                  onPress: () => navigate(`/m/vendas/${venda.id}/titulos`),
                },
              ]}
            >
              <div className="space-y-s3">
                <div className="flex justify-between items-center">
                  <p className="text-micro text-ink-3 font-mono">{venda.data_venda}</p>
                  <Pill label={venda.status || 'Pendente'} tone="warn" />
                </div>
                <div className="flex justify-between items-end">
                  <div>
                    <p className="text-body font-bold">{venda.cliente_nome}</p>
                    <p className="text-xs text-ink-3">{venda.descricao}</p>
                  </div>
                  <p className="text-h3 font-bold">R$ {venda.valor}</p>
                </div>
              </div>
            </SwipeCard>
          ))}
        </div>

        {vendas.length === 0 && (
          <EmptyState
            icon={ShoppingCart}
            title="Nenhuma venda"
            description="Registre sua primeira venda para acompanhar o faturamento"
            action="Registrar venda"
            onAction={() => navigate('/m/vendas/nova')}
          />
        )}
      </div>
    </MobileLayout>
  );
}
