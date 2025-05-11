'use client'
import { createContext, useState, useEffect, ReactNode } from 'react'
import en from '@/translations/en.json'
import bn from '@/translations/bn.json'

export type Lang = 'en' | 'bn'
export type Translations = typeof en

interface ContextValue {
  lang: Lang
  t: (key: keyof Translations) => string
  toggleLang: () => void
}

export const LanguageContext = createContext<ContextValue | undefined>(undefined)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>('en')
  const dict = lang === 'en' ? en : bn

  // on mount, read from localStorage if present
  useEffect(() => {
    const stored = localStorage.getItem('lang')
    if (stored === 'bn' || stored === 'en') setLang(stored)
  }, [])

  // whenever lang changes, persist it
  useEffect(() => {
    localStorage.setItem('lang', lang)
  }, [lang])

  const toggleLang = () => setLang((l) => (l === 'en' ? 'bn' : 'en'))
  const t = (key: keyof Translations) => dict[key] || key

  return (
    <LanguageContext.Provider value={{ lang, t, toggleLang }}>
      {children}
    </LanguageContext.Provider>
  )
}
