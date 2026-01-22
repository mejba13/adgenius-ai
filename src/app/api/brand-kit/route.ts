import { NextRequest, NextResponse } from 'next/server'
import { isDemoMode, DEMO_BRAND_KIT } from '@/lib/demo-data'

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    if (isDemoMode()) {
      return NextResponse.json({ brandKit: DEMO_BRAND_KIT, demo_mode: true })
    }

    const { createClient } = await import('@/lib/supabase/server')
    const { getBrandKit } = await import('@/lib/db/brand-kits')

    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const brandKit = await getBrandKit(user.id)
    return NextResponse.json({ brandKit })
  } catch (error) {
    console.error('Error fetching brand kit:', error)
    return NextResponse.json({ error: 'Failed to fetch brand kit' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    if (isDemoMode()) {
      return NextResponse.json({
        brandKit: { ...DEMO_BRAND_KIT, ...body },
        demo_mode: true,
      })
    }

    const { createClient } = await import('@/lib/supabase/server')
    const { upsertBrandKit } = await import('@/lib/db/brand-kits')

    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const brandKit = await upsertBrandKit(user.id, {
      logo_url: body.logo_url || null,
      primary_color: body.primary_color || '#2563EB',
      secondary_color: body.secondary_color || '#10B981',
      font_family: body.font_family || 'inter',
      tone_preset: body.tone_preset || 'professional',
      tone_of_voice: body.tone_of_voice || null,
      sample_copy: body.sample_copy || null,
    })

    if (!brandKit) {
      return NextResponse.json({ error: 'Failed to save brand kit' }, { status: 500 })
    }

    return NextResponse.json({ brandKit })
  } catch (error) {
    console.error('Error saving brand kit:', error)
    return NextResponse.json({ error: 'Failed to save brand kit' }, { status: 500 })
  }
}
