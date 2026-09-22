'use client'

import { useState } from 'react'
import Link from 'next/link'
import { KeyRound } from 'lucide-react'
import { useAuth } from '@/components/auth-provider'
import { useLanguage } from '@/components/language-provider'
import { supabase } from '@/lib/supabase/client'

export function MembershipCodeRedeemer({ compact = false }: { compact?: boolean }) {
  const { user } = useAuth()
  const { lang } = useLanguage()
  const tr = lang === 'tr'
  const [code, setCode] = useState('')
  const [message, setMessage] = useState('')

  async function redeem(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!user) return setMessage(tr ? 'Kod kullanmak için giriş yapmalısınız.' : 'You must sign in to redeem a code.')
    const normalized = code.trim().toUpperCase()
    if (!normalized) return
    const { data, error } = await supabase.from('tma_membership_grants').select('id, tier, max_uses, used_count, active, expires_at, duration_days').eq('code', normalized).eq('active', true).maybeSingle()
    if (error || !data || (data.max_uses !== null && data.used_count >= data.max_uses)) return setMessage(tr ? 'Kod geçersiz veya kullanım hakkı kalmamış.' : 'This code is invalid or has no uses left.')
    if (data.expires_at && Date.parse(data.expires_at) < Date.now()) return setMessage(tr ? 'Kodun süresi dolmuş.' : 'This code has expired.')
    const effectiveExpiry = data.expires_at ?? (data.duration_days ? new Date(Date.now() + data.duration_days * 86400000).toISOString() : null)
    const { error: updateError } = await supabase.from('tma_membership_grants').update({ user_id: user.id, used_count: data.used_count + 1, expires_at: effectiveExpiry }).eq('id', data.id).eq('used_count', data.used_count)
    if (updateError) return setMessage(tr ? 'Kod kullanılamadı. Lütfen tekrar deneyin.' : 'The code could not be redeemed. Please try again.')
    setCode('')
    const tierLabel = data.tier === 'platin' ? 'Platin' : 'Premium'
    setMessage(tr ? `${tierLabel} üyeliğiniz tanımlandı. Sayfayı yenileyin.` : `Your ${tierLabel} membership has been activated. Please refresh the page.`)
  }

  if (compact) {
    return (
      <form onSubmit={redeem} className="rounded-xl border border-primary/30 bg-accent/10 p-5">
        <div className="mb-3 flex items-center gap-2">
          <KeyRound className="size-4 text-primary" aria-hidden="true" />
          <h2 className="font-serif text-lg text-foreground">{tr ? 'Üyelik kodunuz mu var?' : 'Have a membership code?'}</h2>
        </div>
        <p className="mb-3 font-sans text-xs leading-relaxed text-muted-foreground">
          {tr ? 'Uygulamadan veya bir yetkiliden aldığınız Premium/Platin kodunu girerek ödeme yapmadan üyeliğinizi etkinleştirin.' : 'Enter the Premium/Platin code you received from the app or a representative to activate membership without paying.'}
        </p>
        <div className="flex gap-2">
          <input
            value={code}
            onChange={(event) => setCode(event.target.value)}
            placeholder={tr ? 'Üyelik kodu' : 'Membership code'}
            className="min-w-0 flex-1 rounded-md border border-border bg-background px-3 py-2 text-sm uppercase outline-none focus:border-primary"
          />
          <button type="submit" className="shrink-0 rounded-md bg-primary px-4 py-2 font-sans text-xs uppercase tracking-wider text-primary-foreground hover:opacity-90">{tr ? 'Kullan' : 'Redeem'}</button>
        </div>
        {message ? <p className="mt-3 font-sans text-xs leading-relaxed text-muted-foreground">{message}</p> : null}
        {!user && !message ? (
          <p className="mt-3 font-sans text-xs text-muted-foreground">
            {tr ? 'Kod girmeden önce ' : 'Please '}
            <Link href="/login" className="text-primary hover:underline">{tr ? 'giriş yapın' : 'sign in'}</Link>
            {tr ? '.' : ' before entering a code.'}
          </p>
        ) : null}
      </form>
    )
  }

  return (
    <form onSubmit={redeem} className="rounded-md border border-border bg-card p-6">
      <h2 className="font-serif text-xl text-card-foreground">{tr ? 'Üyelik kodu kullan' : 'Redeem membership code'}</h2>
      <p className="mt-2 font-sans text-sm text-muted-foreground">{tr ? 'Size verilen Premium veya Platin kodunu girin.' : 'Enter the Premium or Platin code you were given.'}</p>
      <div className="mt-4 flex gap-2">
        <input value={code} onChange={(event) => setCode(event.target.value)} placeholder={tr ? 'Üyelik kodu' : 'Membership code'} className="min-w-0 flex-1 rounded-md border border-border bg-background px-3 py-2 uppercase outline-none focus:border-primary" />
        <button type="submit" className="rounded-md bg-primary px-4 py-2 font-sans text-sm text-primary-foreground">{tr ? 'Kullan' : 'Redeem'}</button>
      </div>
      {message ? <p className="mt-3 font-sans text-sm text-muted-foreground">{message}</p> : null}
    </form>
  )
}
