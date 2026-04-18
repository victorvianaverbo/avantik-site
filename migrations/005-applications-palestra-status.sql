-- MIGRACAO 005: Candidatura vincula a uma palestra + status de aceite
-- Execute no Supabase SQL Editor

ALTER TABLE public.project_applications
  ADD COLUMN IF NOT EXISTS palestra_id UUID REFERENCES public.palestras(id),
  ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'pendente',
  ADD COLUMN IF NOT EXISTS accepted_at TIMESTAMPTZ;

-- Indice para filtrar por status
CREATE INDEX IF NOT EXISTS idx_applications_status ON public.project_applications(status);

-- Permitir que o contratante dono do projeto atualize candidaturas (aceitar/rejeitar)
CREATE POLICY "Permitir_contratante_atualizar_candidatura" ON public.project_applications
  FOR UPDATE USING (
    project_id IN (
      SELECT p.id FROM public.projects p
      JOIN public.contractors c ON c.id = p.contractor_id
      WHERE c.auth_id = auth.uid()
    )
  ) WITH CHECK (
    project_id IN (
      SELECT p.id FROM public.projects p
      JOIN public.contractors c ON c.id = p.contractor_id
      WHERE c.auth_id = auth.uid()
    )
  );
