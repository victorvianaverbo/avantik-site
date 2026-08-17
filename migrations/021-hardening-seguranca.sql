-- MIGRACAO 021: Hardening de seguranca (RLS + anti-fraude).
-- Execute no SQL Editor do Supabase (projeto de PRODUCAO: ajokzpjguhfxxudteetr)
-- APOS rodar a 020.
--
-- Fecha os furos encontrados na auditoria de 2026-07-21:
--   1. contractors com leitura publica (vazava nome/email/telefone/is_admin de
--      todos os contratantes so com a anon key).
--   2. speakers com UPDATE anonimo (policy "Permitir_vincular_auth_id") que
--      permitia sequestrar perfis nao-vinculados e exfiltrar email/telefone.
--   3. contractors sem trigger anti-fraude: contratante se auto-concedia
--      plan='anual' + free_talks e virava is_admin=true via PATCH direto.
--
-- Nenhuma dessas mudancas exige alteracao no frontend: todas as leituras de
-- contractors no site sao de linha propria (auth_id = auth.uid()) ou apenas do
-- dono do projeto; o vinculo de auth_id ja passa pela RPC link_speaker_auth (013).

-- =============================================================
-- 0. HELPER: usuario atual e admin? (SECURITY DEFINER p/ nao recursar na RLS)
-- =============================================================
-- Uma policy em contractors que faca SELECT em contractors causa
-- "infinite recursion detected in policy". Este helper roda como owner
-- (bypassa RLS) e quebra a recursao.

CREATE OR REPLACE FUNCTION public.current_user_is_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.contractors
    WHERE auth_id = auth.uid() AND is_admin = true
  );
$$;

REVOKE ALL ON FUNCTION public.current_user_is_admin() FROM public;
GRANT EXECUTE ON FUNCTION public.current_user_is_admin() TO authenticated;

-- =============================================================
-- 1. CONTRACTORS: remover leitura publica, restringir a dono + admin
-- =============================================================

DROP POLICY IF EXISTS "Leitura_publica_de_contratantes" ON public.contractors;

-- Contratante le apenas o proprio registro
DROP POLICY IF EXISTS "Contratante_le_proprio" ON public.contractors;
CREATE POLICY "Contratante_le_proprio" ON public.contractors
  FOR SELECT
  TO authenticated
  USING (auth.uid() = auth_id);

-- Admin (Avantik) le todos os contratantes
DROP POLICY IF EXISTS "Admin_le_contratantes" ON public.contractors;
CREATE POLICY "Admin_le_contratantes" ON public.contractors
  FOR SELECT
  TO authenticated
  USING (public.current_user_is_admin());

-- =============================================================
-- 2. SPEAKERS: remover UPDATE anonimo perigoso
-- =============================================================
-- O vinculo inicial de auth_id ja e feito pela RPC link_speaker_auth (013),
-- que valida que o email do speaker bate com o do auth.users. A policy abaixo
-- deixava qualquer anonimo dar UPDATE (e ler via RETURNING) em qualquer speaker
-- ainda nao vinculado. Nao ha mais codigo que dependa dela.

DROP POLICY IF EXISTS "Permitir_vincular_auth_id" ON public.speakers;

-- =============================================================
-- 3. CONTRACTORS: trigger anti-fraude (billing + is_admin)
-- =============================================================
-- Espelha prevent_speaker_billing_self_update (016). Bloqueia o contratante de
-- alterar via UPDATE direto as colunas que so o backend/webhook (service_role)
-- ou o SQL Editor podem tocar. NAO bloqueia free_talks_used, que a RPC
-- use_free_talk (018, SECURITY DEFINER rodando como authenticated) incrementa;
-- com plan/subscription_paid_until/free_talks_total travados, mexer so em
-- free_talks_used e inocuo (a RPC valida o plano ativo).

CREATE OR REPLACE FUNCTION public.prevent_contractor_billing_self_update()
RETURNS trigger
LANGUAGE plpgsql
SECURITY INVOKER
AS $$
BEGIN
  -- service_role (webhook / checkout backend) pode mudar tudo
  IF auth.role() = 'service_role' THEN
    RETURN NEW;
  END IF;

  IF NEW.is_admin IS DISTINCT FROM OLD.is_admin THEN
    RAISE EXCEPTION 'is_admin so pode ser alterado por um administrador (SQL)';
  END IF;
  IF NEW.plan IS DISTINCT FROM OLD.plan THEN
    RAISE EXCEPTION 'plan so pode ser alterado pelo webhook de pagamento';
  END IF;
  IF NEW.subscription_paid_until IS DISTINCT FROM OLD.subscription_paid_until THEN
    RAISE EXCEPTION 'subscription_paid_until so pode ser alterado pelo webhook de pagamento';
  END IF;
  IF NEW.free_talks_total IS DISTINCT FROM OLD.free_talks_total THEN
    RAISE EXCEPTION 'free_talks_total so pode ser alterado pelo webhook de pagamento';
  END IF;
  IF NEW.mp_payment_id IS DISTINCT FROM OLD.mp_payment_id THEN
    RAISE EXCEPTION 'mp_payment_id so pode ser alterado pelo webhook de pagamento';
  END IF;
  IF NEW.mp_preference_id IS DISTINCT FROM OLD.mp_preference_id THEN
    RAISE EXCEPTION 'mp_preference_id so pode ser alterado pelo backend de checkout';
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS contractors_prevent_billing_self_update ON public.contractors;
CREATE TRIGGER contractors_prevent_billing_self_update
  BEFORE UPDATE ON public.contractors
  FOR EACH ROW
  EXECUTE FUNCTION public.prevent_contractor_billing_self_update();

-- =============================================================
-- 4. (OPCIONAL — rodar SO depois de testar o cadastro publico)
-- =============================================================
-- Endurecimentos de integridade/anti-spam. NAO aplicados por padrao porque
-- podem interferir no fluxo de cadastro publico (upload de foto e insert do
-- speaker podem ocorrer antes de haver sessao). Teste o cadastro completo
-- (palestrante novo + primeiro-acesso) antes de descomentar.
--
-- -- 4a. Upload no bucket speaker-photos so autenticado:
-- DROP POLICY IF EXISTS "Permitir_upload_publico_de_fotos" ON storage.objects;
-- CREATE POLICY "Upload_fotos_autenticado" ON storage.objects
--   FOR INSERT TO authenticated
--   WITH CHECK (bucket_id = 'speaker-photos');
--
-- -- 4b. Insert de speaker/palestra so autenticado (dono):
-- --     requer que o cadastro crie a sessao antes do insert; caso contrario,
-- --     migrar o insert publico para uma RPC SECURITY DEFINER (ver create_contractor).
