'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { Minus, Plus, ShoppingCart, Trash2, Truck, PackageCheck, X } from 'lucide-react'
import { ArchiveHeader } from '@/components/archive-header'
import { ArchiveNavigation } from '@/components/archive-navigation'
import { SiteFooter } from '@/components/site-footer'
import { useCart } from '@/components/cart-provider'
import { useLanguage } from '@/components/language-provider'
import { getShopProduct, shopPriceLabel } from '@/lib/shop'
import { ShippingFields } from '@/components/shipping-fields'
import { EMPTY_SHIPPING, loadShipping, saveShipping, shippingErrors, type ShippingInfo } from '@/lib/shipping'

const VAT_RATE = 0.2
const SHIPPING_FEE_KURUS = 25000 // 250 TL
const HIDE_COD_NOTICE_KEY = 'tma-hide-cod-notice'

type CargoOption = 'cod' | 'prepaid'

export default function SepetPage() {
  const { lang } = useLanguage()
  const { items, count, subtotalKurus, setQuantity, remove } = useCart()
  const tr = lang === 'tr'

  const [shipping, setShipping] = useState<ShippingInfo>(EMPTY_SHIPPING)
  const [shippingErrs, setShippingErrs] = useState<Partial<Record<keyof ShippingInfo, boolean>>>({})
  const [cargoOption, setCargoOption] = useState<CargoOption | null>(null)
  const [cargoError, setCargoError] = useState(false)
  const [codNoticeOpen, setCodNoticeOpen] = useState(false)
  const formRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setShipping(loadShipping())
  }, [])

  const shippingFeeKurus = cargoOption === 'prepaid' ? SHIPPING_FEE_KURUS : 0
  const grandTotalKurus = subtotalKurus + shippingFeeKurus

  // Product prices are VAT-inclusive; break the product subtotal down for display.
  const netKurus = Math.round(subtotalKurus / (1 + VAT_RATE))
  const vatKurus = subtotalKurus - netKurus

  const selectCargo = (option: CargoOption) => {
    setCargoOption(option)
    setCargoError(false)
    if (option === 'cod') {
      const hidden = typeof window !== 'undefined' && window.localStorage.getItem(HIDE_COD_NOTICE_KEY) === '1'
      if (!hidden) setCodNoticeOpen(true)
    }
  }

  const closeCodNotice = (dontShowAgain: boolean) => {
    if (dontShowAgain && typeof window !== 'undefined') {
      window.localStorage.setItem(HIDE_COD_NOTICE_KEY, '1')
    }
    setCodNoticeOpen(false)
  }

  const handlePay = () => {
    const errs = shippingErrors(shipping)
    setShippingErrs(errs)
    const noCargo = cargoOption === null
    setCargoError(noCargo)
    if (Object.keys(errs).length > 0 || noCargo) {
      formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      return
    }
    saveShipping(shipping)
    // Payment infrastructure is wired separately; persist details and proceed.
    window.location.href = '/odeme'
  }

  const t = tr
    ? {
        eyebrow: 'Sipariş özeti',
        title: 'Sepetim',
        empty: 'Sepetiniz boş.',
        toStore: 'Mağazaya git',
        subtotal: 'Ara toplam (KDV hariç)',
        vat: 'KDV (%20)',
        shipping: 'Kargo',
        shippingCod: 'Kapıda ödenir',
        total: 'Genel toplam',
        pay: 'Ödemeye geç',
        note: 'Ürün fiyatlarına KDV dahildir. Ürün ücreti internet üzerinden güvenli altyapı ile alınır.',
        remove: 'Kaldır',
        deliveryTitle: 'Teslimat Bilgileri',
        cargoTitle: 'Kargo Ücreti',
        cargoHint: 'Kargo ücretini nasıl ödemek istersiniz?',
        codLabel: 'Kapıda ödeme',
        codDesc: 'Kargo ücretini teslimatta kargo firmasına ödersiniz.',
        prepaidLabel: 'Kargo ücretini şimdi ödeyeceğim',
        prepaidDesc: '250 TL kargo ücreti sepete eklenir.',
        cargoRequired: 'Lütfen bir kargo ödeme seçeneği seçin.',
        codNotice:
          'Kapıda ödeme seçeneği sadece kargo ücreti hakkındadır. Ürün ücreti internet üzerinden alınır. Kargo firmasının yansıtacağı fiyat bizim bilgimiz ve kontrolümüz dahilinde değildir.',
        ok: 'Tamam',
        dontShow: 'Bir daha gösterme',
        noticeTitle: 'Kapıda Ödeme Hakkında',
      }
    : {
        eyebrow: 'Order summary',
        title: 'My Cart',
        empty: 'Your cart is empty.',
        toStore: 'Go to store',
        subtotal: 'Subtotal (excl. VAT)',
        vat: 'VAT (20%)',
        shipping: 'Shipping',
        shippingCod: 'Paid on delivery',
        total: 'Grand total',
        pay: 'Proceed to payment',
        note: 'Product prices include VAT. The product fee is collected online via secure infrastructure.',
        remove: 'Remove',
        deliveryTitle: 'Delivery Details',
        cargoTitle: 'Shipping Fee',
        cargoHint: 'How would you like to pay the shipping fee?',
        codLabel: 'Cash on delivery',
        codDesc: 'You pay the shipping fee to the courier upon delivery.',
        prepaidLabel: 'I will pay the shipping fee now',
        prepaidDesc: 'A 250 TL shipping fee is added to the cart.',
        cargoRequired: 'Please choose a shipping payment option.',
        codNotice:
          'Cash on delivery applies only to the shipping fee. The product fee is collected online. The price charged by the courier is beyond our knowledge and control.',
        ok: 'OK',
        dontShow: "Don't show again",
        noticeTitle: 'About Cash on Delivery',
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
            <div className="flex flex-col gap-8">
              <ul className="flex flex-col gap-4">
                {items.map((item) => {
                  const product = getShopProduct(item.id)
                  if (!product) return null
                  const name = tr ? product.name : product.nameEn
                  return (
                    <li key={item.id} className="flex gap-4 rounded-md border border-border bg-card p-4">
                      <img src={product.image || '/placeholder.svg'} alt={name} className="size-20 shrink-0 rounded object-cover" />
                      <div className="flex flex-1 flex-col gap-2">
                        <h2 className="text-pretty font-serif text-base font-semibold leading-tight text-card-foreground">{name}</h2>
                        <span className="font-sans text-sm text-muted-foreground">{shopPriceLabel(product.priceKurus, lang)}</span>
                        <div className="mt-auto flex items-center justify-between gap-3">
                          <div className="inline-flex items-center rounded-md border border-border">
                            <button type="button" aria-label={tr ? 'Azalt' : 'Decrease'} onClick={() => setQuantity(item.id, item.quantity - 1)} className="flex size-9 items-center justify-center text-foreground hover:text-primary">
                              <Minus className="size-4" />
                            </button>
                            <span className="w-8 text-center font-mono text-sm text-foreground">{item.quantity}</span>
                            <button type="button" aria-label={tr ? 'Artır' : 'Increase'} onClick={() => setQuantity(item.id, item.quantity + 1)} className="flex size-9 items-center justify-center text-foreground hover:text-primary">
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

              <div ref={formRef} className="rounded-md border border-border bg-card p-6">
                <div className="mb-5 flex items-center gap-2.5">
                  <Truck className="size-5 text-primary" aria-hidden="true" />
                  <h2 className="font-serif text-xl text-card-foreground">{t.deliveryTitle}</h2>
                </div>
                <ShippingFields value={shipping} onChange={(next) => { setShipping(next); setShippingErrs({}) }} errors={shippingErrs} lang={lang} />
              </div>

              <div className="rounded-md border border-border bg-card p-6">
                <div className="mb-1 flex items-center gap-2.5">
                  <PackageCheck className="size-5 text-primary" aria-hidden="true" />
                  <h2 className="font-serif text-xl text-card-foreground">{t.cargoTitle}</h2>
                </div>
                <p className="mb-4 font-sans text-sm text-muted-foreground">{t.cargoHint}</p>
                <div className="flex flex-col gap-3">
                  {(['cod', 'prepaid'] as CargoOption[]).map((option) => {
                    const active = cargoOption === option
                    return (
                      <button
                        key={option}
                        type="button"
                        onClick={() => selectCargo(option)}
                        className={`flex items-start gap-3 rounded-md border p-4 text-left transition-colors ${active ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'}`}
                      >
                        <span className={`mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full border ${active ? 'border-primary' : 'border-muted-foreground'}`}>
                          {active ? <span className="size-2.5 rounded-full bg-primary" /> : null}
                        </span>
                        <span className="flex flex-col gap-0.5">
                          <span className="font-sans text-sm font-medium text-card-foreground">{option === 'cod' ? t.codLabel : t.prepaidLabel}</span>
                          <span className="font-sans text-xs text-muted-foreground">{option === 'cod' ? t.codDesc : t.prepaidDesc}</span>
                        </span>
                      </button>
                    )
                  })}
                </div>
                {cargoError ? <p className="mt-3 font-sans text-xs text-destructive">{t.cargoRequired}</p> : null}
              </div>
            </div>

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
                <div className="flex items-center justify-between text-muted-foreground">
                  <dt>{t.shipping}</dt>
                  <dd>{cargoOption === 'prepaid' ? shopPriceLabel(SHIPPING_FEE_KURUS, lang) : cargoOption === 'cod' ? t.shippingCod : '—'}</dd>
                </div>
                <div className="mt-2 flex items-center justify-between border-t border-border pt-3 font-serif text-lg font-semibold text-foreground">
                  <dt>{t.total}</dt>
                  <dd>{shopPriceLabel(grandTotalKurus, lang)}</dd>
                </div>
              </dl>
              <button type="button" onClick={handlePay} className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-md bg-primary px-6 py-3 font-sans text-sm font-medium uppercase tracking-wider text-primary-foreground transition-colors hover:bg-primary/90">
                {t.pay}
              </button>
              <p className="mt-4 font-sans text-xs leading-relaxed text-muted-foreground">{t.note}</p>
            </aside>
          </div>
        )}
      </section>
      <SiteFooter />

      {codNoticeOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-foreground/50" onClick={() => closeCodNotice(false)} aria-hidden="true" />
          <div role="dialog" aria-modal="true" aria-label={t.noticeTitle} className="relative w-full max-w-md rounded-md border border-border bg-card p-6 shadow-lg">
            <button type="button" onClick={() => closeCodNotice(false)} aria-label={tr ? 'Kapat' : 'Close'} className="absolute right-4 top-4 text-muted-foreground hover:text-foreground">
              <X className="size-5" />
            </button>
            <h3 className="mb-3 pr-6 font-serif text-xl text-card-foreground">{t.noticeTitle}</h3>
            <p className="font-sans text-sm leading-relaxed text-muted-foreground">{t.codNotice}</p>
            <div className="mt-6 flex flex-col gap-3">
              <button type="button" onClick={() => closeCodNotice(false)} className="inline-flex w-full items-center justify-center rounded-md bg-primary px-6 py-3 font-sans text-sm font-medium uppercase tracking-wider text-primary-foreground transition-colors hover:bg-primary/90">
                {t.ok}
              </button>
              <button type="button" onClick={() => closeCodNotice(true)} className="font-sans text-xs uppercase tracking-wider text-muted-foreground underline-offset-4 hover:text-foreground hover:underline">
                {t.dontShow}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </main>
  )
}
