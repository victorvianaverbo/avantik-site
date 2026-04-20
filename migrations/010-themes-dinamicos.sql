-- MIGRACAO 010: Normaliza temas, adiciona coluna de icone, insere ocasioes que
-- faltam, e cria RPC para contagem de palestrantes ativos por tema.
-- Execute no SQL Editor do Supabase.
--
-- Esta migration e self-contained: cria a tabela themes caso nao exista
-- (fallback para projetos onde DATABASE_SETUP.sql nao foi aplicado).
-- As tabelas palestras e speakers precisam existir (migrations 001/002).

-- 0. Garante que a tabela themes existe + RLS + temas base
CREATE TABLE IF NOT EXISTS public.themes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL
);

ALTER TABLE public.themes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Leitura_de_temas_publica" ON public.themes;
CREATE POLICY "Leitura_de_temas_publica" ON public.themes
  FOR SELECT USING (true);

INSERT INTO public.themes (name, slug) VALUES
  ('Liderança',               'lideranca'),
  ('Vendas',                  'vendas'),
  ('Motivacional',            'motivacional'),
  ('Inovação',                'inovacao'),
  ('Saúde Mental',            'saude-mental'),
  ('Tecnologia',              'tecnologia'),
  ('Educação',                'educacao'),
  ('Comunicação',             'comunicacao'),
  ('Diversidade e Inclusão',  'diversidade-e-inclusao'),
  ('Desenvolvimento Pessoal', 'desenvolvimento-pessoal'),
  ('Empreendedorismo',        'empreendedorismo'),
  ('Estratégia',              'estrategia'),
  ('Futuro',                  'futuro'),
  ('Gestão',                  'gestao'),
  ('Finanças',                'financas'),
  ('Negócios',                'negocios'),
  ('Inteligência Emocional',  'inteligencia-emocional'),
  ('Comportamento',           'comportamento'),
  ('Neurociência',            'neurociencia'),
  ('Jurídico',                'juridico'),
  ('Marketing',               'marketing'),
  ('Networking',              'networking'),
  ('Experiência do Cliente',  'experiencia-do-cliente'),
  ('Oratória',                'oratoria'),
  ('Motivação',               'motivacao')
ON CONFLICT (slug) DO NOTHING;

-- 1. Coluna de icone (chave Lucide, ex: 'flag', 'trending-up')
ALTER TABLE public.themes ADD COLUMN IF NOT EXISTS icon TEXT;

-- 2. Normaliza nomes existentes para portugues com acentos
UPDATE public.themes SET name = 'Estratégia'             WHERE slug = 'estrategia';
UPDATE public.themes SET name = 'Gestão'                 WHERE slug = 'gestao';
UPDATE public.themes SET name = 'Finanças'               WHERE slug = 'financas';
UPDATE public.themes SET name = 'Negócios'               WHERE slug = 'negocios';
UPDATE public.themes SET name = 'Inteligência Emocional' WHERE slug = 'inteligencia-emocional';
UPDATE public.themes SET name = 'Neurociência'           WHERE slug = 'neurociencia';
UPDATE public.themes SET name = 'Jurídico'               WHERE slug = 'juridico';
UPDATE public.themes SET name = 'Experiência do Cliente' WHERE slug = 'experiencia-do-cliente';
UPDATE public.themes SET name = 'Oratória'               WHERE slug = 'oratoria';
UPDATE public.themes SET name = 'Motivação'              WHERE slug = 'motivacao';

-- 3. Insere as 'ocasioes' que aparecem na home mas nao estavam no banco
INSERT INTO public.themes (name, slug, icon) VALUES
  ('SIPAT',         'sipat',          'hardhat'),
  ('Dia da Mulher', 'dia-da-mulher',  'venus'),
  ('Outubro Rosa',  'outubro-rosa',   'ribbon'),
  ('Novembro Azul', 'novembro-azul',  'ribbon')
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  icon = COALESCE(public.themes.icon, EXCLUDED.icon);

-- 4. Mapeia icones para os temas conhecidos (so atribui se estiver vazio)
UPDATE public.themes SET icon = 'flag'            WHERE slug = 'lideranca'               AND (icon IS NULL OR icon = '');
UPDATE public.themes SET icon = 'trending-up'     WHERE slug = 'vendas'                  AND (icon IS NULL OR icon = '');
UPDATE public.themes SET icon = 'rocket'          WHERE slug = 'motivacional'            AND (icon IS NULL OR icon = '');
UPDATE public.themes SET icon = 'zap'             WHERE slug = 'motivacao'               AND (icon IS NULL OR icon = '');
UPDATE public.themes SET icon = 'heart'           WHERE slug = 'inteligencia-emocional'  AND (icon IS NULL OR icon = '');
UPDATE public.themes SET icon = 'message-circle'  WHERE slug = 'comunicacao'             AND (icon IS NULL OR icon = '');
UPDATE public.themes SET icon = 'brain'           WHERE slug = 'saude-mental'            AND (icon IS NULL OR icon = '');
UPDATE public.themes SET icon = 'users'           WHERE slug = 'diversidade-e-inclusao'  AND (icon IS NULL OR icon = '');
UPDATE public.themes SET icon = 'settings'        WHERE slug = 'gestao'                  AND (icon IS NULL OR icon = '');
UPDATE public.themes SET icon = 'briefcase'       WHERE slug = 'empreendedorismo'        AND (icon IS NULL OR icon = '');
UPDATE public.themes SET icon = 'lightbulb'       WHERE slug = 'inovacao'                AND (icon IS NULL OR icon = '');
UPDATE public.themes SET icon = 'cpu'             WHERE slug = 'tecnologia'              AND (icon IS NULL OR icon = '');
UPDATE public.themes SET icon = 'book'            WHERE slug = 'educacao'                AND (icon IS NULL OR icon = '');
UPDATE public.themes SET icon = 'user-check'      WHERE slug = 'desenvolvimento-pessoal' AND (icon IS NULL OR icon = '');
UPDATE public.themes SET icon = 'target'          WHERE slug = 'estrategia'              AND (icon IS NULL OR icon = '');
UPDATE public.themes SET icon = 'eye'             WHERE slug = 'futuro'                  AND (icon IS NULL OR icon = '');
UPDATE public.themes SET icon = 'dollar-sign'     WHERE slug = 'financas'                AND (icon IS NULL OR icon = '');
UPDATE public.themes SET icon = 'building'        WHERE slug = 'negocios'                AND (icon IS NULL OR icon = '');
UPDATE public.themes SET icon = 'user'            WHERE slug = 'comportamento'           AND (icon IS NULL OR icon = '');
UPDATE public.themes SET icon = 'brain'           WHERE slug = 'neurociencia'            AND (icon IS NULL OR icon = '');
UPDATE public.themes SET icon = 'scale'           WHERE slug = 'juridico'                AND (icon IS NULL OR icon = '');
UPDATE public.themes SET icon = 'megaphone'       WHERE slug = 'marketing'               AND (icon IS NULL OR icon = '');
UPDATE public.themes SET icon = 'share-2'         WHERE slug = 'networking'              AND (icon IS NULL OR icon = '');
UPDATE public.themes SET icon = 'star'            WHERE slug = 'experiencia-do-cliente'  AND (icon IS NULL OR icon = '');
UPDATE public.themes SET icon = 'mic'             WHERE slug = 'oratoria'                AND (icon IS NULL OR icon = '');

-- 5. RPC: retorna cada tema com a contagem de palestrantes ativos distintos,
--    derivada via palestras.theme_id (mesma fonte usada no /diretorio).
CREATE OR REPLACE FUNCTION public.get_theme_speaker_counts()
RETURNS TABLE (
  id UUID,
  name TEXT,
  slug TEXT,
  icon TEXT,
  speaker_count BIGINT
)
LANGUAGE sql
STABLE
AS $$
  SELECT
    t.id,
    t.name,
    t.slug,
    t.icon,
    COUNT(DISTINCT sp.id) AS speaker_count
  FROM public.themes t
  LEFT JOIN public.palestras p ON p.theme_id = t.id
  LEFT JOIN public.speakers sp ON sp.id = p.speaker_id AND sp.active = true
  GROUP BY t.id, t.name, t.slug, t.icon
  ORDER BY speaker_count DESC NULLS LAST, t.name ASC;
$$;

GRANT EXECUTE ON FUNCTION public.get_theme_speaker_counts() TO anon, authenticated;
