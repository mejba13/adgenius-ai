'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Save, Upload, Loader2, Check } from 'lucide-react'

const FONT_OPTIONS = [
  { value: 'inter', label: 'Inter (Modern, Clean)' },
  { value: 'roboto', label: 'Roboto (Friendly, Readable)' },
  { value: 'playfair', label: 'Playfair Display (Elegant, Serif)' },
  { value: 'montserrat', label: 'Montserrat (Bold, Geometric)' },
  { value: 'opensans', label: 'Open Sans (Neutral, Versatile)' },
  { value: 'poppins', label: 'Poppins (Geometric, Modern)' },
]

const TONE_PRESETS = [
  { value: 'professional', label: 'Professional & Trustworthy' },
  { value: 'friendly', label: 'Friendly & Approachable' },
  { value: 'bold', label: 'Bold & Confident' },
  { value: 'playful', label: 'Playful & Fun' },
  { value: 'luxury', label: 'Premium & Luxurious' },
  { value: 'custom', label: 'Custom (write your own)' },
]

export default function BrandKitPage() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [brandKit, setBrandKit] = useState({
    logo_url: '',
    primary_color: '#2563EB',
    secondary_color: '#10B981',
    font_family: 'inter',
    tone_preset: 'professional',
    tone_of_voice: '',
    sample_copy: '',
  })

  // Load brand kit on mount
  useEffect(() => {
    fetchBrandKit()
  }, [])

  const fetchBrandKit = async () => {
    try {
      const res = await fetch('/api/brand-kit')
      const data = await res.json()
      if (data.brandKit) {
        setBrandKit({
          logo_url: data.brandKit.logo_url || '',
          primary_color: data.brandKit.primary_color || '#2563EB',
          secondary_color: data.brandKit.secondary_color || '#10B981',
          font_family: data.brandKit.font_family || 'inter',
          tone_preset: data.brandKit.tone_preset || 'professional',
          tone_of_voice: data.brandKit.tone_of_voice || '',
          sample_copy: data.brandKit.sample_copy || '',
        })
      }
    } catch (error) {
      console.error('Failed to load brand kit:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    setSaved(false)
    try {
      const res = await fetch('/api/brand-kit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(brandKit),
      })
      if (res.ok) {
        setSaved(true)
        setTimeout(() => setSaved(false), 2000)
      }
    } catch (error) {
      console.error('Failed to save brand kit:', error)
    } finally {
      setSaving(false)
    }
  }

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // For now, create a local preview (Supabase Storage integration can be added later)
    const reader = new FileReader()
    reader.onload = (e) => {
      setBrandKit(prev => ({ ...prev, logo_url: e.target?.result as string }))
    }
    reader.readAsDataURL(file)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Brand Kit</h2>
        <p className="text-gray-600">
          Set up your brand identity to ensure consistent messaging across all generated content
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Logo</CardTitle>
          <CardDescription>
            Upload your logo to include in generated assets
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-6">
            <div className="h-24 w-24 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center bg-gray-50 overflow-hidden">
              {brandKit.logo_url ? (
                <img
                  src={brandKit.logo_url}
                  alt="Logo"
                  className="h-full w-full object-contain"
                />
              ) : (
                <Upload className="h-8 w-8 text-gray-400" />
              )}
            </div>
            <div>
              <input
                type="file"
                id="logo-upload"
                accept="image/*"
                className="hidden"
                onChange={handleLogoUpload}
              />
              <Button variant="outline" asChild>
                <label htmlFor="logo-upload" className="cursor-pointer">
                  {brandKit.logo_url ? 'Change Logo' : 'Upload Logo'}
                </label>
              </Button>
              <p className="mt-2 text-xs text-gray-500">
                PNG, JPG, or SVG. Max 2MB.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Brand Colors</CardTitle>
          <CardDescription>
            Choose colors that represent your brand
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="primary_color">Primary Color</Label>
              <div className="flex gap-2">
                <input
                  type="color"
                  id="primary_color"
                  value={brandKit.primary_color}
                  onChange={(e) => setBrandKit(prev => ({ ...prev, primary_color: e.target.value }))}
                  className="h-10 w-14 rounded border cursor-pointer"
                />
                <Input
                  value={brandKit.primary_color}
                  onChange={(e) => setBrandKit(prev => ({ ...prev, primary_color: e.target.value }))}
                  className="flex-1"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="secondary_color">Secondary Color</Label>
              <div className="flex gap-2">
                <input
                  type="color"
                  id="secondary_color"
                  value={brandKit.secondary_color}
                  onChange={(e) => setBrandKit(prev => ({ ...prev, secondary_color: e.target.value }))}
                  className="h-10 w-14 rounded border cursor-pointer"
                />
                <Input
                  value={brandKit.secondary_color}
                  onChange={(e) => setBrandKit(prev => ({ ...prev, secondary_color: e.target.value }))}
                  className="flex-1"
                />
              </div>
            </div>
          </div>
          <div className="flex gap-2 pt-2">
            <div
              className="h-12 flex-1 rounded-lg"
              style={{ backgroundColor: brandKit.primary_color }}
            />
            <div
              className="h-12 flex-1 rounded-lg"
              style={{ backgroundColor: brandKit.secondary_color }}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Typography</CardTitle>
          <CardDescription>
            Select fonts that match your brand personality
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label>Font Family</Label>
            <Select
              value={brandKit.font_family}
              onValueChange={(value) => setBrandKit(prev => ({ ...prev, font_family: value }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {FONT_OPTIONS.map((font) => (
                  <SelectItem key={font.value} value={font.value}>
                    {font.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Brand Voice</CardTitle>
          <CardDescription>
            Define how your brand communicates with your audience
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Tone Preset</Label>
            <Select
              value={brandKit.tone_preset}
              onValueChange={(value) => setBrandKit(prev => ({ ...prev, tone_preset: value }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {TONE_PRESETS.map((tone) => (
                  <SelectItem key={tone.value} value={tone.value}>
                    {tone.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {brandKit.tone_preset === 'custom' && (
            <div className="space-y-2">
              <Label htmlFor="tone_of_voice">Custom Tone Description</Label>
              <Textarea
                id="tone_of_voice"
                placeholder="Describe your brand's tone of voice in detail..."
                value={brandKit.tone_of_voice}
                onChange={(e) => setBrandKit(prev => ({ ...prev, tone_of_voice: e.target.value }))}
                rows={3}
              />
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="sample_copy">Sample Copy (Optional)</Label>
            <Textarea
              id="sample_copy"
              placeholder="Paste an example of copy that represents your brand voice well..."
              value={brandKit.sample_copy}
              onChange={(e) => setBrandKit(prev => ({ ...prev, sample_copy: e.target.value }))}
              rows={4}
            />
            <p className="text-xs text-gray-500">
              This helps the AI understand your brand&apos;s writing style
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={saving}>
          {saving ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : saved ? (
            <>
              <Check className="h-4 w-4 mr-2" />
              Saved
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              Save Brand Kit
            </>
          )}
        </Button>
      </div>
    </div>
  )
}
