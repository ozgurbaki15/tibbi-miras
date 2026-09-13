-- Tıbbi Miras: izole mağaza, profil, sipariş, yorum ve promosyon şeması.
-- Bu migration mevcut ansiklopedi tablolarını değiştirmez veya silmez.

create table if not exists public.tma_profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null default '',
  avatar_url text not null default '',
  phone text not null default '',
  address jsonb not null default '{}'::jsonb,
  comment_banned boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.tma_orders (
  id uuid primary key default gen_random_uuid(),
  order_number text not null unique,
  user_id uuid not null references auth.users(id) on delete restrict,
  status text not null default 'pending',
  subtotal_kurus integer not null,
  shipping_kurus integer not null default 0,
  total_kurus integer not null,
  phone_snapshot text not null,
  address_snapshot jsonb not null default '{}'::jsonb,
  current_phone text,
  current_address jsonb,
  phone_warning boolean not null default false,
  address_warning boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.tma_order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.tma_orders(id) on delete cascade,
  product_id uuid not null references public.shop_products(id) on delete restrict,
  product_name text not null,
  unit_price_kurus integer not null,
  quantity integer not null check (quantity > 0),
  created_at timestamptz not null default now()
);

create table if not exists public.tma_article_comments (
  id uuid primary key default gen_random_uuid(),
  article_id text not null,
  user_id uuid not null references auth.users(id) on delete cascade,
  body text not null check (char_length(body) between 1 and 2000),
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.tma_promo_codes (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  kind text not null check (kind in ('percent', 'fixed')),
  value integer not null check (value > 0),
  scope jsonb not null default '{}'::jsonb,
  max_uses integer,
  used_count integer not null default 0,
  starts_at timestamptz,
  ends_at timestamptz,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.tma_membership_grants (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  user_id uuid references auth.users(id) on delete set null,
  tier text not null check (tier in ('premium', 'platin')),
  duration_days integer,
  max_uses integer not null default 1,
  used_count integer not null default 0,
  expires_at timestamptz,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create index if not exists tma_orders_user_id_idx on public.tma_orders(user_id);
create index if not exists tma_comments_article_status_idx on public.tma_article_comments(article_id, status);

alter table public.tma_profiles enable row level security;
alter table public.tma_orders enable row level security;
alter table public.tma_order_items enable row level security;
alter table public.tma_article_comments enable row level security;
alter table public.tma_promo_codes enable row level security;
alter table public.tma_membership_grants enable row level security;

create policy "tma_profiles_self" on public.tma_profiles for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "tma_orders_self_read" on public.tma_orders for select using (auth.uid() = user_id);
create policy "tma_order_items_self_read" on public.tma_order_items for select using (exists (select 1 from public.tma_orders o where o.id = order_id and o.user_id = auth.uid()));
create policy "tma_comments_approved_read" on public.tma_article_comments for select using (status = 'approved' or auth.uid() = user_id);
create policy "tma_comments_self_insert" on public.tma_article_comments for insert with check (auth.uid() = user_id);

-- Yönetici yazma işlemleri uygulamanın server tarafında admin kontrolüyle yapılır.
-- Üretimde admin işlemlerini service role/API route üzerinden çalıştırın; service role anahtarını istemciye göndermeyin.

create or replace function public.tma_next_order_number()
returns text
language plpgsql
security definer
set search_path = ''
as $$
declare next_number bigint;
begin
  select coalesce(max((regexp_match(order_number, '^TMA-([0-9]+)$'))[1]::bigint), 100000) + 1 into next_number from public.tma_orders;
  return 'TMA-' || next_number::text;
end;
$$;
