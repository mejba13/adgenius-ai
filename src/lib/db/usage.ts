import { createClient } from '@/lib/supabase/server'
import type { UsageRecord } from '@/types/database'
import type { SubscriptionTier } from '@/types'

// Credit limits by subscription tier
export const CREDIT_LIMITS: Record<SubscriptionTier, number> = {
  free: 10,
  pro: 50,
}

export async function getCurrentUsage(userId: string): Promise<UsageRecord | null> {
  const supabase = await createClient()

  // Use the database function to get or create usage record
  const { data, error } = await supabase
    .rpc('get_or_create_usage_record', { p_user_id: userId })

  if (error) {
    console.error('Error getting usage record:', error)
    return null
  }

  return data
}

export async function incrementUsage(
  userId: string,
  amount: number = 1
): Promise<number | null> {
  const supabase = await createClient()

  // Use the database function to increment usage
  const { data, error } = await supabase
    .rpc('increment_usage', { p_user_id: userId, p_amount: amount })

  if (error) {
    console.error('Error incrementing usage:', error)
    return null
  }

  return data
}

export async function checkUsageLimit(
  userId: string,
  subscriptionTier: SubscriptionTier
): Promise<{ allowed: boolean; creditsUsed: number; creditsLimit: number }> {
  const usage = await getCurrentUsage(userId)
  const creditsLimit = CREDIT_LIMITS[subscriptionTier]
  const creditsUsed = usage?.credits_used || 0

  return {
    allowed: creditsUsed < creditsLimit,
    creditsUsed,
    creditsLimit,
  }
}

export async function getUsageHistory(
  userId: string,
  months: number = 6
): Promise<UsageRecord[]> {
  const supabase = await createClient()

  // Calculate date range
  const startDate = new Date()
  startDate.setMonth(startDate.getMonth() - months)

  const { data, error } = await supabase
    .from('usage_records')
    .select('*')
    .eq('user_id', userId)
    .gte('period_start', startDate.toISOString().split('T')[0])
    .order('period_start', { ascending: false })

  if (error) {
    console.error('Error fetching usage history:', error)
    return []
  }

  return data || []
}

export async function getRemainingCredits(
  userId: string,
  subscriptionTier: SubscriptionTier
): Promise<number> {
  const usage = await getCurrentUsage(userId)
  const creditsLimit = CREDIT_LIMITS[subscriptionTier]
  const creditsUsed = usage?.credits_used || 0

  return Math.max(0, creditsLimit - creditsUsed)
}
