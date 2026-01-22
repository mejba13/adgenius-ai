import { NextRequest, NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { getStripe } from '@/lib/stripe/client'
import { createClient } from '@supabase/supabase-js'
import Stripe from 'stripe'

// Create a Supabase admin client for webhook operations
function getSupabaseAdmin() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error('Supabase admin credentials not configured')
  }

  return createClient(supabaseUrl, supabaseServiceKey)
}

async function updateUserSubscription(
  supabaseUserId: string,
  updates: {
    subscription_tier?: 'free' | 'pro'
    subscription_status?: 'active' | 'cancelled' | 'past_due'
    stripe_customer_id?: string
    stripe_subscription_id?: string
  }
) {
  const supabase = getSupabaseAdmin()

  const { error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', supabaseUserId)

  if (error) {
    console.error('Error updating subscription:', error)
    throw error
  }
}

async function getUserByStripeCustomerId(stripeCustomerId: string) {
  const supabase = getSupabaseAdmin()

  const { data, error } = await supabase
    .from('profiles')
    .select('id')
    .eq('stripe_customer_id', stripeCustomerId)
    .single()

  if (error) {
    console.error('Error finding user by Stripe customer ID:', error)
    return null
  }

  return data?.id
}

export async function POST(request: NextRequest) {
  const body = await request.text()
  const headersList = await headers()
  const signature = headersList.get('stripe-signature')

  if (!signature) {
    return NextResponse.json(
      { error: 'Missing stripe-signature header' },
      { status: 400 }
    )
  }

  const stripe = getStripe()
  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err) {
    console.error('Webhook signature verification failed:', err)
    return NextResponse.json(
      { error: 'Invalid signature' },
      { status: 400 }
    )
  }

  try {
    // Handle the event
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        const supabaseUserId = session.metadata?.supabase_user_id

        if (supabaseUserId && session.customer && session.subscription) {
          await updateUserSubscription(supabaseUserId, {
            subscription_tier: 'pro',
            subscription_status: 'active',
            stripe_customer_id: session.customer as string,
            stripe_subscription_id: session.subscription as string,
          })
          console.log('User upgraded to pro:', supabaseUserId)
        }
        break
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription
        const stripeCustomerId = subscription.customer as string

        const supabaseUserId = await getUserByStripeCustomerId(stripeCustomerId)

        if (supabaseUserId) {
          const status = subscription.status === 'active' ? 'active' :
                         subscription.status === 'past_due' ? 'past_due' :
                         subscription.status === 'canceled' ? 'cancelled' : 'active'

          await updateUserSubscription(supabaseUserId, {
            subscription_status: status as 'active' | 'cancelled' | 'past_due',
            stripe_subscription_id: subscription.id,
          })
          console.log('Subscription updated for user:', supabaseUserId, 'Status:', status)
        }
        break
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription
        const stripeCustomerId = subscription.customer as string

        const supabaseUserId = await getUserByStripeCustomerId(stripeCustomerId)

        if (supabaseUserId) {
          await updateUserSubscription(supabaseUserId, {
            subscription_tier: 'free',
            subscription_status: 'cancelled',
            stripe_subscription_id: null as unknown as string,
          })
          console.log('User downgraded to free:', supabaseUserId)
        }
        break
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice
        const stripeCustomerId = invoice.customer as string

        const supabaseUserId = await getUserByStripeCustomerId(stripeCustomerId)

        if (supabaseUserId) {
          await updateUserSubscription(supabaseUserId, {
            subscription_status: 'past_due',
          })
          console.log('Payment failed for user:', supabaseUserId)
        }
        break
      }

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }
  } catch (error) {
    console.error('Error processing webhook:', error)
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    )
  }

  return NextResponse.json({ received: true })
}
