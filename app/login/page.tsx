'use client'

import { FormEvent, useEffect, useState } from 'react'
import Link from 'next/link'
import { Eye, EyeOff, MailCheck } from 'lucide-react'
import { ArchiveHeader } from '@/components/archive-header'
import { ArchiveNavigation } from '@/components/archive-navigation'
import { SiteFooter } from '@/components/site-footer'
import { useAuth } from '@/components/auth-provider'
import { isSupabaseConfigured, supabase } from '@/lib/supabase/client'

export default function LoginPage() {
  const { user, signOut } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [mode, setMode] = useState<'signin' | 'signup'>('signin')
  const [message, setMessage] = useState('')
  const [busy, setBusy] = useState(false)
  // Set once a signup succeeds so we can show a prominent "verify email" screen.
  const [awaitingActivation, setAwaitingActivation] = useState(false)

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

  function emailRedirectUrl() {
    return process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL || `${window.location.origin}/auth/callback`
  }

  async function submit(event: FormEvent) {
    event.preventDefault()
    if (!isSupabaseConfigured) { setMessage('Giriş sistemi yapılandırılmamış.'); return }
    if (mode === 'signup' && password !== confirm) { setMessage('Şifreler eşleşmiyor. Lütfen iki alana da aynı şifreyi yazın.'); return }
    setBusy(true)
    setMessage('')
    const normalizedEmail = email.trim().toLowerCase()
    if (mode === 'signin') {
      const { error } = await supabase.auth.signInWithPassword({ email: normalizedEmail, password })
      setMessage(error?.message ?? 'Giriş başarılı.')
    } else {
      const { error } = await supabase.auth.signUp({ email: normalizedEmail, password, options: { emailRedirectTo: emailRedirectUrl() } })
      if (error) setMessage(error.message)
      else setAwaitingActivation(true)
    }
    setBusy(false)
  }

  async function google() {
    if (!isSupabaseConfigured) { setMessage('Giriş sistemi yapılandırılmamış.'); return }
    setBusy(true)
    setMessage('')
    const { error } = await supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: `${window.location.origin}/login` } })
    if (error) setMessage(error.message)
    setBusy(false)
  }

  const inputClass = 'mt-2 w-full rounded border border-border bg-background px-3 py-3 font-sans text-sm text-foreground outline-none focus:border-primary'

  return (
    <main className="min-h-svh bg-background">
      <ArchiveHeader />
      <ArchiveNavigation />
      <section className="mx-auto max-w-md px-6 py-16">
        <div className="mb-8 text-center">
          <p className="mb-3 font-sans text-xs uppercase tracking-[0.25em] text-primary">Tıbbi Miras Arşivi</p>
          <h1 className="font-serif text-4xl text-foreground">{user ? 'Hesabınız' : awaitingActivation ? 'E-postanızı Doğrulayın' : mode === 'signin' ? 'Giriş Yap' : 'Kayıt Ol'}</h1>
        </div>

        {user ? (
          <div className="space-y-5 rounded-md border border-border bg-card p-6 text-center">
            <p className="font-sans text-sm text-muted-foreground">{user.email}</p>
            <button onClick={() => signOut()} className="w-full rounded-md border border-border px-4 py-3 font-sans text-xs uppercase tracking-wider text-foreground hover:border-primary">Çıkış yap</button>
          </div>
        ) : awaitingActivation ? (
          <div className="space-y-5 rounded-md border-2 border-primary bg-accent/15 p-8 text-center">
            <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-primary/15">
              <MailCheck className="size-8 text-primary" aria-hidden="true" />
            </div>
            <h2 className="font-serif text-2xl text-foreground">Hesabınızı aktive edin</h2>
            <p className="font-sans text-sm leading-relaxed text-foreground/80">
              <span className="font-semibold text-foreground">{email.trim().toLowerCase()}</span> adresine bir doğrulama e-postası gönderdik. Giriş yapabilmek için e-postadaki <span className="font-semibold text-primary">&quot;Hesabı Aktive Et&quot;</span> bağlantısına tıklayın.
            </p>
            <p className="rounded-md border border-border bg-background/60 px-4 py-3 font-sans text-xs leading-relaxed text-muted-foreground">
              E-postayı göremiyorsanız spam / gereksiz klasörünü kontrol edin. Bağlantıya tıkladıktan sonra bu sayfaya dönüp giriş yapabilirsiniz.
            </p>
            <button
              type="button"
              onClick={() => { setAwaitingActivation(false); setMode('signin'); setPassword(''); setConfirm('') }}
              className="w-full rounded-md bg-primary px-4 py-3 font-sans text-xs uppercase tracking-wider text-primary-foreground hover:opacity-90"
            >
              Giriş ekranına dön
            </button>
          </div>
        ) : (
          <form onSubmit={submit} className="space-y-4 rounded-md border border-border bg-card p-6">
            <label className="block font-sans text-xs uppercase tracking-wider text-muted-foreground">
              E-posta
              <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={inputClass} />
            </label>

            <label className="block font-sans text-xs uppercase tracking-wider text-muted-foreground">
              Şifre
              <div className="relative">
                <input required minLength={6} type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} className={`${inputClass} pr-11`} />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? 'Şifreyi gizle' : 'Şifreyi göster'}
                  className="absolute inset-y-0 right-0 mt-2 flex items-center px-3 text-muted-foreground hover:text-primary"
                >
                  {showPassword ? <EyeOff className="size-4" aria-hidden="true" /> : <Eye className="size-4" aria-hidden="true" />}
                </button>
              </div>
            </label>

            {mode === 'signup' ? (
              <label className="block font-sans text-xs uppercase tracking-wider text-muted-foreground">
                Şifre (tekrar)
                <div className="relative">
                  <input required minLength={6} type={showPassword ? 'text' : 'password'} value={confirm} onChange={(e) => setConfirm(e.target.value)} className={`${inputClass} pr-11`} />
                </div>
                {confirm.length > 0 && confirm !== password ? <span className="mt-1 block normal-case tracking-normal text-destructive">Şifreler eşleşmiyor.</span> : null}
              </label>
            ) : null}

            <button disabled={busy || !isSupabaseConfigured} className="w-full rounded-md bg-primary px-4 py-3 font-sans text-xs uppercase tracking-wider text-primary-foreground disabled:opacity-50">
              {busy ? 'Bekleyin…' : mode === 'signin' ? 'Giriş yap' : 'Kayıt ol'}
            </button>

            <button type="button" onClick={google} disabled={!isSupabaseConfigured} className="w-full rounded-md border border-border px-4 py-3 font-sans text-xs uppercase tracking-wider text-foreground hover:border-primary disabled:opacity-50">
              Google ile devam et
            </button>

            {message ? <p className="font-sans text-sm normal-case tracking-normal text-destructive">{message}</p> : null}

            <p className="pt-2 text-center font-sans text-xs normal-case tracking-normal text-muted-foreground">
              {mode === 'signin' ? 'Hesabınız yok mu? ' : 'Zaten hesabınız var mı? '}
              <button type="button" onClick={() => { setMode(mode === 'signin' ? 'signup' : 'signin'); setMessage(''); setConfirm('') }} className="font-semibold text-primary hover:underline">
                {mode === 'signin' ? 'Kayıt olun' : 'Giriş yapın'}
              </button>
            </p>
          </form>
        )}

        <p className="mt-6 text-center">
          <Link href="/uyelikler" className="font-sans text-xs uppercase tracking-wider text-primary hover:underline">Üyelik planlarını görüntüle</Link>
        </p>
      </section>
      <SiteFooter width="narrow" />
    </main>
  )
}
