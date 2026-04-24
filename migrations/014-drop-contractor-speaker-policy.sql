-- MIGRACAO 014: remove policy de contratantes que causa recursao infinita
-- Execute no SQL Editor do Supabase APOS rodar 013.
--
-- Problema: a policy "Contratantes leem contato de speakers aceitos" criada
-- na migration 012 fazia JOIN em project_applications. A policy de SELECT
-- em project_applications (Leitura_de_candidaturas) por sua vez faz SELECT
-- em speakers pra saber se o requester e o speaker dono da candidatura.
-- Resultado: recursao infinita policy->policy, Postgres aborta com erro
-- 42P17 e PostgREST devolve 500. O login de qualquer palestrante quebrava.
--
-- Fix imediato: dropa a policy recursiva. A policy "Speakers leem proprio
-- perfil" (simples, sem JOIN) continua funcionando.
--
-- Trade-off: contratantes perdem acesso direto a email/phone do speaker
-- de candidaturas aceitas via REST. Pos-beta, implementar isso via RPC
-- SECURITY DEFINER dedicada (get_accepted_speaker_contact) que valida o
-- vinculo e retorna so os campos necessarios, sem o risco de recursao.

DROP POLICY IF EXISTS "Contratantes leem contato de speakers aceitos" ON public.speakers;
