-- Enable unaccent extension for better slug generation (removes accents)
create extension if not exists unaccent;

-- Create a slugify function
create or replace function slugify(v text)
returns text as $$
begin
  -- 1. Lowercase
  -- 2. Remove accents (unaccent)
  -- 3. Replace non-alphanumeric with hyphens
  -- 4. Trim hyphens from ends
  return trim(both '-' from regexp_replace(lower(unaccent(v)), '[^a-z0-9]+', '-', 'g'));
end;
$$ language plpgsql;

-- 1. Add slug columns (nullable at first)
alter table public.events add column if not exists slug text;
alter table public.associates add column if not exists slug text;
alter table public.products add column if not exists slug text;

-- 2. Update existing records with unique slugs
-- Events
with numbered as (
  select id, title, row_number() over (partition by slugify(title) order by created_at) as rn
  from public.events
)
update public.events
set slug = case 
  when n.rn = 1 then slugify(n.title)
  else slugify(n.title) || '-' || n.rn
end
from numbered n
where public.events.id = n.id;

-- Associates
with numbered as (
  select id, name, row_number() over (partition by slugify(name) order by created_at) as rn
  from public.associates
)
update public.associates
set slug = case 
  when n.rn = 1 then slugify(n.name)
  else slugify(n.name) || '-' || n.rn
end
from numbered n
where public.associates.id = n.id;

-- Products
with numbered as (
  select id, name, row_number() over (partition by slugify(name) order by created_at) as rn
  from public.products
)
update public.products
set slug = case 
  when n.rn = 1 then slugify(n.name)
  else slugify(n.name) || '-' || n.rn
end
from numbered n
where public.products.id = n.id;

-- 3. Make columns NOT NULL and UNIQUE
alter table public.events alter column slug set not null;
alter table public.events add constraint events_slug_key unique (slug);

alter table public.associates alter column slug set not null;
alter table public.associates add constraint associates_slug_key unique (slug);

alter table public.products alter column slug set not null;
alter table public.products add constraint products_slug_key unique (slug);
