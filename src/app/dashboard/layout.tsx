'use client'
import { ReactNode, useContext } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import useAuth from '@/hooks/useAuth'
import { supabase } from '@/lib/supabaseClient'
import Link from 'next/link'
import LanguageToggle from '@/app/components/LanguageToggle'
import { LanguageContext } from '@/context/LanguageProvider'

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const router   = useRouter()
  const pathname = usePathname() || ''
  const { loading, profile } = useAuth()
  const langCtx = useContext(LanguageContext)!
  const t = langCtx.t

  if (loading) {
    return <div className="flex items-center justify-center h-full">Loading…</div>
  }

  let titleKey = 'dashboard'
  if (pathname.startsWith('/dashboard/admin'))  titleKey = 'adminDashboard'
  else if (pathname.startsWith('/dashboard/user')) titleKey = 'userDashboard'

  const profileLink =
    profile?.role === 'admin'
      ? '/dashboard/admin/profile'
      : '/dashboard/user/profile'

  return (
    <div className="min-h-full">
      <header className="bg-indigo-600 text-white p-4 flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <h1 className="text-xl font-semibold">{t(titleKey as any)}</h1>
          <LanguageToggle />
          <Link href={profileLink} className="hover:underline">
            {t('profile')}
          </Link>
          <Link href="/jobs" className="hover:underline">
            {t('jobListings')}
          </Link>
        </div>
        <button
          onClick={async () => {
            await supabase.auth.signOut()
            router.push('/login')
          }}
          className="px-3 py-1 bg-indigo-500 hover:bg-indigo-400 rounded"
        >
          {t('logout')}
        </button>
      </header>
      <main className="p-6">{children}</main>
    </div>
  )
}
