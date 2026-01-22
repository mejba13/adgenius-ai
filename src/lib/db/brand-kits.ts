import { createClient } from '@/lib/supabase/server'
import type { BrandKit, BrandKitInsert, BrandKitUpdate } from '@/types/database'

export async function getBrandKit(userId: string): Promise<BrandKit | null> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('brand_kits')
    .select('*')
    .eq('user_id', userId)
    .single()

  if (error) {
    if (error.code === 'PGRST116') {
      // No rows returned - user doesn't have a brand kit yet
      return null
    }
    console.error('Error fetching brand kit:', error)
    return null
  }

  return data
}

export async function createBrandKit(brandKit: BrandKitInsert): Promise<BrandKit | null> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('brand_kits')
    .insert(brandKit)
    .select()
    .single()

  if (error) {
    console.error('Error creating brand kit:', error)
    return null
  }

  return data
}

export async function updateBrandKit(
  userId: string,
  updates: BrandKitUpdate
): Promise<BrandKit | null> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('brand_kits')
    .update(updates)
    .eq('user_id', userId)
    .select()
    .single()

  if (error) {
    console.error('Error updating brand kit:', error)
    return null
  }

  return data
}

export async function upsertBrandKit(
  userId: string,
  brandKit: Omit<BrandKitInsert, 'user_id'>
): Promise<BrandKit | null> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('brand_kits')
    .upsert({
      user_id: userId,
      ...brandKit,
    }, {
      onConflict: 'user_id',
    })
    .select()
    .single()

  if (error) {
    console.error('Error upserting brand kit:', error)
    return null
  }

  return data
}

export async function deleteBrandKit(userId: string): Promise<boolean> {
  const supabase = await createClient()

  const { error } = await supabase
    .from('brand_kits')
    .delete()
    .eq('user_id', userId)

  if (error) {
    console.error('Error deleting brand kit:', error)
    return false
  }

  return true
}
