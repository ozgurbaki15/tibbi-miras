'use client'

import { UI, useLanguage } from '@/components/language-provider'

export function SiteFooter({ width = 'wide' }: { width?: 'wide' | 'narrow' }) {
  const { lang } = useLanguage()
  const maxWidth = width === 'narrow' ? 'max-w-3xl' : 'max-w-6xl'

  return (
    <footer className="border-t border-border">
      <div
        className={`mx-auto ${maxWidth} px-6 py-10 text-center font-sans text-xs uppercase tracking-widest text-muted-foreground`}
      >
        {UI[lang].footer}
      </div>
    </footer>
  )
}
