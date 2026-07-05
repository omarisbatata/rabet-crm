-- ⚠️ DO NOT RUN THIS FILE ANYMORE. It is insecure and kept only for reference.
-- The "using (true)" policies below let anyone with the public anon key read,
-- edit and delete the whole database. Run schema-security.sql instead — it
-- replaces everything here with locked-down, key-checked access.
--
-- (Original, insecure schema below.)
-- Run this in your Supabase project → SQL Editor

-- Users (auth)
create table if not exists public.users (
  name      text primary key,
  key_hash  text not null,
  created_at timestamptz default now()
);

-- Companies
create table if not exists public.companies (
  id            bigserial primary key,
  name          text not null,
  industry      text default '',
  contact_type  text default '',
  contact_value text default '',
  service       text default '',
  status        integer default 0,
  assigned      text default '',
  followup      text default '',
  notes         text default '',
  modified_by   text default '',
  created_at    timestamptz default now(),
  updated_at    timestamptz default now()
);

-- Row Level Security (allow anon — auth is client-side)
alter table public.users    enable row level security;
alter table public.companies enable row level security;

create policy "users_select"   on public.users    for select using (true);
create policy "users_insert"   on public.users    for insert with check (true);
create policy "users_update"   on public.users    for update using (true);
create policy "companies_all"  on public.companies for all using (true) with check (true);

-- Enable real-time
alter publication supabase_realtime add table public.companies;
