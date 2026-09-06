'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react'
import type { Lang } from '@/lib/types'

type LanguageContextValue = {
  lang: Lang
  setLang: (lang: Lang) => void
  toggle: () => void
}

const LanguageContext = createContext<LanguageContextValue | null>(null)

const STORAGE_KEY = 'tma-lang'

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>('tr')

  // Restore the previously chosen language on mount.
  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY)
    if (stored === 'tr' || stored === 'en') {
      setLangState(stored)
    }
  }, [])

  const setLang = useCallback((next: Lang) => {
    setLangState(next)
    window.localStorage.setItem(STORAGE_KEY, next)
    document.documentElement.lang = next
  }, [])

  const toggle = useCallback(() => {
    setLang(lang === 'tr' ? 'en' : 'tr')
  }, [lang, setLang])

  return (
    <LanguageContext.Provider value={{ lang, setLang, toggle }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const ctx = useContext(LanguageContext)
  if (!ctx) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return ctx
}

/** Small UI string dictionary keyed by language. */
export const UI = {
  tr: {
    eyebrow: 'Freed Science',
    intro:
      'Botanik levhalardan anatomi gravürlerine, eczacılık terkiplerinden gök cisimlerine uzanan tıp tarihinin nadide el yazmaları ve basılı eserleri. Şifanın binlerce yıllık hafızasını tek bir çatı altında derliyoruz.',
    collection: 'Koleksiyon',
    countSuffix: 'eser · sürekli genişleyen dijital derlem',
    selection: 'Görsel arşivden seçkiler',
    searchPlaceholder: 'Eser başlığına göre ara…',
    searchLabel: 'Eserleri başlığa göre ara',
    noResults: 'ile eşleşen bir eser bulunamadı.',
    readMore: 'Devamını Oku',
    back: 'Arşive Dön',
    modernText: 'Günümüz Metni',
    originalHeading: 'Orijinal Tarihî Metin',
    originalNote: 'Eserin özgün nüshasından aktarılmıştır.',
    emptyContent: 'Bu sürüm için metin henüz mevcut değil.',
    footer: 'Tıbbi Miras Arşivi · Kaybolan Tıbbın İhyası',
  },
  en: {
    eyebrow: 'Freed Science',
    intro:
      'Rare manuscripts and printed works spanning the history of medicine — from botanical plates and anatomical engravings to apothecary formulas and celestial charts. We gather the millennia-old memory of healing under a single roof.',
    collection: 'Collection',
    countSuffix: 'works · a continually growing digital corpus',
    selection: 'Selections from the visual archive',
    searchPlaceholder: 'Search by title…',
    searchLabel: 'Search works by title',
    noResults: 'did not match any work.',
    readMore: 'Read More',
    back: 'Back to Archive',
    modernText: 'Modern Text',
    originalHeading: 'Original Historical Text',
    originalNote: 'Transcribed from the original manuscript.',
    emptyContent: 'Text for this version is not available yet.',
    footer: 'Medical Heritage Archive · Unearthing Lost Wisdom',
  },
} as const
