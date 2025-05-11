'use client'

import useAuth from '@/hooks/useAuth'
import { useRouter } from 'next/navigation'

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
      <p>Welcome to your dashboard! Here you can view your applied jobs, courses, etc.</p>

      <button
        onClick={() => router.push('/dashboard/user/enroll')}
        className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-500"
      >
        Enroll in a Course
      </button>

      <button
        onClick={() => router.push('/dashboard/user/enrollments')}
        className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-500"
      >
        View Enrolled Courses
      </button>

    </div>
  )
}
