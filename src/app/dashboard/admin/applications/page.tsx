'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabaseClient'

interface Application {
  id: string
  applied_at: string
  status: string
  job: {
    title: string
    country: string
  }
  profile: {
    name: string
    role: string
  }
}

export default function AdminApplicationsPage() {
  const [applications, setApplications] = useState<Application[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchApplications = async () => {
      // Log session data to check if admin role is correct
      const { data: session } = await supabase.auth.getSession()
      console.log('Session data:', session)

      // Simplified query to fetch all applications (no user or role filtering)
      const { data, error } = await supabase
        .from('applications')
        .select(`
          id,
          applied_at,
          status,
          job:job_id(title, country),
          profile:user_id(name, role)
        `)
        .order('applied_at', { ascending: false })

      if (error) {
        console.error('Error loading applications:', error)
      } else {
        console.log('Fetched applications:', data)  // Check the data
        setApplications(data || [])
      }

      setLoading(false)
    }

    fetchApplications()
  }, [])

  const updateStatus = async (id: string, status: string) => {
    const { error } = await supabase
      .from('applications')
      .update({ status })
      .eq('id', id)

    if (error) {
      alert('Failed to update status')
    } else {
      setApplications(prev =>
        prev.map(app =>
          app.id === id ? { ...app, status } : app
        )
      )
    }
  }

  if (loading) return <div className="p-6">Loading…</div>

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold text-indigo-700">All Job Applications</h2>

      {applications.length === 0 ? (
        <p>No applications submitted yet.</p>
      ) : (
        <ul className="space-y-4">
          {applications.map(app => (
            <li key={app.id} className="border p-4 rounded shadow">
              <h3 className="text-xl font-semibold">{app.job?.title}</h3>
              <p className="text-gray-600">{app.job?.country}</p>
              <p className="text-sm text-gray-700">Applicant: {app.profile?.name}</p>
              <p className="text-sm text-gray-500">
                Status: <span className="font-semibold capitalize">{app.status}</span>
              </p>
              <div className="mt-2 flex gap-2">
                <button
                  onClick={() => updateStatus(app.id, 'approved')}
                  className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-500"
                >
                  Approve
                </button>
                <button
                  onClick={() => updateStatus(app.id, 'rejected')}
                  className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-500"
                >
                  Reject
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
