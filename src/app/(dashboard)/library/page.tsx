'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Search, Star, Download, Trash2, Copy, Filter, Loader2 } from 'lucide-react'
import type { Platform, Creative } from '@/types'
import Link from 'next/link'

const PLATFORM_LABELS: Record<Platform, string> = {
  meta: 'Meta',
  google: 'Google',
  tiktok: 'TikTok',
  linkedin: 'LinkedIn',
}

export default function LibraryPage() {
  const [creatives, setCreatives] = useState<Creative[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [platformFilter, setPlatformFilter] = useState<Platform | 'all'>('all')
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false)

  // Fetch creatives on load
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

  // Filter creatives
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
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    )
  }

  if (creatives.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">Your library is empty</h2>
          <p className="mt-2 text-gray-600">
            Generate your first ad copy to see it here
          </p>
          <Button className="mt-6" asChild>
            <Link href="/create">Create Ad Copy</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Creative Library</h2>
          <p className="text-gray-600">
            {filteredCreatives.length} creative{filteredCreatives.length !== 1 ? 's' : ''}
          </p>
        </div>
        <Button asChild>
          <Link href="/create">Create New</Link>
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4">
        <div className="relative flex-1 min-w-[200px] max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Search creatives..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select
          value={platformFilter}
          onValueChange={(value) => setPlatformFilter(value as Platform | 'all')}
        >
          <SelectTrigger className="w-[180px]">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Platform" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Platforms</SelectItem>
            <SelectItem value="meta">Meta</SelectItem>
            <SelectItem value="google">Google</SelectItem>
            <SelectItem value="tiktok">TikTok</SelectItem>
            <SelectItem value="linkedin">LinkedIn</SelectItem>
          </SelectContent>
        </Select>
        <Button
          variant={showFavoritesOnly ? 'default' : 'outline'}
          onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
        >
          <Star className={`h-4 w-4 mr-2 ${showFavoritesOnly ? 'fill-current' : ''}`} />
          Favorites
        </Button>
      </div>

      {/* Creative Grid */}
      {filteredCreatives.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">No creatives match your filters</p>
          <Button
            variant="link"
            onClick={() => {
              setSearchQuery('')
              setPlatformFilter('all')
              setShowFavoritesOnly(false)
            }}
          >
            Clear filters
          </Button>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredCreatives.map((creative) => (
            <Card key={creative.id} className="relative">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <span className="inline-block px-2 py-1 text-xs font-medium rounded bg-blue-100 text-blue-700">
                      {PLATFORM_LABELS[creative.platform]}
                    </span>
                    <p className="mt-2 font-medium text-gray-900 line-clamp-1">
                      {creative.name || creative.input_params.product_name}
                    </p>
                  </div>
                  <button
                    onClick={() => handleToggleFavorite(creative.id)}
                    className="text-gray-400 hover:text-yellow-500"
                  >
                    <Star
                      className={`h-5 w-5 ${creative.is_favorite ? 'fill-yellow-400 text-yellow-400' : ''}`}
                    />
                  </button>
                </div>

                <div className="space-y-2 mb-4">
                  <p className="text-sm font-medium line-clamp-1">
                    {creative.content[0]?.headline}
                  </p>
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {creative.content[0]?.primary_text}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-4 border-t">
                  <span className="text-xs text-gray-500">
                    {creative.content.length} variation{creative.content.length !== 1 ? 's' : ''}
                  </span>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleCopyToClipboard(creative)}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(creative.id)}
                      className="text-red-500 hover:text-red-600"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
