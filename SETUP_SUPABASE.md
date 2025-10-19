# 🚀 Configuração Supabase - DeliveryConnect Pro

Este guia explica como configurar o Supabase para o DeliveryConnect Pro.

## 📋 Índice

1. [Criar Projeto Supabase](#1-criar-projeto-supabase)
2. [Executar Migrations](#2-executar-migrations)
3. [Configurar Autenticação](#3-configurar-autenticação)
4. [Obter Credenciais](#4-obter-credenciais)
5. [Configurar Variáveis de Ambiente](#5-configurar-variáveis-de-ambiente)
6. [Configurar Realtime](#6-configurar-realtime)
7. [Configurar Storage (Opcional)](#7-configurar-storage-opcional)

---

## 1. Criar Projeto Supabase

1. Acesse [https://app.supabase.com](https://app.supabase.com)
2. Clique em **"New Project"**
3. Preencha:
   - **Name**: `deliveryconnect-pro`
   - **Database Password**: Crie uma senha forte (anote!)
   - **Region**: Escolha a mais próxima (ex: South America - São Paulo)
   - **Pricing Plan**: Free (até 500MB de banco)
4. Clique em **"Create new project"**
5. Aguarde ~2 minutos para o projeto ser provisionado

---

## 2. Executar Migrations

### Opção A: Via Dashboard (Recomendado para iniciantes)

1. No painel do projeto, vá em **"SQL Editor"** (menu lateral)
2. Clique em **"New Query"**
3. Copie todo o conteúdo de `supabase/migrations/001_initial_schema.sql`
4. Cole no editor SQL
5. Clique em **"Run"** (ou `Ctrl+Enter`)
6. Aguarde a mensagem de sucesso

### Opção B: Via CLI (Avançado)

```bash
# Instalar Supabase CLI
npm install -g supabase

# Fazer login
supabase login

# Link com o projeto (você precisará do Project ID)
supabase link --project-ref SEU_PROJECT_ID

# Executar migrations
supabase db push
```

---

## 3. Configurar Autenticação

### 3.1 Configurações Básicas

1. Vá em **"Authentication"** → **"Settings"**
2. Em **"General"**:
   - ✅ Enable email confirmations: **OFF** (para desenvolvimento)
   - ✅ Enable phone confirmations: **OFF**
3. Em **"Auth Providers"**:
   - ✅ Enable Email Provider: **ON**

### 3.2 Configurar E-mail (Produção)

Para produção, configure um provedor SMTP:

1. Vá em **"Project Settings"** → **"Auth"**
2. Em **"SMTP Settings"**:
   - **Sender email**: seu-email@dominio.com
   - **Sender name**: DeliveryConnect Pro
   - **Host**: smtp.seu-provedor.com
   - **Port**: 587
   - **Username**: seu-email@dominio.com
   - **Password**: sua-senha

Provedores recomendados:
- **SendGrid**: 100 emails/dia grátis
- **Mailgun**: 100 emails/dia grátis
- **AWS SES**: $0.10 por 1000 emails

### 3.3 Personalizar E-mails (Opcional)

1. Vá em **"Authentication"** → **"Email Templates"**
2. Personalize os templates:
   - Confirm signup
   - Magic Link
   - Reset password

---

## 4. Obter Credenciais

1. Vá em **"Project Settings"** → **"API"**
2. Você verá:

   ```
   Project URL: https://xxxxxxxxxxxxx.supabase.co
   anon public: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   service_role: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9... (⚠️ NUNCA compartilhe!)
   ```

3. Copie **Project URL** e **anon public** key

---

## 5. Configurar Variáveis de Ambiente

### 5.1 Desenvolvimento Local

1. Abra o arquivo `.env` na raiz do projeto
2. Cole suas credenciais:

```env
VITE_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

3. Reinicie o servidor de desenvolvimento:

```bash
npm run dev
```

### 5.2 Vercel (Produção)

1. Acesse seu projeto no [Vercel Dashboard](https://vercel.com)
2. Vá em **"Settings"** → **"Environment Variables"**
3. Adicione:

   ```
   VITE_SUPABASE_URL = https://xxxxxxxxxxxxx.supabase.co
   VITE_SUPABASE_ANON_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

4. Clique em **"Save"**
5. Faça um novo deploy (push para o GitHub)

---

## 6. Configurar Realtime

Para receber atualizações em tempo real (localização de motoboys, mensagens, etc):

1. Vá em **"Database"** → **"Replication"**
2. Habilite as seguintes tabelas:
   - ✅ `motoboys` (para localização em tempo real)
   - ✅ `deliveries` (para status de entregas)
   - ✅ `messages` (para chat)

3. No código, o Realtime já está configurado automaticamente.

---

## 7. Configurar Storage (Opcional)

Se precisar armazenar fotos (CNH, documentos, etc):

1. Vá em **"Storage"**
2. Clique em **"New Bucket"**
3. Configure:
   - **Name**: `documents`
   - **Public bucket**: OFF
   - **Allowed MIME types**: `image/jpeg,image/png,application/pdf`
   - **Max file size**: 5 MB

4. Crie políticas RLS:

```sql
-- Permitir upload de documentos
CREATE POLICY "Users can upload their documents"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'documents' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Permitir visualização de próprios documentos
CREATE POLICY "Users can view their documents"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'documents' AND
  auth.uid()::text = (storage.foldername(name))[1]
);
```

---

## 🧪 Testar Configuração

### Teste 1: Conexão

Execute no console do navegador (F12):

```javascript
console.log('Supabase URL:', import.meta.env.VITE_SUPABASE_URL);
console.log('Supabase conectado:', !!supabase);
```

### Teste 2: Criar Usuário

1. Na aplicação, vá para a tela de registro
2. Crie um usuário de teste:
   - Email: teste@exemplo.com
   - Senha: Teste123!
   - Tipo: Comércio

3. Verifique no Supabase:
   - **Authentication** → **Users** (deve aparecer o novo usuário)
   - **Table Editor** → **users** (deve ter um registro)
   - **Table Editor** → **commerces** (deve ter um registro vinculado)

### Teste 3: GPS em Tempo Real

1. Crie um usuário Motoboy
2. Faça login como motoboy
3. Habilite o GPS
4. Verifique no dashboard do comércio se o motoboy aparece no mapa

---

## 📊 Schema do Banco de Dados

```
┌─────────────┐
│ auth.users  │ (Supabase nativo)
└──────┬──────┘
       │
       ├──────────────┬──────────────┐
       │              │              │
┌──────▼──────┐ ┌────▼─────┐ ┌──────▼──────┐
│   users     │ │commerces │ │  motoboys   │
│             │ │          │ │             │
│ - id        │ │ - id     │ │ - id        │
│ - email     │ │ - user_id│ │ - user_id   │
│ - role      │ │ - name   │ │ - name      │
└─────────────┘ │ - cnpj   │ │ - cpf       │
                │ - address│ │ - cnh       │
                └────┬─────┘ │ - current_* │
                     │       └──────┬──────┘
                     │              │
                ┌────▼──────────────▼────┐
                │     deliveries         │
                │                        │
                │ - id                   │
                │ - commerce_id (FK)     │
                │ - motoboy_id (FK)      │
                │ - status               │
                │ - qr_code              │
                │ - *_location (PostGIS) │
                └────────┬───────────────┘
                         │
                    ┌────▼─────┐
                    │ messages │
                    │          │
                    │ - id     │
                    │ - delivery_id (FK)
                    │ - sender_id (FK)
                    │ - message│
                    └──────────┘
```

---

## 🔒 Segurança

### Boas Práticas Implementadas

✅ **Row Level Security (RLS)** habilitado em todas as tabelas
✅ **Políticas RLS** garantem que usuários só vejam seus dados
✅ **Autenticação JWT** com refresh token automático
✅ **Índices** para performance em queries geoespaciais
✅ **Validações** de role, status, etc via CHECK constraints

### ⚠️ NUNCA faça isso:

❌ Compartilhar a chave `service_role`
❌ Fazer commit de arquivos `.env` no Git
❌ Desabilitar RLS em produção
❌ Usar a anon key no backend (sempre use service_role em APIs server-side)

---

## 🆘 Troubleshooting

### Erro: "Invalid API key"

- Verifique se copiou a chave correta (anon public, não service_role)
- Certifique-se de que não há espaços extras
- Reinicie o servidor de desenvolvimento

### Erro: "Row Level Security policy violation"

- Verifique se as políticas RLS foram criadas corretamente
- Teste com `auth.uid()` no SQL Editor:
  ```sql
  SELECT auth.uid(); -- Deve retornar seu user ID
  ```

### Erro: "PostGIS extension not found"

- No SQL Editor, execute:
  ```sql
  CREATE EXTENSION IF NOT EXISTS "postgis";
  ```

### GPS não atualiza em tempo real

1. Verifique se Realtime está habilitado
2. Teste a conexão:
   ```javascript
   supabase
     .channel('test')
     .on('postgres_changes', { event: '*', schema: 'public', table: 'motoboys' }, console.log)
     .subscribe();
   ```

---

## 📚 Recursos Úteis

- [Supabase Docs](https://supabase.com/docs)
- [PostGIS Geography](https://postgis.net/docs/geography.html)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)
- [Realtime](https://supabase.com/docs/guides/realtime)

---

## 🎉 Pronto!

Agora seu DeliveryConnect Pro está conectado ao Supabase e pronto para produção!

Para deploy completo: consulte `DEPLOY.md`
