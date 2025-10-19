import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('⚠️ Supabase credentials not configured. Using localStorage fallback mode.');
}

export const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    })
  : null;

// Database Types
export type User = {
  id: string;
  email: string;
  role: 'commerce' | 'motoboy';
  created_at: string;
  updated_at: string;
};

export type Commerce = {
  id: string;
  user_id: string;
  name: string;
  cnpj: string;
  address: string;
  phone: string;
  created_at: string;
};

export type Motoboy = {
  id: string;
  user_id: string;
  name: string;
  cpf: string;
  cnh: string;
  phone: string;
  vehicle_plate: string;
  vehicle_type: string;
  is_active: boolean;
  current_lat?: number;
  current_lng?: number;
  location_accuracy?: number;
  last_location_update?: string;
  created_at: string;
};

export type Delivery = {
  id: string;
  commerce_id: string;
  motoboy_id?: string;
  customer_name: string;
  customer_address: string;
  customer_phone: string;
  items: string;
  total_value: number;
  status: 'pending' | 'assigned' | 'in_transit' | 'delivered' | 'cancelled';
  qr_code: string;
  pickup_lat?: number;
  pickup_lng?: number;
  delivery_lat?: number;
  delivery_lng?: number;
  assigned_at?: string;
  picked_up_at?: string;
  delivered_at?: string;
  created_at: string;
  updated_at: string;
};

export type Message = {
  id: string;
  delivery_id: string;
  sender_id: string;
  sender_role: 'commerce' | 'motoboy';
  message: string;
  created_at: string;
};
