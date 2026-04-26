import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useTenant } from '../../contexts/TenantContext';
import { useVendas } from '../../hooks/useVendas';
import { useMobileRouter } from '../../contexts/MobileRouterContext';
import { MobileLayout } from '../../templates/MobileLayout';
import { Header, Card, KpiCard, Pill, SwipeCard, EmptyState } from '../../components/mobile';
import { DollarSign } from 'lucide-react';

export function MobileFinanceiroPage() {
  const { session } = useAuth();
  const { tenantId } = useTenant();
  const { titulos, marcarComoPago } = useVendas(tenantId, session?.user?.id);
  const { navigate } = useMobileRouter();
  const [activeFilter, setActiveFilter] = useState('todos');

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

  const filters = [
    { id: 'todos', label: 'Todos' },
    { id: 'hoje', label: 'Hoje' },
    { id: 'vencidos', label: 'Vencidos' },
    { id: 'semana', label: 'Esta semana' },
    { id: 'pagos', label: 'Pagos' },
  ];

  const totals = {
    pagos: titulos.filter((t) => t.status === 'pago').reduce((sum, t) => sum + (parseFloat(t.valor) || 0), 0),
    pendente: titulos.filter((t) => t.status !== 'pago').reduce((sum, t) => sum + (parseFloat(t.valor) || 0), 0),
    vencido: titulos.filter((t) => t.status === 'vencido').reduce((sum, t) => sum + (parseFloat(t.valor) || 0), 0),
  };

  const filterTitulos = () => {
    switch (activeFilter) {
      case 'pagos':
        return titulos.filter((t) => t.status === 'pago');
      case 'vencidos':
        return titulos.filter((t) => t.status === 'vencido');
      case 'semana':
        const today = new Date();
        const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
        return titulos.filter((t) => {
          const venc = new Date(t.data_vencimento);
          return venc >= today && venc <= nextWeek;
        });
      case 'hoje':
        const todayStr = new Date().toISOString().split('T')[0];
        return titulos.filter((t) => t.data_vencimento === todayStr);
      default:
        return titulos;
    }
  };

  return (
    <MobileLayout
      activeTab="financeiro"
      onTabChange={handleTabChange}
      headerProps={{
        title: 'Financeiro',
        eyebrow: 'TÍTULOS · ABRIL',
        big: true,
      }}
    >
      <div className="space-y-s5 pb-s6">
        {/* KPI Grid */}
        <div className="space-y-s3 px-s5 -mx-s5">
          <Card thick className="bg-pos-soft text-center">
            <p className="text-micro text-pos font-semibold uppercase">Pagos</p>
            <p className="text-h2 font-bold text-pos">R$ {(totals.pagos / 1000).toFixed(1)}k</p>
          </Card>
          <Card thick className="text-center">
            <p className="text-micro text-ink-3 font-semibold uppercase">Pendente</p>
            <p className="text-h2 font-bold text-ink">R$ {(totals.pendente / 1000).toFixed(1)}k</p>
          </Card>
          <Card thick variant="danger" className="text-center">
            <p className="text-micro text-neg font-semibold uppercase">Vencido</p>
            <p className="text-h2 font-bold text-neg">R$ {(totals.vencido / 1000).toFixed(1)}k</p>
          </Card>
        </div>

        {/* Filter Chips */}
        <div className="overflow-x-auto flex gap-s2 px-s5 -mx-s5">
          {filters.map((filter) => (
            <button
              key={filter.id}
              onClick={() => setActiveFilter(filter.id)}
              className={`px-s4 py-s2 rounded-pill text-xs font-semibold whitespace-nowrap border-thick ${
                activeFilter === filter.id
                  ? 'bg-accent border-accent text-accent-ink'
                  : 'bg-surface border-line text-ink'
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>

        {/* Títulos List */}
        <div className="space-y-s3 px-s5 -mx-s5">
          {filterTitulos().map((titulo) => (
            <SwipeCard
              key={titulo.id}
              onClick={() => navigate(`/m/financeiro/${titulo.id}`)}
              actions={[
                {
                  label: 'Marcar\npago',
                  color: 'bg-pos',
                  onPress: async () => {
                    await marcarComoPago(titulo.id);
                  },
                },
                {
                  label: 'Pagar\nparcial',
                  color: 'bg-warn',
                  onPress: () => {
                    navigate(`/m/financeiro/${titulo.id}/pagar-parcial`);
                  },
                },
              ]}
            >
              <div className="space-y-s2">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-body font-bold">{titulo.cliente_nome}</p>
                  </div>
                  <Pill label={titulo.status || 'Pendente'} tone={titulo.status === 'pago' ? 'pos' : 'warn'} />
                </div>
                <div className="flex justify-between items-end">
                  <p className="text-micro text-ink-3 font-mono">VENC. {titulo.data_vencimento}</p>
                  <p className="text-h3 font-bold">R$ {titulo.valor}</p>
                </div>
              </div>
            </SwipeCard>
          ))}
        </div>

        {titulos.length === 0 && (
          <EmptyState
            icon={DollarSign}
            title="Nenhum título"
            description="Os títulos a receber aparecerão aqui conforme você registra vendas"
            action="Criar venda"
            onAction={() => navigate('/m/vendas')}
          />
        )}
      </div>
    </MobileLayout>
  );
}
