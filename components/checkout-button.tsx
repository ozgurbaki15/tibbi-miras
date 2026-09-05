'use client'

import { useState } from 'react'
import { createCheckoutSession } from '@/app/actions/stripe'

export function CheckoutButton({ productId, label }: { productId: string; label: string }) {
  const [busy, setBusy] = useState(false)
  async function start() {
    setBusy(true)
    try {
      const url = await createCheckoutSession(productId)
      if (url) window.location.assign(url)
    } finally { setBusy(false) }
  }
  return <button type="button" onClick={start} disabled={busy} className="rounded-md bg-primary px-4 py-2 font-sans text-xs uppercase tracking-wider text-primary-foreground disabled:opacity-50">{busy ? 'Yükleniyor…' : label}</button>
}
