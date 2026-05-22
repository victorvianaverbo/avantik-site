-- MIGRACAO 020: palestras gratis da anuidade restritas ao grupo curado/oculto
-- Execute no SQL Editor do Supabase (depois da 018 e 019).
--
-- Recria use_free_talk validando que o palestrante da candidatura tem
-- speakers.free_talk_eligible = true. O contratante NAO sabe quem e elegivel;
-- a checagem acontece no servidor no momento do aceite.

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
  v_eligible     boolean;
BEGIN
  SELECT * INTO v_contractor FROM public.contractors WHERE auth_id = auth.uid();
  IF v_contractor.id IS NULL THEN
    RAISE EXCEPTION 'not_a_contractor';
  END IF;

  IF v_contractor.plan <> 'anual'
     OR v_contractor.subscription_paid_until IS NULL
     OR v_contractor.subscription_paid_until <= now() THEN
    RAISE EXCEPTION 'no_active_plan';
  END IF;
  IF v_contractor.free_talks_used >= v_contractor.free_talks_total THEN
    RAISE EXCEPTION 'no_credits_left';
  END IF;

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

  -- Palestra gratis so vale para o grupo curado pela Avantik
  SELECT free_talk_eligible INTO v_eligible FROM public.speakers WHERE id = v_app.speaker_id;
  IF v_eligible IS NOT TRUE THEN
    RAISE EXCEPTION 'speaker_not_eligible';
  END IF;

  UPDATE public.project_applications
     SET status = 'aceita', accepted_at = now()
   WHERE id = p_application_id;

  UPDATE public.contractors
     SET free_talks_used = free_talks_used + 1
   WHERE id = v_contractor.id;

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

-- Helper que decide se a opcao "palestra gratis" deve aparecer para o contratante,
-- sem revelar o motivo (mantem o grupo curado oculto). Retorna apenas true/false.
CREATE OR REPLACE FUNCTION public.free_talk_offer(p_application_id UUID)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_contractor public.contractors%ROWTYPE;
  v_app        public.project_applications%ROWTYPE;
  v_project    public.projects%ROWTYPE;
  v_eligible   boolean;
BEGIN
  SELECT * INTO v_contractor FROM public.contractors WHERE auth_id = auth.uid();
  IF v_contractor.id IS NULL THEN RETURN false; END IF;
  IF v_contractor.plan <> 'anual'
     OR v_contractor.subscription_paid_until IS NULL
     OR v_contractor.subscription_paid_until <= now() THEN RETURN false; END IF;
  IF v_contractor.free_talks_used >= v_contractor.free_talks_total THEN RETURN false; END IF;

  SELECT * INTO v_app FROM public.project_applications WHERE id = p_application_id;
  IF v_app.id IS NULL OR v_app.status = 'aceita' THEN RETURN false; END IF;
  SELECT * INTO v_project FROM public.projects WHERE id = v_app.project_id;
  IF v_project.contractor_id <> v_contractor.id THEN RETURN false; END IF;

  SELECT free_talk_eligible INTO v_eligible FROM public.speakers WHERE id = v_app.speaker_id;
  RETURN v_eligible IS TRUE;
END;
$$;

GRANT EXECUTE ON FUNCTION public.free_talk_offer(UUID) TO authenticated;
