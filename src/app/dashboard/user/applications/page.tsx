'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabaseClient'

type Application = {
  id: string
  applied_at: string
  status: string
  job: {
    title: string
    country: string
  }
}

export default function MyApplicationsPage() {
  const [applications, setApplications] = useState<Application[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchApplications = async () => {
      const session = await supabase.auth.getSession()
      const userId = session?.data?.session?.user?.id

      if (!userId) return

      const { data, error } = await supabase
        .from('applications')
        .select('id, applied_at, status, job:job_id(title, country)')
        .eq('user_id', userId)
        .order('applied_at', { ascending: false })

      if (error) {
        console.error('Error fetching applications:', error)
      } else {
        setApplications(data || [])
      }

      setLoading(false)
    }

    fetchApplications()
  }, [])

  const handleCancel = async (applicationId: string) => {
    const confirm = window.confirm('Are you sure you want to cancel this application?')
    if (!confirm) return

    const { error } = await supabase
      .from('applications')
      .delete()
      .eq('id', applicationId)

    if (error) {
      console.error('Supabase delete error:', error)
      alert(`Failed to cancel application: ${error.message}`)
    } else {
      setApplications(prev => prev.filter(app => app.id !== applicationId))
    }
  }

  if (loading) return <div className="p-6">Loading…</div>

  return (
    <div className="p-6 space-y-4">
      {/* Header with Dashboard button */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-indigo-700">My Applications</h2>
        <button
          onClick={() => window.location.href = '/dashboard/user'}
          className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300"
        >
          Dashboard
        </button>
      </div>

      {applications.length === 0 ? (
        <p>No job applications found.</p>
      ) : (
        <ul className="space-y-4">
          {applications.map(app => (
            <li key={app.id} className="border rounded p-4 shadow">
              <h3 className="text-xl font-semibold">{app.job?.title}</h3>
              <p className="text-gray-600">{app.job?.country}</p>
              <p className="text-sm text-gray-800 mt-1">
                Applied on: {new Date(app.applied_at).toLocaleDateString()}
              </p>
              <p className="text-sm text-gray-600 mb-2">Status: {app.status}</p>
              <button
                onClick={() => handleCancel(app.id)}
                className="px-3 py-1 rounded bg-red-600 text-white hover:bg-red-500"
              >
                Cancel Application
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
