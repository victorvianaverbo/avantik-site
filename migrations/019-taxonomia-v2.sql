-- MIGRACAO 019: Taxonomia v2 (4 grupos curados) + grupo oculto de palestras gratis
-- Execute no SQL Editor do Supabase.
--
-- - Adiciona themes.categoria: 'mais-procurados' | 'sociedade' | 'especializados'
--   (NULL = tema legado, deixa de aparecer no filtro do diretorio).
-- - Cria/atualiza os 49 temas canonicos (ON CONFLICT por slug => reusa linhas
--   existentes, mantendo FKs de palestras/speaker_themes).
-- - Adiciona speakers.free_talk_eligible (grupo curado/oculto das palestras gratis).

ALTER TABLE public.themes ADD COLUMN IF NOT EXISTS categoria TEXT;
ALTER TABLE public.speakers ADD COLUMN IF NOT EXISTS free_talk_eligible BOOLEAN DEFAULT false;

INSERT INTO public.themes (name, slug, categoria) VALUES
  -- ===== Temas Mais Procurados =====
  ('Vendas','vendas','mais-procurados'),
  ('Negociação','negociacao','mais-procurados'),
  ('Atendimento','atendimento','mais-procurados'),
  ('Experiência do Cliente','experiencia-do-cliente','mais-procurados'),
  ('Liderança','lideranca','mais-procurados'),
  ('Gestão','gestao','mais-procurados'),
  ('Cultura Organizacional','cultura-organizacional','mais-procurados'),
  ('Comunicação','comunicacao','mais-procurados'),
  ('Oratória','oratoria','mais-procurados'),
  ('Networking','networking','mais-procurados'),
  ('Inteligência Emocional','inteligencia-emocional','mais-procurados'),
  ('Saúde Mental','saude-mental','mais-procurados'),
  ('Comportamento','comportamento','mais-procurados'),
  ('Autoconhecimento','autoconhecimento','mais-procurados'),
  ('Desenvolvimento Pessoal','desenvolvimento-pessoal','mais-procurados'),
  ('Alta Performance','alta-performance','mais-procurados'),
  ('Motivacional','motivacional','mais-procurados'),
  ('Superação','superacao','mais-procurados'),
  ('Carreira','carreira','mais-procurados'),
  ('Aprendizagem','aprendizagem','mais-procurados'),
  ('Futuro','futuro','mais-procurados'),
  -- ===== Sociedade & Valores =====
  ('Política','politica','sociedade'),
  ('Geopolítica','geopolitica','sociedade'),
  ('Ética','etica','sociedade'),
  ('Espiritualidade','espiritualidade','sociedade'),
  ('Família e Relações Humanas','familia-e-relacoes-humanas','sociedade'),
  ('Educação','educacao','sociedade'),
  ('Filosofia','filosofia','sociedade'),
  ('Sustentabilidade','sustentabilidade','sociedade'),
  ('Diversidade e Inclusão','diversidade-e-inclusao','sociedade'),
  ('Segurança do Trabalho','seguranca-do-trabalho','sociedade'),
  ('Reputação','reputacao','sociedade'),
  -- ===== Temas Especializados =====
  ('Empreendedorismo','empreendedorismo','especializados'),
  ('Negócios','negocios','especializados'),
  ('Marketing','marketing','especializados'),
  ('Branding','branding','especializados'),
  ('Inovação','inovacao','especializados'),
  ('Tecnologia','tecnologia','especializados'),
  ('Inteligência Artificial','inteligencia-artificial','especializados'),
  ('Economia','economia','especializados'),
  ('Finanças','financas','especializados'),
  ('Finanças Empresariais','financas-empresariais','especializados'),
  ('Tributos','tributos','especializados'),
  ('Jurídico','juridico','especializados'),
  ('Departamento Pessoal','departamento-pessoal','especializados'),
  ('Franchising','franchising','especializados'),
  ('Varejo','varejo','especializados'),
  ('Defesa Pessoal','defesa-pessoal','especializados'),
  ('Estratégia','estrategia','especializados')
ON CONFLICT (slug) DO UPDATE
  SET name = EXCLUDED.name,
      categoria = EXCLUDED.categoria;
