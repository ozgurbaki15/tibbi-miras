'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { ArrowRight, BookOpen } from 'lucide-react'
import { supabase } from '@/lib/supabase/client'
import { useLanguage } from '@/components/language-provider'

type RelatedArticle = { id: string | number; title_tr: string | null; title_en: string | null }

export function ProductRelatedArticles({ productId }: { productId: string }) {
  const { lang } = useLanguage()
  const [articles, setArticles] = useState<RelatedArticle[]>([])

  useEffect(() => {
    let active = true
    supabase.from('tma_article_product_links').select('article_id').eq('product_id', productId).then(async ({ data }) => {
      const ids = [...new Set((data ?? []).map((row) => String(row.article_id)).filter(Boolean))]
      if (!ids.length) return
      const result = await supabase.from('articles').select('id, title_tr, title_en').in('id', ids).eq('is_published', true).eq('is_hidden', false)
      if (active) setArticles((result.data as RelatedArticle[] | null) ?? [])
    })
    return () => { active = false }
  }, [productId])

  if (!articles.length) return null
  return <div className="mt-4 rounded-lg border border-primary/25 bg-primary/5 p-3"><p className="mb-2 flex items-center gap-2 font-sans text-xs font-semibold uppercase tracking-wider text-primary"><BookOpen className="size-3.5" />{lang === 'tr' ? 'Bu ürünün makaleleri' : 'Articles for this product'}</p><div className="flex flex-col gap-2">{articles.map((article) => <Link key={article.id} href={`/article/${article.id}`} className="group inline-flex items-center justify-between gap-2 rounded-md border border-border/70 bg-background/50 px-3 py-2 font-serif text-sm text-foreground hover:border-primary hover:text-primary"><span>{lang === 'tr' ? article.title_tr : article.title_en || article.title_tr}</span><ArrowRight className="size-4 shrink-0 transition-transform group-hover:translate-x-1" /></Link>)}</div></div>
}
