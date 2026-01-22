import Link from 'next/link'
import { PenTool, FolderOpen, Palette, Zap, TrendingUp, Star, Clock, ArrowRight, Sparkles } from 'lucide-react'
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
    <div className="space-y-8 animate-fade-in-up">
      {/* Welcome Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">
            Welcome back
          </h1>
          <p className="text-slate-400 mt-1">
            Create high-converting ad copy in seconds with AI
          </p>
        </div>
        <Link
          href="/create"
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 rounded-xl font-semibold text-white shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 transition-all"
        >
          <Sparkles className="w-5 h-5" />
          Create New
        </Link>
      </div>

      {/* Bento Grid Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Creatives - Large Card */}
        <div className="lg:col-span-2 relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600/20 to-purple-600/20 border border-white/10 p-6 group hover:border-white/20 transition-all">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 to-purple-600/10 opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="relative">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg shadow-blue-500/20">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-slate-400">Total Creatives</p>
                <p className="text-4xl font-bold text-white">{stats.totalCreatives}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span className="text-emerald-400">+12%</span>
              <span className="text-slate-500">vs last month</span>
            </div>
          </div>
          <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-blue-500/20 rounded-full blur-2xl" />
        </div>

        {/* This Month */}
        <div className="relative overflow-hidden rounded-2xl bg-slate-900/50 border border-white/10 p-6 group hover:border-white/20 transition-all">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 shadow-lg shadow-emerald-500/20">
              <Clock className="w-5 h-5 text-white" />
            </div>
          </div>
          <p className="text-sm text-slate-400">This Month</p>
          <p className="text-3xl font-bold text-white mt-1">{stats.thisMonth}</p>
          <div className="absolute -bottom-4 -right-4 w-20 h-20 bg-emerald-500/10 rounded-full blur-xl" />
        </div>

        {/* Favorites */}
        <div className="relative overflow-hidden rounded-2xl bg-slate-900/50 border border-white/10 p-6 group hover:border-white/20 transition-all">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-yellow-500 to-orange-500 shadow-lg shadow-yellow-500/20">
              <Star className="w-5 h-5 text-white" />
            </div>
          </div>
          <p className="text-sm text-slate-400">Favorites</p>
          <p className="text-3xl font-bold text-white mt-1">{stats.favorites}</p>
          <div className="absolute -bottom-4 -right-4 w-20 h-20 bg-yellow-500/10 rounded-full blur-xl" />
        </div>
      </div>

      {/* Quick Actions Bento */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Link href="/create" className="group">
          <div className="relative overflow-hidden rounded-2xl bg-slate-900/50 border border-white/10 p-6 h-full hover:border-blue-500/50 hover:bg-slate-900/80 transition-all">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative">
              <div className="p-3 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 shadow-lg shadow-violet-500/20 w-fit mb-4">
                <PenTool className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Create Copy</h3>
              <p className="text-sm text-slate-400 mb-4">Generate new ad copy variations</p>
              <div className="flex items-center text-sm text-blue-400 group-hover:text-blue-300 transition-colors">
                Start creating
                <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>
        </Link>

        <Link href="/library" className="group">
          <div className="relative overflow-hidden rounded-2xl bg-slate-900/50 border border-white/10 p-6 h-full hover:border-emerald-500/50 hover:bg-slate-900/80 transition-all">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative">
              <div className="p-3 rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 shadow-lg shadow-emerald-500/20 w-fit mb-4">
                <FolderOpen className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Library</h3>
              <p className="text-sm text-slate-400 mb-4">View your saved creatives</p>
              <div className="flex items-center text-sm text-emerald-400 group-hover:text-emerald-300 transition-colors">
                Browse library
                <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>
        </Link>

        <Link href="/brand-kit" className="group">
          <div className="relative overflow-hidden rounded-2xl bg-slate-900/50 border border-white/10 p-6 h-full hover:border-pink-500/50 hover:bg-slate-900/80 transition-all">
            <div className="absolute inset-0 bg-gradient-to-br from-pink-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative">
              <div className="p-3 rounded-xl bg-gradient-to-br from-pink-500 to-rose-600 shadow-lg shadow-pink-500/20 w-fit mb-4">
                <Palette className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Brand Kit</h3>
              <p className="text-sm text-slate-400 mb-4">Set up your brand identity</p>
              <div className="flex items-center text-sm text-pink-400 group-hover:text-pink-300 transition-colors">
                Configure brand
                <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>
        </Link>

        <Link href="/settings/billing" className="group">
          <div className="relative overflow-hidden rounded-2xl bg-slate-900/50 border border-white/10 p-6 h-full hover:border-yellow-500/50 hover:bg-slate-900/80 transition-all">
            <div className="absolute inset-0 bg-gradient-to-br from-yellow-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative">
              <div className="p-3 rounded-xl bg-gradient-to-br from-yellow-500 to-orange-500 shadow-lg shadow-yellow-500/20 w-fit mb-4">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Upgrade</h3>
              <p className="text-sm text-slate-400 mb-4">Get unlimited creatives</p>
              <div className="flex items-center text-sm text-yellow-400 group-hover:text-yellow-300 transition-colors">
                View plans
                <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>
        </Link>
      </div>

      {/* Getting Started Section */}
      <div className="rounded-2xl bg-slate-900/50 border border-white/10 p-8">
        <h2 className="text-xl font-bold text-white mb-2">Getting Started</h2>
        <p className="text-slate-400 mb-8">Follow these steps to start generating high-converting ad copy</p>

        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              step: 1,
              title: 'Set up your Brand Kit',
              description: 'Add your logo, colors, and brand voice to ensure consistent messaging.',
              link: '/brand-kit',
              linkText: 'Set up Brand Kit',
              gradient: 'from-pink-500 to-rose-600',
            },
            {
              step: 2,
              title: 'Create your first ad copy',
              description: 'Enter your product details and let AI generate compelling variations.',
              link: '/create',
              linkText: 'Create Copy',
              gradient: 'from-violet-500 to-purple-600',
            },
            {
              step: 3,
              title: 'Save and use your favorites',
              description: 'Browse variations, save the best ones, and export for your campaigns.',
              link: '/library',
              linkText: 'View Library',
              gradient: 'from-emerald-500 to-green-600',
            },
          ].map((item) => (
            <div key={item.step} className="flex gap-4">
              <div className={`flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br ${item.gradient} flex items-center justify-center text-white font-bold shadow-lg`}>
                {item.step}
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-white mb-2">{item.title}</h3>
                <p className="text-sm text-slate-400 mb-4">{item.description}</p>
                <Link
                  href={item.link}
                  className="inline-flex items-center text-sm text-blue-400 hover:text-blue-300 transition-colors"
                >
                  {item.linkText}
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
