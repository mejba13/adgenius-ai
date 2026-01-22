import type { GenerationInput, Platform, Tone } from '@/types'
import { PLATFORM_LIMITS } from '@/types'
import type { BrandKit } from '@/types/database'

const TONE_DESCRIPTIONS: Record<Tone, string> = {
  professional: 'formal, business-appropriate, and credible',
  casual: 'friendly, conversational, and approachable',
  urgent: 'creates FOMO, emphasizes scarcity and time-sensitivity',
  playful: 'fun, lighthearted, and entertaining',
  inspirational: 'motivating, uplifting, and emotionally resonant',
}

const PLATFORM_NAMES: Record<Platform, string> = {
  meta: 'Facebook/Instagram',
  google: 'Google Ads',
  tiktok: 'TikTok',
  linkedin: 'LinkedIn',
}

export function buildCopyGenerationPrompt(input: GenerationInput, brandKit?: BrandKit | null): string {
  const limits = PLATFORM_LIMITS[input.platform]
  const platformName = PLATFORM_NAMES[input.platform]
  const toneDescription = TONE_DESCRIPTIONS[input.tone]

  const benefitsList = input.key_benefits
    .filter(Boolean)
    .map(b => `- ${b}`)
    .join('\n')

  const interestsList = input.target_audience.interests
    .filter(Boolean)
    .join(', ')

  const painPointsList = input.target_audience.pain_points
    .filter(Boolean)
    .map(p => `- ${p}`)
    .join('\n')

  // Build brand context from brand kit
  let brandContext = ''
  if (brandKit) {
    const brandParts: string[] = []
    if (brandKit.tone_preset) brandParts.push(`Tone preset: ${brandKit.tone_preset}`)
    if (brandKit.tone_of_voice) brandParts.push(`Voice: ${brandKit.tone_of_voice}`)
    if (brandKit.sample_copy) brandParts.push(`Sample copy style: ${brandKit.sample_copy}`)
    brandContext = brandParts.join('. ')
  }

  return `You are an expert advertising copywriter specializing in direct-response digital advertising. Your task is to create compelling ad copy variations that drive clicks and conversions.

PRODUCT INFORMATION:
- Name: ${input.product_name}
- Description: ${input.product_description}
${benefitsList ? `- Key Benefits:\n${benefitsList}` : ''}
${input.price_point ? `- Price: ${input.price_point}` : ''}

TARGET AUDIENCE:
- Age Range: ${input.target_audience.age_range}
${interestsList ? `- Interests: ${interestsList}` : ''}
${painPointsList ? `- Pain Points:\n${painPointsList}` : ''}

PLATFORM: ${platformName}
TONE: ${toneDescription}
${brandContext ? `\nBRAND VOICE: ${brandContext}` : ''}

CHARACTER LIMITS (STRICT - do not exceed):
- Headline: ${limits.headline} characters
- Primary Text: ${limits.primary_text} characters
${limits.description > 0 ? `- Description: ${limits.description} characters` : '- Description: Not used for this platform'}

Generate exactly 5 ad copy variations, one for each style:
1. URGENCY - Create FOMO, emphasize limited availability or time
2. BENEFIT - Lead with the biggest benefit, focus on what they gain
3. PROBLEM-SOLUTION - Start with the pain point, present product as solution
4. SOCIAL-PROOF - Imply popularity, trust, or results others have seen
5. CURIOSITY - Use a question or intriguing statement to spark interest

Output ONLY valid JSON in this exact format (no markdown, no explanation):
{
  "variations": [
    {
      "id": "1",
      "headline": "headline text here",
      "primary_text": "primary ad text here",
      "description": "description text here or empty string if not used",
      "cta": "Call to action button text",
      "style_group": "urgency"
    },
    {
      "id": "2",
      "headline": "...",
      "primary_text": "...",
      "description": "...",
      "cta": "...",
      "style_group": "benefit"
    },
    {
      "id": "3",
      "headline": "...",
      "primary_text": "...",
      "description": "...",
      "cta": "...",
      "style_group": "problem-solution"
    },
    {
      "id": "4",
      "headline": "...",
      "primary_text": "...",
      "description": "...",
      "cta": "...",
      "style_group": "social-proof"
    },
    {
      "id": "5",
      "headline": "...",
      "primary_text": "...",
      "description": "...",
      "cta": "...",
      "style_group": "curiosity"
    }
  ]
}`
}
