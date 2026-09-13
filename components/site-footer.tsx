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
          <Link href="/uyelikler" className="transition-colors hover:text-primary">Üyelikler</Link>
          <span className="text-border" aria-hidden="true">·</span>
          <Link href="/legal/mesafeli-satis" className="transition-colors hover:text-primary">Mesafeli Satış</Link>
          <span className="text-border" aria-hidden="true">·</span>
          <Link href="/legal/iade-iptal" className="transition-colors hover:text-primary">İptal ve İade</Link>
          <span className="text-border" aria-hidden="true">·</span>
          <Link href="/legal" className="transition-colors hover:text-primary">Yasal Uyarılar ve Gizlilik</Link>
          <span className="text-border" aria-hidden="true">·</span>
          <Link href="/iletisim" className="transition-colors hover:text-primary">İletişim</Link>
        </div>
      </div>
    </footer>
  )
}
