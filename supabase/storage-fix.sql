-- Safe repair script for product image uploads.
-- Run this in the Supabase SQL Editor for the same project used by Vercel.

insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do update set public = true;

drop policy if exists "Public product images" on storage.objects;
drop policy if exists "Admins upload product images" on storage.objects;
drop policy if exists "Admins update product images" on storage.objects;

create policy "Public product images"
on storage.objects for select
using (bucket_id = 'product-images');

create policy "Admins upload product images"
on storage.objects for insert to authenticated
with check (
  bucket_id = 'product-images'
  and exists (
    select 1 from public.profiles
    where profiles.id = auth.uid() and profiles.role = 'admin'
  )
);

create policy "Admins update product images"
on storage.objects for update to authenticated
using (
  bucket_id = 'product-images'
  and exists (
    select 1 from public.profiles
    where profiles.id = auth.uid() and profiles.role = 'admin'
  )
)
with check (
  bucket_id = 'product-images'
  and exists (
    select 1 from public.profiles
    where profiles.id = auth.uid() and profiles.role = 'admin'
  )
);
