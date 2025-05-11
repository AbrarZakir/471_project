'use client'

import { FaUser, FaBriefcase, FaClipboardList, FaCommentDots } from 'react-icons/fa'
import { useRouter } from 'next/navigation'
import useAuth from '@/hooks/useAuth'

export default function UserDashboardPage() {
  const { loading } = useAuth(['user'])
  const router = useRouter()

  if (loading) {
    return <div className="flex items-center justify-center h-full">Loading…</div>
  }

  return (
    <div className="p-6 space-y-4 relative min-h-screen">
      <p className="flex items-center gap-2 text-lg font-medium">
        <FaUser /> Welcome to your dashboard! Here you can view your applied jobs, courses, etc.
      </p>

      <button
        onClick={() => router.push('/dashboard/user/enroll')}
        className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-500"
      >
        <FaClipboardList /> Enroll in a Course
      </button>

      <button
        onClick={() => router.push('/dashboard/user/enrollments')}
        className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-500"
      >
        <FaClipboardList /> View Enrolled Courses
      </button>

      <button
        onClick={() => router.push('/dashboard/user/apply')}
        className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-500"
      >
        <FaBriefcase /> Apply for Jobs
      </button>

      <button
        onClick={() => router.push('/dashboard/user/applications')}
        className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-500"
      >
        <FaBriefcase /> My Applications
      </button>

    </div>
  )
}
