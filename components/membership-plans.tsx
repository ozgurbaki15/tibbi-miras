'use client'

import { Crown, ShieldCheck } from 'lucide-react'
import { getProduct, priceLabel, type Product } from '@/lib/products'
import { CheckoutButton } from '@/components/checkout-button'
import { useLanguage } from '@/components/language-provider'

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
  if (platin) return { ids: ['platin-lifetime'], highlightId: 'platin-lifetime' }
  if (isPremiumLifetime) return { ids: ['platin-lifetime-upgrade', 'platin-yearly', 'platin-monthly'], highlightId: 'platin-lifetime-upgrade' }
  if (premium) return { ids: ['platin-monthly', 'platin-yearly', 'platin-lifetime', 'premium-lifetime'], highlightId: 'platin-yearly' }
  return { ids: ['premium-monthly', 'premium-yearly', 'platin-monthly', 'platin-yearly', 'premium-lifetime', 'platin-lifetime'], highlightId: 'platin-yearly' }
}

export function MembershipPlans({ premium, platin, isPremiumLifetime, isPlatinLifetime }: { premium: boolean; platin: boolean; isPremiumLifetime: boolean; isPlatinLifetime: boolean }) {
  const { lang } = useLanguage()
  const tr = lang === 'tr'
  const { ids, highlightId } = offersFor({ premium, platin, isPremiumLifetime, isPlatinLifetime })
  const products = ids.map(getProduct).filter((p): p is Product => Boolean(p))

  if (products.length === 0) {
    return <p className="font-sans text-sm text-muted-foreground">{tr ? 'En üst üyelik seviyesindesiniz. Teşekkürler!' : 'You are on the highest membership tier. Thank you!'}</p>
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {products.map((product) => <PlanCard key={product.id} product={product} highlight={product.id === highlightId} />)}
    </div>
  )
}
