'use client'

import { Crown, ShieldCheck, Info } from 'lucide-react'
import { getProduct, priceLabel, type Product } from '@/lib/products'
import { CheckoutButton } from '@/components/checkout-button'
import { useLanguage } from '@/components/language-provider'

function formatDate(ms: number, lang: 'tr' | 'en') {
  return new Date(ms).toLocaleDateString(lang === 'tr' ? 'tr-TR' : 'en-US', { year: 'numeric', month: 'long', day: 'numeric' })
}

// Explains, for an active timed member, that buying the same plan extends the
// current expiry rather than starting over — with a concrete example date.
function RenewalNotice({ tier, expiresAt }: { tier: 'premium' | 'platin'; expiresAt: number | null }) {
  const { lang } = useLanguage()
  const tr = lang === 'tr'
  if (expiresAt == null) return null

  const tierName = tier === 'platin' ? (tr ? 'Platin' : 'Platin') : (tr ? 'Premium' : 'Premium')
  const current = formatDate(expiresAt, lang)
  const extended = formatDate(expiresAt + 30 * 86400000, lang)

  return (
    <div className="mb-5 flex items-start gap-2.5 rounded-md border border-primary/40 bg-primary/5 p-4">
      <Info className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
      <div className="font-sans text-xs leading-relaxed text-foreground">
        <p>
          {tr
            ? `Şu anda ${tierName} üyeliğiniz var ve ${current} tarihinde sona eriyor.`
            : `You currently have a ${tierName} membership, expiring on ${current}.`}
        </p>
        <p className="mt-1.5 text-muted-foreground">
          {tr
            ? `Aynı planı tekrar alırsanız üyeliğiniz iptal olmaz; süreniz mevcut bitiş tarihinize eklenir. Örneğin bugün aylık yenilerseniz üyeliğiniz ${extended} tarihine kadar uzar. Farklı bir plana geçmek (ör. yıllık veya ömürlük) için aşağıdan seçebilirsiniz.`
            : `Buying the same plan again does not cancel your membership; the time is added on top of your current end date. For example, renewing monthly today extends it to ${extended}. To switch to a different plan (e.g. yearly or lifetime) choose below.`}
        </p>
      </div>
    </div>
  )
}

function periodLabel(product: Product, tr: boolean): string {
  if (product.kind === 'subscription') return product.durationDays === 365 ? (tr ? '/ yıl' : '/ year') : (tr ? '/ ay' : '/ month')
  if (product.id === 'platin-lifetime-upgrade') return tr ? 'sadece fark' : 'difference only'
  return tr ? 'tek ödeme' : 'one-time'
}

function PlanCard({ product, highlight }: { product: Product; highlight?: boolean }) {
  const { lang } = useLanguage()
  const tr = lang === 'tr'
  const Icon = product.tier === 'platin' ? ShieldCheck : Crown
  return (
    <div className={`flex flex-col gap-3 rounded-xl border p-5 ${highlight ? 'border-primary bg-accent/15' : 'border-border bg-card/70'}`}>
      <div className="flex items-center gap-2">
        <Icon className="size-4 text-primary" aria-hidden="true" />
        <h4 className="font-serif text-lg text-card-foreground">{tr ? product.name : product.nameEn}</h4>
      </div>
      <p className="font-sans text-2xl font-semibold text-foreground">{priceLabel(product.amountKurus, lang)}<span className="ml-1 font-sans text-xs font-normal uppercase tracking-wider text-muted-foreground">{periodLabel(product, tr)}</span></p>
      <p className="flex-1 font-sans text-xs leading-relaxed text-muted-foreground">{tr ? product.description : product.descriptionEn}</p>
      <CheckoutButton productId={product.id} label={tr ? 'Satın al' : 'Buy'} variant={highlight ? 'solid' : 'outline'} />
    </div>
  )
}

// Chooses which plans to offer based on the member's current tier so the list
// reflects meaningful upgrade paths (incl. the difference-only lifetime upgrade).
function offersFor({ premium, platin, isPremiumLifetime, isPlatinLifetime }: { premium: boolean; platin: boolean; isPremiumLifetime: boolean; isPlatinLifetime: boolean }): { ids: string[]; highlightId?: string } {
  if (isPlatinLifetime) return { ids: [] }
  // Difference-only upgrade applies to lifetime (and yearly) tiers. A monthly
  // membership is always re-purchased at full price, starting on the buy date.
  if (isPremiumLifetime) return { ids: ['platin-lifetime-upgrade'], highlightId: 'platin-lifetime-upgrade' }
  if (platin) return { ids: ['platin-lifetime'], highlightId: 'platin-lifetime' }
  if (premium) return { ids: ['platin-monthly', 'platin-yearly', 'platin-lifetime', 'premium-lifetime'], highlightId: 'platin-yearly' }
  return { ids: ['premium-monthly', 'premium-yearly', 'platin-monthly', 'platin-yearly', 'premium-lifetime', 'platin-lifetime'], highlightId: 'platin-yearly' }
}

export function MembershipPlans({ premium, platin, isPremiumLifetime, isPlatinLifetime, expiresAt }: { premium: boolean; platin: boolean; isPremiumLifetime: boolean; isPlatinLifetime: boolean; expiresAt?: number | null }) {
  const { lang } = useLanguage()
  const tr = lang === 'tr'
  const { ids, highlightId } = offersFor({ premium, platin, isPremiumLifetime, isPlatinLifetime })
  const products = ids.map(getProduct).filter((p): p is Product => Boolean(p))

  if (products.length === 0) {
    return <p className="font-sans text-sm text-muted-foreground">{tr ? 'En üst üyelik seviyesindesiniz. Teşekkürler!' : 'You are on the highest membership tier. Thank you!'}</p>
  }

  // Timed (non-lifetime) members get an extension/renewal explanation.
  const showRenewal = (premium || platin) && !isPremiumLifetime && !isPlatinLifetime && expiresAt != null

  return (
    <div>
      {showRenewal ? <RenewalNotice tier={platin ? 'platin' : 'premium'} expiresAt={expiresAt ?? null} /> : null}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => <PlanCard key={product.id} product={product} highlight={product.id === highlightId} />)}
      </div>
    </div>
  )
}
