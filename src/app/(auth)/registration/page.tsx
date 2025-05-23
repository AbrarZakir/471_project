// src/app/registration/page.tsx  (or src/app/register/page.tsx)
'use client'

import { useState, useContext } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'
import { LanguageContext } from '@/context/LanguageProvider'

export default function RegisterPage() {
  const router = useRouter()
  const { t } = useContext(LanguageContext)!

  const [name, setName]         = useState('')
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [error, setError]       = useState<string|null>(null)
  const [loading, setLoading]   = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    // 1) Sign up
    const { data, error: signUpError } = await supabase.auth.signUp({ email, password })
    if (signUpError) {
      setError(signUpError.message)
      setLoading(false)
      return
    }

    // 2) Insert profile
    const userId = data.user?.id!
    const { error: profileError } = await supabase
      .from('profiles')
      .insert([{ user_id: userId, name, role: 'user' }])
    if (profileError) {
      setError(profileError.message)
      setLoading(false)
      return
    }

    // 3) Sign out & redirect
    await supabase.auth.signOut()
    setLoading(false)
    router.push('/login')
  }

  return (
    <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
      {/* Logo & Heading */}
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <img
          src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=600"
          alt={t('logoAlt')}
          className="mx-auto h-10 w-auto"
        />
        <h2 className="mt-10 text-center text-2xl font-bold text-gray-900">
          {t('createAccount')}
        </h2>
      </div>

      {/* Form */}
      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Full Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-900">
              {t('fullName')}
            </label>
            <input
              id="name"
              value={name}
              onChange={e => setName(e.target.value)}
              type="text"
              required
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2
                         focus:border-indigo-600 focus:ring-indigo-600 sm:text-sm"
            />
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-900">
              {t('emailAddress')}
            </label>
            <input
              id="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              type="email"
              required
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2
                         focus:border-indigo-600 focus:ring-indigo-600 sm:text-sm"
            />
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-900">
              {t('password')}
            </label>
            <input
              id="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              type="password"
              required
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2
                         focus:border-indigo-600 focus:ring-indigo-600 sm:text-sm"
            />
          </div>

          {/* Error Message */}
          {error && <p className="text-red-600 text-sm">{error}</p>}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-md bg-indigo-600 px-3 py-2 text-white hover:bg-indigo-500
                       focus:outline-none focus:ring-2 focus:ring-indigo-600"
          >
            {loading ? t('submitting') : t('signUp')}
          </button>
        </form>

        {/* Link to Sign In */}
        <p className="mt-6 text-center text-sm text-gray-500">
          {t('alreadyMember')}{' '}
          <a href="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
            {t('signIn')}
          </a>
        </p>
      </div>
    </div>
  )
}
