import { useAuth } from '../../contexts/AuthContext';
import { useTenant } from '../../contexts/TenantContext';
import { useClientes } from '../../hooks/useClientes';
import { useVendas } from '../../hooks/useVendas';
import { useMobileRouter } from '../../contexts/MobileRouterContext';
import { MobileLayout } from '../../templates/MobileLayout';
import { Header, Card, Avatar, Button, Section } from '../../components/mobile';
import { MessageCircle, Phone, MoreVertical } from 'lucide-react';

export function MobileClientesDetailPage({ clienteId }) {
  const { session } = useAuth();
  const { tenantId } = useTenant();
  const { clientes } = useClientes(tenantId, session?.user?.id);
  const { vendas } = useVendas(tenantId, session?.user?.id);
  const { navigate, back } = useMobileRouter();

  const cliente = clientes.find((c) => c.id === clienteId);
  const vendasCliente = vendas.filter((v) => v.cliente_id === clienteId);
  const totalVendas = vendasCliente.reduce((sum, v) => sum + (parseFloat(v.valor) || 0), 0);
  const vendasAbertas = vendasCliente.filter((v) => v.status !== 'pago').length;

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
        eyebrow: `CLIENTE · DESDE ${cliente.data_cadastro ? new Date(cliente.data_cadastro).toLocaleDateString('pt-BR', { month: 'short', year: '2-digit' }).toUpperCase() : 'DESCONHECIDO'}`,
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
            <p className="text-h2 font-bold text-ink">{vendasCliente.length}</p>
            <p className="text-xs text-ink-3">Vendas</p>
          </Card>
          <Card thick className="text-center">
            <p className="text-h2 font-bold text-accent">R$ {(totalVendas / 1000).toFixed(1)}k</p>
            <p className="text-xs text-ink-3">Total</p>
          </Card>
          <Card thick className="text-center">
            <p className="text-h2 font-bold text-info">{vendasAbertas}</p>
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
        <Section label={`Vendas · ${vendasCliente.length}`}>
          {vendasCliente.slice(0, 5).map((venda) => (
            <Card
              key={venda.id}
              thick
              className="space-y-s2 cursor-pointer active:opacity-80"
              onClick={() => navigate(`/m/vendas/${venda.id}`)}
            >
              <p className="text-micro text-ink-3 font-mono">{venda.data_venda?.split('-').reverse().join('/')}</p>
              <p className="text-body font-semibold">{venda.descricao}</p>
              <p className="text-h3 font-bold text-accent">R$ {venda.valor}</p>
            </Card>
          ))}
        </Section>
      </div>
    </MobileLayout>
  );
}
