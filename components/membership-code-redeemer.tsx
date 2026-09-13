'use client'

import { useState } from 'react'
import { useAuth } from '@/components/auth-provider'
import { supabase } from '@/lib/supabase/client'

export function MembershipCodeRedeemer() {
  const { user } = useAuth()
  const [code, setCode] = useState('')
  const [message, setMessage] = useState('')

  async function redeem(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!user) return setMessage('Kod kullanmak için giriş yapmalısınız.')
    const normalized = code.trim().toUpperCase()
    if (!normalized) return
    const { data, error } = await supabase.from('tma_membership_grants').select('id, tier, max_uses, used_count, active, expires_at').eq('code', normalized).eq('active', true).maybeSingle()
    if (error || !data || (data.max_uses !== null && data.used_count >= data.max_uses)) return setMessage('Kod geçersiz veya kullanım hakkı kalmamış.')
    const { error: updateError } = await supabase.from('tma_membership_grants').update({ user_id: user.id, used_count: data.used_count + 1, active: false }).eq('id', data.id).eq('used_count', data.used_count)
    if (updateError) return setMessage('Kod kullanılamadı. Lütfen tekrar deneyin.')
    setCode('')
    setMessage(`${data.tier === 'platin' ? 'Platin' : 'Premium'} üyeliğiniz tanımlandı. Sayfayı yenileyin.`)
  }

  return <form onSubmit={redeem} className="rounded-md border border-border bg-card p-6"><h2 className="font-serif text-xl text-card-foreground">Üyelik kodu kullan</h2><p className="mt-2 font-sans text-sm text-muted-foreground">Size verilen Premium veya Platin kodunu girin.</p><div className="mt-4 flex gap-2"><input value={code} onChange={(event) => setCode(event.target.value)} placeholder="Üyelik kodu" className="min-w-0 flex-1 rounded-md border border-border bg-background px-3 py-2 uppercase outline-none focus:border-primary" /><button type="submit" className="rounded-md bg-primary px-4 py-2 font-sans text-sm text-primary-foreground">Kullan</button></div>{message ? <p className="mt-3 font-sans text-sm text-muted-foreground">{message}</p> : null}</form>
}
