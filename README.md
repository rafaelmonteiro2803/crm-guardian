# CRM Completo com Supabase

## 📦 Conteúdo desta Pasta

Esta pasta contém **TODOS os arquivos** necessários para rodar o CRM completo.

### Estrutura de Arquivos:

```
crm-app-completo/
├── package.json          ← Dependências do projeto
├── vite.config.js        ← Configuração do Vite
├── tailwind.config.js    ← Configuração do Tailwind CSS
├── postcss.config.js     ← Configuração do PostCSS
├── index.html            ← HTML principal
├── .gitignore            ← Arquivos ignorados pelo Git
├── .env.example          ← Exemplo de variáveis de ambiente
├── README.md             ← Este arquivo
└── src/
    ├── main.jsx          ← Entry point da aplicação
    ├── index.css         ← Estilos globais
    └── App.jsx           ← CRM COMPLETO (todas funcionalidades)
```

---

## ✨ Funcionalidades Incluídas no App.jsx

### 🔐 Autenticação
- ✅ Login com email e senha
- ✅ Cadastro de novos usuários
- ✅ Logout
- ✅ Proteção de rotas
- ✅ Sessões gerenciadas pelo Supabase

### 📊 Dashboard
- ✅ Visão geral com indicadores
- ✅ Total de clientes
- ✅ Oportunidades (valor total + taxa de conversão)
- ✅ Vendas totais e do mês
- ✅ Financeiro (a receber, recebido, vencido)

### 👥 Módulo de Clientes
- ✅ Listar todos os clientes
- ✅ Adicionar novo cliente
- ✅ Editar cliente existente
- ✅ Excluir cliente
- ✅ Campos: Nome, Email, Telefone, Empresa, Observações

### 📈 Pipeline de Vendas
- ✅ Visualização em Kanban
- ✅ 5 estágios: Prospecção → Qualificação → Proposta → Negociação → Fechado
- ✅ Mover oportunidades entre estágios
- ✅ Adicionar nova oportunidade
- ✅ Editar oportunidade
- ✅ Excluir oportunidade
- ✅ Totalização por estágio

### 🛒 Módulo de Vendas
- ✅ Listar todas as vendas
- ✅ Registrar nova venda
- ✅ Editar venda
- ✅ Excluir venda
- ✅ Campos: Cliente, Descrição, Valor, Data, Forma de Pagamento, Observações
- ✅ Visualização em tabela

### 💰 Módulo Financeiro
- ✅ Gestão de títulos a receber
- ✅ Adicionar novo título
- ✅ Editar título
- ✅ Excluir título
- ✅ Marcar como pago
- ✅ Status: Pendente, Pago, Vencido
- ✅ Resumo: Total pago, a receber, vencido
- ✅ Destaque visual para títulos vencidos

---

## 🚀 Como Usar

### 1. Pré-requisitos
- Node.js instalado (v16 ou superior)
- Conta no Supabase com projeto configurado
- SQL do banco executado

### 2. Instalação Local

```bash
# Navegar até a pasta
cd crm-app-completo

# Instalar dependências
npm install

# Criar arquivo .env (copiar do .env.example)
cp .env.example .env

# Editar .env e adicionar suas credenciais do Supabase
# VITE_SUPABASE_URL=https://xxx.supabase.co
# VITE_SUPABASE_ANON_KEY=eyJxxx...

# Rodar em desenvolvimento
npm run dev
```

### 3. Deploy no Replit

1. Fazer upload de todos estes arquivos no Replit
2. Configurar Secrets:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
3. No terminal: `npm install`
4. No terminal: `npm run dev`
5. Abrir preview

### 4. Deploy no GitHub + Replit

1. Criar repositório no GitHub
2. Upload destes arquivos
3. No Replit: Import from GitHub
4. Configurar Secrets
5. `npm install && npm run dev`

---

## 🗄️ Banco de Dados Supabase

### Tabelas Necessárias:
- **clientes** - Cadastro de clientes
- **oportunidades** - Pipeline de vendas
- **vendas** - Vendas realizadas
- **titulos** - Títulos financeiros

### Como Configurar:
1. Execute o SQL do arquivo `supabase-schema.sql`
2. Verifique se Row Level Security está habilitado
3. Confirme que as políticas foram criadas

---

## 🔒 Segurança

- ✅ Credenciais NUNCA no código
- ✅ Uso de variáveis de ambiente
- ✅ Row Level Security no Supabase
- ✅ Cada usuário vê apenas seus dados
- ✅ Autenticação completa

---

## 📝 Tecnologias

- **React 18** - Framework UI
- **Vite** - Build tool
- **Tailwind CSS** - Estilos
- **Lucide React** - Ícones
- **Supabase** - Backend + Auth + Database
- **PostgreSQL** - Banco de dados

---

## 🐛 Problemas Comuns

### Erro: "Cannot read environment variables"
- Verifique se as variáveis estão configuradas
- Nomes devem ser exatamente: `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY`

### Erro: "Module not found"
- Execute: `npm install`

### Dados não salvam
- Verifique conexão com Supabase
- Confirme que o SQL foi executado
- Verifique Row Level Security

---

## 📞 Suporte

Consulte os guias:
- `INSTRUCOES-SUPABASE.md` - Configuração do banco
- `DEPLOY-REPLIT.md` - Deploy no Replit
- `DEPLOY-GITHUB-REPLIT.md` - Deploy com GitHub

---

## 🎉 Pronto!

Todos os arquivos estão aqui e prontos para uso!
