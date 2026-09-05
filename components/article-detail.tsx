'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, ArrowRight, ScrollText } from 'lucide-react'
import { ArticleTabs } from '@/components/article-tabs'
import { FavoriteButton } from '@/components/favorite-button'
import { UI, useLanguage } from '@/components/language-provider'
import { LanguageSwitcher } from '@/components/language-switcher'
import { type Article, articleImages, articleTitle, categoryName } from '@/lib/types'

export function ArticleDetail({ article }: { article: Article }) {
  const { lang } = useLanguage()
  const t = UI[lang]
  const title = articleTitle(article, lang)
  const category = categoryName(article, lang)
  const images = articleImages(article.image_url)
  const [imageIndex, setImageIndex] = useState(0)
  const image = images[imageIndex]

  return (
    <div className="mx-auto max-w-4xl px-6 py-10 md:py-16">
      <div className="mb-10 flex items-center justify-between gap-4"><Link href="/" className="inline-flex items-center gap-2 font-sans text-sm font-medium uppercase tracking-wider text-muted-foreground hover:text-primary"><ArrowLeft className="size-4" />{t.back}</Link><LanguageSwitcher /></div>
      <article>
        <header className="mb-8"><p className="mb-4 font-sans text-xs uppercase tracking-[0.35em] text-primary">{category ?? 'Tıbbi Miras Arşivi'}</p><h1 className="text-balance font-serif text-4xl font-semibold leading-tight text-foreground md:text-5xl">{title}</h1><div className="mt-6 flex flex-wrap items-center gap-4"><div className="flex flex-1 items-center gap-4" aria-hidden="true"><span className="h-px w-12 bg-border" /><span className="size-1.5 rotate-45 bg-primary" /><span className="h-px flex-1 bg-border" /></div><FavoriteButton articleId={article.id} /></div></header>
        {image ? <figure className="mb-10 overflow-hidden rounded-md border border-border"><div className="relative"><img src={image} alt={`${title} — ${imageIndex + 1}`} className="max-h-[620px] w-full object-contain" />{images.length > 1 ? <div className="absolute inset-x-4 bottom-4 flex items-center justify-between"><button type="button" onClick={() => setImageIndex((index) => (index - 1 + images.length) % images.length)} aria-label="Önceki görsel" className="rounded-full bg-background/90 p-2 text-foreground"><ArrowLeft className="size-4" /></button><span className="rounded-full bg-background/90 px-3 py-1 font-mono text-xs">{imageIndex + 1} / {images.length}</span><button type="button" onClick={() => setImageIndex((index) => (index + 1) % images.length)} aria-label="Sonraki görsel" className="rounded-full bg-background/90 p-2 text-foreground"><ArrowRight className="size-4" /></button></div> : null}</div></figure> : null}
        <ArticleTabs article={article} />
        {article.original_text ? <section aria-labelledby="original-heading" className="mt-12 rounded-md border border-border bg-card/50 p-6 md:p-8"><div className="mb-5 flex items-center gap-3"><ScrollText className="size-5 text-primary" /><h2 id="original-heading" className="font-serif text-2xl font-semibold text-foreground">{t.originalHeading}</h2></div><p className="mb-6 font-sans text-xs uppercase tracking-widest text-muted-foreground">{t.originalNote}</p><div dir="auto" className="max-w-none whitespace-pre-wrap text-pretty font-serif text-lg italic leading-loose text-foreground/85">{article.original_text}</div></section> : null}
      </article>
    </div>
  )
}
