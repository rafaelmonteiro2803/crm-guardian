import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useTenant } from '../../contexts/TenantContext';
import { useOportunidades } from '../../hooks/useOportunidades';
import { useMobileRouter } from '../../contexts/MobileRouterContext';
import { MobileLayout } from '../../templates/MobileLayout';
import { Header, Card, Pill, SwipeCard } from '../../components/mobile';

export function MobilePipelinePage() {
  const { session } = useAuth();
  const { tenantId } = useTenant();
  const { oportunidades } = useOportunidades(tenantId, session?.user?.id);
  const { navigate } = useMobileRouter();
  const [activeStage, setActiveStage] = useState('proposta');

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

  const stages = ['prospecção', 'qualificação', 'proposta', 'negociação', 'fechado'];

  return (
    <MobileLayout
      activeTab="pipeline"
      onTabChange={handleTabChange}
      headerProps={{
        title: 'Pipeline',
        eyebrow: `TOTAL · R$ ${(oportunidades.reduce((sum, o) => sum + (parseFloat(o.valor) || 0), 0) / 1000).toFixed(1)}k`,
        big: true,
      }}
    >
      <div className="space-y-s5 pb-s6">
        {/* Stage Chips */}
        <div className="overflow-x-auto flex gap-s2 px-s5 -mx-s5">
          {stages.map((stage) => (
            <button
              key={stage}
              onClick={() => setActiveStage(stage)}
              className={`px-s4 py-s2 rounded-pill text-xs font-semibold whitespace-nowrap border-thick ${
                activeStage === stage
                  ? 'bg-accent border-accent text-accent-ink'
                  : 'bg-surface border-line text-ink'
              }`}
            >
              {stage} (0)
            </button>
          ))}
        </div>

        {/* Pipeline Cards */}
        <div className="space-y-s3 px-s5 -mx-s5">
          {oportunidades
            .filter((opp) => opp.stage?.toLowerCase() === activeStage)
            .map((opp) => (
              <SwipeCard
                key={opp.id}
                onClick={() => navigate(`/m/pipeline/${opp.id}`)}
                actions={[
                  {
                    label: '→ Próxima\netapa',
                    color: 'bg-accent',
                    onPress: () => {
                      // TODO: Move to next stage
                    },
                  },
                  {
                    label: '← Etapa\nanterior',
                    color: 'bg-ink',
                    onPress: () => {
                      // TODO: Move to previous stage
                    },
                  },
                  {
                    label: 'Marcar\nganho',
                    color: 'bg-pos',
                    onPress: () => {
                      // TODO: Mark as won
                    },
                  },
                ]}
              >
                <div className="space-y-s3">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-body font-bold">{opp.nome}</p>
                      <p className="text-xs text-ink-3">{opp.cliente_nome}</p>
                    </div>
                    <p className="text-h3 font-bold text-accent">R$ {opp.valor}</p>
                  </div>
                  <div className="w-full bg-line-2 rounded-sm h-2">
                    <div
                      className="bg-accent h-full rounded-sm border border-accent"
                      style={{ width: `${opp.probabilidade || 50}%` }}
                    />
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-warn">2 DIAS SEM CONTATO</span>
                    <span className="text-ink-3">{opp.probabilidade}% prob.</span>
                  </div>
                </div>
              </SwipeCard>
            ))}
        </div>

        {oportunidades.filter((o) => o.stage?.toLowerCase() === activeStage).length === 0 && (
          <div className="text-center py-s7 px-s5">
            <p className="text-ink-3">Nenhuma oportunidade neste estágio</p>
          </div>
        )}
      </div>
    </MobileLayout>
  );
}
