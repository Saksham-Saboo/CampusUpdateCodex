-- Run this on your existing Supabase project (SQL editor).
-- Creates tables for lead magnet downloads and WhatsApp brochure requests.

create table if not exists public.lead_magnet_downloads (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  email text not null,
  name text,
  phone text,
  magnet_slug text not null,
  source text,
  consent boolean not null default true
);
create index if not exists lead_magnet_downloads_email_idx on public.lead_magnet_downloads (email);
create index if not exists lead_magnet_downloads_created_idx on public.lead_magnet_downloads (created_at desc);
alter table public.lead_magnet_downloads enable row level security;
drop policy if exists "anyone can submit lead magnet" on public.lead_magnet_downloads;
create policy "anyone can submit lead magnet" on public.lead_magnet_downloads
  for insert to anon, authenticated with check (true);
drop policy if exists "admins read lead magnet downloads" on public.lead_magnet_downloads;
create policy "admins read lead magnet downloads" on public.lead_magnet_downloads
  for select to authenticated using (public.has_role(auth.uid(), 'admin'));

create table if not exists public.brochure_requests (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  college_id uuid references public.colleges(id) on delete set null,
  college_name text,
  phone text not null,
  name text,
  source text default 'exit_intent'
);
alter table public.brochure_requests enable row level security;
drop policy if exists "anyone can request brochure" on public.brochure_requests;
create policy "anyone can request brochure" on public.brochure_requests
  for insert to anon, authenticated with check (true);
drop policy if exists "admins read brochure requests" on public.brochure_requests;
create policy "admins read brochure requests" on public.brochure_requests
  for select to authenticated using (public.has_role(auth.uid(), 'admin'));
