'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Check, ShoppingBag, ShoppingCart } from 'lucide-react'
import { useCart } from '@/components/cart-provider'
import { useLanguage } from '@/components/language-provider'
import { shopPriceLabel, type ShopProduct } from '@/lib/shop'

// Compact purchase card shown beneath an article's content when that
// article is linked to a shop product.
export function ProductCta({ product }: { product: ShopProduct }) {
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
    <section aria-labelledby="product-cta-heading" className="mt-12 overflow-hidden rounded-md border border-primary/30 bg-card">
      <div className="flex items-center gap-2 border-b border-primary/20 bg-primary/10 px-6 py-3">
        <ShoppingBag className="size-4 text-primary" aria-hidden="true" />
        <p id="product-cta-heading" className="font-sans text-xs font-medium uppercase tracking-wider text-primary">
          {lang === 'tr' ? 'Bu eserle ilgili ürün' : 'Product related to this work'}
        </p>
      </div>
      <div className="flex flex-col gap-5 p-6 sm:flex-row sm:items-center">
        <Link href={`/magaza/${product.id}`} className="block size-24 shrink-0 overflow-hidden rounded-md border border-border bg-muted">
          <img src={product.image || '/placeholder.svg'} alt={name} className="size-full object-cover" />
        </Link>
        <div className="min-w-0 flex-1">
          <Link href={`/magaza/${product.id}`} className="font-serif text-lg font-semibold text-card-foreground hover:text-primary">{name}</Link>
          <p className="mt-1 line-clamp-2 font-sans text-sm text-muted-foreground">{description}</p>
          <p className="mt-2 font-serif text-xl font-semibold text-foreground">{shopPriceLabel(product.priceKurus, lang)}</p>
        </div>
        <button
          type="button"
          onClick={handleAdd}
          disabled={!product.inStock}
          className="inline-flex shrink-0 items-center justify-center gap-2 rounded-md bg-primary px-5 py-3 font-sans text-sm font-medium uppercase tracking-wider text-primary-foreground transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {added ? <Check className="size-4" /> : <ShoppingCart className="size-4" />}
          {added ? (lang === 'tr' ? 'Eklendi' : 'Added') : lang === 'tr' ? 'Sepete ekle' : 'Add to cart'}
        </button>
      </div>
    </section>
  )
}
