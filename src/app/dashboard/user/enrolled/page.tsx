'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import Link from 'next/link'

interface Course {
  id: string
  title: string
  description: string
}

export default function EnrolledCoursesPage() {
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchEnrolledCourses = async () => {
      const {
        data: { user },
        error: userError
      } = await supabase.auth.getUser()

      if (userError || !user) {
        console.error('No user found:', userError)
        return
      }

      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('id')
        .eq('user_id', user.id)
        .single()

      if (profileError || !profileData) {
        console.error('Profile not found:', profileError)
        return
      }

      const { data: enrollments, error: enrollError } = await supabase
        .from('enrollments')
        .select('course_id, courses (id, title, description)')
        .eq('user_id', profileData.id)

      if (enrollError) {
        console.error('Error fetching enrollments:', enrollError)
        setCourses([])
      } else {
        setCourses(enrollments.map((entry: any) => entry.courses))
      }

      setLoading(false)
    }

    fetchEnrolledCourses()
  }, [])

  if (loading) return <div className="p-6">Loading enrolled courses…</div>

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex justify-end mb-6">
        <Link
          href="/dashboard/user"
          className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-500"
        >
          Dashboard
        </Link>
      </div>

      <h2 className="text-2xl font-bold mb-6">Your Enrolled Courses</h2>

      {courses.length === 0 ? (
        <p>You have not enrolled in any courses yet.</p>
      ) : (
        <div className="grid gap-6">
          {courses.map((course) => (
            <div key={course.id} className="border p-4 rounded shadow">
              <h3 className="text-lg font-semibold">{course.title}</h3>
              <p className="text-gray-700 mt-1">{course.description}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
