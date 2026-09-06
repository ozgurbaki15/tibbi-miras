'use client'

import { UI, useLanguage } from '@/components/language-provider'
import { LanguageSwitcher } from '@/components/language-switcher'
import { AccountMenu } from '@/components/account-menu'
import { ThemeSwitcher } from '@/components/theme-switcher'

export function ArchiveHeader() {
  const { lang } = useLanguage()
  const t = UI[lang]

  return <header className="border-b border-border"><div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-6 pt-6"><AccountMenu /><div className="flex items-center gap-3"><a href="https://play.google.com/store/apps/details?id=com.freedscience.app" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-2 font-sans text-[10px] uppercase tracking-wider text-foreground transition-colors hover:border-primary hover:text-primary"><span className="text-primary" aria-hidden="true">▶</span>{lang === 'tr' ? 'Uygulamayı indir' : 'Get the app'}</a><LanguageSwitcher /><ThemeSwitcher /></div></div><div className="mx-auto max-w-6xl px-6 pb-16 pt-8 text-center md:pb-24 md:pt-10"><p className="mb-3 font-sans text-2xl font-semibold tracking-[0.22em] text-primary md:text-3xl">{t.eyebrow}</p><p className="mb-3 font-serif text-2xl italic text-muted-foreground md:text-3xl">{lang === 'tr' ? 'Özgür Tıp' : 'Freed Medicine'}</p><h1 className="text-balance font-serif text-5xl font-semibold leading-[1.05] text-foreground md:text-7xl">Tıbbi Miras Arşivi</h1><div className="mx-auto my-8 flex items-center justify-center gap-4" aria-hidden="true"><span className="h-px w-16 bg-border" /><span className="size-1.5 rotate-45 bg-primary" /><span className="h-px w-16 bg-border" /></div><p className="mx-auto max-w-2xl text-pretty font-serif text-lg leading-relaxed text-muted-foreground md:text-xl">{t.intro}</p></div></header>
}
