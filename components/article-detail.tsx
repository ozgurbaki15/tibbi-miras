'use client'

import Link from 'next/link'
import { ArrowLeft, ScrollText } from 'lucide-react'
import { ArticleTabs } from '@/components/article-tabs'
import { FavoriteButton } from '@/components/favorite-button'
import { CopyButton } from '@/components/copy-button'
import { LinkedArticleText } from '@/components/linked-article-text'
import { UI, useLanguage } from '@/components/language-provider'
import { LanguageSwitcher } from '@/components/language-switcher'
import { ArchiveHeader } from '@/components/archive-header'
import { ArchiveNavigation } from '@/components/archive-navigation'
import { type Article, type ArticleTerm, articleImages, articleTitle, categoryName } from '@/lib/types'

export function ArticleDetail({ article, terms = [] }: { article: Article; terms?: ArticleTerm[] }) {
  const { lang } = useLanguage()
  const t = UI[lang]
  const title = articleTitle(article, lang)
  const category = categoryName(article, lang)
  const images = articleImages(article.image_url)

  return (
    <div className="min-h-svh bg-background">
      <ArchiveHeader />
      <ArchiveNavigation />
      <div className="mx-auto max-w-4xl px-6 py-10 md:py-16">
      <div className="mb-10 flex items-center justify-between gap-4"><Link href="/" className="inline-flex items-center gap-2 font-sans text-sm font-medium uppercase tracking-wider text-muted-foreground hover:text-primary"><ArrowLeft className="size-4" />{t.back}</Link><LanguageSwitcher /></div>
      <article>
        <header className="mb-8"><p className="mb-4 font-sans text-xs uppercase tracking-[0.35em] text-primary">{category ?? 'Tıbbi Miras Arşivi'}</p><h1 className="text-balance font-serif text-4xl font-semibold leading-tight text-foreground md:text-5xl">{title}</h1><div className="mt-6 flex items-center gap-4"><div className="flex flex-1 items-center gap-4" aria-hidden="true"><span className="h-px w-12 bg-border" /><span className="size-1.5 rotate-45 bg-primary" /><span className="h-px flex-1 bg-border" /></div><FavoriteButton articleId={article.id} /></div></header>
        {images.length ? <section aria-label="Article images" className="mb-10 flex flex-col gap-5">{images.map((image, index) => <figure key={`${image}-${index}`} className="overflow-hidden rounded-md border border-border bg-card"><img src={image} alt={`${title} — ${index + 1}`} crossOrigin="anonymous" className="block max-h-[760px] w-full object-contain" /><figcaption className="border-t border-border px-4 py-2 text-center font-sans text-xs text-muted-foreground">{index + 1} / {images.length}</figcaption></figure>)}</section> : null}
        <ArticleTabs article={article} />
        {article.original_text ? <section aria-labelledby="original-heading" className="mt-12 rounded-md border border-border bg-card/50 p-6 md:p-8"><div className="mb-5 flex items-center gap-3"><ScrollText className="size-5 text-primary" /><h2 id="original-heading" className="font-serif text-2xl font-semibold text-foreground">{t.originalHeading}</h2></div><div className="mb-6 flex flex-wrap items-center justify-between gap-3"><p className="font-sans text-xs uppercase tracking-widest text-muted-foreground">{t.originalNote}</p><CopyButton text={article.original_text} /></div><LinkedArticleText text={article.original_text} terms={terms} activeArticleId={article.id} className="max-w-none text-pretty font-serif text-lg italic leading-loose text-foreground/85" /></section> : null}
      </article>
      </div>
    </div>
  )
}
