import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useTenant } from '../../contexts/TenantContext';
import { useOportunidades } from '../../hooks/useOportunidades';
import { useMobileRouter } from '../../contexts/MobileRouterContext';
import { MobileLayout } from '../../templates/MobileLayout';
import { Header, Card, Pill, SwipeCard, EmptyState } from '../../components/mobile';
import { TrendingUp } from 'lucide-react';

export function MobilePipelinePage() {
  const { session } = useAuth();
  const { tenantId } = useTenant();
  const { oportunidades, moverOportunidade } = useOportunidades(tenantId, session?.user?.id);
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

  const getNextStage = (current) => {
    const idx = stages.indexOf(current?.toLowerCase() || '');
    return idx < stages.length - 1 ? stages[idx + 1] : null;
  };

  const getPrevStage = (current) => {
    const idx = stages.indexOf(current?.toLowerCase() || '');
    return idx > 0 ? stages[idx - 1] : null;
  };

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
                    onPress: async () => {
                      const nextStage = getNextStage(opp.estagio);
                      if (nextStage) await moverOportunidade(opp.id, nextStage);
                    },
                  },
                  {
                    label: '← Etapa\nanterior',
                    color: 'bg-ink',
                    onPress: async () => {
                      const prevStage = getPrevStage(opp.estagio);
                      if (prevStage) await moverOportunidade(opp.id, prevStage);
                    },
                  },
                  {
                    label: 'Marcar\nganho',
                    color: 'bg-pos',
                    onPress: async () => {
                      await moverOportunidade(opp.id, 'fechado');
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
          <EmptyState
            icon={TrendingUp}
            title={oportunidades.length === 0 ? 'Nenhuma oportunidade' : 'Vazio neste estágio'}
            description={oportunidades.length === 0
              ? 'Crie sua primeira oportunidade para acompanhar o pipeline de vendas'
              : 'Mova oportunidades entre estágios usando swipe'
            }
            action={oportunidades.length === 0 ? 'Criar oportunidade' : undefined}
            onAction={oportunidades.length === 0 ? () => navigate('/m/pipeline/nova') : undefined}
          />
        )}
      </div>
    </MobileLayout>
  );
}
