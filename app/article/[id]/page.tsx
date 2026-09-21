import { notFound } from 'next/navigation'
import { ArticleDetail } from '@/components/article-detail'
import { SiteFooter } from '@/components/site-footer'
import { isSupabaseConfigured } from '@/lib/supabase/client'
import { getPublicArticle } from '@/lib/public-data'

export const revalidate = 300

export default async function ArticlePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  if (!isSupabaseConfigured) notFound()

  const { article, terms, product } = await getPublicArticle(id)
  if (!article) notFound()

  return <main className="min-h-svh bg-background"><ArticleDetail article={article} terms={terms} product={product} /><SiteFooter width="narrow" /></main>
}
