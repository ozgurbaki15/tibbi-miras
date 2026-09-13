'use client'

import { useEffect, useState } from 'react'
import { UserRound } from 'lucide-react'
import { useAuth } from '@/components/auth-provider'
import { useLanguage } from '@/components/language-provider'
import { supabase } from '@/lib/supabase/client'

export function ProfileSettings() {
  const { user } = useAuth()
  const { lang } = useLanguage()
  const tr = lang === 'tr'
  const [displayName, setDisplayName] = useState('')
  const [avatarUrl, setAvatarUrl] = useState('')
  const [phone, setPhone] = useState('')
  const [status, setStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle')

  useEffect(() => {
    let active = true
    async function loadProfile() {
      if (!user) return
      const { data } = await supabase.from('tma_profiles').select('display_name, avatar_url, phone').eq('user_id', user.id).maybeSingle()
      if (active && data) {
        setDisplayName(data.display_name ?? '')
        setAvatarUrl(data.avatar_url ?? '')
        setPhone(data.phone ?? '')
      }
    }
    void loadProfile()
    return () => { active = false }
  }, [user])

  async function saveProfile(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!user) return
    setStatus('saving')
    const { error } = await supabase.from('tma_profiles').upsert({ user_id: user.id, display_name: displayName.trim(), avatar_url: avatarUrl.trim(), phone: phone.trim(), updated_at: new Date().toISOString() })
    setStatus(error ? 'error' : 'saved')
  }

  if (!user) return null

  return (
    <section className="rounded-md border border-border bg-card p-6">
      <div className="mb-5 flex items-center gap-3">
        <span className="flex size-10 items-center justify-center rounded-full border border-primary/40 bg-background/70"><UserRound className="size-5 text-primary" aria-hidden="true" /></span>
        <div><h2 className="font-serif text-2xl text-card-foreground">{tr ? 'Profilim' : 'My profile'}</h2><p className="font-sans text-sm text-muted-foreground">{tr ? 'Yorumlarda görünecek bilgilerinizi yönetin.' : 'Manage the information shown with your comments.'}</p></div>
      </div>
      <form onSubmit={saveProfile} className="flex flex-col gap-4">
        <label className="flex flex-col gap-1.5 font-sans text-sm text-card-foreground"><span>{tr ? 'Görünen ad' : 'Display name'}</span><input value={displayName} onChange={(event) => setDisplayName(event.target.value)} maxLength={80} className="rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary" /></label>
        <label className="flex flex-col gap-1.5 font-sans text-sm text-card-foreground"><span>{tr ? 'Profil resmi URL’si' : 'Profile image URL'}</span><input value={avatarUrl} onChange={(event) => setAvatarUrl(event.target.value)} type="url" maxLength={500} className="rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary" /></label>
        <label className="flex flex-col gap-1.5 font-sans text-sm text-card-foreground"><span>{tr ? 'Telefon' : 'Phone'}</span><input value={phone} onChange={(event) => setPhone(event.target.value)} type="tel" maxLength={30} className="rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary" /></label>
        <div className="flex flex-wrap items-center gap-4"><button type="submit" disabled={status === 'saving'} className="rounded-md bg-primary px-5 py-3 font-sans text-xs font-medium uppercase tracking-wider text-primary-foreground disabled:opacity-60">{status === 'saving' ? (tr ? 'Kaydediliyor…' : 'Saving…') : (tr ? 'Profili kaydet' : 'Save profile')}</button>{status === 'saved' ? <span className="font-sans text-xs text-primary">{tr ? 'Profil kaydedildi.' : 'Profile saved.'}</span> : null}{status === 'error' ? <span className="font-sans text-xs text-destructive">{tr ? 'Profil kaydedilemedi. Veri tabanı şemasını uygulayın.' : 'Could not save. Apply the database schema first.'}</span> : null}</div>
      </form>
    </section>
  )
}
