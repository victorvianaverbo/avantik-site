-- MIGRACAO 018: Plano de anuidade para CONTRATANTES
-- Execute no Supabase SQL Editor.
--
-- Modelo: contratante continua GRATIS (gratis + comissao 30%). Adiciona-se uma
-- opcao paga: anuidade R$ 2.000/ano que da 3 "palestras gratis" no ano, onde a
-- AVANTIK BANCA O CACHE do palestrante (o contratante nao paga a palestra e nao
-- ha comissao de 30% nessas contratacoes).

-- 1. Campos de assinatura no contractor
ALTER TABLE public.contractors
  ADD COLUMN IF NOT EXISTS plan TEXT DEFAULT 'free',                  -- 'free' | 'anual'
  ADD COLUMN IF NOT EXISTS subscription_paid_until TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS free_talks_total INT DEFAULT 0,
  ADD COLUMN IF NOT EXISTS free_talks_used INT DEFAULT 0,
  ADD COLUMN IF NOT EXISTS mp_preference_id TEXT,
  ADD COLUMN IF NOT EXISTS mp_payment_id TEXT;

-- 2. payments: permitir registros de contratante
ALTER TABLE public.payments
  ALTER COLUMN speaker_id DROP NOT NULL;
ALTER TABLE public.payments
  ADD COLUMN IF NOT EXISTS contractor_id UUID REFERENCES public.contractors(id);

-- Exatamente um dos dois deve estar preenchido
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'payments_owner_chk'
  ) THEN
    ALTER TABLE public.payments
      ADD CONSTRAINT payments_owner_chk
      CHECK ((speaker_id IS NOT NULL) <> (contractor_id IS NOT NULL));
  END IF;
END$$;

-- 3. commissions: distinguir comissao normal de "palestra gratis" (Avantik paga o cache)
ALTER TABLE public.commissions
  ADD COLUMN IF NOT EXISTS tipo TEXT DEFAULT 'comissao';  -- 'comissao' | 'palestra_gratis'

-- 4. RPC atomica: usar 1 palestra gratis da anuidade ao aceitar uma candidatura.
--    Valida posse do projeto, plano ativo e saldo; aceita a candidatura, debita o
--    credito e registra que a Avantik deve o cache ao palestrante.
CREATE OR REPLACE FUNCTION public.use_free_talk(p_application_id UUID)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_contractor   public.contractors%ROWTYPE;
  v_app          public.project_applications%ROWTYPE;
  v_project      public.projects%ROWTYPE;
BEGIN
  -- Contratante chamador
  SELECT * INTO v_contractor FROM public.contractors WHERE auth_id = auth.uid();
  IF v_contractor.id IS NULL THEN
    RAISE EXCEPTION 'not_a_contractor';
  END IF;

  -- Plano ativo + saldo
  IF v_contractor.plan <> 'anual'
     OR v_contractor.subscription_paid_until IS NULL
     OR v_contractor.subscription_paid_until <= now() THEN
    RAISE EXCEPTION 'no_active_plan';
  END IF;
  IF v_contractor.free_talks_used >= v_contractor.free_talks_total THEN
    RAISE EXCEPTION 'no_credits_left';
  END IF;

  -- Candidatura + projeto, validando posse
  SELECT * INTO v_app FROM public.project_applications WHERE id = p_application_id;
  IF v_app.id IS NULL THEN
    RAISE EXCEPTION 'application_not_found';
  END IF;
  SELECT * INTO v_project FROM public.projects WHERE id = v_app.project_id;
  IF v_project.contractor_id <> v_contractor.id THEN
    RAISE EXCEPTION 'not_your_project';
  END IF;
  IF v_app.status = 'aceita' THEN
    RAISE EXCEPTION 'already_accepted';
  END IF;

  -- Aceita a candidatura
  UPDATE public.project_applications
     SET status = 'aceita', accepted_at = now()
   WHERE id = p_application_id;

  -- Debita 1 credito
  UPDATE public.contractors
     SET free_talks_used = free_talks_used + 1
   WHERE id = v_contractor.id;

  -- Registra que a Avantik deve o cache ao palestrante (tipo = palestra_gratis,
  -- sem comissao). commission_amount guarda o valor a pagar ao palestrante.
  INSERT INTO public.commissions (
    application_id, speaker_id, contractor_id, proposed_price,
    commission_rate, commission_amount, status, tipo, notes
  ) VALUES (
    p_application_id, v_app.speaker_id, v_contractor.id, COALESCE(v_app.proposed_price, 0),
    0, COALESCE(v_app.proposed_price, 0), 'pendente', 'palestra_gratis',
    'Palestra gratis da anuidade - Avantik banca o cache do palestrante.'
  );

  RETURN json_build_object(
    'ok', true,
    'free_talks_used', v_contractor.free_talks_used + 1,
    'free_talks_total', v_contractor.free_talks_total
  );
END;
$$;

GRANT EXECUTE ON FUNCTION public.use_free_talk(UUID) TO authenticated;
