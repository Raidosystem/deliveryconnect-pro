# ⚡ AÇÃO IMEDIATA: Executar Migration SQL no Supabase

## 🚨 IMPORTANTE: Execute AGORA antes de testar a aplicação!

Você acabou de configurar as credenciais do Supabase, mas o banco de dados ainda está vazio.
Precisa criar as tabelas executando a migration SQL.

---

## 📋 Passo a Passo (5 minutos)

### 1. Acessar o Supabase
   
Abra no navegador:
```
https://app.supabase.com/project/xffxkvvfinhkgxaghjfz
```

### 2. Abrir o SQL Editor

- No menu lateral esquerdo, clique em **"SQL Editor"**
- Clique no botão **"New Query"**

### 3. Copiar a Migration

- Abra o arquivo: `supabase/migrations/001_initial_schema.sql`
- Selecione **TODO o conteúdo** (Ctrl+A)
- Copie (Ctrl+C)

### 4. Executar no Supabase

- Cole o conteúdo no SQL Editor do Supabase (Ctrl+V)
- Clique no botão **"Run"** (ou pressione `Ctrl+Enter`)
- ⏱️ Aguarde ~10 segundos

### 5. Verificar Sucesso

Você deve ver a mensagem:
```
✓ Success. No rows returned
```

### 6. Confirmar Tabelas Criadas

- Clique em **"Table Editor"** no menu lateral
- Você deve ver estas tabelas:
  - ✅ users
  - ✅ commerces
  - ✅ motoboys
  - ✅ deliveries
  - ✅ messages

---

## ✅ Depois de Executar a Migration

Você poderá:

1. **Testar o Cadastro Localmente**
   - Acesse: http://localhost:5000/
   - Clique em "Registrar"
   - Crie um usuário de teste

2. **Ver os Dados no Supabase**
   - Vá em "Table Editor"
   - Clique na tabela "users" ou "commerces"
   - Você verá os dados cadastrados!

3. **Fazer Deploy na Vercel**
   - Os dados estarão prontos para produção

---

## 🆘 Troubleshooting

### Erro: "relation does not exist"
**Causa:** As tabelas não foram criadas
**Solução:** Execute a migration SQL novamente

### Erro: "permission denied"
**Causa:** Você não é o owner do projeto
**Solução:** Certifique-se de estar logado na conta correta

### Erro: "syntax error"
**Causa:** O SQL foi copiado parcialmente
**Solução:** Copie TODO o conteúdo do arquivo (são ~300 linhas)

---

## 📊 O que a Migration cria?

### Tabelas:
- **users** - Usuários autenticados (extends Supabase Auth)
- **commerces** - Dados dos comércios (CNPJ, endereço, etc)
- **motoboys** - Dados dos motoboys (CPF, CNH, veículo, GPS)
- **deliveries** - Entregas (status, QR code, localizações)
- **messages** - Chat entre comércio e motoboy

### Features:
- ✅ PostGIS habilitado (geolocalização)
- ✅ Row Level Security (RLS) configurado
- ✅ Índices para performance
- ✅ Triggers automáticos
- ✅ Funções SQL personalizadas

---

## 🎯 Próximo Passo

Após executar a migration:

```bash
# Reiniciar o servidor de desenvolvimento
npm run dev
```

Então acesse: http://localhost:5000/

E teste criando um usuário!

---

**⚠️ NÃO pule este passo!** A aplicação não funcionará sem as tabelas criadas.
