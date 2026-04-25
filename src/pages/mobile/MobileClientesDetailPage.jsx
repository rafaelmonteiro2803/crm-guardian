import { useAuth } from '../../contexts/AuthContext';
import { useTenant } from '../../contexts/TenantContext';
import { useClientes } from '../../hooks/useClientes';
import { useMobileRouter } from '../../contexts/MobileRouterContext';
import { MobileLayout } from '../../templates/MobileLayout';
import { Header, Card, Avatar, Button, Section } from '../../components/mobile';
import { MessageCircle, Phone, MoreVertical } from 'lucide-react';

export function MobileClientesDetailPage({ clienteId }) {
  const { session } = useAuth();
  const { tenantId } = useTenant();
  const { clientes } = useClientes(tenantId, session?.user?.id);
  const { navigate, back } = useMobileRouter();

  const cliente = clientes.find((c) => c.id === clienteId);

  if (!cliente) {
    return (
      <MobileLayout activeTab="clientes" onTabChange={() => {}}>
        <div className="text-center py-s7">
          <p className="text-ink-3">Cliente não encontrado</p>
        </div>
      </MobileLayout>
    );
  }

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

  return (
    <MobileLayout
      activeTab="clientes"
      onTabChange={handleTabChange}
      headerProps={{
        title: cliente.nome,
        eyebrow: 'CLIENTE · DESDE MAI/24',
        back,
        right: <Button kind="ghost" size="sm" icon={MoreVertical} />,
      }}
    >
      <div className="space-y-s5 pb-s6">
        {/* Hero Card */}
        <Card thick variant="accent" padding="s6">
          <div className="flex flex-col items-center text-center gap-s4">
            <Avatar name={cliente.nome} size="lg" />
            <div>
              <p className="text-h2 font-bold">{cliente.nome}</p>
              <p className="text-micro text-accent-ink font-mono">{cliente.cpf}</p>
            </div>
            <div className="flex gap-s2 w-full">
              <Button kind="lime" full icon={MessageCircle}>
                WhatsApp
              </Button>
              <Button kind="ghost" full icon={Phone}>
                Ligar
              </Button>
            </div>
          </div>
        </Card>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-s3">
          <Card thick className="text-center">
            <p className="text-h2 font-bold text-ink">8</p>
            <p className="text-xs text-ink-3">Vendas</p>
          </Card>
          <Card thick className="text-center">
            <p className="text-h2 font-bold text-accent">R$ 14.2k</p>
            <p className="text-xs text-ink-3">Total</p>
          </Card>
          <Card thick className="text-center">
            <p className="text-h2 font-bold text-info">2</p>
            <p className="text-xs text-ink-3">Abertos</p>
          </Card>
        </div>

        {/* Information */}
        <Section label="Informações">
          <Card thick>
            <div className="space-y-s3 text-body">
              <div><span className="text-ink-3">Email:</span> {cliente.email}</div>
              <div><span className="text-ink-3">Telefone:</span> {cliente.telefone}</div>
              <div><span className="text-ink-3">Nascimento:</span> {cliente.data_nascimento}</div>
              <div><span className="text-ink-3">Empresa:</span> {cliente.empresa}</div>
            </div>
          </Card>
        </Section>

        {/* History */}
        <Section label="Histórico" onViewAll={() => {}}>
          <Card thick className="space-y-s2">
            <p className="text-micro text-ink-3 font-mono">17 ABR, 09:30</p>
            <p className="text-body">Venda concluída</p>
          </Card>
        </Section>
      </div>
    </MobileLayout>
  );
}
