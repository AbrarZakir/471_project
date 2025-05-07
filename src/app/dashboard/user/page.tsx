// 'use client'
// import useAuth from '@/hooks/useAuth'

// export default function UserDashboardPage() {
//   const { loading } = useAuth(['user'])

//   if (loading) {
//     return <div className="flex items-center justify-center h-full">Loading…</div>
//   }

//   return (
//     <div>
//       {/* Your user‐specific content */}
//       <p>Welcome to your dashboard! Here you can view your applied jobs, courses, etc.</p>
//     </div>
//   )
// }

// 'use client'

// import { useRouter } from 'next/navigation'
// import useAuth from '@/hooks/useAuth'

// export default function UserDashboardPage() {
//   const { loading } = useAuth(['user'])
//   const router = useRouter()

//   if (loading) {
//     return <div className="flex items-center justify-center h-full">Loading…</div>
//   }

//   return (
//     <div className="p-6 space-y-6">
//       <h2 className="text-2xl font-bold">User Dashboard</h2>
//       <p className="text-gray-700">
//         Welcome to your dashboard! Here you can view your applied jobs, courses, etc.
//       </p>

//       <button
//         onClick={() => router.push('/dashboard/user/enroll')} // ✅ Fixed route
//         className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-500"
//       >
//         Enroll Course
//       </button>
//     </div>
//   )
// }


'use client'

import useAuth from '@/hooks/useAuth'
import { useRouter } from 'next/navigation'

export default function UserDashboardPage() {
  const { loading } = useAuth(['user'])
  const router = useRouter()

  if (loading) {
    return <div className="flex items-center justify-center h-full">Loading…</div>
  }

  return (
    <div className="p-6 space-y-4">
      <p>Welcome to your dashboard! Here you can view your applied jobs, courses, etc.</p>

      <button
        onClick={() => router.push('/dashboard/user/enroll')}
        className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-500"
      >
        Enroll in a Course
      </button>

      <button
        onClick={() => router.push('/dashboard/user/enrollments')}
        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-500"
      >
        View Enrolled Courses
      </button>
    </div>
  )
}



