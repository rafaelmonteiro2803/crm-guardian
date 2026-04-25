// HI-FI · Pipeline + Vendas + Financeiro

function HifiPipeline() {
  return (
    <Phone label="05 · PIPELINE" note="Chips de estágio + lista. Ações de mover estágio por card.">
      <Header title="Pipeline" eyebrow="TOTAL · R$ 45.200" big
        right={<Btn label="Novo" kind="primary" icon={<PlusIcon />} size="sm" />}
      />
      <div style={{
        display: 'flex', gap: 6, padding: '0 16px 10px', overflowX: 'auto',
        background: T.bg,
      }}>
        {[
          { l: 'Todos', n: 6, a: false },
          { l: 'Prospec.', n: 2, a: false },
          { l: 'Qualif.', n: 1, a: false },
          { l: 'Proposta', n: 2, a: true },
          { l: 'Negoc.', n: 1, a: false },
        ].map((c, i) => (
          <div key={i} style={{
            flex: '0 0 auto', padding: '6px 12px', borderRadius: 999,
            background: c.a ? T.accent : T.surface,
            border: `1.5px solid ${T.ink}`,
            fontFamily: T.font, fontSize: 12, fontWeight: 600, color: T.ink,
            display: 'flex', gap: 6, alignItems: 'center',
          }}>
            {c.l}
            <span style={{
              background: c.a ? T.ink : T.line2, color: c.a ? T.accent : T.ink2,
              padding: '1px 6px', borderRadius: 5, fontSize: 10, fontWeight: 700,
            }}>{c.n}</span>
          </div>
        ))}
      </div>
      <Body>
        <Section label="Proposta · R$ 18.000" style={{ margin: '2px 2px 10px' }} />
        {[
          { t: 'Pacote anual fisio', cli: 'Maria A. Souza', v: 'R$ 12.000', prob: 65, d: '2 dias sem contato', dc: T.warn },
          { t: 'Consultoria 3 meses', cli: 'Carlos Pinto', v: 'R$ 6.000', prob: 40, d: 'Reunião amanhã', dc: T.info },
        ].map((o, i) => (
          <Card key={i} thick pad={14} style={{ marginBottom: 8 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: T.font, fontSize: 15, fontWeight: 700, color: T.ink, letterSpacing: -0.3 }}>{o.t}</div>
                <div style={{ fontFamily: T.font, fontSize: 12, color: T.ink3 }}>{o.cli}</div>
              </div>
              <div style={{ fontFamily: T.font, fontSize: 18, fontWeight: 700, color: T.ink, letterSpacing: -0.5 }}>{o.v}</div>
            </div>
            <div style={{ display: 'flex', gap: 4, height: 6, background: T.line2, borderRadius: 3, marginBottom: 6, overflow: 'hidden' }}>
              <div style={{ width: `${o.prob}%`, background: T.accent, borderRight: `1.5px solid ${T.ink}` }} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ fontFamily: T.mono, fontSize: 10, color: o.dc, fontWeight: 600 }}>{o.d.toUpperCase()}</div>
              <div style={{ fontFamily: T.font, fontSize: 11, color: T.ink2, fontWeight: 600 }}>{o.prob}% prob.</div>
            </div>
          </Card>
        ))}

        <Section label="Negociação · R$ 7.000" />
        <Card thick pad={14} style={{ marginBottom: 8 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: T.font, fontSize: 15, fontWeight: 700, color: T.ink }}>Implantação sistema</div>
              <div style={{ fontFamily: T.font, fontSize: 12, color: T.ink3 }}>Roberto Dias</div>
            </div>
            <div style={{ fontFamily: T.font, fontSize: 18, fontWeight: 700, color: T.ink }}>R$ 7.000</div>
          </div>
          <div style={{ display: 'flex', gap: 4, height: 6, background: T.line2, borderRadius: 3, marginBottom: 6, overflow: 'hidden' }}>
            <div style={{ width: '80%', background: T.accent, borderRight: `1.5px solid ${T.ink}` }} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ fontFamily: T.mono, fontSize: 10, color: T.pos, fontWeight: 600 }}>PROPOSTA ACEITA</div>
            <div style={{ fontFamily: T.font, fontSize: 11, color: T.ink2, fontWeight: 600 }}>80% prob.</div>
          </div>
        </Card>

        <Section label="Prospecção · R$ 8.000" />
        {[
          { t: 'Diagnóstico inicial', cli: 'Ana Ribeiro', v: 'R$ 3.500', prob: 20 },
          { t: 'Avaliação de processos', cli: 'Juliana Mendes', v: 'R$ 4.500', prob: 15 },
        ].map((o, i) => (
          <Card key={i} thick pad={12} style={{ marginBottom: 6 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontFamily: T.font, fontSize: 14, fontWeight: 600, color: T.ink }}>{o.t}</div>
                <div style={{ fontFamily: T.font, fontSize: 11, color: T.ink3 }}>{o.cli}</div>
              </div>
              <div style={{ fontFamily: T.font, fontSize: 15, fontWeight: 700, color: T.ink }}>{o.v}</div>
            </div>
          </Card>
        ))}
      </Body>
      <TabBar active="vendas" />
    </Phone>
  );
}

function HifiVendas() {
  const vs = [
    { d: '17/04', cli: 'Maria A. Souza', v: 'R$ 1.800', p: 'Pacote 4 sessões', st: 'Pago', tone: 'pos' },
    { d: '16/04', cli: 'Carlos Pinto', v: 'R$ 3.200', p: 'Consultoria mensal', st: 'Parcial', tone: 'warn' },
    { d: '15/04', cli: 'Juliana Mendes', v: 'R$ 950', p: 'Avaliação', st: 'Pendente', tone: 'warn' },
    { d: '12/04', cli: 'Pedro Almeida', v: 'R$ 2.400', p: 'Pacote mensal', st: 'Pago', tone: 'pos' },
    { d: '10/04', cli: 'Ana Ribeiro', v: 'R$ 5.600', p: 'Plano anual', st: 'Pago', tone: 'pos' },
    { d: '08/04', cli: 'Roberto Dias', v: 'R$ 1.200', p: 'Sessão única', st: 'Vencido', tone: 'neg' },
  ];
  return (
    <Phone label="06 · VENDAS" note="KPIs + filtros + lista. Tap abre detalhe da venda.">
      <Header title="Vendas" eyebrow="ABRIL" big
        right={<Btn label="Nova" kind="primary" icon={<PlusIcon />} size="sm" />}
      />
      <Body>
        <Card thick style={{ background: T.accent, padding: 16, marginBottom: 10 }}>
          <div style={{ fontFamily: T.font, fontSize: 11, color: T.ink, opacity: 0.7, fontWeight: 700, letterSpacing: 0.5, textTransform: 'uppercase' }}>TOTAL MÊS</div>
          <div style={{ fontFamily: T.font, fontSize: 32, fontWeight: 700, color: T.ink, letterSpacing: -1.2, marginTop: 2, lineHeight: 1 }}>R$ 28.900</div>
          <div style={{ fontFamily: T.font, fontSize: 12, color: T.ink, fontWeight: 600, opacity: 0.75, marginTop: 4 }}>12 vendas · Ticket médio R$ 2.408</div>
        </Card>

        <div style={{ display: 'flex', gap: 6, margin: '4px 0 12px', overflowX: 'auto' }}>
          {['Todas', 'Pagas', 'Pendentes', 'Vencidas'].map((c, i) => (
            <div key={c} style={{
              flex: '0 0 auto', padding: '6px 12px', borderRadius: 999,
              background: i === 0 ? T.ink : T.surface,
              color: i === 0 ? '#fff' : T.ink,
              border: `1.5px solid ${T.ink}`,
              fontFamily: T.font, fontSize: 12, fontWeight: 600,
            }}>{c}</div>
          ))}
        </div>

        {vs.map((v, i) => (
          <Card key={i} thick pad={12} style={{ marginBottom: 6 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
              <div style={{ fontFamily: T.mono, fontSize: 10, color: T.ink3, fontWeight: 600 }}>{v.d}</div>
              <Pill label={v.st} tone={v.tone} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
              <div>
                <div style={{ fontFamily: T.font, fontSize: 14, fontWeight: 600, color: T.ink }}>{v.cli}</div>
                <div style={{ fontFamily: T.font, fontSize: 11, color: T.ink3 }}>{v.p}</div>
              </div>
              <div style={{ fontFamily: T.font, fontSize: 17, fontWeight: 700, color: T.ink, letterSpacing: -0.4 }}>{v.v}</div>
            </div>
          </Card>
        ))}
      </Body>
      <TabBar active="vendas" />
    </Phone>
  );
}

function HifiFinanceiro() {
  const ts = [
    { cli: 'Maria A. Souza', v: 'R$ 1.800', vc: '17/04', st: 'Hoje', tone: 'accent' },
    { cli: 'Carlos Pinto', v: 'R$ 1.600', vc: '15/04', st: 'Vencido', tone: 'neg' },
    { cli: 'Ana Ribeiro', v: 'R$ 5.600', vc: '25/04', st: 'Pendente', tone: 'warn' },
    { cli: 'Pedro Almeida', v: 'R$ 2.400', vc: '12/04', st: 'Pago', tone: 'pos' },
    { cli: 'Juliana Mendes', v: 'R$ 950', vc: '30/04', st: 'Pendente', tone: 'warn' },
    { cli: 'Roberto Dias', v: 'R$ 1.200', vc: '05/04', st: 'Vencido', tone: 'neg' },
  ];
  return (
    <Phone label="07 · FINANCEIRO" note="Títulos a receber. Swipe left = marcar pago / registrar pagamento.">
      <Header title="Financeiro" eyebrow="TÍTULOS · ABRIL" big
        right={<Btn label="Novo" kind="primary" icon={<PlusIcon />} size="sm" />}
      />
      <Body>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 6, marginBottom: 12 }}>
          <Card thick pad={12}>
            <div style={{ fontFamily: T.font, fontSize: 9, color: T.ink3, fontWeight: 700, letterSpacing: 0.5, textTransform: 'uppercase' }}>Pagos</div>
            <div style={{ fontFamily: T.font, fontSize: 16, fontWeight: 700, color: T.pos, marginTop: 4, letterSpacing: -0.3 }}>R$ 42k</div>
            <div style={{ fontFamily: T.font, fontSize: 10, color: T.ink3 }}>28 tít.</div>
          </Card>
          <Card thick pad={12}>
            <div style={{ fontFamily: T.font, fontSize: 9, color: T.ink3, fontWeight: 700, letterSpacing: 0.5, textTransform: 'uppercase' }}>Pendente</div>
            <div style={{ fontFamily: T.font, fontSize: 16, fontWeight: 700, color: T.ink, marginTop: 4, letterSpacing: -0.3 }}>R$ 12k</div>
            <div style={{ fontFamily: T.font, fontSize: 10, color: T.ink3 }}>8 tít.</div>
          </Card>
          <Card thick pad={12} style={{ background: T.negSoft }}>
            <div style={{ fontFamily: T.font, fontSize: 9, color: T.neg, fontWeight: 700, letterSpacing: 0.5, textTransform: 'uppercase' }}>Vencido</div>
            <div style={{ fontFamily: T.font, fontSize: 16, fontWeight: 700, color: T.neg, marginTop: 4, letterSpacing: -0.3 }}>R$ 2.1k</div>
            <div style={{ fontFamily: T.font, fontSize: 10, color: T.neg }}>3 tít.</div>
          </Card>
        </div>

        <div style={{ display: 'flex', gap: 6, marginBottom: 12, overflowX: 'auto' }}>
          {['Todos', 'Hoje', 'Vencidos', 'Esta semana', 'Pagos'].map((c, i) => (
            <div key={c} style={{
              flex: '0 0 auto', padding: '6px 12px', borderRadius: 999,
              background: i === 0 ? T.ink : T.surface,
              color: i === 0 ? '#fff' : T.ink,
              border: `1.5px solid ${T.ink}`,
              fontFamily: T.font, fontSize: 12, fontWeight: 600,
            }}>{c}</div>
          ))}
        </div>

        {ts.map((t, i) => (
          <Card key={i} thick pad={12} style={{ marginBottom: 6, background: t.tone === 'neg' ? T.negSoft : T.surface }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
              <div style={{ fontFamily: T.font, fontSize: 14, fontWeight: 600, color: T.ink }}>{t.cli}</div>
              <Pill label={t.st} tone={t.tone} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
              <div style={{ fontFamily: T.mono, fontSize: 11, color: T.ink3, fontWeight: 600 }}>VENC. {t.vc}</div>
              <div style={{ fontFamily: T.font, fontSize: 17, fontWeight: 700, color: T.ink, letterSpacing: -0.4 }}>{t.v}</div>
            </div>
          </Card>
        ))}
      </Body>
      <TabBar active="fin" />
    </Phone>
  );
}

Object.assign(window, { HifiPipeline, HifiVendas, HifiFinanceiro });
