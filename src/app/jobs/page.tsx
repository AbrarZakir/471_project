// src/app/jobs/page.tsx
'use client'

import { useState, useEffect, Fragment } from 'react'
import useAuth from '@/hooks/useAuth'
import { supabase } from '@/lib/supabaseClient'
import { Dialog, DialogBackdrop, Transition } from '@headlessui/react'

type Job = {
  id: string
  title: string
  country: string
  description: string
  qualifications: string | null
  salary_range: string      // per your schema
  agency_id: string
  agency_name: string
}

export default function JobsPage() {
  // 1) guard
  const { loading } = useAuth()
  // 2) state
  const [jobs, setJobs]             = useState<Job[]>([])
  const [filtered, setFiltered]     = useState<Job[]>([])
  const [page, setPage]             = useState(1)
  const pageSize = 6

  // filters
  const [searchTitle, setSearchTitle]     = useState('')
  const [filterCountry, setFilterCountry] = useState('')
  const [filterQual, setFilterQual]       = useState('')

  // modal
  const [openId, setOpenId] = useState<string|null>(null)

  // 3) fetch jobs + agency names
  useEffect(() => {
    if (loading) return
    ;(async () => {
      const { data: rawJobs } = await supabase
        .from('jobs')
        .select('id,title,country,description,qualifications,salary_range,agency_id')
        .order('created_at', { ascending: false })

      if (!rawJobs) return

      // fetch agency names
      const agencyIds = Array.from(new Set(rawJobs.map(j => j.agency_id)))
      const { data: agencies } = await supabase
        .from('profiles')
        .select('id,name')
        .in('id', agencyIds)

      const nameMap = (agencies || []).reduce<Record<string,string>>(
        (acc, a) => ({ ...acc, [a.id]: a.name }),
        {}
      )

      const withNames = rawJobs.map((j) => ({
        ...j,
        agency_name: nameMap[j.agency_id] || 'Unknown',
      }))

      setJobs(withNames)
      setFiltered(withNames)
    })()
  }, [loading])

  // 4) apply filters
  useEffect(() => {
    let f = jobs
    if (searchTitle) {
      const t = searchTitle.toLowerCase()
      f = f.filter(j => j.title.toLowerCase().includes(t))
    }
    if (filterCountry) {
      const c = filterCountry.toLowerCase()
      f = f.filter(j => j.country.toLowerCase() === c)
    }
    if (filterQual) {
      const q = filterQual.toLowerCase()
      f = f.filter(
        j => j.qualifications?.toLowerCase().includes(q)
      )
    }
    setPage(1)
    setFiltered(f)
  }, [searchTitle, filterCountry, filterQual, jobs])

  if (loading) {
    return <div className="flex items-center justify-center h-full">Loading…</div>
  }

  // 5) pagination
  const totalPages = Math.ceil(filtered.length / pageSize) || 1
  const paginated  = filtered.slice((page - 1) * pageSize, page * pageSize)

  // 6) guard modal content
  const selectedJob = openId ? jobs.find(j => j.id === openId) : undefined

  return (
    <div className="space-y-6">
      {/* Search & Filter */}
      <div className="flex flex-col md:flex-row gap-4">
        <input
          type="text"
          placeholder="Search title..."
          value={searchTitle}
          onChange={e => setSearchTitle(e.target.value)}
          className="flex-1 rounded border px-3 py-2"
        />
        <input
          type="text"
          placeholder="Filter by country..."
          value={filterCountry}
          onChange={e => setFilterCountry(e.target.value)}
          className="rounded border px-3 py-2"
        />
        <input
          type="text"
          placeholder="Filter by qualification..."
          value={filterQual}
          onChange={e => setFilterQual(e.target.value)}
          className="rounded border px-3 py-2"
        />
      </div>

      {/* Jobs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {paginated.map(job => (
          <div
            key={job.id}
            onClick={() => setOpenId(job.id)}
            className="cursor-pointer rounded-lg border p-4 hover:shadow-lg transition"
          >
            <h3 className="text-xl font-semibold">{job.title}</h3>
            <p className="text-gray-600">{job.country}</p>
            <p className="mt-1 text-gray-800">Agency: {job.agency_name}</p>
          </div>
        ))}
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-center space-x-2">
        <button
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
          className="px-3 py-1 rounded bg-gray-200 disabled:opacity-50"
        >
          Prev
        </button>
        <span className="px-3 py-1">
          Page {page} of {totalPages}
        </span>
        <button
          disabled={page === totalPages}
          onClick={() => setPage(page + 1)}
          className="px-3 py-1 rounded bg-gray-200 disabled:opacity-50"
        >
          Next
        </button>
      </div>

      {/* Detail & Apply Modal */}
      <Transition appear show={!!openId} as={Fragment}>
        <Dialog
          as="div"
          className="fixed inset-0 z-10 overflow-y-auto"
          onClose={() => setOpenId(null)}
        >
          <div className="min-h-screen px-4 text-center">
            {/* Backdrop */}
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-200"
              enterFrom="opacity-0"
              enterTo="opacity-25"
              leave="ease-in duration-150"
              leaveFrom="opacity-25"
              leaveTo="opacity-0"
            >
              <DialogBackdrop className="fixed inset-0 bg-black bg-opacity-30" />
            </Transition.Child>

            {/* Center the modal */}
            <span className="inline-block h-screen align-middle" aria-hidden="true">
              &#8203;
            </span>

            <Transition.Child
              as={Fragment}
              enter="ease-out duration-200"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-150"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <div className="inline-block w-full max-w-lg p-6 my-8 overflow-hidden text-left 
                              align-middle transition-all transform bg-white shadow-xl rounded-2xl">
                {selectedJob ? (
                  <>
                    <Dialog.Title className="text-lg font-bold">
                      {selectedJob.title}
                    </Dialog.Title>
                    <div className="mt-4 space-y-2">
                      <p><strong>Country:</strong> {selectedJob.country}</p>
                      <p><strong>Agency:</strong> {selectedJob.agency_name}</p>
                      <p><strong>Salary:</strong> {selectedJob.salary_range}</p>
                      <p><strong>Description:</strong> {selectedJob.description}</p>
                      <p><strong>Qualifications:</strong> {selectedJob.qualifications}</p>
                    </div>
                    <div className="mt-6 flex justify-end space-x-2">
                      <button
                        onClick={() => setOpenId(null)}
                        className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
                      >
                        Close
                      </button>
                      <button
                        onClick={async () => {
                          const { data: sess } = await supabase.auth.getSession()
                          await supabase
                            .from('applications')
                            .insert([{ job_id: selectedJob.id, user_id: sess!.session!.user.id }])
                          setOpenId(null)
                        }}
                        className="px-4 py-2 rounded bg-indigo-600 text-white hover:bg-indigo-500"
                      >
                        Apply
                      </button>
                    </div>
                  </>
                ) : (
                  <p className="p-6 text-center">Loading job details…</p>
                )}
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </div>
  )
}
