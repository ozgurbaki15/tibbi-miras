'use client'

import { createContext, useCallback, useContext, useRef, useState } from 'react'
import { X, Smartphone } from 'lucide-react'
import { useLanguage } from '@/components/language-provider'

type PurchaseNoticeContextValue = {
  /** Shows the notice immediately, with no pending action (e.g. on page open). */
  showNotice: () => void
  /** Shows the notice and, once acknowledged, runs the given action. */
  requestPurchase: (proceed: () => void) => void
}

const PurchaseNoticeContext = createContext<PurchaseNoticeContextValue | null>(null)

const MESSAGE = {
  tr: "Şimdilik satın alma işlemleri sadece Android Google Play Mağazası'ndaki uygulamamız üzerinden gerçekleştirilebilmektedir. Uygulamada satın alınan üyelikler websitemizde de geçerli olmaya devam etmektedir. Premium veya platin üyelik isteyen kullanıcıların uygulama üzerinden alması ve aynı e-mail veya google hesabı üzerinden giriş yapması rica olunur. İlgi, talep ve etkileşim arttıkça websitemiz üzerindeki yatırımlarımız da artacak inşallah. Anlayışınız için teşekkür ederiz.",
  en: "For now, purchases can only be made through our app on the Android Google Play Store. Memberships purchased in the app remain valid on our website as well. Users who want a Premium or Platin membership are kindly asked to buy it through the app and sign in on the website with the same email or Google account. As interest, demand and engagement grow, our investment in the website will grow too, God willing. Thank you for your understanding.",
} as const

export function PurchaseNoticeProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false)
  const pendingAction = useRef<(() => void) | null>(null)

  const showNotice = useCallback(() => {
    pendingAction.current = null
    setOpen(true)
  }, [])

  const requestPurchase = useCallback((proceed: () => void) => {
    pendingAction.current = proceed
    setOpen(true)
  }, [])

  const close = useCallback(() => {
    setOpen(false)
    pendingAction.current = null
  }, [])

  const confirm = useCallback(() => {
    const action = pendingAction.current
    setOpen(false)
    pendingAction.current = null
    if (action) action()
  }, [])

  return (
    <PurchaseNoticeContext.Provider value={{ showNotice, requestPurchase }}>
      {children}
      {open ? <PurchaseNoticeDialog onClose={close} onConfirm={confirm} /> : null}
    </PurchaseNoticeContext.Provider>
  )
}

function PurchaseNoticeDialog({ onClose, onConfirm }: { onClose: () => void; onConfirm: () => void }) {
  const { lang } = useLanguage()
  const tr = lang === 'tr'

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-labelledby="purchase-notice-heading">
      <button type="button" aria-label={tr ? 'Kapat' : 'Close'} onClick={onClose} className="absolute inset-0 bg-foreground/40 backdrop-blur-[2px]" />
      <div className="relative flex w-full max-w-md flex-col gap-4 rounded-xl border border-primary/40 bg-card p-6 shadow-2xl">
        <button type="button" onClick={onClose} aria-label={tr ? 'Kapat' : 'Close'} className="absolute right-4 top-4 inline-flex size-8 items-center justify-center rounded-full text-muted-foreground hover:bg-muted hover:text-foreground">
          <X className="size-4" />
        </button>
        <div className="flex items-center gap-2.5 pr-8">
          <Smartphone className="size-5 shrink-0 text-primary" aria-hidden="true" />
          <h2 id="purchase-notice-heading" className="font-serif text-xl text-card-foreground">{tr ? 'Satın Alma Hakkında' : 'About Purchases'}</h2>
        </div>
        <p className="text-pretty font-sans text-sm leading-relaxed text-muted-foreground">{MESSAGE[lang]}</p>
        <a
          href="https://play.google.com/store/apps/details?id=com.freedscience.app"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 rounded-md border border-primary/60 px-4 py-2.5 font-sans text-xs uppercase tracking-wider text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
        >
          {tr ? "Google Play'de Aç" : 'Open on Google Play'}
        </a>
        <button type="button" onClick={onConfirm} className="rounded-md bg-primary px-4 py-2.5 font-sans text-xs uppercase tracking-wider text-primary-foreground transition-colors hover:opacity-90">
          {tr ? 'Anladım, devam et' : 'Understood, continue'}
        </button>
      </div>
    </div>
  )
}

export function usePurchaseNotice() {
  const ctx = useContext(PurchaseNoticeContext)
  if (!ctx) throw new Error('usePurchaseNotice must be used within a PurchaseNoticeProvider')
  return ctx
}
