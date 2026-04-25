// Screen 5 · Vendas
function ScreenVendas() {
  const vs = [
    { d: '17/04', cli: 'Maria A. Souza', v: 'R$ 1.800', p: 'Pacote 4 sessões', st: 'Pago', c: WF.pos },
    { d: '16/04', cli: 'Carlos Pinto', v: 'R$ 3.200', p: 'Consultoria', st: 'Parcial', c: WF.warn },
    { d: '15/04', cli: 'Juliana Mendes', v: 'R$ 950', p: 'Avaliação', st: 'Pendente', c: WF.warn },
    { d: '12/04', cli: 'Pedro Almeida', v: 'R$ 2.400', p: 'Pacote mensal', st: 'Pago', c: WF.pos },
    { d: '10/04', cli: 'Ana Ribeiro', v: 'R$ 5.600', p: 'Plano anual', st: 'Pago', c: WF.pos },
    { d: '08/04', cli: 'Roberto Dias', v: 'R$ 1.200', p: 'Sessão única', st: 'Vencido', c: WF.neg },
  ];
  return (
    <Phone label="05 · Vendas" note="// lista de vendas com status financeiro. tap no card abre detalhe + título.">
      <Header title="Vendas" subtitle="12 NO MÊS · R$ 28.900" right={<NovoBtn />} />
      <div style={{ padding: '10px 16px', background: WF.bg, borderBottom: `1px solid ${WF.line2}`, display: 'flex', gap: 6, overflowX: 'auto' }}>
        {['Abril', 'Pagas', 'Pendentes', 'Vencidas'].map((c, i) => (
          <div key={c} style={{
            flex: '0 0 auto', padding: '5px 10px', borderRadius: 999,
            background: i === 0 ? WF.ink : 'transparent',
            border: `1px solid ${i === 0 ? WF.ink : WF.line}`,
            color: i === 0 ? '#fff' : WF.ink2,
            fontFamily: WF.sans, fontSize: 11, fontWeight: 500,
          }}>{c}</div>
        ))}
      </div>
      <Body>
        {vs.map((v, i) => (
          <Card key={i} pad={12} style={{ marginBottom: 8 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
              <div style={{ fontFamily: WF.mono, fontSize: 10, color: WF.ink3 }}>{v.d}</div>
              <Pill label={v.st} color={v.c} bg={`${v.c}15`} />
            </div>
            <div style={{ fontFamily: WF.sans, fontSize: 14, fontWeight: 500, color: WF.ink }}>{v.cli}</div>
            <div style={{ fontFamily: WF.sans, fontSize: 11, color: WF.ink3 }}>{v.p}</div>
            <div style={{ fontFamily: WF.sans, fontSize: 16, fontWeight: 600, color: WF.ink, marginTop: 6 }}>{v.v}</div>
          </Card>
        ))}
      </Body>
      <TabBar active="vendas" />
    </Phone>
  );
}

window.ScreenVendas = ScreenVendas;
