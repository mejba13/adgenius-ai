import { NextRequest, NextResponse } from 'next/server'
import { isDemoMode, DEMO_CREATIVES } from '@/lib/demo-data'

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type') as 'copy' | 'image' | 'video' | null
    const platform = searchParams.get('platform') as 'meta' | 'google' | 'tiktok' | 'linkedin' | null
    const favoritesOnly = searchParams.get('favorites') === 'true'

    if (isDemoMode()) {
      let filtered = [...DEMO_CREATIVES]
      if (type) filtered = filtered.filter(c => c.type === type)
      if (platform) filtered = filtered.filter(c => c.platform === platform)
      if (favoritesOnly) filtered = filtered.filter(c => c.is_favorite)
      return NextResponse.json({ creatives: filtered, demo_mode: true })
    }

    const { createClient } = await import('@/lib/supabase/server')
    const { getCreatives } = await import('@/lib/db/creatives')

    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const creatives = await getCreatives(user.id, {
      type: type || undefined,
      platform: platform || undefined,
      favoritesOnly,
    })

    return NextResponse.json({ creatives })
  } catch (error) {
    console.error('Error fetching creatives:', error)
    return NextResponse.json({ error: 'Failed to fetch creatives' }, { status: 500 })
  }
}
