-- AMDV-016: executar no SQL Editor de um projeto Supabase.
-- Script de instalação, não cria usuário nem senha e não altera dados já salvos.
-- O acesso ao conteúdo é realizado SOMENTE pelas APIs verificadas no servidor.
begin;
create table if not exists public.amdv_portfolio_content (
 id integer primary key check (id = 1),
 content jsonb not null check (jsonb_typeof(content) = 'object'),
 revision integer not null check (revision > 0),
 updated_at timestamptz not null default now(),
 updated_by uuid not null
);
alter table public.amdv_portfolio_content enable row level security;
revoke all on public.amdv_portfolio_content from public, anon, authenticated;
grant select, insert, update on public.amdv_portfolio_content to service_role;
-- Nenhuma policy pública: rascunhos não podem ser consultados pelo navegador.
-- service_role permanece apenas no servidor, depois da verificação do admin.
insert into storage.buckets (id,name,public,file_size_limit,allowed_mime_types)
values ('amdv-media','amdv-media',true,26214400,array['image/jpeg','image/png','image/webp','image/avif','video/mp4','video/webm'])
on conflict (id) do update set public=excluded.public, file_size_limit=excluded.file_size_limit, allowed_mime_types=excluded.allowed_mime_types;
-- Não criamos policies de escrita pública no Storage. O servidor gera um token
-- temporário para um único caminho após verificar a identidade administradora.
commit;
