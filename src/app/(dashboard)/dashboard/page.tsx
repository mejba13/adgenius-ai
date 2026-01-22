import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { PenTool, FolderOpen, Palette, Zap } from 'lucide-react'
import { isDemoMode, getDemoStats } from '@/lib/demo-data'

async function getStats(userId: string) {
  if (isDemoMode()) {
    return getDemoStats()
  }

  const { createClient } = await import('@/lib/supabase/server')
  const supabase = await createClient()

  // Get total creatives count
  const { count: totalCreatives } = await supabase
    .from('creatives')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)

  // Get this month's creatives
  const startOfMonth = new Date()
  startOfMonth.setDate(1)
  startOfMonth.setHours(0, 0, 0, 0)

  const { count: thisMonth } = await supabase
    .from('creatives')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)
    .gte('created_at', startOfMonth.toISOString())

  // Get favorites count
  const { count: favorites } = await supabase
    .from('creatives')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)
    .eq('is_favorite', true)

  return {
    totalCreatives: totalCreatives || 0,
    thisMonth: thisMonth || 0,
    favorites: favorites || 0,
  }
}

export default async function DashboardPage() {
  let userId = 'demo-user'

  if (!isDemoMode()) {
    const { createClient } = await import('@/lib/supabase/server')
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      userId = user.id
    }
  }

  const stats = await getStats(userId)

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Dashboard</h2>
        <p className="text-gray-600">
          Create high-converting ad copy in seconds
        </p>
      </div>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Link href="/create">
          <Card className="cursor-pointer transition-shadow hover:shadow-md">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Create Copy</CardTitle>
              <PenTool className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <p className="text-xs text-gray-500">
                Generate new ad copy variations
              </p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/library">
          <Card className="cursor-pointer transition-shadow hover:shadow-md">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Library</CardTitle>
              <FolderOpen className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <p className="text-xs text-gray-500">
                View your saved creatives
              </p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/brand-kit">
          <Card className="cursor-pointer transition-shadow hover:shadow-md">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Brand Kit</CardTitle>
              <Palette className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <p className="text-xs text-gray-500">
                Set up your brand identity
              </p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/settings/billing">
          <Card className="cursor-pointer transition-shadow hover:shadow-md">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Upgrade</CardTitle>
              <Zap className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <p className="text-xs text-gray-500">
                Get unlimited creatives
              </p>
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Creatives</CardDescription>
            <CardTitle className="text-3xl">{stats.totalCreatives}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>This Month</CardDescription>
            <CardTitle className="text-3xl">{stats.thisMonth}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Favorites</CardDescription>
            <CardTitle className="text-3xl">{stats.favorites}</CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Getting Started */}
      <Card>
        <CardHeader>
          <CardTitle>Getting Started</CardTitle>
          <CardDescription>
            Follow these steps to start generating high-converting ad copy
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-600 font-semibold text-sm">
                1
              </div>
              <div>
                <h4 className="font-medium">Set up your Brand Kit</h4>
                <p className="text-sm text-gray-500">
                  Add your logo, colors, and brand voice to ensure consistent messaging.
                </p>
                <Button variant="link" className="px-0" asChild>
                  <Link href="/brand-kit">Set up Brand Kit →</Link>
                </Button>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-600 font-semibold text-sm">
                2
              </div>
              <div>
                <h4 className="font-medium">Create your first ad copy</h4>
                <p className="text-sm text-gray-500">
                  Enter your product details and let AI generate compelling variations.
                </p>
                <Button variant="link" className="px-0" asChild>
                  <Link href="/create">Create Copy →</Link>
                </Button>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-600 font-semibold text-sm">
                3
              </div>
              <div>
                <h4 className="font-medium">Save and use your favorites</h4>
                <p className="text-sm text-gray-500">
                  Browse variations, save the best ones, and export for your campaigns.
                </p>
                <Button variant="link" className="px-0" asChild>
                  <Link href="/library">View Library →</Link>
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
