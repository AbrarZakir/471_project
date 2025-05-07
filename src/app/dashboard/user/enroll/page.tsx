'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import Link from 'next/link'

interface Course {
  id: string
  title: string
  description: string
}

export default function EnrollCoursesPage() {
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCourses = async () => {
      const { data, error } = await supabase.from('courses').select('*')
      if (error) {
        console.error('Error fetching courses:', error)
        setCourses([])
      } else {
        setCourses(data || [])
      }
      setLoading(false)
    }

    fetchCourses()
  }, [])

//   const handleEnroll = async (courseId: string) => {
//     const {
//       data: { user },
//     } = await supabase.auth.getUser()

//     if (!user) {
//       alert('User not logged in.')
//       return
//     }

//     // Fetch the profile.id using the Supabase auth user id
//     const { data: profileData, error: profileError } = await supabase
//       .from('profiles')
//       .select('id')
//       .eq('user_id', user.id)
//       .single()

//     if (profileError || !profileData) {
//       console.error('Profile fetch failed:', profileError)
//       alert('Profile not found. Please contact support.')
//       return
//     }

//     const { error: enrollError } = await supabase.from('enrollments').insert([
//       {
//         course_id: courseId,
//         user_id: profileData.id,
//       },
//     ])

//     if (enrollError) {
//       console.error('Enrollment failed:', enrollError)
//       alert('Enrollment failed.')
//     } else {
//       alert('Enrollment successful!')
//     }
//   }

const handleEnroll = async (courseId: string) => {
    const {
      data: { user },
    } = await supabase.auth.getUser()
  
    if (!user) {
      alert('User not logged in.')
      return
    }
  
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('id')
      .eq('user_id', user.id)
      .single()
  
    if (profileError || !profileData) {
      console.error('Profile fetch failed:', profileError)
      alert('Profile not found.')
      return
    }
  
    // Check if already enrolled
    const { data: existingEnrollment, error: checkError } = await supabase
      .from('enrollments')
      .select('id')
      .eq('course_id', courseId)
      .eq('user_id', profileData.id)
      .maybeSingle()
  
    if (checkError) {
      console.error('Enrollment check failed:', checkError)
      return
    }
  
    if (existingEnrollment) {
      alert('You are already enrolled in this course.')
      return
    }
  
    // Proceed with enrollment
    const { error: enrollError } = await supabase.from('enrollments').insert([
      {
        course_id: courseId,
        user_id: profileData.id,
      },
    ])
  
    if (enrollError) {
      console.error('Enrollment failed:', enrollError)
      alert('Enrollment failed.')
    } else {
      alert('Enrollment successful!')
    }
  }
  
  if (loading) return <div className="p-6">Loading courses…</div>

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Top-right Dashboard Button */}
      <div className="flex justify-end mb-6">
        <Link
          href="/dashboard/user"
          className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-500"
        >
          Dashboard
        </Link>
      </div>

      <h2 className="text-2xl font-bold mb-6">Available Courses</h2>

      {courses.length === 0 ? (
        <p>No courses available at the moment.</p>
      ) : (
        <div className="grid gap-6">
          {courses.map((course) => (
            <div key={course.id} className="border p-4 rounded shadow">
              <h3 className="text-lg font-semibold">{course.title}</h3>
              <p className="text-gray-700 mt-1">{course.description}</p>
              <button
                onClick={() => handleEnroll(course.id)}
                className="mt-3 bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-500"
              >
                Enroll with Payment
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
