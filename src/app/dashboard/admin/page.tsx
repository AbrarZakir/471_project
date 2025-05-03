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
    <div className="space-y-6">
      {/* Button to go directly to Job Postings */}
      <div>
        <button
          onClick={() => router.push('/dashboard/admin/jobs')}
          className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-600"
        >
          Manage Job Postings
        </button>
      </div>

      {/* Rest of your dashboard content */}
      
    </div>
  )
}
