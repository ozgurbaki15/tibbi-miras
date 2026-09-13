'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { Minus, Plus, ShoppingCart, Trash2, Truck, PackageCheck, MapPin } from 'lucide-react'
import { ArchiveHeader } from '@/components/archive-header'
import { ArchiveNavigation } from '@/components/archive-navigation'
import { SiteFooter } from '@/components/site-footer'
import { useCart } from '@/components/cart-provider'
import { useLanguage } from '@/components/language-provider'
import { shopPriceLabel } from '@/lib/shop'
import { useProducts } from '@/components/products-provider'
import { loadAddresses, getSelectedAddressId, setSelectedAddressId, isShippingComplete, type ShippingAddress } from '@/lib/shipping'
import { createShopOrder } from '@/app/actions/orders'

const VAT_RATE = 0.2
const SHIPPING_FEE_KURUS = 25000 // 250 TL
const FREE_SHIPPING_THRESHOLD_KURUS = 300000

export default function SepetPage() {
  const { lang } = useLanguage()
  const { items, count, subtotalKurus, setQuantity, remove } = useCart()
  const { getProduct } = useProducts()
  const tr = lang === 'tr'

  const [addresses, setAddresses] = useState<ShippingAddress[]>([])
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [addressError, setAddressError] = useState(false)
  const formRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const list = loadAddresses()
    setAddresses(list)
    const preferred = getSelectedAddressId()
    const initial = list.find((a) => a.id === preferred) ?? list[0]
    if (initial) setSelectedId(initial.id)
  }, [])

  const selectedAddress = addresses.find((a) => a.id === selectedId) ?? null

  const shippingFeeKurus = subtotalKurus >= FREE_SHIPPING_THRESHOLD_KURUS ? 0 : SHIPPING_FEE_KURUS
  const grandTotalKurus = subtotalKurus + shippingFeeKurus

  // Product prices are VAT-inclusive; break the product subtotal down for display.
  const netKurus = Math.round(subtotalKurus / (1 + VAT_RATE))
  const vatKurus = subtotalKurus - netKurus

  const selectAddress = (id: string) => {
    setSelectedId(id)
    setSelectedAddressId(id)
    setAddressError(false)
  }

  const handlePay = async () => {
    const noAddress = !selectedAddress || !isShippingComplete(selectedAddress)
    setAddressError(noAddress)
    if (noAddress || !selectedAddress) {
      formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      return
    }
    if (selectedAddress) setSelectedAddressId(selectedAddress.id)
    const result = await createShopOrder(items.map((item) => ({ id: item.id, quantity: item.quantity })), selectedAddress)
    if (!result.ok) {
      window.alert(tr ? 'Sipariş oluşturulamadı. Lütfen sepetinizi ve adresinizi kontrol edin.' : 'The order could not be created. Please check your cart and address.')
      return
    }
    window.location.href = `/odeme?order=${encodeURIComponent(result.orderId)}`
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
        shippingFree: 'Ücretsiz',
        total: 'Genel toplam',
        pay: 'Ödemeye geç',
        note: 'Ürün fiyatlarına KDV dahildir. Ödeme yalnızca güvenli online ödeme ile alınır.',
        remove: 'Kaldır',
        deliveryTitle: 'Teslimat Bilgileri',
        chooseAddress: 'Kayıtlı adreslerinizden birini seçin:',
        noAddress: 'Kayıtlı adresiniz yok. Sipariş verebilmek için önce bir adres ekleyin.',
        addAddress: 'Adres ekle',
        manageAddresses: 'Adreslerimi yönet',
        addressRequired: 'Lütfen bir teslimat adresi seçin.',
        cargoTitle: 'Kargo Ücreti',
        cargoHint: '3.000 TL ve üzeri alışverişlerde kargo ücretsizdir.',
      }
    : {
        eyebrow: 'Order summary',
        title: 'My Cart',
        empty: 'Your cart is empty.',
        toStore: 'Go to store',
        subtotal: 'Subtotal (excl. VAT)',
        vat: 'VAT (20%)',
        shipping: 'Shipping',
        shippingFree: 'Free',
        total: 'Grand total',
        pay: 'Proceed to payment',
        note: 'Product prices include VAT. Payment is collected securely online only.',
        remove: 'Remove',
        deliveryTitle: 'Delivery Details',
        chooseAddress: 'Choose one of your saved addresses:',
        noAddress: 'You have no saved address. Add one before placing an order.',
        addAddress: 'Add address',
        manageAddresses: 'Manage addresses',
        addressRequired: 'Please select a delivery address.',
        cargoTitle: 'Shipping Fee',
        cargoHint: 'Shipping is free for orders of 3,000 TL or more.',
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
                  const product = getProduct(item.id)
                  if (!product) return null
                  const name = tr ? product.name : product.nameEn || product.name
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

                {addresses.length === 0 ? (
                  <div className="rounded-md border border-dashed border-border p-6 text-center">
                    <p className="mb-4 font-sans text-sm text-muted-foreground">{t.noAddress}</p>
                    <Link href="/adreslerim" className="inline-flex items-center gap-1.5 rounded-md bg-primary px-5 py-3 font-sans text-xs font-medium uppercase tracking-wider text-primary-foreground transition-colors hover:bg-primary/90">
                      <MapPin className="size-4" /> {t.addAddress}
                    </Link>
                  </div>
                ) : (
                  <>
                    <p className="mb-3 font-sans text-sm text-muted-foreground">{t.chooseAddress}</p>
                    <div className="flex flex-col gap-3">
                      {addresses.map((addr) => {
                        const active = selectedId === addr.id
                        return (
                          <button
                            key={addr.id}
                            type="button"
                            onClick={() => selectAddress(addr.id)}
                            className={`flex items-start gap-3 rounded-md border p-4 text-left transition-colors ${active ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'}`}
                          >
                            <span className={`mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full border ${active ? 'border-primary' : 'border-muted-foreground'}`}>
                              {active ? <span className="size-2.5 rounded-full bg-primary" /> : null}
                            </span>
                            <span className="flex min-w-0 flex-col gap-0.5">
                              <span className="font-sans text-sm font-medium text-card-foreground">{addr.label || (tr ? 'Adres' : 'Address')}</span>
                              <span className="font-sans text-xs text-muted-foreground">{addr.fullName} · {addr.phone}</span>
                              <span className="font-sans text-xs text-muted-foreground">{addr.address}, {addr.district} / {addr.city} {addr.postalCode}</span>
                            </span>
                          </button>
                        )
                      })}
                    </div>
                    {addressError ? <p className="mt-3 font-sans text-xs text-destructive">{t.addressRequired}</p> : null}
                    <Link href="/adreslerim" className="mt-4 inline-flex items-center gap-1.5 font-sans text-xs uppercase tracking-wider text-primary hover:underline">
                      <MapPin className="size-3.5" /> {t.manageAddresses}
                    </Link>
                  </>
                )}
              </div>

              <div className="rounded-md border border-border bg-card p-6">
                <div className="flex items-center gap-2.5">
                  <PackageCheck className="size-5 text-primary" aria-hidden="true" />
                  <h2 className="font-serif text-xl text-card-foreground">{t.cargoTitle}</h2>
                </div>
                <p className="mt-2 font-sans text-sm leading-relaxed text-muted-foreground">
                  {subtotalKurus >= FREE_SHIPPING_THRESHOLD_KURUS
                    ? (tr ? '3.000 TL ve üzeri alışverişlerde kargo ücretsizdir.' : 'Shipping is free for orders of 3,000 TL or more.')
                    : (tr ? `3.000 TL üzeri alışverişlerde kargo ücretsizdir. Mevcut kargo: ${shopPriceLabel(SHIPPING_FEE_KURUS, lang)}.` : `Shipping is free for orders of 3,000 TL or more. Current shipping: ${shopPriceLabel(SHIPPING_FEE_KURUS, lang)}.`)}
                </p>
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
                  <dd>{shippingFeeKurus === 0 ? t.shippingFree : shopPriceLabel(shippingFeeKurus, lang)}</dd>
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

    </main>
  )
}
