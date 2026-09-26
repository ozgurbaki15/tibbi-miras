import { notFound } from 'next/navigation'
import { ArticleDetail } from '@/components/article-detail'
import { SiteFooter } from '@/components/site-footer'
import { isSupabaseConfigured } from '@/lib/supabase/client'
import { getPublicArticleDetail } from '@/lib/public-data'
export const revalidate = 300

export default async function ArticlePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  if (!isSupabaseConfigured) notFound()

  const { article, terms } = await getPublicArticleDetail(id)
  if (!article) notFound()

  return <main className="min-h-svh bg-background"><ArticleDetail article={article} terms={terms} /><SiteFooter width="narrow" /></main>
}
