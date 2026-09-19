'use client'

import { createContext, useContext, useEffect, useState } from 'react'

export type ThemeName = 'parchment' | 'obsidian' | 'manuscript' | 'herbarium' | 'celestial' | 'image-focus' | 'menu-default'

type ThemeContextValue = {
  theme: ThemeName
  setTheme: (theme: ThemeName) => void
}

const ThemeContext = createContext<ThemeContextValue | null>(null)
const STORAGE_KEY = 'tma-theme'

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<ThemeName>('parchment')

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY)
    if (stored === 'parchment' || stored === 'obsidian' || stored === 'manuscript' || stored === 'herbarium' || stored === 'celestial' || stored === 'image-focus' || stored === 'menu-default') setThemeState(stored)
  }, [])

  useEffect(() => {
    document.documentElement.dataset.theme = theme
  }, [theme])

  function setTheme(next: ThemeName) {
    setThemeState(next)
    window.localStorage.setItem(STORAGE_KEY, next)
  }

  return <ThemeContext.Provider value={{ theme, setTheme }}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) throw new Error('useTheme must be used within ThemeProvider')
  return context
}
