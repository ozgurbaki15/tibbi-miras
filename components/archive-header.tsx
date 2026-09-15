'use client'

import Link from 'next/link'
import { UI, useLanguage } from '@/components/language-provider'
import { LanguageSwitcher } from '@/components/language-switcher'
import { AccountMenu } from '@/components/account-menu'
import { ThemeSwitcher } from '@/components/theme-switcher'

const emblemImages = {
  tr: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-136-RY8EVSQmhtuBjX54UIANgOEYYva9xv.jpg',
  en: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/enggggg-x7SwvDEIarAV0VC5OKtQuTxTAbBWG1.jpg',
} as const

export function ArchiveHeader() {
  const { lang } = useLanguage()
  const t = UI[lang]
  const emblemImage = lang === 'tr' ? emblemImages.tr : emblemImages.en

  return (
    <header className="border-b border-border">
      <Link
        href="/uyelikler"
        className="fixed left-4 top-4 z-50 inline-flex items-center gap-2 rounded-full border-2 border-primary bg-primary px-4 py-2.5 font-sans text-xs font-bold uppercase tracking-wider text-primary-foreground shadow-xl shadow-primary/30 transition-transform hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
        aria-label={lang === 'tr' ? 'Abonelikler sayfasına git' : 'Go to subscriptions'}
      >
        <span aria-hidden="true">★</span>
        {lang === 'tr' ? 'Abonelikler' : 'Subscriptions'}
      </Link>

      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-end gap-3 px-6 pt-20 sm:justify-between sm:pt-6">
        <AccountMenu />
        <div className="flex items-center gap-3">
          <a
            href="https://play.google.com/store/apps/details?id=com.freedscience.app"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-2 font-sans text-[10px] uppercase tracking-wider text-foreground transition-colors hover:border-primary hover:text-primary"
          >
            <span className="text-primary" aria-hidden="true">▶</span>
            {lang === 'tr' ? 'Uygulamamızı indirin' : 'Get our app'}
          </a>
          <LanguageSwitcher />
          <ThemeSwitcher />
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 pb-10 pt-6 md:px-6 md:pb-16 md:pt-8">
        <div className="text-center">
          <Link
            href="/"
            className="mb-4 inline-block rounded-md font-sans text-2xl font-semibold tracking-[0.22em] text-primary transition-opacity hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary md:text-3xl"
            aria-label={lang === 'tr' ? 'Anasayfaya git' : 'Go to home'}
          >
            {t.eyebrow}
          </Link>
          <h1 className="mb-6 text-balance font-serif text-3xl font-semibold leading-tight text-foreground md:text-5xl">
            Kadim Tıbbın İhyası
          </h1>

          <div
            className="mx-auto aspect-[16/7] w-full max-w-5xl rounded-[1.75rem] border border-primary/50 bg-[#171725] shadow-2xl shadow-primary/10"
            style={{
              backgroundImage: `linear-gradient(rgba(20, 20, 31, 0.12), rgba(20, 20, 31, 0.12)), url('${emblemImage}')`,
              backgroundPosition: 'center',
              backgroundSize: 'cover',
              backgroundRepeat: 'no-repeat',
            }}
            role="img"
            aria-label={lang === 'tr' ? 'Özgür Tıp amblemi' : 'Freed Science emblem'}
          />

          <p className="mt-6 font-serif text-2xl italic text-foreground md:text-3xl">
            {lang === 'tr' ? 'Tıbbi Miras Arşivi' : 'Medical Heritage Archive'}
          </p>
        </div>
      </div>
    </header>
  )
}
