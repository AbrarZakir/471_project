'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import useAuth from '@/hooks/useAuth'
import { supabase } from '@/lib/supabaseClient'

export default function NewJobPage() {
  const { loading, profile } = useAuth(['admin'])
  const router = useRouter()

  const [formData, setFormData] = useState({
    title: '',
    country: '',
    description: '',
    qualifications: '',
    salary_min: '',
    salary_max: '',
  })

  const [submitting, setSubmitting] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
  
    const { data: sessionData } = await supabase.auth.getSession()
    const userId = sessionData?.session?.user?.id
  
    const {
      title, country, description,
      qualifications, salary_min, salary_max,
    } = formData
  
    const { error } = await supabase.from('jobs').insert([{
      title,
      country,
      description,
      qualifications,
      salary_min: Number(salary_min),
      salary_max: Number(salary_max),
      created_by: userId, // ✅ add this field
    }])
  
    setSubmitting(false)
    if (error) {
      console.error('Supabase Insert Error:', error)
      alert('Failed to post job.')
    } else {
      router.push('/dashboard/admin/jobs')
    }
  }
  

  if (loading) return <div className="p-6">Loading…</div>

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Post a New Job</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="title"
          placeholder="Job Title"
          value={formData.title}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
          required
        />
        <input
          type="text"
          name="country"
          placeholder="Country"
          value={formData.country}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
          required
        />
        <textarea
          name="description"
          placeholder="Job Description"
          value={formData.description}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
          required
        />
        <textarea
          name="qualifications"
          placeholder="Qualifications"
          value={formData.qualifications}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
        />
        <div className="flex gap-4">
          <input
            type="number"
            name="salary_min"
            placeholder="Min Salary"
            value={formData.salary_min}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          />
          <input
            type="number"
            name="salary_max"
            placeholder="Max Salary"
            value={formData.salary_max}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          />
        </div>
        <button
          type="submit"
          disabled={submitting}
          className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-500"
        >
          {submitting ? 'Posting…' : 'Post Job'}
        </button>
      </form>
    </div>
  )
}
