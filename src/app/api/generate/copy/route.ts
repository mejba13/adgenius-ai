import { NextRequest, NextResponse } from 'next/server'
import { openai } from '@/lib/openai/client'
import { buildCopyGenerationPrompt } from '@/lib/openai/prompts'
import type { GenerationInput, CopyVariation } from '@/types'

// Demo response for when OpenAI is not configured
function generateDemoResponse(input: GenerationInput): CopyVariation[] {
  const styles = ['urgency', 'benefit', 'problem-solution', 'social-proof', 'curiosity'] as const

  return styles.map((style, index) => ({
    id: `demo-${index + 1}`,
    style_group: style,
    headline: `${input.product_name} - ${style.charAt(0).toUpperCase() + style.slice(1)} Demo`,
    primary_text: `Discover the power of ${input.product_name}. ${input.product_description.slice(0, 100)}... This is a demo response. Configure your OpenAI API key to get real AI-generated copy.`,
    description: typeof input.target_audience === 'object' && input.target_audience.age_range
      ? `Perfect for ${input.target_audience.age_range}`
      : 'Connect with your audience like never before.',
    cta: getCTA(style),
  }))
}

function getCTA(style: string): string {
  const ctas: Record<string, string> = {
    professional: 'Learn More',
    casual: 'Check It Out',
    urgent: 'Get Started Now',
    emotional: 'Join Us Today',
    humorous: 'Why Not?',
  }
  return ctas[style] || 'Learn More'
}

// Check if we're in demo mode (no external services configured)
function isDemoMode(): boolean {
  const hasSupabase = process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  const hasOpenAI = process.env.OPENAI_API_KEY
  return !hasSupabase || !hasOpenAI
}

export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body: GenerationInput = await request.json()

    // Validate required fields
    if (!body.product_name || !body.product_description || !body.platform || !body.tone) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Demo mode - return mock data without auth or API calls
    if (isDemoMode()) {
      console.log('Running in demo mode - returning mock copy')
      const variations = generateDemoResponse(body)
      return NextResponse.json({
        variations,
        credits_used: 0,
        demo_mode: true,
      })
    }

    // Production mode with full integration
    const { createClient } = await import('@/lib/supabase/server')
    const { getProfile } = await import('@/lib/db/profiles')
    const { getBrandKit } = await import('@/lib/db/brand-kits')
    const { createCreative } = await import('@/lib/db/creatives')
    const { checkUsageLimit, incrementUsage } = await import('@/lib/db/usage')

    // Check authentication
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Get user profile for subscription tier
    const profile = await getProfile(user.id)
    const subscriptionTier = profile?.subscription_tier || 'free'

    // Check usage limits
    const usageCheck = await checkUsageLimit(user.id, subscriptionTier)
    if (!usageCheck.allowed) {
      return NextResponse.json(
        {
          error: 'Credit limit reached',
          credits_used: usageCheck.creditsUsed,
          credits_limit: usageCheck.creditsLimit,
        },
        { status: 403 }
      )
    }

    // Fetch brand kit for context
    const brandKit = await getBrandKit(user.id)

    // Build prompt with brand context
    const prompt = buildCopyGenerationPrompt(body, brandKit)

    // Call OpenAI
    const completion = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [
        {
          role: 'system',
          content: 'You are an expert advertising copywriter. Always respond with valid JSON only.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.8,
      max_tokens: 2000,
      response_format: { type: 'json_object' },
    })

    const responseContent = completion.choices[0]?.message?.content
    if (!responseContent) {
      throw new Error('No response from AI')
    }

    // Parse response
    let parsedResponse: { variations: CopyVariation[] }
    try {
      parsedResponse = JSON.parse(responseContent)
    } catch {
      console.error('Failed to parse AI response:', responseContent)
      throw new Error('Invalid response format from AI')
    }

    if (!parsedResponse.variations || !Array.isArray(parsedResponse.variations)) {
      throw new Error('Invalid response structure from AI')
    }

    // Save to database
    const creative = await createCreative({
      user_id: user.id,
      type: 'copy',
      platform: body.platform,
      name: body.product_name,
      content: parsedResponse.variations,
      input_params: body,
      is_favorite: false,
    })

    // Update usage credits
    const newTotal = await incrementUsage(user.id, 1)

    return NextResponse.json({
      variations: parsedResponse.variations,
      creative_id: creative?.id,
      credits_used: newTotal,
      credits_limit: usageCheck.creditsLimit,
    })
  } catch (error) {
    console.error('Copy generation error:', error)

    if (error instanceof Error) {
      // Handle OpenAI specific errors
      if (error.message.includes('API key')) {
        return NextResponse.json(
          { error: 'AI service configuration error' },
          { status: 500 }
        )
      }
      if (error.message.includes('rate limit')) {
        return NextResponse.json(
          { error: 'Service temporarily unavailable. Please try again.' },
          { status: 429 }
        )
      }
    }

    return NextResponse.json(
      { error: 'Failed to generate copy. Please try again.' },
      { status: 500 }
    )
  }
}
