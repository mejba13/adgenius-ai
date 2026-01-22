'use client'

import { User } from '@supabase/supabase-js'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { TIER_LIMITS, type SubscriptionTier } from '@/types'

interface HeaderProps {
  user: User | null
  creditsUsed: number
  subscriptionTier: SubscriptionTier
}

export function Header({ user, creditsUsed, subscriptionTier }: HeaderProps) {
  const router = useRouter()
  const creditLimit = TIER_LIMITS[subscriptionTier]
  const creditsRemaining = creditLimit - creditsUsed

  return (
    <header className="flex h-16 items-center justify-between border-b bg-white px-6">
      <div>
        <h1 className="text-lg font-semibold text-gray-900">
          Welcome back{user?.user_metadata?.name ? `, ${user.user_metadata.name}` : ''}
        </h1>
      </div>

      <div className="flex items-center gap-4">
        <div className="text-sm">
          <span className="text-gray-500">Credits: </span>
          <span className={creditsRemaining <= 2 ? 'text-red-600 font-medium' : 'text-gray-900'}>
            {creditsRemaining} / {creditLimit}
          </span>
        </div>

        {subscriptionTier === 'free' && (
          <Button
            size="sm"
            onClick={() => router.push('/settings/billing')}
          >
            Upgrade to Pro
          </Button>
        )}
      </div>
    </header>
  )
}
