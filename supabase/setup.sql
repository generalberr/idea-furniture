-- IDEA Furniture — database setup for the new site.
-- Run ONCE in Supabase: Dashboard > SQL Editor > New query > paste > Run.
-- It is safe to run twice. It does not delete or change any product.
--
-- BEFORE YOU RUN: put your own admin email on the line marked <<< below.

-- 1) Who is allowed to manage the shop ----------------------------------------
create table if not exists public.staff (email text primary key);
alter table public.staff enable row level security;

insert into public.staff (email) values ('YOUR_EMAIL_HERE')   -- <<< your email, lowercase
on conflict do nothing;

create or replace function public.is_staff() returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.staff where email = lower(auth.jwt() ->> 'email'));
$$;

-- 2) Products: everyone can read, only staff can change -----------------------
-- (Until now anyone on the internet could edit or delete your products.)
drop policy if exists "Enable full access for admin" on public.products;
drop policy if exists "Staff manage products" on public.products;
create policy "Staff manage products" on public.products
  for all to authenticated using (public.is_staff()) with check (public.is_staff());

-- 3) Quote and bespoke requests from the website -------------------------------
create table if not exists public.requests (
  id          bigint generated always as identity primary key,
  created_at  timestamptz not null default now(),
  kind        text not null default 'quote',      -- 'quote' | 'bespoke' | 'question'
  status      text not null default 'New',        -- New | In progress | Quoted | Won | Closed
  name        text not null,
  phone       text,
  email       text,
  area        text,
  piece       text,
  finish      text,
  size        text,
  message     text,
  details     jsonb not null default '{}'::jsonb,
  note        text
);
alter table public.requests enable row level security;

drop policy if exists "Anyone can send a request" on public.requests;
create policy "Anyone can send a request" on public.requests
  for insert to anon, authenticated with check (status = 'New' and note is null);

drop policy if exists "Staff read requests" on public.requests;
create policy "Staff read requests" on public.requests
  for select to authenticated using (public.is_staff());

drop policy if exists "Staff update requests" on public.requests;
create policy "Staff update requests" on public.requests
  for update to authenticated using (public.is_staff()) with check (public.is_staff());

drop policy if exists "Staff delete requests" on public.requests;
create policy "Staff delete requests" on public.requests
  for delete to authenticated using (public.is_staff());

-- 4) Site settings (WhatsApp number, address, hours, featured pieces...) ------
create table if not exists public.site_settings (
  id         int primary key default 1 check (id = 1),
  data       jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);
insert into public.site_settings (id) values (1) on conflict do nothing;
alter table public.site_settings enable row level security;

drop policy if exists "Anyone can read settings" on public.site_settings;
create policy "Anyone can read settings" on public.site_settings
  for select to anon, authenticated using (true);

drop policy if exists "Staff change settings" on public.site_settings;
create policy "Staff change settings" on public.site_settings
  for update to authenticated using (public.is_staff()) with check (public.is_staff());

-- 5) Photo uploads from the admin ----------------------------------------------
insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do nothing;

drop policy if exists "Public read product images" on storage.objects;
create policy "Public read product images" on storage.objects
  for select using (bucket_id = 'product-images');

drop policy if exists "Staff upload product images" on storage.objects;
create policy "Staff upload product images" on storage.objects
  for insert to authenticated with check (bucket_id = 'product-images' and public.is_staff());

drop policy if exists "Staff replace product images" on storage.objects;
create policy "Staff replace product images" on storage.objects
  for update to authenticated using (bucket_id = 'product-images' and public.is_staff());

drop policy if exists "Staff delete product images" on storage.objects;
create policy "Staff delete product images" on storage.objects
  for delete to authenticated using (bucket_id = 'product-images' and public.is_staff());
