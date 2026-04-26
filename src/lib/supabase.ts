import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Room = {
  id: number;
  name: string;
  price: number;
  status: 'Available' | 'Occupied';
  occupant: string | null;
  description: string | null;
  facilities: string[];
  image: string;
  created_at?: string;
};
