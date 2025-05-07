// src/app/dashboard/admin/page.tsx
'use client'
import useAuth from '@/hooks/useAuth'
import { useRouter } from 'next/navigation'

export default function AdminDashboardPage() {
  const { loading } = useAuth(['admin'])
  const router      = useRouter()

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        Loading…
      </div>
    )
  }

  return (
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
</div>

  )
}
