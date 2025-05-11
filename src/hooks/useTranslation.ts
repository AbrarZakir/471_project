import { useContext } from 'react'
import { LanguageContext } from '@/context/LanguageProvider'

export function useTranslation() {
  const ctx = useContext(LanguageContext)
  if (!ctx) {
    throw new Error('useTranslation must be used within LanguageProvider')
  }
  return ctx  // { lang, t, toggleLang }
}
