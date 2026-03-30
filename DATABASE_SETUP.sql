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
  plan TEXT NOT NULL DEFAULT 'essencial',
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

-- Permitir leitura pública (para página de diretório e perfil)
CREATE POLICY "Leitura_de_palestrantes_publica" ON public.speakers
  FOR SELECT USING (true);

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
