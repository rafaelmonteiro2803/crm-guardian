// Screen 6 · Ordens de Serviço (lista + fluxo)
function ScreenOSLista() {
  const ordens = [
    { n: 'OS-00142', cli: 'Maria A. Souza', svc: 'Consulta de avaliação', st: 'Em atendimento', c: WF.info, v: 'R$ 350', ag: '17/04 14:00' },
    { n: 'OS-00143', cli: 'Ana Paula Ribeiro', svc: 'Sessão fisioterapia', st: 'Aguardando', c: WF.ink3, v: 'R$ 180', ag: null },
    { n: 'OS-00144', cli: 'Roberto Dias', svc: 'Retorno consulta', st: 'Em atendimento', c: WF.info, v: 'R$ 250', ag: '17/04 16:30' },
    { n: 'OS-00141', cli: 'Pedro Almeida', svc: 'Pacote 4 sessões', st: 'Concluído', c: WF.pos, v: 'R$ 720', ag: '16/04' },
    { n: 'OS-00140', cli: 'Camila Rocha', svc: 'Avaliação inicial', st: 'Aguardando', c: WF.ink3, v: 'R$ 200', ag: null },
  ];
  return (
    <Phone label="06a · Ordens de Serviço · lista" note="// 3 KPIs + lista filtrável. cada card tem ações contextuais.">
      <Header title="Ordens de Serviço" subtitle="5 ABERTAS · 1 CONCLUÍDA" right={<NovoBtn />} />
      <Body>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 6, marginBottom: 14 }}>
          <StatPill label="Aguard." v="2" c={WF.ink3} n="pendentes" />
          <StatPill label="Atend." v="2" c={WF.info} n="em exec." />
          <StatPill label="Concl." v="1" c={WF.pos} n="hoje" />
        </div>
        {ordens.map((o, i) => (
          <Card key={i} pad={12} style={{ marginBottom: 8 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
              <span style={{ fontFamily: WF.mono, fontSize: 10, color: WF.ink3 }}>{o.n}</span>
              <Pill label={o.st} color={o.c} bg={`${o.c}15`} />
            </div>
            <div style={{ fontFamily: WF.sans, fontSize: 14, fontWeight: 500, color: WF.ink }}>{o.cli}</div>
            <div style={{ fontFamily: WF.sans, fontSize: 11, color: WF.ink3, marginBottom: 6 }}>{o.svc}</div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ fontFamily: WF.mono, fontSize: 10, color: o.ag ? WF.accent : WF.ink4 }}>
                {o.ag || '— sem agendamento —'}
              </div>
              <div style={{ fontFamily: WF.sans, fontSize: 12, fontWeight: 600, color: WF.ink }}>{o.v}</div>
            </div>
          </Card>
        ))}
      </Body>
      <TabBar active="op" />
    </Phone>
  );
}

function ScreenOSDetalhe() {
  return (
    <Phone label="06b · OS · detalhe + fluxo" note="// ações encadeadas: encaminhar → agendar → evolução → concluir.">
      <Header title="OS-00142" subtitle="EM ATENDIMENTO" back right={<Note>···</Note>} />
      <Body>
        <Card pad={14} style={{ marginBottom: 12 }}>
          <Note>CLIENTE</Note>
          <div style={{ fontFamily: WF.sans, fontSize: 15, fontWeight: 600, color: WF.ink, marginTop: 2 }}>Maria Aparecida Souza</div>
          <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
            <Note>(11) 98432-1100</Note>
            <Note style={{ color: WF.pos }}>WHATSAPP</Note>
          </div>
        </Card>

        <Card pad={14} style={{ marginBottom: 12 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
            <Note>SERVIÇO</Note>
            <Note>R$ 350,00</Note>
          </div>
          <div style={{ fontFamily: WF.sans, fontSize: 14, color: WF.ink, marginBottom: 8 }}>Consulta de avaliação</div>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderTop: `1px solid ${WF.line2}` }}>
            <Note>AGENDADO</Note>
            <span style={{ fontFamily: WF.sans, fontSize: 12, color: WF.accent, fontWeight: 500 }}>17/04 14:00</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderTop: `1px solid ${WF.line2}` }}>
            <Note>TÉCNICO</Note>
            <span style={{ fontFamily: WF.sans, fontSize: 12, color: WF.ink }}>Dr. Paulo Lima</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderTop: `1px solid ${WF.line2}` }}>
            <Note>COMISSÃO</Note>
            <span style={{ fontFamily: WF.sans, fontSize: 12, color: WF.info }}>R$ 52,50 (15%)</span>
          </div>
        </Card>

        <Section label="EVOLUÇÃO · 2 REGISTROS" />
        <Card pad={0} style={{ overflow: 'hidden', marginBottom: 14 }}>
          {[
            { d: '17/04 14:12', t: 'Paciente apresenta dor lombar crônica. Iniciado plano de tratamento…' },
            { d: '17/04 13:58', t: 'Início do atendimento. Anamnese completa realizada.' },
          ].map((e, i) => (
            <div key={i} style={{ padding: '10px 14px', borderTop: i ? `1px solid ${WF.line2}` : 'none' }}>
              <Note style={{ marginBottom: 4 }}>{e.d}</Note>
              <div style={{ fontFamily: WF.sans, fontSize: 12, color: WF.ink2, lineHeight: 1.4 }}>{e.t}</div>
            </div>
          ))}
        </Card>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 8 }}>
          <ActionBtn label="+ Evolução" c={WF.pink} />
          <ActionBtn label="Reagendar" c={WF.accent} />
        </div>
        <button style={{
          width: '100%', background: WF.pos, border: 'none', color: '#fff',
          padding: '12px', borderRadius: 8, fontFamily: WF.sans, fontSize: 14, fontWeight: 600,
        }}>Concluir Atendimento</button>
      </Body>
    </Phone>
  );
}

Object.assign(window, { ScreenOSLista, ScreenOSDetalhe });
