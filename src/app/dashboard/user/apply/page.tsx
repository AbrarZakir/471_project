'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabaseClient'

type Job = {
  id: string
  title: string
  country: string
  description: string
  qualifications?: string
}

export default function ApplyJobsPage() {
  const [jobs, setJobs] = useState<Job[]>([])
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([])
  const [appliedJobs, setAppliedJobs] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [userId, setUserId] = useState<string | null>(null)

  const [searchTitle, setSearchTitle] = useState('')
  const [searchCountry, setSearchCountry] = useState('')
  const [searchQualification, setSearchQualification] = useState('')

  const refreshAppliedJobs = async (uid: string) => {
    const { data: applied, error: appErr } = await supabase
      .from('applications')
      .select('job_id')
      .eq('user_id', uid)

    if (!appErr) {
      setAppliedJobs(applied.map(a => a.job_id))
    }
  }

  useEffect(() => {
    const fetchJobs = async () => {
      const { data, error } = await supabase
        .from('jobs')
        .select('id, title, country, description, qualifications')

      if (error) {
        console.error('Error loading jobs:', error)
      } else {
        setJobs(data || [])
        setFilteredJobs(data || [])
      }

      const session = await supabase.auth.getSession()
      const uid = session?.data?.session?.user?.id
      if (uid) {
        setUserId(uid)
        await refreshAppliedJobs(uid)
      }

      setLoading(false)
    }

    fetchJobs()
  }, [])

  useEffect(() => {
    let results = [...jobs]

    if (searchTitle)
      results = results.filter(j =>
        j.title.toLowerCase().includes(searchTitle.toLowerCase())
      )

    if (searchCountry)
      results = results.filter(j =>
        j.country.toLowerCase().includes(searchCountry.toLowerCase())
      )

    if (searchQualification)
      results = results.filter(j =>
        (j.qualifications || '').toLowerCase().includes(searchQualification.toLowerCase())
      )

    setFilteredJobs(results)
  }, [searchTitle, searchCountry, searchQualification, jobs])

  const handleApply = async (jobId: string) => {
    if (!userId) return alert('User not logged in.')

    const { data: existing, error: existErr } = await supabase
      .from('applications')
      .select('id')
      .eq('job_id', jobId)
      .eq('user_id', userId)

    if (existing && existing.length > 0) {
      alert('You have already applied for this job.')
      return
    }

    const { error } = await supabase.from('applications').insert([
      {
        job_id: jobId,
        user_id: userId,
        applied_at: new Date().toISOString(),
        status: 'pending',
      },
    ])

    if (error) {
      console.error('Insert error:', error)
      alert('Failed to apply')
    } else {
      await refreshAppliedJobs(userId)
    }
  }

  if (loading) return <div className="p-6">Loading…</div>

  return (
    <div className="p-6 space-y-6">
      {/* Header with Dashboard button */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-indigo-700">Apply for Jobs</h2>
        <button
          onClick={() => window.location.href = '/dashboard/user'}
          className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300"
        >
          Dashboard
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <input
          type="text"
          placeholder="Search by Title"
          value={searchTitle}
          onChange={e => setSearchTitle(e.target.value)}
          className="w-full border px-4 py-2 rounded"
        />
        <input
          type="text"
          placeholder="Search by Country"
          value={searchCountry}
          onChange={e => setSearchCountry(e.target.value)}
          className="w-full border px-4 py-2 rounded"
        />
        <input
          type="text"
          placeholder="Search by Qualification"
          value={searchQualification}
          onChange={e => setSearchQualification(e.target.value)}
          className="w-full border px-4 py-2 rounded"
        />
      </div>

      {filteredJobs.length === 0 ? (
        <p className="text-gray-500">No jobs match your criteria.</p>
      ) : (
        <ul className="space-y-4">
          {filteredJobs.map(job => (
            <li key={job.id} className="border p-4 rounded shadow">
              <h3 className="text-xl font-semibold">{job.title}</h3>
              <p className="text-gray-600">{job.country}</p>
              <p className="mt-1 text-gray-700 text-sm">{job.description}</p>
              <p className="mt-1 text-gray-500 text-sm">
                <strong>Qualifications:</strong> {job.qualifications || '—'}
              </p>
              <button
                onClick={() => handleApply(job.id)}
                disabled={appliedJobs.includes(job.id)}
                className={`mt-4 px-4 py-2 rounded ${
                  appliedJobs.includes(job.id)
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-green-600 hover:bg-green-500 text-white'
                }`}
              >
                {appliedJobs.includes(job.id) ? 'Applied' : 'Apply'}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
