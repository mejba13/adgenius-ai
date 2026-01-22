'use client'

import { useState, useEffect } from 'react'
import { Save, Upload, Loader2, Check, Palette, Type, MessageSquare, Sparkles } from 'lucide-react'

const FONT_OPTIONS = [
  { value: 'inter', label: 'Inter', description: 'Modern, Clean' },
  { value: 'roboto', label: 'Roboto', description: 'Friendly, Readable' },
  { value: 'playfair', label: 'Playfair Display', description: 'Elegant, Serif' },
  { value: 'montserrat', label: 'Montserrat', description: 'Bold, Geometric' },
  { value: 'opensans', label: 'Open Sans', description: 'Neutral, Versatile' },
  { value: 'poppins', label: 'Poppins', description: 'Geometric, Modern' },
]

const TONE_PRESETS = [
  { value: 'professional', label: 'Professional', description: 'Formal and trustworthy', emoji: '👔' },
  { value: 'friendly', label: 'Friendly', description: 'Approachable and warm', emoji: '😊' },
  { value: 'bold', label: 'Bold', description: 'Confident and assertive', emoji: '💪' },
  { value: 'playful', label: 'Playful', description: 'Fun and lighthearted', emoji: '🎉' },
  { value: 'luxury', label: 'Luxury', description: 'Premium and refined', emoji: '✨' },
  { value: 'custom', label: 'Custom', description: 'Write your own', emoji: '📝' },
]

export default function BrandKitPage() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [brandKit, setBrandKit] = useState({
    logo_url: '',
    primary_color: '#3B82F6',
    secondary_color: '#8B5CF6',
    font_family: 'inter',
    tone_preset: 'professional',
    tone_of_voice: '',
    sample_copy: '',
  })

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
          primary_color: data.brandKit.primary_color || '#3B82F6',
          secondary_color: data.brandKit.secondary_color || '#8B5CF6',
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

    const reader = new FileReader()
    reader.onload = (e) => {
      setBrandKit(prev => ({ ...prev, logo_url: e.target?.result as string }))
    }
    reader.readAsDataURL(file)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
          <p className="text-slate-400">Loading brand kit...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in-up">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Brand Kit</h1>
          <p className="text-slate-400 mt-1">
            Set up your brand identity for consistent messaging
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 rounded-xl font-semibold text-white shadow-lg shadow-blue-500/20 transition-all disabled:opacity-50"
        >
          {saving ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : saved ? (
            <>
              <Check className="h-4 w-4" />
              Saved!
            </>
          ) : (
            <>
              <Save className="h-4 w-4" />
              Save Changes
            </>
          )}
        </button>
      </div>

      {/* Bento Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Logo Upload - Large Card */}
        <div className="md:col-span-2 rounded-2xl bg-slate-900/50 border border-white/10 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-lg bg-gradient-to-br from-pink-500 to-rose-600">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">Logo</h2>
              <p className="text-sm text-slate-400">Upload your logo to include in generated assets</p>
            </div>
          </div>

          <div className="flex items-center gap-8">
            <div className="w-32 h-32 rounded-2xl border-2 border-dashed border-white/20 flex items-center justify-center bg-slate-800/50 overflow-hidden">
              {brandKit.logo_url ? (
                <img
                  src={brandKit.logo_url}
                  alt="Logo"
                  className="h-full w-full object-contain"
                />
              ) : (
                <Upload className="h-10 w-10 text-slate-500" />
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
              <label
                htmlFor="logo-upload"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-800 border border-white/10 text-white font-medium hover:bg-slate-700 cursor-pointer transition-colors"
              >
                <Upload className="w-4 h-4" />
                {brandKit.logo_url ? 'Change Logo' : 'Upload Logo'}
              </label>
              <p className="mt-3 text-xs text-slate-500">
                PNG, JPG, or SVG. Max 2MB recommended.
              </p>
            </div>
          </div>
        </div>

        {/* Brand Colors */}
        <div className="rounded-2xl bg-slate-900/50 border border-white/10 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500">
              <Palette className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">Brand Colors</h2>
              <p className="text-sm text-slate-400">Choose your signature colors</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-white">Primary Color</label>
              <div className="flex gap-3">
                <div className="relative">
                  <input
                    type="color"
                    value={brandKit.primary_color}
                    onChange={(e) => setBrandKit(prev => ({ ...prev, primary_color: e.target.value }))}
                    className="w-14 h-12 rounded-xl border-0 cursor-pointer bg-transparent"
                  />
                </div>
                <input
                  type="text"
                  value={brandKit.primary_color}
                  onChange={(e) => setBrandKit(prev => ({ ...prev, primary_color: e.target.value }))}
                  className="flex-1 h-12 px-4 bg-slate-800/50 border border-white/10 rounded-xl text-white uppercase focus:outline-none focus:border-blue-500/50 transition-all"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-white">Secondary Color</label>
              <div className="flex gap-3">
                <div className="relative">
                  <input
                    type="color"
                    value={brandKit.secondary_color}
                    onChange={(e) => setBrandKit(prev => ({ ...prev, secondary_color: e.target.value }))}
                    className="w-14 h-12 rounded-xl border-0 cursor-pointer bg-transparent"
                  />
                </div>
                <input
                  type="text"
                  value={brandKit.secondary_color}
                  onChange={(e) => setBrandKit(prev => ({ ...prev, secondary_color: e.target.value }))}
                  className="flex-1 h-12 px-4 bg-slate-800/50 border border-white/10 rounded-xl text-white uppercase focus:outline-none focus:border-blue-500/50 transition-all"
                />
              </div>
            </div>

            {/* Color Preview */}
            <div className="flex gap-2 pt-2">
              <div
                className="flex-1 h-12 rounded-xl shadow-lg"
                style={{ backgroundColor: brandKit.primary_color }}
              />
              <div
                className="flex-1 h-12 rounded-xl shadow-lg"
                style={{ backgroundColor: brandKit.secondary_color }}
              />
              <div
                className="flex-1 h-12 rounded-xl shadow-lg"
                style={{ background: `linear-gradient(135deg, ${brandKit.primary_color}, ${brandKit.secondary_color})` }}
              />
            </div>
          </div>
        </div>

        {/* Typography */}
        <div className="rounded-2xl bg-slate-900/50 border border-white/10 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500">
              <Type className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">Typography</h2>
              <p className="text-sm text-slate-400">Select fonts that match your brand</p>
            </div>
          </div>

          <div className="space-y-2">
            {FONT_OPTIONS.map((font) => (
              <button
                key={font.value}
                onClick={() => setBrandKit(prev => ({ ...prev, font_family: font.value }))}
                className={`w-full flex items-center justify-between p-3 rounded-xl transition-all ${
                  brandKit.font_family === font.value
                    ? 'bg-slate-800 border-2 border-blue-500'
                    : 'bg-slate-800/50 border border-white/10 hover:border-white/20'
                }`}
              >
                <div>
                  <span className="font-medium text-white">{font.label}</span>
                  <span className="ml-2 text-sm text-slate-400">{font.description}</span>
                </div>
                {brandKit.font_family === font.value && (
                  <Check className="w-5 h-5 text-blue-400" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Brand Voice - Full Width */}
        <div className="md:col-span-2 rounded-2xl bg-slate-900/50 border border-white/10 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-lg bg-gradient-to-br from-emerald-500 to-green-600">
              <MessageSquare className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">Brand Voice</h2>
              <p className="text-sm text-slate-400">Define how your brand communicates</p>
            </div>
          </div>

          <div className="space-y-6">
            {/* Tone Presets */}
            <div className="space-y-3">
              <label className="text-sm font-medium text-white">Tone Preset</label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {TONE_PRESETS.map((tone) => (
                  <button
                    key={tone.value}
                    onClick={() => setBrandKit(prev => ({ ...prev, tone_preset: tone.value }))}
                    className={`flex items-center gap-3 p-3 rounded-xl transition-all ${
                      brandKit.tone_preset === tone.value
                        ? 'bg-slate-800 border-2 border-blue-500'
                        : 'bg-slate-800/50 border border-white/10 hover:border-white/20'
                    }`}
                  >
                    <span className="text-xl">{tone.emoji}</span>
                    <div className="text-left">
                      <p className="font-medium text-white text-sm">{tone.label}</p>
                      <p className="text-xs text-slate-400">{tone.description}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Tone */}
            {brandKit.tone_preset === 'custom' && (
              <div className="space-y-2">
                <label className="text-sm font-medium text-white">Custom Tone Description</label>
                <textarea
                  placeholder="Describe your brand's tone of voice in detail..."
                  value={brandKit.tone_of_voice}
                  onChange={(e) => setBrandKit(prev => ({ ...prev, tone_of_voice: e.target.value }))}
                  rows={3}
                  className="w-full px-4 py-3 bg-slate-800/50 border border-white/10 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500/50 transition-all resize-none"
                />
              </div>
            )}

            {/* Sample Copy */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-white">Sample Copy (Optional)</label>
              <textarea
                placeholder="Paste an example of copy that represents your brand voice well..."
                value={brandKit.sample_copy}
                onChange={(e) => setBrandKit(prev => ({ ...prev, sample_copy: e.target.value }))}
                rows={4}
                className="w-full px-4 py-3 bg-slate-800/50 border border-white/10 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500/50 transition-all resize-none"
              />
              <p className="text-xs text-slate-500">
                This helps the AI understand your brand&apos;s writing style
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
