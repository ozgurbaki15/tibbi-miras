import { ArchiveHeader } from '@/components/archive-header'
import { ArchiveNavigation } from '@/components/archive-navigation'
import { ArticleGrid } from '@/components/article-grid'
import { CategorySection } from '@/components/category-section'
import { SiteFooter } from '@/components/site-footer'
import { isSupabaseConfigured, supabase } from '@/lib/supabase/client'
import { ARTICLE_COLUMNS, type Article, type Category } from '@/lib/types'

export const dynamic = 'force-dynamic'

export default async function Page() {
  const [articleResult, categoryResult] = isSupabaseConfigured
    ? await Promise.all([
        supabase.from('articles').select(ARTICLE_COLUMNS).eq('is_published', true).eq('is_hidden', false).order('id', { ascending: true }),
        supabase.from('categories').select('id, name_tr, name_en, parent_id, sort_order, is_adult').order('sort_order', { ascending: true }),
      ])
    : [{ data: null, error: null }, { data: null, error: null }]

  const error = articleResult.error || categoryResult.error
  if (error) {
    console.log('[v0] Archive data fetch error:', error)
    console.log('[v0] Archive data error message:', error.message)
  }

  const articles = (articleResult.data ?? []) as unknown as Article[]
  const categories = (categoryResult.data ?? []) as Category[]

  return (
    <main className="min-h-svh bg-background">
      <ArchiveHeader />
      <ArchiveNavigation />
      {!isSupabaseConfigured ? (
        <section className="mx-auto max-w-6xl px-6 py-20"><p className="rounded-md border border-primary/40 bg-primary/10 px-6 py-8 text-center font-sans text-sm text-foreground">Supabase bağlantısı henüz yapılandırılmadı.</p></section>
      ) : error ? (
        <section className="mx-auto max-w-6xl px-6 py-20"><div className="rounded-md border border-destructive/40 bg-destructive/10 p-6 font-mono text-xs text-foreground"><strong className="font-serif text-lg text-destructive">Supabase Fetch Error</strong><pre className="mt-4 whitespace-pre-wrap">{error.message}{error.details ? `\n\ndetails: ${error.details}` : ''}{error.hint ? `\n\nhint: ${error.hint}` : ''}{error.code ? `\n\ncode: ${error.code}` : ''}</pre></div></section>
      ) : (
        <>
          <CategorySection categories={categories} />
          <ArticleGrid articles={articles} />
        </>
      )}
      <SiteFooter />
    </main>
  )
}
