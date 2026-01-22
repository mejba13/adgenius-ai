export type Platform = 'meta' | 'google' | 'tiktok' | 'linkedin'
export type Tone = 'professional' | 'casual' | 'urgent' | 'playful' | 'inspirational'
export type StyleGroup = 'urgency' | 'benefit' | 'problem-solution' | 'social-proof' | 'curiosity'
export type SubscriptionTier = 'free' | 'pro'
export type SubscriptionStatus = 'active' | 'cancelled' | 'past_due'

export interface User {
  id: string
  email: string
  name: string | null
  avatar_url: string | null
  subscription_tier: SubscriptionTier
  subscription_status: SubscriptionStatus
  stripe_customer_id: string | null
  stripe_subscription_id: string | null
  created_at: string
  updated_at: string
}

export interface BrandKit {
  id: string
  user_id: string
  logo_url: string | null
  primary_color: string
  secondary_color: string
  font_family: string
  tone_of_voice: string
  sample_copy: string | null
  created_at: string
  updated_at: string
}

export interface CopyVariation {
  id: string
  headline: string
  primary_text: string
  description: string
  cta: string
  style_group: StyleGroup
}

export interface Creative {
  id: string
  user_id: string
  type: 'copy'
  platform: Platform
  name: string | null
  content: CopyVariation[]
  input_params: GenerationInput
  is_favorite: boolean
  created_at: string
  updated_at: string
}

export interface GenerationInput {
  product_name: string
  product_description: string
  key_benefits: string[]
  price_point: string | null
  target_audience: {
    age_range: string
    interests: string[]
    pain_points: string[]
  }
  platform: Platform
  tone: Tone
}

export interface UsageRecord {
  id: string
  user_id: string
  period_start: string
  period_end: string
  credits_used: number
  created_at: string
  updated_at: string
}

export const PLATFORM_LIMITS: Record<Platform, { headline: number; primary_text: number; description: number }> = {
  meta: { headline: 40, primary_text: 125, description: 30 },
  google: { headline: 30, primary_text: 90, description: 90 },
  tiktok: { headline: 100, primary_text: 100, description: 0 },
  linkedin: { headline: 70, primary_text: 150, description: 70 },
}

export const TIER_LIMITS: Record<SubscriptionTier, number> = {
  free: 10,
  pro: 50,
}
