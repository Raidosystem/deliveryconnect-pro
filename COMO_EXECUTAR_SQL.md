# 📋 Como Executar a Migration SQL no Supabase

## ⚡ Passo a Passo Rápido (2 minutos)

### 1️⃣ Abrir o Supabase

Acesse seu projeto:
```
https://app.supabase.com/project/xffxkvvfinhkgxaghjfz
```

### 2️⃣ Abrir o SQL Editor

- No menu lateral esquerdo, clique em **"SQL Editor"**
- Clique no botão verde **"+ New Query"**

### 3️⃣ Copiar e Colar o SQL

- Abra o arquivo **`migration.sql`** na raiz do projeto
- Selecione **TODO o conteúdo** (Ctrl+A)
- Copie (Ctrl+C)
- Cole no SQL Editor do Supabase (Ctrl+V)

### 4️⃣ Executar

- Clique no botão **"Run"** (canto inferior direito)
- Ou pressione **Ctrl+Enter**
- ⏱️ Aguarde ~15 segundos

### 5️⃣ Verificar Sucesso

Você deve ver no console:
```
Success. No rows returned
```

Ou várias mensagens de sucesso para cada comando CREATE.

### 6️⃣ Confirmar Tabelas

- Clique em **"Table Editor"** no menu lateral
- Você deve ver **5 tabelas**:
  - ✅ **users** (usuários do sistema)
  - ✅ **commerces** (dados dos comércios)
  - ✅ **motoboys** (dados dos motoboys)
  - ✅ **deliveries** (entregas)
  - ✅ **messages** (chat)

---

## ✅ Depois da Migration

### Testar Cadastro Local

```bash
# O servidor já está rodando em:
http://localhost:5000/
```

1. Clique em **"Registrar"**
2. Selecione **"Comércio"**
3. Preencha:
   - Nome: Pizzaria Teste
   - CNPJ: 12345678901234
   - Email: **teste@comercio.com**
   - Senha: **Teste123!**
   - Telefone: (11) 99999-9999
   - Endereço: Rua Teste, 123
4. Clique em **"Finalizar Cadastro"**

### Verificar no Supabase

1. Volte ao Supabase
2. Clique em **"Authentication"** → **"Users"**
3. ✅ Você deve ver: `teste@comercio.com`
4. Clique em **"Table Editor"** → **"users"**
5. ✅ Você deve ver o usuário com role = 'commerce'
6. Clique em **"commerces"**
7. ✅ Você deve ver a Pizzaria Teste cadastrada!

---

## 🔧 O que o SQL Cria?

### Tabelas
- **users** - Ligada ao Supabase Auth
- **commerces** - CNPJ, nome, endereço, telefone
- **motoboys** - CPF, CNH, veículo, GPS (lat/lng)
- **deliveries** - Status, QR code, localizações
- **messages** - Chat entre comércio e motoboy

### Segurança
- ✅ Row Level Security (RLS) habilitado
- ✅ Políticas que garantem privacidade dos dados
- ✅ Usuários só veem seus próprios dados

### Performance
- ✅ Índices otimizados
- ✅ PostGIS para geolocalização
- ✅ Triggers automáticos

---

## 🆘 Problemas?

### ❌ Erro: "extension postgis does not exist"

**Solução:** Execute este comando antes:
```sql
CREATE EXTENSION IF NOT EXISTS "postgis";
```

### ❌ Erro: "permission denied for schema public"

**Solução:** Você precisa ser o owner do projeto. Verifique se está logado na conta correta.

### ❌ Erro: "relation already exists"

**Solução:** Não é um erro! Significa que a tabela já foi criada. Pode ignorar ou rodar o script completo que ele tem `IF NOT EXISTS`.

### ⚠️ Warnings sobre DROP POLICY

**Solução:** Normal! O script tenta apagar políticas antigas antes de criar novas. Pode ignorar os warnings de "policy does not exist".

---

## 📊 Visualizar os Dados

### Via Table Editor (Interface Visual)

1. Clique em **"Table Editor"**
2. Selecione uma tabela (ex: "commerces")
3. Veja os registros em formato de planilha

### Via SQL (Consultas)

No SQL Editor, teste:

```sql
-- Ver todos os usuários
SELECT * FROM public.users;

-- Ver todos os comércios
SELECT * FROM public.commerces;

-- Ver todos os motoboys
SELECT * FROM public.motoboys;

-- Ver entregas por comércio
SELECT d.*, m.name as motoboy_name 
FROM public.deliveries d
LEFT JOIN public.motoboys m ON d.motoboy_id = m.id;
```

---

## 🎉 Pronto!

Agora você pode:

1. ✅ Cadastrar comércios e motoboys
2. ✅ Fazer login com email/senha
3. ✅ Criar entregas
4. ✅ Rastrear GPS em tempo real
5. ✅ Usar o chat
6. ✅ Fazer deploy na Vercel

---

## 🚀 Deploy na Vercel

Quando tudo estiver funcionando local:

1. Acesse: https://vercel.com
2. Import o repositório: `Raidosystem/deliveryconnect-pro`
3. Adicione as variáveis de ambiente:
   ```
   VITE_SUPABASE_URL = https://xffxkvvfinhkgxaghjfz.supabase.co
   VITE_SUPABASE_ANON_KEY = eyJhbGci...
   ```
4. Deploy! 🎉

---

**Dúvidas?** Consulte `SETUP_SUPABASE.md` ou `GUIA_DEPLOY_COMPLETO.md`
