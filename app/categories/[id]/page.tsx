import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { ArchiveHeader } from '@/components/archive-header'
import { ArchiveNavigation } from '@/components/archive-navigation'
import { ArchiveCard } from '@/components/archive-card'
import { SiteFooter } from '@/components/site-footer'
import { isSupabaseConfigured, supabase } from '@/lib/supabase/client'
import { ARTICLE_COLUMNS, type Article, type Category } from '@/lib/types'
import { LanguageAwareCategoryTitle } from '@/components/language-aware-category-title'

export const dynamic = 'force-dynamic'
type Props = { params: Promise<{ id: string }> }

export default async function CategoryDetailPage({ params }: Props) {
  const { id } = await params
  const [categoryResult, articleResult] = isSupabaseConfigured
    ? await Promise.all([
        supabase.from('categories').select('id, name_tr, name_en, parent_id, sort_order, is_adult').eq('id', id).maybeSingle(),
        supabase.from('articles').select(ARTICLE_COLUMNS).eq('category_id', id).eq('is_published', true).eq('is_hidden', false).order('id', { ascending: true }),
      ])
    : [{ data: null, error: null }, { data: null, error: null }]
  const category = categoryResult.data as Category | null
  const articles = (articleResult.data ?? []) as unknown as Article[]
  const error = categoryResult.error || articleResult.error

  return <main className="min-h-svh bg-background"><ArchiveHeader /><ArchiveNavigation /><section className="mx-auto max-w-6xl px-6 py-14"><Link href="/categories" className="mb-8 inline-flex items-center gap-2 font-sans text-xs uppercase tracking-wider text-muted-foreground hover:text-primary"><ArrowLeft className="size-4" />Kategorilere dön</Link>{error ? <pre className="rounded border border-destructive/40 p-5 font-mono text-xs text-destructive">{error.message}</pre> : !category ? <p className="font-serif text-2xl text-muted-foreground">Kategori bulunamadı.</p> : <><p className="mb-2 font-sans text-xs uppercase tracking-[0.25em] text-primary">Collection</p><LanguageAwareCategoryTitle category={category} /><p className="mb-10 font-sans text-sm text-muted-foreground">{articles.length} eser</p>{articles.length ? <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{articles.map((article) => <ArchiveCard key={article.id} article={article} />)}</div> : <p className="rounded-md border border-dashed border-border py-16 text-center font-serif text-lg text-muted-foreground">Bu kategoride henüz yayımlanmış eser yok.</p>}</>}</section><SiteFooter /></main>
}
