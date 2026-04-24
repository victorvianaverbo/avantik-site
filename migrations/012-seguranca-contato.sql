-- MIGRACAO 012: Proteger email/phone dos palestrantes de leitura publica (LGPD).
-- Execute no SQL Editor do Supabase APOS rodar 011.
--
-- Antes desta migracao: qualquer anonimo podia fazer SELECT * FROM speakers
-- e receber todos os emails + telefones via REST API (policy USING (true)).
--
-- Depois desta migracao:
-- - Anon so consegue ler via view `speakers_public` (SEM email/phone)
-- - Speakers autenticados leem seu proprio registro completo
-- - Contratantes autenticados com proposta ACEITA leem contato dos speakers aceitos
-- - Busca por email no primeiro-acesso usa RPC `find_speaker_by_email` (SECURITY DEFINER)

-- 1. VIEW PUBLICA (sem email/phone) — pagina do diretorio, home, perfil publico
CREATE OR REPLACE VIEW public.speakers_public AS
SELECT id, auth_id, slug, plan, name, city, state, bio, photo_url, video_url,
       price_min, price_max, instagram, linkedin, website, active, rating,
       has_seal, did_apogeu, created_at
FROM public.speakers;

GRANT SELECT ON public.speakers_public TO anon, authenticated;

-- 2. RLS NOVA: restringe SELECT direto na tabela speakers
DROP POLICY IF EXISTS "Leitura_de_palestrantes_publica" ON public.speakers;

-- 2a. Service role (importadores) sempre le tudo — nao precisa policy,
--     service_role ja bypass RLS por padrao.

-- 2b. Authenticated users leem seu proprio perfil
DROP POLICY IF EXISTS "Speakers leem proprio perfil" ON public.speakers;
CREATE POLICY "Speakers leem proprio perfil" ON public.speakers
  FOR SELECT
  TO authenticated
  USING (auth_id = auth.uid());

-- 2c. Contratantes autenticados com proposta aceita leem o contato do speaker aceito
DROP POLICY IF EXISTS "Contratantes leem contato de speakers aceitos" ON public.speakers;
CREATE POLICY "Contratantes leem contato de speakers aceitos" ON public.speakers
  FOR SELECT
  TO authenticated
  USING (
    id IN (
      SELECT pa.speaker_id
      FROM public.project_applications pa
      JOIN public.projects p ON p.id = pa.project_id
      JOIN public.contractors c ON c.id = p.contractor_id
      WHERE c.auth_id = auth.uid()
        AND pa.status = 'aceita'
    )
  );

-- 3. RPC para busca por email no fluxo /primeiro-acesso/ (usuario ainda nao logado)
--    Retorna somente id, name, auth_id — nao vaza mais nada.
CREATE OR REPLACE FUNCTION public.find_speaker_by_email(p_email TEXT)
RETURNS TABLE (id UUID, name TEXT, auth_id UUID)
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT s.id, s.name, s.auth_id
  FROM public.speakers s
  WHERE lower(s.email) = lower(p_email)
  LIMIT 1;
$$;

GRANT EXECUTE ON FUNCTION public.find_speaker_by_email(TEXT) TO anon, authenticated;

-- 4. Atualizar default do DATABASE_SETUP: policy publica restrita (documentacao)
--    Futuros clones do banco ja nascem seguros.
