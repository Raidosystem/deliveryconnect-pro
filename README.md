# 🏍️ DeliveryConnect Pro

Sistema completo de gerenciamento de entregas com rastreamento GPS em tempo real, desenvolvido com React, TypeScript, Supabase e Vercel.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![React](https://img.shields.io/badge/React-19-61dafb.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178c6.svg)
![Supabase](https://img.shields.io/badge/Supabase-Latest-3ecf8e.svg)

## ✨ Funcionalidades

### 🏪 Para Comércios
- ✅ Gerenciamento completo de entregas
- ✅ Rastreamento em tempo real de motoboys
- ✅ Geração de QR Codes para autorização
- ✅ Chat integrado com entregadores
- ✅ Dashboard com estatísticas
- ✅ Histórico de entregas
- ✅ Notificações em tempo real

### 🏍️ Para Motoboys
- ✅ Lista de entregas disponíveis
- ✅ Aceitar/recusar entregas
- ✅ Scanner de QR Code
- ✅ GPS em tempo real (compartilhamento de localização)
- ✅ Chat com o comércio
- ✅ Histórico de entregas realizadas
- ✅ Estatísticas de desempenho

### 🔐 Sistema de Autenticação
- ✅ Login/Registro seguro
- ✅ Dois tipos de usuário (Comércio/Motoboy)
- ✅ Recuperação de senha
- ✅ Sessões persistentes

## 🚀 Stack Tecnológica

### Frontend
- **React 19** - Framework UI
- **TypeScript 5.7** - Type safety
- **Vite 6.3** - Build tool ultra-rápido
- **Tailwind CSS 4** - Estilização moderna
- **Radix UI** - Componentes acessíveis

### Backend & Database
- **Supabase** - Backend-as-a-Service
  - PostgreSQL + PostGIS (geolocalização)
  - Authentication
  - Realtime subscriptions
  - Row Level Security (RLS)

### Deploy & Hosting
- **Vercel** - Hospedagem frontend
- **GitHub Actions** - CI/CD automático

### APIs & Features
- **Geolocation API** - GPS nativo do navegador
- **qrcode.react** - Geração de QR Codes
- **jsQR** - Leitura de QR Codes via câmera
- **Phosphor Icons** - Ícones consistentes

## 📦 Instalação

### Pré-requisitos
- Node.js 20+
- npm ou yarn
- Git
- Conta no Supabase (grátis)
- Conta no Vercel (grátis)
- Conta no GitHub

### 1. Clone o repositório

```bash
git clone https://github.com/Raidosystem/deliveryconnect-pro.git
cd deliveryconnect-pro
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Configure o Supabase

Siga o guia completo em [`SETUP_SUPABASE.md`](./SETUP_SUPABASE.md)

Resumo:
1. Crie um projeto no [Supabase](https://app.supabase.com)
2. Execute a migration `supabase/migrations/001_initial_schema.sql`
3. Copie as credenciais (URL + anon key)

### 4. Configure as variáveis de ambiente

Copie o arquivo de exemplo:

```bash
cp .env.example .env
```

Edite `.env` e adicione suas credenciais:

```env
VITE_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 5. Execute em desenvolvimento

```bash
npm run dev
```

Acesse: http://localhost:5173

## 🌐 Deploy

### Deploy Automático (GitHub + Vercel)

1. **Faça push para o GitHub**:

```bash
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/Raidosystem/deliveryconnect-pro.git
git push -u origin main
```

2. **Conecte ao Vercel**:
   - Acesse [vercel.com](https://vercel.com)
   - Clique em "Import Project"
   - Selecione o repositório `deliveryconnect-pro`
   - Configure as variáveis de ambiente:
     ```
     VITE_SUPABASE_URL
     VITE_SUPABASE_ANON_KEY
     ```
   - Clique em "Deploy"

3. **Pronto!** 🎉
   - Cada push para `main` fará deploy automático
   - URL: `https://deliveryconnect-pro.vercel.app`

Para outras opções de deploy, veja [`DEPLOY.md`](./DEPLOY.md)

## 🗂️ Estrutura do Projeto

```
deliveryconnect-pro/
├── src/
│   ├── components/
│   │   ├── auth/           # Login/Registro
│   │   ├── dashboard/      # Dashboards (Commerce/Motoboy)
│   │   ├── delivery/       # Tracking, QR Code
│   │   ├── map/            # Mapa em tempo real
│   │   ├── notifications/  # Centro de notificações
│   │   └── ui/             # Componentes Radix UI
│   ├── hooks/
│   │   ├── use-geolocation.ts    # Hook de GPS
│   │   ├── use-local-storage.ts  # Persistência local
│   │   └── use-notifications.ts  # Sistema de notificações
│   ├── lib/
│   │   ├── supabase.ts     # Cliente Supabase + tipos
│   │   └── utils.ts        # Utilitários
│   └── App.tsx             # Componente principal
├── supabase/
│   └── migrations/
│       └── 001_initial_schema.sql  # Schema do banco
├── .github/
│   └── workflows/
│       └── deploy.yml      # CI/CD GitHub Actions
├── vercel.json             # Config Vercel
├── netlify.toml            # Config Netlify
├── firebase.json           # Config Firebase
└── nginx.conf              # Config Nginx (VPS)
```

## 📱 Como Usar

### Como Comércio

1. **Registre-se**:
   - Acesse a aplicação
   - Clique em "Registrar"
   - Selecione "Comércio"
   - Preencha CNPJ, nome, endereço, etc.

2. **Crie uma entrega**:
   - No dashboard, clique em "Nova Entrega"
   - Preencha dados do cliente
   - Um QR Code será gerado automaticamente

3. **Acompanhe em tempo real**:
   - Veja a localização do motoboy no mapa
   - Receba notificações de status
   - Use o chat para se comunicar

### Como Motoboy

1. **Registre-se**:
   - Selecione "Motoboy"
   - Preencha CPF, CNH, placa do veículo

2. **Habilite o GPS**:
   - No dashboard, ative o compartilhamento de localização
   - Permita acesso à localização no navegador

3. **Aceite entregas**:
   - Veja entregas disponíveis
   - Aceite a que desejar
   - Escaneie o QR Code ao retirar
   - Marque como entregue ao finalizar

## 🔒 Segurança

- ✅ **HTTPS obrigatório** em produção
- ✅ **Row Level Security (RLS)** no Supabase
- ✅ **Autenticação JWT** com refresh tokens
- ✅ **Validação de dados** no cliente e servidor
- ✅ **Headers de segurança** configurados
- ✅ **CORS** configurado corretamente

## 🧪 Testes

```bash
# Executar testes unitários
npm run test

# Executar testes E2E
npm run test:e2e

# Cobertura de testes
npm run test:coverage
```

## 📊 Banco de Dados

Schema completo com PostGIS para geolocalização:

- **users** - Usuários do sistema
- **commerces** - Dados dos comércios
- **motoboys** - Dados dos motoboys (com localização)
- **deliveries** - Entregas (com localizações de origem/destino)
- **messages** - Chat entre comércio e motoboy

Veja o schema completo em `supabase/migrations/001_initial_schema.sql`

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch (`git checkout -b feature/nova-funcionalidade`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova funcionalidade'`)
4. Push para a branch (`git push origin feature/nova-funcionalidade`)
5. Abra um Pull Request

## � Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 🆘 Suporte

- 📧 Email: suporte@deliveryconnect.pro
- 💬 GitHub Issues: [github.com/Raidosystem/deliveryconnect-pro/issues](https://github.com/Raidosystem/deliveryconnect-pro/issues)
- 📖 Documentação: [docs.deliveryconnect.pro](https://docs.deliveryconnect.pro)

## 🎯 Roadmap

- [ ] App mobile (React Native)
- [ ] Integração com WhatsApp
- [ ] Sistema de pagamentos
- [ ] Analytics avançado
- [ ] Notificações push
- [ ] Modo offline
- [ ] Multi-idiomas
- [ ] Dark mode

## 👨‍💻 Autor

**Raidosystem**
- GitHub: [@Raidosystem](https://github.com/Raidosystem)

## 🙏 Agradecimentos

- [React](https://react.dev)
- [Supabase](https://supabase.com)
- [Vercel](https://vercel.com)
- [Tailwind CSS](https://tailwindcss.com)
- [Radix UI](https://radix-ui.com)

---

Feito com ❤️ por [Raidosystem](https://github.com/Raidosystem)
