'use client'

import { useMemo, useState } from 'react'
import { Search } from 'lucide-react'
import { ArchiveCard } from '@/components/archive-card'
import { UI, useLanguage } from '@/components/language-provider'
import { type Article, articleTitle } from '@/lib/types'

export function ArticleGrid({ articles }: { articles: Article[] }) {
  const { lang } = useLanguage()
  const t = UI[lang]
  const [query, setQuery] = useState('')
  const [includeContent, setIncludeContent] = useState(false)

  const filtered = useMemo(() => {
    const q = query.trim().toLocaleLowerCase(lang)
    if (!q) return articles
    return articles.filter((a) => {
      const title = articleTitle(a, lang).toLocaleLowerCase(lang)
      const content = includeContent
        ? `${a.free_content_tr ?? ''} ${a.free_content_en ?? ''} ${a.original_text ?? ''}`.toLocaleLowerCase(lang)
        : ''
      return title.includes(q) || content.includes(q)
    })
  }, [articles, query, lang, includeContent])

  return (
    <section
      aria-labelledby="collection-heading"
      className="mx-auto max-w-6xl px-6 py-14 md:py-20"
    >
      <div className="mb-10 flex flex-col gap-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2
              id="collection-heading"
              className="font-serif text-3xl font-semibold text-foreground"
            >
              {t.collection}
            </h2>
            <p className="mt-2 font-sans text-sm text-muted-foreground">
              {filtered.length} {t.countSuffix}
            </p>
          </div>
          <p className="font-sans text-xs uppercase tracking-widest text-muted-foreground">
            {t.selection}
          </p>
        </div>

        <div className="relative max-w-md">
          <Search
            className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden="true"
          />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t.searchPlaceholder}
            aria-label={t.searchLabel}
            className="w-full rounded-md border border-border bg-card py-3 pl-11 pr-4 font-sans text-sm text-foreground placeholder:text-muted-foreground focus:border-primary/60 focus:outline-none focus:ring-2 focus:ring-ring/40"
          />
          <label className="mt-3 flex items-center gap-2 font-sans text-xs text-muted-foreground">
            <input type="checkbox" checked={includeContent} onChange={(event) => setIncludeContent(event.target.checked)} className="size-4 accent-primary" />
            Gönderi içeriklerini de dahil et
          </label>
        </div>
      </div>

      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((article) => (
            <ArchiveCard key={article.id} article={article} />
          ))}
        </div>
      ) : (
        <p className="rounded-md border border-dashed border-border py-16 text-center font-serif text-lg text-muted-foreground">
          {'“'}
          {query}
          {'” '}
          {t.noResults}
        </p>
      )}
    </section>
  )
}
