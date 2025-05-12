'use client'

import { useContext } from 'react'
import { FaUser, FaBriefcase, FaClipboardList, FaFileAlt} from 'react-icons/fa'
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
    <div className="p-6 space-y-4 relative min-h-screen">
      <p className="flex items-center gap-2 text-lg font-medium">
        <FaUser /> {t('welcomeDashboard')}
      </p>

      <button
        onClick={() => router.push('/dashboard/user/enroll')}
        className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-500"
      >
        <FaClipboardList /> {t('enrollInCourse')}
      </button>

      <button
        onClick={() => router.push('/dashboard/user/enrollments')}
        className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-500"
      >
        <FaClipboardList /> {t('viewEnrolledCourses')}
      </button>

      <button
        onClick={() => router.push('/dashboard/user/apply')}
        className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-500"
      >
        <FaBriefcase /> {t('applyForJobs')}
      </button>
      <button
          onClick={() => router.push('/dashboard/user/feedback')}
          className="fixed bottom-4 right-4 bg-purple-600 text-white px-4 py-2 rounded-full shadow-lg hover:bg-purple-500"
        >
          Feedback
        </button>

      <button
        onClick={() => router.push('/dashboard/user/applications')}
        className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-500"
      >
        <FaBriefcase /> {t('myApplications')}
      </button>
      {/* ——— New CV Generator Button ——— */}
      <button
          onClick={() => router.push('/dashboard/user/cv')}
          className="flex items-center gap-2 bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-500"
        >
          <FaFileAlt /> {t('generateCV')}
        </button>
    </div>
  )
}
