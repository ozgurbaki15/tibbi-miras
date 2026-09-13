'use client'

import Link from 'next/link'
import { Minus, Plus, ShoppingCart, Trash2 } from 'lucide-react'
import { ArchiveHeader } from '@/components/archive-header'
import { ArchiveNavigation } from '@/components/archive-navigation'
import { SiteFooter } from '@/components/site-footer'
import { useCart } from '@/components/cart-provider'
import { useLanguage } from '@/components/language-provider'
import { getShopProduct, shopPriceLabel } from '@/lib/shop'

const VAT_RATE = 0.2

export default function SepetPage() {
  const { lang } = useLanguage()
  const { items, count, subtotalKurus, setQuantity, remove } = useCart()

  // Prices are VAT-inclusive; break the total down for display.
  const netKurus = Math.round(subtotalKurus / (1 + VAT_RATE))
  const vatKurus = subtotalKurus - netKurus

  const t = lang === 'tr'
    ? {
        eyebrow: 'Sipariş özeti',
        title: 'Sepetim',
        empty: 'Sepetiniz boş.',
        toStore: 'Mağazaya git',
        product: 'Ürün',
        subtotal: 'Ara toplam (KDV hariç)',
        vat: 'KDV (%20)',
        total: 'Genel toplam',
        pay: 'Ödemeye geç',
        note: 'Fiyatlara KDV dahildir. Ödeme güvenli altyapı üzerinden alınır.',
        remove: 'Kaldır',
      }
    : {
        eyebrow: 'Order summary',
        title: 'My Cart',
        empty: 'Your cart is empty.',
        toStore: 'Go to store',
        product: 'Product',
        subtotal: 'Subtotal (excl. VAT)',
        vat: 'VAT (20%)',
        total: 'Grand total',
        pay: 'Proceed to payment',
        note: 'Prices include VAT. Payment is collected via secure infrastructure.',
        remove: 'Remove',
      }

  return (
    <main className="min-h-svh bg-background">
      <ArchiveHeader />
      <ArchiveNavigation />
      <section className="mx-auto max-w-4xl px-6 py-14">
        <p className="mb-2 font-sans text-xs uppercase tracking-[0.25em] text-primary">{t.eyebrow}</p>
        <div className="mb-10 flex items-center gap-3">
          <ShoppingCart className="size-8 text-primary" aria-hidden="true" />
          <h1 className="font-serif text-4xl text-foreground md:text-5xl">{t.title}</h1>
        </div>

        {count === 0 ? (
          <div className="rounded-md border border-dashed border-border py-16 text-center">
            <p className="font-serif text-lg text-muted-foreground">{t.empty}</p>
            <Link href="/magaza" className="mt-6 inline-flex items-center gap-2 rounded-md bg-primary px-6 py-3 font-sans text-sm font-medium uppercase tracking-wider text-primary-foreground transition-colors hover:bg-primary/90">
              {t.toStore}
            </Link>
          </div>
        ) : (
          <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
            <ul className="flex flex-col gap-4">
              {items.map((item) => {
                const product = getShopProduct(item.id)
                if (!product) return null
                const name = lang === 'tr' ? product.name : product.nameEn
                return (
                  <li key={item.id} className="flex gap-4 rounded-md border border-border bg-card p-4">
                    <img src={product.image || '/placeholder.svg'} alt={name} className="size-20 shrink-0 rounded object-cover" />
                    <div className="flex flex-1 flex-col gap-2">
                      <h2 className="text-pretty font-serif text-base font-semibold leading-tight text-card-foreground">{name}</h2>
                      <span className="font-sans text-sm text-muted-foreground">{shopPriceLabel(product.priceKurus, lang)}</span>
                      <div className="mt-auto flex items-center justify-between gap-3">
                        <div className="inline-flex items-center rounded-md border border-border">
                          <button type="button" aria-label="Azalt" onClick={() => setQuantity(item.id, item.quantity - 1)} className="flex size-9 items-center justify-center text-foreground hover:text-primary">
                            <Minus className="size-4" />
                          </button>
                          <span className="w-8 text-center font-mono text-sm text-foreground">{item.quantity}</span>
                          <button type="button" aria-label="Artır" onClick={() => setQuantity(item.id, item.quantity + 1)} className="flex size-9 items-center justify-center text-foreground hover:text-primary">
                            <Plus className="size-4" />
                          </button>
                        </div>
                        <button type="button" onClick={() => remove(item.id)} className="inline-flex items-center gap-1.5 font-sans text-xs uppercase tracking-wider text-muted-foreground hover:text-destructive">
                          <Trash2 className="size-4" />
                          {t.remove}
                        </button>
                      </div>
                    </div>
                    <span className="shrink-0 self-start font-serif text-lg font-semibold text-foreground">{shopPriceLabel(product.priceKurus * item.quantity, lang)}</span>
                  </li>
                )
              })}
            </ul>

            <aside className="h-fit rounded-md border border-border bg-card p-6">
              <dl className="flex flex-col gap-3 font-sans text-sm">
                <div className="flex items-center justify-between text-muted-foreground">
                  <dt>{t.subtotal}</dt>
                  <dd>{shopPriceLabel(netKurus, lang)}</dd>
                </div>
                <div className="flex items-center justify-between text-muted-foreground">
                  <dt>{t.vat}</dt>
                  <dd>{shopPriceLabel(vatKurus, lang)}</dd>
                </div>
                <div className="mt-2 flex items-center justify-between border-t border-border pt-3 font-serif text-lg font-semibold text-foreground">
                  <dt>{t.total}</dt>
                  <dd>{shopPriceLabel(subtotalKurus, lang)}</dd>
                </div>
              </dl>
              <button type="button" className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-md bg-primary px-6 py-3 font-sans text-sm font-medium uppercase tracking-wider text-primary-foreground transition-colors hover:bg-primary/90">
                {t.pay}
              </button>
              <p className="mt-4 font-sans text-xs leading-relaxed text-muted-foreground">{t.note}</p>
            </aside>
          </div>
        )}
      </section>
      <SiteFooter />
    </main>
  )
}
