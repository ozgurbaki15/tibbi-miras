import 'server-only'

import { unstable_cache } from 'next/cache'
import { createClient } from '@supabase/supabase-js'
import { ARTICLE_COLUMNS, type Article, type Category } from '@/lib/types'

type ArchiveData = {
  articles: Article[]
  categories: Category[]
}

type ArticlePage = {
  articles: Article[]
  hasMore: boolean
}

const configuredUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() ?? ''
const publicSupabase = createClient(
  /^https?:\/\//i.test(configuredUrl) ? configuredUrl : 'https://placeholder.supabase.co',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim() || 'placeholder-anon-key',
  { auth: { persistSession: false, autoRefreshToken: false } },
)

async function loadArchiveData(): Promise<ArchiveData> {
  const [articleResult, categoryResult] = await Promise.all([
    publicSupabase
      .from('articles')
      .select(ARTICLE_COLUMNS)
      .eq('is_published', true)
      .eq('is_hidden', false)
      .order('id', { ascending: true }),
    publicSupabase
      .from('categories')
      .select('id, name_tr, name_en, parent_id, sort_order, is_adult')
      .order('sort_order', { ascending: true }),
  ])

  if (articleResult.error) throw new Error(articleResult.error.message)
  if (categoryResult.error) throw new Error(categoryResult.error.message)

  return {
    articles: (articleResult.data ?? []) as unknown as Article[],
    categories: (categoryResult.data ?? []) as Category[],
  }
}

// Public archive content is identical for visitors, so one origin query serves five minutes of traffic.
export const getPublicArchiveData = unstable_cache(loadArchiveData, ['public-archive-v1'], {
  revalidate: 300,
  tags: ['public-archive'],
})

async function loadArticlePage(offset: number, limit: number): Promise<ArticlePage> {
  const { data, error } = await publicSupabase
    .from('articles')
    .select(ARTICLE_COLUMNS)
    .eq('is_published', true)
    .eq('is_hidden', false)
    .order('id', { ascending: true })
    .range(offset, offset + limit)

  if (error) throw new Error(error.message)
  const rows = ((data ?? []) as unknown as Article[])
  return { articles: rows.slice(0, limit), hasMore: rows.length > limit }
}

export const getPublicArticlePage = unstable_cache(loadArticlePage, ['public-articles-page-v1'], {
  revalidate: 300,
  tags: ['public-archive'],
})

export async function getPublicArchiveFirstPage(limit = 30): Promise<ArchiveData & { hasMore: boolean }> {
  const [categories, page] = await Promise.all([
    getPublicArchiveData().then((data) => data.categories),
    getPublicArticlePage(0, limit),
  ])
  return { categories, articles: page.articles, hasMore: page.hasMore }
}
