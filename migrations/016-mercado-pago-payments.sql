-- MIGRACAO 016: Pagamentos via Mercado Pago (modelo anual parcelado).
-- Execute no SQL Editor do Supabase APOS rodar 015.
--
-- Modelo: palestrante paga R$ 1.164 / R$ 1.764 / R$ 3.564 uma vez ao ano,
-- parcelado em ate 12x sem juros (Avantik absorve os juros). Nao eh
-- assinatura recorrente — quando vencer, palestrante precisa contratar
-- de novo manualmente.
--
-- Schema:
-- 1. speakers ganha colunas de status de assinatura
-- 2. nova tabela payments serve de audit log das transacoes MP
-- 3. trigger impede o proprio palestrante de fraudar subscription_paid_until,
--    mp_payment_id ou plan via UPDATE direto — so o webhook (service_role)
--    pode tocar nessas colunas

-- =============================================================
-- 1. COLUNAS DE STATUS DE ASSINATURA EM SPEAKERS
-- =============================================================

ALTER TABLE public.speakers
  ADD COLUMN IF NOT EXISTS subscription_paid_until TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS mp_payment_id    TEXT,
  ADD COLUMN IF NOT EXISTS mp_preference_id TEXT;

COMMENT ON COLUMN public.speakers.subscription_paid_until IS
  'Data ate quando o plano anual esta ativo. Setado pelo webhook MP ao aprovar pagamento. NULL = sem pagamento aprovado (apenas trial ou inativo).';
COMMENT ON COLUMN public.speakers.mp_payment_id IS
  'ID do ultimo pagamento aprovado no Mercado Pago. Usado pra evitar processamento duplicado de webhooks.';
COMMENT ON COLUMN public.speakers.mp_preference_id IS
  'ID da ultima preference de checkout criada (registrada no /create-checkout antes da ida pro MP). Usado pra reconciliar pagamentos abandonados/pendentes.';

CREATE INDEX IF NOT EXISTS idx_speakers_paid_until
  ON public.speakers(subscription_paid_until)
  WHERE subscription_paid_until IS NOT NULL;

-- =============================================================
-- 2. TABELA payments — AUDIT LOG DAS TRANSACOES MP
-- =============================================================

CREATE TABLE IF NOT EXISTS public.payments (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  speaker_id       UUID NOT NULL REFERENCES public.speakers(id) ON DELETE CASCADE,
  plan             TEXT NOT NULL CHECK (plan IN ('profissional','premium','elite')),
  mp_payment_id    TEXT UNIQUE NOT NULL,
  mp_preference_id TEXT,
  amount           NUMERIC(10,2) NOT NULL,
  status           TEXT NOT NULL,           -- approved | refunded | chargeback | rejected | etc
  paid_at          TIMESTAMPTZ,
  expires_at       TIMESTAMPTZ NOT NULL,    -- paid_at + 12 meses
  raw_payload      JSONB,                   -- payload completo do MP pra debugging/reconciliacao
  created_at       TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_payments_speaker ON public.payments(speaker_id);
CREATE INDEX IF NOT EXISTS idx_payments_status_expires
  ON public.payments(status, expires_at);

ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

-- Palestrante le so o proprio historico
DROP POLICY IF EXISTS "Palestrante le proprios pagamentos" ON public.payments;
CREATE POLICY "Palestrante le proprios pagamentos" ON public.payments
  FOR SELECT
  TO authenticated
  USING (
    speaker_id IN (SELECT id FROM public.speakers WHERE auth_id = auth.uid())
  );

-- INSERT/UPDATE/DELETE: nenhuma policy criada de proposito.
-- Sem policy, RLS bloqueia qualquer write por anon/authenticated.
-- Apenas service_role (bypass RLS) consegue gravar — eh o webhook MP.

-- =============================================================
-- 3. TRIGGER ANTI-FRAUDE EM SPEAKERS
-- =============================================================
-- A policy "Permitir_update_proprio_palestrante" deixa o palestrante
-- atualizar qualquer coluna do proprio registro. Sem trigger, ele
-- conseguiria setar subscription_paid_until via REST API e ativar
-- o plano sem pagar.
--
-- Este trigger bloqueia mudancas em subscription_paid_until / mp_payment_id /
-- mp_preference_id se a chamada NAO vier do service_role (webhook).
-- 'plan' NAO eh bloqueado: durante o trial o palestrante escolhe livremente
-- qual plano testar; o webhook sobrescreve no momento do pagamento aprovado.

CREATE OR REPLACE FUNCTION public.prevent_speaker_billing_self_update()
RETURNS trigger
LANGUAGE plpgsql
SECURITY INVOKER
AS $$
BEGIN
  -- service_role (webhook) pode mudar tudo
  IF auth.role() = 'service_role' THEN
    RETURN NEW;
  END IF;

  IF NEW.subscription_paid_until IS DISTINCT FROM OLD.subscription_paid_until THEN
    RAISE EXCEPTION 'subscription_paid_until so pode ser alterado pelo webhook de pagamento';
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

DROP TRIGGER IF EXISTS speakers_prevent_billing_self_update ON public.speakers;
CREATE TRIGGER speakers_prevent_billing_self_update
  BEFORE UPDATE ON public.speakers
  FOR EACH ROW
  EXECUTE FUNCTION public.prevent_speaker_billing_self_update();

-- =============================================================
-- 4. HELPER SQL: speaker tem acesso ativo agora?
-- =============================================================
-- Retorna true se: trial ainda valido (15 dias) OU plano pago vigente.
-- Util pra usar em views, queries de UI e relatorios.

CREATE OR REPLACE FUNCTION public.speaker_is_active(s public.speakers)
RETURNS BOOLEAN
LANGUAGE sql
IMMUTABLE
AS $$
  SELECT
    (s.subscription_paid_until IS NOT NULL AND s.subscription_paid_until > now())
    OR
    (s.trial_started_at IS NOT NULL AND s.trial_started_at + INTERVAL '15 days' > now());
$$;

COMMENT ON FUNCTION public.speaker_is_active IS
  'Speaker tem acesso ativo (trial valido OU pagamento vigente). Uso: SELECT * FROM speakers WHERE speaker_is_active(speakers);';
