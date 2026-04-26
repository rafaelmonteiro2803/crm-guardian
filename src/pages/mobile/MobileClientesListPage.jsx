import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useTenant } from '../../contexts/TenantContext';
import { useClientes } from '../../hooks/useClientes';
import { useMobileRouter } from '../../contexts/MobileRouterContext';
import { MobileLayout } from '../../templates/MobileLayout';
import { Header, Card, Avatar, Button, Input, SwipeCard, EmptyState } from '../../components/mobile';
import { Phone, MessageCircle, Plus, Users } from 'lucide-react';

export function MobileClientesListPage() {
  const { session } = useAuth();
  const { tenantId } = useTenant();
  const { clientes } = useClientes(tenantId, session?.user?.id);
  const { navigate, back } = useMobileRouter();
  const [search, setSearch] = useState('');

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

  const filteredClientes = clientes.filter(
    (c) =>
      c.nome?.toLowerCase().includes(search.toLowerCase()) ||
      c.telefone?.includes(search) ||
      c.cpf?.includes(search)
  );

  return (
    <MobileLayout
      activeTab="clientes"
      onTabChange={handleTabChange}
      headerProps={{
        title: 'Clientes',
        eyebrow: `${clientes.length} CADASTRADOS`,
        big: true,
        right: (
          <Button kind="primary" size="sm" icon={Plus} onClick={() => navigate('/m/clientes/novo')}>
            Novo
          </Button>
        ),
      }}
    >
      <div className="space-y-s4 pb-s6">
        {/* Search */}
        <Input
          type="text"
          placeholder="Buscar por nome, CPF, telefone…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {/* Clients List */}
        <div className="space-y-s3">
          {filteredClientes.map((cliente) => (
            <SwipeCard
              key={cliente.id}
              onClick={() => navigate(`/m/clientes/${cliente.id}`)}
              actions={[
                {
                  label: 'Editar',
                  color: 'bg-ink',
                  onPress: () => navigate(`/m/clientes/${cliente.id}/editar`),
                },
                {
                  label: 'Arquivar',
                  color: 'bg-neg',
                  onPress: async () => {
                    if (confirm('Arquivar cliente?')) {
                      await excluir(cliente.id);
                    }
                  },
                },
              ]}
            >
              <div className="flex items-center gap-s4 mb-s3">
                <Avatar name={cliente.nome} size="md" />
                <div className="flex-1 min-w-0">
                  <p className="text-body font-bold truncate">{cliente.nome}</p>
                  <p className="text-xs text-ink-3 truncate">{cliente.empresa}</p>
                  <p className="text-micro text-ink-4 font-mono">{cliente.telefone}</p>
                </div>
              </div>
              <div className="flex gap-s2 justify-end">
                <Button kind="ghost" size="sm" icon={MessageCircle} />
                <Button kind="ghost" size="sm" icon={Phone} />
              </div>
            </SwipeCard>
          ))}
        </div>

        {filteredClientes.length === 0 && search && (
          <EmptyState
            icon={Users}
            title="Nenhum cliente encontrado"
            description={`Nenhum cliente corresponde a "${search}"`}
          />
        )}

        {filteredClientes.length === 0 && !search && clientes.length === 0 && (
          <EmptyState
            icon={Users}
            title="Nenhum cliente"
            description="Começar a adicionar clientes para gerenciar suas vendas"
            action="Criar primeiro cliente"
            onAction={() => navigate('/m/clientes/novo')}
          />
        )}
      </div>
    </MobileLayout>
  );
}
