'use client'

import { ArchiveHeader } from '@/components/archive-header'
import { ArchiveNavigation } from '@/components/archive-navigation'
import { LanguageSwitcher } from '@/components/language-switcher'
import { SiteFooter } from '@/components/site-footer'
import { AccountPanel } from '@/components/account-panel'
import { ProfileSettings } from '@/components/profile-settings'
import { useLanguage } from '@/components/language-provider'

export default function SettingsPage() {
  const { lang } = useLanguage()
  const tr = lang === 'tr'
  return (
    <main className="min-h-svh bg-background">
      <ArchiveHeader />
      <ArchiveNavigation />
      <section className="mx-auto max-w-3xl px-6 py-14">
        <p className="mb-2 font-sans text-xs uppercase tracking-[0.25em] text-primary">{tr ? 'Kişisel alan' : 'Personal space'}</p>
        <h1 className="mb-10 font-serif text-5xl text-foreground">{tr ? 'Ayarlar' : 'Settings'}</h1>
        <div className="space-y-5">
          <ProfileSettings />
          <AccountPanel />
          <section className="flex items-center justify-between rounded-md border border-border bg-card p-6">
            <div>
              <h2 className="font-serif text-2xl text-card-foreground">Dil / Language</h2>
              <p className="mt-1 font-sans text-xs text-muted-foreground">{tr ? 'Arşiv metinlerini ve arayüzü değiştirin.' : 'Switch the archive texts and interface.'}</p>
            </div>
            <LanguageSwitcher />
          </section>
        </div>
      </section>
      <SiteFooter />
    </main>
  )
}
