-- MIGRACAO 006: Tabela de comissoes (30% para Avantik)
-- Execute no Supabase SQL Editor

CREATE TABLE IF NOT EXISTS public.commissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  application_id UUID NOT NULL REFERENCES public.project_applications(id) ON DELETE CASCADE,
  speaker_id UUID NOT NULL REFERENCES public.speakers(id),
  contractor_id UUID NOT NULL REFERENCES public.contractors(id),
  proposed_price INTEGER NOT NULL,
  commission_rate DECIMAL(4,2) DEFAULT 0.30,
  commission_amount INTEGER NOT NULL,
  status TEXT DEFAULT 'pendente',
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  paid_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_commissions_speaker ON public.commissions(speaker_id);
CREATE INDEX IF NOT EXISTS idx_commissions_status ON public.commissions(status);

ALTER TABLE public.commissions ENABLE ROW LEVEL SECURITY;

-- Speaker pode ver suas proprias comissoes
CREATE POLICY "Speaker_le_proprias_comissoes" ON public.commissions
  FOR SELECT USING (
    speaker_id IN (SELECT id FROM public.speakers WHERE auth_id = auth.uid())
  );

-- Contractor pode ver suas proprias comissoes (geradas por ele)
CREATE POLICY "Contractor_le_proprias_comissoes" ON public.commissions
  FOR SELECT USING (
    contractor_id IN (SELECT id FROM public.contractors WHERE auth_id = auth.uid())
  );

-- Admin (is_admin=true em contractors) le tudo
CREATE POLICY "Admin_le_todas_comissoes" ON public.commissions
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.contractors WHERE auth_id = auth.uid() AND is_admin = true)
  );

-- Admin pode atualizar (marcar como paga)
CREATE POLICY "Admin_atualiza_comissoes" ON public.commissions
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.contractors WHERE auth_id = auth.uid() AND is_admin = true)
  );

-- INSERT via RPC ou via contratante quando aceita proposta
CREATE POLICY "Contractor_cria_comissao_no_aceite" ON public.commissions
  FOR INSERT WITH CHECK (
    contractor_id IN (SELECT id FROM public.contractors WHERE auth_id = auth.uid())
  );
