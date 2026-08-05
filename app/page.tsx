import { ArchiveHeader } from '@/components/archive-header'
import { ArticleGrid } from '@/components/article-grid'
import { SiteFooter } from '@/components/site-footer'
import { isSupabaseConfigured, supabase } from '@/lib/supabase/client'
import { ARTICLE_COLUMNS, type Article } from '@/lib/types'

export const dynamic = 'force-dynamic'

export default async function Page() {
  const { data, error } = isSupabaseConfigured
    ? await supabase
        .from('articles')
        .select(ARTICLE_COLUMNS)
        .eq('is_published', true)
        .eq('is_hidden', false)
        .not('image_url', 'is', null)
        .neq('image_url', '')
        .order('id', { ascending: true })
    : { data: null, error: null }

  if (error) {
    console.log('[v0] Supabase fetch error:', error)
    console.log('[v0] Supabase error message:', error.message)
    console.log('[v0] Supabase error details:', JSON.stringify(error, null, 2))
  }

  console.log('[v0] Supabase configured:', isSupabaseConfigured)
  console.log('[v0] Articles returned:', data?.length ?? 0)

  const articles = (data ?? []) as unknown as Article[]

  return (
    <main className="min-h-svh bg-background">
      <ArchiveHeader />

      {!isSupabaseConfigured ? (
        <section className="mx-auto max-w-6xl px-6 py-20">
          <p className="rounded-md border border-primary/40 bg-primary/10 px-6 py-8 text-center font-sans text-sm leading-relaxed text-foreground">
            Supabase bağlantısı henüz yapılandırılmadı. Ortam değişkenleri
            (NEXT_PUBLIC_SUPABASE_URL ve NEXT_PUBLIC_SUPABASE_ANON_KEY)
            eklendikten sonra arşiv otomatik olarak yüklenecektir.
          </p>
        </section>
      ) : error ? (
        <section className="mx-auto max-w-6xl px-6 py-20">
          <div className="rounded-md border border-destructive/40 bg-destructive/10 px-6 py-8 font-sans text-sm text-foreground">
            <p className="mb-4 text-center font-serif text-lg text-destructive">
              Supabase Fetch Error
            </p>
            <pre className="overflow-x-auto whitespace-pre-wrap break-words rounded bg-background/60 p-4 font-mono text-xs leading-relaxed text-foreground">
              {error.message}
              {error.details ? `\n\ndetails: ${error.details}` : ''}
              {error.hint ? `\n\nhint: ${error.hint}` : ''}
              {error.code ? `\n\ncode: ${error.code}` : ''}
            </pre>
          </div>
        </section>
      ) : (
        <ArticleGrid articles={articles} />
      )}

      <SiteFooter />
    </main>
  )
}
