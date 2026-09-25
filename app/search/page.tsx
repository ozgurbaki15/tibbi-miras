'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Search } from 'lucide-react'
import { ArchiveHeader } from '@/components/archive-header'
import { ArchiveNavigation } from '@/components/archive-navigation'
import { SiteFooter } from '@/components/site-footer'
import { useLanguage } from '@/components/language-provider'
import { isSupabaseConfigured, supabase } from '@/lib/supabase/client'
import { ARTICLE_COLUMNS, ARTICLE_LIST_COLUMNS, articleTitle, type Article } from '@/lib/types'

export default function SearchPage() {
  const [query, setQuery] = useState('')
  const [includeContent, setIncludeContent] = useState(false)
  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)
  const { lang } = useLanguage()

  useEffect(() => {
    const term = query.trim()
    if (!term) {
      setArticles([])
      setLoading(false)
      return
    }

    if (!isSupabaseConfigured) {
      setArticles([])
      setLoading(false)
      return
    }

    setLoading(true)
    const timer = window.setTimeout(async () => {
      const escaped = term.replace(/[%(),]/g, ' ')
      const fields = includeContent
        ? `title_tr.ilike.%${escaped}%,title_en.ilike.%${escaped}%,free_content_tr.ilike.%${escaped}%,free_content_en.ilike.%${escaped}%,original_text.ilike.%${escaped}%`
        : `title_tr.ilike.%${escaped}%,title_en.ilike.%${escaped}%`

      const { data, error } = await supabase
        .from('articles')
        .select(includeContent ? ARTICLE_COLUMNS : ARTICLE_LIST_COLUMNS)
        .eq('is_published', true)
        .eq('is_hidden', false)
        .or(fields)
        .order('id', { ascending: true })
        .limit(100)

      if (error) {
        console.log('[v0] Search query error:', error.message)
        setArticles([])
      } else {
        setArticles((data ?? []) as unknown as Article[])
      }
      setLoading(false)
    }, 350)

    return () => window.clearTimeout(timer)
  }, [query, includeContent])

  const results = articles

  return (
    <main className="min-h-svh bg-background">
      <ArchiveHeader />
      <ArchiveNavigation />
      <section className="mx-auto max-w-6xl px-6 py-14">
        <p className="mb-2 font-sans text-xs uppercase tracking-[0.25em] text-primary">{lang === 'tr' ? 'Ansiklopedi araması' : 'Encyclopedia search'}</p>
        <h1 className="mb-8 font-serif text-5xl text-foreground">{lang === 'tr' ? 'Arşivde ara' : 'Search the archive'}</h1>
        <div className="relative mb-4 max-w-2xl">
          <Search className="absolute left-4 top-1/2 size-5 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
          <input
            autoFocus
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={lang === 'tr' ? 'Tüm makalelerde ara…' : 'Search all articles…'}
            aria-label={lang === 'tr' ? 'Makale ara' : 'Search articles'}
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
            {lang === 'tr' ? 'Sadece başlıklarda ara' : 'Search titles only'}
          </label>
          <label className="inline-flex items-center gap-2">
            <input
              type="checkbox"
              checked={includeContent}
              onChange={(event) => setIncludeContent(event.target.checked)}
              className="size-4 accent-primary"
            />
            {lang === 'tr' ? 'Gönderileri de dahil et' : 'Include article content'}
          </label>
        </div>
        {loading ? (
          <p className="font-serif text-xl text-muted-foreground">{lang === 'tr' ? 'Arşiv yükleniyor…' : 'Loading archive…'}</p>
        ) : !query.trim() ? (
          <p className="rounded-md border border-dashed border-border py-16 text-center font-serif text-xl text-muted-foreground">{lang === 'tr' ? 'Aramak için bir kelime yazın.' : 'Type a word to search the archive.'}</p>
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
