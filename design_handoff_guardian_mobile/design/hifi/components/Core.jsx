// Direção B — Design tokens (Moderno & Energético)
// Shared tokens + components for all hi-fi screens

const T = {
  // Colors
  bg: '#FAFAF9',
  surface: '#FFFFFF',
  ink: '#0A0A0A',
  ink2: '#3F3F3F',
  ink3: '#737373',
  ink4: '#A3A3A3',
  line: '#E8E8E6',
  line2: '#F4F4F2',
  primary: '#0A0A0A',
  primarySoft: '#F4F4F2',
  accent: '#84CC16',           // lime
  accentInk: '#3F6212',
  pos: '#15803D',
  posSoft: '#DCFCE7',
  warn: '#D97706',
  warnSoft: '#FEF3C7',
  neg: '#DC2626',
  negSoft: '#FEE2E2',
  info: '#0284C7',
  infoSoft: '#DBEAFE',
  pink: '#DB2777',
  pinkSoft: '#FCE7F3',

  // Typography
  font: "'Geist', 'Inter', -apple-system, sans-serif",
  mono: "'Geist Mono', 'JetBrains Mono', ui-monospace, monospace",

  // Shape
  radius: 16,
  radiusSm: 10,
  radiusXs: 6,

  // Shadow
  shadow: '0 0 0 1px rgba(10,10,10,0.04), 0 2px 4px rgba(10,10,10,0.03)',
  shadowLg: '0 0 0 1px rgba(10,10,10,0.06), 0 10px 20px rgba(10,10,10,0.08)',
};

// ============== PHONE FRAME ==============
function Phone({ children, label, note }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14 }}>
      <div style={{
        fontFamily: T.mono, fontSize: 10, letterSpacing: 1.5,
        color: T.ink3, textTransform: 'uppercase',
      }}>{label}</div>
      <div style={{
        width: 390, height: 844, borderRadius: 54,
        background: '#111', padding: 11, position: 'relative',
        boxShadow: '0 30px 60px -20px rgba(0,0,0,0.3), 0 0 0 1.5px #222',
      }}>
        <div style={{
          width: '100%', height: '100%', borderRadius: 44,
          background: T.bg, overflow: 'hidden',
          display: 'flex', flexDirection: 'column',
        }}>
          <StatusBar />
          <div style={{ flex: 1, overflow: 'hidden', position: 'relative', display: 'flex', flexDirection: 'column' }}>
            {children}
          </div>
          <HomeIndicator />
        </div>
        <div style={{
          position: 'absolute', top: 22, left: '50%', transform: 'translateX(-50%)',
          width: 120, height: 34, borderRadius: 20, background: '#000', zIndex: 50,
        }} />
      </div>
      {note && (
        <div style={{
          fontFamily: T.mono, fontSize: 10, color: T.ink3,
          maxWidth: 380, textAlign: 'center', lineHeight: 1.6,
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
      <div style={{ fontFamily: T.font, fontWeight: 700, fontSize: 15, color: T.ink }}>9:41</div>
      <div style={{ display: 'flex', gap: 5, alignItems: 'center' }}>
        <svg width="17" height="11" viewBox="0 0 17 11"><rect x="0" y="7" width="2.5" height="4" rx="0.5" fill={T.ink}/><rect x="4.5" y="5" width="2.5" height="6" rx="0.5" fill={T.ink}/><rect x="9" y="2.5" width="2.5" height="8.5" rx="0.5" fill={T.ink}/><rect x="13.5" y="0" width="2.5" height="11" rx="0.5" fill={T.ink}/></svg>
        <svg width="24" height="11" viewBox="0 0 24 11"><rect x="0.5" y="0.5" width="20" height="10" rx="2.5" stroke={T.ink} fill="none" opacity="0.4"/><rect x="2" y="2" width="15" height="7" rx="1" fill={T.ink}/></svg>
      </div>
    </div>
  );
}

function HomeIndicator() {
  return (
    <div style={{ height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
      <div style={{ width: 134, height: 5, borderRadius: 100, background: 'rgba(0,0,0,0.35)' }} />
    </div>
  );
}

// ============== HEADER ==============
function Header({ title, eyebrow, right, back = false, big = false }) {
  return (
    <div style={{
      padding: big ? '14px 20px 18px' : '10px 20px 12px',
      background: T.bg, flexShrink: 0,
      borderBottom: big ? 'none' : `1px solid ${T.line2}`,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flex: 1, minWidth: 0 }}>
          {back && <BackChevron />}
          <div style={{ flex: 1, minWidth: 0 }}>
            {eyebrow && (
              <div style={{ fontFamily: T.mono, fontSize: 10, color: T.ink3, letterSpacing: 0.8, textTransform: 'uppercase', marginBottom: big ? 2 : 0 }}>
                {eyebrow}
              </div>
            )}
            <div style={{
              fontFamily: T.font, fontSize: big ? 26 : 19, fontWeight: 700,
              color: T.ink, letterSpacing: big ? -0.8 : -0.3, lineHeight: 1.1,
            }}>{title}</div>
          </div>
        </div>
        {right}
      </div>
    </div>
  );
}

function BackChevron() {
  return (
    <div style={{
      width: 32, height: 32, borderRadius: 10, border: `1.5px solid ${T.line}`,
      background: T.surface, display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <svg width="10" height="14" viewBox="0 0 10 14" fill="none">
        <path d="M8 2L2 7l6 5" stroke={T.ink} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </div>
  );
}

// Primary button
function Btn({ label, kind = 'primary', icon, onClick, full, size = 'md' }) {
  const styles = {
    primary: { bg: T.ink, c: '#fff', bd: T.ink },
    lime: { bg: T.accent, c: T.ink, bd: T.ink },
    ghost: { bg: 'transparent', c: T.ink, bd: T.line },
    danger: { bg: T.neg, c: '#fff', bd: T.neg },
    success: { bg: T.pos, c: '#fff', bd: T.pos },
  }[kind];
  const sizes = {
    sm: { pad: '6px 12px', fs: 11 },
    md: { pad: '9px 16px', fs: 13 },
    lg: { pad: '14px 20px', fs: 15 },
  }[size];
  return (
    <button onClick={onClick} style={{
      background: styles.bg, color: styles.c,
      border: kind === 'primary' || kind === 'danger' || kind === 'success' ? 'none' : `1.5px solid ${styles.bd}`,
      padding: sizes.pad, borderRadius: kind === 'ghost' ? T.radiusSm : T.radius,
      fontFamily: T.font, fontSize: sizes.fs, fontWeight: 600,
      display: 'inline-flex', alignItems: 'center', gap: 6, cursor: 'pointer',
      width: full ? '100%' : 'auto', justifyContent: 'center',
      letterSpacing: -0.1,
    }}>
      {icon}
      {label}
    </button>
  );
}

function PlusIcon({ c = '#fff' }) {
  return <svg width="12" height="12" viewBox="0 0 12 12"><path d="M6 1v10M1 6h10" stroke={c} strokeWidth="2" strokeLinecap="round"/></svg>;
}

// ============== TAB BAR ==============
function TabBar({ active = 'home' }) {
  const tabs = [
    { key: 'home', label: 'Início', icon: 'home' },
    { key: 'clientes', label: 'Clientes', icon: 'users' },
    { key: 'vendas', label: 'Vendas', icon: 'trend' },
    { key: 'fin', label: 'Financeiro', icon: 'dollar' },
    { key: 'mais', label: 'Mais', icon: 'more' },
  ];
  return (
    <div style={{
      background: T.surface, borderTop: `1px solid ${T.line}`,
      display: 'flex', padding: '8px 4px 10px', flexShrink: 0,
    }}>
      {tabs.map(t => (
        <div key={t.key} style={{
          flex: 1, display: 'flex', flexDirection: 'column',
          alignItems: 'center', gap: 3,
        }}>
          <div style={{
            padding: '4px 10px', borderRadius: 10,
            background: active === t.key ? T.accent : 'transparent',
          }}>
            <TabIcon name={t.icon} color={active === t.key ? T.ink : T.ink3} />
          </div>
          <div style={{
            fontFamily: T.font, fontSize: 10,
            fontWeight: active === t.key ? 700 : 500,
            color: active === t.key ? T.ink : T.ink3,
          }}>{t.label}</div>
        </div>
      ))}
    </div>
  );
}

function TabIcon({ name, color }) {
  const s = { fill: 'none', stroke: color, strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round' };
  if (name === 'home') return <svg width="20" height="20" viewBox="0 0 20 20"><path d="M3 9l7-5 7 5v8a1 1 0 01-1 1h-3v-5h-6v5H4a1 1 0 01-1-1V9z" {...s}/></svg>;
  if (name === 'users') return <svg width="20" height="20" viewBox="0 0 20 20"><circle cx="10" cy="7" r="3" {...s}/><path d="M4 17c0-3 3-5 6-5s6 2 6 5" {...s}/></svg>;
  if (name === 'trend') return <svg width="20" height="20" viewBox="0 0 20 20"><path d="M3 15l5-5 3 3 6-7M13 6h5v5" {...s}/></svg>;
  if (name === 'dollar') return <svg width="20" height="20" viewBox="0 0 20 20"><circle cx="10" cy="10" r="7" {...s}/><path d="M10 5v10M7 8h4a2 2 0 110 4H9a2 2 0 100 4h4" {...s}/></svg>;
  if (name === 'more') return <svg width="20" height="20" viewBox="0 0 20 20"><circle cx="4" cy="10" r="1.5" fill={color}/><circle cx="10" cy="10" r="1.5" fill={color}/><circle cx="16" cy="10" r="1.5" fill={color}/></svg>;
  return null;
}

// ============== CARDS & PILLS ==============
function Card({ children, pad = 14, style = {}, onClick, outlined, thick }) {
  return (
    <div onClick={onClick} style={{
      background: T.surface,
      border: thick ? `1.5px solid ${T.ink}` : `1px solid ${T.line}`,
      borderRadius: T.radius, padding: pad,
      cursor: onClick ? 'pointer' : 'default',
      ...style,
    }}>{children}</div>
  );
}

function Pill({ label, tone = 'neutral', size = 11 }) {
  const tones = {
    neutral: { c: T.ink2, bg: T.line2, bd: T.line },
    pos: { c: T.pos, bg: T.posSoft, bd: `${T.pos}30` },
    warn: { c: T.warn, bg: T.warnSoft, bd: `${T.warn}30` },
    neg: { c: T.neg, bg: T.negSoft, bd: `${T.neg}30` },
    info: { c: T.info, bg: T.infoSoft, bd: `${T.info}30` },
    pink: { c: T.pink, bg: T.pinkSoft, bd: `${T.pink}30` },
    ink: { c: '#fff', bg: T.ink, bd: T.ink },
    accent: { c: T.ink, bg: T.accent, bd: T.ink },
  }[tone];
  return (
    <span style={{
      fontFamily: T.font, fontSize: size, color: tones.c, background: tones.bg,
      border: `1px solid ${tones.bd}`,
      padding: '2px 8px', borderRadius: 6,
      fontWeight: 600, letterSpacing: -0.1, display: 'inline-block',
      whiteSpace: 'nowrap',
    }}>{label}</span>
  );
}

function Body({ children, pad = true, style = {} }) {
  return (
    <div style={{
      flex: 1, overflow: 'auto', padding: pad ? '14px 16px 20px' : 0,
      background: T.bg, ...style,
    }}>{children}</div>
  );
}

function Section({ label, right, style = {} }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      margin: '14px 2px 10px', ...style,
    }}>
      <div style={{
        fontFamily: T.font, fontSize: 14, color: T.ink,
        fontWeight: 700, letterSpacing: -0.2,
      }}>{label}</div>
      {right}
    </div>
  );
}

function SeeMore({ label = 'Ver tudo' }) {
  return (
    <div style={{
      fontFamily: T.font, fontSize: 11, color: T.ink2, fontWeight: 600,
      display: 'flex', alignItems: 'center', gap: 3,
    }}>{label} →</div>
  );
}

// Avatar placeholder (initials)
function Avatar({ name, size = 40, bg = T.accent }) {
  const initials = name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase();
  return (
    <div style={{
      width: size, height: size, borderRadius: size / 2, flexShrink: 0,
      background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: T.font, fontSize: size * 0.38, fontWeight: 700, color: T.ink,
      border: `1.5px solid ${T.ink}`,
    }}>{initials}</div>
  );
}

function Input({ ph, value, icon, suffix }) {
  return (
    <div style={{
      background: T.surface, border: `1.5px solid ${T.line}`, borderRadius: T.radiusSm,
      padding: '11px 14px', display: 'flex', alignItems: 'center', gap: 10,
    }}>
      {icon}
      <div style={{
        flex: 1, fontFamily: T.font, fontSize: 14,
        color: value ? T.ink : T.ink3,
      }}>{value || ph}</div>
      {suffix}
    </div>
  );
}

function SearchIcon() {
  return <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="7" cy="7" r="5" stroke={T.ink3} strokeWidth="1.5"/><path d="M11 11l3 3" stroke={T.ink3} strokeWidth="1.5" strokeLinecap="round"/></svg>;
}

Object.assign(window, {
  T, Phone, Header, Btn, PlusIcon, TabBar, Card, Pill, Body, Section, SeeMore,
  Avatar, Input, SearchIcon, BackChevron,
});
