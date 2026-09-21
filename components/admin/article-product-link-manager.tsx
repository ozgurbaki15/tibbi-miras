'use client'

import { useEffect, useState } from 'react'
import { Link2, Save } from 'lucide-react'
import { supabase } from '@/lib/supabase/client'
import { useProducts } from '@/components/products-provider'
import { SHOP_ADMIN_EMAIL } from '@/lib/shop'
import { useAuth } from '@/components/auth-provider'

type ArticleOption = { id: string; title: string }

export function ArticleProductLinkManager() {
  const { user } = useAuth()
  const { products } = useProducts()
  const [articles, setArticles] = useState<ArticleOption[]>([])
  const [articleId, setArticleId] = useState('')
  const [productId, setProductId] = useState('')
  const [articleFirst, setArticleFirst] = useState(true)
  const [productFirst, setProductFirst] = useState(true)
  const [message, setMessage] = useState('')
  const isAdmin = user?.email?.trim().toLowerCase() === SHOP_ADMIN_EMAIL.toLowerCase()

  useEffect(() => {
    if (!isAdmin) return
    supabase.from('articles').select('id, title').eq('is_published', true).eq('is_hidden', false).order('title').then(({ data }) => setArticles((data as ArticleOption[] | null) ?? []))
  }, [isAdmin])

  async function saveLink(event: React.FormEvent) {
    event.preventDefault()
    if (!articleId || !productId || (!articleFirst && !productFirst)) return setMessage('Makale veya ürün önceliği seçin.')
    const { error } = await supabase.from('tma_article_product_links').upsert({ article_id: articleId, product_id: productId, article_first: articleFirst, product_first: productFirst }, { onConflict: 'article_id,product_id' })
    setMessage(error ? 'Bağlantı kaydedilemedi. SQL tablosu ve RLS politikalarını kontrol edin.' : 'Makale–ürün bağlantısı kaydedildi.')
  }

  if (!isAdmin) return null
  return <section className="mt-8 rounded-2xl border border-primary/35 bg-card p-6 shadow-xl"><div className="mb-5 flex items-center gap-3"><Link2 className="size-5 text-primary" /><div><h2 className="font-serif text-2xl text-card-foreground">Makale ↔ ürün bağlantıları</h2><p className="mt-1 font-sans text-sm text-muted-foreground">Hazır makaleyi ürüne adayın, makaleye satın alma seçeneği ekleyin veya ikisini birlikte kullanın.</p></div></div><form onSubmit={saveLink} className="grid gap-4 md:grid-cols-2"><label className="font-sans text-sm text-card-foreground">Hazır makale<select value={articleId} onChange={(event) => setArticleId(event.target.value)} className="mt-1.5 w-full rounded-md border border-border bg-background px-3 py-2"><option value="">Makale seçin</option>{articles.map((article) => <option key={article.id} value={article.id}>{article.title}</option>)}</select></label><label className="font-sans text-sm text-card-foreground">Ürün<select value={productId} onChange={(event) => setProductId(event.target.value)} className="mt-1.5 w-full rounded-md border border-border bg-background px-3 py-2"><option value="">Ürün seçin</option>{products.map((product) => <option key={product.id} value={product.id}>{product.name}</option>)}</select></label><label className="flex items-center gap-2 font-sans text-sm text-card-foreground"><input type="checkbox" checked={articleFirst} onChange={(event) => setArticleFirst(event.target.checked)} /> Makaleyi göster, altında ürünü sat</label><label className="flex items-center gap-2 font-sans text-sm text-card-foreground"><input type="checkbox" checked={productFirst} onChange={(event) => setProductFirst(event.target.checked)} /> Ürünü göster, altında makaleyi oku</label><button type="submit" className="inline-flex items-center justify-center gap-2 rounded-md bg-primary px-4 py-3 font-sans text-xs font-semibold uppercase tracking-wider text-primary-foreground md:col-span-2"><Save className="size-4" /> Bağlantıyı kaydet</button></form>{message ? <p className="mt-4 font-sans text-sm text-muted-foreground">{message}</p> : null}</section>
}
