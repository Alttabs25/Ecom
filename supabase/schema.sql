-- Run this in the Supabase SQL editor, then create an Auth user and add its id to profiles.
create extension if not exists "pgcrypto";

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role text not null default 'admin' check (role in ('admin'))
);

create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  description text default '',
  created_at timestamptz not null default now()
);

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  category text not null,
  price numeric(10,2) not null check (price >= 0),
  short_description text default '',
  description text default '',
  availability text not null default 'Available' check (availability in ('Available','Made to Order','Out of Stock')),
  colors text[] not null default '{}',
  sizes text[] not null default '{}',
  customization text default '',
  featured boolean not null default false,
  image_url text default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;
alter table public.categories enable row level security;
alter table public.products enable row level security;

create policy "Admins can read own profile" on public.profiles for select to authenticated
  using (id = auth.uid());
create policy "Catalog categories are public" on public.categories for select using (true);
create policy "Catalog products are public" on public.products for select using (true);
create policy "Admins manage categories" on public.categories for all to authenticated
  using (exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'))
  with check (exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'));
create policy "Admins manage products" on public.products for all to authenticated
  using (exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'))
  with check (exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'));

insert into storage.buckets (id, name, public) values ('product-images', 'product-images', true)
on conflict (id) do update set public = true;
create policy "Public product images" on storage.objects for select using (bucket_id = 'product-images');
create policy "Admins upload product images" on storage.objects for insert to authenticated
  with check (bucket_id = 'product-images' and exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'));
create policy "Admins update product images" on storage.objects for update to authenticated
  using (bucket_id = 'product-images' and exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'));

-- After creating the admin in Authentication > Users, run:
-- insert into public.profiles (id, role) values ('AUTH-USER-UUID', 'admin');
