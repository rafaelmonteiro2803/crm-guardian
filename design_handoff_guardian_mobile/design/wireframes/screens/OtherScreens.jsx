// Screen 7·8·9·10 — Estoque, Fornecedores, Financeiro, Contas a Pagar
function ScreenEstoque() {
  const itens = [
    { n: 'Creme hidratante 250ml', sku: 'COS-001', q: 42, min: 10, c: WF.pos },
    { n: 'Óleo essencial lavanda', sku: 'COS-007', q: 8, min: 10, c: WF.warn },
    { n: 'Toalha descartável', sku: 'SUP-014', q: 2, min: 20, c: WF.neg },
    { n: 'Luva nitrílica M', sku: 'SUP-021', q: 180, min: 50, c: WF.pos },
    { n: 'Álcool 70% 1L', sku: 'SUP-003', q: 6, min: 5, c: WF.warn },
  ];
  return (
    <Phone label="07 · Estoque" note="// nível de estoque visual. toque longo = movimentação rápida.">
      <Header title="Estoque" subtitle="24 ITENS · 3 ABAIXO DO MÍN." right={<NovoBtn />} />
      <Body>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 14 }}>
          <StatPill label="OK" v="19" c={WF.pos} n="itens" />
          <StatPill label="Alerta" v="5" c={WF.neg} n="reposição" />
        </div>
        {itens.map((it, i) => (
          <Card key={i} pad={12} style={{ marginBottom: 8 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: WF.sans, fontSize: 13, fontWeight: 500, color: WF.ink }}>{it.n}</div>
                <Note>SKU {it.sku}</Note>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontFamily: WF.sans, fontSize: 16, fontWeight: 600, color: it.c }}>{it.q}</div>
                <Note>mín {it.min}</Note>
              </div>
            </div>
            <div style={{ height: 4, background: WF.line2, borderRadius: 2, overflow: 'hidden' }}>
              <div style={{
                width: `${Math.min(100, (it.q / (it.min * 3)) * 100)}%`,
                height: '100%', background: it.c,
              }} />
            </div>
          </Card>
        ))}
      </Body>
      <TabBar active="op" />
    </Phone>
  );
}

function ScreenFornecedores() {
  const fs = [
    { n: 'Dermocos Distribuidora', cnpj: '12.345.678/0001-90', cat: 'Cosméticos', ab: 'R$ 3.200' },
    { n: 'Medsupply Ltda', cnpj: '23.456.789/0001-01', cat: 'Suprimentos', ab: 'R$ 1.450' },
    { n: 'Farma Distribuição SP', cnpj: '34.567.890/0001-12', cat: 'Medicamentos', ab: 'R$ 0' },
    { n: 'Limpa Tudo EPP', cnpj: '45.678.901/0001-23', cat: 'Higiene', ab: 'R$ 680' },
  ];
  return (
    <Phone label="08 · Fornecedores" note="// lista com saldo em aberto. tap abre contas a pagar do fornecedor.">
      <Header title="Fornecedores" subtitle="14 ATIVOS" right={<NovoBtn />} />
      <Body>
        {fs.map((f, i) => (
          <Card key={i} pad={12} style={{ marginBottom: 8 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <Ph w={36} h={36} r={8} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontFamily: WF.sans, fontSize: 13, fontWeight: 500, color: WF.ink }}>{f.n}</div>
                <Note>{f.cnpj}</Note>
                <Pill label={f.cat} color={WF.ink3} bg={WF.line2} size={9} />
              </div>
              <div style={{ textAlign: 'right' }}>
                <Note>EM ABERTO</Note>
                <div style={{ fontFamily: WF.sans, fontSize: 13, fontWeight: 600, color: f.ab === 'R$ 0' ? WF.ink3 : WF.warn, marginTop: 2 }}>{f.ab}</div>
              </div>
            </div>
          </Card>
        ))}
      </Body>
      <TabBar active="fin" />
    </Phone>
  );
}

function ScreenFinanceiro() {
  const ts = [
    { cli: 'Maria A. Souza', v: 'R$ 1.800', em: '02/04', vc: '17/04', st: 'Pendente', c: WF.warn },
    { cli: 'Carlos Pinto', v: 'R$ 1.600', em: '16/03', vc: '15/04', st: 'Vencido', c: WF.neg },
    { cli: 'Ana Ribeiro', v: 'R$ 5.600', em: '10/04', vc: '25/04', st: 'Pendente', c: WF.warn },
    { cli: 'Pedro Almeida', v: 'R$ 2.400', em: '12/04', vc: '12/04', st: 'Pago', c: WF.pos },
    { cli: 'Juliana Mendes', v: 'R$ 950', em: '15/04', vc: '30/04', st: 'Pendente', c: WF.warn },
  ];
  return (
    <Phone label="09 · Financeiro · Títulos" note="// títulos a receber com filtro de status. swipe = marcar pago.">
      <Header title="Financeiro" subtitle="TÍTULOS A RECEBER" right={<NovoBtn />} />
      <Body>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 6, marginBottom: 12 }}>
          <StatPill label="Pagos" v="R$ 42k" c={WF.pos} n="28 tít." />
          <StatPill label="Pendente" v="R$ 12k" c={WF.warn} n="8 tít." />
          <StatPill label="Vencido" v="R$ 2.1k" c={WF.neg} n="3 tít." />
        </div>
        <div style={{ display: 'flex', gap: 6, marginBottom: 12, overflowX: 'auto' }}>
          {['Não pagos', 'Pendente', 'Vencido', 'Pago', 'Concil.', 'Todos'].map((c, i) => (
            <div key={c} style={{
              flex: '0 0 auto', padding: '5px 10px', borderRadius: 999,
              background: i === 0 ? WF.ink : 'transparent',
              border: `1px solid ${i === 0 ? WF.ink : WF.line}`,
              color: i === 0 ? '#fff' : WF.ink2,
              fontFamily: WF.sans, fontSize: 11, fontWeight: 500,
            }}>{c}</div>
          ))}
        </div>
        {ts.map((t, i) => (
          <Card key={i} pad={12} style={{ marginBottom: 8, background: t.st === 'Vencido' ? '#FDF4F2' : WF.card }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
              <div style={{ fontFamily: WF.sans, fontSize: 13, fontWeight: 500, color: WF.ink }}>{t.cli}</div>
              <Pill label={t.st} color={t.c} bg={`${t.c}15`} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
              <div>
                <Note>EMISSÃO {t.em} · VENC. {t.vc}</Note>
              </div>
              <div style={{ fontFamily: WF.sans, fontSize: 15, fontWeight: 600, color: WF.ink }}>{t.v}</div>
            </div>
          </Card>
        ))}
      </Body>
      <TabBar active="fin" />
    </Phone>
  );
}

function ScreenContasPagar() {
  const ps = [
    { fn: 'Dermocos Distribuidora', d: 'NF 3421 · 2/3', v: 'R$ 1.200', vc: '20/04', st: 'A pagar', c: WF.warn },
    { fn: 'Medsupply Ltda', d: 'NF 8812 · única', v: 'R$ 1.450', vc: '18/04', st: 'A pagar', c: WF.warn },
    { fn: 'Energia SP', d: 'Conta luz abril', v: 'R$ 680', vc: '15/04', st: 'Vencida', c: WF.neg },
    { fn: 'Limpa Tudo EPP', d: 'NF 204', v: 'R$ 340', vc: '28/04', st: 'A pagar', c: WF.warn },
    { fn: 'Farma Distrib. SP', d: 'NF 1102', v: 'R$ 890', vc: '05/04', st: 'Pago', c: WF.pos },
  ];
  return (
    <Phone label="10 · Contas a Pagar" note="// parcelas com centro de custo + fornecedor. tap = pagar.">
      <Header title="Contas a Pagar" subtitle="EM ABERTO R$ 3.670" right={<NovoBtn />} />
      <Body>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 12 }}>
          <StatPill label="A pagar" v="R$ 2.99k" c={WF.warn} n="3 parc." />
          <StatPill label="Vencidas" v="R$ 680" c={WF.neg} n="1 parc." />
        </div>
        {ps.map((p, i) => (
          <Card key={i} pad={12} style={{ marginBottom: 8, background: p.st === 'Vencida' ? '#FDF4F2' : WF.card }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
              <div style={{ fontFamily: WF.sans, fontSize: 13, fontWeight: 500, color: WF.ink }}>{p.fn}</div>
              <Pill label={p.st} color={p.c} bg={`${p.c}15`} />
            </div>
            <Note style={{ marginBottom: 6 }}>{p.d} · VENC. {p.vc}</Note>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ fontFamily: WF.sans, fontSize: 15, fontWeight: 600, color: WF.ink }}>{p.v}</div>
              {p.st !== 'Pago' && (
                <button style={{
                  background: 'transparent', border: `1px solid ${WF.pos}40`,
                  color: WF.pos, padding: '4px 12px', borderRadius: 6,
                  fontFamily: WF.sans, fontSize: 11, fontWeight: 600,
                }}>Pagar</button>
              )}
            </div>
          </Card>
        ))}
      </Body>
      <TabBar active="fin" />
    </Phone>
  );
}

Object.assign(window, { ScreenEstoque, ScreenFornecedores, ScreenFinanceiro, ScreenContasPagar });
