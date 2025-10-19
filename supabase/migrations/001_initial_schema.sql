-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enable PostGIS extension for geolocation
CREATE EXTENSION IF NOT EXISTS "postgis";

-- Create users table (extends Supabase auth.users)
CREATE TABLE public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('commerce', 'motoboy')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create commerce table
CREATE TABLE public.commerces (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  cnpj TEXT UNIQUE NOT NULL,
  address TEXT NOT NULL,
  phone TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Create motoboy table
CREATE TABLE public.motoboys (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  cpf TEXT UNIQUE NOT NULL,
  cnh TEXT NOT NULL,
  phone TEXT NOT NULL,
  vehicle_plate TEXT NOT NULL,
  vehicle_type TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  current_location GEOGRAPHY(POINT, 4326),
  current_lat DOUBLE PRECISION,
  current_lng DOUBLE PRECISION,
  location_accuracy DOUBLE PRECISION,
  last_location_update TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Create deliveries table
CREATE TABLE public.deliveries (
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
  pickup_location GEOGRAPHY(POINT, 4326),
  pickup_lat DOUBLE PRECISION,
  pickup_lng DOUBLE PRECISION,
  delivery_location GEOGRAPHY(POINT, 4326),
  delivery_lat DOUBLE PRECISION,
  delivery_lng DOUBLE PRECISION,
  assigned_at TIMESTAMPTZ,
  picked_up_at TIMESTAMPTZ,
  delivered_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create messages table (for chat)
CREATE TABLE public.messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  delivery_id UUID REFERENCES public.deliveries(id) ON DELETE CASCADE,
  sender_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  sender_role TEXT NOT NULL CHECK (sender_role IN ('commerce', 'motoboy')),
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_commerces_user_id ON public.commerces(user_id);
CREATE INDEX idx_motoboys_user_id ON public.motoboys(user_id);
CREATE INDEX idx_motoboys_active ON public.motoboys(is_active);
CREATE INDEX idx_motoboys_location ON public.motoboys USING GIST(current_location);
CREATE INDEX idx_deliveries_commerce_id ON public.deliveries(commerce_id);
CREATE INDEX idx_deliveries_motoboy_id ON public.deliveries(motoboy_id);
CREATE INDEX idx_deliveries_status ON public.deliveries(status);
CREATE INDEX idx_deliveries_created_at ON public.deliveries(created_at DESC);
CREATE INDEX idx_messages_delivery_id ON public.messages(delivery_id);
CREATE INDEX idx_messages_created_at ON public.messages(created_at DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.commerces ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.motoboys ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.deliveries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- RLS Policies for users
CREATE POLICY "Users can view their own data" ON public.users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own data" ON public.users
  FOR UPDATE USING (auth.uid() = id);

-- RLS Policies for commerces
CREATE POLICY "Commerces can view their own data" ON public.commerces
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Commerces can update their own data" ON public.commerces
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Anyone can view commerces" ON public.commerces
  FOR SELECT USING (true);

-- RLS Policies for motoboys
CREATE POLICY "Motoboys can view their own data" ON public.motoboys
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Motoboys can update their own data" ON public.motoboys
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Anyone can view active motoboys" ON public.motoboys
  FOR SELECT USING (is_active = true);

-- RLS Policies for deliveries
CREATE POLICY "Commerces can view their own deliveries" ON public.deliveries
  FOR SELECT USING (
    commerce_id IN (SELECT id FROM public.commerces WHERE user_id = auth.uid())
  );

CREATE POLICY "Motoboys can view assigned deliveries" ON public.deliveries
  FOR SELECT USING (
    motoboy_id IN (SELECT id FROM public.motoboys WHERE user_id = auth.uid())
  );

CREATE POLICY "Commerces can create deliveries" ON public.deliveries
  FOR INSERT WITH CHECK (
    commerce_id IN (SELECT id FROM public.commerces WHERE user_id = auth.uid())
  );

CREATE POLICY "Commerces can update their deliveries" ON public.deliveries
  FOR UPDATE USING (
    commerce_id IN (SELECT id FROM public.commerces WHERE user_id = auth.uid())
  );

CREATE POLICY "Motoboys can update assigned deliveries" ON public.deliveries
  FOR UPDATE USING (
    motoboy_id IN (SELECT id FROM public.motoboys WHERE user_id = auth.uid())
  );

-- RLS Policies for messages
CREATE POLICY "Users can view messages for their deliveries" ON public.messages
  FOR SELECT USING (
    delivery_id IN (
      SELECT id FROM public.deliveries WHERE
        commerce_id IN (SELECT id FROM public.commerces WHERE user_id = auth.uid())
        OR motoboy_id IN (SELECT id FROM public.motoboys WHERE user_id = auth.uid())
    )
  );

CREATE POLICY "Users can create messages for their deliveries" ON public.messages
  FOR INSERT WITH CHECK (
    sender_id = auth.uid() AND
    delivery_id IN (
      SELECT id FROM public.deliveries WHERE
        commerce_id IN (SELECT id FROM public.commerces WHERE user_id = auth.uid())
        OR motoboy_id IN (SELECT id FROM public.motoboys WHERE user_id = auth.uid())
    )
  );

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON public.users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_deliveries_updated_at
  BEFORE UPDATE ON public.deliveries
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Function to sync geography columns with lat/lng
CREATE OR REPLACE FUNCTION sync_location_columns()
RETURNS TRIGGER AS $$
BEGIN
  -- For motoboys table
  IF TG_TABLE_NAME = 'motoboys' THEN
    IF NEW.current_lat IS NOT NULL AND NEW.current_lng IS NOT NULL THEN
      NEW.current_location = ST_SetSRID(ST_MakePoint(NEW.current_lng, NEW.current_lat), 4326)::geography;
    END IF;
  END IF;
  
  -- For deliveries table (pickup)
  IF TG_TABLE_NAME = 'deliveries' THEN
    IF NEW.pickup_lat IS NOT NULL AND NEW.pickup_lng IS NOT NULL THEN
      NEW.pickup_location = ST_SetSRID(ST_MakePoint(NEW.pickup_lng, NEW.pickup_lat), 4326)::geography;
    END IF;
    IF NEW.delivery_lat IS NOT NULL AND NEW.delivery_lng IS NOT NULL THEN
      NEW.delivery_location = ST_SetSRID(ST_MakePoint(NEW.delivery_lng, NEW.delivery_lat), 4326)::geography;
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for location sync
CREATE TRIGGER sync_motoboy_location
  BEFORE INSERT OR UPDATE ON public.motoboys
  FOR EACH ROW
  EXECUTE FUNCTION sync_location_columns();

CREATE TRIGGER sync_delivery_locations
  BEFORE INSERT OR UPDATE ON public.deliveries
  FOR EACH ROW
  EXECUTE FUNCTION sync_location_columns();

-- Function to get nearby motoboys
CREATE OR REPLACE FUNCTION get_nearby_motoboys(
  lat DOUBLE PRECISION,
  lng DOUBLE PRECISION,
  radius_km DOUBLE PRECISION DEFAULT 10
)
RETURNS TABLE (
  id UUID,
  name TEXT,
  phone TEXT,
  vehicle_type TEXT,
  distance_km DOUBLE PRECISION
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    m.id,
    m.name,
    m.phone,
    m.vehicle_type,
    ST_Distance(
      m.current_location,
      ST_SetSRID(ST_MakePoint(lng, lat), 4326)::geography
    ) / 1000 AS distance_km
  FROM public.motoboys m
  WHERE
    m.is_active = true
    AND m.current_location IS NOT NULL
    AND ST_DWithin(
      m.current_location,
      ST_SetSRID(ST_MakePoint(lng, lat), 4326)::geography,
      radius_km * 1000
    )
  ORDER BY distance_km;
END;
$$ LANGUAGE plpgsql;
