-- MIGRACAO 022: vertical Setor Publico (embaixador Alexandre Mansur)
-- Execute no SQL Editor do Supabase (depois da 021).
--
-- A vertical recruta palestrantes que querem atuar no mercado publico
-- (prefeituras, orgaos, associacoes). Duas colunas, nao uma:
--
--   public_sector_interest -> AUTODECLARADO pelo palestrante no cadastro/perfil.
--                             Privado. E a fila de trabalho do embaixador.
--   public_sector_ready    -> CURADO pela Avantik (documentacao e notorio saber
--                             validados). Unica que vira badge e filtro publico.
--
-- Por que separar: se a flag exposta fosse autodeclarada, todo palestrante
-- marcaria o checkbox e o badge perderia valor perante o contratante em uma
-- semana. E o mesmo desenho que ja sustenta has_seal (curado/exposto) e
-- free_talk_eligible (curado/oculto).

-- =============================================================
-- 1. COLUNAS
-- =============================================================

ALTER TABLE public.speakers
  ADD COLUMN IF NOT EXISTS public_sector_interest BOOLEAN NOT NULL DEFAULT false;

ALTER TABLE public.speakers
  ADD COLUMN IF NOT EXISTS public_sector_ready BOOLEAN NOT NULL DEFAULT false;

COMMENT ON COLUMN public.speakers.public_sector_interest IS
  'Autodeclarado no cadastro/perfil: quer atuar no setor publico. Privado (fora da view publica) — fila de curadoria do embaixador.';
COMMENT ON COLUMN public.speakers.public_sector_ready IS
  'Curado pela Avantik: documentacao e notorio saber validados. Alimenta o badge e o filtro do diretorio.';

-- Indices parciais: as duas listas sao minoria da tabela.
CREATE INDEX IF NOT EXISTS idx_speakers_public_sector_ready
  ON public.speakers(public_sector_ready) WHERE public_sector_ready = true;

CREATE INDEX IF NOT EXISTS idx_speakers_public_sector_interest
  ON public.speakers(public_sector_interest) WHERE public_sector_interest = true;

-- =============================================================
-- 2. VIEW PUBLICA
-- =============================================================
-- public_sector_ready entra NO FIM do SELECT. CREATE OR REPLACE VIEW exige que
-- as colunas existentes mantenham nome, tipo e ordem; so aceita coluna nova no
-- final. Inserir no meio da lista da erro "cannot change name of view column".
-- public_sector_interest fica DE FORA (privado).

CREATE OR REPLACE VIEW public.speakers_public AS
SELECT id, auth_id, slug, plan, name, city, state, bio, photo_url, video_url,
       price_min, price_max, instagram, linkedin, website, active, rating,
       has_seal, did_apogeu, created_at,
       public_sector_ready
FROM public.speakers;

GRANT SELECT ON public.speakers_public TO anon, authenticated;

-- =============================================================
-- 3. ENDURECIMENTO: flags de curadoria nao sao autoconcediveis
-- =============================================================
-- Ate aqui, has_seal e did_apogeu podiam ser setados pelo proprio palestrante
-- via PATCH direto na API (a policy Permitir_update_proprio_palestrante libera
-- UPDATE da propria linha, e o trigger da 016 so protegia colunas de billing).
-- Como public_sector_ready nasceria com o mesmo buraco, fecha os tres de uma vez.
--
-- Recria a funcao da 016 acrescentando o bloco de curadoria. O trigger
-- speakers_prevent_billing_self_update continua o mesmo — so o corpo muda.

CREATE OR REPLACE FUNCTION public.prevent_speaker_billing_self_update()
RETURNS trigger
LANGUAGE plpgsql
SECURITY INVOKER
AS $$
BEGIN
  -- service_role (webhook, painel admin, scripts) pode mudar tudo
  IF auth.role() = 'service_role' THEN
    RETURN NEW;
  END IF;

  -- --- billing (migracao 016) ---
  IF NEW.subscription_paid_until IS DISTINCT FROM OLD.subscription_paid_until THEN
    RAISE EXCEPTION 'subscription_paid_until so pode ser alterado pelo webhook de pagamento';
  END IF;
  IF NEW.mp_payment_id IS DISTINCT FROM OLD.mp_payment_id THEN
    RAISE EXCEPTION 'mp_payment_id so pode ser alterado pelo webhook de pagamento';
  END IF;
  IF NEW.mp_preference_id IS DISTINCT FROM OLD.mp_preference_id THEN
    RAISE EXCEPTION 'mp_preference_id so pode ser alterado pelo backend de checkout';
  END IF;

  -- --- curadoria (migracao 022) ---
  -- Selos que a Avantik concede. O palestrante declara INTERESSE
  -- (public_sector_interest, livre); quem habilita e a curadoria.
  IF NEW.public_sector_ready IS DISTINCT FROM OLD.public_sector_ready THEN
    RAISE EXCEPTION 'public_sector_ready so pode ser alterado pela curadoria da Avantik';
  END IF;
  IF NEW.has_seal IS DISTINCT FROM OLD.has_seal THEN
    RAISE EXCEPTION 'has_seal so pode ser alterado pela curadoria da Avantik';
  END IF;
  IF NEW.did_apogeu IS DISTINCT FROM OLD.did_apogeu THEN
    RAISE EXCEPTION 'did_apogeu so pode ser alterado pela curadoria da Avantik';
  END IF;

  RETURN NEW;
END;
$$;

-- Trigger ja existe desde a 016; recriado aqui por idempotencia.
DROP TRIGGER IF EXISTS speakers_prevent_billing_self_update ON public.speakers;
CREATE TRIGGER speakers_prevent_billing_self_update
  BEFORE UPDATE ON public.speakers
  FOR EACH ROW
  EXECUTE FUNCTION public.prevent_speaker_billing_self_update();

-- =============================================================
-- 4. VERIFICACAO
-- =============================================================
-- Depois de rodar, confirme que a view expoe a coluna nova:
--   SELECT public_sector_ready FROM public.speakers_public LIMIT 1;
-- E que o admin (service_role) ainda consegue habilitar alguem:
--   UPDATE public.speakers SET public_sector_ready = true WHERE slug = '<slug>';
