-- MIGRACAO 011: Novos tiers (profissional/premium/elite) + sistema de selos.
-- Execute no SQL Editor do Supabase.
--
-- Mudancas:
-- 1. Adiciona flags de gamificacao: has_seal (Selo Palco) e did_apogeu (graduado do curso Apogeu).
-- 2. Renomeia plan 'essencial' (gratis, descontinuado) -> 'profissional' e 'destaque' -> 'elite'.
-- 3. Nova matriz de planos: profissional (R$67, 1 palestra), premium (R$147, 3), elite (R$297, 10).
-- 4. Constraint de integridade nos valores permitidos de plan.

-- 1. Flags de gamificacao
ALTER TABLE public.speakers ADD COLUMN IF NOT EXISTS has_seal   BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE public.speakers ADD COLUMN IF NOT EXISTS did_apogeu BOOLEAN NOT NULL DEFAULT false;

-- 2. Migrar registros existentes para os novos nomes de tier
UPDATE public.speakers SET plan = 'profissional' WHERE plan = 'essencial';
UPDATE public.speakers SET plan = 'elite'        WHERE plan = 'destaque';

-- 3. Novo default
ALTER TABLE public.speakers ALTER COLUMN plan SET DEFAULT 'profissional';

-- 4. Constraint de integridade (rodar APOS os UPDATEs acima)
ALTER TABLE public.speakers DROP CONSTRAINT IF EXISTS speakers_plan_check;
ALTER TABLE public.speakers
  ADD CONSTRAINT speakers_plan_check CHECK (plan IN ('profissional','premium','elite'));

-- 5. Indice opcional para filtros futuros por selo (diretorio "so com selo")
CREATE INDEX IF NOT EXISTS idx_speakers_has_seal ON public.speakers(has_seal) WHERE has_seal = true;
