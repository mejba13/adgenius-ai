'use client'

import { useState, useRef, useEffect } from 'react'
import { User } from '@supabase/supabase-js'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { TIER_LIMITS, type SubscriptionTier } from '@/types'
import { Bell, Search, Zap, ChevronDown, Settings, CreditCard, LogOut, User as UserIcon } from 'lucide-react'

interface HeaderProps {
  user: User | null
  creditsUsed: number
  subscriptionTier: SubscriptionTier
}

export function Header({ user, creditsUsed, subscriptionTier }: HeaderProps) {
  const router = useRouter()
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const creditLimit = TIER_LIMITS[subscriptionTier]
  const creditsRemaining = creditLimit - creditsUsed
  const usagePercent = (creditsUsed / creditLimit) * 100

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  const userName = user?.user_metadata?.name || 'Demo User'
  const userInitial = userName.charAt(0).toUpperCase()

  return (
    <header className="relative flex h-20 items-center justify-between border-b border-white/5 bg-slate-950/50 backdrop-blur-xl px-8" style={{ zIndex: 100 }}>
      {/* Search Bar */}
      <div className="flex-1 max-w-xl">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
          <input
            type="text"
            placeholder="Search creatives, templates..."
            className="w-full h-12 pl-12 pr-4 bg-slate-900/50 border border-white/10 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 px-2 py-1 rounded-md bg-slate-800 border border-white/10">
            <span className="text-xs text-slate-400">⌘</span>
            <span className="text-xs text-slate-400">K</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-6">
        {/* Credits Display */}
        <div className="flex items-center gap-4">
          <div className="flex flex-col items-end">
            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-400">Credits</span>
              <span className={`text-sm font-semibold ${
                creditsRemaining <= 2 ? 'text-red-400' : 'text-white'
              }`}>
                {creditsRemaining} / {creditLimit}
              </span>
            </div>
            <div className="w-32 h-1.5 bg-slate-800 rounded-full mt-1 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${
                  usagePercent >= 90 ? 'bg-red-500' : usagePercent >= 70 ? 'bg-yellow-500' : 'bg-gradient-to-r from-blue-500 to-purple-500'
                }`}
                style={{ width: `${Math.min(usagePercent, 100)}%` }}
              />
            </div>
          </div>
        </div>

        {/* Upgrade Button */}
        {subscriptionTier === 'free' && (
          <Button
            onClick={() => router.push('/settings/billing')}
            className="h-10 px-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 border-0 rounded-xl font-semibold shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 transition-all"
          >
            <Zap className="w-4 h-4 mr-2" />
            Upgrade to Pro
          </Button>
        )}

        {/* Notifications */}
        <button className="relative p-3 rounded-xl bg-slate-900/50 border border-white/10 hover:bg-slate-800/50 transition-colors">
          <Bell className="w-5 h-5 text-slate-400" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-blue-500 rounded-full" />
        </button>

        {/* User Profile Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className={`flex items-center gap-3 p-2 pr-4 rounded-xl border transition-all ${
              isDropdownOpen
                ? 'bg-slate-800/80 border-blue-500/50'
                : 'bg-slate-900/50 border-white/10 hover:bg-slate-800/50'
            }`}
          >
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold text-sm">
              {userInitial}
            </div>
            <div className="flex flex-col items-start">
              <span className="text-sm font-medium text-white">
                {userName}
              </span>
              <span className="text-xs text-slate-500 capitalize">{subscriptionTier} Plan</span>
            </div>
            <ChevronDown className={`w-4 h-4 text-slate-500 ml-2 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
          </button>

          {/* Dropdown Menu */}
          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-slate-900 border border-white/10 shadow-2xl shadow-black/50 overflow-hidden animate-fade-in-up" style={{ zIndex: 9999 }}>
              {/* User Info */}
              <div className="p-4 border-b border-white/5">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg">
                    {userInitial}
                  </div>
                  <div>
                    <p className="font-medium text-white">{userName}</p>
                    <p className="text-xs text-slate-400">{user?.email || 'demo@adgenius.ai'}</p>
                  </div>
                </div>
              </div>

              {/* Menu Items */}
              <div className="p-2">
                <Link
                  href="/settings"
                  onClick={() => setIsDropdownOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-300 hover:bg-slate-800 hover:text-white transition-colors cursor-pointer"
                >
                  <UserIcon className="w-5 h-5 text-slate-400" />
                  <span>Profile Settings</span>
                </Link>
                <Link
                  href="/settings/billing"
                  onClick={() => setIsDropdownOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-300 hover:bg-slate-800 hover:text-white transition-colors cursor-pointer"
                >
                  <CreditCard className="w-5 h-5 text-slate-400" />
                  <span>Billing & Plans</span>
                </Link>
                <Link
                  href="/settings"
                  onClick={() => setIsDropdownOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-300 hover:bg-slate-800 hover:text-white transition-colors cursor-pointer"
                >
                  <Settings className="w-5 h-5 text-slate-400" />
                  <span>Account Settings</span>
                </Link>
              </div>

              {/* Sign Out */}
              <div className="p-2 border-t border-white/5">
                <button
                  onClick={handleSignOut}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 transition-colors"
                >
                  <LogOut className="w-5 h-5" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
