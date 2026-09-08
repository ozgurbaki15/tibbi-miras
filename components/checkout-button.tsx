'use client'

import { useState } from 'react'
import { createPaytrPayment } from '@/app/actions/paytr'
import { useLanguage } from '@/components/language-provider'

const ERRORS: Record<string, { tr: string; en: string }> = {
  auth_required: { tr: 'Ödeme için giriş yapın.', en: 'Please sign in to pay.' },
  not_configured: { tr: 'Ödeme sistemi henüz yapılandırılmadı.', en: 'Payments are not configured yet.' },
  upgrade_not_eligible: { tr: 'Bu yükseltme yalnızca ömürlük Premium üyeler içindir.', en: 'This upgrade is for lifetime Premium members only.' },
  paytr_rejected: { tr: 'Ödeme başlatılamadı, tekrar deneyin.', en: 'Payment could not start, try again.' },
  network: { tr: 'Bağlantı hatası, tekrar deneyin.', en: 'Connection error, try again.' },
  invalid_product: { tr: 'Geçersiz ürün.', en: 'Invalid product.' },
  missing_article: { tr: 'Makale bulunamadı.', en: 'Article not found.' },
}

export function CheckoutButton({ productId, label, articleId, variant = 'solid' }: { productId: string; label: string; articleId?: string; variant?: 'solid' | 'outline' }) {
  const { lang } = useLanguage()
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState('')

  async function start() {
    setBusy(true)
    setMessage('')
    try {
      const result = await createPaytrPayment(productId, articleId)
      if (result.ok) window.location.assign(result.iframeUrl)
      else setMessage((ERRORS[result.error] ?? ERRORS.paytr_rejected)[lang])
    } catch {
      setMessage(ERRORS.network[lang])
    } finally {
      setBusy(false)
    }
  }

  const base = variant === 'outline'
    ? 'border border-primary/60 text-primary hover:bg-primary hover:text-primary-foreground'
    : 'bg-primary text-primary-foreground hover:opacity-90'

  return (
    <div className="flex flex-col gap-1">
      <button type="button" onClick={start} disabled={busy} className={`rounded-md px-4 py-2 font-sans text-xs uppercase tracking-wider transition-colors disabled:opacity-50 ${base}`}>
        {busy ? (lang === 'tr' ? 'Yükleniyor…' : 'Loading…') : label}
      </button>
      {message ? <p className="font-sans text-xs text-destructive">{message}</p> : null}
    </div>
  )
}
