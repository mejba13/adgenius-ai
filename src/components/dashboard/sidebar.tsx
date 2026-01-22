'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard,
  PenTool,
  FolderOpen,
  Palette,
  Settings,
  CreditCard,
  LogOut,
  Sparkles,
  ChevronRight,
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard, color: 'from-blue-500 to-cyan-500' },
  { name: 'Create Copy', href: '/create', icon: PenTool, color: 'from-violet-500 to-purple-500' },
  { name: 'Library', href: '/library', icon: FolderOpen, color: 'from-emerald-500 to-green-500' },
  { name: 'Brand Kit', href: '/brand-kit', icon: Palette, color: 'from-pink-500 to-rose-500' },
]

const bottomNavigation = [
  { name: 'Settings', href: '/settings', icon: Settings },
  { name: 'Billing', href: '/settings/billing', icon: CreditCard },
]

export function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()

  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  return (
    <div className="flex h-full w-72 flex-col bg-slate-950 border-r border-white/5">
      {/* Logo */}
      <div className="flex h-20 items-center px-6">
        <Link href="/dashboard" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:shadow-blue-500/40 transition-shadow">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="text-xl font-bold text-white tracking-tight">AdGenius</span>
            <span className="text-xl font-bold text-blue-400">AI</span>
          </div>
        </Link>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        <p className="px-3 mb-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
          Main Menu
        </p>
        {navigation.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'group flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition-all duration-200 relative overflow-hidden',
                isActive
                  ? 'bg-white/10 text-white shadow-lg'
                  : 'text-slate-400 hover:bg-white/5 hover:text-white'
              )}
            >
              {/* Active indicator glow */}
              {isActive && (
                <div className={cn(
                  'absolute inset-0 opacity-20 bg-gradient-to-r',
                  item.color
                )} />
              )}

              <div className={cn(
                'relative flex items-center justify-center w-9 h-9 rounded-lg transition-all duration-200',
                isActive
                  ? `bg-gradient-to-br ${item.color} shadow-lg`
                  : 'bg-slate-800/50 group-hover:bg-slate-800'
              )}>
                <item.icon className={cn(
                  'h-5 w-5 transition-colors',
                  isActive ? 'text-white' : 'text-slate-400 group-hover:text-white'
                )} />
              </div>

              <span className="relative flex-1">{item.name}</span>

              {isActive && (
                <ChevronRight className="w-4 h-4 text-white/50" />
              )}
            </Link>
          )
        })}
      </nav>

      {/* Bottom Navigation */}
      <div className="border-t border-white/5 px-4 py-6 space-y-2">
        <p className="px-3 mb-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
          Account
        </p>
        {bottomNavigation.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'group flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition-all duration-200',
                isActive
                  ? 'bg-white/10 text-white'
                  : 'text-slate-400 hover:bg-white/5 hover:text-white'
              )}
            >
              <div className={cn(
                'flex items-center justify-center w-9 h-9 rounded-lg transition-all',
                isActive ? 'bg-slate-800' : 'bg-slate-800/50 group-hover:bg-slate-800'
              )}>
                <item.icon className="h-5 w-5" />
              </div>
              <span className="flex-1">{item.name}</span>
            </Link>
          )
        })}

        <button
          onClick={handleSignOut}
          className="group flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-slate-400 transition-all duration-200 hover:bg-red-500/10 hover:text-red-400"
        >
          <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-slate-800/50 group-hover:bg-red-500/20 transition-all">
            <LogOut className="h-5 w-5" />
          </div>
          <span className="flex-1 text-left">Sign out</span>
        </button>
      </div>

      {/* Pro Upgrade Card */}
      <div className="px-4 pb-6">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 p-[1px]">
          <div className="relative rounded-2xl bg-slate-950/90 p-4">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-purple-600/20 to-pink-600/20" />
            <div className="relative">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-4 h-4 text-yellow-400" />
                <span className="text-xs font-semibold text-yellow-400 uppercase tracking-wider">Pro Plan</span>
              </div>
              <p className="text-sm text-slate-300 mb-3">
                Unlock unlimited creatives and premium features
              </p>
              <Link
                href="/settings/billing"
                className="block w-full py-2 px-4 text-center text-sm font-semibold rounded-lg bg-white text-slate-950 hover:bg-slate-100 transition-colors"
              >
                Upgrade Now
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
