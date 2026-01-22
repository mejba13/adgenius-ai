# AdGenius AI

AI-powered ad copy generation platform for modern marketers. Generate high-converting ad copy for Meta, Google, TikTok, and LinkedIn in seconds.

<img width="1611" height="1278" alt="CleanShot 2026-01-22 at 12  30 06" src="https://github.com/user-attachments/assets/5d93d03e-0f91-4991-825c-dd3dfb4546d9" />


## Features

- **AI-Powered Generation** - Generate 5 professional ad variations in under 15 seconds
- **Multi-Platform Support** - Optimized copy for Meta, Google, TikTok, and LinkedIn with correct character limits
- **Brand Kit** - Set up your brand voice, tone, and guidelines once for consistent messaging
- **Creative Library** - Save, organize, and favorite your generated ad copy
- **Usage Tracking** - Monitor your monthly creative generation usage
- **Subscription Management** - Free tier with 10 creatives/month, Pro tier with unlimited access

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS with custom animations
- **Authentication**: Supabase Auth
- **Database**: Supabase (PostgreSQL)
- **Payments**: Stripe (Subscriptions & Billing)
- **AI**: OpenAI GPT-4

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account (optional for demo mode)
- Stripe account (optional for demo mode)
- OpenAI API key (optional for demo mode)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/adgenius-ai.git
cd adgenius-ai
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Environment Variables

Create a `.env.local` file with the following variables:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Stripe
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_webhook_secret
NEXT_PUBLIC_STRIPE_PRO_PRICE_ID=your_price_id

# OpenAI
OPENAI_API_KEY=your_openai_api_key

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Demo Mode

The application runs in **demo mode** when Supabase credentials are not configured. In demo mode:

- Authentication is bypassed with a demo user
- Sample data is provided for all features
- AI generation returns mock responses
- All dashboard pages are fully functional

This allows you to explore the full application without setting up external services.

## Project Structure

```
src/
├── app/
│   ├── (auth)/           # Auth pages (login, register)
│   ├── (dashboard)/      # Protected dashboard pages
│   │   ├── brand-kit/    # Brand kit management
│   │   ├── create/       # Ad copy generation
│   │   ├── dashboard/    # Main dashboard
│   │   ├── library/      # Creative library
│   │   └── settings/     # User settings & billing
│   ├── api/              # API routes
│   │   ├── billing/      # Stripe checkout & portal
│   │   ├── brand-kit/    # Brand kit CRUD
│   │   ├── creatives/    # Creatives CRUD
│   │   ├── generate/     # AI copy generation
│   │   ├── profile/      # User profile
│   │   └── webhooks/     # Stripe webhooks
│   ├── auth/             # Auth callback
│   ├── globals.css       # Global styles & animations
│   ├── layout.tsx        # Root layout
│   └── page.tsx          # Landing page
├── components/
│   └── ui/               # Reusable UI components
├── lib/
│   ├── demo-data.ts      # Demo mode data
│   ├── stripe.ts         # Stripe client
│   ├── supabase/         # Supabase clients
│   └── utils.ts          # Utility functions
└── types/
    └── database.ts       # TypeScript types
```

## API Routes

| Route | Method | Description |
|-------|--------|-------------|
| `/api/generate/copy` | POST | Generate ad copy with AI |
| `/api/creatives` | GET, POST | List/create creatives |
| `/api/creatives/[id]` | GET, PATCH, DELETE | Manage single creative |
| `/api/brand-kit` | GET, POST, PATCH | Manage brand kit |
| `/api/profile` | GET, PATCH, DELETE | Manage user profile |
| `/api/billing/checkout` | POST | Create Stripe checkout session |
| `/api/billing/portal` | POST | Create Stripe billing portal |
| `/api/webhooks/stripe` | POST | Handle Stripe webhooks |

## Database Schema

### Users Table
- `id` - UUID (primary key)
- `email` - User email
- `full_name` - Display name
- `avatar_url` - Profile picture
- `subscription_tier` - 'free' or 'pro'
- `subscription_status` - Subscription state
- `stripe_customer_id` - Stripe customer reference
- `stripe_subscription_id` - Stripe subscription reference
- `created_at` - Timestamp

### Creatives Table
- `id` - UUID (primary key)
- `user_id` - Foreign key to users
- `platform` - 'meta', 'google', 'tiktok', 'linkedin'
- `name` - Creative name
- `content` - JSON array of ad variations
- `is_favorite` - Boolean flag
- `created_at` - Timestamp

### Brand Kits Table
- `id` - UUID (primary key)
- `user_id` - Foreign key to users
- `brand_name` - Company/brand name
- `industry` - Business industry
- `target_audience` - Target demographic
- `brand_voice` - Tone of voice
- `key_messages` - Core messaging points
- `created_at` - Timestamp
- `updated_at` - Timestamp

### Usage Table
- `id` - UUID (primary key)
- `user_id` - Foreign key to users
- `month` - Month (YYYY-MM format)
- `creatives_generated` - Count for the month
- `created_at` - Timestamp
- `updated_at` - Timestamp

## Scripts

```bash
# Development
npm run dev

# Build
npm run build

# Production
npm start

# Linting
npm run lint
```

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import the project in Vercel
3. Add environment variables
4. Deploy

### Other Platforms

The app can be deployed to any platform that supports Next.js:
- Netlify
- Railway
- AWS Amplify
- Docker

## Stripe Webhook Setup

For production, set up the Stripe webhook endpoint:

1. Go to Stripe Dashboard > Developers > Webhooks
2. Add endpoint: `https://yourdomain.com/api/webhooks/stripe`
3. Select events:
   - `checkout.session.completed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
4. Copy the webhook signing secret to your environment variables

## License

MIT License - see [LICENSE](LICENSE) for details.

## Support

For issues and feature requests, please open an issue on GitHub.
