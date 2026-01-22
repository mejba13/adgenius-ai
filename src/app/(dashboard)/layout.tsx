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
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header
          user={user}
          creditsUsed={creditsUsed}
          subscriptionTier={subscriptionTier}
        />
        <main className="flex-1 overflow-auto p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
