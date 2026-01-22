import { NextRequest, NextResponse } from 'next/server'
import { isDemoMode, DEMO_USER } from '@/lib/demo-data'

// Force dynamic rendering
export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    if (isDemoMode()) {
      return NextResponse.json({
        profile: DEMO_USER,
        demo_mode: true,
      })
    }

    const { createClient } = await import('@/lib/supabase/server')

    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()

    if (error) {
      console.error('Error fetching profile:', error)
      return NextResponse.json({ error: 'Failed to fetch profile' }, { status: 500 })
    }

    return NextResponse.json({ profile })
  } catch (error) {
    console.error('Profile fetch error:', error)
    return NextResponse.json({ error: 'Failed to fetch profile' }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()

    if (isDemoMode()) {
      return NextResponse.json({
        profile: { ...DEMO_USER, ...body },
        demo_mode: true,
      })
    }

    const { createClient } = await import('@/lib/supabase/server')

    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Only allow updating name and avatar_url
    const updates: { name?: string; avatar_url?: string } = {}
    if (body.name !== undefined) updates.name = body.name
    if (body.avatar_url !== undefined) updates.avatar_url = body.avatar_url

    const { data: profile, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', user.id)
      .select()
      .single()

    if (error) {
      console.error('Error updating profile:', error)
      return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 })
    }

    return NextResponse.json({ profile })
  } catch (error) {
    console.error('Profile update error:', error)
    return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 })
  }
}

export async function DELETE() {
  try {
    if (isDemoMode()) {
      return NextResponse.json({ success: true, demo_mode: true })
    }

    const { createClient } = await import('@/lib/supabase/server')

    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Delete user's data (cascading deletes handle related tables)
    const { error: deleteError } = await supabase
      .from('profiles')
      .delete()
      .eq('id', user.id)

    if (deleteError) {
      console.error('Error deleting profile:', deleteError)
      return NextResponse.json({ error: 'Failed to delete account' }, { status: 500 })
    }

    // Sign out the user
    await supabase.auth.signOut()

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Account deletion error:', error)
    return NextResponse.json({ error: 'Failed to delete account' }, { status: 500 })
  }
}
