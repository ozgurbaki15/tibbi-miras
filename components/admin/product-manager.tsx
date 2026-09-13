'use client'

import { useMemo, useRef, useState } from 'react'
import { FolderPlus, ImagePlus, Loader2, Pencil, Plus, Save, Trash2, X } from 'lucide-react'
import { supabase } from '@/lib/supabase/client'
import { compressImage } from '@/lib/image-compress'
import { useProducts } from '@/components/products-provider'
import { shopPriceLabel, type ShopProduct } from '@/lib/shop'

type ProductForm = {
  id: string | null
  name: string
  nameEn: string
  description: string
  descriptionEn: string
  categoryId: string
  priceTl: string
  maxQuantity: string
  inStock: boolean
  image: string
}

const emptyForm: ProductForm = {
  id: null,
  name: '',
  nameEn: '',
  description: '',
  descriptionEn: '',
  categoryId: '',
  priceTl: '',
  maxQuantity: '10',
  inStock: true,
  image: '',
}

function toForm(product: ShopProduct): ProductForm {
  return {
    id: product.id,
    name: product.name,
    nameEn: product.nameEn,
    description: product.description,
    descriptionEn: product.descriptionEn,
    categoryId: product.categoryId ?? '',
    priceTl: String(product.priceKurus / 100),
    maxQuantity: String(product.maxQuantity),
    inStock: product.inStock,
    image: product.image,
  }
}

export function ProductManager() {
  const { products, categories, refresh } = useProducts()
  const [form, setForm] = useState<ProductForm>(emptyForm)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [message, setMessage] = useState<{ kind: 'ok' | 'error'; text: string } | null>(null)
  const [newCategory, setNewCategory] = useState({ name: '', nameEn: '' })
  const [categoryBusy, setCategoryBusy] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)
  const formRef = useRef<HTMLDivElement>(null)

  const isEditing = form.id !== null

  const categoryName = useMemo(() => {
    const map = new Map(categories.map((c) => [c.id, c.name]))
    return (id: string | null) => (id ? map.get(id) ?? 'Diğer' : 'Diğer')
  }, [categories])

  function notify(kind: 'ok' | 'error', text: string) {
    setMessage({ kind, text })
    window.setTimeout(() => setMessage(null), 4000)
  }

  function startCreate() {
    setForm(emptyForm)
    formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  function startEdit(product: ShopProduct) {
    setForm(toForm(product))
    formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  async function handleUpload(file: File) {
    setUploading(true)
    try {
      const blob = await compressImage(file)
      const path = `${crypto.randomUUID()}.jpg`
      const { error } = await supabase.storage.from('shop').upload(path, blob, { contentType: 'image/jpeg', upsert: true })
      if (error) throw error
      const { data } = supabase.storage.from('shop').getPublicUrl(path)
      setForm((prev) => ({ ...prev, image: data.publicUrl }))
      notify('ok', 'Fotoğraf yüklendi.')
    } catch (err) {
      console.log('[v0] image upload error', err)
      notify('error', 'Fotoğraf yüklenemedi. Tekrar deneyin.')
    } finally {
      setUploading(false)
    }
  }

  async function handleSave() {
    if (!form.name.trim()) return notify('error', 'Ürün adı gerekli.')
    const priceKurus = Math.round(parseFloat(form.priceTl.replace(',', '.')) * 100)
    if (!Number.isFinite(priceKurus) || priceKurus < 0) return notify('error', 'Geçerli bir fiyat girin.')
    const maxQuantity = Math.max(1, Math.floor(Number(form.maxQuantity) || 1))

    setSaving(true)
    const payload = {
      name: form.name.trim(),
      name_en: form.nameEn.trim(),
      description: form.description.trim(),
      description_en: form.descriptionEn.trim(),
      category_id: form.categoryId || null,
      image_url: form.image,
      price_kurus: priceKurus,
      max_quantity: maxQuantity,
      in_stock: form.inStock,
    }

    try {
      if (form.id) {
        const { error } = await supabase.from('shop_products').update(payload).eq('id', form.id)
        if (error) throw error
      } else {
        const { error } = await supabase.from('shop_products').insert(payload)
        if (error) throw error
      }
      await refresh()
      setForm(emptyForm)
      notify('ok', form.id ? 'Ürün güncellendi.' : 'Ürün eklendi.')
    } catch (err) {
      console.log('[v0] product save error', err)
      notify('error', 'Kaydedilemedi. Yönetici hesabıyla giriş yaptığınızdan emin olun.')
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(product: ShopProduct) {
    if (!window.confirm(`"${product.name}" ürününü silmek istediğinize emin misiniz?`)) return
    try {
      const { error } = await supabase.from('shop_products').delete().eq('id', product.id)
      if (error) throw error
      await refresh()
      if (form.id === product.id) setForm(emptyForm)
      notify('ok', 'Ürün silindi.')
    } catch (err) {
      console.log('[v0] product delete error', err)
      notify('error', 'Silinemedi. Tekrar deneyin.')
    }
  }

  async function handleAddCategory() {
    if (!newCategory.name.trim()) return notify('error', 'Kategori adı gerekli.')
    setCategoryBusy(true)
    try {
      const { error } = await supabase.from('shop_categories').insert({
        name: newCategory.name.trim(),
        name_en: newCategory.nameEn.trim(),
        sort_order: categories.length,
      })
      if (error) throw error
      await refresh()
      setNewCategory({ name: '', nameEn: '' })
      notify('ok', 'Kategori eklendi.')
    } catch (err) {
      console.log('[v0] category add error', err)
      notify('error', 'Kategori eklenemedi.')
    } finally {
      setCategoryBusy(false)
    }
  }

  async function handleDeleteCategory(id: string, name: string) {
    if (!window.confirm(`"${name}" kategorisini silmek istediğinize emin misiniz? Bu kategorideki ürünler "Diğer" olarak kalır.`)) return
    try {
      const { error } = await supabase.from('shop_categories').delete().eq('id', id)
      if (error) throw error
      await refresh()
      if (form.categoryId === id) setForm((prev) => ({ ...prev, categoryId: '' }))
      notify('ok', 'Kategori silindi.')
    } catch (err) {
      console.log('[v0] category delete error', err)
      notify('error', 'Kategori silinemedi.')
    }
  }

  const inputClass = 'w-full rounded-md border border-border bg-background px-3 py-2.5 font-sans text-sm text-foreground outline-none transition-colors focus:border-primary'
  const labelClass = 'mb-1.5 block font-sans text-xs font-medium uppercase tracking-wider text-muted-foreground'

  return (
    <div className="flex flex-col gap-10">
      {message ? (
        <div className={`fixed inset-x-0 top-4 z-50 mx-auto w-fit rounded-md border px-5 py-3 font-sans text-sm shadow-lg ${message.kind === 'ok' ? 'border-primary/40 bg-card text-foreground' : 'border-destructive/50 bg-card text-destructive'}`}>
          {message.text}
        </div>
      ) : null}

      {/* Categories */}
      <section className="rounded-md border border-border bg-card p-6">
        <div className="mb-4 flex items-center gap-2.5">
          <FolderPlus className="size-5 text-primary" aria-hidden="true" />
          <h2 className="font-serif text-xl text-card-foreground">Kategoriler</h2>
        </div>
        {categories.length > 0 ? (
          <ul className="mb-5 flex flex-wrap gap-2">
            {categories.map((category) => (
              <li key={category.id} className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-3 py-1.5">
                <span className="font-sans text-sm text-foreground">{category.name}</span>
                <button type="button" onClick={() => handleDeleteCategory(category.id, category.name)} aria-label={`${category.name} kategorisini sil`} className="text-muted-foreground transition-colors hover:text-destructive">
                  <X className="size-3.5" />
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mb-5 font-sans text-sm text-muted-foreground">Henüz kategori yok. İsterseniz ürünleri kategorisiz de ekleyebilirsiniz.</p>
        )}
        <div className="grid gap-3 sm:grid-cols-[1fr_1fr_auto]">
          <input value={newCategory.name} onChange={(e) => setNewCategory((p) => ({ ...p, name: e.target.value }))} placeholder="Kategori adı (ör. Uçucu Yağlar)" className={inputClass} />
          <input value={newCategory.nameEn} onChange={(e) => setNewCategory((p) => ({ ...p, nameEn: e.target.value }))} placeholder="İngilizce adı (opsiyonel)" className={inputClass} />
          <button type="button" onClick={handleAddCategory} disabled={categoryBusy} className="inline-flex items-center justify-center gap-2 rounded-md bg-primary px-4 py-2.5 font-sans text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50">
            {categoryBusy ? <Loader2 className="size-4 animate-spin" /> : <Plus className="size-4" />} Ekle
          </button>
        </div>
      </section>

      {/* Product form */}
      <section ref={formRef} className="rounded-md border border-border bg-card p-6">
        <div className="mb-5 flex items-center justify-between gap-3">
          <h2 className="font-serif text-xl text-card-foreground">{isEditing ? 'Ürünü düzenle' : 'Yeni ürün ekle'}</h2>
          {isEditing ? (
            <button type="button" onClick={() => setForm(emptyForm)} className="inline-flex items-center gap-1.5 font-sans text-xs uppercase tracking-wider text-muted-foreground hover:text-foreground">
              <X className="size-4" /> İptal
            </button>
          ) : null}
        </div>

        <div className="grid gap-5 lg:grid-cols-[200px_1fr]">
          {/* Image */}
          <div>
            <span className={labelClass}>Fotoğraf</span>
            <div className="aspect-square overflow-hidden rounded-md border border-dashed border-border bg-background">
              {form.image ? (
                <img src={form.image || '/placeholder.svg'} alt="Ürün önizleme" className="size-full object-cover" />
              ) : (
                <div className="flex size-full items-center justify-center text-muted-foreground">
                  <ImagePlus className="size-8" />
                </div>
              )}
            </div>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (file) void handleUpload(file)
                e.target.value = ''
              }}
            />
            <button type="button" onClick={() => fileRef.current?.click()} disabled={uploading} className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-md border border-border px-3 py-2.5 font-sans text-xs font-medium uppercase tracking-wider text-foreground transition-colors hover:border-primary hover:text-primary disabled:opacity-50">
              {uploading ? <Loader2 className="size-4 animate-spin" /> : <ImagePlus className="size-4" />}
              {uploading ? 'Yükleniyor…' : 'Fotoğraf seç'}
            </button>
            <p className="mt-2 font-sans text-[11px] leading-relaxed text-muted-foreground">Fotoğraf otomatik küçültülüp sıkıştırılır, yer kaplamaz.</p>
          </div>

          {/* Fields */}
          <div className="grid gap-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className={labelClass}>Ürün adı (Türkçe)</label>
                <input value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Ürün adı (İngilizce)</label>
                <input value={form.nameEn} onChange={(e) => setForm((p) => ({ ...p, nameEn: e.target.value }))} className={inputClass} />
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className={labelClass}>Açıklama (Türkçe)</label>
                <textarea value={form.description} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))} rows={3} className={`${inputClass} resize-y`} />
              </div>
              <div>
                <label className={labelClass}>Açıklama (İngilizce)</label>
                <textarea value={form.descriptionEn} onChange={(e) => setForm((p) => ({ ...p, descriptionEn: e.target.value }))} rows={3} className={`${inputClass} resize-y`} />
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div>
                <label className={labelClass}>Fiyat (TL)</label>
                <input value={form.priceTl} onChange={(e) => setForm((p) => ({ ...p, priceTl: e.target.value }))} inputMode="decimal" placeholder="299" className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Maks. adet</label>
                <input value={form.maxQuantity} onChange={(e) => setForm((p) => ({ ...p, maxQuantity: e.target.value }))} inputMode="numeric" className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Kategori</label>
                <select value={form.categoryId} onChange={(e) => setForm((p) => ({ ...p, categoryId: e.target.value }))} className={inputClass}>
                  <option value="">Diğer / Kategorisiz</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>{category.name}</option>
                  ))}
                </select>
              </div>
              <div className="flex items-end">
                <label className="inline-flex cursor-pointer items-center gap-2 pb-2.5">
                  <input type="checkbox" checked={form.inStock} onChange={(e) => setForm((p) => ({ ...p, inStock: e.target.checked }))} className="size-4 accent-primary" />
                  <span className="font-sans text-sm text-foreground">Stokta</span>
                </label>
              </div>
            </div>
            <div>
              <button type="button" onClick={handleSave} disabled={saving} className="inline-flex items-center justify-center gap-2 rounded-md bg-primary px-6 py-3 font-sans text-sm font-medium uppercase tracking-wider text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50">
                {saving ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
                {isEditing ? 'Değişiklikleri kaydet' : 'Ürünü ekle'}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Product list */}
      <section>
        <div className="mb-4 flex items-center justify-between gap-3">
          <h2 className="font-serif text-xl text-foreground">Ürünler ({products.length})</h2>
          <button type="button" onClick={startCreate} className="inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-2 font-sans text-xs uppercase tracking-wider text-foreground transition-colors hover:border-primary hover:text-primary">
            <Plus className="size-4" /> Yeni
          </button>
        </div>
        {products.length === 0 ? (
          <p className="rounded-md border border-dashed border-border py-12 text-center font-sans text-sm text-muted-foreground">Henüz ürün yok. Yukarıdaki formdan ilk ürününüzü ekleyin.</p>
        ) : (
          <ul className="flex flex-col gap-3">
            {products.map((product) => (
              <li key={product.id} className="flex items-center gap-4 rounded-md border border-border bg-card p-4">
                <img src={product.image || '/placeholder.svg'} alt={product.name} className="size-16 shrink-0 rounded object-cover" />
                <div className="min-w-0 flex-1">
                  <p className="truncate font-serif text-base font-semibold text-card-foreground">{product.name}</p>
                  <p className="mt-0.5 font-sans text-xs text-muted-foreground">
                    {shopPriceLabel(product.priceKurus)} · {categoryName(product.categoryId)} · {product.inStock ? 'Stokta' : 'Tükendi'}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <button type="button" onClick={() => startEdit(product)} aria-label="Düzenle" className="inline-flex size-9 items-center justify-center rounded-md border border-border text-foreground transition-colors hover:border-primary hover:text-primary">
                    <Pencil className="size-4" />
                  </button>
                  <button type="button" onClick={() => handleDelete(product)} aria-label="Sil" className="inline-flex size-9 items-center justify-center rounded-md border border-border text-foreground transition-colors hover:border-destructive hover:text-destructive">
                    <Trash2 className="size-4" />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}
