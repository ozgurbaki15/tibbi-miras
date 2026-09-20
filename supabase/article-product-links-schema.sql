-- Tıbbi Miras: makale <-> ürün bağlantı tablosu.
-- Bir makale en fazla bir ürüne bağlanabilir (article_id unique); bir ürüne
-- birden çok makale bağlanabilir. Yalnızca Freeman hesabı (tma_is_admin())
-- bağlantı ekleyip kaldırabilir, herkes okuyabilir.
-- Bu dosya, supabase/shop-community-schema.sql çalıştırıldıktan SONRA çalıştırılmalıdır
-- (tma_is_admin() fonksiyonunu ve shop_products tablosunu kullanır).

create table if not exists public.tma_article_products (
  id uuid primary key default gen_random_uuid(),
  article_id text not null unique,
  product_id uuid not null references public.shop_products(id) on delete cascade,
  created_at timestamptz not null default now()
);

create index if not exists tma_article_products_product_id_idx on public.tma_article_products(product_id);

alter table public.tma_article_products enable row level security;

drop policy if exists "tma_article_products_read" on public.tma_article_products;
drop policy if exists "tma_article_products_admin" on public.tma_article_products;

create policy "tma_article_products_read" on public.tma_article_products
for select using (true);

create policy "tma_article_products_admin" on public.tma_article_products
for all using (public.tma_is_admin()) with check (public.tma_is_admin());
