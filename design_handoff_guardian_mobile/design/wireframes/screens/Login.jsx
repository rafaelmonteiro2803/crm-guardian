// Screen 1: Login / Seleção de Tenant
function ScreenLogin() {
  return (
    <Phone label="01 · Login & Tenant" note="// seleção de tenant + email/senha. padrão do sistema atual, otimizado para mobile.">
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '32px 24px', background: WF.bg }}>
        {/* Logo area */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: 40, marginBottom: 40 }}>
          <div style={{
            width: 72, height: 72, borderRadius: 18, background: WF.ink,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: WF.sans, fontWeight: 700, fontSize: 28, color: '#fff',
            marginBottom: 16,
          }}>G</div>
          <div style={{ fontFamily: WF.sans, fontSize: 22, fontWeight: 600, color: WF.ink }}>Guardian CRM</div>
          <div style={{ fontFamily: WF.mono, fontSize: 11, color: WF.ink3, marginTop: 4 }}>Sistema de Gestão</div>
        </div>

        {/* Tenant selector */}
        <div style={{ marginBottom: 14 }}>
          <Note style={{ marginBottom: 6 }}>TENANT</Note>
          <div style={{
            background: WF.card, border: `1px solid ${WF.line}`, borderRadius: 10,
            padding: '12px 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          }}>
            <div style={{ fontFamily: WF.sans, fontSize: 14, color: WF.ink }}>Clínica São Lucas</div>
            <svg width="10" height="6" viewBox="0 0 10 6"><path d="M1 1l4 4 4-4" stroke={WF.ink3} strokeWidth="1.5" fill="none" strokeLinecap="round"/></svg>
          </div>
        </div>

        {/* Email */}
        <div style={{ marginBottom: 14 }}>
          <Note style={{ marginBottom: 6 }}>EMAIL</Note>
          <div style={{
            background: WF.card, border: `1px solid ${WF.line}`, borderRadius: 10,
            padding: '12px 14px', fontFamily: WF.sans, fontSize: 14, color: WF.ink3,
          }}>rafael@saolucas.com.br</div>
        </div>

        {/* Senha */}
        <div style={{ marginBottom: 22 }}>
          <Note style={{ marginBottom: 6 }}>SENHA</Note>
          <div style={{
            background: WF.card, border: `1px solid ${WF.line}`, borderRadius: 10,
            padding: '12px 14px', display: 'flex', justifyContent: 'space-between',
          }}>
            <div style={{ fontFamily: WF.sans, fontSize: 14, color: WF.ink3, letterSpacing: 4 }}>••••••••</div>
            <Note>MOSTRAR</Note>
          </div>
        </div>

        {/* Login button */}
        <button style={{
          background: WF.ink, color: '#fff', border: 'none', padding: '14px',
          borderRadius: 12, fontFamily: WF.sans, fontSize: 15, fontWeight: 600,
          marginBottom: 14, cursor: 'pointer',
        }}>Entrar</button>

        <div style={{
          textAlign: 'center', fontFamily: WF.sans, fontSize: 13, color: WF.ink3,
        }}>Não tem conta? <span style={{ color: WF.accent, fontWeight: 500 }}>Criar uma</span></div>

        <div style={{ flex: 1 }} />
        <div style={{
          textAlign: 'center', fontFamily: WF.mono, fontSize: 10, color: WF.ink4,
          letterSpacing: 1, paddingBottom: 20,
        }}>v2.0 · mobile</div>
      </div>
    </Phone>
  );
}

window.ScreenLogin = ScreenLogin;
