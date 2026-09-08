export type Tier = 'premium' | 'platin'
export type PlanKind = 'subscription' | 'lifetime' | 'single'

export type Product = {
  id: string
  // Two-letter code embedded in the PayTR merchant_oid so the callback can
  // resolve what a payment grants without a database round-trip.
  code: string
  name: string
  nameEn: string
  description: string
  descriptionEn: string
  tier: Tier
  kind: PlanKind
  // Amount charged, in kuruş (1 TL = 100). Validated again in the callback.
  amountKurus: number
  // Access length in days; null means lifetime / one-time per-article.
  durationDays: number | null
}

export const PRODUCTS: Product[] = [
  { id: 'premium-monthly', code: 'PM', name: 'Premium Aylık', nameEn: 'Premium Monthly', description: 'Aylık Premium erişim.', descriptionEn: 'Monthly Premium access.', tier: 'premium', kind: 'subscription', amountKurus: 9900, durationDays: 30 },
  { id: 'premium-yearly', code: 'PY', name: 'Premium Yıllık', nameEn: 'Premium Yearly', description: 'Yıllık Premium erişim.', descriptionEn: 'Yearly Premium access.', tier: 'premium', kind: 'subscription', amountKurus: 49900, durationDays: 365 },
  { id: 'platin-monthly', code: 'XM', name: 'Platin Aylık', nameEn: 'Platin Monthly', description: 'Aylık Platin erişim.', descriptionEn: 'Monthly Platin access.', tier: 'platin', kind: 'subscription', amountKurus: 14900, durationDays: 30 },
  { id: 'platin-yearly', code: 'XY', name: 'Platin Yıllık', nameEn: 'Platin Yearly', description: 'Yıllık Platin erişim.', descriptionEn: 'Yearly Platin access.', tier: 'platin', kind: 'subscription', amountKurus: 79900, durationDays: 365 },
  { id: 'premium-lifetime', code: 'PL', name: 'Ömürlük Premium', nameEn: 'Lifetime Premium', description: 'Tek ödeme, süresiz Premium.', descriptionEn: 'One-time payment, lifetime Premium.', tier: 'premium', kind: 'lifetime', amountKurus: 299900, durationDays: null },
  { id: 'platin-lifetime', code: 'XL', name: 'Ömürlük Platin', nameEn: 'Lifetime Platin', description: 'Tek ödeme, süresiz Platin.', descriptionEn: 'One-time payment, lifetime Platin.', tier: 'platin', kind: 'lifetime', amountKurus: 399900, durationDays: null },
  { id: 'platin-lifetime-upgrade', code: 'XU', name: 'Ömürlük Platine Yükselt', nameEn: 'Upgrade to Lifetime Platin', description: 'Ömürlük Premium üyeler için yalnızca fark.', descriptionEn: 'Difference only, for lifetime Premium members.', tier: 'platin', kind: 'lifetime', amountKurus: 100000, durationDays: null },
  { id: 'single-unlock', code: 'SU', name: 'Tek Makale Ömürlük', nameEn: 'Single Article Lifetime', description: 'Bir gönderinin orijinal metnini ömürlük açar.', descriptionEn: 'Unlock one article original text forever.', tier: 'premium', kind: 'single', amountKurus: 1000, durationDays: null },
]

// Far-future sentinel mirrors the mobile app's lifetime convention.
export const LIFETIME_EXPIRES_AT = '2999-12-31T00:00:00.000Z'
export const OTTOMAN_LIFETIME_MS = 9223372036854775807 // Long.MAX_VALUE from the app

export function getProduct(id: string): Product | undefined {
  return PRODUCTS.find((product) => product.id === id)
}

export function getProductByCode(code: string): Product | undefined {
  return PRODUCTS.find((product) => product.code === code)
}

export function priceLabel(amountKurus: number, lang: 'tr' | 'en' = 'tr'): string {
  const value = amountKurus / 100
  const formatted = Number.isInteger(value) ? String(value) : value.toFixed(2)
  return lang === 'tr' ? `${formatted} TL` : `₺${formatted}`
}
