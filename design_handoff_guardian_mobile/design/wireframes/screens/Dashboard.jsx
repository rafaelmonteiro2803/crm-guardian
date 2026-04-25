// Screen 2: Dashboard — 2 variações
function ScreenDashboardA() {
  return (
    <Phone label="02a · Dashboard · resumido" note="// cards resumo + agenda + atendimentos. KPIs principais na home.">
      <Header
        title="Olá, Rafael"
        subtitle="CLÍNICA SÃO LUCAS · 17 ABR"
        right={<NovoBtn label="Ações" />}
      />
      <Body>
        {/* KPI row */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 14 }}>
          <KpiCard label="A RECEBER" value="R$ 12.430" sub="8 pendentes" color={WF.warn} />
          <KpiCard label="VENCIDOS" value="R$ 2.180" sub="3 títulos" color={WF.neg} />
          <KpiCard label="VENDAS MÊS" value="R$ 28.900" sub="12 vendas" color={WF.ink} />
          <KpiCard label="PIPELINE" value="R$ 45.200" sub="6 abertas · 34%" color={WF.info} />
        </div>

        <Section label="AGENDA · PRÓXIMOS" right={<Note style={{ color: WF.accent }}>VER TUDO ›</Note>} />
        <Card pad={0} style={{ overflow: 'hidden', marginBottom: 14 }}>
          {[
            { dt: '17/04', hr: '14:00', cli: 'Maria Aparecida Souza', svc: 'Consulta de avaliação' },
            { dt: '17/04', hr: '16:30', cli: 'Carlos Eduardo Pinto', svc: 'Sessão fisioterapia' },
            { dt: '18/04', hr: '09:00', cli: 'Juliana Mendes', svc: 'Retorno + exames' },
          ].map((a, i) => (
            <div key={i} style={{
              display: 'flex', gap: 12, padding: '11px 14px', alignItems: 'center',
              borderTop: i ? `1px solid ${WF.line2}` : 'none',
            }}>
              <div style={{
                width: 48, textAlign: 'center', padding: '4px 0', borderRadius: 6,
                background: WF.accentSoft, border: `1px solid ${WF.accent}30`,
              }}>
                <div style={{ fontFamily: WF.sans, fontSize: 11, fontWeight: 600, color: WF.accent }}>{a.dt}</div>
                <div style={{ fontFamily: WF.mono, fontSize: 10, color: WF.accent, opacity: 0.8 }}>{a.hr}</div>
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontFamily: WF.sans, fontSize: 13, fontWeight: 500, color: WF.ink }}>{a.cli}</div>
                <div style={{ fontFamily: WF.sans, fontSize: 11, color: WF.ink3 }}>{a.svc}</div>
              </div>
              <svg width="6" height="10" viewBox="0 0 6 10"><path d="M1 1l4 4-4 4" stroke={WF.ink4} strokeWidth="1.5" fill="none"/></svg>
            </div>
          ))}
        </Card>

        <Section label="ATENDIMENTOS ABERTOS · 5" />
        <Card pad={0} style={{ overflow: 'hidden', marginBottom: 14 }}>
          {[
            { n: 'OS-00142', cli: 'Pedro Almeida', st: 'Em atendimento', stC: WF.info },
            { n: 'OS-00143', cli: 'Ana Paula Ribeiro', st: 'Aguardando', stC: WF.ink3 },
            { n: 'OS-00144', cli: 'Roberto Dias', st: 'Em atendimento', stC: WF.info },
          ].map((o, i) => (
            <div key={i} style={{
              display: 'flex', gap: 10, padding: '11px 14px', alignItems: 'center',
              borderTop: i ? `1px solid ${WF.line2}` : 'none',
            }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', gap: 6, alignItems: 'center', marginBottom: 2 }}>
                  <span style={{ fontFamily: WF.mono, fontSize: 10, color: WF.ink3 }}>{o.n}</span>
                  <Pill label={o.st} color={o.stC} bg={`${o.stC}15`} />
                </div>
                <div style={{ fontFamily: WF.sans, fontSize: 13, color: WF.ink }}>{o.cli}</div>
              </div>
              <button style={{
                background: 'transparent', border: `1px solid ${WF.pink}40`,
                color: WF.pink, padding: '4px 10px', borderRadius: 6,
                fontFamily: WF.sans, fontSize: 11, fontWeight: 500,
              }}>Evolução</button>
            </div>
          ))}
        </Card>

        <Section label="ANIVERSARIANTES · 4" />
        <Card pad={12} style={{ marginBottom: 14, borderColor: `${WF.pink}30` }}>
          <div style={{ display: 'flex', gap: 12, overflowX: 'auto' }}>
            {[
              { d: '18/04', age: 42, n: 'Luís Fernando' },
              { d: '22/04', age: 35, n: 'Camila Rocha' },
              { d: '27/04', age: 58, n: 'José Carlos' },
              { d: '30/04', age: 29, n: 'Marina Souza' },
            ].map((p, i) => (
              <div key={i} style={{ flex: '0 0 auto', width: 92 }}>
                <div style={{
                  padding: '6px 4px', background: `${WF.pink}10`,
                  border: `1px solid ${WF.pink}30`, borderRadius: 6, textAlign: 'center',
                  marginBottom: 4,
                }}>
                  <div style={{ fontFamily: WF.sans, fontSize: 12, fontWeight: 600, color: WF.pink }}>{p.d}</div>
                  <div style={{ fontFamily: WF.mono, fontSize: 9, color: WF.pink, opacity: 0.7 }}>{p.age} anos</div>
                </div>
                <div style={{ fontFamily: WF.sans, fontSize: 11, color: WF.ink, textAlign: 'center', lineHeight: 1.3 }}>{p.n}</div>
              </div>
            ))}
          </div>
        </Card>
      </Body>
      <TabBar active="home" />
    </Phone>
  );
}

function ScreenDashboardB() {
  return (
    <Phone label="02b · Dashboard · denso" note="// gráfico de vendas + mais KPIs visíveis. para gestores.">
      <Header
        title="Visão Geral"
        subtitle="CLÍNICA SÃO LUCAS · ABRIL"
        right={<Note>FILTRO ⌄</Note>}
      />
      <Body>
        {/* 4 KPIs row */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 14 }}>
          <KpiCard label="CLIENTES" value="247" sub="total" color={WF.ink} />
          <KpiCard label="VENDAS ANO" value="R$ 186k" sub="↑ 24% vs 2025" color={WF.pos} />
          <KpiCard label="OPORT." value="R$ 45k" sub="6 abertas" color={WF.info} />
          <KpiCard label="TICKET MÉDIO" value="R$ 1.830" sub="12 meses" color={WF.ink2} />
        </div>

        {/* Chart */}
        <Card style={{ marginBottom: 14 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <div style={{ fontFamily: WF.sans, fontSize: 13, fontWeight: 600, color: WF.ink }}>Vendas por mês</div>
            <Note>12 MESES</Note>
          </div>
          <div style={{ display: 'flex', gap: 4, alignItems: 'flex-end', height: 110 }}>
            {[32,45,38,52,60,48,55,62,70,58,66,74].map((h, i) => (
              <div key={i} style={{ flex: 1 }}>
                <div style={{
                  width: '100%', height: `${h}%`, background: i === 11 ? WF.accent : WF.ink,
                  borderRadius: '3px 3px 0 0', opacity: i === 11 ? 1 : 0.75,
                }} />
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', gap: 4, marginTop: 4 }}>
            {['mai','jun','jul','ago','set','out','nov','dez','jan','fev','mar','abr'].map(m => (
              <div key={m} style={{ flex: 1, fontFamily: WF.mono, fontSize: 8, color: WF.ink3, textAlign: 'center' }}>{m}</div>
            ))}
          </div>
        </Card>

        {/* Status fin */}
        <Section label="FINANCEIRO" />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 6, marginBottom: 14 }}>
          <StatPill label="Recebido" v="R$ 42k" c={WF.pos} n="28 títulos" />
          <StatPill label="A Receber" v="R$ 12k" c={WF.warn} n="8 pend." />
          <StatPill label="Vencido" v="R$ 2.1k" c={WF.neg} n="3 títulos" />
        </div>

        {/* Pipeline mini */}
        <Section label="PIPELINE · R$ 45.200" right={<Note style={{ color: WF.accent }}>ABRIR ›</Note>} />
        <Card pad={12} style={{ marginBottom: 14 }}>
          {['Prospecção · 2 · R$ 8k','Qualificação · 1 · R$ 12k','Proposta · 2 · R$ 18k','Negociação · 1 · R$ 7k'].map((s, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '6px 0', borderBottom: i < 3 ? `1px solid ${WF.line2}` : 'none' }}>
              <div style={{ width: 8, height: 8, borderRadius: 2, background: [WF.ink3, WF.info, WF.warn, WF.accent][i] }} />
              <div style={{ flex: 1, fontFamily: WF.sans, fontSize: 12, color: WF.ink2 }}>{s}</div>
            </div>
          ))}
        </Card>
      </Body>
      <TabBar active="home" />
    </Phone>
  );
}

function KpiCard({ label, value, sub, color }) {
  return (
    <Card pad={12}>
      <Note style={{ marginBottom: 6 }}>{label}</Note>
      <div style={{ fontFamily: WF.sans, fontSize: 18, fontWeight: 600, color, lineHeight: 1.1 }}>{value}</div>
      <div style={{ fontFamily: WF.sans, fontSize: 10, color: WF.ink3, marginTop: 2 }}>{sub}</div>
    </Card>
  );
}

function StatPill({ label, v, c, n }) {
  return (
    <div style={{
      background: WF.card, border: `1px solid ${c}30`, borderRadius: 8,
      padding: '8px 10px',
    }}>
      <div style={{ fontFamily: WF.mono, fontSize: 9, color: c, letterSpacing: 0.5, textTransform: 'uppercase' }}>{label}</div>
      <div style={{ fontFamily: WF.sans, fontSize: 14, fontWeight: 600, color: c }}>{v}</div>
      <div style={{ fontFamily: WF.sans, fontSize: 10, color: WF.ink3 }}>{n}</div>
    </div>
  );
}

Object.assign(window, { ScreenDashboardA, ScreenDashboardB, KpiCard, StatPill });
