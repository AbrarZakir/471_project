// src/app/api/payments/route.ts

import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { supabase } from '@/lib/supabaseClient'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  // We omit `apiVersion`, so Stripe defaults to the version bundled with the SDK
})

export async function POST(request: Request) {
  try {
    const { courseId, profileId, paymentMethod } = await request.json()

    // 1) Determine price (in poysh, e.g. 50000 = ৳500.00)
    const amount = parseInt(process.env.COURSE_PRICE!, 10)

    let clientSecret: string | null = null

    // 2) If paying by card, create a Stripe PaymentIntent
    if (paymentMethod === 'stripe_card') {
      const paymentIntent = await stripe.paymentIntents.create({
        amount,
        currency: 'bdt',
        metadata: { courseId, profileId },
      })
      clientSecret = paymentIntent.client_secret!
    }

    // 3) Record the pending payment in Supabase
    const { error: dbError } = await supabase
      .from('payments')
      .insert([{
        profile_id:     profileId,
        course_id:      courseId,
        amount,
        currency:       'BDT',
        payment_method: paymentMethod,
        status:         'pending',
        transaction_id: clientSecret ?? null,
      }])

    if (dbError) {
      console.error('DB insert error:', dbError)
      return NextResponse.json(
        { error: dbError.message },
        { status: 500 }
      )
    }

    // 4) Return the clientSecret for Stripe.js to confirm
    return NextResponse.json({ clientSecret })
  } catch (err: any) {
    console.error('Unexpected error in /api/payments:', err)
    return NextResponse.json(
      { error: err.message || 'Unknown error' },
      { status: 500 }
    )
  }
}
