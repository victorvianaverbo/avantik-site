-- MIGRACAO 025: segunda leva da vertical Setor Publico (15 -> 21 habilitados)
-- Execute no SQL EDITOR do Supabase (projeto ajokzpjguhfxxudteetr).
--
-- ATENCAO: tem que rodar como service_role, ou seja, pelo SQL Editor mesmo.
-- O trigger prevent_speaker_billing_self_update (endurecido na 022) rejeita
-- qualquer alteracao de public_sector_ready que nao venha do service_role.
-- Por PATCH na API REST com a anon key a resposta e 204 ENGANOSO: sao zero
-- linhas afetadas porque a RLS impede o anonimo de enxergar a linha. Confirme
-- sempre lendo o valor depois.
--
-- CONTEXTO: /setor-publico/ deixou de ser landing de recrutamento e virou o
-- BANCO DE PALESTRANTES da vertical — mesma experiencia de busca do /diretorio/,
-- so que exclusiva de quem a curadoria habilitou. Com 15 nomes a pagina abria
-- com uma unica tela de resultados e varios filtros de tema devolvendo lista
-- vazia. Esta migracao da volume ao banco e, principalmente, cobre eixos de
-- demanda que estavam descobertos.
--
-- CRITERIO: o mesmo da 024 — aderencia real a contratacao por orgao publico,
-- EXCLUINDO perfil politico-partidario marcado (contratacao publica se rege
-- por impessoalidade; nome partidariamente marcado expoe o gestor a
-- questionamento e o processo a impugnacao). Excluidos tambem, por laicidade
-- do Estado, os palestrantes cujo tema central e religioso/confessional.

UPDATE public.speakers
   SET public_sector_ready = true
 WHERE slug IN (
   -- Seguranca e saude do trabalho — SIPAT do orgao.
   -- Eixo que NAO existia na 024: nenhum dos 15 tinha Seguranca do Trabalho.
   'roberto-medeiros',

   -- Saude mental do servidor — Setembro Amarelo e Semana do Servidor.
   -- Ate aqui so o Augusto Cury cobria o eixo. Psiquiatra, perfil tecnico.
   'ana-beatriz-barbosa-silva',

   -- Educacao e formacao de servidor — outro eixo ausente na 024.
   -- Historiador e medico-educador, ambos classicos em escola de governo.
   'leandro-karnal',
   'eugenio-mussak',

   -- Governo digital / IA na administracao publica.
   -- Reforca Martha Gabriel e Silvio Meira, que estavam sozinhos no eixo.
   'gil-giardelli',

   -- Superacao e estrategia para Semana do Servidor.
   -- Nome sem qualquer leitura partidaria possivel.
   'amyr-klink'
 );

-- =============================================================
-- VERIFICACAO
-- =============================================================
-- Deve retornar exatamente 21 linhas (15 da 024 + 6 desta):
--
--   SELECT slug, name FROM public.speakers
--    WHERE public_sector_ready = true ORDER BY name;
--
-- Se vier menos que 21, algum slug mudou desde 2026-08-16 — confira com:
--
--   SELECT unnest(ARRAY['roberto-medeiros','ana-beatriz-barbosa-silva',
--                       'leandro-karnal','eugenio-mussak','gil-giardelli',
--                       'amyr-klink']) AS slug
--   EXCEPT SELECT slug FROM public.speakers;
--
-- Para TIRAR alguem da vertical depois (tambem so pelo SQL Editor):
--
--   UPDATE public.speakers SET public_sector_ready = false WHERE slug = '<slug>';
