'use client'
import { useState, useEffect } from 'react'
import useAuth from '@/hooks/useAuth'
import { supabase } from '@/lib/supabaseClient'

export default function AdminProfilePage() {
  const { loading } = useAuth(['admin'])
  const [profile, setProfile] = useState({
    name:    '',
    email:   '',
    phone:   '',
    address: '',
  })
  const [password, setPassword] = useState('')
  const [message, setMessage]   = useState<string|null>(null)

  // 1) After auth guard, fetch session & profile row
  useEffect(() => {
    if (loading) return

    supabase.auth.getSession().then(({ data }) => {
      const user = data.session?.user
      if (!user) return

      // a) Pre-fill email
      setProfile(prev => ({ ...prev, email: user.email! }))

      // b) Load name, phone, address
      supabase
        .from('profiles')
        .select('name, phone, address')
        .eq('user_id', user.id)
        .single()
        .then(({ data, error }) => {
          if (!error && data) {
            setProfile(prev => ({
              ...prev,
              name:    data.name!,
              phone:   data.phone  ?? '',
              address: data.address ?? '',
            }))
          }
        })
    })
  }, [loading])

  // 2) Save both Auth & profiles updates
  async function handleSave() {
    setMessage(null)

    // a) Update email/password in Auth
    const { error: authError } = await supabase.auth.updateUser({
      email:    profile.email,
      password: password || undefined,
    })
    if (authError) {
      setMessage(authError.message)
      return
    }

    // b) Update profiles table
    const { data: { session } } = await supabase.auth.getSession()
    const userId = session!.user.id

    const { error: profError } = await supabase
      .from('profiles')
      .update({
        name:    profile.name,
        phone:   profile.phone,
        address: profile.address,
      })
      .eq('user_id', userId)

    if (profError) {
      setMessage(profError.message)
      return
    }

    setMessage('Profile updated successfully!')
  }

  if (loading) {
    return <div className="flex items-center justify-center h-full">Loading…</div>
  }

  return (
    <div className="max-w-md mx-auto space-y-6">
      <h2 className="text-xl font-bold">Admin Profile</h2>
      {message && <p className="text-green-600">{message}</p>}

      {/* Name */}
      <div>
        <label className="block text-sm font-medium text-gray-900">Name</label>
        <input
          type="text"
          value={profile.name}
          onChange={e => setProfile({ ...profile, name: e.target.value })}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2
                     focus:border-indigo-600 focus:ring-indigo-600 sm:text-sm"
        />
      </div>

      {/* Email */}
      <div>
        <label className="block text-sm font-medium text-gray-900">Email</label>
        <input
          type="email"
          value={profile.email}
          onChange={e => setProfile({ ...profile, email: e.target.value })}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2
                     focus:border-indigo-600 focus:ring-indigo-600 sm:text-sm"
        />
      </div>

      {/* Phone */}
      <div>
        <label className="block text-sm font-medium text-gray-900">Phone</label>
        <input
          type="text"
          value={profile.phone}
          onChange={e => setProfile({ ...profile, phone: e.target.value })}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2
                     focus:border-indigo-600 focus:ring-indigo-600 sm:text-sm"
        />
      </div>

      {/* Address */}
      <div>
        <label className="block text-sm font-medium text-gray-900">Address</label>
        <input
          type="text"
          value={profile.address}
          onChange={e => setProfile({ ...profile, address: e.target.value })}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2
                     focus:border-indigo-600 focus:ring-indigo-600 sm:text-sm"
        />
      </div>

      {/* New Password */}
      <div>
        <label className="block text-sm font-medium text-gray-900">New Password</label>
        <input
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2
                     focus:border-indigo-600 focus:ring-indigo-600 sm:text-sm"
        />
      </div>

      <button
        onClick={handleSave}
        className="w-full rounded-md bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-500
                   focus:outline-none focus:ring-2 focus:ring-indigo-600"
      >
        Save Changes
      </button>
    </div>
  )
}
