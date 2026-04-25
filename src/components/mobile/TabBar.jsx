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
      className={`fixed bottom-0 left-0 right-0 z-50 h-18 bg-surface border-t border-line flex items-center justify-around pb-safe px-s3 ${className}`}
      role="tablist"
      aria-label="Navegação principal"
    >
      {TABS.map(({ id, label, icon: Icon }) => (
        <button
          key={id}
          onClick={() => onTabChange?.(id)}
          className={`flex flex-col items-center justify-center gap-s1 py-s2 px-s4 rounded-md transition-colors ${
            active === id
              ? 'bg-accent text-ink'
              : 'text-ink-3 active:opacity-60'
          }`}
          role="tab"
          aria-selected={active === id}
          aria-label={label}
        >
          <Icon size={20} />
          <span className={`text-xs font-semibold ${active === id ? 'font-bold' : ''}`}>
            {label}
          </span>
        </button>
      ))}
    </nav>
  );
}
