-- Enable Row Level Security (RLS)
alter default privileges in schema public grant all on tables to postgres, service_role;

-- NOTE ON STORAGE CLEANUP:
-- While database records are deleted with 'ON DELETE CASCADE', associated files in Supabase Storage 
-- are NOT automatically deleted by SQL constraints alone. 
-- The application handles this via 'deleteImageFromStorage' in 'storage-utils.ts'.
-- To enforce this at the database level, you would need a custom trigger invoking an Edge Function,
-- which adds complexity and cost. We rely on the application logic for now.


-- 1. Categories
create table if not exists public.categories (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Products
create table if not exists public.products (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  description text,
  image_url text,
  slug text not null unique,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. Associates
create table if not exists public.associates (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  bio text,
  avatar_url text,
  location text,
  slug text not null unique,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 4. Events
create table if not exists public.events (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  description text,
  date timestamp with time zone not null,
  location text,
  image_url text,
  slug text not null unique,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 5. Product Categories (Many-to-Many)
create table if not exists public.product_categories (
  product_id uuid references public.products(id) on delete cascade,
  category_id uuid references public.categories(id) on delete cascade,
  primary key (product_id, category_id)
);

-- 6. Associate Products (Many-to-Many)
create table if not exists public.associate_products (
  associate_id uuid references public.associates(id) on delete cascade,
  product_id uuid references public.products(id) on delete cascade,
  primary key (associate_id, product_id)
);

-- Enable RLS
alter table public.categories enable row level security;
alter table public.products enable row level security;
alter table public.associates enable row level security;
alter table public.events enable row level security;
alter table public.product_categories enable row level security;
alter table public.associate_products enable row level security;

-- Policies

-- PUBLIC READ ACCESS (Allow everyone to see content)
create policy "Public Read Categories" on public.categories for select using (true);
create policy "Public Read Products" on public.products for select using (true);
create policy "Public Read Associates" on public.associates for select using (true);
create policy "Public Read Events" on public.events for select using (true);
create policy "Public Read Product Categories" on public.product_categories for select using (true);
create policy "Public Read Associate Products" on public.associate_products for select using (true);

-- ADMIN WRITE ACCESS (Only authenticated users can create/update/delete)
-- Assumption: Any logged-in user is an admin for now. 
-- For stricter control, check a user role or email claim.

create policy "Admin Write Categories" on public.categories for all using (auth.role() = 'authenticated');
create policy "Admin Write Products" on public.products for all using (auth.role() = 'authenticated');
create policy "Admin Write Associates" on public.associates for all using (auth.role() = 'authenticated');
create policy "Admin Write Events" on public.events for all using (auth.role() = 'authenticated');
create policy "Admin Write Product Categories" on public.product_categories for all using (auth.role() = 'authenticated');
create policy "Admin Write Associate Products" on public.associate_products for all using (auth.role() = 'authenticated');

-- Storage Buckets Setup (Run this in SQL Editor)
-- Note: Buckets might need to be created manually in the Dashboard if SQL fails.

insert into storage.buckets (id, name, public) 
values ('images', 'images', true)
on conflict (id) do nothing;

-- Storage Policies (Strict RLS)

-- 1. Public Read Access (Anyone can see images)
create policy "Public Access Images" 
on storage.objects for select 
using ( bucket_id = 'images' );

-- 2. Authenticated Upload (Only logged-in users can upload)
create policy "Authenticated Upload Images" 
on storage.objects for insert 
with check ( bucket_id = 'images' and auth.role() = 'authenticated' );

-- 3. Owner/Admin Delete (Only logged-in users can delete)
-- Ideally, you'd verify ownership, but for now we trust authenticated users (Admins)
create policy "Authenticated Delete Images" 
on storage.objects for delete 
using ( bucket_id = 'images' and auth.role() = 'authenticated' );

