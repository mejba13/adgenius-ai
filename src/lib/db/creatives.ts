import { createClient } from '@/lib/supabase/server'
import type { Creative, CreativeInsert, CreativeUpdate } from '@/types/database'

export async function getCreatives(
  userId: string,
  options?: {
    type?: 'copy' | 'image' | 'video'
    platform?: 'meta' | 'google' | 'tiktok' | 'linkedin'
    limit?: number
    offset?: number
    favoritesOnly?: boolean
  }
): Promise<Creative[]> {
  const supabase = await createClient()

  let query = supabase
    .from('creatives')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (options?.type) {
    query = query.eq('type', options.type)
  }

  if (options?.platform) {
    query = query.eq('platform', options.platform)
  }

  if (options?.favoritesOnly) {
    query = query.eq('is_favorite', true)
  }

  if (options?.limit) {
    query = query.limit(options.limit)
  }

  if (options?.offset) {
    query = query.range(options.offset, options.offset + (options.limit || 10) - 1)
  }

  const { data, error } = await query

  if (error) {
    console.error('Error fetching creatives:', error)
    return []
  }

  return data || []
}

export async function getCreative(
  userId: string,
  creativeId: string
): Promise<Creative | null> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('creatives')
    .select('*')
    .eq('id', creativeId)
    .eq('user_id', userId)
    .single()

  if (error) {
    console.error('Error fetching creative:', error)
    return null
  }

  return data
}

export async function createCreative(creative: CreativeInsert): Promise<Creative | null> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('creatives')
    .insert(creative)
    .select()
    .single()

  if (error) {
    console.error('Error creating creative:', error)
    return null
  }

  return data
}

export async function updateCreative(
  userId: string,
  creativeId: string,
  updates: CreativeUpdate
): Promise<Creative | null> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('creatives')
    .update(updates)
    .eq('id', creativeId)
    .eq('user_id', userId)
    .select()
    .single()

  if (error) {
    console.error('Error updating creative:', error)
    return null
  }

  return data
}

export async function toggleFavorite(
  userId: string,
  creativeId: string
): Promise<Creative | null> {
  const supabase = await createClient()

  // First get the current state
  const { data: current } = await supabase
    .from('creatives')
    .select('is_favorite')
    .eq('id', creativeId)
    .eq('user_id', userId)
    .single()

  if (!current) return null

  // Toggle the favorite
  const { data, error } = await supabase
    .from('creatives')
    .update({ is_favorite: !current.is_favorite })
    .eq('id', creativeId)
    .eq('user_id', userId)
    .select()
    .single()

  if (error) {
    console.error('Error toggling favorite:', error)
    return null
  }

  return data
}

export async function deleteCreative(
  userId: string,
  creativeId: string
): Promise<boolean> {
  const supabase = await createClient()

  const { error } = await supabase
    .from('creatives')
    .delete()
    .eq('id', creativeId)
    .eq('user_id', userId)

  if (error) {
    console.error('Error deleting creative:', error)
    return false
  }

  return true
}

export async function getCreativeCount(userId: string): Promise<number> {
  const supabase = await createClient()

  const { count, error } = await supabase
    .from('creatives')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)

  if (error) {
    console.error('Error counting creatives:', error)
    return 0
  }

  return count || 0
}
