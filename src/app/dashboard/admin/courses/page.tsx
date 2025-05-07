'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabaseClient'
import useAuth from '@/hooks/useAuth'

type Course = {
  id: string
  title: string
  description: string
}

export default function AdminCoursesPage() {
  const { loading } = useAuth(['admin'])
  const [courses, setCourses] = useState<Course[]>([])
  const [loadingCourses, setLoadingCourses] = useState(true)

  useEffect(() => {
    if (loading) return

    ;(async () => {
      const { data, error } = await supabase.from('courses').select('*').order('created_at', { ascending: false })
      if (error) {
        console.error('Error fetching courses:', error)
      } else {
        setCourses(data || [])
      }
      setLoadingCourses(false)
    })()
  }, [loading])

  if (loading || loadingCourses) {
    return <div className="p-6">Loading…</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Courses</h2>
        <Link
          href="/dashboard/admin/courses/new"
          className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-500"
        >
          + Add Course
        </Link>
      </div>

      {courses.length === 0 ? (
        <p>No courses available.</p>
      ) : (
        <ul className="space-y-4">
          {courses.map((course) => (
            <li key={course.id} className="border rounded p-4">
              <h3 className="text-lg font-semibold">{course.title}</h3>
              <p className="text-gray-700 mt-2">{course.description}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
