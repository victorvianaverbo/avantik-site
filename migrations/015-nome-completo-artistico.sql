-- MIGRACAO 015: Separar nome completo (privado) de nome artistico (publico).
-- Execute no SQL Editor do Supabase.
--
-- Decisao: a coluna `name` mantem semantica de NOME ARTISTICO (exibido publicamente)
-- pra nao quebrar todo o codigo que ja le speaker.name. Nova coluna `full_name`
-- guarda o nome civil completo, usado em contratos / nota fiscal — nao vai
-- para a view publica.

-- 1. Adiciona coluna nome completo
ALTER TABLE public.speakers
  ADD COLUMN IF NOT EXISTS full_name TEXT;

-- 2. Backfill: copia o name atual para full_name (preserva dado existente)
UPDATE public.speakers SET full_name = name WHERE full_name IS NULL;

-- 3. Recria a view publica — full_name fica DE FORA (privado por LGPD)
CREATE OR REPLACE VIEW public.speakers_public AS
SELECT id, auth_id, slug, plan, name, city, state, bio, photo_url, video_url,
       price_min, price_max, instagram, linkedin, website, active, rating,
       has_seal, did_apogeu, created_at
FROM public.speakers;

GRANT SELECT ON public.speakers_public TO anon, authenticated;

-- 4. Documentacao das colunas
COMMENT ON COLUMN public.speakers.name IS 'Nome artistico — exibido publicamente em listagens e perfil';
COMMENT ON COLUMN public.speakers.full_name IS 'Nome completo (civil) — privado, uso administrativo (contratos, NF)';
