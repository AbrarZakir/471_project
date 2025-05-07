'use client'

import { ReactNode } from 'react'
import Link from 'next/link'
import useAuth from '@/hooks/useAuth'

export default function JobsLayout({ children }: { children: ReactNode }) {
  const { loading, profile } = useAuth()
  if (loading) {
    return <div className="flex items-center justify-center h-full">Loading…</div>
  }

  const dashboardLink =
    profile?.role === 'admin'
      ? '/dashboard/admin'
      : '/dashboard/user'

  return (
    <div>
      <header className="bg-indigo-600 text-white p-4 flex justify-between items-center">
        <h1 className="text-xl font-semibold">Job Listings</h1>
        <Link href={dashboardLink} className="hover:underline">
          Dashboard
        </Link>
      </header>

      <main className="p-6">
        {children}
      </main>
    </div>
  )
}
// 'use client'

// import { ReactNode } from 'react'
// import Link from 'next/link'
// import { useRouter } from 'next/navigation'
// import { supabase } from '@/lib/supabaseClient'
// import useAuth from '@/hooks/useAuth'

// export default function AdminJobsLayout({ children }: { children: ReactNode }) {
//   const router = useRouter()
//   const { loading, profile } = useAuth(['admin'])

//   if (loading) {
//     return <div className="p-6">Loading…</div>
//   }

//   const handleLogout = async () => {
//     await supabase.auth.signOut()
//     router.replace('/login')
//   }

//   return (
//     <div>
//       <header className="bg-indigo-600 text-white p-4 flex justify-between items-center">
//         <div className="text-xl font-semibold">Manage Job Postings</div>
//         <div className="flex gap-2">
//           <Link
//             href="/dashboard/admin"
//             className="bg-white text-indigo-600 px-3 py-1 rounded hover:bg-gray-100"
//           >
//             Dashboard
//           </Link>
//           <button
//             onClick={handleLogout}
//             className="bg-white text-indigo-600 px-3 py-1 rounded hover:bg-gray-100"
//           >
//             Logout
//           </button>
//         </div>
//       </header>

//       <main className="p-6">
//         {children}
//       </main>
//     </div>
//   )
// }








