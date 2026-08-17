-- MIGRACAO 024: primeira leva de palestrantes habilitados na vertical Setor Publico
-- Execute no SQL EDITOR do Supabase (projeto ajokzpjguhfxxudteetr).
--
-- ATENCAO: tem que rodar como service_role, ou seja, pelo SQL Editor mesmo.
-- O trigger prevent_speaker_billing_self_update (endurecido na migracao 022)
-- rejeita qualquer alteracao de public_sector_ready que nao venha do
-- service_role. Por PATCH na API REST este UPDATE falha de proposito.
--
-- CONTEXTO: a 022 criou as colunas mas nao marcou ninguem. Com zero linhas
-- habilitadas, o chip "Setor Publico" do diretorio ficava OCULTO (o JS esconde
-- o grupo quando nao ha ninguem) e o carrossel da landing nao tinha o que
-- mostrar. Esta migracao e o que liga a vertical de fato.
--
-- CRITERIO DA CURADORIA: aderencia real a contratacao por orgao publico.
-- Ficaram DE FORA os palestrantes de perfil politico-partidario marcado
-- (o banco tem ~14 com tema "Politica" nesse perfil, de ambos os lados):
-- contratacao publica se rege por impessoalidade, e um nome partidariamente
-- marcado expoe o gestor a questionamento e o processo a impugnacao — o
-- oposto do que a vertical promete.

UPDATE public.speakers
   SET public_sector_ready = true
 WHERE slug IN (
   -- Gestao, etica e lideranca (capacitacao de servidor)
   'mario-sergio-cortella',
   'jose-salibi-neto',
   'clovis-de-barros-filho',
   'jose-maria-gasalla',

   -- Economia e cenarios (camaras, secretarias de fazenda, associacoes)
   'ricardo-amorim',
   'arminio-fraga',
   'cristiane-quartaroli',
   'carlos-alberto-sardenberg',

   -- Direito e instituicoes
   'ives-gandra-martins',

   -- Governo digital / inovacao na administracao publica
   'martha-gabriel',
   'silvio-meira',

   -- Inclusao e datas civicas (acessibilidade e diversidade)
   'clodoaldo-silva',
   'daniel-dias',
   'magic-paula',

   -- Saude mental / SIPAT do orgao e Semana do Servidor
   'augusto-cury'
 );

-- =============================================================
-- VERIFICACAO
-- =============================================================
-- Deve retornar exatamente 15 linhas:
--
--   SELECT slug, name FROM public.speakers
--    WHERE public_sector_ready = true ORDER BY name;
--
-- Se vier menos que 15, algum slug mudou desde 2026-08-11 — confira com:
--
--   SELECT unnest(ARRAY['mario-sergio-cortella','jose-salibi-neto', ...]) AS slug
--   EXCEPT SELECT slug FROM public.speakers;
--
-- Para TIRAR alguem da vertical depois (tambem so pelo SQL Editor):
--
--   UPDATE public.speakers SET public_sector_ready = false WHERE slug = '<slug>';
