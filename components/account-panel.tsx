'use client'

import Link from 'next/link'
import { Crown, ShieldCheck, UserRound, CalendarClock, Mail, CalendarPlus } from 'lucide-react'
import { useAuth } from '@/components/auth-provider'
import { useEntitlements } from '@/components/entitlements-provider'
import { useLanguage } from '@/components/language-provider'
import { CheckoutButton } from '@/components/checkout-button'

function formatDate(value: number | string | null | undefined, lang: 'tr' | 'en') {
  if (value == null) return null
  const ms = typeof value === 'number' ? value : Date.parse(value)
  if (!Number.isFinite(ms)) return null
  return new Date(ms).toLocaleDateString(lang === 'tr' ? 'tr-TR' : 'en-US', { year: 'numeric', month: 'long', day: 'numeric' })
}

const LIFETIME_THRESHOLD = 4102444800000 // 2100-01-01: treat far-future expiries as lifetime

export function AccountPanel() {
  const { user, loading: authLoading, signOut } = useAuth()
  const { premium, platin, membershipType, membershipExpiresAt, loading: entLoading } = useEntitlements()
  const { lang } = useLanguage()
  const tr = lang === 'tr'

  if (authLoading) {
    return <section className="rounded-md border border-border bg-card p-6"><p className="font-sans text-sm text-muted-foreground">{tr ? 'Yükleniyor…' : 'Loading…'}</p></section>
  }

  if (!user) {
    return (
      <section className="rounded-md border border-border bg-card p-6">
        <h2 className="font-serif text-2xl text-card-foreground">{tr ? 'Hesabım' : 'My Account'}</h2>
        <p className="mb-4 mt-2 font-sans text-sm text-muted-foreground">{tr ? 'Favorilerinizi ve üyeliğinizi cihazlar arasında senkronize etmek için giriş yapın.' : 'Sign in to sync your favorites and membership across devices.'}</p>
        <Link href="/login" className="inline-flex rounded-md bg-primary px-4 py-3 font-sans text-xs uppercase tracking-wider text-primary-foreground">{tr ? 'Giriş yap' : 'Sign in'}</Link>
      </section>
    )
  }

  const tier = platin ? 'PLATİN' : premium ? 'PREMİUM' : (tr ? 'ÜYE' : 'MEMBER')
  const TierIcon = platin ? ShieldCheck : premium ? Crown : UserRound
  const isMember = premium || platin
  const isLifetime = isMember && (membershipExpiresAt == null || membershipExpiresAt > LIFETIME_THRESHOLD)
  const expiryDate = formatDate(membershipExpiresAt, lang)
  const daysLeft = membershipExpiresAt != null && !isLifetime ? Math.max(0, Math.ceil((membershipExpiresAt - Date.now()) / 86400000)) : null
  const registered = formatDate(user.created_at, lang)

  return (
    <section className="overflow-hidden rounded-md border border-border bg-card">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border p-6">
        <div className="flex items-center gap-3">
          <span className="flex size-11 shrink-0 items-center justify-center rounded-full border border-primary/40 bg-background/70"><TierIcon className="size-5 text-primary" aria-hidden="true" /></span>
          <div>
            <h2 className="font-serif text-2xl text-card-foreground">{tr ? 'Hesabım' : 'My Account'}</h2>
            <p className="mt-0.5 font-sans text-xs uppercase tracking-[0.2em] text-primary">{tr ? `${tier} ÜYELİK` : `${tier} MEMBERSHIP`}</p>
          </div>
        </div>
        <button onClick={() => void signOut()} className="rounded border border-border px-4 py-2 font-sans text-xs uppercase tracking-wider text-foreground transition-colors hover:border-destructive hover:text-destructive">{tr ? 'Çıkış yap' : 'Sign out'}</button>
      </div>

      <dl className="grid gap-px bg-border sm:grid-cols-2">
        <div className="flex items-start gap-3 bg-card p-6">
          <Mail className="mt-0.5 size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
          <div><dt className="font-sans text-xs uppercase tracking-wider text-muted-foreground">{tr ? 'E-posta' : 'Email'}</dt><dd className="mt-1 font-sans text-sm text-card-foreground">{user.email}</dd></div>
        </div>
        {registered ? (
          <div className="flex items-start gap-3 bg-card p-6">
            <CalendarPlus className="mt-0.5 size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
            <div><dt className="font-sans text-xs uppercase tracking-wider text-muted-foreground">{tr ? 'Kayıt tarihi' : 'Member since'}</dt><dd className="mt-1 font-sans text-sm text-card-foreground">{registered}</dd></div>
          </div>
        ) : null}
        <div className="flex items-start gap-3 bg-card p-6">
          <TierIcon className="mt-0.5 size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
          <div><dt className="font-sans text-xs uppercase tracking-wider text-muted-foreground">{tr ? 'Üyelik türü' : 'Membership'}</dt><dd className="mt-1 font-sans text-sm text-card-foreground">{isMember ? (membershipType ? membershipType.toUpperCase() : tier) : (tr ? 'Ücretsiz' : 'Free')}</dd></div>
        </div>
        {isMember ? (
          <div className="flex items-start gap-3 bg-card p-6">
            <CalendarClock className="mt-0.5 size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
            <div>
              <dt className="font-sans text-xs uppercase tracking-wider text-muted-foreground">{tr ? 'Geçerlilik' : 'Valid until'}</dt>
              <dd className="mt-1 font-sans text-sm text-card-foreground">
                {isLifetime
                  ? (tr ? 'Ömür boyu' : 'Lifetime')
                  : expiryDate
                    ? (tr ? `${expiryDate}${daysLeft != null ? ` · ${daysLeft} gün kaldı` : ''}` : `${expiryDate}${daysLeft != null ? ` · ${daysLeft} days left` : ''}`)
                    : (tr ? 'Aktif' : 'Active')}
              </dd>
            </div>
          </div>
        ) : null}
      </dl>

      {!isMember ? (
        <div className="border-t border-border p-6">
          <h3 className="font-serif text-xl text-card-foreground">{tr ? 'Premium erişim' : 'Premium access'}</h3>
          <p className="mt-2 font-sans text-sm leading-relaxed text-muted-foreground">{tr ? 'Tarihî arşivin genişletilmiş metinlerine ve özel eserlere erişin.' : 'Unlock extended texts and exclusive works from the historical archive.'}</p>
          <div className="mt-5 flex flex-wrap gap-3">
            <CheckoutButton productId="premium-monthly" label={tr ? 'Premium ol' : 'Get Premium'} />
            <CheckoutButton productId="platin-monthly" label={tr ? 'Platin ol' : 'Get Platin'} />
          </div>
        </div>
      ) : null}
    </section>
  )
}
