'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Check, Eraser, Lock, PenLine } from 'lucide-react'
import { UI, useLanguage } from '@/components/language-provider'
import { useAuth } from '@/components/auth-provider'
import { useEntitlements } from '@/components/entitlements-provider'
import type { Article, ArticleTerm, Lang } from '@/lib/types'
import { LinkedArticleText } from '@/components/linked-article-text'

const TABS: { key: Lang; label: string }[] = [{ key: 'tr', label: 'Türkçe' }, { key: 'en', label: 'English' }]

export function ArticleTabs({ article, terms = [], linksEnabled, onToggleLinks }: { article: Article; terms?: ArticleTerm[]; linksEnabled: boolean; onToggleLinks: () => void }) {
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
      <div className="flex flex-wrap items-center gap-2">
        <button type="button" onClick={() => setHighlighted((value) => !value)} aria-pressed={highlighted} className={`inline-flex items-center gap-2 rounded px-2 py-1 font-sans text-xs uppercase tracking-wider ${highlighted ? 'bg-primary/20 text-primary' : 'text-muted-foreground hover:text-primary'}`}><PenLine className="size-3.5" />{lang === 'tr' ? 'Kalemle işaretleyin' : 'Mark with pen'}</button>
        {highlighted ? <button type="button" onClick={() => { setHighlighted(false); window.getSelection()?.removeAllRanges() }} className="inline-flex items-center gap-2 rounded px-2 py-1 font-sans text-xs uppercase tracking-wider text-muted-foreground hover:text-primary"><Eraser className="size-3.5" />{lang === 'tr' ? 'İşaretleri temizle' : 'Clear marks'}</button> : null}
        <button type="button" onClick={onToggleLinks} aria-pressed={linksEnabled} className={`inline-flex items-center gap-2 rounded px-2 py-1 font-sans text-xs uppercase tracking-wider ${linksEnabled ? 'bg-sky-400/15 text-sky-500' : 'text-muted-foreground hover:text-sky-500'}`}><Check className="size-3.5" />{lang === 'tr' ? 'Mavi linkler' : 'Blue links'} {linksEnabled ? '✓' : ''}</button>
      </div>
    </div>
    <div role="tabpanel" className={`py-8 ${highlighted ? 'selection:bg-primary/35' : ''}`}>
      {body ? <LinkedArticleText text={body} terms={terms} activeArticleId={article.id} linksEnabled={linksEnabled} className="max-w-none text-pretty font-serif text-lg leading-relaxed text-foreground/90" /> : <p className="font-sans text-sm italic text-muted-foreground">{UI[active].emptyContent}</p>}
    </div>
    {premiumContent ? (entitlementsLoading ? <p className="font-sans text-xs text-muted-foreground">{lang === 'tr' ? 'Erişim kontrol ediliyor…' : 'Checking access…'}</p> : premium || platin ? <section className="rounded-md border border-primary/30 bg-card p-6"><h3 className="mb-3 font-serif text-xl text-primary">{lang === 'tr' ? 'Premium içerik' : 'Premium content'}</h3><LinkedArticleText text={premiumContent} terms={terms} activeArticleId={article.id} linksEnabled={linksEnabled} className="font-serif text-lg leading-relaxed text-foreground/90" /></section> : <section className="relative overflow-hidden rounded-md border border-primary/30 bg-card p-6"><div className="pointer-events-none select-none blur-sm" aria-hidden="true"><p className="font-serif text-lg leading-relaxed text-foreground/60">{premiumContent.slice(0, 280)}</p></div><div className="absolute inset-0 flex flex-col items-center justify-center bg-card/75 text-center"><Lock className="mb-2 size-5 text-primary" /><h3 className="font-serif text-xl text-foreground">{lang === 'tr' ? 'Premium devamı' : 'Premium continuation'}</h3><p className="mt-1 max-w-xs font-sans text-xs leading-relaxed text-muted-foreground">{user ? (lang === 'tr' ? 'Bu eser için premium veya platin erişimi gerekir.' : 'Premium or Platinum access is required for this work.') : (lang === 'tr' ? 'Devamını okumak için giriş yapın.' : 'Sign in to continue reading.')}</p><Link href={user ? '/settings' : '/login'} className="mt-4 rounded-md bg-primary px-4 py-2 font-sans text-xs uppercase tracking-wider text-primary-foreground">{user ? (lang === 'tr' ? 'Erişim seçenekleri' : 'Access options') : (lang === 'tr' ? 'Giriş yap' : 'Sign in')}</Link></div></section>) : null}
  </div>
}
