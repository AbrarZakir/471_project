'use client'

import useAuth from '@/hooks/useAuth'
import { useRouter } from 'next/navigation'

export default function AdminDashboardPage() {
  const { loading } = useAuth(['admin'])
  const router = useRouter()

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        Loading…
      </div>
    )
  }

  return (
    <div className="p-6 relative min-h-screen">
      <div className="flex gap-4">
        <button
          onClick={() => router.push('/dashboard/admin/jobs')}
          className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-500"
        >
          Manage Job Postings
        </button>

        <button
          onClick={() => router.push('/dashboard/admin/courses')}
          className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-500"
        >
          Manage Courses
        </button>

        <button
          onClick={() => router.push('/dashboard/admin/applications')}
          className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-500"
        >
          View Applications
        </button>
      </div>

      <button
        onClick={() => router.push('/dashboard/admin/feedbacks')}
        className="fixed bottom-6 right-6 bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-500 shadow-lg"
      >
        View Feedback
      </button>
    </div>
  )
}
