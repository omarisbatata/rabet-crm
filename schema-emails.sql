-- ═══════════════════════════════════════════════════════════════════════════
-- Rabet CRM — EMAIL CORRESPONDENCE.  Run this ONCE in the Supabase SQL Editor.
-- (Open your project → SQL Editor → New query → paste all of this → Run.)
-- ═══════════════════════════════════════════════════════════════════════════
--
-- What this adds:
--   • emails    — actual client email correspondence (inbound + outbound),
--                 optionally linked to a company in the CRM.
--   • templates — reusable email templates, grouped by category.
--
-- Why it is locked down the same way as companies/users:
--   This table holds REAL client email bodies — private correspondence and
--   PII. The anon key ships inside app.js on the public website, so it must
--   NOT be able to read or write these tables directly. Exactly like
--   schema-security.sql, we:
--     • enable RLS with ZERO permissive policies (anon can touch nothing),
--     • put all browser access behind SECURITY DEFINER crm_* functions that
--       verify a valid team name + key hash on every call via crm_verify(),
--     • grant EXECUTE on only those functions to anon at the very end.
--
-- Prerequisite: run schema-security.sql FIRST. This file reuses the users
-- table, the companies table, and the public.crm_verify(text, text) helper
-- defined there.
--
-- ───────────────────────────────────────────────────────────────────────────
-- ARCHITECTURAL NOTE — how inbound mail actually gets in (READ THIS):
--
--   There are two completely different callers of this database, and they use
--   two different keys:
--
--   1. THE BROWSER (app.js) — holds the PUBLIC anon key. It can only call the
--      crm_* functions granted at the bottom of this file, each of which
--      checks a team member's name + key hash first. This is how a logged-in
--      team member reads unlinked mail, links it to a company, replies, etc.
--
--   2. THE INBOUND SYNC JOB — a scheduled server-side cron process (e.g. a
--      Vercel cron / serverless function) that polls the mailbox over IMAP and
--      writes new inbound emails into this table. This process is TRUSTED and
--      runs OFF the browser. It authenticates with the Supabase SERVICE_ROLE
--      key, held only as a server-side secret (Vercel env var) and NEVER
--      shipped to the browser. service_role bypasses RLS and grants by design.
--
--   That split is the whole safety argument: the browser only ever has the
--   anon key (which can't touch these tables except through the locked-down
--   crm_* functions), while the powerful service_role key lives only on the
--   server and never reaches a client. The cron job therefore does NOT — and
--   must not — go through the crm_* RPCs; it has no team-member key and
--   doesn't need one.
--
--   Because the cron job authenticates as service_role, it can simply run a
--   plain `insert ... on conflict (gmail_message_id) do nothing` itself. We DO
--   still define a small helper, crm_insert_inbound_email(), purely as an
--   optional convenience so the server code has one canonical place for the
--   dedupe + column mapping (and so a future reviewer can see the intended
--   shape of an inbound row). It is deliberately NOT granted to anon. It does
--   NOT call crm_verify — service_role is already fully trusted, and adding a
--   key check would be pointless (service_role has no team key either). If you
--   prefer, you can ignore this helper entirely and have the cron job do the
--   raw insert; both are equivalent under service_role.
-- ═══════════════════════════════════════════════════════════════════════════


-- ── 1. Tables (safe to re-run) ─────────────────────────────────────────────
create extension if not exists pgcrypto;  -- for gen_random_uuid() below

create table if not exists public.emails (
  id               bigserial primary key,
  gmail_message_id text unique not null,          -- dedupe key from Gmail/IMAP
  thread_id        text,                           -- groups a conversation
  direction        text not null check (direction in ('inbound','outbound')),
  from_address     text not null default '',
  to_addresses     text not null default '',       -- comma-separated, plain text
  subject          text default '',
  body_text        text default '',
  body_html        text default '',
  received_at      timestamptz not null default now(),
  company_id       bigint references public.companies(id) on delete set null,
                                                    -- null = unlinked
  linked_at        timestamptz,                     -- when it was linked (nullable)
  created_at       timestamptz default now()
);

-- Helpful indexes for the list functions below.
create index if not exists emails_company_id_idx on public.emails (company_id);
create index if not exists emails_thread_id_idx  on public.emails (thread_id);
create index if not exists emails_received_at_idx on public.emails (received_at desc);

create table if not exists public.templates (
  id         bigserial primary key,
  category   text not null,
  name       text not null,
  subject    text default '',
  body       text default '',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);


-- ── 2. LOCK THE TABLES ─────────────────────────────────────────────────────
-- RLS on + no policies => anon/public cannot read or write directly. The only
-- way in from the browser is the crm_* functions below (which check the key).
-- service_role (the trusted cron job) bypasses this by design.
alter table public.emails    enable row level security;
alter table public.templates enable row level security;

-- Drop any stray policies (in case this file is re-run after edits).
do $$
declare pol record;
begin
  for pol in
    select policyname, tablename from pg_policies
    where schemaname = 'public' and tablename in ('emails','templates')
  loop
    execute format('drop policy %I on public.%I', pol.policyname, pol.tablename);
  end loop;
end $$;

revoke all on public.emails    from anon, authenticated;
revoke all on public.templates from anon, authenticated;


-- ── 3. Email functions (all require a valid key via crm_verify) ────────────

-- List unlinked emails (not yet attached to a company), newest first.
create or replace function public.crm_list_unlinked_emails(p_name text, p_key_hash text)
returns setof public.emails
language plpgsql
stable
security definer
set search_path = public
as $$
begin
  if not public.crm_verify(p_name, p_key_hash) then
    return; -- returns nothing to callers without a valid key
  end if;
  return query
    select * from public.emails
    where company_id is null
    order by received_at desc;
end;
$$;

-- List all emails linked to one company, newest first.
create or replace function public.crm_list_company_emails(
  p_name text, p_key_hash text, p_company_id bigint)
returns setof public.emails
language plpgsql
stable
security definer
set search_path = public
as $$
begin
  if not public.crm_verify(p_name, p_key_hash) then
    return;
  end if;
  return query
    select * from public.emails
    where company_id = p_company_id
    order by received_at desc;
end;
$$;

-- Link an email to a company (sets company_id + linked_at). Returns true if a
-- row was updated.
create or replace function public.crm_link_email(
  p_name text, p_key_hash text, p_email_id bigint, p_company_id bigint)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.crm_verify(p_name, p_key_hash) then
    raise exception 'not authorized';
  end if;
  update public.emails
  set company_id = p_company_id,
      linked_at  = now()
  where id = p_email_id;
  return found;
end;
$$;

-- Unlink an email (undo a mistaken link): clears company_id + linked_at.
create or replace function public.crm_unlink_email(
  p_name text, p_key_hash text, p_email_id bigint)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.crm_verify(p_name, p_key_hash) then
    raise exception 'not authorized';
  end if;
  update public.emails
  set company_id = null,
      linked_at  = null
  where id = p_email_id;
  return found;
end;
$$;

-- Insert an outbound reply (a team member replying from the CRM).
-- Writes a direction='outbound' row. If the thread is already linked to a
-- company (any existing row with the same thread_id has a company_id), the new
-- reply inherits that company_id and is marked linked; otherwise it stays
-- unlinked alongside the rest of the thread. Returns the new row id.
create or replace function public.crm_insert_outbound_email(
  p_name text, p_key_hash text, p_data jsonb)
returns bigint
language plpgsql
security definer
set search_path = public
as $$
declare
  v_thread_id  text;
  v_company_id bigint;
  v_id         bigint;
begin
  if not public.crm_verify(p_name, p_key_hash) then
    raise exception 'not authorized';
  end if;

  v_thread_id := p_data->>'thread_id';

  -- Inherit company_id from the most recent already-linked message in the
  -- same thread, if any. (Null thread_id / no match => stays null/unlinked.)
  if v_thread_id is not null then
    select company_id into v_company_id
    from public.emails
    where thread_id = v_thread_id
      and company_id is not null
    order by received_at desc
    limit 1;
  end if;

  insert into public.emails
    (gmail_message_id, thread_id, direction,
     from_address, to_addresses, subject, body_text, body_html,
     received_at, company_id, linked_at, created_at)
  values (
    coalesce(p_data->>'gmail_message_id',
             'outbound-' || gen_random_uuid()::text),  -- unique fallback id
    v_thread_id,
    'outbound',
    coalesce(p_data->>'from_address',''),
    coalesce(p_data->>'to_addresses',''),
    coalesce(p_data->>'subject',''),
    coalesce(p_data->>'body_text',''),
    coalesce(p_data->>'body_html',''),
    now(),
    v_company_id,
    case when v_company_id is not null then now() else null end,
    now())
  returning id into v_id;

  return v_id;
end;
$$;


-- ── 4. Template functions (all require a valid key) ────────────────────────

-- List all templates, grouped by category then name.
create or replace function public.crm_list_templates(p_name text, p_key_hash text)
returns setof public.templates
language plpgsql
stable
security definer
set search_path = public
as $$
begin
  if not public.crm_verify(p_name, p_key_hash) then
    return;
  end if;
  return query select * from public.templates order by category, name;
end;
$$;

-- Insert (p_id null) or update (p_id set) a template. Returns the row id.
create or replace function public.crm_upsert_template(
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
    insert into public.templates (category, name, subject, body, created_at, updated_at)
    values (
      coalesce(p_data->>'category',''),
      coalesce(p_data->>'name',''),
      coalesce(p_data->>'subject',''),
      coalesce(p_data->>'body',''),
      now(), now())
    returning id into v_id;
  else
    update public.templates set
      category   = coalesce(p_data->>'category', category),
      name       = coalesce(p_data->>'name', name),
      subject    = coalesce(p_data->>'subject', subject),
      body       = coalesce(p_data->>'body', body),
      updated_at = now()
    where id = p_id
    returning id into v_id;
  end if;

  return v_id;
end;
$$;

-- Delete a template.
create or replace function public.crm_delete_template(
  p_name text, p_key_hash text, p_id bigint)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.crm_verify(p_name, p_key_hash) then
    raise exception 'not authorized';
  end if;
  delete from public.templates where id = p_id;
  return found;
end;
$$;


-- ── 5. Inbound helper for the TRUSTED server-side cron job ONLY ─────────────
-- See the ARCHITECTURAL NOTE at the top. This is a convenience wrapper for the
-- IMAP sync job, which authenticates as service_role and therefore bypasses
-- RLS and grants. It does the dedupe (on conflict do nothing) so a re-poll of
-- the same message is a no-op. It is deliberately NOT granted to anon, and it
-- does NOT call crm_verify (service_role is already fully trusted; there is no
-- team-member key involved). Returns the inserted row id, or null if the
-- message was already stored.
--
-- Note: new inbound mail is always inserted UNLINKED (company_id null). A team
-- member links it from the browser via crm_link_email. We intentionally do not
-- auto-inherit a thread's company here — see the human sanity-check note in the
-- accompanying report about inbound auto-linking.
create or replace function public.crm_insert_inbound_email(p_data jsonb)
returns bigint
language plpgsql
security definer
set search_path = public
as $$
declare
  v_id bigint;
begin
  insert into public.emails
    (gmail_message_id, thread_id, direction,
     from_address, to_addresses, subject, body_text, body_html, received_at)
  values (
    p_data->>'gmail_message_id',      -- must be present; NOT NULL enforces this
    p_data->>'thread_id',
    'inbound',
    coalesce(p_data->>'from_address',''),
    coalesce(p_data->>'to_addresses',''),
    coalesce(p_data->>'subject',''),
    coalesce(p_data->>'body_text',''),
    coalesce(p_data->>'body_html',''),
    coalesce((p_data->>'received_at')::timestamptz, now()))
  on conflict (gmail_message_id) do nothing
  returning id into v_id;

  return v_id;  -- null when the message already existed (deduped)
end;
$$;
-- (No grant to anon on crm_insert_inbound_email — service_role calls it.)


-- ── 6. Expose ONLY the browser-facing functions to the public anon key ─────
-- crm_insert_inbound_email is intentionally omitted (server-side/service_role).
grant execute on function public.crm_list_unlinked_emails(text, text)                to anon;
grant execute on function public.crm_list_company_emails(text, text, bigint)         to anon;
grant execute on function public.crm_link_email(text, text, bigint, bigint)          to anon;
grant execute on function public.crm_unlink_email(text, text, bigint)                to anon;
grant execute on function public.crm_insert_outbound_email(text, text, jsonb)        to anon;
grant execute on function public.crm_list_templates(text, text)                      to anon;
grant execute on function public.crm_upsert_template(text, text, bigint, jsonb)      to anon;
grant execute on function public.crm_delete_template(text, text, bigint)             to anon;

-- ═══════════════════════════════════════════════════════════════════════════
-- Done. The anon key in app.js can only call the eight crm_* functions above,
-- each of which checks the caller's name + key first. Email bodies are never
-- reachable with the anon key alone. The inbound cron job uses service_role
-- (a server-only secret) and writes directly / via crm_insert_inbound_email.
-- ═══════════════════════════════════════════════════════════════════════════
