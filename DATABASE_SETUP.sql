-- Execute este script no SQL Editor do seu projeto Supabase

-- 1. Criar tabela de temas
CREATE TABLE IF NOT EXISTS public.themes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL
);

-- Ativar segurança em nível de linha (RLS) para themes
ALTER TABLE public.themes ENABLE ROW LEVEL SECURITY;

-- Permitir leitura de temas para todos (anônimos e autenticados)
CREATE POLICY "Leitura_de_temas_publica" ON public.themes
  FOR SELECT USING (true);

-- Inserir alguns temas iniciais
INSERT INTO public.themes (name, slug)
VALUES
  ('Liderança', 'lideranca'),
  ('Vendas', 'vendas'),
  ('Motivacional', 'motivacional'),
  ('Inovação', 'inovacao'),
  ('Saúde Mental', 'saude-mental'),
  ('Tecnologia', 'tecnologia'),
  ('Educação', 'educacao'),
  ('Comunicação', 'comunicacao'),
  ('Diversidade e Inclusão', 'diversidade-e-inclusao')
ON CONFLICT (slug) DO NOTHING;

-- 2. Criar tabela de palestrantes
CREATE TABLE IF NOT EXISTS public.speakers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  plan TEXT NOT NULL DEFAULT 'profissional', -- profissional | premium | elite
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  city TEXT,
  state TEXT,
  bio TEXT,
  photo_url TEXT,
  video_url TEXT,
  price_min INTEGER,
  price_max INTEGER,
  instagram TEXT,
  linkedin TEXT,
  website TEXT,
  active BOOLEAN DEFAULT false, -- Mude para TRUE caso o palestrante já fique ativo e visível na busca logo no cadastro
  rating DECIMAL(3,1) DEFAULT 5.0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Ativar segurança em nível de linha (RLS) para speakers
ALTER TABLE public.speakers ENABLE ROW LEVEL SECURITY;

-- Leitura publica dos palestrantes: use view `speakers_public` (sem email/phone).
-- Acesso direto a esta tabela e restringido via RLS por questoes de LGPD.
-- Veja migrations/012-seguranca-contato.sql para as policies de acesso autenticado.

-- Permitir inserção anônima (no formulário de cadastro)
CREATE POLICY "Permitir_cadastro_de_palestrantes" ON public.speakers
  FOR INSERT WITH CHECK (true);

-- 3. Criar tabela de junção (palestrante e os temas)
CREATE TABLE IF NOT EXISTS public.speaker_themes (
  speaker_id UUID REFERENCES public.speakers(id) ON DELETE CASCADE,
  theme_id UUID REFERENCES public.themes(id) ON DELETE CASCADE,
  PRIMARY KEY (speaker_id, theme_id)
);

-- Ativar segurança em nível de linha (RLS) para speaker_themes
ALTER TABLE public.speaker_themes ENABLE ROW LEVEL SECURITY;

-- Permitir leitura pública
CREATE POLICY "Leitura_de_speaker_themes_publica" ON public.speaker_themes
  FOR SELECT USING (true);

-- Permitir inserção anônima dos vínculos
CREATE POLICY "Permitir_linkar_temas_aos_palestrantes" ON public.speaker_themes
  FOR INSERT WITH CHECK (true);

-- 4. Criar bucket de Storage para as fotos caso não exista
INSERT INTO storage.buckets (id, name, public) 
VALUES ('speaker-photos', 'speaker-photos', true)
ON CONFLICT (id) DO NOTHING;

-- Dar acesso anônimo de inserção e leitura às fotos
CREATE POLICY "Permitir_upload_publico_de_fotos" 
ON storage.objects FOR INSERT 
WITH CHECK (bucket_id = 'speaker-photos');

CREATE POLICY "Permitir_visualizacao_publica_de_fotos"
ON storage.objects FOR SELECT
USING (bucket_id = 'speaker-photos');

-- ============================================================
-- 5. Adicionar auth_id aos speakers (vinculo com Supabase Auth)
-- ============================================================

ALTER TABLE public.speakers ADD COLUMN IF NOT EXISTS auth_id UUID UNIQUE REFERENCES auth.users(id);

-- Permitir update do proprio palestrante (para vincular auth_id e editar perfil)
CREATE POLICY "Permitir_update_proprio_palestrante" ON public.speakers
  FOR UPDATE USING (auth.uid() = auth_id)
  WITH CHECK (auth.uid() = auth_id);

-- Permitir update anonimo para vincular auth_id na primeira vez (migracao)
CREATE POLICY "Permitir_vincular_auth_id" ON public.speakers
  FOR UPDATE USING (auth_id IS NULL)
  WITH CHECK (true);

-- ============================================================
-- 6. Tabela de contratantes (empresas)
-- ============================================================

CREATE TABLE IF NOT EXISTS public.contractors (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  auth_id UUID UNIQUE NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  company TEXT NOT NULL,
  role TEXT,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.contractors ENABLE ROW LEVEL SECURITY;

-- Qualquer um pode ler contratantes (para ver nome da empresa nos projetos)
CREATE POLICY "Leitura_publica_de_contratantes" ON public.contractors
  FOR SELECT USING (true);

-- Inserir apenas para usuario autenticado (seu proprio registro)
CREATE POLICY "Permitir_cadastro_de_contratante" ON public.contractors
  FOR INSERT WITH CHECK (auth.uid() = auth_id);

-- Atualizar apenas o proprio registro
CREATE POLICY "Permitir_update_proprio_contratante" ON public.contractors
  FOR UPDATE USING (auth.uid() = auth_id)
  WITH CHECK (auth.uid() = auth_id);

-- ============================================================
-- 7. Tabela de projetos (oportunidades de palestra)
-- ============================================================

CREATE TABLE IF NOT EXISTS public.projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  contractor_id UUID NOT NULL REFERENCES public.contractors(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  event_type TEXT NOT NULL,
  theme_id UUID REFERENCES public.themes(id),
  event_date DATE,
  event_location TEXT,
  budget_min INTEGER,
  budget_max INTEGER,
  status TEXT NOT NULL DEFAULT 'aberto',
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  closed_at TIMESTAMPTZ
);

CREATE INDEX idx_projects_status ON public.projects(status);
CREATE INDEX idx_projects_contractor ON public.projects(contractor_id);
CREATE INDEX idx_projects_created_at ON public.projects(created_at DESC);

ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

-- Qualquer um pode ler projetos (listagem publica)
CREATE POLICY "Leitura_publica_de_projetos" ON public.projects
  FOR SELECT USING (true);

-- Apenas o contratante dono pode criar projetos
CREATE POLICY "Permitir_criacao_de_projetos" ON public.projects
  FOR INSERT WITH CHECK (
    contractor_id IN (SELECT id FROM public.contractors WHERE auth_id = auth.uid())
  );

-- Apenas o contratante dono pode atualizar (encerrar/reabrir)
CREATE POLICY "Permitir_update_proprio_projeto" ON public.projects
  FOR UPDATE USING (
    contractor_id IN (SELECT id FROM public.contractors WHERE auth_id = auth.uid())
  ) WITH CHECK (
    contractor_id IN (SELECT id FROM public.contractors WHERE auth_id = auth.uid())
  );

-- ============================================================
-- 8. Tabela de candidaturas a projetos
-- ============================================================

CREATE TABLE IF NOT EXISTS public.project_applications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  speaker_id UUID NOT NULL REFERENCES public.speakers(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  proposed_price INTEGER,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(project_id, speaker_id)
);

CREATE INDEX idx_applications_project ON public.project_applications(project_id);
CREATE INDEX idx_applications_speaker ON public.project_applications(speaker_id);

ALTER TABLE public.project_applications ENABLE ROW LEVEL SECURITY;

-- Palestrante logado pode se candidatar
CREATE POLICY "Permitir_candidatura" ON public.project_applications
  FOR INSERT WITH CHECK (
    speaker_id IN (SELECT id FROM public.speakers WHERE auth_id = auth.uid())
  );

-- Contratante dono do projeto pode ver candidaturas, e o palestrante pode ver as suas
CREATE POLICY "Leitura_de_candidaturas" ON public.project_applications
  FOR SELECT USING (
    -- contratante dono do projeto
    project_id IN (
      SELECT p.id FROM public.projects p
      JOIN public.contractors c ON c.id = p.contractor_id
      WHERE c.auth_id = auth.uid()
    )
    OR
    -- palestrante que se candidatou
    speaker_id IN (SELECT id FROM public.speakers WHERE auth_id = auth.uid())
  );

-- ============================================================
-- 9. Funcao RPC para criar contratante (SECURITY DEFINER)
-- Contorna o problema de RLS quando a sessao ainda nao esta
-- totalmente ativa apos o signUp (ex: email confirmation ligado)
-- ============================================================

CREATE OR REPLACE FUNCTION public.create_contractor(
  p_auth_id UUID,
  p_name TEXT,
  p_email TEXT,
  p_phone TEXT,
  p_company TEXT,
  p_role TEXT
) RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  new_id UUID;
BEGIN
  INSERT INTO public.contractors (auth_id, name, email, phone, company, role)
  VALUES (p_auth_id, p_name, p_email, p_phone, p_company, p_role)
  RETURNING id INTO new_id;

  RETURN new_id;
END;
$$;

-- Permitir execucao para anon e authenticated
GRANT EXECUTE ON FUNCTION public.create_contractor TO anon, authenticated;

-- ============================================================
-- 10. Tabela de palestras (talks individuais por palestrante)
-- ============================================================

CREATE TABLE IF NOT EXISTS public.palestras (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  speaker_id UUID NOT NULL REFERENCES public.speakers(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  slug TEXT NOT NULL,
  description TEXT,
  theme_id UUID REFERENCES public.themes(id),
  duration_minutes INTEGER,
  format TEXT DEFAULT 'presencial',
  price_min INTEGER,
  price_max INTEGER,
  target_audience TEXT,
  objectives TEXT[],
  video_url TEXT,
  image_url TEXT,
  active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(speaker_id, slug)
);

CREATE INDEX IF NOT EXISTS idx_palestras_speaker ON public.palestras(speaker_id);
CREATE INDEX IF NOT EXISTS idx_palestras_theme ON public.palestras(theme_id);
CREATE INDEX IF NOT EXISTS idx_palestras_active ON public.palestras(active) WHERE active = true;

ALTER TABLE public.palestras ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Leitura_publica_de_palestras" ON public.palestras
  FOR SELECT USING (true);

CREATE POLICY "Permitir_cadastro_de_palestra" ON public.palestras
  FOR INSERT WITH CHECK (
    speaker_id IN (SELECT id FROM public.speakers WHERE auth_id = auth.uid())
  );

CREATE POLICY "Permitir_cadastro_anonimo_de_palestra" ON public.palestras
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Permitir_update_propria_palestra" ON public.palestras
  FOR UPDATE USING (
    speaker_id IN (SELECT id FROM public.speakers WHERE auth_id = auth.uid())
  ) WITH CHECK (
    speaker_id IN (SELECT id FROM public.speakers WHERE auth_id = auth.uid())
  );

CREATE POLICY "Permitir_delete_propria_palestra" ON public.palestras
  FOR DELETE USING (
    speaker_id IN (SELECT id FROM public.speakers WHERE auth_id = auth.uid())
  );
