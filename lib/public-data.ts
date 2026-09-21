import { unstable_cache } from 'next/cache'
import { isSupabaseConfigured, supabase } from '@/lib/supabase/client'
import { ARTICLE_COLUMNS, type Article, type ArticleTerm, type Category } from '@/lib/types'
import { fetchShopData, fetchProductById, fetchArticleIdsForProduct, type ShopProduct } from '@/lib/shop'

const CACHE_SECONDS = 300

export const getPublicArchiveData = unstable_cache(
  async (): Promise<{ articles: Article[]; categories: Category[]; error: string | null }> => {
    if (!isSupabaseConfigured) return { articles: [], categories: [], error: null }
    const [articleResult, categoryResult] = await Promise.all([
      supabase.from('articles').select(ARTICLE_COLUMNS).eq('is_published', true).eq('is_hidden', false).order('id', { ascending: true }),
      supabase.from('categories').select('id, name_tr, name_en, parent_id, sort_order, is_adult').order('sort_order', { ascending: true }),
    ])
    const error = articleResult.error || categoryResult.error
    return {
      articles: (articleResult.data ?? []) as unknown as Article[],
      categories: (categoryResult.data ?? []) as Category[],
      error: error?.message ?? null,
    }
  },
  ['public-archive-data-v1'],
  { revalidate: CACHE_SECONDS, tags: ['public-archive'] },
)

export const getPublicShopData = unstable_cache(
  async () => fetchShopData(),
  ['public-shop-data-v1'],
  { revalidate: CACHE_SECONDS, tags: ['public-shop'] },
)

export async function getPublicArticle(id: string): Promise<{ article: Article | null; terms: ArticleTerm[]; product: ShopProduct | null }> {
  const getCached = unstable_cache(
    async () => {
      if (!isSupabaseConfigured) return { article: null, terms: [], product: null }
      const [{ data }, { data: terms }] = await Promise.all([
        supabase.from('articles').select(ARTICLE_COLUMNS).eq('id', id).eq('is_published', true).eq('is_hidden', false).maybeSingle(),
        supabase.from('article_terms').select('article_id, aliases'),
      ])
      const product = await import('@/lib/shop').then(({ fetchProductForArticle }) => fetchProductForArticle(id))
      return { article: data as unknown as Article | null, terms: (terms ?? []) as ArticleTerm[], product }
    },
    [`public-article-${id}-v1`],
    { revalidate: CACHE_SECONDS, tags: ['public-articles', `public-article-${id}`] },
  )
  return getCached()
}

export async function getPublicProduct(id: string): Promise<{ product: ShopProduct | null; articles: Article[]; terms: ArticleTerm[] }> {
  const getCached = unstable_cache(
    async () => {
      if (!isSupabaseConfigured) return { product: null, articles: [], terms: [] }
      const product = await fetchProductById(id)
      const articleIds = await fetchArticleIdsForProduct(id)
      if (!articleIds.length) return { product, articles: [], terms: [] }
      const [{ data: articles }, { data: terms }] = await Promise.all([
        supabase.from('articles').select(ARTICLE_COLUMNS).in('id', articleIds).eq('is_published', true).eq('is_hidden', false),
        supabase.from('article_terms').select('article_id, aliases'),
      ])
      return { product, articles: (articles ?? []) as unknown as Article[], terms: (terms ?? []) as ArticleTerm[] }
    },
    [`public-product-${id}-v1`],
    { revalidate: CACHE_SECONDS, tags: ['public-shop', 'public-articles', `public-product-${id}`] },
  )
  return getCached()
}

export const CACHE_REVALIDATE_SECONDS = CACHE_SECONDS
