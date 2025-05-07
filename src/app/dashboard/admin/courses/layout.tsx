'use client'

import { ReactNode } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabaseClient'
import { useRouter } from 'next/navigation'
import useAuth from '@/hooks/useAuth'

export default function AdminCoursesLayout({ children }: { children: ReactNode }) {
  const router = useRouter()
  const { loading, profile } = useAuth(['admin'])

  if (loading) return <div className="p-6">Loading…</div>

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.replace('/login')
  }

  return (
    <div>
      <header className="bg-indigo-600 text-white p-4 flex justify-between items-center">
        <h1 className="text-xl font-semibold">Manage Courses</h1>
        <div className="flex gap-3">
          <Link
            href="/dashboard/admin"
            className="bg-indigo-500 text-white px-4 py-2 rounded hover:bg-indigo-400"
          >
            Dashboard
          </Link>
          {/* <button
            onClick={handleLogout}
            className="bg-white text-indigo-600 px-3 py-1 rounded shadow hover:bg-gray-100"
          >
            Logout
          </button> */}
        </div>
      </header>

      <main className="p-6">{children}</main>
    </div>
  )
}
