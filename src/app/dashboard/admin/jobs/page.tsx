// 'use client'

// import { useState, useEffect } from 'react'
// import { useRouter }            from 'next/navigation'
// import useAuth                  from '@/hooks/useAuth'
// import { supabase }             from '@/lib/supabaseClient'
// import Link                     from 'next/link'

// type Job = {
//   id: string
//   title: string
//   description: string
//   country: string
//   salary_min: number | null
//   salary_max: number | null
//   qualifications: string | null
// }

// export default function AgencyJobsPage() {
//   const { loading } = useAuth(['admin'])   // your “agency” role
//   const router     = useRouter()
//   const [jobs, setJobs]         = useState<Job[]>([])
//   const [loadingJobs, setLoadingJobs] = useState(true)

//   useEffect(() => {
//     if (loading) return

//     ;(async () => {
//       // 1) get current user's profile id
//       const {
//         data: { session },
//       } = await supabase.auth.getSession()

//       const userId = session?.user.id
//       if (!userId) {
//         router.replace('/login')
//         return
//       }

//       const { data: profile, error: profErr } = await supabase
//         .from('profiles')
//         .select('id')
//         .eq('user_id', userId)
//         .single()
//       if (profErr || !profile) {
//         console.error(profErr)
//         setLoadingJobs(false)
//         return
//       }

//       // 2) fetch jobs belonging to that agency
//       const { data: jobs, error: jobsErr } = await supabase
//         .from('jobs')
//         .select('*')
//         .eq('agency_id', profile.id)
//         .order('created_at', { ascending: false })

//       if (jobsErr) {
//         console.error(jobsErr)
//       } else {
//         setJobs(jobs)
//       }
//       setLoadingJobs(false)
//     })()
//   }, [loading, router])

//   if (loading || loadingJobs) {
//     return <div className="flex items-center justify-center h-full">Loading…</div>
//   }

//   return (
//     <div>
//       <div className="flex justify-between items-center mb-6">
//         <h2 className="text-2xl font-bold">My Job Postings</h2>
//         <Link
//           href="/dashboard/admin/jobs/new"
//           className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-500"
//         >
//           + New Job
//         </Link>
//       </div>

//       {jobs.length === 0 ? (
//         <p>No jobs posted yet.</p>
//       ) : (
//         <ul className="space-y-4">
//           {jobs.map((job) => (
//             <li
//               key={job.id}
//               className="border rounded p-4 hover:shadow-md transition-shadow"
//             >
//               <h3 className="text-xl font-semibold">{job.title}</h3>
//               <p className="text-gray-600 text-sm">
//                 {job.country} &bull;{' '}
//                 {job.salary_min ?? '—'} - {job.salary_max ?? '—'}
//               </p>
//               <p className="mt-2 text-gray-800">{job.description}</p>
//               <Link
//                 href={`/dashboard/admin/jobs/${job.id}`}
//                 className="mt-3 inline-block text-indigo-600 hover:underline"
//               >
//                 View Applications
//               </Link>
//             </li>
//           ))}
//         </ul>
//       )}
//     </div>
//   )
// }
'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import useAuth from '@/hooks/useAuth'
import { supabase } from '@/lib/supabaseClient'
import Link from 'next/link'

type Job = {
  id: string
  title: string
  description: string
  country: string
  salary_min: number | null
  salary_max: number | null
  qualifications: string | null
  created_by: string
}

export default function AdminJobsPage() {
  const { loading, profile } = useAuth(['admin'])
  const [jobs, setJobs] = useState<Job[]>([])
  const [loadingJobs, setLoadingJobs] = useState(true)
  const router = useRouter()

  useEffect(() => {
    if (loading) return;
  
    (async () => {
      const { data, error } = await supabase
        .from('jobs')
        .select('id, title, description, country, qualifications, salary_min, salary_max, created_by, created_at')
        .order('created_at', { ascending: false });
  
      if (error) {
        console.error('Supabase fetch error:', error.message || error);
      } else {
        console.log('Fetched jobs:', data);
        setJobs(data || []);
      }
  
      setLoadingJobs(false);
    })();
  }, [loading]);
  

  if (loading || loadingJobs) {
    return <div className="flex items-center justify-center h-full">Loading…</div>
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">My Job Postings</h2>
        <Link
          href="/dashboard/admin/jobs/new"
          className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-500"
        >
          + New Job
        </Link>
      </div>

      {jobs.length === 0 ? (
        <p>No jobs posted yet.</p>
      ) : (
        <ul className="space-y-4">
          {jobs.map((job) => (
            <li
              key={job.id}
              className="border rounded p-4 hover:shadow-md transition-shadow"
            >
              <h3 className="text-xl font-semibold">{job.title}</h3>
              <p className="text-gray-600 text-sm">
                {job.country} &bull;{' '}
                {job.salary_min ?? '—'} - {job.salary_max ?? '—'}
              </p>
              <p className="mt-2 text-gray-800">{job.description}</p>
              <Link
                href={`/dashboard/admin/jobs/${job.id}`}
                className="mt-3 inline-block text-indigo-600 hover:underline"
              >
                View Applications
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
