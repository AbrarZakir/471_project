// src/app/dashboard/user/enroll/page.tsx
'use client'

import { useEffect, useState, Fragment, useContext } from 'react'
import { useRouter } from 'next/navigation'
import useAuth from '@/hooks/useAuth'
import { supabase } from '@/lib/supabaseClient'
import { Dialog, Transition } from '@headlessui/react'
import { loadStripe } from '@stripe/stripe-js'
import {
  Elements,
  CardElement,
  useStripe,
  useElements
} from '@stripe/react-stripe-js'
import { LanguageContext } from '@/context/LanguageProvider'

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
)

interface Course {
  id: string
  title: string
  description: string
}

export default function EnrollCoursesPage() {
  const router = useRouter()
  const { loading } = useAuth(['user'])
  const { t } = useContext(LanguageContext)!

  const [courses, setCourses]               = useState<Course[]>([])
  const [loadingCourses, setLoadingCourses] = useState(true)
  const [profileId, setProfileId]           = useState<string>('')

  // Modal state
  const [isOpen, setIsOpen]                 = useState(false)
  const [selectedCourse, setSelectedCourse] = useState<Course|null>(null)

  // Fetch profile.id and courses on mount
  useEffect(() => {
    if (loading) return
    supabase.auth.getSession().then(({ data }) => {
      const user = data.session?.user
      if (!user) return
      supabase
        .from('profiles')
        .select('id')
        .eq('user_id', user.id)
        .single()
        .then(({ data: prof }) => {
          if (prof) setProfileId(prof.id)
        })
    })
    supabase
      .from('courses')
      .select('*')
      .then(({ data, error }) => {
        if (!error && data) setCourses(data)
        setLoadingCourses(false)
      })
  }, [loading])

  if (loading || loadingCourses) {
    return <div className="p-6">{t('loading')}</div>
  }

  function openModal(course: Course) {
    setSelectedCourse(course)
    setIsOpen(true)
  }
  function closeModal() {
    setIsOpen(false)
    setSelectedCourse(null)
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex justify-end mb-6">
        <button
          onClick={() => router.push('/dashboard/user')}
          className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-500"
        >
          {t('dashboard')}
        </button>
      </div>

      <h2 className="text-2xl font-bold mb-6">{t('availableCourses')}</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {courses.map((course) => (
          <div key={course.id} className="border p-4 rounded shadow">
            <h3 className="text-lg font-semibold">{course.title}</h3>
            <p className="text-gray-700 mt-1">{course.description}</p>
            <button
              onClick={() => openModal(course)}
              className="mt-3 bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-500"
            >
              {t('enrollWithPayment')}
            </button>
          </div>
        ))}
      </div>

      {/* PAYMENT MODAL */}
      <Transition appear show={isOpen && !!selectedCourse} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeModal}>
          {/* backdrop */}
          <Transition.Child
            as="div"
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          {/* panel */}
          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as="div"
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                {selectedCourse && (
                  <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded bg-white p-6 text-left align-middle shadow-xl transition-all">
                    <Dialog.Title as="h3" className="text-lg font-bold">
                      {t('payForCourse')}: {selectedCourse.title}
                    </Dialog.Title>

                    <div className="mt-4 space-y-4">
                      <Elements stripe={stripePromise}>
                        <CardCheckoutForm
                          profileId={profileId}
                          courseId={selectedCourse.id}
                          close={closeModal}
                        />
                      </Elements>
                    </div>

                    <div className="mt-4 flex justify-end">
                      <button
                        onClick={closeModal}
                        className="px-4 py-2"
                      >
                        {t('cancel')}
                      </button>
                    </div>
                  </Dialog.Panel>
                )}
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </div>
  )
}

// CardCheckoutForm omitted for brevity; it remains the same as before


// ─────────────────────────────────────────────────────────────────────────────
// CardCheckoutForm
// ─────────────────────────────────────────────────────────────────────────────
function CardCheckoutForm({
  profileId,
  courseId,
  close
}: {
  profileId: string
  courseId:  string
  close:     () => void
}) {
  const stripe   = useStripe()
  const elements = useElements()
  const { t }    = useContext(LanguageContext)!
  const [error, setError]     = useState<string|null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!stripe || !elements) return

    setLoading(true)
    setError(null)

    const res = await fetch('/api/payments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        courseId,
        profileId,
        paymentMethod: 'stripe_card'
      })
    })
    const { clientSecret, error: apiError } = await res.json()
    if (apiError) {
      setError(apiError)
      setLoading(false)
      return
    }

    const { error: stripeError } = await stripe.confirmCardPayment(
      clientSecret,
      {
        payment_method: {
          card: elements.getElement(CardElement)!
        }
      }
    )
    if (stripeError) {
      setError(stripeError.message!)
      setLoading(false)
      return
    }

    setLoading(false)
    close()
    alert(t('paymentSuccess'))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <CardElement options={{ style: { base: { fontSize: '16px' } } }} />
      </div>
      {error && <p className="text-red-600">{error}</p>}
      <button
        type="submit"
        disabled={!stripe || loading}
        className="w-full bg-indigo-600 text-white px-4 py-2 rounded"
      >
        {loading ? t('processing') : t('payNow')}
      </button>
    </form>
  )
}
