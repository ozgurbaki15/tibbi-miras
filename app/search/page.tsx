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
  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)
  useEffect(() => { if (!isSupabaseConfigured) { setLoading(false); return } supabase.from('articles').select(ARTICLE_COLUMNS).eq('is_published', true).eq('is_hidden', false).order('id', { ascending: true }).then(({ data }) => { setArticles((data ?? []) as unknown as Article[]); setLoading(false) }) }, [])
  const results = useMemo(() => { const term = query.trim().toLocaleLowerCase('tr-TR'); return term ? articles.filter((article) => `${article.title_tr ?? ''} ${article.title_en ?? ''}`.toLocaleLowerCase('tr-TR').includes(term)) : articles }, [articles, query])
  return <main className="min-h-svh bg-background"><ArchiveHeader /><ArchiveNavigation /><section className="mx-auto max-w-6xl px-6 py-14"><p className="mb-2 font-sans text-xs uppercase tracking-[0.25em] text-primary">Encyclopedia search</p><h1 className="mb-8 font-serif text-5xl text-foreground">Arşivde ara</h1><div className="relative mb-10 max-w-2xl"><Search className="absolute left-4 top-1/2 size-5 -translate-y-1/2 text-muted-foreground" /><input autoFocus value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Makale başlığı ara…" className="w-full rounded-md border border-border bg-card py-4 pl-12 pr-4 font-sans text-sm text-foreground outline-none focus:border-primary" /></div>{loading ? <p className="font-serif text-xl text-muted-foreground">Arşiv yükleniyor…</p> : <><p className="mb-5 font-sans text-xs uppercase tracking-wider text-muted-foreground">{results.length} sonuç</p><div className="divide-y divide-border rounded-md border border-border bg-card">{results.map((article) => <Link key={article.id} href={`/article/${article.id}`} className="block p-5 transition-colors hover:bg-background"><h2 className="font-serif text-2xl text-card-foreground">{articleTitle(article, 'tr')}</h2><p className="mt-1 font-sans text-xs text-muted-foreground">{article.title_en}</p></Link>)}</div></>}</section><SiteFooter /></main>
}
