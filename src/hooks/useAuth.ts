'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'

export default function useAuth(allowedRoles: string[] = []) {
  const router = useRouter()
  const [loading, setLoading]     = useState(true)
  const [profile, setProfile]     = useState<{ role: string } | null>(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      const user = data.session?.user
      if (!user) {
        router.replace('/login')
        return
      }

      supabase
        .from('profiles')
        .select('role')
        .eq('user_id', user.id)
        .single()
        .then(({ data: prof, error }) => {
          if (error || !prof) {
            supabase.auth.signOut().then(() => router.replace('/login'))
            return
          }

          // Enforce allowed roles, if any
          if (allowedRoles.length && !allowedRoles.includes(prof.role)) {
            router.replace('/dashboard/user')
            return
          }

          setProfile(prof)
          setLoading(false)
        })
    })
  }, [router, allowedRoles])

  return { loading, profile }
}
