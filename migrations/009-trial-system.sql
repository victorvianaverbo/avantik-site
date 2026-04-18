-- MIGRACAO 009: Sistema de trial de 15 dias
-- Rode no SQL Editor do Supabase.
--
-- Modelo: quando o palestrante ativa a conta (primeiro-acesso ou signup novo),
-- setamos trial_started_at = NOW(). Enquanto NOW() < trial_started_at + 15 days
-- ele tem acesso full ao plano que escolheu. Apos isso, deve assinar.
--
-- Palestrantes importados ainda sem auth_id tem trial_started_at = NULL
-- (trial ainda nao comecou).

ALTER TABLE public.speakers
  ADD COLUMN IF NOT EXISTS trial_started_at TIMESTAMPTZ;

-- Indice para queries de filtragem por trial ativo
CREATE INDEX IF NOT EXISTS idx_speakers_trial_started_at
  ON public.speakers(trial_started_at);
