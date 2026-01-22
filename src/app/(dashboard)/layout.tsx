import { redirect } from 'next/navigation'
import { Sidebar } from '@/components/dashboard/sidebar'
import { Header } from '@/components/dashboard/header'
import type { SubscriptionTier } from '@/types'
import type { User } from '@supabase/supabase-js'

// Force dynamic rendering to avoid build-time errors
export const dynamic = 'force-dynamic'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  let user: User | null = null

  // Check if Supabase is configured
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (supabaseUrl && supabaseAnonKey) {
    const { createClient } = await import('@/lib/supabase/server')
    const supabase = await createClient()
    const { data } = await supabase.auth.getUser()
    user = data.user

    if (!user) {
      redirect('/login')
    }
  } else {
    // Demo mode - create a mock user
    user = {
      id: 'demo-user',
      email: 'demo@example.com',
      user_metadata: { name: 'Demo User' },
      app_metadata: {},
      aud: 'authenticated',
      created_at: new Date().toISOString(),
    } as unknown as User
  }

  // For now, use defaults until we set up the database
  const subscriptionTier: SubscriptionTier = 'free'
  const creditsUsed = 0

  return (
    <div className="flex h-screen bg-slate-950">
      {/* Animated background elements */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-purple-500/10 rounded-full blur-[120px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-500/5 rounded-full blur-[150px]" />
      </div>

      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <div className="relative z-50">
          <Header
            user={user}
            creditsUsed={creditsUsed}
            subscriptionTier={subscriptionTier}
          />
        </div>
        <main className="flex-1 overflow-auto p-8 relative z-0">
          {children}
        </main>
      </div>
    </div>
  )
}
