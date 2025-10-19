-- ============================================
-- DELIVERYCONNECT PRO - MIGRATION SQL
-- Execute este script no SQL Editor do Supabase
-- ============================================

-- 1. HABILITAR EXTENSÕES
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis";

-- 2. CRIAR TABELA DE USUÁRIOS
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('commerce', 'motoboy')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. CRIAR TABELA DE COMÉRCIOS
CREATE TABLE IF NOT EXISTS public.commerces (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID UNIQUE REFERENCES public.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  cnpj TEXT UNIQUE NOT NULL,
  address TEXT NOT NULL,
  phone TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. CRIAR TABELA DE MOTOBOYS
CREATE TABLE IF NOT EXISTS public.motoboys (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID UNIQUE REFERENCES public.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  cpf TEXT UNIQUE NOT NULL,
  cnh TEXT NOT NULL,
  phone TEXT NOT NULL,
  vehicle_plate TEXT NOT NULL,
  vehicle_type TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  current_lat DOUBLE PRECISION,
  current_lng DOUBLE PRECISION,
  location_accuracy DOUBLE PRECISION,
  last_location_update TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. CRIAR TABELA DE ENTREGAS
CREATE TABLE IF NOT EXISTS public.deliveries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  commerce_id UUID REFERENCES public.commerces(id) ON DELETE CASCADE,
  motoboy_id UUID REFERENCES public.motoboys(id) ON DELETE SET NULL,
  customer_name TEXT NOT NULL,
  customer_address TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  items TEXT NOT NULL,
  total_value DECIMAL(10, 2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'assigned', 'in_transit', 'delivered', 'cancelled')),
  qr_code TEXT UNIQUE NOT NULL,
  pickup_lat DOUBLE PRECISION,
  pickup_lng DOUBLE PRECISION,
  delivery_lat DOUBLE PRECISION,
  delivery_lng DOUBLE PRECISION,
  assigned_at TIMESTAMPTZ,
  picked_up_at TIMESTAMPTZ,
  delivered_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. CRIAR TABELA DE MENSAGENS
CREATE TABLE IF NOT EXISTS public.messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  delivery_id UUID REFERENCES public.deliveries(id) ON DELETE CASCADE,
  sender_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  sender_role TEXT NOT NULL CHECK (sender_role IN ('commerce', 'motoboy')),
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. CRIAR ÍNDICES PARA PERFORMANCE
CREATE INDEX IF NOT EXISTS idx_commerces_user_id ON public.commerces(user_id);
CREATE INDEX IF NOT EXISTS idx_motoboys_user_id ON public.motoboys(user_id);
CREATE INDEX IF NOT EXISTS idx_motoboys_active ON public.motoboys(is_active);
CREATE INDEX IF NOT EXISTS idx_deliveries_commerce_id ON public.deliveries(commerce_id);
CREATE INDEX IF NOT EXISTS idx_deliveries_motoboy_id ON public.deliveries(motoboy_id);
CREATE INDEX IF NOT EXISTS idx_deliveries_status ON public.deliveries(status);
CREATE INDEX IF NOT EXISTS idx_deliveries_created_at ON public.deliveries(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_messages_delivery_id ON public.messages(delivery_id);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON public.messages(created_at DESC);

-- 8. HABILITAR ROW LEVEL SECURITY (RLS)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.commerces ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.motoboys ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.deliveries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- 9. POLÍTICAS RLS PARA USERS
DROP POLICY IF EXISTS "Users can view their own data" ON public.users;
CREATE POLICY "Users can view their own data" ON public.users
  FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update their own data" ON public.users;
CREATE POLICY "Users can update their own data" ON public.users
  FOR UPDATE USING (auth.uid() = id);

-- 10. POLÍTICAS RLS PARA COMMERCES
DROP POLICY IF EXISTS "Commerces can view their own data" ON public.commerces;
CREATE POLICY "Commerces can view their own data" ON public.commerces
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Commerces can update their own data" ON public.commerces;
CREATE POLICY "Commerces can update their own data" ON public.commerces
  FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Anyone can view commerces" ON public.commerces;
CREATE POLICY "Anyone can view commerces" ON public.commerces
  FOR SELECT USING (true);

-- 11. POLÍTICAS RLS PARA MOTOBOYS
DROP POLICY IF EXISTS "Motoboys can view their own data" ON public.motoboys;
CREATE POLICY "Motoboys can view their own data" ON public.motoboys
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Motoboys can update their own data" ON public.motoboys;
CREATE POLICY "Motoboys can update their own data" ON public.motoboys
  FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Anyone can view active motoboys" ON public.motoboys;
CREATE POLICY "Anyone can view active motoboys" ON public.motoboys
  FOR SELECT USING (is_active = true);

-- 12. POLÍTICAS RLS PARA DELIVERIES
DROP POLICY IF EXISTS "Commerces can view their own deliveries" ON public.deliveries;
CREATE POLICY "Commerces can view their own deliveries" ON public.deliveries
  FOR SELECT USING (
    commerce_id IN (SELECT id FROM public.commerces WHERE user_id = auth.uid())
  );

DROP POLICY IF EXISTS "Motoboys can view assigned deliveries" ON public.deliveries;
CREATE POLICY "Motoboys can view assigned deliveries" ON public.deliveries
  FOR SELECT USING (
    motoboy_id IN (SELECT id FROM public.motoboys WHERE user_id = auth.uid())
  );

DROP POLICY IF EXISTS "Commerces can create deliveries" ON public.deliveries;
CREATE POLICY "Commerces can create deliveries" ON public.deliveries
  FOR INSERT WITH CHECK (
    commerce_id IN (SELECT id FROM public.commerces WHERE user_id = auth.uid())
  );

DROP POLICY IF EXISTS "Commerces can update their deliveries" ON public.deliveries;
CREATE POLICY "Commerces can update their deliveries" ON public.deliveries
  FOR UPDATE USING (
    commerce_id IN (SELECT id FROM public.commerces WHERE user_id = auth.uid())
  );

DROP POLICY IF EXISTS "Motoboys can update assigned deliveries" ON public.deliveries;
CREATE POLICY "Motoboys can update assigned deliveries" ON public.deliveries
  FOR UPDATE USING (
    motoboy_id IN (SELECT id FROM public.motoboys WHERE user_id = auth.uid())
  );

-- 13. POLÍTICAS RLS PARA MESSAGES
DROP POLICY IF EXISTS "Users can view messages for their deliveries" ON public.messages;
CREATE POLICY "Users can view messages for their deliveries" ON public.messages
  FOR SELECT USING (
    delivery_id IN (
      SELECT id FROM public.deliveries WHERE
        commerce_id IN (SELECT id FROM public.commerces WHERE user_id = auth.uid())
        OR motoboy_id IN (SELECT id FROM public.motoboys WHERE user_id = auth.uid())
    )
  );

DROP POLICY IF EXISTS "Users can create messages for their deliveries" ON public.messages;
CREATE POLICY "Users can create messages for their deliveries" ON public.messages
  FOR INSERT WITH CHECK (
    sender_id = auth.uid() AND
    delivery_id IN (
      SELECT id FROM public.deliveries WHERE
        commerce_id IN (SELECT id FROM public.commerces WHERE user_id = auth.uid())
        OR motoboy_id IN (SELECT id FROM public.motoboys WHERE user_id = auth.uid())
    )
  );

-- 14. FUNÇÃO PARA ATUALIZAR UPDATED_AT
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 15. TRIGGERS PARA UPDATED_AT
DROP TRIGGER IF EXISTS update_users_updated_at ON public.users;
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON public.users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_deliveries_updated_at ON public.deliveries;
CREATE TRIGGER update_deliveries_updated_at
  BEFORE UPDATE ON public.deliveries
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- FINALIZADO! ✅
-- ============================================
-- Você pode verificar se deu certo:
-- 1. Vá em "Table Editor" no menu lateral
-- 2. Você deve ver as tabelas: users, commerces, motoboys, deliveries, messages
-- ============================================
