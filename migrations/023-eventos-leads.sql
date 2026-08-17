-- MIGRACAO 023: leads dos eventos presenciais (ciclo Apogeu 2026)
-- Execute no SQL Editor do Supabase (projeto ajokzpjguhfxxudteetr).
--
-- CONTEXTO: esta tabela era para ter sido criada em 2026-07-08 junto com as 5 LPs
-- de evento, mas o SQL nunca foi rodado. Confirmado por HTTP em 2026-08-11:
-- GET /rest/v1/eventos_agosto_leads -> 404 PGRST205 (tabela inexistente).
-- Como o front fazia .finally(done), o modal mostrava "Inscricao registrada!"
-- mesmo com o POST falhando -- todo lead capturado ate agora foi perdido.
--
-- NOME: a tabela original se chamaria eventos_agosto_leads, mas o ciclo tem
-- evento em setembro (Empreenday, 05/09). Como nao ha dado a migrar, nasce
-- com o nome certo.
--
-- Padrao RLS insert-only para o papel anon (mesmo de diagnostico_leads,
-- encontro_leads, desvendando_leads).

create table if not exists public.eventos_presenciais_leads (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  evento text not null,          -- propulsao-em-vendas | lideranca | oratoria | inteligencia-emocional | empreenday
  nome text not null,
  whatsapp text not null,
  origem text,                   -- 'lp-evento-<slug>'
  utm_source text,
  utm_medium text,
  utm_campaign text,
  utm_content text,
  utm_term text,
  referrer text,
  landing_url text
);

alter table public.eventos_presenciais_leads enable row level security;

-- Idempotente: recria a policy sem erro se ja existir.
drop policy if exists "insert_anon_eventos_presenciais" on public.eventos_presenciais_leads;
create policy "insert_anon_eventos_presenciais"
  on public.eventos_presenciais_leads
  for insert
  to anon
  with check (true);

-- Indice para consultar a agenda por evento.
create index if not exists eventos_presenciais_leads_evento_idx
  on public.eventos_presenciais_leads (evento, created_at desc);

comment on table public.eventos_presenciais_leads is
  'Leads dos eventos presenciais do ciclo Apogeu. Coluna evento discrimina qual LP originou.';
