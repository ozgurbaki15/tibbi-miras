import { notFound } from 'next/navigation'
import { ArticleDetail } from '@/components/article-detail'
import { SiteFooter } from '@/components/site-footer'
import { isSupabaseConfigured, supabase } from '@/lib/supabase/client'
import { ARTICLE_COLUMNS, type Article } from '@/lib/types'

export const dynamic = 'force-dynamic'

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  if (!isSupabaseConfigured) {
    notFound()
  }

  const { data, error } = await supabase
    .from('articles')
    .select(ARTICLE_COLUMNS)
    .eq('id', id)
    .eq('is_published', true)
    .eq('is_hidden', false)
    .maybeSingle()

  if (error || !data) {
    notFound()
  }

  const article = data as unknown as Article

  return (
    <main className="min-h-svh bg-background">
      <ArticleDetail article={article} />
      <SiteFooter width="narrow" />
    </main>
  )
}
