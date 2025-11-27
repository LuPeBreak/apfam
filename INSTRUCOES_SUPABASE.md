# Instruções de Integração com Supabase (Fase 2)

Este documento descreve os passos para integrar o Supabase ao projeto APFAM, substituindo os dados mockados por um banco de dados real.

## 1. Configuração do Projeto Supabase

1.  Crie um novo projeto no [Supabase](https://supabase.com).
2.  Anote a `Project URL` e a `anon public key`.

## 2. Variáveis de Ambiente

Crie um arquivo `.env.local` na raiz do projeto com as seguintes chaves:

```env
NEXT_PUBLIC_SUPABASE_URL=sua_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_anon_key
```

## 3. Estrutura do Banco de Dados

Execute o seguinte SQL no Editor SQL do Supabase para criar as tabelas:

```sql
-- Categorias
create table public.categories (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Associados
create table public.associates (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  bio text,
  avatar_url text,
  location text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Produtos
create table public.products (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  description text,
  image_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Tabela de Junção: Produtos <-> Categorias (Muitos-para-Muitos)
create table public.product_categories (
  product_id uuid references public.products(id) on delete cascade,
  category_id uuid references public.categories(id) on delete cascade,
  primary key (product_id, category_id)
);

-- Tabela de Junção: Associados <-> Produtos (Muitos-para-Muitos)
-- Um associado pode vender vários produtos, e um produto (tipo) pode ser vendido por vários associados?
-- No modelo atual mockado, o associado tem uma lista de produtos.
-- Se o produto for único por associado, adicione associate_id na tabela products.
-- Se for um catálogo geral e o associado diz "eu vendo isso", use esta tabela:
create table public.associate_products (
  associate_id uuid references public.associates(id) on delete cascade,
  product_id uuid references public.products(id) on delete cascade,
  primary key (associate_id, product_id)
);

-- Eventos
create table public.events (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  description text,
  date timestamp with time zone not null,
  location text,
  image_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);
```

## 4. Row Level Security (RLS)

Ative o RLS para todas as tabelas e crie políticas. Para desenvolvimento inicial (permitir tudo):

```sql
alter table public.categories enable row level security;
alter table public.associates enable row level security;
alter table public.products enable row level security;
alter table public.events enable row level security;

create policy "Public Access" on public.categories for select using (true);
create policy "Public Access" on public.associates for select using (true);
create policy "Public Access" on public.products for select using (true);
create policy "Public Access" on public.events for select using (true);

-- Para Admin (escrita), você precisará configurar autenticação.
```

## 5. Próximos Passos

1.  Instalar o cliente Supabase: `npm install @supabase/supabase-js`
2.  Criar um cliente singleton em `lib/supabase.ts`.
3.  Substituir as chamadas `MOCK_...` por chamadas ao Supabase.
