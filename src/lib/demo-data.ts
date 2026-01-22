// Centralized demo data for testing without Supabase/OpenAI configured

export const DEMO_USER = {
  id: 'demo-user',
  email: 'demo@adgenius.ai',
  name: 'Demo User',
  avatar_url: null,
  subscription_tier: 'free' as const,
  subscription_status: 'active' as const,
  stripe_customer_id: null,
  stripe_subscription_id: null,
  created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
  updated_at: new Date().toISOString(),
}

export const DEMO_BRAND_KIT = {
  id: 'demo-brand-kit',
  user_id: 'demo-user',
  logo_url: null,
  primary_color: '#2563EB',
  secondary_color: '#10B981',
  font_family: 'inter',
  tone_preset: 'professional',
  tone_of_voice: 'We speak with confidence and clarity, focusing on the value we bring to our customers.',
  sample_copy: 'Transform your business with our innovative solutions. We make complex simple.',
  created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
  updated_at: new Date().toISOString(),
}

export const DEMO_CREATIVES = [
  {
    id: 'demo-creative-1',
    user_id: 'demo-user',
    type: 'copy' as const,
    platform: 'meta' as const,
    name: 'Summer Sale Campaign',
    content: [
      {
        id: '1',
        style_group: 'urgency',
        headline: '48 Hours Only - Summer Sale Ends Soon!',
        primary_text: 'Don\'t miss our biggest summer sale! Get up to 50% off on all products. Stock is limited and selling fast. Shop now before your favorites are gone!',
        description: 'Limited time offer - Shop now',
        cta: 'Shop Now',
      },
      {
        id: '2',
        style_group: 'benefit',
        headline: 'Save Big This Summer',
        primary_text: 'Upgrade your summer essentials with our exclusive sale. Quality products at unbeatable prices. Free shipping on orders over $50.',
        description: 'Free shipping available',
        cta: 'View Deals',
      },
      {
        id: '3',
        style_group: 'problem-solution',
        headline: 'Beat the Heat Without Breaking the Bank',
        primary_text: 'Summer shopping shouldn\'t cost a fortune. We\'ve slashed prices on everything you need to enjoy the season. Cool deals for hot days!',
        description: 'Affordable summer essentials',
        cta: 'Browse Sale',
      },
      {
        id: '4',
        style_group: 'social-proof',
        headline: 'Join 50,000+ Happy Customers',
        primary_text: 'See why thousands of shoppers chose us this summer. Top-rated products, fast shipping, and prices that make you smile. Your neighbors are already enjoying the savings!',
        description: 'Trusted by thousands',
        cta: 'Join Now',
      },
      {
        id: '5',
        style_group: 'curiosity',
        headline: 'What If Summer Could Be This Affordable?',
        primary_text: 'Imagine getting everything on your summer wishlist at half the price. It\'s not a dream - it\'s our Summer Sale. Ready to see what you can save?',
        description: 'Discover the savings',
        cta: 'See How',
      },
    ],
    input_params: {
      product_name: 'Summer Sale',
      product_description: 'Annual summer sale event with up to 50% off on all products',
      platform: 'meta',
      tone: 'urgent',
      key_benefits: ['50% off', 'Free shipping', 'Limited time'],
      target_audience: {
        age_range: '25-45',
        interests: ['Shopping', 'Deals', 'Summer'],
        pain_points: ['High prices', 'Shipping costs'],
      },
    },
    is_favorite: true,
    created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'demo-creative-2',
    user_id: 'demo-user',
    type: 'copy' as const,
    platform: 'google' as const,
    name: 'SaaS Product Launch',
    content: [
      {
        id: '1',
        style_group: 'urgency',
        headline: 'Launch Pricing Ends Friday',
        primary_text: 'Get 40% off our new productivity app. Early bird pricing won\'t last. Join 1,000+ users already boosting their workflow.',
        description: 'Limited launch pricing',
        cta: 'Get Started',
      },
      {
        id: '2',
        style_group: 'benefit',
        headline: 'Save 10 Hours Every Week',
        primary_text: 'Automate repetitive tasks and focus on what matters. Our AI-powered app handles the busy work so you can do your best work.',
        description: 'AI-powered automation',
        cta: 'Try Free',
      },
      {
        id: '3',
        style_group: 'problem-solution',
        headline: 'Tired of Endless Busywork?',
        primary_text: 'Manual tasks eating your day? Our app automates the boring stuff. Set it up once, save hours forever. Your future self will thank you.',
        description: 'Automate the boring stuff',
        cta: 'Learn More',
      },
      {
        id: '4',
        style_group: 'social-proof',
        headline: 'Rated #1 Productivity App',
        primary_text: 'Join the teams at Google, Stripe, and 500+ companies using our app. 4.9★ rating from 10,000+ users. See what the buzz is about.',
        description: 'Trusted by top companies',
        cta: 'See Reviews',
      },
      {
        id: '5',
        style_group: 'curiosity',
        headline: 'What Would You Do With 10 Extra Hours?',
        primary_text: 'Our users report saving 10+ hours weekly. That\'s a whole extra workday. What could you accomplish with that time back?',
        description: 'Reclaim your time',
        cta: 'Find Out',
      },
    ],
    input_params: {
      product_name: 'TaskFlow Pro',
      product_description: 'AI-powered productivity app that automates repetitive tasks',
      platform: 'google',
      tone: 'professional',
      key_benefits: ['Save 10 hours/week', 'AI-powered', 'Easy setup'],
      target_audience: {
        age_range: '28-50',
        interests: ['Productivity', 'Technology', 'Business'],
        pain_points: ['Too many tasks', 'No time', 'Manual work'],
      },
    },
    is_favorite: false,
    created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'demo-creative-3',
    user_id: 'demo-user',
    type: 'copy' as const,
    platform: 'linkedin' as const,
    name: 'B2B Lead Generation',
    content: [
      {
        id: '1',
        style_group: 'urgency',
        headline: 'Free Consultation - Limited Spots',
        primary_text: 'We\'re offering 10 free strategy sessions this month. Learn how leading companies are cutting costs by 30%. Book your spot before they\'re gone.',
        description: 'Book your free session',
        cta: 'Reserve Spot',
      },
      {
        id: '2',
        style_group: 'benefit',
        headline: 'Cut Operational Costs by 30%',
        primary_text: 'Our enterprise solutions have helped 200+ companies reduce overhead while scaling operations. See the ROI in your first quarter.',
        description: 'Proven results',
        cta: 'See Case Studies',
      },
    ],
    input_params: {
      product_name: 'Enterprise Solutions',
      product_description: 'B2B consulting services for operational efficiency',
      platform: 'linkedin',
      tone: 'professional',
      key_benefits: ['30% cost reduction', 'Proven ROI', 'Expert team'],
      target_audience: {
        age_range: '35-55',
        interests: ['Business', 'Leadership', 'Operations'],
        pain_points: ['High costs', 'Inefficiency', 'Scaling challenges'],
      },
    },
    is_favorite: true,
    created_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'demo-creative-4',
    user_id: 'demo-user',
    type: 'copy' as const,
    platform: 'tiktok' as const,
    name: 'Gen Z Product Launch',
    content: [
      {
        id: '1',
        style_group: 'curiosity',
        headline: 'POV: You Found the Secret',
        primary_text: 'Everyone\'s asking where I got this. Link in bio to find out. Trust me, you need this in your life. 🔥',
        description: '',
        cta: 'Shop Link',
      },
      {
        id: '2',
        style_group: 'social-proof',
        headline: 'It\'s Giving Main Character Energy',
        primary_text: '500k people can\'t be wrong. This is THE product of 2024. Join the trend before it sells out again.',
        description: '',
        cta: 'Get Yours',
      },
    ],
    input_params: {
      product_name: 'Viral Product',
      product_description: 'Trending product for Gen Z audience',
      platform: 'tiktok',
      tone: 'playful',
      key_benefits: ['Trending', 'Affordable', 'Unique'],
      target_audience: {
        age_range: '18-25',
        interests: ['TikTok', 'Trends', 'Fashion'],
        pain_points: ['FOMO', 'Budget', 'Standing out'],
      },
    },
    is_favorite: false,
    created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
]

export const DEMO_USAGE = {
  id: 'demo-usage',
  user_id: 'demo-user',
  period_start: new Date(new Date().setDate(1)).toISOString().split('T')[0],
  period_end: new Date(new Date(new Date().setMonth(new Date().getMonth() + 1)).setDate(0)).toISOString().split('T')[0],
  credits_used: 4, // Matches the number of demo creatives
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
}

// Helper function to check if we're in demo mode
export function isDemoMode(): boolean {
  return !process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
}

// Get demo stats for dashboard
export function getDemoStats() {
  const totalCreatives = DEMO_CREATIVES.length
  const thisMonth = DEMO_CREATIVES.filter(c => {
    const createdAt = new Date(c.created_at)
    const now = new Date()
    return createdAt.getMonth() === now.getMonth() && createdAt.getFullYear() === now.getFullYear()
  }).length
  const favorites = DEMO_CREATIVES.filter(c => c.is_favorite).length

  return { totalCreatives, thisMonth, favorites }
}
