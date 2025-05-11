'use client'
import { useTranslation } from '@/hooks/useTranslation'

export default function LanguageToggle() {
  const { lang, toggleLang, t } = useTranslation()
  return (
    <button
      onClick={toggleLang}
      className="px-2 py-1 bg-white text-indigo-600 rounded hover:bg-gray-100"
      title="Toggle language"
    >
      {lang === 'en' ? 'EN' : 'বাংলা'}
    </button>
  )
}
