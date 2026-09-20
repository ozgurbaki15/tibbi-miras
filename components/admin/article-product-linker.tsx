'use client'

import { useEffect, useMemo, useState } from 'react'
import { BookOpen, Link2, Loader2, Search, Unlink, X } from 'lucide-react'
import { supabase } from '@/lib/supabase/client'
import { useAuth } from '@/components/auth-provider'
import { useProducts } from '@/components/products-provider'
import { SHOP_ADMIN_EMAIL, fetchAllArticleProductLinks, setArticleProductLink, type ArticleProductLink } from '@/lib/shop'

type ArticleHit = { id: string | number; title_tr: string | null; title_en: string | null }

// Only visible to the Freeman account (see components/admin usage + Supabase RLS
// on tma_article_products). Lets an admin link an existing article to a
// purchasable product in either direction: "attach this article to a
// product" and "give this product a readable article" are the same link.
export function ArticleProductLinker() {
  const { user } = useAuth()
  const isAdmin = user?.email?.trim().toLowerCase() === SHOP_ADMIN_EMAIL.toLowerCase()
  const { products } = useProducts()

  const [query, setQuery] = useState('')
  const [results, setResults] = useState<ArticleHit[]>([])
  const [searching, setSearching] = useState(false)
  const [links, setLinks] = useState<ArticleProductLink[]>([])
  const [selected, setSelected] = useState<ArticleHit | null>(null)
  const [productId, setProductId] = useState('')
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  const linkedByArticle = useMemo(() => new Map(links.map((link) => [link.articleId, link.productId])), [links])
  const productName = (id: string) => products.find((p) => p.id === id)?.name ?? 'Ürün'

  async function loadLinks() {
    setLinks(await fetchAllArticleProductLinks())
  }

  useEffect(() => {
    if (isAdmin) void loadLinks()
  }, [isAdmin])

  async function runSearch(event: React.FormEvent) {
    event.preventDefault()
    const term = query.trim()
    if (!term) return
    setSearching(true)
    const { data } = await supabase
      .from('articles')
      .select('id, title_tr, title_en')
      .or(`title_tr.ilike.%${term}%,title_en.ilike.%${term}%`)
      .eq('is_published', true)
      .limit(20)
    setResults((data as ArticleHit[] | null) ?? [])
    setSearching(false)
  }

  function selectArticle(article: ArticleHit) {
    setSelected(article)
    setProductId(linkedByArticle.get(String(article.id)) ?? '')
    setMessage('')
  }

  async function handleSave() {
    if (!selected) return
    setSaving(true)
    const { error } = await setArticleProductLink(String(selected.id), productId || null)
    setSaving(false)
    if (error) {
      setMessage('Kaydedilemedi. Yönetici hesabıyla giriş yaptığınızdan ve şemayı uyguladığınızdan emin olun.')
      return
    }
    await loadLinks()
    setMessage(productId ? 'Bağlantı kaydedildi. Makalenin altında satın alma kutusu, ürünün altında ise bu makale görünecek.' : 'Bağlantı kaldırıldı.')
  }

  async function removeLink(articleId: string) {
    setSaving(true)
    await setArticleProductLink(articleId, null)
    setSaving(false)
    await loadLinks()
    if (selected && String(selected.id) === articleId) setProductId('')
  }

  if (!isAdmin) return null

  const inputClass = 'w-full rounded-md border border-border bg-background px-3 py-2.5 font-sans text-sm text-foreground outline-none transition-colors focus:border-primary'
  const labelClass = 'mb-1.5 block font-sans text-xs font-medium uppercase tracking-wider text-muted-foreground'

  return (
    <section className="mt-8 rounded-md border border-border bg-card p-6">
      <div className="mb-2 flex items-center gap-2.5">
        <Link2 className="size-5 text-primary" aria-hidden="true" />
        <h2 className="font-serif text-xl text-card-foreground">Makale – Ürün Bağlantısı</h2>
      </div>
      <p className="mb-5 max-w-2xl font-sans text-sm leading-relaxed text-muted-foreground">
        Hazır bir makaleyi bir ürüne bağlayın. Bağladığınızda makalenin altında otomatik olarak satın alma kutusu, ürünün sayfasında ise bu makale okunmaya hazır şekilde belirir. İsterseniz makaleyi bir ürüne adayın, isterseniz bir ürüne makale ekleyin — ikisi de aynı bağlantıyı oluşturur.
      </p>

      <form onSubmit={runSearch} className="mb-4 flex gap-2">
        <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Makale başlığına göre ara…" className={inputClass} />
        <button type="submit" disabled={searching} className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2.5 font-sans text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50">
          {searching ? <Loader2 className="size-4 animate-spin" /> : <Search className="size-4" />} Ara
        </button>
      </form>

      {results.length > 0 ? (
        <ul className="mb-6 flex flex-col gap-2">
          {results.map((article) => {
            const linkedProductId = linkedByArticle.get(String(article.id))
            return (
              <li key={article.id}>
                <button
                  type="button"
                  onClick={() => selectArticle(article)}
                  className={`flex w-full items-center justify-between gap-3 rounded-md border px-4 py-2.5 text-left font-sans text-sm transition-colors ${selected && String(selected.id) === String(article.id) ? 'border-primary bg-primary/10 text-foreground' : 'border-border text-foreground hover:border-primary'}`}
                >
                  <span className="flex items-center gap-2 truncate"><BookOpen className="size-3.5 shrink-0 text-muted-foreground" />{article.title_tr || article.title_en || 'Başlıksız'}</span>
                  {linkedProductId ? <span className="shrink-0 rounded-full bg-primary/15 px-2.5 py-0.5 font-sans text-[11px] text-primary">{productName(linkedProductId)}</span> : null}
                </button>
              </li>
            )
          })}
        </ul>
      ) : null}

      {selected ? (
        <div className="rounded-md border border-primary/30 bg-background p-5">
          <div className="mb-4 flex items-center justify-between gap-3">
            <p className="font-sans text-sm font-medium text-foreground">Seçilen makale: <span className="text-primary">{selected.title_tr || selected.title_en}</span></p>
            <button type="button" onClick={() => setSelected(null)} className="text-muted-foreground hover:text-foreground"><X className="size-4" /></button>
          </div>
          <label className={labelClass}>Ürüne bağla</label>
          <div className="flex flex-wrap items-center gap-3">
            <select value={productId} onChange={(e) => setProductId(e.target.value)} className={`${inputClass} max-w-sm`}>
              <option value="">Bağlantı yok</option>
              {products.map((product) => <option key={product.id} value={product.id}>{product.name}</option>)}
            </select>
            <button type="button" onClick={handleSave} disabled={saving} className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2.5 font-sans text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50">
              {saving ? <Loader2 className="size-4 animate-spin" /> : <Link2 className="size-4" />} Kaydet
            </button>
          </div>
          {message ? <p className="mt-3 font-sans text-xs text-muted-foreground">{message}</p> : null}
        </div>
      ) : null}

      {links.length > 0 ? (
        <div className="mt-6">
          <h3 className="mb-3 font-sans text-xs font-medium uppercase tracking-wider text-muted-foreground">Mevcut bağlantılar ({links.length})</h3>
          <ul className="flex flex-col gap-2">
            {links.map((link) => (
              <li key={link.articleId} className="flex items-center justify-between gap-3 rounded-md border border-border px-4 py-2.5">
                <span className="truncate font-sans text-sm text-foreground">Makale #{link.articleId} → <span className="text-primary">{productName(link.productId)}</span></span>
                <button type="button" onClick={() => removeLink(link.articleId)} aria-label="Bağlantıyı kaldır" className="shrink-0 text-muted-foreground transition-colors hover:text-destructive">
                  <Unlink className="size-4" />
                </button>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </section>
  )
}
