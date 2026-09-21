import { ArchiveHeader } from '@/components/archive-header'
import { ArchiveNavigation } from '@/components/archive-navigation'
import { ArticleGrid } from '@/components/article-grid'
import { CategorySection } from '@/components/category-section'
import { SiteFooter } from '@/components/site-footer'
import { isSupabaseConfigured } from '@/lib/supabase/client'
import { getPublicArchiveData } from '@/lib/public-data'

export const revalidate = 300

export default async function Page() {
  const { articles, categories, error } = await getPublicArchiveData()
  if (error) console.log('[v0] Archive data fetch error:', error)
  

  return (
    <main className="min-h-svh bg-background">
      <ArchiveHeader />
      <ArchiveNavigation />
      {!isSupabaseConfigured ? (
        <section className="mx-auto max-w-6xl px-6 py-20"><p className="rounded-md border border-primary/40 bg-primary/10 px-6 py-8 text-center font-sans text-sm text-foreground">Supabase bağlantısı henüz yapılandırılmadı.</p></section>
      ) : error ? (
        <section className="mx-auto max-w-6xl px-6 py-20"><div className="rounded-md border border-destructive/40 bg-destructive/10 p-6 font-mono text-xs text-foreground"><strong className="font-serif text-lg text-destructive">Supabase Fetch Error</strong><pre className="mt-4 whitespace-pre-wrap">{error}</pre></div></section>
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
