'use client'

import { useEffect, useState } from 'react'
import { ShoppingCart, Tag } from 'lucide-react'
import { supabase } from '@/lib/supabase/client'
import { useProducts } from '@/components/products-provider'
import { useCart } from '@/components/cart-provider'
import { useLanguage } from '@/components/language-provider'
import { shopPriceLabel } from '@/lib/shop'

type LinkRow = { product_id: string; article_first: boolean; product_first: boolean }

export function ArticleProductLinks({ articleId }: { articleId: string }) {
  const { products } = useProducts()
  const { add } = useCart()
  const { lang } = useLanguage()
  const [links, setLinks] = useState<LinkRow[]>([])
  const [loadError, setLoadError] = useState('')

  useEffect(() => {
    let active = true
    supabase.from('tma_article_product_links').select('product_id, article_first, product_first').eq('article_id', articleId).then(({ data, error }) => {
      if (!active) return
      if (error) {
        setLoadError(error.message)
        return
      }
      setLinks((data as LinkRow[] | null) ?? [])
    })
    return () => { active = false }
  }, [articleId])

  const linkedProducts = links.map((link) => ({ ...link, product: products.find((product) => product.id === link.product_id) })).filter((item) => item.product)
  if (!linkedProducts.length) return null

  return (
    <section className="mt-12 rounded-2xl border border-primary/35 bg-card/80 p-5 shadow-xl backdrop-blur-sm md:p-7" aria-labelledby="related-products-heading">
      <div className="mb-5 flex items-center gap-3"><Tag className="size-5 text-primary" aria-hidden="true" /><h2 id="related-products-heading" className="font-serif text-2xl text-card-foreground">{lang === 'tr' ? 'Bu makaleyle ilgili ürünler' : 'Products related to this article'}</h2></div>
      <div className="grid gap-4 sm:grid-cols-2">{linkedProducts.map(({ product }) => product ? <article key={product.id} className="overflow-hidden rounded-xl border border-border bg-background/70"><div className="flex gap-4 p-4">{product.image ? <img src={product.image} alt={product.name} className="size-20 rounded-lg object-cover" /> : null}<div className="min-w-0 flex-1"><h3 className="font-serif text-lg text-foreground">{lang === 'tr' ? product.name : product.nameEn || product.name}</h3><p className="mt-1 font-sans text-sm text-muted-foreground">{shopPriceLabel(product.priceKurus, lang)}</p><button type="button" onClick={() => add(product.id)} disabled={!product.inStock} className="mt-3 inline-flex items-center gap-2 rounded-lg bg-primary px-3 py-2 font-sans text-xs font-semibold uppercase tracking-wider text-primary-foreground disabled:opacity-50"><ShoppingCart className="size-3.5" /> {product.inStock ? (lang === 'tr' ? 'Sepete ekle' : 'Add to cart') : (lang === 'tr' ? 'Tükendi' : 'Out of stock')}</button></div></div></article> : null)}</div>
    </section>
  )
}
