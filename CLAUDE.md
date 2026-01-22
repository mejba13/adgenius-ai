# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

AdGenius AI is a SaaS platform for AI-powered ad copy generation. The MVP focuses on copy generation only (images/video are phase 2). Target: solo marketers and small e-commerce brands.

**Business Model:** Free tier (10 creatives) + $29/mo Pro tier (50 creatives)

## Tech Stack

- **Framework:** Next.js 14 with App Router (full TypeScript, no separate backend)
- **UI:** shadcn/ui + Tailwind CSS
- **Database:** Supabase (PostgreSQL)
- **Auth:** Supabase Auth (email/password + Google OAuth)
- **Storage:** Supabase Storage (for brand kit assets)
- **Payments:** Stripe (subscriptions)
- **AI:** OpenAI GPT-4 for copy generation
- **Hosting:** Vercel
- **Analytics:** Vercel Analytics

## Project Structure

```
adgenius-ai/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── (auth)/             # Auth pages (login, register)
│   │   ├── (dashboard)/        # Protected dashboard pages
│   │   │   ├── dashboard/      # Main dashboard
│   │   │   ├── create/         # Copy generation wizard
│   │   │   ├── library/        # Saved creatives
│   │   │   ├── brand-kit/      # Brand kit setup
│   │   │   └── settings/       # Account & billing
│   │   └── api/                # API routes
│   │       ├── generate/       # AI generation endpoints
│   │       ├── creatives/      # CRUD for creatives
│   │       └── webhooks/       # Stripe webhooks
│   ├── components/
│   │   ├── ui/                 # shadcn/ui components
│   │   ├── forms/              # Form components
│   │   └── dashboard/          # Dashboard-specific components
│   ├── lib/
│   │   ├── supabase/           # Supabase client & helpers
│   │   ├── stripe/             # Stripe helpers
│   │   ├── openai/             # OpenAI client & prompts
│   │   └── utils.ts            # General utilities
│   ├── hooks/                  # Custom React hooks
│   └── types/                  # TypeScript types
├── supabase/
│   └── migrations/             # Database migrations
└── public/
```

## Key Architecture Decisions

### API Routes over Separate Backend
Using Next.js API routes instead of FastAPI. Single codebase, single deployment, TypeScript throughout.

### Supabase for Everything
- Auth with Row Level Security (RLS)
- PostgreSQL for data
- Storage for brand kit assets (logos)
- Real-time subscriptions if needed later

### Synchronous Generation
Copy generation (~15 seconds) runs synchronously with a loading state. No background jobs or WebSockets for MVP - user stays on page until complete.

### OpenAI Only
Start with OpenAI GPT-4 for copy. No multi-provider fallback for MVP.

## Database Schema

### Core Tables

**users** (managed by Supabase Auth, extended with):
- subscription_tier: 'free' | 'pro'
- subscription_status: 'active' | 'cancelled' | 'past_due'
- stripe_customer_id
- stripe_subscription_id

**brand_kits**:
- user_id (FK)
- logo_url
- primary_color, secondary_color
- font_family
- tone_of_voice (text description)
- sample_copy (optional examples)

**creatives**:
- user_id (FK)
- type: 'copy' (images/video later)
- platform: 'meta' | 'google' | 'tiktok' | 'linkedin'
- content: JSONB (variations array)
- input_params: JSONB (generation inputs)
- style_group: string (urgency, benefit, etc.)
- is_favorite: boolean
- created_at

**usage_records**:
- user_id (FK)
- period_start, period_end (dates)
- credits_used: integer

## Copy Generation Flow

1. User fills multi-step wizard:
   - Product info (name, description, benefits, price)
   - Target audience (demographics, interests, pain points)
   - Platform selection (Meta, Google, TikTok, LinkedIn)
   - Tone selection (professional, casual, urgent, playful)

2. API constructs prompt with brand kit context + user inputs

3. OpenAI generates 5 variations grouped by style:
   - Urgency/FOMO
   - Benefit-focused
   - Problem/Solution
   - Social proof
   - Curiosity/Question

4. Results displayed with edit + regenerate capability

5. User saves favorites to library

## Platform Character Limits

| Platform | Headline | Primary Text | Description |
|----------|----------|--------------|-------------|
| Meta | 40 chars | 125 chars | 30 chars |
| Google | 30 chars x3 | 90 chars x2 | 90 chars x2 |
| TikTok | 100 chars | 100 chars | N/A |
| LinkedIn | 70 chars | 150 chars | 70 chars |

## Billing Logic

- Free tier: 10 creatives total (not monthly)
- Pro tier: 50 creatives/month, resets on billing date
- Hard block at limit - must upgrade to continue
- 1 creative = 1 generation request (5 variations)

## Common Development Commands

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Run linting
npm run lint

# Run type checking
npm run typecheck

# Build for production
npm run build

# Run Supabase locally
npx supabase start

# Generate Supabase types
npx supabase gen types typescript --local > src/types/supabase.ts

# Push database migrations
npx supabase db push

# Stripe webhook forwarding (local dev)
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

## Environment Variables

```
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# OpenAI
OPENAI_API_KEY=

# Stripe
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Prompt Engineering Notes

The copy generation prompt should:
1. Include brand kit context (tone, sample copy if provided)
2. Enforce platform-specific character limits
3. Request variations grouped by psychological approach
4. Output structured JSON for easy parsing

Example prompt structure:
```
You are an expert advertising copywriter. Generate 5 ad copy variations for {platform}.

Brand Voice: {tone_of_voice}
{sample_copy ? "Example brand copy: " + sample_copy : ""}

Product: {product_name}
Description: {product_description}
Key Benefits: {benefits}
Target Audience: {audience}

Generate variations in these styles:
1. Urgency/FOMO
2. Benefit-focused
3. Problem/Solution
4. Social Proof
5. Curiosity/Question

Character limits:
- Headline: {limit}
- Primary text: {limit}
- Description: {limit}

Output as JSON array with: headline, primary_text, description, cta, style_group
```

## Current Implementation Status

The MVP frontend and API routes are complete. To make the app fully functional, you need to:

1. **Set up Supabase project** and add credentials to `.env.local`
2. **Create database tables** using the schema defined above
3. **Set up Stripe** with a Pro subscription product/price
4. **Add OpenAI API key** to environment variables

## Next Steps to Complete

1. Create Supabase database migrations for users, brand_kits, creatives, usage_records
2. Connect database operations in API routes (marked with TODO comments)
3. Implement credit tracking and quota enforcement
4. Test end-to-end flow with real API keys

## Phase 2 Features (Not MVP)

- Image generation (DALL-E 3)
- Video generation
- Additional pricing tiers
- Ad platform integrations (Meta Ads API, etc.)
- Performance analytics
- Team collaboration
