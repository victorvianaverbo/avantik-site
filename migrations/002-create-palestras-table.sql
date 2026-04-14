-- MIGRACAO 002: Tabela de palestras (talks individuais por palestrante)
-- Execute este SQL no Supabase SQL Editor
-- Resolve: separar palestras com precos diferentes por tema

-- 1. Adicionar campos extras na tabela de temas
ALTER TABLE public.themes ADD COLUMN IF NOT EXISTS description TEXT;
ALTER TABLE public.themes ADD COLUMN IF NOT EXISTS icon TEXT;

-- Inserir temas adicionais que faltam
INSERT INTO public.themes (name, slug)
VALUES
  ('Outubro Rosa', 'outubro-rosa'),
  ('SIPAT', 'sipat')
ON CONFLICT (slug) DO NOTHING;

-- 2. Criar tabela de palestras
CREATE TABLE IF NOT EXISTS public.palestras (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  speaker_id UUID NOT NULL REFERENCES public.speakers(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  slug TEXT NOT NULL,
  description TEXT,
  theme_id UUID REFERENCES public.themes(id),
  duration_minutes INTEGER,
  format TEXT DEFAULT 'presencial',
  price_min INTEGER,
  price_max INTEGER,
  target_audience TEXT,
  objectives TEXT[],
  video_url TEXT,
  image_url TEXT,
  active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(speaker_id, slug)
);

CREATE INDEX IF NOT EXISTS idx_palestras_speaker ON public.palestras(speaker_id);
CREATE INDEX IF NOT EXISTS idx_palestras_theme ON public.palestras(theme_id);
CREATE INDEX IF NOT EXISTS idx_palestras_active ON public.palestras(active) WHERE active = true;

-- 3. RLS para palestras
ALTER TABLE public.palestras ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Leitura_publica_de_palestras" ON public.palestras
  FOR SELECT USING (true);

CREATE POLICY "Permitir_cadastro_de_palestra" ON public.palestras
  FOR INSERT WITH CHECK (
    speaker_id IN (SELECT id FROM public.speakers WHERE auth_id = auth.uid())
  );

CREATE POLICY "Permitir_update_propria_palestra" ON public.palestras
  FOR UPDATE USING (
    speaker_id IN (SELECT id FROM public.speakers WHERE auth_id = auth.uid())
  ) WITH CHECK (
    speaker_id IN (SELECT id FROM public.speakers WHERE auth_id = auth.uid())
  );

CREATE POLICY "Permitir_delete_propria_palestra" ON public.palestras
  FOR DELETE USING (
    speaker_id IN (SELECT id FROM public.speakers WHERE auth_id = auth.uid())
  );

-- Permitir insert anonimo (para o fluxo de cadastro de palestrante)
CREATE POLICY "Permitir_cadastro_anonimo_de_palestra" ON public.palestras
  FOR INSERT WITH CHECK (true);

-- 4. Migrar dados existentes de speaker_themes para palestras
-- Cada tema vinculado a um palestrante vira uma palestra inicial
INSERT INTO public.palestras (speaker_id, title, slug, theme_id, price_min, price_max, format)
SELECT
  st.speaker_id,
  t.name,
  t.slug || '-' || LEFT(st.speaker_id::text, 8),
  st.theme_id,
  s.price_min,
  s.price_max,
  'presencial'
FROM public.speaker_themes st
JOIN public.themes t ON t.id = st.theme_id
JOIN public.speakers s ON s.id = st.speaker_id
ON CONFLICT (speaker_id, slug) DO NOTHING;
