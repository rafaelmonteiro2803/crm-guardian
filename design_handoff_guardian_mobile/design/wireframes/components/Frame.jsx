// Phone frame + shared wireframe primitives
// Kept minimal & inline-styled for wireframe aesthetic.

const WF = {
  bg: '#FAFAF8',
  ink: '#1F1D1A',
  ink2: '#535049',
  ink3: '#8B867D',
  ink4: '#C4BFB4',
  line: '#D8D3C7',
  line2: '#EAE5D9',
  card: '#FFFFFF',
  accent: '#C2541A',       // burnt orange — primary action
  accentSoft: '#F2E4D6',
  pos: '#2E7D52',           // muted green — "paid"
  warn: '#B8761A',          // amber — pending
  neg: '#B33A2E',            // muted red — overdue
  info: '#2F5D8A',           // muted blue — in progress
  pink: '#9E4A6E',
  mono: "'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, monospace",
  sans: "Inter, -apple-system, 'Segoe UI', Roboto, sans-serif",
};

// Phone shell 390×844 iOS
function Phone({ children, label, note }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
      <div style={{
        fontFamily: WF.mono, fontSize: 10, letterSpacing: 1.5,
        color: WF.ink3, textTransform: 'uppercase',
      }}>{label}</div>
      <div style={{
        width: 390, height: 844, borderRadius: 54,
        background: '#111', padding: 11, position: 'relative',
        boxShadow: '0 30px 60px -20px rgba(0,0,0,0.25), 0 0 0 1.5px #222',
      }}>
        <div style={{
          width: '100%', height: '100%', borderRadius: 44,
          background: WF.bg, overflow: 'hidden', position: 'relative',
          display: 'flex', flexDirection: 'column',
        }}>
          <StatusBar />
          <div style={{ flex: 1, overflow: 'hidden', position: 'relative' }}>
            {children}
          </div>
          <HomeIndicator />
        </div>
        {/* dynamic island */}
        <div style={{
          position: 'absolute', top: 22, left: '50%', transform: 'translateX(-50%)',
          width: 120, height: 34, borderRadius: 20, background: '#000', zIndex: 50,
        }} />
      </div>
      {note && (
        <div style={{
          fontFamily: WF.mono, fontSize: 10, color: WF.ink3,
          maxWidth: 360, textAlign: 'center', lineHeight: 1.6,
        }}>{note}</div>
      )}
    </div>
  );
}

function StatusBar() {
  return (
    <div style={{
      height: 54, display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between',
      padding: '0 28px 4px', flexShrink: 0, position: 'relative', zIndex: 10,
    }}>
      <div style={{ fontFamily: WF.sans, fontWeight: 600, fontSize: 15, color: WF.ink }}>9:41</div>
      <div style={{ display: 'flex', gap: 5, alignItems: 'center' }}>
        <svg width="17" height="11" viewBox="0 0 17 11"><rect x="0" y="7" width="2.5" height="4" rx="0.5" fill={WF.ink}/><rect x="4.5" y="5" width="2.5" height="6" rx="0.5" fill={WF.ink}/><rect x="9" y="2.5" width="2.5" height="8.5" rx="0.5" fill={WF.ink}/><rect x="13.5" y="0" width="2.5" height="11" rx="0.5" fill={WF.ink}/></svg>
        <svg width="24" height="11" viewBox="0 0 24 11"><rect x="0.5" y="0.5" width="20" height="10" rx="2.5" stroke={WF.ink} fill="none" opacity="0.4"/><rect x="2" y="2" width="15" height="7" rx="1" fill={WF.ink}/></svg>
      </div>
    </div>
  );
}

function HomeIndicator() {
  return (
    <div style={{
      height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center',
      flexShrink: 0, background: 'transparent',
    }}>
      <div style={{ width: 134, height: 5, borderRadius: 100, background: 'rgba(0,0,0,0.3)' }} />
    </div>
  );
}

// Header (sticky top of screen)
function Header({ title, subtitle, right, back = false, tint }) {
  return (
    <div style={{
      padding: '8px 20px 10px', background: tint || WF.bg,
      borderBottom: `1px solid ${WF.line2}`, flexShrink: 0,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: subtitle ? 3 : 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {back && <BackChevron />}
          <div style={{
            fontFamily: WF.sans, fontSize: 20, fontWeight: 600,
            color: WF.ink, letterSpacing: -0.3,
          }}>{title}</div>
        </div>
        {right}
      </div>
      {subtitle && (
        <div style={{ fontFamily: WF.mono, fontSize: 10, color: WF.ink3, letterSpacing: 0.5 }}>
          {subtitle}
        </div>
      )}
    </div>
  );
}

function BackChevron() {
  return (
    <svg width="12" height="18" viewBox="0 0 12 18" fill="none">
      <path d="M10 2L2 9l8 7" stroke={WF.ink2} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

// "Novo" button
function NovoBtn({ label = 'Novo' }) {
  return (
    <button style={{
      background: WF.ink, color: '#fff', border: 'none',
      padding: '7px 14px', borderRadius: 999,
      fontFamily: WF.sans, fontSize: 12, fontWeight: 600,
      display: 'inline-flex', alignItems: 'center', gap: 4, cursor: 'pointer',
    }}>
      <svg width="10" height="10" viewBox="0 0 10 10"><path d="M5 1v8M1 5h8" stroke="#fff" strokeWidth="1.8" strokeLinecap="round"/></svg>
      {label}
    </button>
  );
}

// Tab bar bottom
function TabBar({ active = 'home' }) {
  const tabs = [
    { key: 'home', label: 'Início', icon: 'home' },
    { key: 'op', label: 'Operac.', icon: 'clip' },
    { key: 'vendas', label: 'Vendas', icon: 'trend' },
    { key: 'fin', label: 'Financeiro', icon: 'dollar' },
    { key: 'mais', label: 'Mais', icon: 'more' },
  ];
  return (
    <div style={{
      position: 'absolute', bottom: 0, left: 0, right: 0,
      background: 'rgba(250,250,248,0.95)', backdropFilter: 'blur(12px)',
      borderTop: `1px solid ${WF.line2}`, display: 'flex',
      padding: '8px 4px 10px', zIndex: 40,
    }}>
      {tabs.map(t => (
        <div key={t.key} style={{
          flex: 1, display: 'flex', flexDirection: 'column',
          alignItems: 'center', gap: 3,
          color: active === t.key ? WF.ink : WF.ink3,
        }}>
          <TabIcon name={t.icon} color={active === t.key ? WF.ink : WF.ink3} />
          <div style={{
            fontFamily: WF.sans, fontSize: 10,
            fontWeight: active === t.key ? 600 : 400,
          }}>{t.label}</div>
        </div>
      ))}
    </div>
  );
}

function TabIcon({ name, color }) {
  const s = { fill: 'none', stroke: color, strokeWidth: 1.6, strokeLinecap: 'round', strokeLinejoin: 'round' };
  if (name === 'home') return <svg width="22" height="22" viewBox="0 0 22 22"><path d="M3 10l8-6 8 6v9a1 1 0 01-1 1h-4v-6h-6v6H4a1 1 0 01-1-1v-9z" {...s}/></svg>;
  if (name === 'clip') return <svg width="22" height="22" viewBox="0 0 22 22"><rect x="5" y="4" width="12" height="15" rx="1.5" {...s}/><path d="M8 4v-1h6v1M8 10h6M8 13h6M8 16h4" {...s}/></svg>;
  if (name === 'trend') return <svg width="22" height="22" viewBox="0 0 22 22"><path d="M3 17l5-5 4 3 7-8M15 7h5v5" {...s}/></svg>;
  if (name === 'dollar') return <svg width="22" height="22" viewBox="0 0 22 22"><circle cx="11" cy="11" r="8" {...s}/><path d="M11 6v10M8 9h4a2 2 0 110 4h-2a2 2 0 100 4h4" {...s}/></svg>;
  if (name === 'more') return <svg width="22" height="22" viewBox="0 0 22 22"><circle cx="5" cy="11" r="1.3" fill={color}/><circle cx="11" cy="11" r="1.3" fill={color}/><circle cx="17" cy="11" r="1.3" fill={color}/></svg>;
  return null;
}

// Skeleton/placeholder bar — wireframe-y
function Bar({ w = '100%', h = 8, r = 2, c = WF.line, style = {} }) {
  return <div style={{ width: w, height: h, borderRadius: r, background: c, ...style }} />;
}

// Card container
function Card({ children, pad = 14, style = {}, border, bg }) {
  return (
    <div style={{
      background: bg || WF.card,
      border: `1px solid ${border || WF.line2}`,
      borderRadius: 12, padding: pad, ...style,
    }}>{children}</div>
  );
}

// Pill / badge
function Pill({ label, color = WF.ink3, bg = WF.line2, size = 10 }) {
  return (
    <span style={{
      fontFamily: WF.mono, fontSize: size, color, background: bg,
      padding: '2px 7px', borderRadius: 4, textTransform: 'uppercase',
      letterSpacing: 0.5, fontWeight: 500, display: 'inline-block',
    }}>{label}</span>
  );
}

// Scroll body
function Body({ children, pad = true, style = {} }) {
  return (
    <div style={{
      flex: 1, overflow: 'auto', padding: pad ? '14px 16px 90px' : '0 0 90px',
      background: WF.bg, ...style,
    }}>{children}</div>
  );
}

// Section label
function Section({ label, right, style = {} }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      margin: '4px 0 8px', ...style,
    }}>
      <div style={{
        fontFamily: WF.mono, fontSize: 10, color: WF.ink3,
        letterSpacing: 1, textTransform: 'uppercase',
      }}>{label}</div>
      {right}
    </div>
  );
}

// Image / avatar placeholder — hatched
function Ph({ w = 40, h = 40, r = 8 }) {
  return (
    <div style={{
      width: w, height: h, borderRadius: r, flexShrink: 0,
      background: `repeating-linear-gradient(135deg, ${WF.line2} 0 4px, ${WF.bg} 4px 8px)`,
      border: `1px solid ${WF.line}`,
    }} />
  );
}

// Annotation label (wireframe note pointing to element)
function Note({ children, style = {} }) {
  return (
    <div style={{
      fontFamily: WF.mono, fontSize: 10, color: WF.ink3,
      letterSpacing: 0.3, lineHeight: 1.5, ...style,
    }}>{children}</div>
  );
}

Object.assign(window, { WF, Phone, Header, NovoBtn, TabBar, Bar, Card, Pill, Body, Section, Ph, Note, BackChevron });
