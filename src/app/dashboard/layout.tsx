// src/app/dashboard/layout.tsx
'use client'
import { ReactNode } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import useAuth from '@/hooks/useAuth'
import { supabase } from '@/lib/supabaseClient'
import Link from 'next/link'

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const router   = useRouter()
  const pathname = usePathname() || ''
  const { loading, profile } = useAuth()  // now pulling profile too

  if (loading) {
    return <div className="flex items-center justify-center h-full">Loading…</div>
  }

  // Header title
  let title = 'Dashboard'
  if (pathname.startsWith('/dashboard/admin')) title = 'Admin Dashboard'
  else if (pathname.startsWith('/dashboard/user')) title = 'User Dashboard'

  // Dynamic profile link
  const profileLink =
    profile?.role === 'admin'
      ? '/dashboard/admin/profile'
      : '/dashboard/user/profile'

  return (
    <div className="min-h-full">
      <header className="bg-indigo-600 text-white p-4 flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <h1 className="text-xl font-semibold">{title}</h1>
          <Link href={profileLink} className="hover:underline">
            Profile
          </Link>
          <Link href="/jobs" className="hover:underline">
            Job Listings
          </Link>
        </div>
        <button
          onClick={async () => {
            await supabase.auth.signOut()
            router.push('/login')
          }}
          className="px-3 py-1 bg-indigo-500 hover:bg-indigo-400 rounded"
        >
          Logout
        </button>
      </header>
      <main className="p-6">{children}</main>
    </div>
  )
}
