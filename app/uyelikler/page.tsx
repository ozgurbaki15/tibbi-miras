'use client'

import Link from 'next/link'
import { Crown, ShieldCheck, FileText } from 'lucide-react'
import { ArchiveHeader } from '@/components/archive-header'
import { ArchiveNavigation } from '@/components/archive-navigation'
import { SiteFooter } from '@/components/site-footer'
import { useLanguage } from '@/components/language-provider'
import { PRODUCTS, priceLabel, type Product } from '@/lib/products'

function periodLabel(product: Product, tr: boolean): string {
  if (product.kind === 'subscription') return product.durationDays === 365 ? (tr ? '/ yıl' : '/ year') : (tr ? '/ ay' : '/ month')
  if (product.id === 'platin-lifetime-upgrade') return tr ? 'sadece fark' : 'difference only'
  return tr ? 'tek ödeme' : 'one-time'
}

function StoreCard({ product, highlight }: { product: Product; highlight?: boolean }) {
  const { lang } = useLanguage()
  const tr = lang === 'tr'
  const Icon = product.kind === 'single' ? FileText : product.tier === 'platin' ? ShieldCheck : Crown
  return (
    <div className={`flex flex-col gap-3 rounded-xl border p-6 ${highlight ? 'border-primary bg-accent/15 shadow-lg shadow-primary/10' : 'border-border bg-card/70'}`}>
      <div className="flex items-center gap-2">
        <Icon className="size-5 text-primary" aria-hidden="true" />
        <h3 className="font-serif text-xl text-card-foreground">{tr ? product.name : product.nameEn}</h3>
      </div>
      <p className="font-sans text-3xl font-semibold text-foreground">
        {priceLabel(product.amountKurus, lang)}
        <span className="ml-1 font-sans text-xs font-normal uppercase tracking-wider text-muted-foreground">{periodLabel(product, tr)}</span>
      </p>
      <p className="flex-1 font-sans text-sm leading-relaxed text-muted-foreground">{tr ? product.description : product.descriptionEn}</p>
      <Link
        href={`/odeme?plan=${product.id}`}
        className={`mt-2 rounded-md px-4 py-2 text-center font-sans text-xs uppercase tracking-wider transition-colors ${highlight ? 'bg-primary text-primary-foreground hover:opacity-90' : 'border border-primary/60 text-primary hover:bg-primary hover:text-primary-foreground'}`}
      >
        {tr ? 'Satın al' : 'Buy'}
      </Link>
    </div>
  )
}

export default function MembershipStorePage() {
  const { lang } = useLanguage()
  const tr = lang === 'tr'
  const subscriptions = PRODUCTS.filter((p) => p.kind === 'subscription')
  const lifetime = PRODUCTS.filter((p) => p.kind === 'lifetime' && p.id !== 'platin-lifetime-upgrade')
  const single = PRODUCTS.filter((p) => p.kind === 'single')

  return (
    <main className="min-h-svh bg-background">
      <ArchiveHeader />
      <ArchiveNavigation />
      <section className="mx-auto max-w-6xl px-6 py-14">
        <header className="mb-10 text-center">
          <p className="mb-3 font-sans text-xs uppercase tracking-[0.25em] text-primary">{tr ? 'Üyelik Planları' : 'Membership Plans'}</p>
          <h1 className="font-serif text-4xl text-foreground md:text-5xl">{tr ? 'Tıbbi Miras Üyelikleri' : 'Tıbbi Miras Memberships'}</h1>
          <p className="mx-auto mt-4 max-w-2xl text-pretty font-sans text-sm leading-relaxed text-muted-foreground">
            {tr
              ? 'Premium ve Platin üyelikler tarihî arşivin genişletilmiş metinlerine ve özel eserlere erişim sağlar. Tüm fiyatlara KDV dahildir. Uygulamada satın aldığınız üyelik web sitesinde de geçerlidir.'
              : 'Premium and Platin memberships unlock extended texts and exclusive works. All prices include VAT. Memberships bought in the mobile app also work on the website.'}
          </p>
        </header>

        <h2 className="mb-4 font-serif text-2xl text-foreground">{tr ? 'Abonelikler' : 'Subscriptions'}</h2>
        <div className="mb-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {subscriptions.map((p) => <StoreCard key={p.id} product={p} highlight={p.id === 'platin-yearly'} />)}
        </div>

        <h2 className="mb-4 font-serif text-2xl text-foreground">{tr ? 'Ömürlük Üyelikler' : 'Lifetime Memberships'}</h2>
        <div className="mb-12 grid gap-4 sm:grid-cols-2">
          {lifetime.map((p) => <StoreCard key={p.id} product={p} highlight={p.id === 'platin-lifetime'} />)}
        </div>

        <h2 className="mb-4 font-serif text-2xl text-foreground">{tr ? 'Tek Eser Erişimi' : 'Single Work Access'}</h2>
        <div className="mb-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {single.map((p) => <StoreCard key={p.id} product={p} />)}
        </div>

        <div className="rounded-xl border border-border bg-card/50 p-6 text-center">
          <p className="font-sans text-sm leading-relaxed text-muted-foreground">
            {tr ? 'Satın alma öncesinde ' : 'Before purchasing, please review our '}
            <Link href="/legal/mesafeli-satis" className="text-primary hover:underline">{tr ? 'Mesafeli Satış Sözleşmesi' : 'Distance Sales Agreement'}</Link>
            {tr ? ', ' : ', '}
            <Link href="/legal/iade-iptal" className="text-primary hover:underline">{tr ? 'İptal ve İade Koşulları' : 'Cancellation & Refund Policy'}</Link>
            {tr ? ' ve ' : ' and '}
            <Link href="/legal" className="text-primary hover:underline">{tr ? 'Gizlilik Politikası' : 'Privacy Policy'}</Link>
            {tr ? ' sayfalarını inceleyiniz.' : '.'}
          </p>
        </div>
      </section>
      <SiteFooter />
    </main>
  )
}
