-- MIGRACAO 013: RPC SECURITY DEFINER para vincular auth_id no primeiro acesso.
-- Execute no SQL Editor do Supabase APOS rodar 012.
--
-- Problema: migration 012 restringiu SELECT em speakers para
--   authenticated com auth_id = auth.uid(). Durante /primeiro-acesso/,
--   o user acabou de fazer signUp mas speakers.auth_id ainda e NULL,
--   entao a policy de SELECT nao casa e o UPDATE (que precisa localizar
--   a linha via RLS) afeta 0 rows silenciosamente. Resultado: o speaker
--   fica orfao, header nunca acha perfil, aparenta deslogado.
--
-- Solucao: RPC com SECURITY DEFINER faz o UPDATE bypassando RLS,
-- mas continua segura porque:
--   1. So permite vincular quando speakers.auth_id ainda e NULL
--   2. So permite vincular quando o email do speaker BATER com o email
--      do auth.users correspondente ao p_auth_id
--   3. O p_auth_id tem que ser um user real de auth.users

CREATE OR REPLACE FUNCTION public.link_speaker_auth(p_speaker_id UUID, p_auth_id UUID)
RETURNS TABLE (id UUID, auth_id UUID)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_speaker_email TEXT;
  v_auth_email TEXT;
BEGIN
  -- Busca email do speaker alvo
  SELECT s.email INTO v_speaker_email
  FROM public.speakers s
  WHERE s.id = p_speaker_id AND s.auth_id IS NULL;

  IF v_speaker_email IS NULL THEN
    RAISE EXCEPTION 'Speaker nao encontrado ou ja vinculado';
  END IF;

  -- Busca email do auth user
  SELECT u.email INTO v_auth_email
  FROM auth.users u
  WHERE u.id = p_auth_id;

  IF v_auth_email IS NULL THEN
    RAISE EXCEPTION 'Auth user nao encontrado';
  END IF;

  -- Emails precisam bater (case-insensitive)
  IF lower(v_speaker_email) <> lower(v_auth_email) THEN
    RAISE EXCEPTION 'Email do speaker nao bate com email do auth user';
  END IF;

  -- OK, faz o link
  RETURN QUERY
  UPDATE public.speakers s
  SET auth_id = p_auth_id
  WHERE s.id = p_speaker_id AND s.auth_id IS NULL
  RETURNING s.id, s.auth_id;
END;
$$;

GRANT EXECUTE ON FUNCTION public.link_speaker_auth(UUID, UUID) TO anon, authenticated;

-- Back-fill: vincular todos os palestrantes orfaos cujo email bate
-- com um auth.users ja existente (fix retroativo do bug).
UPDATE public.speakers s
SET auth_id = u.id
FROM auth.users u
WHERE lower(s.email) = lower(u.email)
  AND s.auth_id IS NULL
  AND u.email_confirmed_at IS NOT NULL;
