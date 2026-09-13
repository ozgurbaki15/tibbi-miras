'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Truck, MapPin, ChevronRight } from 'lucide-react'
import { useLanguage } from '@/components/language-provider'
import { loadAddresses, type ShippingAddress } from '@/lib/shipping'

export function AccountShipping() {
  const { lang } = useLanguage()
  const tr = lang === 'tr'
  const [addresses, setAddresses] = useState<ShippingAddress[]>([])

  useEffect(() => {
    setAddresses(loadAddresses())
  }, [])

  return (
    <section className="overflow-hidden rounded-md border border-border bg-card">
      <div className="flex items-center gap-3 border-b border-border p-6">
        <span className="flex size-11 shrink-0 items-center justify-center rounded-full border border-primary/40 bg-background/70">
          <Truck className="size-5 text-primary" aria-hidden="true" />
        </span>
        <div>
          <h2 className="font-serif text-2xl text-card-foreground">{tr ? 'Kargo Bilgilerim' : 'Shipping Details'}</h2>
          <p className="mt-0.5 font-sans text-xs text-muted-foreground">{tr ? 'Birden fazla adres kaydedebilirsiniz (Ev, İşyeri…).' : 'Save multiple addresses (Home, Work…).'}</p>
        </div>
      </div>

      <div className="p-6">
        {addresses.length === 0 ? (
          <p className="mb-4 font-sans text-sm text-muted-foreground">{tr ? 'Henüz kayıtlı adresiniz yok. Sipariş verebilmek için en az bir adres ekleyin.' : 'No saved addresses yet. Add at least one to place orders.'}</p>
        ) : (
          <ul className="mb-4 flex flex-col gap-2">
            {addresses.map((addr) => (
              <li key={addr.id} className="flex items-start gap-2.5 rounded-md border border-border bg-background/50 p-3">
                <MapPin className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
                <div className="min-w-0">
                  <p className="font-sans text-sm font-medium text-card-foreground">{addr.label || (tr ? 'Adres' : 'Address')}</p>
                  <p className="truncate font-sans text-xs text-muted-foreground">{addr.fullName} · {addr.city}{addr.district ? ` / ${addr.district}` : ''}</p>
                </div>
              </li>
            ))}
          </ul>
        )}
        <Link
          href="/adreslerim"
          className="inline-flex items-center gap-1.5 rounded-md bg-primary px-5 py-3 font-sans text-xs font-medium uppercase tracking-wider text-primary-foreground transition-colors hover:bg-primary/90"
        >
          {addresses.length === 0 ? (tr ? 'Adres ekle' : 'Add address') : (tr ? 'Adreslerimi yönet' : 'Manage addresses')}
          <ChevronRight className="size-4" aria-hidden="true" />
        </Link>
      </div>
    </section>
  )
}
