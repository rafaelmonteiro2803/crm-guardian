// HI-FI · Login + Dashboard (Direção B)

function HifiLogin() {
  return (
    <Phone label="01 · LOGIN" note="Email/senha + tenant. Token accent só no CTA primário.">
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '32px 24px', background: T.bg }}>
        {/* Logo/brand */}
        <div style={{ marginTop: 48, marginBottom: 40 }}>
          <div style={{
            width: 56, height: 56, borderRadius: 16, background: T.ink,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            marginBottom: 24,
          }}>
            <div style={{
              width: 20, height: 20, borderRadius: 4, background: T.accent,
              transform: 'rotate(45deg)',
            }} />
          </div>
          <div style={{ fontFamily: T.font, fontSize: 30, fontWeight: 700, color: T.ink, letterSpacing: -1 }}>
            Entrar
          </div>
          <div style={{ fontFamily: T.font, fontSize: 14, color: T.ink3, marginTop: 4 }}>
            Guardian CRM
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div>
            <div style={{ fontFamily: T.font, fontSize: 11, color: T.ink2, fontWeight: 600, marginBottom: 6, letterSpacing: 0.3, textTransform: 'uppercase' }}>Empresa</div>
            <Input value="Clínica São Lucas" suffix={
              <svg width="10" height="6" viewBox="0 0 10 6"><path d="M1 1l4 4 4-4" stroke={T.ink3} strokeWidth="1.5" fill="none" strokeLinecap="round"/></svg>
            } />
          </div>
          <div>
            <div style={{ fontFamily: T.font, fontSize: 11, color: T.ink2, fontWeight: 600, marginBottom: 6, letterSpacing: 0.3, textTransform: 'uppercase' }}>Email</div>
            <Input value="rafael@saolucas.com.br" />
          </div>
          <div>
            <div style={{ fontFamily: T.font, fontSize: 11, color: T.ink2, fontWeight: 600, marginBottom: 6, letterSpacing: 0.3, textTransform: 'uppercase' }}>Senha</div>
            <Input value="••••••••" suffix={
              <div style={{ fontFamily: T.font, fontSize: 11, color: T.ink2, fontWeight: 600 }}>MOSTRAR</div>
            } />
          </div>
        </div>

        <div style={{ marginTop: 24 }}>
          <Btn label="Entrar" kind="lime" full size="lg" />
        </div>

        <div style={{ textAlign: 'center', marginTop: 16, fontFamily: T.font, fontSize: 13, color: T.ink3 }}>
          Esqueceu a senha? <span style={{ color: T.ink, fontWeight: 600 }}>Recuperar</span>
        </div>

        <div style={{ flex: 1 }} />

        <div style={{
          textAlign: 'center', fontFamily: T.mono, fontSize: 10, color: T.ink4,
          letterSpacing: 1, paddingBottom: 20,
        }}>GUARDIAN · V2.0</div>
      </div>
    </Phone>
  );
}

function HifiDashboard() {
  return (
    <Phone label="02 · DASHBOARD" note="Hero KPI em lima + grid 2x2. Agenda e atendimentos abertos.">
      <Header
        eyebrow="QUARTA, 17 ABRIL"
        title="Olá, Rafael"
        big
        right={
          <div style={{
            width: 40, height: 40, borderRadius: 20, border: `1.5px solid ${T.ink}`,
            background: T.surface, display: 'flex', alignItems: 'center', justifyContent: 'center',
            position: 'relative',
          }}>
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M4 8a5 5 0 0110 0v3l2 3H2l2-3V8zM7 17a2 2 0 004 0" stroke={T.ink} strokeWidth="1.8" strokeLinecap="round"/></svg>
            <div style={{ position: 'absolute', top: 6, right: 6, width: 8, height: 8, borderRadius: 4, background: T.neg, border: `1.5px solid ${T.surface}` }} />
          </div>
        }
      />
      <Body>
        {/* Hero KPI */}
        <Card thick style={{ background: T.accent, marginBottom: 10 }}>
          <div style={{ fontFamily: T.font, fontSize: 11, color: T.ink, opacity: 0.7, fontWeight: 700, letterSpacing: 0.5, textTransform: 'uppercase' }}>A RECEBER · ABRIL</div>
          <div style={{ fontFamily: T.font, fontSize: 38, fontWeight: 700, color: T.ink, letterSpacing: -1.8, marginTop: 4, lineHeight: 1 }}>R$ 12.430</div>
          <div style={{ display: 'flex', gap: 6, marginTop: 10 }}>
            <Pill label="8 TÍTULOS" tone="ink" size={10} />
            <Pill label="3 VENCIDOS · R$ 2.180" tone="neg" size={10} />
          </div>
        </Card>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 6 }}>
          <Card thick pad={14}>
            <div style={{ fontFamily: T.font, fontSize: 10, color: T.ink3, fontWeight: 700, letterSpacing: 0.5, textTransform: 'uppercase' }}>Vendas mês</div>
            <div style={{ fontFamily: T.font, fontSize: 22, fontWeight: 700, color: T.ink, letterSpacing: -0.8, marginTop: 4 }}>R$ 28.9k</div>
            <div style={{ fontFamily: T.font, fontSize: 11, color: T.pos, fontWeight: 600 }}>↑ 24% vs mar</div>
          </Card>
          <Card thick pad={14}>
            <div style={{ fontFamily: T.font, fontSize: 10, color: T.ink3, fontWeight: 700, letterSpacing: 0.5, textTransform: 'uppercase' }}>Pipeline</div>
            <div style={{ fontFamily: T.font, fontSize: 22, fontWeight: 700, color: T.ink, letterSpacing: -0.8, marginTop: 4 }}>R$ 45.2k</div>
            <div style={{ fontFamily: T.font, fontSize: 11, color: T.ink3, fontWeight: 600 }}>6 abertas</div>
          </Card>
        </div>

        <Section label="Hoje" right={<SeeMore />} />
        <Card thick pad={0}>
          {[
            { h: '14:00', n: 'Maria A. Souza', s: 'Consulta de avaliação', c: T.accent },
            { h: '16:30', n: 'Carlos Pinto', s: 'Sessão fisioterapia', c: T.line2 },
            { h: '18:00', n: 'Juliana Mendes', s: 'Retorno + exames', c: T.line2 },
          ].map((a, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', gap: 12, padding: '13px 14px',
              borderTop: i ? `1px solid ${T.line}` : 'none',
            }}>
              <div style={{
                width: 52, padding: '7px 0', textAlign: 'center',
                background: a.c, borderRadius: 10, border: `1.5px solid ${T.ink}`,
              }}>
                <div style={{ fontFamily: T.font, fontSize: 13, fontWeight: 700, color: T.ink, lineHeight: 1 }}>{a.h}</div>
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontFamily: T.font, fontSize: 14, fontWeight: 600, color: T.ink }}>{a.n}</div>
                <div style={{ fontFamily: T.font, fontSize: 11, color: T.ink3 }}>{a.s}</div>
              </div>
              <svg width="8" height="12" viewBox="0 0 8 12"><path d="M2 2l4 4-4 4" stroke={T.ink} strokeWidth="2" fill="none" strokeLinecap="round"/></svg>
            </div>
          ))}
        </Card>

        <Section label="Atendimentos abertos · 3" right={<SeeMore />} />
        {[
          { n: 'OS-00142', cli: 'Pedro Almeida', st: 'Em atendimento', t: 'info' },
          { n: 'OS-00143', cli: 'Ana Ribeiro', st: 'Aguardando', t: 'neutral' },
          { n: 'OS-00144', cli: 'Roberto Dias', st: 'Em atendimento', t: 'info' },
        ].map((o, i) => (
          <Card key={i} thick pad={12} style={{ marginBottom: 6 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontFamily: T.mono, fontSize: 10, color: T.ink3, fontWeight: 600, marginBottom: 2 }}>{o.n}</div>
                <div style={{ fontFamily: T.font, fontSize: 13, fontWeight: 600, color: T.ink }}>{o.cli}</div>
              </div>
              <Pill label={o.st} tone={o.t} />
            </div>
          </Card>
        ))}

        <div style={{ height: 14 }} />
      </Body>
      <TabBar active="home" />
    </Phone>
  );
}

Object.assign(window, { HifiLogin, HifiDashboard });
