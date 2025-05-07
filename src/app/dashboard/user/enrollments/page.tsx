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
      } = await supabase.auth.getUser()

      if (!user) return

      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('id')
        .eq('user_id', user.id)
        .single()

      if (profileError || !profileData) {
        console.error('Profile fetch failed:', profileError)
        setCourses([])
        setLoading(false)
        return
      }

      const { data, error } = await supabase
        .from('enrollments')
        .select('courses:course_id(id, title, description)')
        .eq('user_id', profileData.id)

      if (error) {
        console.error('Error fetching enrolled courses:', error)
        setCourses([])
      } else {
        setCourses(data.map((enroll: any) => enroll.courses))
      }
      setLoading(false)
    }

    fetchEnrolledCourses()
  }, [])

  if (loading) return <div className="p-6">Loading your courses…</div>

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Dashboard Button Top-Right */}
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
