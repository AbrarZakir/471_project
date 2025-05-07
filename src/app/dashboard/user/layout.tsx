'use client'

import { ReactNode } from 'react'
import useAuth from '@/hooks/useAuth'

export default function UserLayout({ children }: { children: ReactNode }) {
  const { loading } = useAuth(['user'])

  if (loading) return <div className="p-6">Loading…</div>

  return (
    <main className="p-6">
      {children}
    </main>
  )
}
