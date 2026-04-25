// Screen 4: Pipeline — 2 variações (swipe entre colunas, chips+lista)
function ScreenPipelineA() {
  return (
    <Phone label="04a · Pipeline · swipe" note="// uma coluna por vez; swipe horizontal troca estágio. paginação visual embaixo.">
      <Header title="Pipeline" subtitle="R$ 45.200 · 6 ABERTAS" right={<NovoBtn />} />
      {/* Stage indicator */}
      <div style={{
        display: 'flex', padding: '12px 16px 6px', gap: 4, background: WF.bg,
        borderBottom: `1px solid ${WF.line2}`,
      }}>
        {['Prospec.', 'Qualif.', 'Proposta', 'Negoc.', 'Fechado'].map((s, i) => (
          <div key={s} style={{
            flex: 1, textAlign: 'center',
            padding: '6px 2px', borderRadius: 6,
            background: i === 2 ? WF.ink : 'transparent',
            color: i === 2 ? '#fff' : WF.ink3,
            fontFamily: WF.sans, fontSize: 10, fontWeight: i === 2 ? 600 : 400,
          }}>{s}</div>
        ))}
      </div>
      <Body>
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          padding: '4px 2px 10px',
        }}>
          <div style={{ fontFamily: WF.sans, fontSize: 16, fontWeight: 600, color: WF.ink }}>Proposta</div>
          <div style={{ fontFamily: WF.mono, fontSize: 11, color: WF.ink3 }}>2 · R$ 18.000</div>
        </div>

        {[
          { t: 'Pacote anual fisio', cli: 'Maria A. Souza', v: 12000, p: 'Plano Premium' },
          { t: 'Consultoria 3 meses', cli: 'Carlos Pinto', v: 6000, p: 'Pacote Pro' },
        ].map((o, i) => (
          <Card key={i} pad={14} style={{ marginBottom: 10 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
              <div style={{ fontFamily: WF.sans, fontSize: 14, fontWeight: 600, color: WF.ink, flex: 1 }}>{o.t}</div>
              <Note>···</Note>
            </div>
            <div style={{ fontFamily: WF.sans, fontSize: 12, color: WF.ink2 }}>{o.cli}</div>
            <div style={{ fontFamily: WF.mono, fontSize: 10, color: WF.ink3, marginBottom: 8 }}>{o.p}</div>
            <div style={{ fontFamily: WF.sans, fontSize: 18, fontWeight: 600, color: WF.pos, marginBottom: 10 }}>R$ {o.v.toLocaleString('pt-BR')}</div>
            <div style={{ display: 'flex', gap: 6 }}>
              <button style={{
                flex: 1, padding: '8px', background: WF.line2, border: 'none', borderRadius: 6,
                fontFamily: WF.sans, fontSize: 11, color: WF.ink2, fontWeight: 500,
              }}>← Qualif.</button>
              <button style={{
                flex: 1, padding: '8px', background: WF.accent, border: 'none', borderRadius: 6,
                fontFamily: WF.sans, fontSize: 11, color: '#fff', fontWeight: 600,
              }}>Negoc. →</button>
            </div>
          </Card>
        ))}

        {/* paginação */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 6, marginTop: 8 }}>
          {[0,1,2,3,4].map(i => (
            <div key={i} style={{
              width: i === 2 ? 20 : 6, height: 6, borderRadius: 3,
              background: i === 2 ? WF.ink : WF.line,
              transition: 'width 0.2s',
            }} />
          ))}
        </div>
        <Note style={{ textAlign: 'center', marginTop: 10 }}>‹ ARRASTE PARA TROCAR DE ESTÁGIO ›</Note>
      </Body>
      <TabBar active="vendas" />
    </Phone>
  );
}

function ScreenPipelineB() {
  return (
    <Phone label="04b · Pipeline · chips" note="// chips de estágio no topo + lista vertical. quick-add de estágio na chip.">
      <Header title="Pipeline" subtitle="TOTAL R$ 45.200" right={<NovoBtn />} />
      <div style={{
        display: 'flex', gap: 6, padding: '10px 16px', background: WF.bg,
        borderBottom: `1px solid ${WF.line2}`, overflowX: 'auto',
      }}>
        {[
          { l: 'Todos', n: 6, a: false },
          { l: 'Prospec.', n: 2, a: false },
          { l: 'Proposta', n: 2, a: true },
          { l: 'Negoc.', n: 1, a: false },
          { l: 'Fechado', n: 1, a: false },
        ].map(c => (
          <div key={c.l} style={{
            flex: '0 0 auto', padding: '5px 10px', borderRadius: 999,
            background: c.a ? WF.ink : 'transparent',
            border: `1px solid ${c.a ? WF.ink : WF.line}`,
            color: c.a ? '#fff' : WF.ink2,
            fontFamily: WF.sans, fontSize: 11, fontWeight: 500,
            display: 'flex', gap: 5, alignItems: 'center',
          }}>
            {c.l} <span style={{ opacity: 0.6 }}>{c.n}</span>
          </div>
        ))}
      </div>
      <Body>
        <Section label="PROPOSTA · 2 · R$ 18.000" />
        {[
          { t: 'Pacote anual fisio', cli: 'Maria A. Souza', v: 'R$ 12.000' },
          { t: 'Consultoria 3 meses', cli: 'Carlos Pinto', v: 'R$ 6.000' },
        ].map((o, i) => <LineCard key={i} {...o} />)}

        <Section label="NEGOCIAÇÃO · 1 · R$ 7.000" style={{ marginTop: 14 }} />
        <LineCard t="Implantação sistema" cli="Roberto Dias" v="R$ 7.000" />

        <Section label="PROSPECÇÃO · 2 · R$ 8.000" style={{ marginTop: 14 }} />
        <LineCard t="Diagnóstico inicial" cli="Ana Ribeiro" v="R$ 3.500" />
        <LineCard t="Avaliação de processos" cli="Juliana Mendes" v="R$ 4.500" />
      </Body>
      <TabBar active="vendas" />
    </Phone>
  );
}

function LineCard({ t, cli, v }) {
  return (
    <Card pad={12} style={{ marginBottom: 8 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: WF.sans, fontSize: 13, fontWeight: 600, color: WF.ink }}>{t}</div>
          <div style={{ fontFamily: WF.sans, fontSize: 11, color: WF.ink3 }}>{cli}</div>
        </div>
        <div style={{ fontFamily: WF.sans, fontSize: 13, fontWeight: 600, color: WF.pos }}>{v}</div>
      </div>
    </Card>
  );
}

Object.assign(window, { ScreenPipelineA, ScreenPipelineB, LineCard });
