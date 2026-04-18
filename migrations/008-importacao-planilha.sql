-- MIGRACAO 008: Preparacao para importacao da planilha PLANILHA CADASTRO SITE.xlsx
-- Execute este SQL no Supabase SQL Editor ANTES de rodar importar-planilha.js

-- 1. Adicionar colunas para "Frase de Impacto" e "Assuntos abordados"
ALTER TABLE public.palestras ADD COLUMN IF NOT EXISTS impact_phrase TEXT;
ALTER TABLE public.palestras ADD COLUMN IF NOT EXISTS topics TEXT;

-- 2. Criar tabela de juncao palestra <-> temas (categorias compostas tipo "Gestao / Financas")
CREATE TABLE IF NOT EXISTS public.palestra_themes (
  palestra_id UUID REFERENCES public.palestras(id) ON DELETE CASCADE,
  theme_id UUID REFERENCES public.themes(id) ON DELETE CASCADE,
  PRIMARY KEY (palestra_id, theme_id)
);

ALTER TABLE public.palestra_themes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Leitura_publica_de_palestra_themes" ON public.palestra_themes
  FOR SELECT USING (true);

CREATE POLICY "Permitir_vincular_temas_a_palestra" ON public.palestra_themes
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Permitir_delete_vinculo_propria_palestra" ON public.palestra_themes
  FOR DELETE USING (
    palestra_id IN (
      SELECT p.id FROM public.palestras p
      JOIN public.speakers s ON s.id = p.speaker_id
      WHERE s.auth_id = auth.uid()
    )
  );

CREATE INDEX IF NOT EXISTS idx_palestra_themes_palestra ON public.palestra_themes(palestra_id);
CREATE INDEX IF NOT EXISTS idx_palestra_themes_theme ON public.palestra_themes(theme_id);

-- 3. Inserir os temas novos que aparecem na planilha (idempotente)
INSERT INTO public.themes (name, slug)
VALUES
  ('Desenvolvimento Pessoal', 'desenvolvimento-pessoal'),
  ('Empreendedorismo', 'empreendedorismo'),
  ('Estrategia', 'estrategia'),
  ('Futuro', 'futuro'),
  ('Gestao', 'gestao'),
  ('Financas', 'financas'),
  ('Negocios', 'negocios'),
  ('Inteligencia Emocional', 'inteligencia-emocional'),
  ('Comportamento', 'comportamento'),
  ('Neurociencia', 'neurociencia'),
  ('Juridico', 'juridico'),
  ('Marketing', 'marketing'),
  ('Networking', 'networking'),
  ('Experiencia do Cliente', 'experiencia-do-cliente'),
  ('Oratoria', 'oratoria'),
  ('Motivacao', 'motivacao')
ON CONFLICT (slug) DO NOTHING;
