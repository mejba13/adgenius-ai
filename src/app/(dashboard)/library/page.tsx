'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Search, Star, Download, Trash2, Copy, Filter, Loader2, Plus, Check, FolderOpen } from 'lucide-react'
import type { Platform, Creative } from '@/types'

const PLATFORM_CONFIG: Record<Platform, { label: string; icon: string; color: string }> = {
  meta: { label: 'Meta', icon: '📘', color: 'from-blue-500 to-blue-600' },
  google: { label: 'Google', icon: '🔍', color: 'from-red-500 to-yellow-500' },
  tiktok: { label: 'TikTok', icon: '🎵', color: 'from-pink-500 to-cyan-500' },
  linkedin: { label: 'LinkedIn', icon: '💼', color: 'from-blue-600 to-blue-700' },
}

export default function LibraryPage() {
  const [creatives, setCreatives] = useState<Creative[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [platformFilter, setPlatformFilter] = useState<Platform | 'all'>('all')
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false)
  const [copiedId, setCopiedId] = useState<string | null>(null)

  useEffect(() => {
    fetchCreatives()
  }, [])

  const fetchCreatives = async () => {
    try {
      const res = await fetch('/api/creatives')
      const data = await res.json()
      if (data.creatives) {
        setCreatives(data.creatives)
      }
    } catch (error) {
      console.error('Failed to fetch creatives:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredCreatives = creatives.filter(creative => {
    if (platformFilter !== 'all' && creative.platform !== platformFilter) return false
    if (showFavoritesOnly && !creative.is_favorite) return false
    if (searchQuery) {
      const searchLower = searchQuery.toLowerCase()
      const matchesName = creative.name?.toLowerCase().includes(searchLower)
      const matchesContent = creative.content.some(v =>
        v.headline.toLowerCase().includes(searchLower) ||
        v.primary_text.toLowerCase().includes(searchLower)
      )
      if (!matchesName && !matchesContent) return false
    }
    return true
  })

  const handleCopyToClipboard = (creative: Creative) => {
    const text = creative.content.map(v =>
      `${v.headline}\n\n${v.primary_text}\n\n${v.description}\n\nCTA: ${v.cta}`
    ).join('\n\n---\n\n')
    navigator.clipboard.writeText(text)
    setCopiedId(creative.id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const handleToggleFavorite = async (id: string) => {
    try {
      const res = await fetch(`/api/creatives/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ toggle_favorite: true }),
      })
      if (res.ok) {
        setCreatives(prev =>
          prev.map(c => c.id === id ? { ...c, is_favorite: !c.is_favorite } : c)
        )
      }
    } catch (error) {
      console.error('Failed to toggle favorite:', error)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this creative?')) return
    try {
      const res = await fetch(`/api/creatives/${id}`, { method: 'DELETE' })
      if (res.ok) {
        setCreatives(prev => prev.filter(c => c.id !== id))
      }
    } catch (error) {
      console.error('Failed to delete creative:', error)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
          <p className="text-slate-400">Loading your creatives...</p>
        </div>
      </div>
    )
  }

  if (creatives.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 animate-fade-in-up">
        <div className="w-20 h-20 rounded-2xl bg-slate-800/50 border border-white/10 flex items-center justify-center mb-6">
          <FolderOpen className="w-10 h-10 text-slate-500" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Your library is empty</h2>
        <p className="text-slate-400 mb-8 text-center max-w-md">
          Generate your first ad copy to see it here. Create compelling variations for all your campaigns.
        </p>
        <Link
          href="/create"
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 rounded-xl font-semibold text-white shadow-lg shadow-blue-500/20 transition-all"
        >
          <Plus className="w-5 h-5" />
          Create Ad Copy
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-8 animate-fade-in-up">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Creative Library</h1>
          <p className="text-slate-400 mt-1">
            {filteredCreatives.length} creative{filteredCreatives.length !== 1 ? 's' : ''} found
          </p>
        </div>
        <Link
          href="/create"
          className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 rounded-xl font-semibold text-white shadow-lg shadow-blue-500/20 transition-all"
        >
          <Plus className="w-5 h-5" />
          Create New
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4">
        {/* Search */}
        <div className="relative flex-1 min-w-[280px] max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
          <input
            type="text"
            placeholder="Search creatives..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-12 pl-12 pr-4 bg-slate-900/50 border border-white/10 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all"
          />
        </div>

        {/* Platform Filter */}
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-slate-500" />
          <select
            value={platformFilter}
            onChange={(e) => setPlatformFilter(e.target.value as Platform | 'all')}
            className="h-12 px-4 bg-slate-900/50 border border-white/10 rounded-xl text-white focus:outline-none focus:border-blue-500/50 transition-all appearance-none cursor-pointer min-w-[150px]"
          >
            <option value="all">All Platforms</option>
            <option value="meta">Meta</option>
            <option value="google">Google</option>
            <option value="tiktok">TikTok</option>
            <option value="linkedin">LinkedIn</option>
          </select>
        </div>

        {/* Favorites Toggle */}
        <button
          onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
          className={`flex items-center gap-2 h-12 px-5 rounded-xl font-medium transition-all ${
            showFavoritesOnly
              ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white shadow-lg shadow-yellow-500/20'
              : 'bg-slate-900/50 border border-white/10 text-slate-300 hover:text-white hover:border-white/20'
          }`}
        >
          <Star className={`w-5 h-5 ${showFavoritesOnly ? 'fill-current' : ''}`} />
          Favorites
        </button>
      </div>

      {/* Creative Grid */}
      {filteredCreatives.length === 0 ? (
        <div className="text-center py-12 rounded-2xl bg-slate-900/50 border border-white/10">
          <p className="text-slate-400 mb-4">No creatives match your filters</p>
          <button
            onClick={() => {
              setSearchQuery('')
              setPlatformFilter('all')
              setShowFavoritesOnly(false)
            }}
            className="text-blue-400 hover:text-blue-300 transition-colors"
          >
            Clear all filters
          </button>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredCreatives.map((creative) => {
            const platformConfig = PLATFORM_CONFIG[creative.platform]
            return (
              <div
                key={creative.id}
                className="group relative overflow-hidden rounded-2xl bg-slate-900/50 border border-white/10 hover:border-white/20 transition-all"
              >
                {/* Platform Badge */}
                <div className="absolute top-4 left-4 z-10">
                  <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gradient-to-r ${platformConfig.color} text-white text-sm font-medium shadow-lg`}>
                    <span>{platformConfig.icon}</span>
                    {platformConfig.label}
                  </div>
                </div>

                {/* Favorite Button */}
                <button
                  onClick={() => handleToggleFavorite(creative.id)}
                  className="absolute top-4 right-4 z-10 p-2 rounded-lg bg-slate-800/80 backdrop-blur-sm border border-white/10 hover:border-white/20 transition-all"
                >
                  <Star
                    className={`w-5 h-5 transition-colors ${
                      creative.is_favorite
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-slate-400 hover:text-yellow-400'
                    }`}
                  />
                </button>

                {/* Content */}
                <div className="p-6 pt-16">
                  <h3 className="text-lg font-semibold text-white mb-2 line-clamp-1">
                    {creative.name || creative.input_params?.product_name || 'Untitled'}
                  </h3>

                  <div className="space-y-3 mb-4">
                    <div>
                      <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Headline</p>
                      <p className="text-white font-medium line-clamp-1">
                        {creative.content[0]?.headline}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Preview</p>
                      <p className="text-sm text-slate-400 line-clamp-2">
                        {creative.content[0]?.primary_text}
                      </p>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-4 border-t border-white/5">
                    <span className="text-xs text-slate-500">
                      {creative.content.length} variation{creative.content.length !== 1 ? 's' : ''}
                    </span>
                    <div className="flex gap-1">
                      <button
                        onClick={() => handleCopyToClipboard(creative)}
                        className="p-2 rounded-lg hover:bg-slate-800 transition-colors"
                        title="Copy to clipboard"
                      >
                        {copiedId === creative.id ? (
                          <Check className="w-4 h-4 text-emerald-400" />
                        ) : (
                          <Copy className="w-4 h-4 text-slate-400 hover:text-white" />
                        )}
                      </button>
                      <button
                        className="p-2 rounded-lg hover:bg-slate-800 transition-colors"
                        title="Download"
                      >
                        <Download className="w-4 h-4 text-slate-400 hover:text-white" />
                      </button>
                      <button
                        onClick={() => handleDelete(creative.id)}
                        className="p-2 rounded-lg hover:bg-red-500/10 transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4 text-slate-400 hover:text-red-400" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Hover Gradient */}
                <div className={`absolute inset-0 bg-gradient-to-br ${platformConfig.color} opacity-0 group-hover:opacity-5 transition-opacity pointer-events-none`} />
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
