import { notFound } from 'next/navigation'
import { ProductDetailView } from '@/components/product-detail-view'
import { SiteFooter } from '@/components/site-footer'
import { isSupabaseConfigured, supabase } from '@/lib/supabase/client'
import { ARTICLE_COLUMNS, type Article, type ArticleTerm } from '@/lib/types'
import { fetchArticleIdsForProduct, fetchProductById } from '@/lib/shop'

export const dynamic = 'force-dynamic'

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  if (!isSupabaseConfigured) notFound()

  const product = await fetchProductById(id)
  if (!product) notFound()

  const articleIds = await fetchArticleIdsForProduct(id)
  let articles: Article[] = []
  let terms: ArticleTerm[] = []
  if (articleIds.length > 0) {
    const [{ data: articleData }, { data: termData }] = await Promise.all([
      supabase.from('articles').select(ARTICLE_COLUMNS).in('id', articleIds).eq('is_published', true).eq('is_hidden', false),
      supabase.from('article_terms').select('article_id, aliases'),
    ])
    articles = (articleData ?? []) as unknown as Article[]
    terms = (termData ?? []) as ArticleTerm[]
  }

  return (
    <main className="min-h-svh bg-background">
      <ProductDetailView product={product} articles={articles} terms={terms} />
      <SiteFooter width="narrow" />
    </main>
  )
}
