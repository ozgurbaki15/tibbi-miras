'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { Search } from 'lucide-react'
import { ArchiveHeader } from '@/components/archive-header'
import { ArchiveNavigation } from '@/components/archive-navigation'
import { SiteFooter } from '@/components/site-footer'
import { isSupabaseConfigured, supabase } from '@/lib/supabase/client'
import { ARTICLE_COLUMNS, articleTitle, type Article } from '@/lib/types'

export default function SearchPage() {
  const [query, setQuery] = useState('')
  const [includeContent, setIncludeContent] = useState(false)
  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setLoading(false)
      return
    }

    supabase
      .from('articles')
      .select(ARTICLE_COLUMNS)
      .eq('is_published', true)
      .eq('is_hidden', false)
      .order('id', { ascending: true })
      .then(({ data }) => {
        setArticles((data ?? []) as unknown as Article[])
        setLoading(false)
      })
  }, [])

  const results = useMemo(() => {
    const term = query.trim().toLocaleLowerCase('tr-TR')
    if (!term) return articles

    return articles.filter((article) => {
      const title = `${article.title_tr ?? ''} ${article.title_en ?? ''}`.toLocaleLowerCase('tr-TR')
      if (title.includes(term)) return true
      if (!includeContent) return false

      const content = [
        article.free_content_tr,
        article.free_content_en,
        article.original_text,
      ]
        .filter(Boolean)
        .join(' ')
        .toLocaleLowerCase('tr-TR')

      return content.includes(term)
    })
  }, [articles, query, includeContent])

  return (
    <main className="min-h-svh bg-background">
      <ArchiveHeader />
      <ArchiveNavigation />
      <section className="mx-auto max-w-6xl px-6 py-14">
        <p className="mb-2 font-sans text-xs uppercase tracking-[0.25em] text-primary">Encyclopedia search</p>
        <h1 className="mb-8 font-serif text-5xl text-foreground">Arşivde ara</h1>
        <div className="relative mb-4 max-w-2xl">
          <Search className="absolute left-4 top-1/2 size-5 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
          <input
            autoFocus
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Makale başlığı ara…"
            aria-label="Makale ara"
            className="w-full rounded-md border border-border bg-card py-4 pl-12 pr-4 font-sans text-sm text-foreground outline-none focus:border-primary"
          />
        </div>
        <div className="mb-10 flex flex-col gap-3 font-sans text-sm text-muted-foreground sm:flex-row sm:gap-6">
          <label className="inline-flex items-center gap-2">
            <input
              type="checkbox"
              checked={!includeContent}
              onChange={() => setIncludeContent(false)}
              className="size-4 accent-primary"
            />
            Sadece başlıklarda ara
          </label>
          <label className="inline-flex items-center gap-2">
            <input
              type="checkbox"
              checked={includeContent}
              onChange={(event) => setIncludeContent(event.target.checked)}
              className="size-4 accent-primary"
            />
            Gönderileri de dahil et
          </label>
        </div>
        {loading ? (
          <p className="font-serif text-xl text-muted-foreground">Arşiv yükleniyor…</p>
        ) : (
          <>
            <p className="mb-5 font-sans text-xs uppercase tracking-wider text-muted-foreground">{results.length} sonuç</p>
            <div className="divide-y divide-border rounded-md border border-border bg-card">
              {results.map((article) => (
                <Link key={article.id} href={`/article/${article.id}`} className="block p-5 transition-colors hover:bg-background">
                  <h2 className="font-serif text-2xl text-card-foreground">{articleTitle(article, 'tr')}</h2>
                  <p className="mt-1 font-sans text-xs text-muted-foreground">{article.title_en}</p>
                </Link>
              ))}
            </div>
          </>
        )}
      </section>
      <SiteFooter />
    </main>
  )
}
