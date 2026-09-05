'use client'

import Link from 'next/link'
import { UI, useLanguage } from '@/components/language-provider'

export function SiteFooter({ width = 'wide' }: { width?: 'wide' | 'narrow' }) {
  const { lang } = useLanguage()
  const maxWidth = width === 'narrow' ? 'max-w-3xl' : 'max-w-6xl'

  return (
    <footer className="border-t border-border">
      <div
        className={`mx-auto ${maxWidth} px-6 py-10 text-center font-sans text-xs uppercase tracking-widest text-muted-foreground`}
      >
        <div>{UI[lang].footer}</div>
        <div className="mt-3 flex flex-wrap items-center justify-center gap-x-3 gap-y-2 normal-case tracking-normal">
          <a
            href="mailto:iletisim@tibbimiras.com"
            className="transition-colors hover:text-primary"
          >
            iletisim@tibbimiras.com
          </a>
          <span className="text-border" aria-hidden="true">·</span>
          <Link
            href="/legal"
            className="transition-colors hover:text-primary"
          >
            Yasal Uyarılar ve Gizlilik
          </Link>
        </div>
      </div>
    </footer>
  )
}
