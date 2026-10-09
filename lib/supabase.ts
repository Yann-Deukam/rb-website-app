import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  "";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface TestimonyRecord {
  id?: string;
  title: string;
  category: string;
  scripture?: string | null;
  story: string;
  author_name: string;
  is_anonymous: boolean;
  campus_city?: string | null;
  audio_url?: string | null;
  audio_duration?: number | null;
  status?: "pending" | "approved" | "featured";
  created_at?: string;
}

export interface MemberRecord {
  id?: string;
  full_name: string;
  whatsapp: string;
  email?: string | null;
  campus_city?: string | null;
  spiritual_status?: string | null;
  department?: string | null;
  notes?: string | null;
  created_at?: string;
}

export interface PartnerLeadRecord {
  id?: string;
  tier_id: string;
  tier_name: string;
  full_name: string;
  whatsapp: string;
  email?: string | null;
  city_country?: string | null;
  message?: string | null;
  preferred_contact?: "whatsapp" | "call" | "either";
  status?: "new" | "contacted" | "pledged";
  created_at?: string;
}

export interface AnnouncementRecord {
  id?: string;
  title: string;
  tag: string;
  content: string;
  link_url?: string | null;
  link_label?: string | null;
  event_date?: string | null;
  is_active: boolean;
  created_at?: string;
}
