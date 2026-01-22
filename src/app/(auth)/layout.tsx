'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const isLogin = pathname === '/login'

  return (
    <div className="min-h-screen bg-slate-950 flex overflow-hidden">
      {/* Animated background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-blue-950/50 to-purple-950/30" />
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-blue-500/30 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-0 w-80 h-80 bg-purple-500/30 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-conic from-blue-500/10 via-purple-500/10 to-blue-500/10 rounded-full blur-3xl opacity-50" />

        {/* Grid pattern overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px]" />

        {/* Floating particles */}
        <div className="absolute top-20 left-20 w-2 h-2 bg-blue-400/60 rounded-full animate-float" />
        <div className="absolute top-40 right-32 w-3 h-3 bg-purple-400/60 rounded-full animate-float-delayed" />
        <div className="absolute bottom-32 left-1/4 w-2 h-2 bg-cyan-400/60 rounded-full animate-float-slow" />
        <div className="absolute bottom-48 right-1/4 w-2 h-2 bg-pink-400/60 rounded-full animate-float" />
        <div className="absolute top-1/3 left-1/3 w-1.5 h-1.5 bg-white/40 rounded-full animate-float-delayed" />
      </div>

      {/* Left Panel - Branding & Features */}
      <div className="hidden lg:flex lg:w-1/2 relative flex-col justify-between p-12">
        {/* Logo */}
        <div>
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/25 group-hover:shadow-blue-500/40 transition-shadow">
              <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <span className="text-2xl font-bold text-white tracking-tight">
              AdGenius<span className="text-blue-400">AI</span>
            </span>
          </Link>
        </div>

        {/* Main Content */}
        <div className="space-y-8">
          <div>
            <h1 className="text-5xl font-bold text-white leading-tight">
              Create ads that
              <br />
              <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                convert instantly
              </span>
            </h1>
            <p className="mt-6 text-xl text-slate-400 max-w-md">
              Generate high-converting ad copy for every platform using AI trained on millions of successful campaigns.
            </p>
          </div>

          {/* Feature highlights */}
          <div className="space-y-4">
            {[
              { icon: '⚡', text: 'Generate ads in under 15 seconds' },
              { icon: '🎯', text: 'Optimized for Meta, Google, TikTok & LinkedIn' },
              { icon: '✨', text: 'AI trained on 2M+ successful campaigns' },
            ].map((feature, i) => (
              <div
                key={i}
                className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <span className="text-2xl">{feature.icon}</span>
                <span className="text-slate-300">{feature.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Social proof */}
        <div className="flex items-center gap-8">
          <div className="flex -space-x-3">
            {['SC', 'MJ', 'ER', 'JK'].map((initials, i) => (
              <div
                key={i}
                className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 border-2 border-slate-950 flex items-center justify-center text-xs font-bold text-white"
              >
                {initials}
              </div>
            ))}
          </div>
          <div>
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <svg key={i} className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <p className="text-sm text-slate-400 mt-1">Trusted by 10,000+ marketers</p>
          </div>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden mb-8 text-center">
            <Link href="/" className="inline-flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <span className="text-xl font-bold text-white">
                AdGenius<span className="text-blue-400">AI</span>
              </span>
            </Link>
          </div>

          {/* Tab Switcher */}
          <div className="flex p-1.5 rounded-2xl bg-slate-900/80 border border-white/10 backdrop-blur-xl mb-8">
            <Link
              href="/login"
              className={`flex-1 py-3 px-6 rounded-xl text-center font-medium transition-all duration-300 ${
                isLogin
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/25'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Sign In
            </Link>
            <Link
              href="/register"
              className={`flex-1 py-3 px-6 rounded-xl text-center font-medium transition-all duration-300 ${
                !isLogin
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/25'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Sign Up
            </Link>
          </div>

          {children}
        </div>
      </div>
    </div>
  )
}
