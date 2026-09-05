'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Highlighter, Lock } from 'lucide-react'
import { UI, useLanguage } from '@/components/language-provider'
import { useAuth } from '@/components/auth-provider'
import { useEntitlements } from '@/components/entitlements-provider'
import type { Article, Lang } from '@/lib/types'

const TABS: { key: Lang; label: string }[] = [{ key: 'tr', label: 'Türkçe' }, { key: 'en', label: 'English' }]

export function ArticleTabs({ article }: { article: Article }) {
  const { lang } = useLanguage()
  const { user } = useAuth()
  const { premium, platin, loading: entitlementsLoading } = useEntitlements()
  const [active, setActive] = useState<Lang>(lang)
  const [highlighted, setHighlighted] = useState(false)
  useEffect(() => setActive(lang), [lang])
  const body = active === 'tr' ? article.free_content_tr : article.free_content_en
  const premiumContent = active === 'tr' ? article.premium_content_tr : article.premium_content_en

  return <div>
    <div role="tablist" aria-label="Metin dili / Text language" className="flex flex-wrap gap-1 border-b border-border">
      {TABS.map((tab) => <button key={tab.key} role="tab" type="button" aria-selected={tab.key === active} onClick={() => setActive(tab.key)} className={`-mb-px border-b-2 px-4 py-3 font-sans text-sm font-medium uppercase tracking-wider transition-colors ${tab.key === active ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'}`}>{tab.label}</button>)}
    </div>
    <div className="flex items-center justify-between border-b border-border/60 py-3">
      <span className="font-sans text-xs uppercase tracking-wider text-muted-foreground">{active === 'tr' ? 'Serbest metin' : 'Open text'}</span>
      <button type="button" onClick={() => setHighlighted((value) => !value)} aria-pressed={highlighted} className={`inline-flex items-center gap-2 rounded px-2 py-1 font-sans text-xs uppercase tracking-wider ${highlighted ? 'bg-primary/20 text-primary' : 'text-muted-foreground hover:text-primary'}`}><Highlighter className="size-3.5" />{highlighted ? 'Vurgu açık' : 'Vurgula'}</button>
    </div>
    <div role="tabpanel" className={`py-8 ${highlighted ? 'selection:bg-primary/35' : ''}`}>
      {body ? <div className="max-w-none whitespace-pre-wrap text-pretty font-serif text-lg leading-relaxed text-foreground/90">{body}</div> : <p className="font-sans text-sm italic text-muted-foreground">{UI[active].emptyContent}</p>}
    </div>
    {premiumContent ? (entitlementsLoading ? <p className="font-sans text-xs text-muted-foreground">Erişim kontrol ediliyor…</p> : premium || platin ? <section className="rounded-md border border-primary/30 bg-card p-6"><h3 className="mb-3 font-serif text-xl text-primary">Premium içerik</h3><div className="whitespace-pre-wrap font-serif text-lg leading-relaxed text-foreground/90">{premiumContent}</div></section> : <section className="relative overflow-hidden rounded-md border border-primary/30 bg-card p-6"><div className="pointer-events-none select-none blur-sm" aria-hidden="true"><p className="font-serif text-lg leading-relaxed text-foreground/60">{premiumContent.slice(0, 280)}</p></div><div className="absolute inset-0 flex flex-col items-center justify-center bg-card/75 text-center"><Lock className="mb-2 size-5 text-primary" /><h3 className="font-serif text-xl text-foreground">Premium devamı</h3><p className="mt-1 max-w-xs font-sans text-xs leading-relaxed text-muted-foreground">{user ? 'Bu eser için premium veya platin erişimi gerekir.' : 'Devamını okumak için giriş yapın.'}</p><Link href={user ? '/settings' : '/login'} className="mt-4 rounded-md bg-primary px-4 py-2 font-sans text-xs uppercase tracking-wider text-primary-foreground">{user ? 'Erişim seçenekleri' : 'Giriş yap'}</Link></div></section>) : null}
  </div>
}
