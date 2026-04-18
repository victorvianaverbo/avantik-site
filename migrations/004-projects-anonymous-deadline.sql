-- MIGRACAO 004: Oportunidades anonimas + prazo de cotacao
-- Execute no Supabase SQL Editor

ALTER TABLE public.projects
  ADD COLUMN IF NOT EXISTS deadline DATE,
  ADD COLUMN IF NOT EXISTS is_anonymous BOOLEAN DEFAULT true;

-- Indice para filtrar por prazo
CREATE INDEX IF NOT EXISTS idx_projects_deadline ON public.projects(deadline);
