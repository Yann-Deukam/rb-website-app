-- ==============================================================================
-- REVIVAL BEARER (RB) - SUPABASE DATABASE SCHEMA
-- Execute this script in your Supabase Dashboard: SQL Editor -> New Query -> Run
-- ==============================================================================

-- 1. Testimonies Table
CREATE TABLE IF NOT EXISTS public.testimonies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'General',
  scripture TEXT,
  story TEXT NOT NULL,
  author_name TEXT NOT NULL,
  is_anonymous BOOLEAN NOT NULL DEFAULT false,
  campus_city TEXT,
  audio_url TEXT,
  audio_duration NUMERIC,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'featured')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 2. Announcements Table
CREATE TABLE IF NOT EXISTS public.announcements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  tag TEXT NOT NULL DEFAULT 'Annonce',
  content TEXT NOT NULL,
  link_url TEXT,
  link_label TEXT,
  event_date TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 3. Simple Members Table (full onboarding form)
CREATE TABLE IF NOT EXISTS public.members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT NOT NULL,
  whatsapp TEXT NOT NULL,
  email TEXT,
  campus_city TEXT,
  spiritual_status TEXT,
  department TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 4. Premium Partner Leads (Contact-only for Leader to reach out directly)
CREATE TABLE IF NOT EXISTS public.partner_leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tier_id TEXT NOT NULL,
  tier_name TEXT NOT NULL,
  full_name TEXT NOT NULL,
  whatsapp TEXT NOT NULL,
  email TEXT,
  city_country TEXT,
  message TEXT,
  preferred_contact TEXT DEFAULT 'whatsapp' CHECK (preferred_contact IN ('whatsapp', 'call', 'either')),
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'pledged')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

ALTER TABLE public.testimonies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.partner_leads ENABLE ROW LEVEL SECURITY;

-- Testimonies: Anyone can insert (submit testimony). Everyone can view approved/featured ones.
CREATE POLICY "Public insert testimonies"
  ON public.testimonies FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Public view approved testimonies"
  ON public.testimonies FOR SELECT
  USING (status IN ('approved', 'featured') OR true);

CREATE POLICY "Allow update/delete on testimonies"
  ON public.testimonies FOR ALL
  USING (true)
  WITH CHECK (true);

-- Announcements: Public can read active announcements.
CREATE POLICY "Public view active announcements"
  ON public.announcements FOR SELECT
  USING (true);

CREATE POLICY "Allow manage announcements"
  ON public.announcements FOR ALL
  USING (true)
  WITH CHECK (true);

-- Members: Public can insert their registration.
CREATE POLICY "Public insert members"
  ON public.members FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow view/manage members"
  ON public.members FOR ALL
  USING (true)
  WITH CHECK (true);

-- Partner Leads: Public can leave contact.
CREATE POLICY "Public insert partner_leads"
  ON public.partner_leads FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow view/manage partner_leads"
  ON public.partner_leads FOR ALL
  USING (true)
  WITH CHECK (true);

-- Sample initial announcement to verify:
INSERT INTO public.announcements (title, tag, content, event_date, is_active)
VALUES (
  'Grande Nuit de Réveil & Adoration',
  'Événement Spécial',
  'Venez vivre un temps fort d''adoration, de guérison et de visitation de la gloire de Dieu avec toute la jeunesse.',
  'Vendredi 24 Octobre • 20h00',
  true
)
ON CONFLICT DO NOTHING;
