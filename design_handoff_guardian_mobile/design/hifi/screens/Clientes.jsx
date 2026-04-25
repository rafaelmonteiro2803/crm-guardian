// HI-FI · Clientes (lista + detalhe)

function HifiClientesLista() {
  const cs = [
    { n: 'Maria Aparecida Souza', emp: 'Autônoma', tel: '(11) 98432-1100', tag: 'VIP', tagTone: 'accent' },
    { n: 'Carlos Eduardo Pinto', emp: 'Pinto Engenharia', tel: '(11) 97655-2288' },
    { n: 'Juliana Mendes', emp: '—', tel: '(11) 96543-7700', tag: 'NOVO', tagTone: 'info' },
    { n: 'Pedro Almeida', emp: 'Almeida & Co.', tel: '(11) 98877-3344' },
    { n: 'Ana Paula Ribeiro', emp: 'AR Studio', tel: '(11) 99112-4455' },
    { n: 'Roberto Dias', emp: '—', tel: '(11) 97788-9900' },
    { n: 'Camila Rocha', emp: 'Rocha Advogados', tel: '(11) 96677-1122' },
  ];
  const bgs = [T.accent, T.infoSoft, T.pinkSoft, T.posSoft, T.warnSoft, T.line2, T.accent];
  return (
    <Phone label="03 · CLIENTES · LISTA" note="Swipe pro lado = quick actions (WhatsApp, Ligar, Editar).">
      <Header
        title="Clientes"
        eyebrow="247 CADASTRADOS"
        big
        right={<Btn label="Novo" kind="primary" icon={<PlusIcon />} size="sm" />}
      />
      <div style={{ padding: '0 16px 10px', background: T.bg }}>
        <Input ph="Buscar por nome, CPF, telefone…" icon={<SearchIcon />} />
      </div>
      <Body pad={false} style={{ padding: '6px 16px 20px' }}>
        {cs.map((c, i) => (
          <Card key={i} thick pad={12} style={{ marginBottom: 8 }}>
            <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
              <Avatar name={c.n} bg={bgs[i]} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', gap: 6, alignItems: 'center', marginBottom: 2 }}>
                  <div style={{ fontFamily: T.font, fontSize: 14, fontWeight: 600, color: T.ink, letterSpacing: -0.2 }}>{c.n}</div>
                  {c.tag && <Pill label={c.tag} tone={c.tagTone} size={9} />}
                </div>
                <div style={{ fontFamily: T.font, fontSize: 12, color: T.ink3 }}>{c.emp}</div>
                <div style={{ fontFamily: T.mono, fontSize: 11, color: T.ink2, marginTop: 2 }}>{c.tel}</div>
              </div>
              <div style={{ display: 'flex', gap: 4 }}>
                <MicroBtn icon="wa" c={T.pos} />
                <MicroBtn icon="call" c={T.ink} />
              </div>
            </div>
          </Card>
        ))}
      </Body>
      <TabBar active="clientes" />
    </Phone>
  );
}

function HifiClienteDetalhe() {
  return (
    <Phone label="04 · CLIENTE · DETALHE" note="Header hero + ações primárias + timeline de histórico.">
      <Header title="Maria A. Souza" eyebrow="CLIENTE · DESDE MAI/24" back right={
        <div style={{ width: 32, height: 32, borderRadius: 10, border: `1.5px solid ${T.line}`, background: T.surface, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg width="16" height="4" viewBox="0 0 16 4"><circle cx="2" cy="2" r="1.5" fill={T.ink}/><circle cx="8" cy="2" r="1.5" fill={T.ink}/><circle cx="14" cy="2" r="1.5" fill={T.ink}/></svg>
        </div>
      } />
      <Body>
        {/* Hero profile */}
        <Card thick style={{ background: T.accent, marginBottom: 10, padding: 18 }}>
          <div style={{ display: 'flex', gap: 14, alignItems: 'center', marginBottom: 14 }}>
            <Avatar name="Maria Aparecida" size={56} bg={T.surface} />
            <div>
              <div style={{ fontFamily: T.font, fontSize: 20, fontWeight: 700, color: T.ink, letterSpacing: -0.5 }}>Maria Aparecida</div>
              <div style={{ fontFamily: T.mono, fontSize: 11, color: T.ink, opacity: 0.7, fontWeight: 600 }}>CPF 123.456.789-00 · 42 ANOS</div>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            <Btn label="WhatsApp" kind="primary" full size="md" icon={
              <svg width="14" height="14" viewBox="0 0 14 14" fill="#fff"><path d="M7 .5A6.5 6.5 0 00.8 10.2L0 14l4-.8A6.5 6.5 0 107 .5z"/></svg>
            } />
            <Btn label="Ligar" kind="ghost" full size="md" icon={
              <svg width="14" height="14" viewBox="0 0 14 14"><path d="M2 2l2 2-1 2a8 8 0 004 4l2-1 2 2-1.5 1.5c-3 1-8-4-7-7L2 2z" stroke={T.ink} strokeWidth="1.5" fill="none" strokeLinejoin="round"/></svg>
            } />
          </div>
        </Card>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 6, marginBottom: 6 }}>
          <MiniStat l="Vendas" v="8" />
          <MiniStat l="Total" v="R$ 14.2k" />
          <MiniStat l="Abertos" v="2" c={T.info} />
        </div>

        <Section label="Informações" />
        <Card thick pad={0}>
          {[
            ['Email', 'maria.souza@email.com'],
            ['Telefone', '(11) 98432-1100'],
            ['Nascimento', '18/04/1983'],
            ['Empresa', 'Autônoma'],
            ['Cadastro', '12/05/2024'],
          ].map(([k, v], i) => (
            <div key={i} style={{
              display: 'flex', padding: '12px 14px', justifyContent: 'space-between',
              borderTop: i ? `1px solid ${T.line}` : 'none',
            }}>
              <span style={{ fontFamily: T.font, fontSize: 13, color: T.ink3 }}>{k}</span>
              <span style={{ fontFamily: T.font, fontSize: 13, color: T.ink, fontWeight: 500 }}>{v}</span>
            </div>
          ))}
        </Card>

        <Section label="Histórico" right={<SeeMore />} />
        <Card thick pad={0}>
          {[
            { d: '17/04', t: 'OS-00142 · Consulta de avaliação', st: 'Em atendimento', tone: 'info' },
            { d: '02/04', t: 'Venda · R$ 1.800 · Pacote 4 sessões', st: 'Concluída', tone: 'pos' },
            { d: '15/03', t: 'OS-00138 · Sessão fisioterapia', st: 'Concluída', tone: 'neutral' },
            { d: '01/03', t: 'Oportunidade · Pacote anual', st: 'Negociação', tone: 'warn' },
          ].map((h, i) => (
            <div key={i} style={{
              display: 'flex', gap: 12, padding: '12px 14px',
              borderTop: i ? `1px solid ${T.line}` : 'none',
            }}>
              <div style={{ width: 38, fontFamily: T.mono, fontSize: 11, color: T.ink3, fontWeight: 600 }}>{h.d}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: T.font, fontSize: 13, color: T.ink, fontWeight: 500, marginBottom: 3 }}>{h.t}</div>
                <Pill label={h.st} tone={h.tone} size={10} />
              </div>
            </div>
          ))}
        </Card>
      </Body>
    </Phone>
  );
}

function MicroBtn({ icon, c }) {
  return (
    <div style={{
      width: 36, height: 36, borderRadius: 10,
      background: c === T.pos ? T.posSoft : T.line2,
      border: `1.5px solid ${c === T.pos ? c : T.ink}`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      {icon === 'wa' ? (
        <svg width="16" height="16" viewBox="0 0 14 14" fill={c}><path d="M7 .5A6.5 6.5 0 00.8 10.2L0 14l4-.8A6.5 6.5 0 107 .5z"/></svg>
      ) : (
        <svg width="14" height="14" viewBox="0 0 14 14"><path d="M2 2l2 2-1 2a8 8 0 004 4l2-1 2 2-1.5 1.5c-3 1-8-4-7-7L2 2z" stroke={c} strokeWidth="1.5" fill="none" strokeLinejoin="round"/></svg>
      )}
    </div>
  );
}

function MiniStat({ l, v, c = T.ink }) {
  return (
    <Card thick pad={10} style={{ textAlign: 'center' }}>
      <div style={{ fontFamily: T.font, fontSize: 10, color: T.ink3, fontWeight: 700, letterSpacing: 0.4, textTransform: 'uppercase' }}>{l}</div>
      <div style={{ fontFamily: T.font, fontSize: 17, fontWeight: 700, color: c, marginTop: 2, letterSpacing: -0.3 }}>{v}</div>
    </Card>
  );
}

Object.assign(window, { HifiClientesLista, HifiClienteDetalhe, MicroBtn, MiniStat });
