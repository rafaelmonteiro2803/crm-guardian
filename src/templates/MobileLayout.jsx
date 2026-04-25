import { Header, TabBar } from '../components/mobile';

export function MobileLayout({
  activeTab,
  onTabChange,
  headerProps = {},
  children,
  className = '',
}) {
  return (
    <div className="min-h-screen bg-bg flex flex-col">
      <Header {...headerProps} />
      <main
        className={`flex-1 overflow-y-auto px-s5 py-s4 pb-20 ${className}`}
        style={{
          paddingTop: 'max(1rem, env(safe-area-inset-top))',
          paddingBottom: 'max(5rem, calc(env(safe-area-inset-bottom) + 5rem))',
          paddingLeft: 'max(1rem, env(safe-area-inset-left))',
          paddingRight: 'max(1rem, env(safe-area-inset-right))',
        }}
      >
        {children}
      </main>
      <TabBar active={activeTab} onTabChange={onTabChange} />
    </div>
  );
}
