# 🧪 Teste de Cadastro - DeliveryConnect Pro

## ✅ Migration Executada com Sucesso!

Agora vamos testar se o cadastro está funcionando com o Supabase.

---

## 📋 Teste 1: Cadastrar Comércio

### Passo a Passo:

1. **Acesse:** http://localhost:5000/
2. **Clique em:** "Registrar"
3. **Selecione:** "Comércio"
4. **Preencha:**

```
Nome do Responsável: João Silva
Nome da Empresa: Pizzaria Bella Vista
CNPJ: 12.345.678/0001-90
Telefone: (11) 98765-4321
E-mail: pizzaria@bellavista.com
Endereço: Rua das Flores, 123 - Centro
Senha: Pizza123!
Confirmar Senha: Pizza123!
```

5. **Clique em:** "Finalizar Cadastro"

### ✅ Resultado Esperado:

- Mensagem: "Cadastro realizado com sucesso!"
- Redirecionado para o dashboard do comércio

### 🔍 Verificar no Supabase:

1. No Supabase, vá em **"Authentication"** → **"Users"**
2. ✅ Deve aparecer: `pizzaria@bellavista.com`

3. Vá em **"Table Editor"** → **"users"**
4. ✅ Deve ter 1 registro com:
   - email: `pizzaria@bellavista.com`
   - role: `commerce`

5. Vá em **"Table Editor"** → **"commerces"**
6. ✅ Deve ter 1 registro com:
   - name: `Pizzaria Bella Vista`
   - cnpj: `12.345.678/0001-90`
   - address: `Rua das Flores, 123 - Centro`

---

## 📋 Teste 2: Cadastrar Motoboy

1. **Faça logout** (ou abra uma aba anônima)
2. **Clique em:** "Registrar"
3. **Selecione:** "Motoboy"
4. **Preencha:**

```
Nome Completo: Carlos Entregador
CPF: 123.456.789-00
CNH: 12345678901
Telefone: (11) 99876-5432
E-mail: carlos@entregador.com
Tipo de Veículo: Moto
Placa do Veículo: ABC-1234
Senha: Moto123!
Confirmar Senha: Moto123!
```

5. **Clique em:** "Finalizar Cadastro"

### ✅ Resultado Esperado:

- Mensagem: "Cadastro realizado com sucesso!"
- Redirecionado para o dashboard do motoboy

### 🔍 Verificar no Supabase:

1. **Authentication** → **"Users"**
   - ✅ Deve ter 2 usuários agora
   - ✅ Segundo usuário: `carlos@entregador.com`

2. **Table Editor** → **"motoboys"**
   - ✅ Deve ter 1 registro com:
     - name: `Carlos Entregador`
     - cpf: `123.456.789-00`
     - cnh: `12345678901`
     - vehicle_type: `Moto`
     - vehicle_plate: `ABC-1234`
     - is_active: `true`

---

## 📋 Teste 3: Login

### Testar login do Comércio:

1. Faça logout
2. Na tela inicial, preencha:
   - **E-mail:** `pizzaria@bellavista.com`
   - **Senha:** `Pizza123!`
3. Clique em **"Entrar"**

✅ Deve entrar no dashboard do comércio

### Testar login do Motoboy:

1. Faça logout
2. Na tela inicial, preencha:
   - **E-mail:** `carlos@entregador.com`
   - **Senha:** `Moto123!`
3. Clique em **"Entrar"**

✅ Deve entrar no dashboard do motoboy

---

## 🔧 Teste 4: GPS (Motoboy)

1. **Faça login como motoboy** (`carlos@entregador.com`)
2. No dashboard, vá na aba **"GPS"**
3. Clique em **"Ativar Localização"**
4. **Permita** o acesso à localização no navegador
5. ✅ Deve mostrar: "GPS Ativo"
6. ✅ Deve mostrar suas coordenadas (latitude/longitude)

### 🔍 Verificar no Supabase:

1. **Table Editor** → **"motoboys"**
2. Clique para atualizar os dados
3. ✅ Deve ter valores em:
   - `current_lat`: -23.xxxxx (ou sua latitude)
   - `current_lng`: -46.xxxxx (ou sua longitude)
   - `location_accuracy`: número (precisão em metros)
   - `last_location_update`: timestamp atual

---

## 🎯 Teste 5: Criar Entrega (Comércio)

1. **Faça login como comércio** (`pizzaria@bellavista.com`)
2. No dashboard, clique em **"Nova Entrega"**
3. Preencha:
   - Cliente: Maria Silva
   - Endereço: Rua ABC, 456
   - Telefone: (11) 91234-5678
   - Itens: 2x Pizza Grande
   - Valor: R$ 80,00
4. Clique em **"Criar Entrega"**

### ✅ Resultado Esperado:

- Mensagem: "Entrega criada com sucesso!"
- QR Code gerado automaticamente
- Entrega aparece na lista

### 🔍 Verificar no Supabase:

1. **Table Editor** → **"deliveries"**
2. ✅ Deve ter 1 registro com:
   - customer_name: `Maria Silva`
   - status: `pending`
   - qr_code: código único
   - total_value: `80.00`

---

## 🐛 Problemas Comuns

### ❌ "Failed to sign up"
**Causa:** Email já existe no Supabase
**Solução:** Use outro email ou delete o usuário no Supabase Auth

### ❌ "Row Level Security policy violation"
**Causa:** RLS não foi configurado corretamente
**Solução:** Execute o SQL novamente, principalmente a seção de políticas RLS

### ❌ GPS não funciona
**Causa:** Precisa estar em HTTPS ou localhost
**Solução:** Você está em localhost, então deve funcionar. Verifique se permitiu acesso no navegador

### ❌ "Cannot find module 'supabase'"
**Causa:** Dependência não instalada
**Solução:** 
```bash
npm install @supabase/supabase-js
```

---

## 📊 Status Final

Depois dos testes, você deve ter no Supabase:

### Authentication → Users
- ✅ 2 usuários (pizzaria + carlos)

### Table Editor
- ✅ **users**: 2 registros
- ✅ **commerces**: 1 registro
- ✅ **motoboys**: 1 registro (com GPS)
- ✅ **deliveries**: 1 ou mais registros
- ✅ **messages**: 0 registros (ainda sem chat)

---

## 🚀 Próximos Passos

1. ✅ Testar criar mais entregas
2. ✅ Testar motoboy aceitar entrega
3. ✅ Testar scanner de QR Code
4. ✅ Testar chat entre comércio e motoboy
5. ✅ Fazer deploy na Vercel

---

## 💡 Dica

Abra o console do navegador (F12) para ver logs em tempo real:
- Conexão com Supabase
- Erros de autenticação
- Updates de GPS
- Mensagens de chat

---

**Dúvidas?** Verifique `COMO_EXECUTAR_SQL.md` ou `SETUP_SUPABASE.md`
