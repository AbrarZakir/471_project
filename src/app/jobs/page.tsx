'use client'

import { useState, useEffect, Fragment } from 'react'
import { supabase } from '@/lib/supabaseClient'

type Job = {
  id: string
  title: string
  description: string
  country: string
  qualifications: string | null
  salary_min: number | null
  salary_max: number | null
  created_at: string
}

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([])
  const [filtered, setFiltered] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const pageSize = 5

  // filters
  const [searchTitle, setSearchTitle] = useState('')
  const [filterCountry, setFilterCountry] = useState('')
  const [filterQual, setFilterQual] = useState('')

  useEffect(() => {
    ;(async () => {
      const { data, error } = await supabase
        .from('jobs')
        .select('id, title, description, country, qualifications, salary_min, salary_max, created_at')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching jobs:', error)
      } else {
        setJobs(data || [])
        setFiltered(data || [])
      }

      setLoading(false)
    })()
  }, [])

  // Apply filters
  useEffect(() => {
    let f = [...jobs]

    if (searchTitle)
      f = f.filter(j => j.title.toLowerCase().includes(searchTitle.toLowerCase()))

    if (filterCountry)
      f = f.filter(j => j.country.toLowerCase().includes(filterCountry.toLowerCase()))

    if (filterQual)
      f = f.filter(j => j.qualifications?.toLowerCase().includes(filterQual.toLowerCase()))

    setPage(1)
    setFiltered(f)
  }, [searchTitle, filterCountry, filterQual, jobs])

  const totalPages = Math.ceil(filtered.length / pageSize) || 1
  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize)

  if (loading) return <div className="p-6">Loading…</div>

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold text-indigo-700">Job Listings</h2>

      <div className="flex flex-col md:flex-row gap-4">
        <input
          type="text"
          placeholder="Search title..."
          value={searchTitle}
          onChange={e => setSearchTitle(e.target.value)}
          className="flex-1 border rounded px-4 py-2"
        />
        <input
          type="text"
          placeholder="Filter by country..."
          value={filterCountry}
          onChange={e => setFilterCountry(e.target.value)}
          className="border rounded px-4 py-2"
        />
        <input
          type="text"
          placeholder="Filter by qualification..."
          value={filterQual}
          onChange={e => setFilterQual(e.target.value)}
          className="border rounded px-4 py-2"
        />
      </div>

      {paginated.length === 0 ? (
        <p className="text-gray-500">No jobs match your criteria.</p>
      ) : (
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {paginated.map(job => (
            <li key={job.id} className="border rounded-lg p-4 shadow hover:shadow-md transition">
              <h3 className="text-xl font-semibold">{job.title}</h3>
              <p className="text-gray-600">{job.country}</p>
              <p className="mt-2 text-sm text-gray-800">{job.description}</p>
              <p className="mt-1 text-sm text-gray-600">
                <strong>Qualifications:</strong> {job.qualifications ?? '—'}
              </p>
              <p className="text-sm text-gray-600">
                <strong>Salary:</strong> {job.salary_min ?? '—'} - {job.salary_max ?? '—'}
              </p>
            </li>
          ))}
        </ul>
      )}

      <div className="flex justify-center items-center gap-4 mt-6">
        <button
          onClick={() => setPage(p => Math.max(1, p - 1))}
          disabled={page === 1}
          className="px-3 py-1 rounded bg-gray-200 disabled:opacity-50"
        >
          Prev
        </button>
        <span>Page {page} of {totalPages}</span>
        <button
          onClick={() => setPage(p => Math.min(totalPages, p + 1))}
          disabled={page === totalPages}
          className="px-3 py-1 rounded bg-gray-200 disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  )
}
