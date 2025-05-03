'use client'
import useAuth from '@/hooks/useAuth'

export default function UserDashboardPage() {
  const { loading } = useAuth(['user'])

  if (loading) {
    return <div className="flex items-center justify-center h-full">Loading…</div>
  }

  return (
    <div>
      {/* Your user‐specific content */}
      <p>Welcome to your dashboard! Here you can view your applied jobs, courses, etc.</p>
    </div>
  )
}
