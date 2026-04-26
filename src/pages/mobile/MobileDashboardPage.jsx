import { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useTenant } from '../../contexts/TenantContext';
import { useClientes } from '../../hooks/useClientes';
import { useVendas } from '../../hooks/useVendas';
import { useOportunidades } from '../../hooks/useOportunidades';
import { useMobileRouter } from '../../contexts/MobileRouterContext';
import { MobileLayout } from '../../templates/MobileLayout';
import { Header, KpiCard, Section, Card, Avatar, Pill, Button } from '../../components/mobile';
import { Bell, ChevronRight } from 'lucide-react';

export function MobileDashboardPage() {
  const { session } = useAuth();
  const { tenantId } = useTenant();
  const { navigate } = useMobileRouter();
  const { clientes } = useClientes(tenantId, session?.user?.id);
  const { vendas } = useVendas(tenantId, session?.user?.id);
  const { oportunidades } = useOportunidades(tenantId, session?.user?.id);

  const [notificationCount, setNotificationCount] = useState(0);
  const userName = session?.user?.user_metadata?.name || session?.user?.email?.split('@')[0] || 'Usuário';
  const dayOfWeek = new Date().toLocaleDateString('pt-BR', { weekday: 'long' }).toUpperCase();
  const dateFormatted = new Date().toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
  });

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

  const totalReceber = vendas.reduce((sum, v) => sum + (parseFloat(v.valor) || 0), 0);
  const titulosPendentes = oportunidades.filter(o => o.estagio?.toLowerCase() !== 'fechado').length;
  const titulosVencidos = oportunidades.filter(o => o.probabilidade < 30).length;
  const pipelineValue = oportunidades.reduce((sum, o) => sum + (parseFloat(o.valor) || 0), 0);
  const pipelineAberto = oportunidades.filter(o => o.estagio?.toLowerCase() !== 'fechado').length;
  const ventasTotal = vendas.reduce((sum, v) => sum + (parseFloat(v.valor) || 0), 0);

  return (
    <MobileLayout
      activeTab="dashboard"
      onTabChange={handleTabChange}
      headerProps={{
        title: `Olá, ${userName}`,
        eyebrow: `${dayOfWeek}, ${dateFormatted}`.toUpperCase(),
        big: true,
        right: (
          <button className="relative p-s2 active:opacity-60">
            <Bell size={24} />
            {notificationCount > 0 && (
              <span className="absolute top-0 right-0 w-2 h-2 bg-neg rounded-full" />
            )}
          </button>
        ),
      }}
    >
      <div className="space-y-s6 pb-s6">
        {/* Hero KPI - A Receber */}
        <KpiCard
          label="A RECEBER · MÊS"
          value={`R$ ${(totalReceber / 1000).toFixed(1)}k`}
          sub={`${titulosPendentes} TÍTULOS · ${titulosVencidos} VENCIDOS`}
          variant="hero"
        />

        {/* Secondary KPIs Grid */}
        <div className="grid grid-cols-2 gap-s3">
          <KpiCard
            label="VENDAS MÊS"
            value={`R$ ${(ventasTotal / 1000).toFixed(1)}k`}
            sub={`${vendas.length} vendas`}
          />
          <KpiCard
            label="PIPELINE"
            value={`R$ ${(pipelineValue / 1000).toFixed(1)}k`}
            sub={`${pipelineAberto} abertas`}
          />
        </div>

        {/* Today's Schedule */}
        <Section label="Hoje" onViewAll={() => navigate('/m/clientes')}>
          <Card thick className="space-y-s4">
            <div className="flex items-center gap-s3">
              <div className="bg-accent text-accent-ink font-bold text-xs text-center rounded-md w-12 h-10 flex items-center justify-center">
                09:30
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-body font-bold truncate">João Silva</p>
                <p className="text-xs text-ink-3">Consultoria</p>
              </div>
              <ChevronRight className="text-ink-3" size={18} />
            </div>
          </Card>

          <Card thick className="space-y-s4">
            <div className="flex items-center gap-s3">
              <div className="bg-ink text-white font-bold text-xs text-center rounded-md w-12 h-10 flex items-center justify-center border border-ink">
                14:00
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-body font-bold truncate">Maria Santos</p>
                <p className="text-xs text-ink-3">Atendimento</p>
              </div>
              <ChevronRight className="text-ink-3" size={18} />
            </div>
          </Card>
        </Section>

        {/* Open Service Orders */}
        <Section label={`Atendimentos abertos · ${oportunidades.length}`}>
          {oportunidades.slice(0, 3).map((opp) => (
            <Card
              key={opp.id}
              thick
              onClick={() => navigate(`/m/vendas/${opp.id}`)}
              className="space-y-s2 cursor-pointer active:opacity-80"
            >
              <div className="flex items-start justify-between gap-s3">
                <div className="flex-1 min-w-0">
                  <p className="text-micro text-ink-3 font-mono">OS-{opp.id?.slice(0, 5)}</p>
                  <p className="text-body font-bold truncate">{opp.nome}</p>
                </div>
                <Pill label="Em atendimento" tone="info" />
              </div>
            </Card>
          ))}
        </Section>
      </div>
    </MobileLayout>
  );
}
