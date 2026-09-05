'use client'

import Link from 'next/link'
import { ArchiveHeader } from '@/components/archive-header'
import { ArchiveNavigation } from '@/components/archive-navigation'
import { LanguageSwitcher } from '@/components/language-switcher'
import { SiteFooter } from '@/components/site-footer'
import { useAuth } from '@/components/auth-provider'
import { useLanguage } from '@/components/language-provider'

export default function SettingsPage() {
  const { user, loading, signOut } = useAuth()
  const { lang } = useLanguage()
  return <main className="min-h-svh bg-background"><ArchiveHeader /><ArchiveNavigation /><section className="mx-auto max-w-3xl px-6 py-14"><p className="mb-2 font-sans text-xs uppercase tracking-[0.25em] text-primary">{lang === 'tr' ? 'Kişisel alan' : 'Personal space'}</p><h1 className="mb-10 font-serif text-5xl text-foreground">{lang === 'tr' ? 'Ayarlar' : 'Settings'}</h1><div className="space-y-5"><section className="flex items-center justify-between rounded-md border border-border bg-card p-6"><div><h2 className="font-serif text-2xl text-card-foreground">Dil / Language</h2><p className="mt-1 font-sans text-xs text-muted-foreground">Arşiv metinlerini ve arayüzü değiştirin.</p></div><LanguageSwitcher /></section><section className="rounded-md border border-border bg-card p-6"><h2 className="font-serif text-2xl text-card-foreground">Hesap</h2>{loading ? <p className="mt-4 font-sans text-sm text-muted-foreground">Yükleniyor…</p> : user ? <div className="mt-4 flex flex-wrap items-center justify-between gap-4"><p className="font-sans text-sm text-muted-foreground">{user.email}</p><button onClick={() => signOut()} className="rounded border border-border px-4 py-2 font-sans text-xs uppercase tracking-wider text-foreground hover:border-primary">Çıkış yap</button></div> : <div className="mt-4"><p className="mb-4 font-sans text-sm text-muted-foreground">Favorilerinizi ve okuma durumunuzu cihazlar arasında senkronize etmek için giriş yapın.</p><Link href="/login" className="inline-flex rounded-md bg-primary px-4 py-3 font-sans text-xs uppercase tracking-wider text-primary-foreground">Giriş yap</Link></div>}</section><section className="rounded-md border border-border bg-card p-6"><h2 className="font-serif text-2xl text-card-foreground">Premium erişim</h2><p className="mt-2 font-sans text-sm leading-relaxed text-muted-foreground">Üyelik ve tekil eser erişimi seçenekleri burada görünecek.</p></section></div></section><SiteFooter /></main>
}
