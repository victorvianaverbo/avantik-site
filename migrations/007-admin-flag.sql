-- MIGRACAO 007: Flag de admin para Avantik
-- Execute no Supabase SQL Editor

ALTER TABLE public.contractors
  ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT false;

-- Marcar Victor como admin (Avantik)
UPDATE public.contractors
SET is_admin = true
WHERE email = 'vianavictorv@gmail.com';
