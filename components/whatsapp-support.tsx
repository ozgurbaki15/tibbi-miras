'use client'

import { MessageCircle } from 'lucide-react'

const WHATSAPP_URL = 'https://wa.me/90544353301?text=Merhaba%2C%20sipari%C5%9Fim%20hakk%C4%B1nda%20destek%20almak%20istiyorum.'

export function WhatsAppSupport({ label = 'WhatsApp destek' }: { label?: string }) {
  return (
    <a href={WHATSAPP_URL} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-md border border-primary/50 bg-primary/10 px-4 py-3 font-sans text-xs font-medium uppercase tracking-wider text-primary transition-colors hover:bg-primary/20">
      <MessageCircle className="size-4" aria-hidden="true" />
      {label}
    </a>
  )
}
