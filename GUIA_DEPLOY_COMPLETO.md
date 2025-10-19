# 🚀 Guia Completo de Deploy - DeliveryConnect Pro

## GitHub ✅ + Vercel + Supabase

Este guia vai te ajudar a fazer o deploy completo da aplicação em **5 passos simples**.

---

## 📋 Checklist Rápido

- [x] ✅ Código no GitHub
- [ ] 🗄️ Configurar Supabase
- [ ] 🌐 Configurar Vercel
- [ ] 🔗 Conectar GitHub + Vercel
- [ ] 🎉 Deploy automático funcionando

---

## 1️⃣ Configurar Supabase (15 minutos)

### 1.1 Criar Conta e Projeto

1. Acesse: https://app.supabase.com
2. Clique em **"New Project"**
3. Preencha:
   - **Name**: `deliveryconnect-pro`
   - **Database Password**: Crie uma senha forte (⚠️ ANOTE!)
   - **Region**: `South America (São Paulo)` ou mais próxima
   - **Pricing**: Free (500MB)
4. Clique em **"Create new project"**
5. ⏱️ Aguarde ~2 minutos (provisionamento do banco)

### 1.2 Executar Migration SQL

1. No painel lateral, clique em **"SQL Editor"**
2. Clique em **"New Query"**
3. Abra o arquivo `supabase/migrations/001_initial_schema.sql` do seu projeto
4. **Copie TODO o conteúdo** (são ~300 linhas)
5. **Cole no editor SQL** do Supabase
6. Clique em **"Run"** (ou pressione `Ctrl+Enter`)
7. ✅ Aguarde a mensagem: **"Success. No rows returned"**

### 1.3 Verificar Tabelas Criadas

1. No painel lateral, clique em **"Table Editor"**
2. Você deve ver as seguintes tabelas:
   - ✅ `users`
   - ✅ `commerces`
   - ✅ `motoboys`
   - ✅ `deliveries`
   - ✅ `messages`

### 1.4 Habilitar Realtime

1. Clique em **"Database"** → **"Replication"**
2. Procure e habilite as seguintes tabelas:
   - ✅ `motoboys` (para GPS em tempo real)
   - ✅ `deliveries` (para status de entregas)
   - ✅ `messages` (para chat)

### 1.5 Copiar Credenciais

1. Clique em **"Project Settings"** (⚙️ no canto inferior esquerdo)
2. Clique em **"API"**
3. Você verá duas informações importantes:

```
Project URL: https://xxxxxxxxxxxxx.supabase.co
anon public: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

4. ⚠️ **COPIE E GUARDE** essas duas informações (vamos usar no próximo passo)

---

## 2️⃣ Configurar Vercel (5 minutos)

### 2.1 Criar Conta e Conectar GitHub

1. Acesse: https://vercel.com
2. Clique em **"Sign Up"**
3. Selecione **"Continue with GitHub"**
4. Autorize o Vercel a acessar seus repositórios

### 2.2 Importar Projeto

1. No dashboard da Vercel, clique em **"Add New..."** → **"Project"**
2. Procure por **`deliveryconnect-pro`**
3. Clique em **"Import"**

### 2.3 Configurar Build

A Vercel detecta automaticamente que é um projeto Vite. Confirme:

```
Framework Preset: Vite
Build Command: npm run build
Output Directory: dist
Install Command: npm install
```

### 2.4 Adicionar Variáveis de Ambiente

**IMPORTANTE:** Adicione as credenciais do Supabase aqui!

1. Na seção **"Environment Variables"**, clique em **"Add"**
2. Adicione as seguintes variáveis:

| Name | Value |
|------|-------|
| `VITE_SUPABASE_URL` | `https://xxxxxxxxxxxxx.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` |

3. Deixe **"Environments"** marcado como: `Production`, `Preview`, `Development`

### 2.5 Deploy!

1. Clique em **"Deploy"**
2. ⏱️ Aguarde ~1-2 minutos
3. 🎉 **Sucesso!** Sua aplicação está no ar!

---

## 3️⃣ Testar a Aplicação (5 minutos)

### 3.1 Acessar URL

Após o deploy, você verá:

```
🎉 Congratulations!
Your project is live at: https://deliveryconnect-pro-xxxxx.vercel.app
```

### 3.2 Criar Usuário de Teste (Comércio)

1. Acesse a URL da sua aplicação
2. Clique em **"Registrar"**
3. Selecione **"Comércio"**
4. Preencha:
   - Email: `comercio@teste.com`
   - Senha: `Teste123!`
   - Nome: `Pizzaria Teste`
   - CNPJ: `12345678901234`
   - Endereço: `Rua Teste, 123`
   - Telefone: `11999999999`
5. Clique em **"Registrar"**

### 3.3 Verificar no Supabase

1. Volte ao painel do Supabase
2. Vá em **"Authentication"** → **"Users"**
3. ✅ Você deve ver o usuário `comercio@teste.com`
4. Vá em **"Table Editor"** → **"commerces"**
5. ✅ Você deve ver a pizzaria cadastrada

### 3.4 Criar Usuário Motoboy

1. Faça logout (ou use uma aba anônima)
2. Registre-se como **"Motoboy"**:
   - Email: `motoboy@teste.com`
   - Senha: `Teste123!`
   - Nome: `João Silva`
   - CPF: `12345678901`
   - CNH: `12345678901`
   - Telefone: `11988888888`
   - Placa: `ABC1234`
   - Veículo: `Moto`

### 3.5 Testar GPS

1. Faça login como **motoboy@teste.com**
2. No dashboard, clique na aba **"GPS"**
3. Clique em **"Ativar Localização"**
4. Permita o acesso à localização no navegador
5. ✅ Você deve ver: "GPS Ativo"

6. **Em outra aba**, faça login como **comercio@teste.com**
7. Clique na aba **"Motoboys Ativos"**
8. ✅ Você deve ver o motoboy João Silva no mapa com sua localização!

---

## 4️⃣ Configurar Domínio Próprio (Opcional)

### 4.1 Adicionar Domínio na Vercel

1. No projeto, vá em **"Settings"** → **"Domains"**
2. Clique em **"Add"**
3. Digite seu domínio: `deliveryconnect.com`
4. A Vercel mostrará os registros DNS necessários

### 4.2 Configurar DNS

No seu provedor de domínio (Registro.br, GoDaddy, etc):

**Para domínio raiz (deliveryconnect.com):**
```
Type: A
Name: @
Value: 76.76.21.21
```

**Para subdomínio (www.deliveryconnect.com):**
```
Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

### 4.3 Aguardar Propagação

- ⏱️ Pode levar de 5 minutos a 48 horas
- A Vercel emitirá automaticamente um certificado SSL (HTTPS)

---

## 5️⃣ Deploy Automático (Já configurado! ✅)

### Como Funciona

Agora **CADA VEZ** que você fizer push para o GitHub:

```bash
git add .
git commit -m "Nova funcionalidade"
git push origin main
```

A Vercel automaticamente:
1. 🔔 Detecta o push
2. 🏗️ Faz o build
3. 🧪 Testa
4. 🚀 Faz deploy
5. 📧 Te envia um email de confirmação

### Visualizar Deploy

1. Acesse o dashboard da Vercel
2. Clique no projeto **deliveryconnect-pro**
3. Você verá todos os deploys com:
   - ✅ Status (Success/Failed)
   - 🕐 Tempo de build
   - 🔗 Preview URL
   - 📝 Commit message

---

## 📊 Monitoramento

### Vercel Analytics (Opcional - Gratuito)

1. No projeto, vá em **"Analytics"**
2. Clique em **"Enable"**
3. Você terá acesso a:
   - 📈 Visitantes únicos
   - 🌍 Origem geográfica
   - ⚡ Performance (Core Web Vitals)
   - 📱 Dispositivos (Mobile/Desktop)

### Supabase Logs

1. No Supabase, vá em **"Database"** → **"Logs"**
2. Monitore:
   - 🔍 Queries executadas
   - ⚠️ Erros
   - 🕐 Tempo de resposta

---

## 🔧 Troubleshooting

### Erro: "Supabase credentials not configured"

**Solução:**
1. Verifique se as variáveis de ambiente estão corretas no Vercel
2. Certifique-se de que não há espaços extras nas credenciais
3. Faça um **redeploy**:
   - Vercel Dashboard → Deployments → [...] → Redeploy

### Erro: "Row Level Security policy violation"

**Solução:**
1. Verifique se executou a migration SQL completa
2. No Supabase, vá em **SQL Editor** e execute:
   ```sql
   SELECT * FROM pg_policies;
   ```
3. Deve retornar várias políticas RLS

### GPS não está atualizando

**Solução:**
1. Certifique-se de estar usando **HTTPS** (a Vercel já faz isso)
2. Permita acesso à localização no navegador
3. Verifique se o Realtime está habilitado no Supabase
4. Verifique o console do navegador (F12) para erros

### Build falhou

**Solução:**
1. Verifique os logs no Vercel
2. Teste localmente:
   ```bash
   npm run build
   npm run preview
   ```
3. Se funcionar local, pode ser problema de variáveis de ambiente

---

## 📞 Suporte

### GitHub Issues
https://github.com/Raidosystem/deliveryconnect-pro/issues

### Documentação
- [Supabase Docs](https://supabase.com/docs)
- [Vercel Docs](https://vercel.com/docs)
- [Vite Docs](https://vitejs.dev)

---

## 🎉 Parabéns!

Sua aplicação **DeliveryConnect Pro** está 100% funcional em produção!

### URLs Importantes

- 🌐 **Aplicação**: https://deliveryconnect-pro-xxxxx.vercel.app
- 🗄️ **Supabase**: https://app.supabase.com/project/xxxxx
- 📊 **Vercel**: https://vercel.com/seu-usuario/deliveryconnect-pro
- 💻 **GitHub**: https://github.com/Raidosystem/deliveryconnect-pro

---

## 📈 Próximos Passos

1. [ ] Configure um domínio próprio
2. [ ] Habilite Vercel Analytics
3. [ ] Configure backup automático do Supabase
4. [ ] Adicione mais motoboys e comércios
5. [ ] Customize o design (cores, logo)
6. [ ] Configure email SMTP no Supabase (SendGrid, Mailgun)

---

Feito com ❤️ por [Raidosystem](https://github.com/Raidosystem)
