-- MIGRACAO 017: RPC de estatisticas para o Dashboard Gerencial (admin)
-- Execute no Supabase SQL Editor.
--
-- speakers e payments tem RLS restritiva (admin nao le tudo via query direta).
-- Esta funcao roda como SECURITY DEFINER, valida que o chamador e admin
-- e retorna APENAS contagens agregadas (sem PII).

CREATE OR REPLACE FUNCTION public.admin_dashboard_stats()
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  result json;
BEGIN
  -- Guard: somente admins
  IF NOT EXISTS (
    SELECT 1 FROM public.contractors
    WHERE auth_id = auth.uid() AND is_admin = true
  ) THEN
    RAISE EXCEPTION 'forbidden';
  END IF;

  SELECT json_build_object(
    'speakers_total',      (SELECT count(*) FROM public.speakers),
    'speakers_active',     (SELECT count(*) FROM public.speakers WHERE active = true),

    -- Estados de assinatura (pago tem prioridade; trial = 15 dias do trial_started_at)
    'paid_active',         (SELECT count(*) FROM public.speakers
                              WHERE subscription_paid_until IS NOT NULL
                                AND subscription_paid_until > now()),
    'trial_active',        (SELECT count(*) FROM public.speakers
                              WHERE (subscription_paid_until IS NULL OR subscription_paid_until <= now())
                                AND trial_started_at IS NOT NULL
                                AND now() <= trial_started_at + interval '15 days'),
    'expired',             (SELECT count(*) FROM public.speakers
                              WHERE (subscription_paid_until IS NULL OR subscription_paid_until <= now())
                                AND (trial_started_at IS NULL OR now() > trial_started_at + interval '15 days')
                                AND (trial_started_at IS NOT NULL OR subscription_paid_until IS NOT NULL)),

    -- Pagantes por plano
    'paid_profissional',   (SELECT count(*) FROM public.speakers
                              WHERE subscription_paid_until > now() AND plan = 'profissional'),
    'paid_premium',        (SELECT count(*) FROM public.speakers
                              WHERE subscription_paid_until > now() AND plan = 'premium'),
    'paid_elite',          (SELECT count(*) FROM public.speakers
                              WHERE subscription_paid_until > now() AND plan = 'elite'),

    -- Novos cadastros de palestrantes
    'speakers_new_7d',     (SELECT count(*) FROM public.speakers
                              WHERE created_at >= now() - interval '7 days'),
    'speakers_new_30d',    (SELECT count(*) FROM public.speakers
                              WHERE created_at >= now() - interval '30 days'),

    -- Contratantes
    'contractors_total',   (SELECT count(*) FROM public.contractors),
    'contractors_new_30d', (SELECT count(*) FROM public.contractors
                              WHERE created_at >= now() - interval '30 days'),

    -- Projetos e candidaturas
    'projects_total',      (SELECT count(*) FROM public.projects),
    'projects_open',       (SELECT count(*) FROM public.projects WHERE status = 'aberto'),
    'applications_total',  (SELECT count(*) FROM public.project_applications)
  ) INTO result;

  RETURN result;
END;
$$;

-- Permite que usuarios autenticados chamem (o guard interno bloqueia nao-admins)
GRANT EXECUTE ON FUNCTION public.admin_dashboard_stats() TO authenticated;
