'use client'

import { useState } from 'react'
import { Check, Copy } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useEntitlements } from '@/components/entitlements-provider'

const FREE_LIMITS = { free: 3, premium: 10, platin: 15 }
const PREMIUM_LIMITS = { free: 0, premium: 3, platin: 5 }

export function CopyButton({ text, isPremiumContent = false, isPlatinContent = false }: { text: string; isPremiumContent?: boolean; isPlatinContent?: boolean }) {
  const [copied, setCopied] = useState(false)
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
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1600)
  }

  return (
    <Button type="button" variant="outline" size="sm" onClick={copyText} aria-label="Metni kopyala">
      {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
      {copied ? 'Kopyalandı' : 'Kopyala'}
    </Button>
  )
}
