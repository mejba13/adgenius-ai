import { NextRequest, NextResponse } from 'next/server'

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic'

// Check if we're in demo mode
function isDemoMode(): boolean {
  return !process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    if (isDemoMode()) {
      return NextResponse.json({ success: true, demo_mode: true })
    }

    const { createClient } = await import('@/lib/supabase/server')
    const { deleteCreative } = await import('@/lib/db/creatives')

    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const success = await deleteCreative(user.id, id)
    if (!success) {
      return NextResponse.json({ error: 'Failed to delete creative' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting creative:', error)
    return NextResponse.json({ error: 'Failed to delete creative' }, { status: 500 })
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()

    if (isDemoMode()) {
      return NextResponse.json({ success: true, demo_mode: true })
    }

    const { createClient } = await import('@/lib/supabase/server')
    const { updateCreative, toggleFavorite } = await import('@/lib/db/creatives')

    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Handle favorite toggle
    if (body.toggle_favorite) {
      const creative = await toggleFavorite(user.id, id)
      if (!creative) {
        return NextResponse.json({ error: 'Failed to toggle favorite' }, { status: 500 })
      }
      return NextResponse.json({ creative })
    }

    // Handle other updates
    const creative = await updateCreative(user.id, id, body)
    if (!creative) {
      return NextResponse.json({ error: 'Failed to update creative' }, { status: 500 })
    }

    return NextResponse.json({ creative })
  } catch (error) {
    console.error('Error updating creative:', error)
    return NextResponse.json({ error: 'Failed to update creative' }, { status: 500 })
  }
}
