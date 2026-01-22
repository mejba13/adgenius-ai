'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
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
import { ArrowLeft, ArrowRight, Loader2, Sparkles } from 'lucide-react'
import type { Platform, Tone, GenerationInput, CopyVariation, StyleGroup } from '@/types'

const STEPS = [
  { id: 'product', title: 'Product Info' },
  { id: 'audience', title: 'Target Audience' },
  { id: 'platform', title: 'Platform & Tone' },
  { id: 'generate', title: 'Generate' },
]

const PLATFORMS: { value: Platform; label: string }[] = [
  { value: 'meta', label: 'Meta (Facebook/Instagram)' },
  { value: 'google', label: 'Google Ads' },
  { value: 'tiktok', label: 'TikTok' },
  { value: 'linkedin', label: 'LinkedIn' },
]

const TONES: { value: Tone; label: string; description: string }[] = [
  { value: 'professional', label: 'Professional', description: 'Formal and business-appropriate' },
  { value: 'casual', label: 'Casual', description: 'Friendly and conversational' },
  { value: 'urgent', label: 'Urgent', description: 'Creates FOMO and urgency' },
  { value: 'playful', label: 'Playful', description: 'Fun and lighthearted' },
  { value: 'inspirational', label: 'Inspirational', description: 'Motivating and uplifting' },
]

const STYLE_LABELS: Record<StyleGroup, string> = {
  'urgency': 'Urgency / FOMO',
  'benefit': 'Benefit-Focused',
  'problem-solution': 'Problem / Solution',
  'social-proof': 'Social Proof',
  'curiosity': 'Curiosity / Question',
}

export default function CreatePage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [results, setResults] = useState<CopyVariation[] | null>(null)

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

  const handleSave = async (variation: CopyVariation) => {
    // TODO: Save to database
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
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Generated Copy</h2>
            <p className="text-gray-600">
              5 variations for {PLATFORMS.find(p => p.value === formData.platform)?.label}
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setResults(null)}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Edit Input
            </Button>
            <Button onClick={handleGenerate} disabled={loading}>
              {loading ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Sparkles className="h-4 w-4 mr-2" />
              )}
              Regenerate
            </Button>
          </div>
        </div>

        {Object.entries(groupedResults).map(([style, variations]) => (
          <div key={style} className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-700">
              {STYLE_LABELS[style as StyleGroup]}
            </h3>
            {variations.map((variation) => (
              <Card key={variation.id}>
                <CardContent className="pt-6">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <Label className="text-xs text-gray-500">Headline</Label>
                      <p className="font-medium">{variation.headline}</p>
                    </div>
                    <div>
                      <Label className="text-xs text-gray-500">CTA</Label>
                      <p className="font-medium">{variation.cta}</p>
                    </div>
                  </div>
                  <div className="mt-4">
                    <Label className="text-xs text-gray-500">Primary Text</Label>
                    <p className="mt-1">{variation.primary_text}</p>
                  </div>
                  {variation.description && (
                    <div className="mt-4">
                      <Label className="text-xs text-gray-500">Description</Label>
                      <p className="mt-1 text-gray-600">{variation.description}</p>
                    </div>
                  )}
                  <div className="mt-4 flex justify-end gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigator.clipboard.writeText(
                        `${variation.headline}\n\n${variation.primary_text}\n\n${variation.description}\n\n${variation.cta}`
                      )}
                    >
                      Copy
                    </Button>
                    <Button size="sm" onClick={() => handleSave(variation)}>
                      Save
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Create Ad Copy</h2>
        <p className="text-gray-600">
          Fill in your product details to generate high-converting ad copy
        </p>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center justify-between">
        {STEPS.map((step, index) => (
          <div
            key={step.id}
            className="flex items-center"
          >
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium ${
                index <= currentStep
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-500'
              }`}
            >
              {index + 1}
            </div>
            <span
              className={`ml-2 text-sm ${
                index <= currentStep ? 'text-gray-900' : 'text-gray-500'
              }`}
            >
              {step.title}
            </span>
            {index < STEPS.length - 1 && (
              <div
                className={`mx-4 h-0.5 w-8 ${
                  index < currentStep ? 'bg-blue-600' : 'bg-gray-200'
                }`}
              />
            )}
          </div>
        ))}
      </div>

      {error && (
        <div className="p-4 rounded-md bg-red-50 text-red-600 text-sm">
          {error}
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>{STEPS[currentStep].title}</CardTitle>
          <CardDescription>
            {currentStep === 0 && 'Tell us about your product or service'}
            {currentStep === 1 && 'Define who you want to reach'}
            {currentStep === 2 && 'Choose where and how your ad will appear'}
            {currentStep === 3 && 'Review and generate your ad copy'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Step 1: Product Info */}
          {currentStep === 0 && (
            <>
              <div className="space-y-2">
                <Label htmlFor="product_name">Product Name *</Label>
                <Input
                  id="product_name"
                  placeholder="e.g., EcoBottle Pro"
                  value={formData.product_name}
                  onChange={(e) => updateFormData({ product_name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="product_description">Product Description *</Label>
                <Textarea
                  id="product_description"
                  placeholder="Describe your product in 2-3 sentences..."
                  value={formData.product_description}
                  onChange={(e) => updateFormData({ product_description: e.target.value })}
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label>Key Benefits (up to 3)</Label>
                {formData.key_benefits.map((benefit, index) => (
                  <Input
                    key={index}
                    placeholder={`Benefit ${index + 1}`}
                    value={benefit}
                    onChange={(e) => updateBenefits(index, e.target.value)}
                  />
                ))}
              </div>
              <div className="space-y-2">
                <Label htmlFor="price_point">Price Point (optional)</Label>
                <Input
                  id="price_point"
                  placeholder="e.g., $49"
                  value={formData.price_point || ''}
                  onChange={(e) => updateFormData({ price_point: e.target.value })}
                />
              </div>
            </>
          )}

          {/* Step 2: Target Audience */}
          {currentStep === 1 && (
            <>
              <div className="space-y-2">
                <Label htmlFor="age_range">Age Range *</Label>
                <Select
                  value={formData.target_audience.age_range}
                  onValueChange={(value) =>
                    updateFormData({
                      target_audience: { ...formData.target_audience, age_range: value },
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select age range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="18-24">18-24</SelectItem>
                    <SelectItem value="25-34">25-34</SelectItem>
                    <SelectItem value="35-44">35-44</SelectItem>
                    <SelectItem value="45-54">45-54</SelectItem>
                    <SelectItem value="55+">55+</SelectItem>
                    <SelectItem value="all">All Ages</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="interests">Interests (comma-separated)</Label>
                <Input
                  id="interests"
                  placeholder="e.g., fitness, sustainability, outdoor activities"
                  value={formData.target_audience.interests.join(', ')}
                  onChange={(e) => updateInterests(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="pain_points">Pain Points (comma-separated)</Label>
                <Textarea
                  id="pain_points"
                  placeholder="e.g., expensive alternatives, poor quality, complex setup"
                  value={formData.target_audience.pain_points.join(', ')}
                  onChange={(e) => updatePainPoints(e.target.value)}
                  rows={2}
                />
              </div>
            </>
          )}

          {/* Step 3: Platform & Tone */}
          {currentStep === 2 && (
            <>
              <div className="space-y-2">
                <Label>Platform *</Label>
                <div className="grid grid-cols-2 gap-2">
                  {PLATFORMS.map((platform) => (
                    <button
                      key={platform.value}
                      type="button"
                      onClick={() => updateFormData({ platform: platform.value })}
                      className={`rounded-lg border p-3 text-left transition-colors ${
                        formData.platform === platform.value
                          ? 'border-blue-600 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <span className="font-medium">{platform.label}</span>
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <Label>Tone *</Label>
                <div className="space-y-2">
                  {TONES.map((tone) => (
                    <button
                      key={tone.value}
                      type="button"
                      onClick={() => updateFormData({ tone: tone.value })}
                      className={`w-full rounded-lg border p-3 text-left transition-colors ${
                        formData.tone === tone.value
                          ? 'border-blue-600 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <span className="font-medium">{tone.label}</span>
                      <span className="ml-2 text-sm text-gray-500">
                        — {tone.description}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Step 4: Review & Generate */}
          {currentStep === 3 && (
            <div className="space-y-4">
              <div className="rounded-lg bg-gray-50 p-4 space-y-3">
                <div>
                  <span className="text-sm text-gray-500">Product:</span>
                  <p className="font-medium">{formData.product_name}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Platform:</span>
                  <p className="font-medium">
                    {PLATFORMS.find(p => p.value === formData.platform)?.label}
                  </p>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Tone:</span>
                  <p className="font-medium">
                    {TONES.find(t => t.value === formData.tone)?.label}
                  </p>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Audience:</span>
                  <p className="font-medium">{formData.target_audience.age_range}</p>
                </div>
              </div>
              <p className="text-sm text-gray-600">
                Click generate to create 5 ad copy variations grouped by style.
                Generation typically takes 10-15 seconds.
              </p>
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between pt-4">
            <Button
              variant="outline"
              onClick={() => setCurrentStep(prev => prev - 1)}
              disabled={currentStep === 0}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>

            {currentStep < STEPS.length - 1 ? (
              <Button
                onClick={() => setCurrentStep(prev => prev + 1)}
                disabled={!canProceed()}
              >
                Next
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            ) : (
              <Button onClick={handleGenerate} disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 mr-2" />
                    Generate Copy
                  </>
                )}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
