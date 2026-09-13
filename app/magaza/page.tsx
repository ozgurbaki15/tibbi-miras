'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { Check, ShoppingBag, ShoppingCart } from 'lucide-react'
import { ArchiveHeader } from '@/components/archive-header'
import { ArchiveNavigation } from '@/components/archive-navigation'
import { SiteFooter } from '@/components/site-footer'
import { useCart } from '@/components/cart-provider'
import { useLanguage } from '@/components/language-provider'
import { useProducts } from '@/components/products-provider'
import { shopPriceLabel, type ShopProduct } from '@/lib/shop'

function ProductCard({ product }: { product: ShopProduct }) {
  const { lang } = useLanguage()
  const { add } = useCart()
  const [added, setAdded] = useState(false)

  const name = lang === 'tr' ? product.name : product.nameEn || product.name
  const description = lang === 'tr' ? product.description : product.descriptionEn || product.description

  function handleAdd() {
    add(product.id, 1)
    setAdded(true)
    window.setTimeout(() => setAdded(false), 1600)
  }

  return (
    <article className="flex flex-col overflow-hidden rounded-md border border-border bg-card">
      <div className="aspect-square overflow-hidden border-b border-border bg-muted">
        <img src={product.image || '/placeholder.svg'} alt={name} className="size-full object-cover" />
      </div>
      <div className="flex flex-1 flex-col gap-3 p-5">
        <h2 className="text-pretty font-serif text-xl font-semibold leading-tight text-card-foreground">{name}</h2>
        <p className="text-pretty font-sans text-sm leading-relaxed text-muted-foreground">{description}</p>
        <div className="mt-auto flex items-center justify-between gap-3 pt-3">
          <span className="font-serif text-2xl font-semibold text-foreground">{shopPriceLabel(product.priceKurus, lang)}</span>
          <span className="font-sans text-xs uppercase tracking-wider text-primary">
            {product.inStock ? (lang === 'tr' ? 'Stokta' : 'In stock') : lang === 'tr' ? 'Tükendi' : 'Sold out'}
          </span>
        </div>
        <button
          type="button"
          onClick={handleAdd}
          disabled={!product.inStock}
          className="mt-1 inline-flex items-center justify-center gap-2 rounded-md bg-primary px-5 py-3 font-sans text-sm font-medium uppercase tracking-wider text-primary-foreground transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {added ? <Check className="size-4" /> : <ShoppingCart className="size-4" />}
          {added ? (lang === 'tr' ? 'Sepete eklendi' : 'Added to cart') : lang === 'tr' ? 'Sepete ekle' : 'Add to cart'}
        </button>
      </div>
    </article>
  )
}

export default function MagazaPage() {
  const { lang } = useLanguage()
  const { count } = useCart()
  const { products, categories, loading } = useProducts()
  const [activeCategory, setActiveCategory] = useState<string>('all')

  const t = lang === 'tr'
    ? {
        eyebrow: 'Şifalı ürünler',
        title: 'Mağaza',
        intro:
          'Doğal uçucu yağlar, şifalı karışımlar ve bitkisel ürünler. Katkısız, özenle hazırlanmış ürünler kapınıza kadar gelsin.',
        cart: 'Sepeti görüntüle',
        all: 'Tümü',
        uncategorized: 'Diğer',
        empty: 'Şu an mağazada ürün bulunmuyor.',
        loading: 'Ürünler yükleniyor…',
      }
    : {
        eyebrow: 'Healing goods',
        title: 'Store',
        intro:
          'Natural essential oils, healing blends and botanical products. Additive-free, carefully prepared goods delivered to your door.',
        cart: 'View cart',
        all: 'All',
        uncategorized: 'Other',
        empty: 'There are no products in the store right now.',
        loading: 'Loading products…',
      }

  // Only show category chips that actually contain products.
  const usedCategories = useMemo(() => {
    const withProducts = new Set(products.map((product) => product.categoryId ?? 'uncategorized'))
    const ordered = categories.filter((category) => withProducts.has(category.id))
    const hasUncategorized = products.some((product) => !product.categoryId)
    return { ordered, hasUncategorized }
  }, [products, categories])

  const visibleProducts = useMemo(() => {
    if (activeCategory === 'all') return products
    if (activeCategory === 'uncategorized') return products.filter((product) => !product.categoryId)
    return products.filter((product) => product.categoryId === activeCategory)
  }, [products, activeCategory])

  const showChips = usedCategories.ordered.length > 0

  return (
    <main className="min-h-svh bg-background">
      <ArchiveHeader />
      <ArchiveNavigation />
      <section className="mx-auto max-w-6xl px-6 py-14">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="mb-2 font-sans text-xs uppercase tracking-[0.25em] text-primary">{t.eyebrow}</p>
            <div className="flex items-center gap-3">
              <ShoppingBag className="size-8 text-primary" aria-hidden="true" />
              <h1 className="font-serif text-4xl text-foreground md:text-5xl">{t.title}</h1>
            </div>
            <p className="mt-4 max-w-xl font-sans text-sm leading-relaxed text-muted-foreground">{t.intro}</p>
          </div>
          <Link
            href="/sepet"
            className="inline-flex items-center gap-2 rounded-md border border-border px-4 py-2.5 font-sans text-sm font-medium text-foreground transition-colors hover:border-primary hover:text-primary"
          >
            <ShoppingCart className="size-4" />
            {t.cart}
            {count > 0 ? (
              <span className="inline-flex size-5 items-center justify-center rounded-full bg-primary font-mono text-[11px] text-primary-foreground">{count}</span>
            ) : null}
          </Link>
        </div>

        {showChips ? (
          <div className="mb-8 flex flex-wrap gap-2">
            <CategoryChip label={t.all} active={activeCategory === 'all'} onClick={() => setActiveCategory('all')} />
            {usedCategories.ordered.map((category) => (
              <CategoryChip
                key={category.id}
                label={lang === 'tr' ? category.name : category.nameEn || category.name}
                active={activeCategory === category.id}
                onClick={() => setActiveCategory(category.id)}
              />
            ))}
            {usedCategories.hasUncategorized ? (
              <CategoryChip label={t.uncategorized} active={activeCategory === 'uncategorized'} onClick={() => setActiveCategory('uncategorized')} />
            ) : null}
          </div>
        ) : null}

        {loading ? (
          <p className="py-16 text-center font-sans text-sm text-muted-foreground">{t.loading}</p>
        ) : visibleProducts.length === 0 ? (
          <p className="py-16 text-center font-sans text-sm text-muted-foreground">{t.empty}</p>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {visibleProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>
      <SiteFooter />
    </main>
  )
}

function CategoryChip({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full border px-4 py-2 font-sans text-xs uppercase tracking-wider transition-colors ${
        active
          ? 'border-primary bg-primary text-primary-foreground'
          : 'border-border text-muted-foreground hover:border-primary hover:text-primary'
      }`}
    >
      {label}
    </button>
  )
}
