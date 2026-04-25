// Screen 3: Clientes — lista + detalhe (2 variações)
function ScreenClientesA() {
  const clientes = [
    { n: 'Maria Aparecida Souza', tel: '(11) 98432-1100', emp: 'Autônoma', cpf: '123.456.789-00' },
    { n: 'Carlos Eduardo Pinto', tel: '(11) 97655-2288', emp: 'Pinto Engenharia', cpf: '234.567.890-11' },
    { n: 'Juliana Mendes', tel: '(11) 96543-7700', emp: '—', cpf: '345.678.901-22' },
    { n: 'Pedro Almeida', tel: '(11) 98877-3344', emp: 'Almeida & Co.', cpf: '456.789.012-33' },
    { n: 'Ana Paula Ribeiro', tel: '(11) 99112-4455', emp: 'AR Studio', cpf: '567.890.123-44' },
    { n: 'Roberto Dias', tel: '(11) 97788-9900', emp: '—', cpf: '678.901.234-55' },
    { n: 'Camila Rocha', tel: '(11) 96677-1122', emp: 'Rocha Advogados', cpf: '789.012.345-66' },
  ];
  return (
    <Phone label="03a · Clientes · cards" note="// lista em cards com ações de contato inline. swipe left = editar/excluir.">
      <Header title="Clientes" subtitle="247 CADASTRADOS" right={<NovoBtn />} />
      <div style={{ padding: '10px 16px 8px', background: WF.bg, borderBottom: `1px solid ${WF.line2}` }}>
        <div style={{
          background: WF.card, border: `1px solid ${WF.line}`, borderRadius: 8,
          padding: '8px 12px', display: 'flex', alignItems: 'center', gap: 8,
        }}>
          <svg width="14" height="14" viewBox="0 0 14 14"><circle cx="6" cy="6" r="4.5" stroke={WF.ink3} strokeWidth="1.5" fill="none"/><path d="M10 10l3 3" stroke={WF.ink3} strokeWidth="1.5" strokeLinecap="round"/></svg>
          <div style={{ flex: 1, fontFamily: WF.sans, fontSize: 13, color: WF.ink3 }}>Buscar por nome, CPF, telefone…</div>
        </div>
      </div>
      <Body pad={false} style={{ padding: '8px 16px 90px' }}>
        {clientes.map((c, i) => (
          <Card key={i} pad={12} style={{ marginBottom: 8 }}>
            <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
              <Ph w={38} h={38} r={19} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontFamily: WF.sans, fontSize: 14, fontWeight: 500, color: WF.ink }}>{c.n}</div>
                <div style={{ display: 'flex', gap: 8, fontFamily: WF.mono, fontSize: 10, color: WF.ink3, marginTop: 2 }}>
                  <span>{c.cpf}</span>
                  <span>·</span>
                  <span>{c.emp}</span>
                </div>
                <div style={{ fontFamily: WF.sans, fontSize: 12, color: WF.ink2, marginTop: 3 }}>{c.tel}</div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <IconBtn kind="wa" />
                <IconBtn kind="call" />
              </div>
            </div>
          </Card>
        ))}
      </Body>
      <TabBar active="vendas" />
    </Phone>
  );
}

function ScreenClientesB() {
  return (
    <Phone label="03b · Cliente · detalhe" note="// timeline de atividades + métricas + ações. pull-to-call/whatsapp.">
      <Header title="Maria A. Souza" subtitle="CLIENTE · DESDE MAI/24" back right={<Note>···</Note>} />
      <Body>
        {/* Contato */}
        <Card pad={14} style={{ marginBottom: 12 }}>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 12 }}>
            <Ph w={54} h={54} r={27} />
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: WF.sans, fontSize: 15, fontWeight: 600, color: WF.ink }}>Maria Aparecida Souza</div>
              <div style={{ fontFamily: WF.mono, fontSize: 10, color: WF.ink3 }}>CPF 123.456.789-00 · 42 anos</div>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            <ActionBtn label="WhatsApp" c={WF.pos} />
            <ActionBtn label="Ligar" c={WF.info} />
          </div>
        </Card>

        {/* KPIs cliente */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 6, marginBottom: 12 }}>
          <MiniStat l="VENDAS" v="8" />
          <MiniStat l="TOTAL" v="R$ 14.2k" />
          <MiniStat l="ABERTOS" v="2" />
        </div>

        {/* Info */}
        <Section label="INFORMAÇÕES" />
        <Card pad={0} style={{ overflow: 'hidden', marginBottom: 12 }}>
          {[
            ['Email', 'maria.souza@email.com'],
            ['Telefone', '(11) 98432-1100'],
            ['Nascimento', '18/04/1983'],
            ['Empresa', 'Autônoma'],
            ['Cadastro', '12/05/2024'],
          ].map(([k, v], i) => (
            <div key={i} style={{
              display: 'flex', padding: '10px 14px', justifyContent: 'space-between',
              borderTop: i ? `1px solid ${WF.line2}` : 'none',
            }}>
              <span style={{ fontFamily: WF.sans, fontSize: 12, color: WF.ink3 }}>{k}</span>
              <span style={{ fontFamily: WF.sans, fontSize: 13, color: WF.ink }}>{v}</span>
            </div>
          ))}
        </Card>

        <Section label="HISTÓRICO" right={<Note style={{ color: WF.accent }}>TUDO ›</Note>} />
        <Card pad={0} style={{ overflow: 'hidden' }}>
          {[
            { d: '17/04', t: 'OS-00142 · Consulta de avaliação', c: WF.info, s: 'Em atendimento' },
            { d: '02/04', t: 'Venda · R$ 1.800 · Pacote 4 sessões', c: WF.pos, s: 'Concluída' },
            { d: '15/03', t: 'OS-00138 · Sessão fisioterapia', c: WF.ink3, s: 'Concluída' },
            { d: '01/03', t: 'Oportunidade · Pacote anual', c: WF.warn, s: 'Negociação' },
          ].map((h, i) => (
            <div key={i} style={{
              display: 'flex', gap: 12, padding: '11px 14px',
              borderTop: i ? `1px solid ${WF.line2}` : 'none',
            }}>
              <div style={{ width: 36, fontFamily: WF.mono, fontSize: 10, color: WF.ink3 }}>{h.d}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: WF.sans, fontSize: 12, color: WF.ink }}>{h.t}</div>
                <Pill label={h.s} color={h.c} bg={`${h.c}15`} />
              </div>
            </div>
          ))}
        </Card>
      </Body>
    </Phone>
  );
}

function IconBtn({ kind }) {
  const s = kind === 'wa' ? WF.pos : WF.info;
  return (
    <div style={{
      width: 32, height: 32, borderRadius: 8, border: `1px solid ${s}40`,
      background: `${s}10`, display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      {kind === 'wa' ? (
        <svg width="14" height="14" viewBox="0 0 14 14" fill={s}><path d="M7 .5A6.5 6.5 0 00.8 10.2L0 14l4-.8A6.5 6.5 0 107 .5zm0 11.8a5.3 5.3 0 01-2.7-.7l-.2-.1-2.4.5.5-2.3-.1-.2A5.3 5.3 0 1112.3 7 5.3 5.3 0 017 12.3z"/></svg>
      ) : (
        <svg width="14" height="14" viewBox="0 0 14 14"><path d="M2 2l2 2-1 2a8 8 0 004 4l2-1 2 2-1.5 1.5c-3 1-8-4-7-7L2 2z" stroke={s} strokeWidth="1.3" fill="none" strokeLinejoin="round"/></svg>
      )}
    </div>
  );
}

function ActionBtn({ label, c }) {
  return (
    <button style={{
      background: `${c}12`, border: `1px solid ${c}40`, color: c,
      padding: '9px', borderRadius: 8, fontFamily: WF.sans, fontSize: 12, fontWeight: 600,
    }}>{label}</button>
  );
}

function MiniStat({ l, v }) {
  return (
    <Card pad={10} style={{ textAlign: 'center' }}>
      <Note>{l}</Note>
      <div style={{ fontFamily: WF.sans, fontSize: 15, fontWeight: 600, color: WF.ink, marginTop: 2 }}>{v}</div>
    </Card>
  );
}

Object.assign(window, { ScreenClientesA, ScreenClientesB, IconBtn, ActionBtn, MiniStat });
