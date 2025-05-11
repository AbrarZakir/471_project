'use client'

import { useState, useEffect, useContext } from 'react'
import useAuth from '@/hooks/useAuth'
import { supabase } from '@/lib/supabaseClient'
import { LanguageContext } from '@/context/LanguageProvider'

export default function UserProfilePage() {
  const { loading } = useAuth(['user'])
  const { t } = useContext(LanguageContext)!

  const [profile, setProfile] = useState({
    name: '', email: '', phone: '', address: '',
  })
  const [password, setPassword] = useState('')
  const [message, setMessage]   = useState<string|null>(null)

  useEffect(() => {
    if (loading) return
    supabase.auth.getSession().then(({ data }) => {
      const user = data.session?.user
      if (!user) return

      setProfile(prev => ({ ...prev, email: user.email! }))
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

  async function handleSave() {
    setMessage(null)

    // a) auth update
    const { error: updateAuthError } = await supabase.auth.updateUser({
      email:    profile.email,
      password: password || undefined,
    })
    if (updateAuthError) {
      setMessage(updateAuthError.message)
      return
    }

    // b) profiles table
    const userId = (await supabase.auth.getSession())
      .data.session!.user.id
    const { error: updateProfileError } = await supabase
      .from('profiles')
      .update({
        name:    profile.name,
        phone:   profile.phone,
        address: profile.address,
      })
      .eq('user_id', userId)

    if (updateProfileError) {
      setMessage(updateProfileError.message)
      return
    }

    setMessage(t('profileUpdated'))
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        {t('loading')}
      </div>
    )
  }

  return (
    <div className="max-w-md mx-auto space-y-6">
      <h2 className="text-xl font-bold">{t('myProfile')}</h2>
      {message && (
        <p className="text-green-600">{message}</p>
      )}

      {/* Name */}
      <div>
        <label className="block text-sm font-medium text-gray-900">
          {t('name')}
        </label>
        <input
          type="text"
          value={profile.name}
          onChange={e => setProfile({ ...profile, name: e.target.value })}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-indigo-600 focus:ring-indigo-600 sm:text-sm"
        />
      </div>

      {/* Email */}
      <div>
        <label className="block text-sm font-medium text-gray-900">
          {t('email')}
        </label>
        <input
          type="email"
          value={profile.email}
          onChange={e => setProfile({ ...profile, email: e.target.value })}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-indigo-600 focus:ring-indigo-600 sm:text-sm"
        />
      </div>

      {/* Phone */}
      <div>
        <label className="block text-sm font-medium text-gray-900">
          {t('phone')}
        </label>
        <input
          type="text"
          value={profile.phone}
          onChange={e => setProfile({ ...profile, phone: e.target.value })}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-indigo-600 focus:ring-indigo-600 sm:text-sm"
        />
      </div>

      {/* Address */}
      <div>
        <label className="block text-sm font-medium text-gray-900">
          {t('address')}
        </label>
        <input
          type="text"
          value={profile.address}
          onChange={e => setProfile({ ...profile, address: e.target.value })}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-indigo-600 focus:ring-indigo-600 sm:text-sm"
        />
      </div>

      {/* New Password */}
      <div>
        <label className="block text-sm font-medium text-gray-900">
          {t('newPassword')}
        </label>
        <input
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-indigo-600 focus:ring-indigo-600 sm:text-sm"
        />
      </div>

      <button
        onClick={handleSave}
        className="w-full rounded-md bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-600"
      >
        {t('saveChanges')}
      </button>
    </div>
  )
}
