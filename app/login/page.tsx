'use client'

import { FormEvent, useEffect, useState } from 'react'
import Link from 'next/link'
import { ArchiveHeader } from '@/components/archive-header'
import { ArchiveNavigation } from '@/components/archive-navigation'
import { SiteFooter } from '@/components/site-footer'
import { useAuth } from '@/components/auth-provider'
import { isSupabaseConfigured, supabase } from '@/lib/supabase/client'

export default function LoginPage() {
  const { user, signOut } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [mode, setMode] = useState<'signin' | 'signup'>('signin')
  const [message, setMessage] = useState('')
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const error = params.get('error')
    if (error === 'auth_callback_failed') setMessage('Google ile giriş tamamlanamadı. Lütfen tekrar deneyin.')
    if (error === 'auth_callback_missing_code') setMessage('Google giriş dönüş kodu alınamadı. Lütfen tekrar deneyin.')

    const hash = new URLSearchParams(window.location.hash.replace(/^#/, ''))
    const accessToken = hash.get('access_token')
    const refreshToken = hash.get('refresh_token')
    if (accessToken && refreshToken) {
      setBusy(true)
      supabase.auth.setSession({ access_token: accessToken, refresh_token: refreshToken }).then(({ error: sessionError }) => {
        if (sessionError) setMessage('Google oturumu oluşturulamadı. Lütfen tekrar deneyin.')
        else window.history.replaceState({}, '', '/login')
        setBusy(false)
      })
    }
  }, [])

  async function submit(event: FormEvent) {
    event.preventDefault()
    if (!isSupabaseConfigured) { setMessage('Giriş sistemi yapılandırılmamış.'); return }
    setBusy(true)
    setMessage('')
    const normalizedEmail = email.trim().toLowerCase()
    const result = mode === 'signin'
      ? await supabase.auth.signInWithPassword({ email: normalizedEmail, password })
      : await supabase.auth.signUp({ email: normalizedEmail, password, options: { emailRedirectTo: authRedirectUrl() } })
    setMessage(result.error?.message ?? (mode === 'signup' ? 'E-posta adresinizi doğrulayın.' : 'Giriş başarılı.'))
    setBusy(false)
  }
  function authRedirectUrl() {
    return process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL || `${window.location.origin}/auth/callback`
  }

  async function google() {
    if (!isSupabaseConfigured) { setMessage('Giriş sistemi yapılandırılmamış.'); return }
    setBusy(true)
    setMessage('')
    const { error } = await supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: authRedirectUrl() } })
    if (error) setMessage(error.message)
    setBusy(false)
  }
  return <main className="min-h-svh bg-background"><ArchiveHeader /><ArchiveNavigation /><section className="mx-auto max-w-md px-6 py-16"><div className="mb-8 text-center"><p className="mb-3 font-sans text-xs uppercase tracking-[0.25em] text-primary">Tıbbi Miras Arşivi</p><h1 className="font-serif text-4xl text-foreground">{user ? 'Hesabınız' : mode === 'signin' ? 'Giriş Yap' : 'Kayıt Ol'}</h1></div>{user ? <div className="space-y-5 rounded-md border border-border bg-card p-6 text-center"><p className="font-sans text-sm text-muted-foreground">{user.email}</p><button onClick={() => signOut()} className="w-full rounded-md border border-border px-4 py-3 font-sans text-xs uppercase tracking-wider text-foreground hover:border-primary">Çıkış yap</button></div> : <form onSubmit={submit} className="space-y-4 rounded-md border border-border bg-card p-6"><label className="block font-sans text-xs uppercase tracking-wider text-muted-foreground">E-posta<input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="mt-2 w-full rounded border border-border bg-background px-3 py-3 font-sans text-sm text-foreground outline-none focus:border-primary" /></label><label className="block font-sans text-xs uppercase tracking-wider text-muted-foreground">Şifre<input required minLength={6} type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="mt-2 w-full rounded border border-border bg-background px-3 py-3 font-sans text-sm text-foreground outline-none focus:border-primary" /></label><button disabled={busy || !isSupabaseConfigured} className="w-full rounded-md bg-primary px-4 py-3 font-sans text-xs uppercase tracking-wider text-primary-foreground disabled:opacity-50">{busy ? 'Bekleyin…' : mode === 'signin' ? 'Giriş yap' : 'Kayıt ol'}</button><button type="button" onClick={google} disabled={!isSupabaseConfigured} className="w-full rounded-md border border-border px-4 py-3 font-sans text-xs uppercase tracking-wider text-foreground disabled:opacity-50">Google ile devam et</button>{message && <p className="text-center font-sans text-xs leading-relaxed text-muted-foreground">{message}</p>}<button type="button" onClick={() => setMode(mode === 'signin' ? 'signup' : 'signin')} className="w-full font-sans text-xs text-primary hover:underline">{mode === 'signin' ? 'Yeni hesap oluştur' : 'Zaten hesabım var'}</button><Link href="/" className="block text-center font-sans text-xs text-muted-foreground hover:text-primary">Arşive dön</Link></form>}</section><SiteFooter /></main>
}
