'use client'

import { useState } from 'react'
import { ArrowLeft, ArrowRight, Loader2, Sparkles, Check, Copy, Save, Wand2 } from 'lucide-react'
import type { Platform, Tone, GenerationInput, CopyVariation, StyleGroup } from '@/types'

const STEPS = [
  { id: 'product', title: 'Product Info', description: 'Tell us about your product' },
  { id: 'audience', title: 'Target Audience', description: 'Define who you want to reach' },
  { id: 'platform', title: 'Platform & Tone', description: 'Choose your ad settings' },
  { id: 'generate', title: 'Generate', description: 'Review and create' },
]

const PLATFORMS: { value: Platform; label: string; icon: string; color: string }[] = [
  { value: 'meta', label: 'Meta', icon: '📘', color: 'from-blue-500 to-blue-600' },
  { value: 'google', label: 'Google', icon: '🔍', color: 'from-red-500 to-yellow-500' },
  { value: 'tiktok', label: 'TikTok', icon: '🎵', color: 'from-pink-500 to-cyan-500' },
  { value: 'linkedin', label: 'LinkedIn', icon: '💼', color: 'from-blue-600 to-blue-700' },
]

const TONES: { value: Tone; label: string; description: string; emoji: string }[] = [
  { value: 'professional', label: 'Professional', description: 'Formal and business-appropriate', emoji: '👔' },
  { value: 'casual', label: 'Casual', description: 'Friendly and conversational', emoji: '😊' },
  { value: 'urgent', label: 'Urgent', description: 'Creates FOMO and urgency', emoji: '⚡' },
  { value: 'playful', label: 'Playful', description: 'Fun and lighthearted', emoji: '🎉' },
  { value: 'inspirational', label: 'Inspirational', description: 'Motivating and uplifting', emoji: '✨' },
]

const STYLE_LABELS: Record<StyleGroup, { label: string; color: string }> = {
  'urgency': { label: 'Urgency / FOMO', color: 'from-red-500 to-orange-500' },
  'benefit': { label: 'Benefit-Focused', color: 'from-emerald-500 to-green-500' },
  'problem-solution': { label: 'Problem / Solution', color: 'from-blue-500 to-cyan-500' },
  'social-proof': { label: 'Social Proof', color: 'from-purple-500 to-pink-500' },
  'curiosity': { label: 'Curiosity / Question', color: 'from-yellow-500 to-orange-500' },
}

export default function CreatePage() {
  const [currentStep, setCurrentStep] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [results, setResults] = useState<CopyVariation[] | null>(null)
  const [copiedId, setCopiedId] = useState<string | null>(null)

  // Form state
  const [formData, setFormData] = useState<GenerationInput>({
    product_name: '',
    product_description: '',
    key_benefits: ['', '', ''],
    price_point: '',
    target_audience: {
      age_range: '',
      interests: [''],
      pain_points: [''],
    },
    platform: 'meta',
    tone: 'professional',
  })

  const updateFormData = (updates: Partial<GenerationInput>) => {
    setFormData(prev => ({ ...prev, ...updates }))
  }

  const updateBenefits = (index: number, value: string) => {
    const newBenefits = [...formData.key_benefits]
    newBenefits[index] = value
    updateFormData({ key_benefits: newBenefits })
  }

  const updateInterests = (value: string) => {
    updateFormData({
      target_audience: {
        ...formData.target_audience,
        interests: value.split(',').map(s => s.trim()).filter(Boolean),
      },
    })
  }

  const updatePainPoints = (value: string) => {
    updateFormData({
      target_audience: {
        ...formData.target_audience,
        pain_points: value.split(',').map(s => s.trim()).filter(Boolean),
      },
    })
  }

  const canProceed = () => {
    switch (currentStep) {
      case 0:
        return formData.product_name && formData.product_description
      case 1:
        return formData.target_audience.age_range
      case 2:
        return formData.platform && formData.tone
      default:
        return true
    }
  }

  const handleGenerate = async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/generate/copy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Generation failed')
      }

      const data = await response.json()
      setResults(data.variations)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  const handleCopy = (variation: CopyVariation) => {
    const text = `${variation.headline}\n\n${variation.primary_text}\n\n${variation.description}\n\n${variation.cta}`
    navigator.clipboard.writeText(text)
    setCopiedId(variation.id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const handleSave = async (_variation: CopyVariation) => {
    alert('Saved! (Database not connected yet)')
  }

  if (results) {
    // Group results by style
    const groupedResults = results.reduce((acc, variation) => {
      const group = variation.style_group
      if (!acc[group]) acc[group] = []
      acc[group].push(variation)
      return acc
    }, {} as Record<StyleGroup, CopyVariation[]>)

    return (
      <div className="space-y-8 animate-fade-in-up">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Generated Copy</h1>
            <p className="text-slate-400 mt-1">
              5 variations for {PLATFORMS.find(p => p.value === formData.platform)?.label}
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setResults(null)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-800 border border-white/10 text-white hover:bg-slate-700 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Edit Input
            </button>
            <button
              onClick={handleGenerate}
              disabled={loading}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-semibold shadow-lg shadow-blue-500/20 transition-all"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Sparkles className="h-4 w-4" />
              )}
              Regenerate
            </button>
          </div>
        </div>

        {Object.entries(groupedResults).map(([style, variations]) => (
          <div key={style} className="space-y-4">
            <div className="flex items-center gap-3">
              <div className={`h-1 w-8 rounded-full bg-gradient-to-r ${STYLE_LABELS[style as StyleGroup].color}`} />
              <h2 className="text-lg font-semibold text-white">
                {STYLE_LABELS[style as StyleGroup].label}
              </h2>
            </div>
            <div className="grid gap-4">
              {variations.map((variation) => (
                <div
                  key={variation.id}
                  className="group relative overflow-hidden rounded-2xl bg-slate-900/50 border border-white/10 p-6 hover:border-white/20 transition-all"
                >
                  <div className="grid gap-4 md:grid-cols-2 mb-4">
                    <div>
                      <label className="text-xs text-slate-500 uppercase tracking-wider">Headline</label>
                      <p className="text-white font-medium mt-1">{variation.headline}</p>
                    </div>
                    <div>
                      <label className="text-xs text-slate-500 uppercase tracking-wider">CTA</label>
                      <p className="text-white font-medium mt-1">{variation.cta}</p>
                    </div>
                  </div>
                  <div className="mb-4">
                    <label className="text-xs text-slate-500 uppercase tracking-wider">Primary Text</label>
                    <p className="text-slate-300 mt-1">{variation.primary_text}</p>
                  </div>
                  {variation.description && (
                    <div className="mb-4">
                      <label className="text-xs text-slate-500 uppercase tracking-wider">Description</label>
                      <p className="text-slate-400 mt-1">{variation.description}</p>
                    </div>
                  )}
                  <div className="flex justify-end gap-2 pt-4 border-t border-white/5">
                    <button
                      onClick={() => handleCopy(variation)}
                      className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800 border border-white/10 text-sm text-white hover:bg-slate-700 transition-colors"
                    >
                      {copiedId === variation.id ? (
                        <>
                          <Check className="h-4 w-4 text-emerald-400" />
                          Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="h-4 w-4" />
                          Copy
                        </>
                      )}
                    </button>
                    <button
                      onClick={() => handleSave(variation)}
                      className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-sm text-white font-medium hover:from-blue-500 hover:to-purple-500 transition-all"
                    >
                      <Save className="h-4 w-4" />
                      Save
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-fade-in-up">
      <div>
        <h1 className="text-3xl font-bold text-white">Create Ad Copy</h1>
        <p className="text-slate-400 mt-1">
          Fill in your product details to generate high-converting ad copy
        </p>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center justify-between">
        {STEPS.map((step, index) => (
          <div key={step.id} className="flex items-center flex-1">
            <div className="flex flex-col items-center">
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-xl text-sm font-bold transition-all ${
                  index < currentStep
                    ? 'bg-gradient-to-br from-emerald-500 to-green-600 text-white shadow-lg shadow-emerald-500/20'
                    : index === currentStep
                    ? 'bg-gradient-to-br from-blue-500 to-purple-600 text-white shadow-lg shadow-blue-500/20'
                    : 'bg-slate-800 text-slate-500 border border-white/10'
                }`}
              >
                {index < currentStep ? <Check className="w-5 h-5" /> : index + 1}
              </div>
              <span className={`mt-2 text-xs font-medium ${
                index <= currentStep ? 'text-white' : 'text-slate-500'
              }`}>
                {step.title}
              </span>
            </div>
            {index < STEPS.length - 1 && (
              <div className={`flex-1 h-0.5 mx-4 rounded-full ${
                index < currentStep ? 'bg-gradient-to-r from-emerald-500 to-green-500' : 'bg-slate-800'
              }`} />
            )}
          </div>
        ))}
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
          {error}
        </div>
      )}

      {/* Form Card */}
      <div className="rounded-2xl bg-slate-900/50 border border-white/10 overflow-hidden">
        <div className="p-6 border-b border-white/5">
          <h2 className="text-xl font-bold text-white">{STEPS[currentStep].title}</h2>
          <p className="text-slate-400 text-sm mt-1">{STEPS[currentStep].description}</p>
        </div>

        <div className="p-6 space-y-6">
          {/* Step 1: Product Info */}
          {currentStep === 0 && (
            <>
              <div className="space-y-2">
                <label className="text-sm font-medium text-white">Product Name *</label>
                <input
                  type="text"
                  placeholder="e.g., EcoBottle Pro"
                  value={formData.product_name}
                  onChange={(e) => updateFormData({ product_name: e.target.value })}
                  className="w-full h-12 px-4 bg-slate-800/50 border border-white/10 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-white">Product Description *</label>
                <textarea
                  placeholder="Describe your product in 2-3 sentences..."
                  value={formData.product_description}
                  onChange={(e) => updateFormData({ product_description: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-3 bg-slate-800/50 border border-white/10 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all resize-none"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-white">Key Benefits (up to 3)</label>
                <div className="space-y-2">
                  {formData.key_benefits.map((benefit, index) => (
                    <input
                      key={index}
                      type="text"
                      placeholder={`Benefit ${index + 1}`}
                      value={benefit}
                      onChange={(e) => updateBenefits(index, e.target.value)}
                      className="w-full h-12 px-4 bg-slate-800/50 border border-white/10 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all"
                    />
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-white">Price Point (optional)</label>
                <input
                  type="text"
                  placeholder="e.g., $49"
                  value={formData.price_point || ''}
                  onChange={(e) => updateFormData({ price_point: e.target.value })}
                  className="w-full h-12 px-4 bg-slate-800/50 border border-white/10 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all"
                />
              </div>
            </>
          )}

          {/* Step 2: Target Audience */}
          {currentStep === 1 && (
            <>
              <div className="space-y-2">
                <label className="text-sm font-medium text-white">Age Range *</label>
                <div className="grid grid-cols-3 gap-2">
                  {['18-24', '25-34', '35-44', '45-54', '55+', 'All Ages'].map((range) => (
                    <button
                      key={range}
                      type="button"
                      onClick={() => updateFormData({
                        target_audience: { ...formData.target_audience, age_range: range.toLowerCase().replace(' ', '-') },
                      })}
                      className={`px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                        formData.target_audience.age_range === range.toLowerCase().replace(' ', '-')
                          ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/20'
                          : 'bg-slate-800/50 border border-white/10 text-slate-300 hover:bg-slate-800 hover:text-white'
                      }`}
                    >
                      {range}
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-white">Interests (comma-separated)</label>
                <input
                  type="text"
                  placeholder="e.g., fitness, sustainability, outdoor activities"
                  value={formData.target_audience.interests.join(', ')}
                  onChange={(e) => updateInterests(e.target.value)}
                  className="w-full h-12 px-4 bg-slate-800/50 border border-white/10 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-white">Pain Points (comma-separated)</label>
                <textarea
                  placeholder="e.g., expensive alternatives, poor quality, complex setup"
                  value={formData.target_audience.pain_points.join(', ')}
                  onChange={(e) => updatePainPoints(e.target.value)}
                  rows={2}
                  className="w-full px-4 py-3 bg-slate-800/50 border border-white/10 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all resize-none"
                />
              </div>
            </>
          )}

          {/* Step 3: Platform & Tone */}
          {currentStep === 2 && (
            <>
              <div className="space-y-3">
                <label className="text-sm font-medium text-white">Platform *</label>
                <div className="grid grid-cols-2 gap-3">
                  {PLATFORMS.map((platform) => (
                    <button
                      key={platform.value}
                      type="button"
                      onClick={() => updateFormData({ platform: platform.value })}
                      className={`relative overflow-hidden rounded-xl p-4 text-left transition-all ${
                        formData.platform === platform.value
                          ? 'bg-slate-800 border-2 border-blue-500 shadow-lg shadow-blue-500/10'
                          : 'bg-slate-800/50 border border-white/10 hover:border-white/20'
                      }`}
                    >
                      {formData.platform === platform.value && (
                        <div className={`absolute inset-0 bg-gradient-to-br ${platform.color} opacity-10`} />
                      )}
                      <div className="relative flex items-center gap-3">
                        <span className="text-2xl">{platform.icon}</span>
                        <span className="font-semibold text-white">{platform.label}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-3">
                <label className="text-sm font-medium text-white">Tone *</label>
                <div className="space-y-2">
                  {TONES.map((tone) => (
                    <button
                      key={tone.value}
                      type="button"
                      onClick={() => updateFormData({ tone: tone.value })}
                      className={`w-full rounded-xl p-4 text-left transition-all ${
                        formData.tone === tone.value
                          ? 'bg-slate-800 border-2 border-blue-500 shadow-lg shadow-blue-500/10'
                          : 'bg-slate-800/50 border border-white/10 hover:border-white/20'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-xl">{tone.emoji}</span>
                        <div>
                          <span className="font-semibold text-white">{tone.label}</span>
                          <span className="ml-2 text-sm text-slate-400">— {tone.description}</span>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Step 4: Review & Generate */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-xl bg-slate-800/50 border border-white/10 p-4">
                  <label className="text-xs text-slate-500 uppercase tracking-wider">Product</label>
                  <p className="text-white font-medium mt-1">{formData.product_name}</p>
                </div>
                <div className="rounded-xl bg-slate-800/50 border border-white/10 p-4">
                  <label className="text-xs text-slate-500 uppercase tracking-wider">Platform</label>
                  <p className="text-white font-medium mt-1 flex items-center gap-2">
                    <span>{PLATFORMS.find(p => p.value === formData.platform)?.icon}</span>
                    {PLATFORMS.find(p => p.value === formData.platform)?.label}
                  </p>
                </div>
                <div className="rounded-xl bg-slate-800/50 border border-white/10 p-4">
                  <label className="text-xs text-slate-500 uppercase tracking-wider">Tone</label>
                  <p className="text-white font-medium mt-1 flex items-center gap-2">
                    <span>{TONES.find(t => t.value === formData.tone)?.emoji}</span>
                    {TONES.find(t => t.value === formData.tone)?.label}
                  </p>
                </div>
                <div className="rounded-xl bg-slate-800/50 border border-white/10 p-4">
                  <label className="text-xs text-slate-500 uppercase tracking-wider">Audience</label>
                  <p className="text-white font-medium mt-1">{formData.target_audience.age_range}</p>
                </div>
              </div>
              <div className="rounded-xl bg-gradient-to-br from-blue-600/10 to-purple-600/10 border border-blue-500/20 p-6">
                <div className="flex items-center gap-3 mb-3">
                  <Wand2 className="w-5 h-5 text-blue-400" />
                  <span className="font-semibold text-white">Ready to Generate</span>
                </div>
                <p className="text-sm text-slate-400">
                  Click generate to create 5 ad copy variations grouped by style.
                  Generation typically takes 10-15 seconds.
                </p>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between pt-6 border-t border-white/5">
            <button
              onClick={() => setCurrentStep(prev => prev - 1)}
              disabled={currentStep === 0}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium transition-all ${
                currentStep === 0
                  ? 'bg-slate-800/50 text-slate-500 cursor-not-allowed'
                  : 'bg-slate-800 border border-white/10 text-white hover:bg-slate-700'
              }`}
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </button>

            {currentStep < STEPS.length - 1 ? (
              <button
                onClick={() => setCurrentStep(prev => prev + 1)}
                disabled={!canProceed()}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium transition-all ${
                  !canProceed()
                    ? 'bg-slate-800/50 text-slate-500 cursor-not-allowed'
                    : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white shadow-lg shadow-blue-500/20'
                }`}
              >
                Next
                <ArrowRight className="h-4 w-4" />
              </button>
            ) : (
              <button
                onClick={handleGenerate}
                disabled={loading}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl font-semibold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white shadow-lg shadow-blue-500/20 transition-all disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" />
                    Generate Copy
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
