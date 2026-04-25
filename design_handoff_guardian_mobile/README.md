# Handoff: Guardian CRM — Versão Mobile (PWA)

## Overview
Guardian é um CRM multi-tenant (atualmente web, em `github.com/rafaelmonteiro2803/crm-guardian`) usado em clínicas/empresas para gerenciar clientes, vendas, pipeline comercial, ordens de serviço, estoque, fornecedores e financeiro. Este handoff cobre a **versão mobile do produto**, entregue como **PWA (Progressive Web App) instalável** em rotas dedicadas `/m/*` do mesmo codebase existente.

**Primeira entrega (escopo deste handoff):** 6 fluxos principais cobrindo 7 telas — Login, Dashboard, Clientes (lista + detalhe), Pipeline, Vendas e Financeiro (títulos a receber).

## About the Design Files

Os arquivos HTML incluídos neste bundle são **referências de design** — protótipos criados em HTML/React para ilustrar a aparência, estrutura e comportamento desejados. **Não são código de produção para copiar diretamente.**

A tarefa é **recriar estes designs no codebase existente do Guardian CRM** (detectar stack, reusar componentes/rotas/auth já presentes, adicionar o novo módulo mobile `/m/*` como camada dedicada). Se o código atual ainda não tem as abstrações necessárias, crie-as seguindo o padrão já estabelecido no projeto.

> **IMPORTANTE:** Antes de começar, explore o repositório para descobrir:
> - Stack (Next.js? Vite+React? CRA?)
> - Biblioteca de UI (Tailwind? shadcn? CSS modules?)
> - Auth (NextAuth? Supabase? custom JWT?)
> - ORM/DB (Prisma? Drizzle? raw SQL?)
> - Estrutura de rotas existente
> - Componentes reutilizáveis já presentes
>
> Depois, proponha um plano antes de escrever código.

## Fidelity

**Alta fidelidade (hifi).** Mocks têm cores finais, tipografia definida, densidade e spacing precisos. O arquivo `Guardian Mobile HiFi.html` deve ser recriado pixel-perfect usando a biblioteca de UI do projeto (Tailwind classes/tokens equivalentes, ou utility classes customizadas).

O arquivo `Guardian Mobile Wireframes.html` é um complemento **mid-fi**, cobrindo mais telas (Ordens de Serviço, Estoque, Fornecedores, Contas a Pagar) que entrarão em iterações futuras.

---

## Direção Visual

**Direção B — Moderno & Energético**

- Preto profundo (`#0A0A0A`) como tinta/borda principal
- Verde-lima (`#84CC16`) como acento único (ações primárias, highlights de dados)
- Creme off-white (`#FAFAF9`) como background
- Bordas grossas (1.5px), cantos arredondados médios (10–16px), sem sombras exageradas
- Tipografia: **Geist** (sans) + **Geist Mono** (códigos, datas, eyebrow labels)

---

## Design Tokens

```css
/* colors */
--bg:             #FAFAF9;
--surface:        #FFFFFF;
--ink:            #0A0A0A;
--ink-2:          #3F3F3F;
--ink-3:          #737373;
--ink-4:          #A3A3A3;
--line:           #E8E8E6;
--line-2:         #F4F4F2;

--primary:        #0A0A0A;  /* same as ink */
--primary-soft:   #F4F4F2;
--accent:         #84CC16;  /* lime — ações primárias, hero KPIs */
--accent-ink:     #3F6212;

/* semantic */
--pos:            #15803D;  /* verde — pago, concluído */
--pos-soft:       #DCFCE7;
--warn:           #D97706;  /* âmbar — pendente */
--warn-soft:      #FEF3C7;
--neg:            #DC2626;  /* vermelho — vencido, erro */
--neg-soft:       #FEE2E2;
--info:           #0284C7;  /* azul — em atendimento */
--info-soft:      #DBEAFE;
--pink:           #DB2777;  /* rosa — evolução, aniversariantes */
--pink-soft:      #FCE7F3;

/* typography */
--font-sans:      'Geist', 'Inter', -apple-system, sans-serif;
--font-mono:      'Geist Mono', 'JetBrains Mono', ui-monospace, monospace;

/* type scale (mobile) */
--text-hero:      38px / 1 / -1.8px / 700;     /* hero KPIs */
--text-h1:        26px / 1.1 / -0.8px / 700;    /* page titles */
--text-h2:        20px / 1.2 / -0.5px / 700;    /* section hero */
--text-h3:        14px / 1.3 / -0.2px / 700;    /* section labels */
--text-body:      13px / 1.4 / 0 / 500;          /* default */
--text-sm:        12px / 1.4 / 0 / 500;
--text-xs:        11px / 1.4 / 0 / 500;
--text-micro:     10px / 1.4 / 0.5px / 700;     /* UPPERCASE EYEBROW */

/* shape */
--radius-lg:      16px;  /* cards, hero KPIs */
--radius:         10px;  /* inputs, small cards */
--radius-sm:      6px;   /* pills, badges */
--radius-pill:    999px; /* chips de filtro */

/* spacing (8pt base) */
--s-1:            4px;
--s-2:            8px;
--s-3:            12px;
--s-4:            14px;
--s-5:            16px;
--s-6:            20px;
--s-7:            24px;

/* borders */
--border-thick:   1.5px solid var(--ink);  /* cards principais */
--border-thin:    1px solid var(--line);
```

---

## Arquitetura Proposta

### Rotas

- Manter todas as rotas web desktop intactas em `/` , `/clientes`, `/vendas`, etc.
- **Novo módulo mobile em `/m/*`**, com layout dedicado mobile-first:
  - `/m/login` — tela de login
  - `/m/` ou `/m/dashboard` — dashboard
  - `/m/clientes` — lista
  - `/m/clientes/[id]` — detalhe
  - `/m/pipeline` — pipeline
  - `/m/vendas` — vendas
  - `/m/financeiro` — títulos a receber
- **Detecção opcional:** no root `/`, checar `useragent` + viewport. Se mobile, oferecer banner "Abrir versão mobile" (não redirecionar automaticamente — deixar o usuário escolher).

### Layout shell mobile

- **Viewport:** `<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover, maximum-scale=1">`
- **Safe areas:** usar `env(safe-area-inset-*)` no padding de header/tab bar
- **Header sticky:** altura 64px, fundo `--bg`, padding lateral 16-20px. Contém: (back chevron opcional) · título · (ação à direita opcional)
- **Tab bar fixa:** altura 72px, fundo `--surface`, border-top `1px solid --line`, 5 ícones+labels. Active state: background `--accent` no ícone (pill 10px radius, 4×10px padding), label em peso 700.
- **Conteúdo:** `overflow-y: auto`, padding `14px 16px`, bottom padding 20px (a tab bar é separada, não sobrepõe).

### Componentes base a criar

| Componente    | Props                                                                 | Notas |
|---------------|-----------------------------------------------------------------------|-------|
| `<Card>`      | `thick?`, `padding?`, `onClick?`, `variant?: 'accent'│'danger'│'default'`          | Borda 1.5px do `--ink` quando `thick`. Radius `--radius-lg`. |
| `<Button>`    | `kind: 'primary'│'lime'│'ghost'│'danger'│'success'`, `size`, `icon`, `full`  | `primary` = fundo preto, texto branco; `lime` = fundo accent, texto preto, borda preta. |
| `<Pill>`      | `label`, `tone: 'neutral'│'pos'│'warn'│'neg'│'info'│'pink'│'ink'│'accent'`    | Fonte 11px, weight 600, radius 6px, borda colorida sutil. |
| `<Input>`     | `placeholder`, `icon`, `suffix`, `type`                                | Borda 1.5px, radius 10px, padding 11×14px. |
| `<Avatar>`    | `name`, `size`, `bg?`                                                  | Iniciais automáticas. Borda preta 1.5px. |
| `<Header>`    | `title`, `eyebrow?`, `right?`, `back?`, `big?`                         | `big` = hero style com eyebrow mono e h1 26px. |
| `<TabBar>`    | `active: 'home'│'clientes'│'vendas'│'fin'│'mais'`                     | 5 tabs, ícone em pill accent quando active. |
| `<KpiCard>`   | `label`, `value`, `sub?`, `variant?: 'hero'│'default'`                | `hero` = fundo accent, fonte 38px. |
| `<Section>`   | `label`, `right?`                                                      | h3 label + opcional "Ver tudo →" à direita. |

---

## Screens

### 01 · Login (`/m/login`)

- **Layout:** single column, padding 24px lateral, 48px top. Max-width 400px centralizado.
- **Estrutura (top → bottom):**
  1. Logo mark: 56×56 preto com losango lima rotacionado 45° dentro, radius 16px.
  2. H1 "Entrar" (38px, weight 700, letter-spacing -1px).
  3. Subtitle "Guardian CRM" (14px `--ink-3`).
  4. Espaço 40px.
  5. 3 inputs com label uppercase 11px `--ink-2` weight 600:
     - **Empresa** (tenant): dropdown mostrando tenant atual.
     - **Email**: email input.
     - **Senha**: password com suffix "MOSTRAR" clicável.
  6. Espaço 24px.
  7. Button "Entrar" kind=lime, full width, size=lg.
  8. Link "Esqueceu a senha? **Recuperar**" centralizado, 13px.
  9. Footer fixo bottom: "GUARDIAN · V2.0" mono 10px `--ink-4`.
- **Comportamento:**
  - Manter auth existente do sistema (descobrir endpoint no repo).
  - Tenant dropdown deve listar tenants do usuário após email (ou mostrar atual se vindo de cookie).
  - Validação client-side: email formato, senha min 6 caracteres.
  - On submit: loading state no botão (texto "Entrando…"), bloqueia campos.
  - Erros: border `--neg` + mensagem 12px abaixo do campo.

### 02 · Dashboard (`/m/`)

- **Header big:** eyebrow "QUARTA, 17 ABRIL" + h1 "Olá, [Nome]". À direita: botão circular 40×40 com ícone de sino e dot vermelho se houver notificações.
- **Conteúdo:**
  1. **Hero KPI "A Receber"** — card com `background: --accent`, border thick:
     - Label micro `A RECEBER · ABRIL`
     - Valor 38px
     - Pills: "8 TÍTULOS" (tone=ink) + "3 VENCIDOS · R$ 2.180" (tone=neg)
  2. **Grid 2×1 KPIs secundários** — cards brancos thick:
     - "Vendas mês" — valor 22px, sub verde "↑ 24% vs mar"
     - "Pipeline" — valor 22px, sub cinza "6 abertas"
  3. **Section "Hoje"** + "Ver tudo →" — card thick com lista de agendamentos:
     - Hora 52×36 em chip preto com borda (lima no primeiro = próximo agora)
     - Nome cliente 14px bold + serviço 11px cinza
     - Chevron → à direita
  4. **Section "Atendimentos abertos · N"** — cards individuais thick:
     - Código OS mono 10px + nome 13px bold
     - Pill status à direita (Em atendimento / Aguardando)
- **Comportamento:**
  - Pull-to-refresh recarrega KPIs.
  - Tap em cliente da agenda → detalhe do cliente.
  - Tap em atendimento aberto → detalhe da OS.

### 03 · Clientes Lista (`/m/clientes`)

- **Header big:** "Clientes" + eyebrow "247 CADASTRADOS" + Btn "+ Novo" à direita (kind=primary size=sm).
- **Search input** abaixo do header, placeholder "Buscar por nome, CPF, telefone…".
- **Lista de cards thick** (cada cliente):
  - Avatar 40×40 (initials, cor rotativa do palette)
  - Nome + pill opcional (VIP/NOVO)
  - Empresa 12px cinza
  - Telefone mono 11px
  - 2 micro-botões à direita: WhatsApp (verde) + Ligar (preto), 36×36 radius 10px
- **Comportamento:**
  - Swipe left no card → ações: Editar (neutro) · Arquivar (vermelho)
  - Tap no nome → detalhe
  - Tap no WhatsApp → `whatsapp://send?phone=…&text=…` (fallback `https://wa.me/`)
  - Tap em Ligar → `tel:…`
  - Search com debounce 300ms, filtra local + request server-side
  - Paginação infinita ao rolar (20 por vez)

### 04 · Cliente Detalhe (`/m/clientes/[id]`)

- **Header** com back chevron + "Maria A. Souza" + eyebrow "CLIENTE · DESDE MAI/24" + botão "···" à direita.
- **Hero card accent** (thick, bg lima):
  - Avatar 56×56 branco + nome 20px + CPF/idade mono
  - 2 botões lado a lado: Btn lime "WhatsApp" + Btn ghost "Ligar"
- **Mini-stats grid 3×1:** Vendas (8) · Total (R$ 14.2k) · Abertos (2, cor info)
- **Section "Informações"** — card thick com rows: Email · Telefone · Nascimento · Empresa · Cadastro
- **Section "Histórico"** + "Ver tudo →" — card thick com timeline:
  - Data mono à esquerda · descrição + pill de status à direita
- **Comportamento:**
  - "···" abre bottom sheet: Editar · Duplicar · Arquivar · Excluir
  - Tap num item do histórico → rota da entidade (OS, venda, etc.)

### 05 · Pipeline (`/m/pipeline`)

- **Header big:** "Pipeline" + eyebrow "TOTAL · R$ 45.200" + Btn "+ Novo".
- **Chips horizontais** (scroll): Todos · Prospecção · Qualificação · **Proposta** (active=lima) · Negociação · Fechado. Cada chip com count.
- **Lista agrupada por estágio**, cada grupo com Section header "ESTÁGIO · R$ TOTAL":
  - Card thick com: título oportunidade · cliente · valor grande à direita
  - Progress bar horizontal lima com borda preta (% probabilidade)
  - Alerta mono embaixo: "2 DIAS SEM CONTATO" (amarelo) ou "REUNIÃO AMANHÃ" (azul) ou "PROPOSTA ACEITA" (verde)
  - "N% prob." à direita
- **Comportamento:**
  - Chip tap → filtra por estágio (só aquele grupo visível)
  - Tap card → detalhe da oportunidade
  - Swipe left → mover para próximo estágio / swipe right → voltar
  - Long press → bottom sheet: Editar, Mover para…, Marcar ganho, Marcar perdido

### 06 · Vendas (`/m/vendas`)

- **Header big:** "Vendas" + eyebrow "ABRIL" + Btn "+ Nova".
- **Hero card accent:** Label "TOTAL MÊS" + valor 32px + sub "12 vendas · Ticket médio R$ 2.408"
- **Chips:** Todas (active) · Pagas · Pendentes · Vencidas
- **Cards thick por venda:**
  - Topo: data mono + pill status
  - Bottom: nome + descrição 11px + valor 17px à direita
- **Comportamento:**
  - Chip filtra status
  - Tap → detalhe da venda (parcelas, títulos financeiros associados)
  - Swipe left → Registrar pagamento / Ver títulos

### 07 · Financeiro — Títulos (`/m/financeiro`)

- **Header big:** "Financeiro" + eyebrow "TÍTULOS · ABRIL" + Btn "+ Novo".
- **Grid 3×1 de cards thick:**
  - Pagos (R$ 42k, valor verde)
  - Pendente (R$ 12k, valor preto)
  - Vencido (R$ 2.1k, bg `--neg-soft`, valor vermelho)
- **Chips:** Todos · Hoje · Vencidos · Esta semana · Pagos
- **Lista de títulos** — cards thick, card "Vencido" com bg `--neg-soft`:
  - Topo: nome cliente + pill status
  - Bottom: "VENC. DD/MM" mono + valor 17px
- **Comportamento:**
  - Swipe left → Marcar pago / Registrar pagamento parcial / Enviar cobrança WhatsApp
  - Tap → detalhe do título (forma de pagamento, parcelas, anexos)
  - "+ Novo" abre bottom sheet com form de novo título

---

## Interactions & Behavior

### Navegação
- Transições de rota: fade 150ms ease-out
- Back gesture (iOS Safari PWA): suportar nativamente via history.back()
- Deep links: `/m/clientes/[id]`, `/m/vendas/[id]`, etc. devem abrir direto quando PWA é instalado

### Swipe actions
- Implementar com biblioteca existente ou manual (touch events). Threshold: 40% da largura do card.
- Ações reveladas ficam atrás do card, com cores plenas (verde pagar, vermelho excluir, etc.)
- Tap fora fecha o swipe.

### Quick actions WhatsApp/Ligação
- **WhatsApp:** `whatsapp://send?phone=55${telLimpo}&text=${encoded}` — fallback `https://wa.me/55${telLimpo}?text=${encoded}`
- **Ligar:** `tel:+55${telLimpo}`
- Sempre validar número antes (regex BR). Se inválido, toast "Telefone inválido".

### Share API (nativo)
- Botão "Compartilhar" em detalhe de cliente / venda usa `navigator.share({ title, text, url })`
- Fallback: copia URL para clipboard + toast "Link copiado"

### Câmera (PWA)
- Em Evolução de OS (fase futura) e uploads de anexo: `<input type="file" accept="image/*" capture="environment">` ou `navigator.mediaDevices.getUserMedia`
- Preview antes de enviar. Compressão client-side (canvas) para max 1920px.

### Estados (loading / erro / vazio)
- **Loading:** skeleton bars (retângulos `--line-2` com shimmer animation 1.5s).
- **Erro:** card thick vermelho com mensagem + botão "Tentar novamente".
- **Vazio:** ilustração simples (placeholder textual) + headline 18px + CTA "+ Criar primeiro [entidade]".

---

## PWA Setup

### Manifest (`/manifest.json`)

```json
{
  "name": "Guardian CRM",
  "short_name": "Guardian",
  "description": "CRM de gestão — versão mobile",
  "start_url": "/m/",
  "scope": "/m/",
  "display": "standalone",
  "orientation": "portrait",
  "background_color": "#FAFAF9",
  "theme_color": "#0A0A0A",
  "icons": [
    { "src": "/icons/icon-192.png", "sizes": "192x192", "type": "image/png", "purpose": "any" },
    { "src": "/icons/icon-512.png", "sizes": "512x512", "type": "image/png", "purpose": "any" },
    { "src": "/icons/icon-maskable-512.png", "sizes": "512x512", "type": "image/png", "purpose": "maskable" }
  ],
  "shortcuts": [
    { "name": "Nova venda", "url": "/m/vendas/nova" },
    { "name": "Agenda hoje", "url": "/m/#agenda" },
    { "name": "Financeiro", "url": "/m/financeiro" }
  ]
}
```

### Service Worker (background sync + push)
- Usar **Workbox** (ou biblioteca equivalente no ecossistema detectado).
- **Strategies:**
  - HTML/JS/CSS → StaleWhileRevalidate
  - API GET → NetworkFirst com timeout 3s + fallback cache
  - API POST/PUT/DELETE → BackgroundSync queue (retry quando reconectar)
  - Imagens → CacheFirst com max-age 7 dias
- **Push notifications:** registrar com VAPID keys. Casos:
  - Nova OS atribuída ao usuário
  - Título venceu hoje
  - Pagamento recebido
- Pedir permissão somente após primeira ação relevante (não no primeiro load).

### Install prompt
- Capturar `beforeinstallprompt` e mostrar banner custom após 2 sessões OU ação explícita do usuário.

### Meta tags iOS
```html
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="default">
<meta name="apple-mobile-web-app-title" content="Guardian">
<link rel="apple-touch-icon" href="/icons/apple-touch-icon.png">
```

---

## State Management

Manter/reusar o que já existe no repo. Se nada, sugestão:
- **TanStack Query** para cache de dados server (lista de clientes, vendas, títulos)
- **Zustand** para UI state (tenant atual, tab ativa, filtros)
- **localStorage** para: tenant selecionado, último login email, prefs de filtro.

Todas as mutations devem ser **optimistic** (atualizam UI imediato, revertem em erro) — especialmente swipe actions.

---

## Accessibility Mobile

- Hit targets mínimos 44×44px (tab bar, botões, micro-actions)
- Contraste AAA em texto crítico (valores financeiros, status)
- `role`, `aria-label` em todos botões de ícone
- Focus visible (outline lima 2px) quando navegação por teclado
- `prefers-reduced-motion` respeitado (desabilitar transições)
- Testar com VoiceOver/TalkBack em pelo menos 2 fluxos (login + nova venda)

---

## Checklist de Implementação

### Fase 0 · Setup
- [ ] Explorar repo, identificar stack, auth, DB, rotas
- [ ] Propor plano detalhado antes de codar
- [ ] Adicionar Geist fonts no projeto (Google Fonts ou `@vercel/font`)
- [ ] Criar arquivo de tokens mobile (CSS vars ou config Tailwind)
- [ ] Configurar manifest.json + icons (pedir ao usuário os PNGs oficiais se não existirem)
- [ ] Configurar service worker base (Workbox ou similar)

### Fase 1 · Shell
- [ ] Criar layout `/m/*` com header + tab bar
- [ ] Componentes base: `<Card>`, `<Button>`, `<Pill>`, `<Input>`, `<Avatar>`, `<Header>`, `<TabBar>`, `<Section>`
- [ ] Rota de login `/m/login` integrada ao auth existente
- [ ] Guards de rota (redireciona `/m/*` para `/m/login` se não autenticado)

### Fase 2 · Fluxos (ordem sugerida)
- [ ] Dashboard `/m/` — consome endpoints existentes de KPIs + agenda
- [ ] Clientes lista + detalhe
- [ ] Pipeline
- [ ] Vendas
- [ ] Financeiro (títulos a receber)

### Fase 3 · PWA features
- [ ] Install prompt custom
- [ ] Push notifications (com permissão progressiva)
- [ ] Background sync para mutations
- [ ] Deep linking configurado
- [ ] Share API + navigator.share fallbacks
- [ ] Camera API (preparar para fase de OS/evolução)

### Fase 4 · Polimento
- [ ] Skeletons / loading states em todas as telas
- [ ] Estados de erro e vazio
- [ ] Swipe actions em Clientes, Vendas, Financeiro
- [ ] Testes de acessibilidade
- [ ] Lighthouse PWA score ≥ 90

---

## Files

Pasta `design/` contém:
- **`Guardian Mobile HiFi.html`** — 7 telas hi-fi na Direção B (referência principal para visual/interação). Abra em navegador e use DevTools pra inspecionar cores e spacing exatos.
- **`Guardian Mobile Wireframes.html`** — 10 telas mid-fi (inclui Ordens de Serviço, Estoque, Fornecedores, Contas a Pagar — para fases futuras).
- **`Guardian Direcoes Visuais.html`** — comparativo das 3 direções estéticas exploradas (referência; a Direção B foi a escolhida).
- **`hifi/`** — componentes e telas React (JSX) usadas nos mocks hi-fi. Servem como referência de estrutura/props dos componentes.
- **`wireframes/`** — componentes dos wireframes mid-fi.

---

## Observações

- Backend: reusar endpoints existentes do CRM web. Se algum não existir para mobile (ex: KPIs agregados), criar no padrão do projeto.
- Multi-tenant: o `tenant_id` deve estar em header/cookie em todas as requisições, igual ao web.
- Offline: títulos e vendas salvos offline entram em fila (IndexedDB) e são sincronizados quando conexão volta.
- **Não reimplementar auth** — integrar ao existente.
- Perguntar ao usuário os assets oficiais (logo em alta resolução, favicon, ícones PWA 192/512/maskable) antes de usar placeholders.

---

*Gerado a partir de sessão de design em abril/2026. Os designs são iterativos — se algo não fizer sentido no código real, propor ajuste e validar antes de implementar.*
