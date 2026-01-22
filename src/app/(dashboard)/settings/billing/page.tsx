'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Check, Zap, Loader2, AlertCircle, CheckCircle } from 'lucide-react'

const PLANS = [
  {
    id: 'free',
    name: 'Free',
    price: '$0',
    period: 'forever',
    description: 'Perfect for trying out AdGenius AI',
    features: [
      '10 total creatives',
      'All platforms supported',
      'Basic brand kit',
      'Community support',
    ],
    limit: 10,
    popular: false,
  },
  {
    id: 'pro',
    name: 'Pro',
    price: '$29',
    period: '/month',
    description: 'For growing businesses and marketers',
    features: [
      '50 creatives/month',
      'All platforms supported',
      'Full brand kit',
      'Priority support',
      'Export to CSV',
      'API access (coming soon)',
    ],
    limit: 50,
    popular: true,
  },
]

interface SubscriptionData {
  subscription_tier: 'free' | 'pro'
  subscription_status: 'active' | 'cancelled' | 'past_due'
  stripe_customer_id: string | null
}

interface UsageData {
  credits_used: number
}

function BillingContent() {
  const searchParams = useSearchParams()
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(false)
  const [subscription, setSubscription] = useState<SubscriptionData>({
    subscription_tier: 'free',
    subscription_status: 'active',
    stripe_customer_id: null,
  })
  const [usage, setUsage] = useState<UsageData>({ credits_used: 0 })
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  useEffect(() => {
    fetchData()

    // Check for success/cancel from Stripe
    if (searchParams.get('success') === 'true') {
      setMessage({ type: 'success', text: 'Successfully upgraded to Pro! Your subscription is now active.' })
    } else if (searchParams.get('canceled') === 'true') {
      setMessage({ type: 'error', text: 'Checkout was canceled. You can try again anytime.' })
    }
  }, [searchParams])

  const fetchData = async () => {
    try {
      // Fetch profile with subscription data
      const profileRes = await fetch('/api/profile')
      const profileData = await profileRes.json()

      if (profileData.profile) {
        setSubscription({
          subscription_tier: profileData.profile.subscription_tier || 'free',
          subscription_status: profileData.profile.subscription_status || 'active',
          stripe_customer_id: profileData.profile.stripe_customer_id || null,
        })
      }

      // Fetch usage - would need a usage API endpoint
      // For now, we'll use creatives count
      const creativesRes = await fetch('/api/creatives')
      const creativesData = await creativesRes.json()
      if (creativesData.creatives) {
        setUsage({ credits_used: creativesData.creatives.length })
      }
    } catch (error) {
      console.error('Failed to fetch data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleUpgrade = async () => {
    setActionLoading(true)
    setMessage(null)
    try {
      const response = await fetch('/api/billing/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create checkout session')
      }

      window.location.href = data.url
    } catch (error) {
      console.error('Checkout error:', error)
      setMessage({ type: 'error', text: 'Failed to start checkout. Please try again.' })
    } finally {
      setActionLoading(false)
    }
  }

  const handleManageBilling = async () => {
    setActionLoading(true)
    setMessage(null)
    try {
      const response = await fetch('/api/billing/portal', {
        method: 'POST',
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create portal session')
      }

      window.location.href = data.url
    } catch (error) {
      console.error('Portal error:', error)
      setMessage({ type: 'error', text: 'Failed to open billing portal. Please try again.' })
    } finally {
      setActionLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    )
  }

  const currentPlan = PLANS.find(p => p.id === subscription.subscription_tier) || PLANS[0]
  const usagePercent = Math.min(100, (usage.credits_used / currentPlan.limit) * 100)

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Billing & Subscription</h2>
        <p className="text-gray-600">
          Manage your subscription and billing information
        </p>
      </div>

      {/* Status Messages */}
      {message && (
        <div className={`flex items-center gap-2 p-4 rounded-lg ${
          message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
        }`}>
          {message.type === 'success' ? (
            <CheckCircle className="h-5 w-5" />
          ) : (
            <AlertCircle className="h-5 w-5" />
          )}
          {message.text}
        </div>
      )}

      {/* Subscription Status Alert */}
      {subscription.subscription_status === 'past_due' && (
        <div className="flex items-center gap-2 p-4 rounded-lg bg-yellow-50 text-yellow-700">
          <AlertCircle className="h-5 w-5" />
          Your payment is past due. Please update your payment method to continue using Pro features.
        </div>
      )}

      {subscription.subscription_status === 'cancelled' && subscription.subscription_tier === 'pro' && (
        <div className="flex items-center gap-2 p-4 rounded-lg bg-yellow-50 text-yellow-700">
          <AlertCircle className="h-5 w-5" />
          Your subscription has been cancelled. You&apos;ll have access until the end of your billing period.
        </div>
      )}

      {/* Current Usage */}
      <Card>
        <CardHeader>
          <CardTitle>Current Usage</CardTitle>
          <CardDescription>
            Your credit usage for this billing period
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-3xl font-bold">{usage.credits_used} / {currentPlan.limit}</p>
              <p className="text-sm text-gray-500">creatives used</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium capitalize">{currentPlan.name} Plan</p>
              <p className="text-sm text-gray-500">
                {subscription.subscription_tier === 'pro' ? '50 creatives/month' : '10 total creatives'}
              </p>
            </div>
          </div>
          <div className="mt-4 h-2 w-full rounded-full bg-gray-100">
            <div
              className={`h-2 rounded-full transition-all ${
                usagePercent >= 90 ? 'bg-red-500' : usagePercent >= 70 ? 'bg-yellow-500' : 'bg-blue-600'
              }`}
              style={{ width: `${usagePercent}%` }}
            />
          </div>
          {usagePercent >= 90 && (
            <p className="mt-2 text-sm text-red-500">
              You&apos;re running low on credits. {subscription.subscription_tier === 'free' ? 'Upgrade to Pro for more!' : 'Credits reset at the start of your billing period.'}
            </p>
          )}
        </CardContent>
      </Card>

      {/* Plans */}
      <div className="grid gap-6 md:grid-cols-2">
        {PLANS.map((plan) => {
          const isCurrentPlan = plan.id === subscription.subscription_tier
          return (
            <Card
              key={plan.id}
              className={`${plan.popular ? 'border-blue-600 shadow-lg' : ''} ${isCurrentPlan ? 'ring-2 ring-blue-500' : ''}`}
            >
              {plan.popular && (
                <div className="bg-blue-600 text-white text-center py-1 text-sm font-medium">
                  Most Popular
                </div>
              )}
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  {plan.name}
                  {plan.popular && <Zap className="h-5 w-5 text-yellow-500" />}
                </CardTitle>
                <div className="flex items-baseline">
                  <span className="text-3xl font-bold">{plan.price}</span>
                  <span className="text-gray-500 ml-1">{plan.period}</span>
                </div>
                <CardDescription>{plan.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-500" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                {isCurrentPlan ? (
                  <Button className="w-full" variant="outline" disabled>
                    Current Plan
                  </Button>
                ) : plan.id === 'pro' ? (
                  <Button
                    className="w-full"
                    onClick={handleUpgrade}
                    disabled={actionLoading}
                  >
                    {actionLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Loading...
                      </>
                    ) : (
                      'Upgrade to Pro'
                    )}
                  </Button>
                ) : (
                  <Button className="w-full" variant="outline" disabled>
                    Downgrade
                  </Button>
                )}
              </CardFooter>
            </Card>
          )
        })}
      </div>

      {/* Billing Management */}
      {subscription.stripe_customer_id && (
        <Card>
          <CardHeader>
            <CardTitle>Manage Subscription</CardTitle>
            <CardDescription>
              Update payment method, view invoices, or cancel subscription
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <Button variant="outline" onClick={handleManageBilling} disabled={actionLoading}>
              {actionLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Loading...
                </>
              ) : (
                'Manage Billing'
              )}
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  )
}

export default function BillingPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    }>
      <BillingContent />
    </Suspense>
  )
}
