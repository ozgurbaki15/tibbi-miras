'use client'

import { UI, useLanguage } from '@/components/language-provider'
import { LanguageSwitcher } from '@/components/language-switcher'

export function ArchiveHeader() {
  const { lang } = useLanguage()
  const t = UI[lang]

  return (
    <header className="border-b border-border">
      <div className="mx-auto flex max-w-6xl justify-end px-6 pt-6">
        <LanguageSwitcher />
      </div>

      <div className="mx-auto max-w-6xl px-6 pb-16 pt-8 text-center md:pb-24 md:pt-10">
        <p className="mb-6 font-sans text-xs uppercase tracking-[0.35em] text-primary">
          {t.eyebrow}
        </p>

        <h1 className="text-balance font-serif text-5xl font-semibold leading-[1.05] text-foreground md:text-7xl">
          Tıbbi Miras Arşivi
        </h1>

        <div
          className="mx-auto my-8 flex items-center justify-center gap-4"
          aria-hidden="true"
        >
          <span className="h-px w-16 bg-border" />
          <span className="size-1.5 rotate-45 bg-primary" />
          <span className="h-px w-16 bg-border" />
        </div>

        <p className="mx-auto max-w-2xl text-pretty font-serif text-lg leading-relaxed text-muted-foreground md:text-xl">
          {t.intro}
        </p>
      </div>
    </header>
  )
}
