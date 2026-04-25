// 3 direções estéticas aplicadas na mesma tela (Dashboard simplificado)
// Pra facilitar comparação e escolha.

// ============================================================
// DIREÇÃO A — Clínico & Confiável
// ============================================================
// Tipografia: Inter (neutra, profissional)
// Cores: azul-petróleo profundo + branco quente + cinzas frios
// Linguagem: cards planos, cantos suaves, muito whitespace, densidade baixa
// Referência mental: sistemas hospitalares, fintechs sérias, Linear light mode
const DIR_A = {
  bg: '#F7F8FA',
  surface: '#FFFFFF',
  ink: '#0F1B2D',
  ink2: '#4A5568',
  ink3: '#8591A3',
  line: '#E4E8EF',
  primary: '#1B4D6B',     // azul petróleo
  primarySoft: '#E6EEF3',
  accent: '#D97757',       // laranja queimado (ações)
  pos: '#2F855A',
  warn: '#C08517',
  neg: '#B84A3D',
  info: '#2B6CB0',
  font: 'Inter, -apple-system, sans-serif',
  radius: 12,
  shadow: '0 1px 2px rgba(15,27,45,0.04), 0 1px 3px rgba(15,27,45,0.06)',
};

// ============================================================
// DIREÇÃO B — Moderno & Energético
// ============================================================
// Tipografia: Geist / SF Pro (display moderna) + Geist Mono
// Cores: preto profundo + verde lima vibrante como acento único
// Linguagem: cantos bem arredondados, bordas grossas, cards com leve gradiente, alto contraste
// Referência mental: Vercel, Linear dark-inspired, produtos SaaS modernos
const DIR_B = {
  bg: '#FAFAF9',
  surface: '#FFFFFF',
  ink: '#0A0A0A',
  ink2: '#3F3F3F',
  ink3: '#737373',
  line: '#E8E8E6',
  primary: '#0A0A0A',
  primarySoft: '#F4F4F2',
  accent: '#84CC16',        // lima
  pos: '#15803D',
  warn: '#D97706',
  neg: '#DC2626',
  info: '#0284C7',
  font: "'Geist', 'Inter', -apple-system, sans-serif",
  radius: 16,
  shadow: '0 0 0 1px rgba(10,10,10,0.04), 0 2px 8px rgba(10,10,10,0.04)',
};

// ============================================================
// DIREÇÃO C — Quente & Humanizado
// ============================================================
// Tipografia: serif para títulos (Fraunces/Newsreader) + sans para UI (Inter)
// Cores: creme + marrom-café profundo + terracota
// Linguagem: cards com texturas sutis, cantos médios, editorial
// Referência mental: produtos wellness/boutique, Cal.com, Notion classic
const DIR_C = {
  bg: '#FAF5EC',
  surface: '#FFFDF8',
  ink: '#2A1F14',
  ink2: '#6B5A47',
  ink3: '#9C8970',
  line: '#EAE0CC',
  primary: '#8B4513',        // marrom café
  primarySoft: '#F2E8D8',
  accent: '#C75A3C',          // terracota
  pos: '#5B8A3A',
  warn: '#B87821',
  neg: '#A8443A',
  info: '#4A6B8A',
  font: "'Newsreader', 'Fraunces', Georgia, serif",
  fontUi: "'Inter', sans-serif",
  radius: 10,
  shadow: '0 2px 6px rgba(42,31,20,0.05)',
};

// Frame comum (sem chrome pra focar na estética)
function MiniPhone({ children, dir, label, descr }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14 }}>
      <div style={{
        fontFamily: 'JetBrains Mono, monospace', fontSize: 10, letterSpacing: 1.5,
        color: '#8B867D', textTransform: 'uppercase',
      }}>{label}</div>
      <div style={{
        width: 390, height: 780, borderRadius: 44, background: '#111', padding: 9,
        boxShadow: '0 30px 60px -20px rgba(0,0,0,0.25), 0 0 0 1.5px #222',
      }}>
        <div style={{
          width: '100%', height: '100%', borderRadius: 36,
          background: dir.bg, overflow: 'hidden',
          display: 'flex', flexDirection: 'column',
        }}>
          {children}
        </div>
      </div>
      <div style={{
        fontFamily: 'Inter, sans-serif', fontSize: 12, color: '#535049',
        maxWidth: 380, lineHeight: 1.5, textAlign: 'center',
      }}>{descr}</div>
      <SwatchRow dir={dir} />
    </div>
  );
}

function SwatchRow({ dir }) {
  return (
    <div style={{ display: 'flex', gap: 6 }}>
      {[dir.ink, dir.primary, dir.accent, dir.pos, dir.warn, dir.neg].map((c, i) => (
        <div key={i} style={{
          width: 22, height: 22, borderRadius: 4, background: c,
          border: `1px solid ${dir.line}`,
        }} />
      ))}
    </div>
  );
}

// Direção A — tela
function DashDirA() {
  const d = DIR_A;
  return (
    <MiniPhone dir={d} label="DIREÇÃO A · Clínico & Confiável" descr="Azul-petróleo, Inter, cards planos, muito respiro. Sério, profissional, confiável — para ambiente clínico/saúde.">
      {/* status */}
      <div style={{ height: 44, display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', padding: '0 24px 6px', fontFamily: d.font }}>
        <div style={{ fontWeight: 600, fontSize: 14, color: d.ink }}>9:41</div>
        <div style={{ width: 50, height: 10, background: d.ink, borderRadius: 2, opacity: 0.6 }} />
      </div>
      {/* header */}
      <div style={{ padding: '10px 22px 14px', borderBottom: `1px solid ${d.line}`, fontFamily: d.font }}>
        <div style={{ fontSize: 12, color: d.ink3, letterSpacing: 0.3 }}>Bom dia,</div>
        <div style={{ fontSize: 22, fontWeight: 600, color: d.ink, letterSpacing: -0.3 }}>Dr. Rafael</div>
      </div>
      <div style={{ padding: '16px 18px', flex: 1, overflow: 'hidden', fontFamily: d.font }}>
        {/* big KPI */}
        <div style={{
          background: d.primary, borderRadius: d.radius, padding: 18, color: '#fff',
          marginBottom: 10,
        }}>
          <div style={{ fontSize: 11, opacity: 0.7, letterSpacing: 0.5, textTransform: 'uppercase' }}>A receber</div>
          <div style={{ fontSize: 30, fontWeight: 600, letterSpacing: -0.5, marginTop: 2 }}>R$ 12.430</div>
          <div style={{ fontSize: 12, opacity: 0.8, marginTop: 2 }}>8 títulos pendentes</div>
        </div>
        {/* KPI row */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 14 }}>
          {[
            { l: 'Vendas mês', v: 'R$ 28.900', s: '12 vendas' },
            { l: 'Pipeline', v: 'R$ 45.200', s: '6 abertas' },
          ].map((k, i) => (
            <div key={i} style={{
              background: d.surface, border: `1px solid ${d.line}`,
              borderRadius: d.radius, padding: 12, boxShadow: d.shadow,
            }}>
              <div style={{ fontSize: 10, color: d.ink3, letterSpacing: 0.5, textTransform: 'uppercase' }}>{k.l}</div>
              <div style={{ fontSize: 17, fontWeight: 600, color: d.ink, marginTop: 4 }}>{k.v}</div>
              <div style={{ fontSize: 11, color: d.ink3 }}>{k.s}</div>
            </div>
          ))}
        </div>
        {/* Agenda */}
        <div style={{ fontSize: 11, color: d.ink3, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 8 }}>Próximos</div>
        <div style={{ background: d.surface, border: `1px solid ${d.line}`, borderRadius: d.radius, boxShadow: d.shadow }}>
          {[
            { h: '14:00', n: 'Maria Aparecida Souza', s: 'Consulta de avaliação' },
            { h: '16:30', n: 'Carlos Eduardo Pinto', s: 'Sessão fisioterapia' },
          ].map((a, i) => (
            <div key={i} style={{
              display: 'flex', gap: 12, padding: '12px 14px', alignItems: 'center',
              borderTop: i ? `1px solid ${d.line}` : 'none',
            }}>
              <div style={{ width: 40, textAlign: 'center' }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: d.primary }}>{a.h}</div>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 500, color: d.ink }}>{a.n}</div>
                <div style={{ fontSize: 11, color: d.ink3 }}>{a.s}</div>
              </div>
              <button style={{
                background: d.accent, color: '#fff', border: 'none', padding: '5px 10px',
                borderRadius: 6, fontSize: 11, fontWeight: 600, fontFamily: d.font,
              }}>Abrir</button>
            </div>
          ))}
        </div>
      </div>
    </MiniPhone>
  );
}

// Direção B — tela
function DashDirB() {
  const d = DIR_B;
  return (
    <MiniPhone dir={d} label="DIREÇÃO B · Moderno & Energético" descr="Preto + verde lima, bordas grossas, cantos arredondados. Startup moderna, alto contraste, atitude. Para audiência mais jovem/tech.">
      <div style={{ height: 44, display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', padding: '0 24px 6px', fontFamily: d.font }}>
        <div style={{ fontWeight: 600, fontSize: 14, color: d.ink }}>9:41</div>
        <div style={{ width: 50, height: 10, background: d.ink, borderRadius: 2, opacity: 0.6 }} />
      </div>
      <div style={{ padding: '14px 20px 18px', fontFamily: d.font }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <div>
            <div style={{ fontSize: 12, color: d.ink3 }}>Rafael →</div>
            <div style={{ fontSize: 28, fontWeight: 700, color: d.ink, letterSpacing: -1, lineHeight: 1 }}>Visão geral</div>
          </div>
          <div style={{
            width: 40, height: 40, borderRadius: d.radius,
            background: d.accent, display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 18, fontWeight: 700, color: d.ink,
          }}>+</div>
        </div>
      </div>
      <div style={{ padding: '0 16px 16px', flex: 1, overflow: 'hidden', fontFamily: d.font }}>
        {/* Big card lime */}
        <div style={{
          background: d.accent, borderRadius: d.radius, padding: 20,
          marginBottom: 10, border: `2px solid ${d.ink}`,
        }}>
          <div style={{ fontSize: 11, color: d.ink, opacity: 0.7, fontWeight: 600, letterSpacing: 0.5, textTransform: 'uppercase' }}>A receber</div>
          <div style={{ fontSize: 36, fontWeight: 700, color: d.ink, letterSpacing: -1.5, marginTop: 4 }}>R$ 12.4k</div>
          <div style={{ display: 'flex', gap: 6, marginTop: 8 }}>
            <span style={{ background: d.ink, color: d.accent, padding: '3px 8px', borderRadius: 6, fontSize: 10, fontWeight: 700 }}>8 TÍTULOS</span>
            <span style={{ background: 'rgba(10,10,10,0.12)', color: d.ink, padding: '3px 8px', borderRadius: 6, fontSize: 10, fontWeight: 700 }}>3 VENCIDOS</span>
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 14 }}>
          {[
            { l: 'Vendas', v: 'R$ 28.9k', s: '+24%', c: d.pos },
            { l: 'Pipeline', v: 'R$ 45.2k', s: '6 abertas', c: d.ink3 },
          ].map((k, i) => (
            <div key={i} style={{
              background: d.surface, border: `1.5px solid ${d.ink}`,
              borderRadius: d.radius, padding: 14,
            }}>
              <div style={{ fontSize: 10, color: d.ink3, fontWeight: 600, letterSpacing: 0.5, textTransform: 'uppercase' }}>{k.l}</div>
              <div style={{ fontSize: 20, fontWeight: 700, color: d.ink, letterSpacing: -0.5, marginTop: 2 }}>{k.v}</div>
              <div style={{ fontSize: 11, color: k.c, fontWeight: 600 }}>{k.s}</div>
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: d.ink }}>Hoje</div>
          <div style={{ fontSize: 11, color: d.ink2, fontWeight: 600 }}>VER TUDO →</div>
        </div>
        {[
          { h: '14:00', n: 'Maria A. Souza', s: 'Avaliação' },
          { h: '16:30', n: 'Carlos Pinto', s: 'Fisio' },
        ].map((a, i) => (
          <div key={i} style={{
            display: 'flex', gap: 10, padding: 12, marginBottom: 6,
            background: d.surface, border: `1.5px solid ${d.ink}`, borderRadius: d.radius,
            alignItems: 'center',
          }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: d.ink, minWidth: 44 }}>{a.h}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: d.ink }}>{a.n}</div>
              <div style={{ fontSize: 11, color: d.ink3 }}>{a.s}</div>
            </div>
            <div style={{ fontSize: 16, color: d.ink }}>→</div>
          </div>
        ))}
      </div>
    </MiniPhone>
  );
}

// Direção C — tela
function DashDirC() {
  const d = DIR_C;
  return (
    <MiniPhone dir={d} label="DIREÇÃO C · Quente & Humanizado" descr="Creme + terracota, serif nos títulos, feel editorial. Boutique, acolhedor, pessoal. Para audiência mais adulta / bem-estar / serviços de relacionamento.">
      <div style={{ height: 44, display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', padding: '0 24px 6px', fontFamily: d.fontUi }}>
        <div style={{ fontWeight: 600, fontSize: 14, color: d.ink }}>9:41</div>
        <div style={{ width: 50, height: 10, background: d.ink, borderRadius: 2, opacity: 0.6 }} />
      </div>
      <div style={{
        padding: '14px 24px 18px',
        background: `linear-gradient(180deg, ${d.primarySoft} 0%, ${d.bg} 100%)`,
        borderBottom: `1px solid ${d.line}`,
      }}>
        <div style={{ fontFamily: d.fontUi, fontSize: 11, color: d.ink3, letterSpacing: 1, textTransform: 'uppercase' }}>Quarta, 17 abril</div>
        <div style={{ fontFamily: d.font, fontSize: 28, fontWeight: 500, color: d.ink, letterSpacing: -0.8, lineHeight: 1.1, marginTop: 4, fontStyle: 'italic' }}>Bom dia, Rafael.</div>
        <div style={{ fontFamily: d.fontUi, fontSize: 13, color: d.ink2, marginTop: 6 }}>Você tem <strong>3 atendimentos</strong> e <strong>R$ 12.430</strong> a receber.</div>
      </div>
      <div style={{ padding: '16px 20px', flex: 1, overflow: 'hidden' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 16 }}>
          {[
            { l: 'A Receber', v: 'R$ 12.430', s: '8 títulos', c: d.accent },
            { l: 'Vendas', v: 'R$ 28.900', s: 'no mês', c: d.primary },
          ].map((k, i) => (
            <div key={i} style={{
              background: d.surface, border: `1px solid ${d.line}`,
              borderRadius: d.radius, padding: 14,
            }}>
              <div style={{ fontFamily: d.fontUi, fontSize: 10, color: d.ink3, letterSpacing: 0.8, textTransform: 'uppercase' }}>{k.l}</div>
              <div style={{ fontFamily: d.font, fontSize: 20, fontWeight: 500, color: k.c, marginTop: 4, letterSpacing: -0.3 }}>{k.v}</div>
              <div style={{ fontFamily: d.fontUi, fontSize: 11, color: d.ink3 }}>{k.s}</div>
            </div>
          ))}
        </div>
        <div style={{ fontFamily: d.font, fontSize: 16, fontWeight: 500, color: d.ink, fontStyle: 'italic', marginBottom: 10 }}>Sua agenda hoje</div>
        <div style={{ background: d.surface, border: `1px solid ${d.line}`, borderRadius: d.radius, overflow: 'hidden' }}>
          {[
            { h: '14:00', n: 'Maria A. Souza', s: 'Consulta de avaliação' },
            { h: '16:30', n: 'Carlos E. Pinto', s: 'Sessão fisioterapia' },
          ].map((a, i) => (
            <div key={i} style={{
              display: 'flex', gap: 14, padding: '14px 16px', alignItems: 'center',
              borderTop: i ? `1px solid ${d.line}` : 'none',
            }}>
              <div style={{
                width: 44, height: 44, borderRadius: 22, background: d.primarySoft,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: d.font, fontSize: 13, fontWeight: 500, color: d.primary,
              }}>{a.h}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: d.fontUi, fontSize: 13, fontWeight: 500, color: d.ink }}>{a.n}</div>
                <div style={{ fontFamily: d.fontUi, fontSize: 11, color: d.ink3, fontStyle: 'italic' }}>{a.s}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </MiniPhone>
  );
}

Object.assign(window, { DashDirA, DashDirB, DashDirC });
