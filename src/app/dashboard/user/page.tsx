'use client'

import { useContext } from 'react'
import { useRouter } from 'next/navigation'
import useAuth from '@/hooks/useAuth'
import { LanguageContext } from '@/context/LanguageProvider'

export default function UserDashboardPage() {
  const { loading } = useAuth(['user'])
  const router = useRouter()
  const { t } = useContext(LanguageContext)!

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        {t('loading')}
      </div>
    )
  }

  return (
    <div className="p-6 space-y-4">
      <p>{t('welcomeDashboard')}</p>

      <button
        onClick={() => router.push('/dashboard/user/enroll')}
        className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-500"
      >
        {t('enrollInCourse')}
      </button>

      <button
        onClick={() => router.push('/dashboard/user/enrollments')}
        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-500"
      >
        {t('viewEnrolledCourses')}
      </button>
    </div>
  )
}
