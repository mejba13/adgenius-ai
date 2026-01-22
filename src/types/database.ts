// Database types matching Supabase schema
import type { CopyVariation, GenerationInput } from './index'

export interface Profile {
  id: string
  email: string
  name: string | null
  avatar_url: string | null
  subscription_tier: 'free' | 'pro'
  subscription_status: 'active' | 'cancelled' | 'past_due'
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
  tone_preset: string
  tone_of_voice: string | null
  sample_copy: string | null
  created_at: string
  updated_at: string
}

export interface Creative {
  id: string
  user_id: string
  type: 'copy' | 'image' | 'video'
  platform: 'meta' | 'google' | 'tiktok' | 'linkedin'
  name: string | null
  content: CopyVariation[]
  input_params: GenerationInput
  is_favorite: boolean
  created_at: string
  updated_at: string
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

// Re-export from main types for convenience
export type { CopyVariation, GenerationInput } from './index'

// Database insert/update types (without auto-generated fields)
export type BrandKitInsert = Omit<BrandKit, 'id' | 'created_at' | 'updated_at'>
export type BrandKitUpdate = Partial<Omit<BrandKit, 'id' | 'user_id' | 'created_at' | 'updated_at'>>

export type CreativeInsert = Omit<Creative, 'id' | 'created_at' | 'updated_at'>
export type CreativeUpdate = Partial<Omit<Creative, 'id' | 'user_id' | 'created_at' | 'updated_at'>>
