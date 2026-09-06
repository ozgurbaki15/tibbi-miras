'use client'

import { useState } from 'react'
import { Check, Copy } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useEntitlements } from '@/components/entitlements-provider'

const FREE_LIMITS = { free: 3, premium: 10, platin: 15 }
const PREMIUM_LIMITS = { free: 0, premium: 3, platin: 5 }

export function CopyButton({ text, isPremiumContent = false, isPlatinContent = false }: { text: string; isPremiumContent?: boolean; isPlatinContent?: boolean }) {
  const [copied, setCopied] = useState(false)
  const [remaining, setRemaining] = useState<number | null>(null)
  const { premium, platin } = useEntitlements()

  function copyKey() {
    const now = new Date()
    if (now.getHours() < 6) now.setDate(now.getDate() - 1)
    return `tibbimiras-copy-${isPremiumContent ? 'premium' : 'free'}-${now.toISOString().slice(0, 10)}`
  }

  async function copyText() {
    if (isPlatinContent) return
    const tier = platin ? 'platin' : premium ? 'premium' : 'free'
    const limit = (isPremiumContent ? PREMIUM_LIMITS : FREE_LIMITS)[tier]
    const key = copyKey()
    const used = Number(window.localStorage.getItem(key) ?? '0')
    if (used >= limit) {
      window.alert(`Günlük kopyalama hakkınız doldu. Kalan hak: 0 / ${limit}`)
      return
    }
    await navigator.clipboard.writeText(text)
    window.localStorage.setItem(key, String(used + 1))
    setRemaining(Math.max(0, limit - used - 1))
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1600)
  }

  return (
    <Button type="button" onClick={copyText} aria-label="Metni kopyala" className="fixed bottom-5 right-5 z-50 rounded-full border-2 border-emerald-300 bg-emerald-600 px-5 py-3 font-sans text-xs font-semibold uppercase tracking-wider text-white shadow-[0_8px_30px_rgba(16,185,129,0.35)] transition hover:bg-emerald-500">
      {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
      <span>{copied ? 'Kopyalandı' : 'Kopyala'}</span>
      {remaining !== null ? <span className="rounded-full bg-white/20 px-2 py-0.5 text-[10px]">{remaining}</span> : null}
    </Button>
  )
}
