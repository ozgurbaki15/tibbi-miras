'use client'

import { useEffect, useState } from 'react'
import { Truck, Check } from 'lucide-react'
import { useLanguage } from '@/components/language-provider'
import { ShippingFields } from '@/components/shipping-fields'
import { EMPTY_SHIPPING, loadShipping, saveShipping, shippingErrors, type ShippingInfo } from '@/lib/shipping'

export function AccountShipping() {
  const { lang } = useLanguage()
  const tr = lang === 'tr'
  const [info, setInfo] = useState<ShippingInfo>(EMPTY_SHIPPING)
  const [errors, setErrors] = useState<Partial<Record<keyof ShippingInfo, boolean>>>({})
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    setInfo(loadShipping())
  }, [])

  const handleSave = () => {
    const nextErrors = shippingErrors(info)
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) {
      setSaved(false)
      return
    }
    saveShipping(info)
    setSaved(true)
    window.setTimeout(() => setSaved(false), 2500)
  }

  return (
    <section className="overflow-hidden rounded-md border border-border bg-card">
      <div className="flex items-center gap-3 border-b border-border p-6">
        <span className="flex size-11 shrink-0 items-center justify-center rounded-full border border-primary/40 bg-background/70">
          <Truck className="size-5 text-primary" aria-hidden="true" />
        </span>
        <div>
          <h2 className="font-serif text-2xl text-card-foreground">{tr ? 'Kargo Bilgilerim' : 'Shipping Details'}</h2>
          <p className="mt-0.5 font-sans text-xs text-muted-foreground">{tr ? 'Fiziksel ürün siparişleri bu bilgilerle gönderilir.' : 'Physical product orders are shipped using these details.'}</p>
        </div>
      </div>

      <div className="p-6">
        <ShippingFields value={info} onChange={(next) => { setInfo(next); setErrors({}) }} errors={errors} lang={lang} />
        <div className="mt-6 flex flex-wrap items-center gap-4">
          <button
            type="button"
            onClick={handleSave}
            className="inline-flex items-center gap-2 rounded-md bg-primary px-5 py-3 font-sans text-xs font-medium uppercase tracking-wider text-primary-foreground transition-colors hover:bg-primary/90"
          >
            {tr ? 'Bilgileri kaydet' : 'Save details'}
          </button>
          {saved ? (
            <span className="inline-flex items-center gap-1.5 font-sans text-sm text-primary">
              <Check className="size-4" aria-hidden="true" />
              {tr ? 'Kaydedildi' : 'Saved'}
            </span>
          ) : null}
        </div>
      </div>
    </section>
  )
}
