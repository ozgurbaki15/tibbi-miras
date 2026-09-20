'use client'

import Link from 'next/link'
import { useState } from 'react'
import { ArrowLeft, BookOpen, Check, ShoppingCart } from 'lucide-react'
import { ArchiveHeader } from '@/components/archive-header'
import { ArchiveNavigation } from '@/components/archive-navigation'
import { ArticleTabs } from '@/components/article-tabs'
import { OriginalTextSection } from '@/components/original-text-section'
import { useCart } from '@/components/cart-provider'
import { useLanguage } from '@/components/language-provider'
import { shopPriceLabel, type ShopProduct } from '@/lib/shop'
import { type Article, type ArticleTerm, articleTitle } from '@/lib/types'

function ArticleReadyToRead({ article, terms }: { article: Article; terms: ArticleTerm[] }) {
  const { lang } = useLanguage()
  const title = articleTitle(article, lang)
  const [linksEnabled, setLinksEnabled] = useState(true)

  return (
    <article className="mt-10 border-t border-border pt-10">
      <div className="mb-4 flex items-center gap-2.5">
        <BookOpen className="size-4 text-primary" aria-hidden="true" />
        <h2 className="text-balance font-serif text-2xl font-semibold text-foreground">{title}</h2>
      </div>
      <ArticleTabs article={article} terms={terms} linksEnabled={linksEnabled} onToggleLinks={() => setLinksEnabled((value) => !value)} />
      <OriginalTextSection article={article} terms={terms} linksEnabled={linksEnabled} />
      <Link href={`/article/${article.id}`} className="mt-4 inline-flex font-sans text-xs uppercase tracking-wider text-primary hover:underline">
        {lang === 'tr' ? 'Makaleyi tam sayfada aç' : 'Open article in full page'}
      </Link>
    </article>
  )
}

export function ProductDetailView({ product, articles, terms }: { product: ShopProduct; articles: Article[]; terms: ArticleTerm[] }) {
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
    <div className="min-h-svh bg-background">
      <ArchiveHeader />
      <ArchiveNavigation />
      <div className="mx-auto max-w-4xl px-6 py-10 md:py-16">
        <Link href="/magaza" className="mb-8 inline-flex items-center gap-2 font-sans text-sm font-medium uppercase tracking-wider text-muted-foreground hover:text-primary">
          <ArrowLeft className="size-4" />
          {lang === 'tr' ? 'Mağazaya dön' : 'Back to store'}
        </Link>

        <section className="flex flex-col gap-8 sm:flex-row">
          <div className="aspect-square w-full max-w-sm shrink-0 overflow-hidden rounded-md border border-border bg-muted">
            <img src={product.image || '/placeholder.svg'} alt={name} className="size-full object-cover" />
          </div>
          <div className="flex flex-1 flex-col">
            <h1 className="text-balance font-serif text-3xl font-semibold leading-tight text-foreground md:text-4xl">{name}</h1>
            <p className="mt-4 text-pretty font-sans text-sm leading-relaxed text-muted-foreground">{description}</p>
            <div className="mt-6 flex items-center justify-between gap-3">
              <span className="font-serif text-3xl font-semibold text-foreground">{shopPriceLabel(product.priceKurus, lang)}</span>
              <span className="font-sans text-xs uppercase tracking-wider text-primary">
                {product.inStock ? (lang === 'tr' ? 'Stokta' : 'In stock') : lang === 'tr' ? 'Tükendi' : 'Sold out'}
              </span>
            </div>
            <button
              type="button"
              onClick={handleAdd}
              disabled={!product.inStock}
              className="mt-5 inline-flex items-center justify-center gap-2 rounded-md bg-primary px-6 py-3.5 font-sans text-sm font-medium uppercase tracking-wider text-primary-foreground transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {added ? <Check className="size-4" /> : <ShoppingCart className="size-4" />}
              {added ? (lang === 'tr' ? 'Sepete eklendi' : 'Added to cart') : lang === 'tr' ? 'Sepete ekle' : 'Add to cart'}
            </button>
          </div>
        </section>

        {articles.length > 0 ? (
          <section aria-labelledby="linked-articles-heading" className="mt-4">
            <h2 id="linked-articles-heading" className="sr-only">{lang === 'tr' ? 'Bu ürünle ilgili makaleler' : 'Articles related to this product'}</h2>
            {articles.map((article) => (
              <ArticleReadyToRead key={article.id} article={article} terms={terms} />
            ))}
          </section>
        ) : null}
      </div>
    </div>
  )
}
