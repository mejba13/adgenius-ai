'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { Check, Zap, Loader2, AlertCircle, CheckCircle, CreditCard, Sparkles } from 'lucide-react'

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
    gradient: 'from-slate-500 to-slate-600',
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
    gradient: 'from-blue-600 to-purple-600',
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

    if (searchParams.get('success') === 'true') {
      setMessage({ type: 'success', text: 'Successfully upgraded to Pro! Your subscription is now active.' })
    } else if (searchParams.get('canceled') === 'true') {
      setMessage({ type: 'error', text: 'Checkout was canceled. You can try again anytime.' })
    }
  }, [searchParams])

  const fetchData = async () => {
    try {
      const profileRes = await fetch('/api/profile')
      const profileData = await profileRes.json()

      if (profileData.profile) {
        setSubscription({
          subscription_tier: profileData.profile.subscription_tier || 'free',
          subscription_status: profileData.profile.subscription_status || 'active',
          stripe_customer_id: profileData.profile.stripe_customer_id || null,
        })
      }

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
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
          <p className="text-slate-400">Loading billing info...</p>
        </div>
      </div>
    )
  }

  const currentPlan = PLANS.find(p => p.id === subscription.subscription_tier) || PLANS[0]
  const usagePercent = Math.min(100, (usage.credits_used / currentPlan.limit) * 100)

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in-up">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white">Billing & Subscription</h1>
        <p className="text-slate-400 mt-1">
          Manage your subscription and billing information
        </p>
      </div>

      {/* Status Messages */}
      {message && (
        <div className={`flex items-center gap-3 p-4 rounded-xl ${
          message.type === 'success'
            ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400'
            : 'bg-red-500/10 border border-red-500/20 text-red-400'
        }`}>
          {message.type === 'success' ? (
            <CheckCircle className="h-5 w-5 flex-shrink-0" />
          ) : (
            <AlertCircle className="h-5 w-5 flex-shrink-0" />
          )}
          {message.text}
        </div>
      )}

      {/* Subscription Alerts */}
      {subscription.subscription_status === 'past_due' && (
        <div className="flex items-center gap-3 p-4 rounded-xl bg-yellow-500/10 border border-yellow-500/20 text-yellow-400">
          <AlertCircle className="h-5 w-5 flex-shrink-0" />
          Your payment is past due. Please update your payment method to continue using Pro features.
        </div>
      )}

      {subscription.subscription_status === 'cancelled' && subscription.subscription_tier === 'pro' && (
        <div className="flex items-center gap-3 p-4 rounded-xl bg-yellow-500/10 border border-yellow-500/20 text-yellow-400">
          <AlertCircle className="h-5 w-5 flex-shrink-0" />
          Your subscription has been cancelled. You&apos;ll have access until the end of your billing period.
        </div>
      )}

      {/* Current Usage */}
      <div className="rounded-2xl bg-slate-900/50 border border-white/10 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500">
            <CreditCard className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-white">Current Usage</h2>
            <p className="text-sm text-slate-400">Your credit usage this billing period</p>
          </div>
        </div>

        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-4xl font-bold text-white">{usage.credits_used} / {currentPlan.limit}</p>
            <p className="text-sm text-slate-400 mt-1">creatives used</p>
          </div>
          <div className="text-right">
            <p className="text-sm font-medium text-white capitalize">{currentPlan.name} Plan</p>
            <p className="text-sm text-slate-400">
              {subscription.subscription_tier === 'pro' ? '50 creatives/month' : '10 total creatives'}
            </p>
          </div>
        </div>

        <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all ${
              usagePercent >= 90
                ? 'bg-gradient-to-r from-red-500 to-orange-500'
                : usagePercent >= 70
                ? 'bg-gradient-to-r from-yellow-500 to-orange-500'
                : 'bg-gradient-to-r from-blue-500 to-purple-500'
            }`}
            style={{ width: `${usagePercent}%` }}
          />
        </div>

        {usagePercent >= 90 && (
          <p className="mt-3 text-sm text-red-400">
            You&apos;re running low on credits.{' '}
            {subscription.subscription_tier === 'free'
              ? 'Upgrade to Pro for more!'
              : 'Credits reset at the start of your billing period.'}
          </p>
        )}
      </div>

      {/* Plans */}
      <div className="grid gap-6 md:grid-cols-2">
        {PLANS.map((plan) => {
          const isCurrentPlan = plan.id === subscription.subscription_tier
          return (
            <div
              key={plan.id}
              className={`relative rounded-2xl overflow-hidden ${
                plan.popular
                  ? 'bg-gradient-to-br from-blue-600/20 to-purple-600/20 border-2 border-blue-500/50'
                  : 'bg-slate-900/50 border border-white/10'
              } ${isCurrentPlan ? 'ring-2 ring-blue-500 ring-offset-2 ring-offset-slate-950' : ''}`}
            >
              {/* Popular Badge */}
              {plan.popular && (
                <div className="absolute top-0 right-0">
                  <div className="flex items-center gap-1 px-3 py-1.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xs font-semibold rounded-bl-xl">
                    <Sparkles className="w-3 h-3" />
                    Most Popular
                  </div>
                </div>
              )}

              <div className="p-6">
                <div className="mb-4">
                  <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    {plan.name}
                    {plan.popular && <Zap className="w-5 h-5 text-yellow-400" />}
                  </h3>
                  <div className="flex items-baseline mt-2">
                    <span className="text-4xl font-bold text-white">{plan.price}</span>
                    <span className="text-slate-400 ml-1">{plan.period}</span>
                  </div>
                  <p className="text-slate-400 text-sm mt-2">{plan.description}</p>
                </div>

                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-3">
                      <div className={`p-1 rounded-full bg-gradient-to-br ${plan.gradient}`}>
                        <Check className="h-3 w-3 text-white" />
                      </div>
                      <span className="text-sm text-slate-300">{feature}</span>
                    </li>
                  ))}
                </ul>

                {isCurrentPlan ? (
                  <button
                    disabled
                    className="w-full py-3 rounded-xl bg-slate-800 border border-white/10 text-slate-400 font-medium cursor-not-allowed"
                  >
                    Current Plan
                  </button>
                ) : plan.id === 'pro' ? (
                  <button
                    onClick={handleUpgrade}
                    disabled={actionLoading}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-semibold shadow-lg shadow-blue-500/20 transition-all disabled:opacity-50"
                  >
                    {actionLoading ? (
                      <span className="flex items-center justify-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Loading...
                      </span>
                    ) : (
                      'Upgrade to Pro'
                    )}
                  </button>
                ) : (
                  <button
                    disabled
                    className="w-full py-3 rounded-xl bg-slate-800 border border-white/10 text-slate-400 font-medium cursor-not-allowed"
                  >
                    Downgrade
                  </button>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Billing Management */}
      {subscription.stripe_customer_id && (
        <div className="rounded-2xl bg-slate-900/50 border border-white/10 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-white">Manage Subscription</h2>
              <p className="text-sm text-slate-400 mt-1">
                Update payment method, view invoices, or cancel subscription
              </p>
            </div>
            <button
              onClick={handleManageBilling}
              disabled={actionLoading}
              className="flex items-center gap-2 px-5 py-2.5 bg-slate-800 border border-white/10 rounded-xl font-medium text-white hover:bg-slate-700 transition-all disabled:opacity-50"
            >
              {actionLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <CreditCard className="h-4 w-4" />
              )}
              Manage Billing
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default function BillingPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center py-20">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
          <p className="text-slate-400">Loading billing info...</p>
        </div>
      </div>
    }>
      <BillingContent />
    </Suspense>
  )
}
