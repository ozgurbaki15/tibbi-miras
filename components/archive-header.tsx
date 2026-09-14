'use client'

import Link from 'next/link'
import { UI, useLanguage } from '@/components/language-provider'
import { LanguageSwitcher } from '@/components/language-switcher'
import { AccountMenu } from '@/components/account-menu'
import { ThemeSwitcher } from '@/components/theme-switcher'

export function ArchiveHeader() {
  const { lang } = useLanguage()
  const t = UI[lang]

  return <header className="border-b border-border"><div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-6 pt-6"><AccountMenu /><div className="flex items-center gap-3"><a href="https://play.google.com/store/apps/details?id=com.freedscience.app" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-2 font-sans text-[10px] uppercase tracking-wider text-foreground transition-colors hover:border-primary hover:text-primary"><span className="text-primary" aria-hidden="true">▶</span>{lang === 'tr' ? 'Uygulamamızı indirin' : 'Get our app'}</a><LanguageSwitcher /><ThemeSwitcher /></div></div><div className="mx-auto max-w-6xl px-4 pb-10 pt-6 md:px-6 md:pb-16 md:pt-8"><div className="relative overflow-hidden rounded-[1.75rem] border border-primary/50 bg-[#171725] px-6 py-12 text-center shadow-2xl shadow-primary/10 md:px-12 md:py-16" style={{ backgroundImage: "linear-gradient(90deg, rgba(20,20,31,.94), rgba(20,20,31,.74), rgba(20,20,31,.94)), url('https://hebbkx1anhila5yf.public.blob.vercel-storage.com/enggggg-x7SwvDEIarAV0VC5OKtQuTxTAbBWG1.jpg')", backgroundPosition: 'center', backgroundSize: 'cover' }}><div className="pointer-events-none absolute inset-3 rounded-[1.25rem] border border-primary/35" /><Link href="/" className="mb-3 inline-block rounded-md font-sans text-2xl font-semibold tracking-[0.22em] text-primary transition-opacity hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary md:text-3xl" aria-label={lang === 'tr' ? 'Anasayfaya git' : 'Go to home'}>{t.eyebrow}</Link><p className="mb-3 font-serif text-2xl italic text-muted-foreground md:text-3xl">{lang === 'tr' ? 'Özgür Tıp' : 'Freed Medicine'}</p><h1 className="text-balance font-serif text-5xl font-semibold leading-[1.05] text-foreground md:text-7xl">Tıbbi Miras Arşivi</h1><div className="mx-auto my-8 flex items-center justify-center gap-4" aria-hidden="true"><span className="h-px w-16 bg-border" /><span className="size-1.5 rotate-45 bg-primary" /><span className="h-px w-16 bg-border" /></div><p className="mx-auto max-w-2xl text-pretty font-serif text-lg leading-relaxed text-primary-foreground/80 md:text-xl">{t.intro}</p></div></div></header>
}
