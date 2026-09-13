'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { MapPin, Plus, Trash2, Check, Pencil, X } from 'lucide-react'
import { ArchiveHeader } from '@/components/archive-header'
import { ArchiveNavigation } from '@/components/archive-navigation'
import { SiteFooter } from '@/components/site-footer'
import { ShippingFields } from '@/components/shipping-fields'
import { useLanguage } from '@/components/language-provider'
import { loadAddresses, saveAddresses, newAddress, shippingErrors, type ShippingAddress, type ShippingInfo } from '@/lib/shipping'
import { updateOrderContact } from '@/app/actions/orders'

export default function AdreslerimPage() {
  const { lang } = useLanguage()
  const tr = lang === 'tr'
  const searchParams = useSearchParams()
  const orderId = searchParams.get('order')

  const [addresses, setAddresses] = useState<ShippingAddress[]>([])
  const [editing, setEditing] = useState<ShippingAddress | null>(null)
  const [errors, setErrors] = useState<Partial<Record<keyof ShippingInfo, boolean>>>({})
  const [labelError, setLabelError] = useState(false)
  const [savedFlash, setSavedFlash] = useState(false)

  useEffect(() => {
    setAddresses(loadAddresses())
  }, [])

  const persist = (list: ShippingAddress[]) => {
    setAddresses(list)
    saveAddresses(list)
  }

  const startAdd = () => {
    setEditing(newAddress(''))
    setErrors({})
    setLabelError(false)
  }

  const startEdit = (addr: ShippingAddress) => {
    setEditing({ ...addr })
    setErrors({})
    setLabelError(false)
  }

  const cancelEdit = () => {
    setEditing(null)
    setErrors({})
    setLabelError(false)
  }

  const saveEditing = async () => {
    if (!editing) return
    const noLabel = !editing.label.trim()
    const fieldErrors = shippingErrors(editing)
    setLabelError(noLabel)
    setErrors(fieldErrors)
    if (noLabel || Object.keys(fieldErrors).length > 0) return

    const exists = addresses.some((a) => a.id === editing.id)
    const next = exists ? addresses.map((a) => (a.id === editing.id ? editing : a)) : [...addresses, editing]
    persist(next)
    if (orderId) {
      const result = await updateOrderContact(orderId, editing)
      if (!result.ok) return
    }
    setEditing(null)
    setSavedFlash(true)
    window.setTimeout(() => setSavedFlash(false), 2500)
  }

  const remove = (id: string) => {
    persist(addresses.filter((a) => a.id !== id))
    if (editing?.id === id) cancelEdit()
  }

  return (
    <main className="min-h-svh bg-background">
      <ArchiveHeader />
      <ArchiveNavigation />
      <section className="mx-auto max-w-3xl px-6 py-14">
        <p className="mb-2 font-sans text-xs uppercase tracking-[0.25em] text-primary">{tr ? 'Kişisel alan' : 'Personal space'}</p>
        <div className="mb-3 flex items-center gap-3">
          <MapPin className="size-7 text-primary" aria-hidden="true" />
          <h1 className="font-serif text-4xl text-foreground md:text-5xl">{tr ? 'Kargo Bilgilerim' : 'Shipping Addresses'}</h1>
        </div>
        <p className="mb-8 max-w-2xl text-pretty font-sans text-sm leading-relaxed text-muted-foreground">
          {tr
            ? 'Ev, iş yeri gibi farklı adresleri ayrı ayrı kaydedebilirsiniz. Her adres için ad soyad, telefon ve tam adres bilgisi gereklidir. Sipariş sırasında bu adreslerden birini seçersiniz.'
            : 'Save separate addresses such as home or work. Each address needs a full name, phone and complete address. You pick one of them at checkout.'}
        </p>

        <div className="flex flex-col gap-4">
          {addresses.map((addr) => (
            <article key={addr.id} className="rounded-md border border-border bg-card p-5">
              {editing?.id === addr.id ? null : (
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <MapPin className="mt-0.5 size-5 shrink-0 text-primary" aria-hidden="true" />
                    <div>
                      <h2 className="font-serif text-lg text-card-foreground">{addr.label || (tr ? 'Adres' : 'Address')}</h2>
                      <p className="mt-1 font-sans text-sm text-foreground">{addr.fullName}</p>
                      <p className="font-sans text-xs leading-relaxed text-muted-foreground">{addr.phone}</p>
                      <p className="mt-1 font-sans text-xs leading-relaxed text-muted-foreground">{addr.address}, {addr.district} / {addr.city} {addr.postalCode}</p>
                    </div>
                  </div>
                  <div className="flex shrink-0 gap-1">
                    <button type="button" onClick={() => startEdit(addr)} aria-label={tr ? 'Düzenle' : 'Edit'} className="flex size-9 items-center justify-center rounded-md border border-border text-muted-foreground transition-colors hover:border-primary hover:text-primary">
                      <Pencil className="size-4" />
                    </button>
                    <button type="button" onClick={() => remove(addr.id)} aria-label={tr ? 'Sil' : 'Delete'} className="flex size-9 items-center justify-center rounded-md border border-border text-muted-foreground transition-colors hover:border-destructive hover:text-destructive">
                      <Trash2 className="size-4" />
                    </button>
                  </div>
                </div>
              )}
            </article>
          ))}
        </div>

        {editing ? (
          <div className="mt-4 rounded-md border border-primary/40 bg-card p-5">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-serif text-xl text-card-foreground">{addresses.some((a) => a.id === editing.id) ? (tr ? 'Adresi düzenle' : 'Edit address') : (tr ? 'Yeni adres' : 'New address')}</h2>
              <button type="button" onClick={cancelEdit} aria-label={tr ? 'Kapat' : 'Close'} className="text-muted-foreground hover:text-foreground"><X className="size-5" /></button>
            </div>

            <label className="mb-4 flex flex-col gap-1.5">
              <span className="font-sans text-xs uppercase tracking-wider text-muted-foreground">{tr ? 'Adres etiketi (Ev, İşyeri…)' : 'Address label (Home, Work…)'}<span className="text-destructive"> *</span></span>
              <input
                type="text"
                value={editing.label}
                onChange={(e) => { setEditing({ ...editing, label: e.target.value }); setLabelError(false) }}
                placeholder={tr ? 'Örn. Ev' : 'e.g. Home'}
                className={`w-full rounded-md border bg-background px-3 py-2 font-sans text-sm text-foreground outline-none transition-colors focus:border-primary ${labelError ? 'border-destructive' : 'border-border'}`}
              />
              {labelError ? <span className="font-sans text-xs text-destructive">{tr ? 'Lütfen bir etiket girin.' : 'Please enter a label.'}</span> : null}
            </label>

            <ShippingFields value={editing} onChange={(next) => { setEditing({ ...editing, ...next }); setErrors({}) }} errors={errors} lang={lang} />

            <div className="mt-6 flex flex-wrap gap-3">
              <button type="button" onClick={saveEditing} className="inline-flex items-center gap-2 rounded-md bg-primary px-5 py-3 font-sans text-xs font-medium uppercase tracking-wider text-primary-foreground transition-colors hover:bg-primary/90">
                <Check className="size-4" /> {tr ? 'Kaydet' : 'Save'}
              </button>
              <button type="button" onClick={cancelEdit} className="rounded-md border border-border px-5 py-3 font-sans text-xs uppercase tracking-wider text-foreground transition-colors hover:border-primary hover:text-primary">
                {tr ? 'Vazgeç' : 'Cancel'}
              </button>
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={startAdd}
            className="mt-4 inline-flex items-center gap-2 rounded-md border border-dashed border-primary/50 px-5 py-3 font-sans text-xs font-medium uppercase tracking-wider text-primary transition-colors hover:bg-primary/5"
          >
            <Plus className="size-4" /> {tr ? 'Yeni adres ekle' : 'Add new address'}
          </button>
        )}

        {savedFlash ? <p className="mt-4 inline-flex items-center gap-1.5 font-sans text-sm text-primary"><Check className="size-4" /> {tr ? 'Kaydedildi' : 'Saved'}</p> : null}

        <div className="mt-10">
          <Link href="/settings" className="font-sans text-xs uppercase tracking-wider text-muted-foreground hover:text-primary">{tr ? '← Hesabıma dön' : '← Back to account'}</Link>
        </div>
      </section>
      <SiteFooter />
    </main>
  )
}
