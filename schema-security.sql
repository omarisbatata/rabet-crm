-- ═══════════════════════════════════════════════════════════════════════════
-- Rabet CRM — SECURITY FIX.  Run this ONCE in the Supabase SQL Editor.
-- (Open your project → SQL Editor → New query → paste all of this → Run.)
-- ═══════════════════════════════════════════════════════════════════════════
--
-- The problem this fixes:
--   The old schema.sql used "using (true)" policies and kept auth on the
--   client. Because the anon key is public (it ships inside app.js on the
--   website), ANYONE who opened the site could talk straight to the database
--   and:
--     • download every company / lead in the CRM,
--     • edit or DELETE all of them,
--     • read the login key hashes out of the users table,
--     • overwrite any team member's key and lock them out.
--
-- After this script:
--   • The anon key alone can do NOTHING to the tables directly.
--   • All reads and writes go through security-checked functions that require
--     a correct name + key on every single call.
--   • Key hashes are never sent to the browser again.
--
-- Nothing about how you log in changes (same names, same key).
-- ═══════════════════════════════════════════════════════════════════════════


-- ── 1. Make sure the tables exist (safe to re-run) ─────────────────────────
create table if not exists public.users (
  name       text primary key,
  key_hash   text not null,
  created_at timestamptz default now()
);

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


-- ── 2. LOCK THE TABLES ─────────────────────────────────────────────────────
-- Enable RLS and remove every direct grant. With RLS on and no policies, the
-- anon/public key can't read or write these tables at all — the only way in is
-- the functions defined below, which do their own key check.
alter table public.users     enable row level security;
alter table public.companies enable row level security;

-- Drop any leftover "using (true)" policies from the old schema.
do $$
declare pol record;
begin
  for pol in
    select policyname, tablename from pg_policies
    where schemaname = 'public' and tablename in ('users','companies')
  loop
    execute format('drop policy %I on public.%I', pol.policyname, pol.tablename);
  end loop;
end $$;

revoke all on public.users     from anon, authenticated;
revoke all on public.companies from anon, authenticated;

-- Stop broadcasting company changes over public realtime (we now poll instead).
do $$
begin
  alter publication supabase_realtime drop table public.companies;
exception when others then
  null; -- wasn't in the publication; ignore
end $$;


-- ── 3. Internal helper: verify a name + key hash ───────────────────────────
create or replace function public.crm_verify(p_name text, p_key_hash text)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.users
    where name = p_name and key_hash = p_key_hash
  );
$$;


-- ── 4. Auth functions ──────────────────────────────────────────────────────

-- Does this team member already have a key set? ('exists' | 'none')
create or replace function public.crm_user_status(p_name text)
returns text
language sql
stable
security definer
set search_path = public
as $$
  select case when exists (select 1 from public.users where name = p_name)
              then 'exists' else 'none' end;
$$;

-- First-time setup: claim one of the three team names by setting its key.
-- Only the three known team names are allowed, and only if not already claimed.
create or replace function public.crm_register(p_name text, p_key_hash text)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
begin
  if p_name not in ('Omar', 'Taim Kiwan', 'Taim Al Saadi') then
    return false;
  end if;
  insert into public.users (name, key_hash)
  values (p_name, p_key_hash)
  on conflict (name) do nothing;
  return found;
end;
$$;

-- Log in: true only if name + key hash match.
create or replace function public.crm_login(p_name text, p_key_hash text)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select public.crm_verify(p_name, p_key_hash);
$$;

-- Change key: needs the current key hash to be correct.
create or replace function public.crm_change_key(p_name text, p_old_hash text, p_new_hash text)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.users
  set key_hash = p_new_hash
  where name = p_name and key_hash = p_old_hash;
  return found;
end;
$$;


-- ── 5. Company data functions (all require a valid key) ────────────────────

-- Read all companies.
create or replace function public.crm_list_companies(p_name text, p_key_hash text)
returns setof public.companies
language plpgsql
stable
security definer
set search_path = public
as $$
begin
  if not public.crm_verify(p_name, p_key_hash) then
    return; -- returns nothing to callers without a valid key
  end if;
  return query select * from public.companies order by updated_at desc;
end;
$$;

-- Insert (p_id null) or update (p_id set) a company. Returns the row id.
create or replace function public.crm_upsert_company(
  p_name text, p_key_hash text, p_id bigint, p_data jsonb)
returns bigint
language plpgsql
security definer
set search_path = public
as $$
declare
  v_id bigint;
begin
  if not public.crm_verify(p_name, p_key_hash) then
    raise exception 'not authorized';
  end if;

  if p_id is null then
    insert into public.companies
      (name, industry, contact_type, contact_value, service, status,
       assigned, followup, notes, modified_by, created_at, updated_at)
    values (
      coalesce(p_data->>'name',''),          coalesce(p_data->>'industry',''),
      coalesce(p_data->>'contact_type',''),  coalesce(p_data->>'contact_value',''),
      coalesce(p_data->>'service',''),       coalesce((p_data->>'status')::int, 0),
      coalesce(p_data->>'assigned',''),      coalesce(p_data->>'followup',''),
      coalesce(p_data->>'notes',''),         p_name,
      now(), now())
    returning id into v_id;
  else
    update public.companies set
      name          = coalesce(p_data->>'name', name),
      industry      = coalesce(p_data->>'industry', industry),
      contact_type  = coalesce(p_data->>'contact_type', contact_type),
      contact_value = coalesce(p_data->>'contact_value', contact_value),
      service       = coalesce(p_data->>'service', service),
      status        = coalesce((p_data->>'status')::int, status),
      assigned      = coalesce(p_data->>'assigned', assigned),
      followup      = coalesce(p_data->>'followup', followup),
      notes         = coalesce(p_data->>'notes', notes),
      modified_by   = p_name,
      updated_at    = now()
    where id = p_id
    returning id into v_id;
  end if;

  return v_id;
end;
$$;

-- Delete a company.
create or replace function public.crm_delete_company(p_name text, p_key_hash text, p_id bigint)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.crm_verify(p_name, p_key_hash) then
    raise exception 'not authorized';
  end if;
  delete from public.companies where id = p_id;
  return found;
end;
$$;


-- ── 6. Expose ONLY the functions to the public anon key ────────────────────
-- crm_verify stays private (internal helper only).
revoke all on function public.crm_verify(text, text) from public, anon, authenticated;

grant execute on function public.crm_user_status(text)                     to anon;
grant execute on function public.crm_register(text, text)                  to anon;
grant execute on function public.crm_login(text, text)                     to anon;
grant execute on function public.crm_change_key(text, text, text)          to anon;
grant execute on function public.crm_list_companies(text, text)            to anon;
grant execute on function public.crm_upsert_company(text, text, bigint, jsonb) to anon;
grant execute on function public.crm_delete_company(text, text, bigint)    to anon;

-- ═══════════════════════════════════════════════════════════════════════════
-- Done. The anon key in app.js can now only call the seven crm_* functions,
-- and each of them checks the caller's key first. Existing keys keep working.
-- ═══════════════════════════════════════════════════════════════════════════
