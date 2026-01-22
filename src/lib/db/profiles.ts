import { createClient } from '@/lib/supabase/server'
import type { Profile } from '@/types/database'

export async function getProfile(userId: string): Promise<Profile | null> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()

  if (error) {
    console.error('Error fetching profile:', error)
    return null
  }

  return data
}

export async function updateProfile(
  userId: string,
  updates: Partial<Pick<Profile, 'name' | 'avatar_url'>>
): Promise<Profile | null> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId)
    .select()
    .single()

  if (error) {
    console.error('Error updating profile:', error)
    return null
  }

  return data
}

export async function updateSubscription(
  userId: string,
  updates: {
    subscription_tier?: 'free' | 'pro'
    subscription_status?: 'active' | 'cancelled' | 'past_due'
    stripe_customer_id?: string
    stripe_subscription_id?: string
  }
): Promise<Profile | null> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId)
    .select()
    .single()

  if (error) {
    console.error('Error updating subscription:', error)
    return null
  }

  return data
}
