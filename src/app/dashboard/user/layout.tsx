'use client'

import { ReactNode, useContext } from 'react'
import useAuth from '@/hooks/useAuth'
import { LanguageContext } from '@/context/LanguageProvider'

export default function UserLayout({ children }: { children: ReactNode }) {
  const { loading } = useAuth(['user'])
  const { t } = useContext(LanguageContext)!

  if (loading) {
    return <div className="p-6">{t('loading')}</div>
  }

  return <main className="p-6">{children}</main>
}
