# 🔧 SOLUÇÃO: Erro de Deploy na Vercel (3 segundos)

## 🚨 Problema: Deploy falha em 3 segundos

Isso geralmente acontece por **falta de variáveis de ambiente** ou **erro de build**.

---

## ✅ SOLUÇÃO RÁPIDA

### 1. Verificar Variáveis de Ambiente na Vercel

As variáveis do Supabase **NÃO** estão configuradas na Vercel!

#### Como corrigir:

1. **Acesse:** https://vercel.com/dashboard
2. Clique no seu projeto **deliveryconnect-pro**
3. Vá em **"Settings"** (menu lateral)
4. Clique em **"Environment Variables"**
5. Adicione as seguintes variáveis:

```
Name: VITE_SUPABASE_URL
Value: https://xffxkvvfinhkgxaghjfz.supabase.co
Environment: Production, Preview, Development
```

```
Name: VITE_SUPABASE_ANON_KEY
Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhmZnhrdnZmaW5oa2d4YWdoamZ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA4Mzk5ODksImV4cCI6MjA3NjQxNTk4OX0.OOP3OcV2H_qAmmnjh7Jp2WFjfUANItevcBkKnkiXsWQ
Environment: Production, Preview, Development
```

6. Clique em **"Save"** em cada uma

### 2. Forçar Novo Deploy

Depois de adicionar as variáveis:

1. Vá em **"Deployments"** (menu lateral)
2. Clique nos **"..."** do último deploy
3. Clique em **"Redeploy"**
4. Aguarde ~2 minutos

✅ Agora deve funcionar!

---

## 🔍 Verificar Logs de Erro

Se ainda der erro:

1. Na aba **"Deployments"**
2. Clique no deploy que falhou
3. Clique em **"View Function Logs"** ou **"Build Logs"**
4. Procure por mensagens de erro

### Erros Comuns:

#### ❌ "Module not found: @supabase/supabase-js"

**Solução:** Verificar se a dependência está no `package.json`

```bash
npm install @supabase/supabase-js
git add package.json package-lock.json
git commit -m "fix: Add supabase dependency"
git push
```

#### ❌ "VITE_SUPABASE_URL is not defined"

**Solução:** As variáveis de ambiente não foram configuradas. Siga o passo 1 acima.

#### ❌ "Build exceeded maximum duration"

**Solução:** Otimizar o build ou atualizar plano da Vercel.

---

## 📋 Checklist Completo

Antes de fazer deploy, verifique:

- [x] ✅ Build local funciona (`npm run build`)
- [ ] ✅ Variáveis de ambiente configuradas na Vercel
- [ ] ✅ `package.json` tem `@supabase/supabase-js`
- [ ] ✅ Código commitado e enviado para GitHub
- [ ] ✅ Migration SQL executada no Supabase

---

## 🎯 Passo a Passo Completo (Deploy na Vercel)

### 1. Configurar Variáveis de Ambiente

```
VITE_SUPABASE_URL = https://xffxkvvfinhkgxaghjfz.supabase.co
VITE_SUPABASE_ANON_KEY = eyJhbGci... (sua key completa)
```

### 2. Verificar package.json

Confirme que tem:
```json
"dependencies": {
  "@supabase/supabase-js": "^2.39.3",
  ...
}
```

### 3. Commit e Push

```bash
git add .
git commit -m "fix: Configure Vercel deployment"
git push origin main
```

### 4. Deploy Automático ou Manual

**Automático:** A Vercel detecta o push e faz deploy automaticamente.

**Manual:**
1. Acesse Vercel Dashboard
2. Vá em Deployments
3. Clique em "Redeploy"

### 5. Testar Deploy

Após o deploy bem-sucedido:

```
✅ Production: https://deliveryconnect-pro-xxxxx.vercel.app
```

1. Acesse a URL
2. Teste cadastrar um usuário
3. Verifique no Supabase se foi criado

---

## 🐛 Debug Avançado

### Ver Logs em Tempo Real

```bash
# Instalar Vercel CLI (se não tiver)
npm i -g vercel

# Login
vercel login

# Ver logs
vercel logs deliveryconnect-pro
```

### Testar Build Local Exato da Vercel

```bash
# Limpar cache
rm -rf node_modules .next dist

# Reinstalar
npm ci

# Build
npm run build

# Preview
npm run preview
```

Se funcionar local mas não na Vercel = problema de variáveis de ambiente!

---

## 📊 Status das Configurações

### ✅ Funcionando:
- [x] Build local (`npm run build`)
- [x] Código no GitHub
- [x] Supabase configurado
- [x] Migration SQL executada

### ⚠️ Pendente:
- [ ] Variáveis de ambiente na Vercel
- [ ] Deploy bem-sucedido

---

## 🚀 Depois que Funcionar

1. ✅ Acesse a URL de produção
2. ✅ Cadastre um usuário de teste
3. ✅ Configure domínio próprio (opcional)
4. ✅ Ative Analytics da Vercel (opcional)

---

## 💡 Dica Pro

Use Preview Deployments para testar antes de produção:

1. Crie uma branch: `git checkout -b feature/test`
2. Faça mudanças e push: `git push origin feature/test`
3. A Vercel cria um preview: `https://deliveryconnect-pro-xxxxx-feature-test.vercel.app`
4. Teste tudo
5. Se funcionar, merge para main: `git checkout main && git merge feature/test`

---

## 📞 Ainda com Problema?

1. Verifique os logs na Vercel
2. Consulte: https://vercel.com/docs/deployments/troubleshoot
3. Abra issue no GitHub: https://github.com/Raidosystem/deliveryconnect-pro/issues

---

**⚠️ LEMBRE-SE:** O erro de 3 segundos é **SEMPRE** falta de variáveis de ambiente!
