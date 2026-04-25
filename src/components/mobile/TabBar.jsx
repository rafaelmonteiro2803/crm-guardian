import { Home, Users, TrendingUp, DollarSign, Menu } from 'lucide-react';

const TABS = [
  { id: 'dashboard', label: 'Início', icon: Home },
  { id: 'clientes', label: 'Clientes', icon: Users },
  { id: 'pipeline', label: 'Pipeline', icon: TrendingUp },
  { id: 'vendas', label: 'Vendas', icon: DollarSign },
  { id: 'financeiro', label: 'Financeiro', icon: DollarSign },
];

export function TabBar({
  active = 'dashboard',
  onTabChange,
  className = '',
}) {
  return (
    <nav
      className={`fixed bottom-0 left-0 right-0 z-50 bg-surface border-t border-line flex items-center justify-around px-s3 ${className}`}
      role="tablist"
      aria-label="Navegação principal"
      style={{
        height: 'max(4.5rem, calc(env(safe-area-inset-bottom) + 4.5rem))',
        paddingBottom: 'env(safe-area-inset-bottom)',
      }}
    >
      {TABS.map(({ id, label, icon: Icon }) => (
        <button
          key={id}
          onClick={() => onTabChange?.(id)}
          className={`flex flex-col items-center justify-center gap-s1 py-s2 px-s4 rounded-md transition-colors min-h-[44px] min-w-[44px] ${
            active === id
              ? 'bg-accent text-ink'
              : 'text-ink-3 active:opacity-60'
          }`}
          role="tab"
          aria-selected={active === id}
          aria-label={label}
          aria-controls={`panel-${id}`}
        >
          <Icon size={20} aria-hidden="true" />
          <span className={`text-xs font-semibold ${active === id ? 'font-bold' : ''}`}>
            {label}
          </span>
        </button>
      ))}
    </nav>
  );
}
