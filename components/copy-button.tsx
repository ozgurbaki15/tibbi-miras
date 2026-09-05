'use client'

import { useState } from 'react'
import { Check, Copy } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)

  async function copyText() {
    await navigator.clipboard.writeText(text)
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
