-- Run this once in Supabase Dashboard > SQL Editor.
create table public.guestbook_comments (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(btrim(name)) between 1 and 32),
  message text not null check (char_length(btrim(message)) between 1 and 500),
  created_at timestamptz not null default now(),
  approved boolean not null default false
);

alter table public.guestbook_comments enable row level security;

revoke all on table public.guestbook_comments from public, anon, authenticated;
grant usage on schema public to anon;
grant select, insert on table public.guestbook_comments to anon;

create policy "Visitors can read approved comments"
on public.guestbook_comments
for select to anon
using (approved = true);

create policy "Visitors can submit pending comments"
on public.guestbook_comments
for insert to anon
with check (approved = false);
