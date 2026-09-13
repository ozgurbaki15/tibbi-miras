'use client'

import { Suspense } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { ShoppingCart } from 'lucide-react'
import { ArchiveHeader } from '@/components/archive-header'
import { ArchiveNavigation } from '@/components/archive-navigation'
import { SiteFooter } from '@/components/site-footer'
import { CheckoutButton } from '@/components/checkout-button'
import { useLanguage } from '@/components/language-provider'
import { useAuth } from '@/components/auth-provider'
import { getProduct, priceLabel, type Product } from '@/lib/products'

function periodLabel(product: Product, tr: boolean): string {
  if (product.kind === 'subscription') return product.durationDays === 365 ? (tr ? 'Yıllık abonelik' : 'Yearly subscription') : (tr ? 'Aylık abonelik' : 'Monthly subscription')
  return tr ? 'Tek seferlik ödeme' : 'One-time payment'
}

function OrderSummary() {
  const { lang } = useLanguage()
  const { user } = useAuth()
  const tr = lang === 'tr'
  const params = useSearchParams()
  const product = getProduct(params.get('plan') ?? '')

  if (!product) {
    return (
      <div className="rounded-xl border border-border bg-card/60 p-8 text-center">
        <p className="font-sans text-sm text-muted-foreground">{tr ? 'Geçersiz veya seçilmemiş plan.' : 'Invalid or missing plan.'}</p>
        <Link href="/uyelikler" className="mt-4 inline-block rounded-md bg-primary px-4 py-2 font-sans text-xs uppercase tracking-wider text-primary-foreground">{tr ? 'Planlara dön' : 'Back to plans'}</Link>
      </div>
    )
  }

  // Displayed VAT breakdown (prices are VAT-inclusive; 20% Turkish KDV).
  const total = product.amountKurus
  const net = Math.round(total / 1.2)
  const vat = total - net

  return (
    <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
      <div className="rounded-xl border border-border bg-card/70 p-6">
        <div className="mb-5 flex items-center gap-2">
          <ShoppingCart className="size-5 text-primary" aria-hidden="true" />
          <h2 className="font-serif text-2xl text-foreground">{tr ? 'Sepet' : 'Cart'}</h2>
        </div>
        <div className="flex items-start justify-between gap-4 border-b border-border pb-4">
          <div>
            <p className="font-serif text-lg text-card-foreground">{tr ? product.name : product.nameEn}</p>
            <p className="mt-1 font-sans text-xs uppercase tracking-wider text-muted-foreground">{periodLabel(product, tr)}</p>
            <p className="mt-2 font-sans text-sm leading-relaxed text-muted-foreground">{tr ? product.description : product.descriptionEn}</p>
          </div>
          <p className="shrink-0 font-sans text-lg font-semibold text-foreground">{priceLabel(total, lang)}</p>
        </div>
        <dl className="mt-4 space-y-2 font-sans text-sm">
          <div className="flex justify-between text-muted-foreground"><dt>{tr ? 'Ara toplam' : 'Subtotal'}</dt><dd>{priceLabel(net, lang)}</dd></div>
          <div className="flex justify-between text-muted-foreground"><dt>{tr ? 'KDV (%20)' : 'VAT (20%)'}</dt><dd>{priceLabel(vat, lang)}</dd></div>
          <div className="flex justify-between border-t border-border pt-2 text-base font-semibold text-foreground"><dt>{tr ? 'Toplam' : 'Total'}</dt><dd>{priceLabel(total, lang)}</dd></div>
        </dl>
      </div>

      <div className="flex flex-col gap-4 rounded-xl border border-primary/40 bg-accent/10 p-6">
        <h2 className="font-serif text-xl text-foreground">{tr ? 'Ödeme' : 'Checkout'}</h2>
        {user ? (
          <p className="font-sans text-xs text-muted-foreground">{tr ? 'Hesap: ' : 'Account: '}<span className="text-foreground">{user.email}</span></p>
        ) : (
          <p className="rounded-md border border-border bg-background/60 p-3 font-sans text-xs leading-relaxed text-muted-foreground">
            {tr ? 'Ödeme yapmak için önce giriş yapmanız gerekir.' : 'You must sign in before paying.'}
          </p>
        )}
        {user ? (
          <CheckoutButton productId={product.id} label={tr ? `Öde · ${priceLabel(total, lang)}` : `Pay · ${priceLabel(total, lang)}`} />
        ) : (
          <Link href="/login" className="rounded-md bg-primary px-4 py-3 text-center font-sans text-xs uppercase tracking-wider text-primary-foreground hover:opacity-90">{tr ? 'Giriş yap' : 'Sign in'}</Link>
        )}
        <p className="font-sans text-[11px] leading-relaxed text-muted-foreground">
          {tr ? 'Ödemeye devam ederek ' : 'By continuing you accept the '}
          <Link href="/legal/mesafeli-satis" className="text-primary hover:underline">{tr ? 'Mesafeli Satış Sözleşmesi' : 'Distance Sales Agreement'}</Link>
          {tr ? ' ve ' : ' and '}
          <Link href="/legal/iade-iptal" className="text-primary hover:underline">{tr ? 'İptal/İade Koşulları' : 'Refund Policy'}</Link>
          {tr ? '’nı kabul etmiş olursunuz.' : '.'}
        </p>
        <Link href="/uyelikler" className="text-center font-sans text-xs uppercase tracking-wider text-muted-foreground hover:text-primary">{tr ? 'Planlara geri dön' : 'Back to plans'}</Link>
      </div>
    </div>
  )
}

export default function CheckoutPage() {
  return (
    <main className="min-h-svh bg-background">
      <ArchiveHeader />
      <ArchiveNavigation />
      <section className="mx-auto max-w-4xl px-6 py-14">
        <h1 className="mb-8 font-serif text-4xl text-foreground">Ödeme / Checkout</h1>
        <Suspense fallback={<p className="font-sans text-sm text-muted-foreground">Yükleniyor…</p>}>
          <OrderSummary />
        </Suspense>
      </section>
      <SiteFooter />
    </main>
  )
}
