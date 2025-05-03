'use client'

import { ReactNode } from 'react'
import Link from 'next/link'
import useAuth from '@/hooks/useAuth'

export default function JobsLayout({ children }: { children: ReactNode }) {
  const { loading, profile } = useAuth()
  if (loading) {
    return <div className="flex items-center justify-center h-full">Loading…</div>
  }

  const dashboardLink =
    profile?.role === 'admin'
      ? '/dashboard/admin'
      : '/dashboard/user'

  return (
    <div>
      <header className="bg-indigo-600 text-white p-4 flex justify-between items-center">
        <h1 className="text-xl font-semibold">Job Listings</h1>
        <Link href={dashboardLink} className="hover:underline">
          Dashboard
        </Link>
      </header>

      <main className="p-6">
        {children}
      </main>
    </div>
  )
}
