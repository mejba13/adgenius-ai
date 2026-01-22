'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'

// Platform logos as SVG components
const MetaLogo = () => (
  <svg viewBox="0 0 36 36" className="w-8 h-8" fill="currentColor">
    <path d="M18 2C9.163 2 2 9.163 2 18c0 7.991 5.851 14.615 13.5 15.825V22.5h-4.063v-4.5h4.063v-3.431c0-4.012 2.389-6.23 6.047-6.23 1.752 0 3.584.313 3.584.313v3.937h-2.019c-1.989 0-2.612 1.235-2.612 2.5V18h4.438l-.71 4.5h-3.728v11.325C28.149 32.615 34 25.991 34 18c0-8.837-7.163-16-16-16z"/>
  </svg>
)

const GoogleLogo = () => (
  <svg viewBox="0 0 24 24" className="w-8 h-8">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
  </svg>
)

const TikTokLogo = () => (
  <svg viewBox="0 0 24 24" className="w-8 h-8" fill="currentColor">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
  </svg>
)

const LinkedInLogo = () => (
  <svg viewBox="0 0 24 24" className="w-8 h-8" fill="currentColor">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
  </svg>
)

// Animated counter component
function AnimatedCounter({ end, suffix = '', duration = 2000 }: { end: number; suffix?: string; duration?: number }) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    let startTime: number
    let animationFrame: number

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp
      const progress = Math.min((timestamp - startTime) / duration, 1)
      setCount(Math.floor(progress * end))

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate)
      }
    }

    animationFrame = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(animationFrame)
  }, [end, duration])

  return <span>{count.toLocaleString()}{suffix}</span>
}

export default function Home() {
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className="min-h-screen bg-slate-950 text-white overflow-hidden">
      {/* Animated gradient background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-blue-950/50 to-purple-950/30 animate-gradient" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl animate-float-delayed" />
        <div className="absolute top-1/2 right-1/3 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl animate-float-slow" />
      </div>

      {/* Navigation */}
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-slate-950/80 backdrop-blur-xl border-b border-white/10' : ''
      }`}>
        <nav className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <span className="text-xl font-bold tracking-tight">AdGenius<span className="text-blue-400">AI</span></span>
          </div>

          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm text-gray-400 hover:text-white transition-colors">Features</a>
            <a href="#platforms" className="text-sm text-gray-400 hover:text-white transition-colors">Platforms</a>
            <a href="#pricing" className="text-sm text-gray-400 hover:text-white transition-colors">Pricing</a>
          </div>

          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm text-gray-400 hover:text-white transition-colors">
              Sign In
            </Link>
            <Link
              href="/register"
              className="relative px-5 py-2.5 text-sm font-medium rounded-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/25"
            >
              Get Started Free
            </Link>
          </div>
        </nav>
      </header>

      <main>
        {/* Hero Section */}
        <section className="relative pt-32 pb-20 px-6">
          <div className="container mx-auto">
            {/* Floating badge */}
            <div className="flex justify-center mb-8 animate-fade-in-up">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-white/10">
                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                <span className="text-sm text-gray-300">Trusted by 10,000+ marketers worldwide</span>
              </div>
            </div>

            {/* Main headline */}
            <div className="max-w-5xl mx-auto text-center">
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-[1.1] animate-fade-in-up delay-100">
                Create ads that
                <br />
                <span className="gradient-text">convert instantly</span>
              </h1>

              <p className="mt-8 text-xl md:text-2xl text-gray-400 max-w-2xl mx-auto animate-fade-in-up delay-200">
                Generate high-converting ad copy for every platform using AI trained on millions of successful campaigns.
              </p>

              {/* CTA buttons */}
              <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up delay-300">
                <Link
                  href="/register"
                  className="group relative px-8 py-4 text-lg font-semibold rounded-2xl bg-white text-slate-950 hover:bg-gray-100 transition-all duration-300 flex items-center gap-2"
                >
                  Start Creating for Free
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Link>
                <Link
                  href="#demo"
                  className="px-8 py-4 text-lg font-semibold rounded-2xl glass border border-white/20 hover:bg-white/10 transition-all duration-300 flex items-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Watch Demo
                </Link>
              </div>

              <p className="mt-6 text-sm text-gray-500 animate-fade-in-up delay-400">
                10 free creatives included. No credit card required.
              </p>
            </div>

            {/* Interactive Demo Preview */}
            <div id="demo" className="mt-20 max-w-6xl mx-auto animate-fade-in-up delay-500">
              <div className="relative rounded-3xl overflow-hidden glass border border-white/10 p-2">
                {/* Browser chrome */}
                <div className="flex items-center gap-2 px-4 py-3 bg-slate-900/50 rounded-t-2xl">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500/80" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                    <div className="w-3 h-3 rounded-full bg-green-500/80" />
                  </div>
                  <div className="flex-1 mx-4">
                    <div className="px-4 py-1.5 bg-slate-800/50 rounded-lg text-xs text-gray-500 flex items-center gap-2">
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                      app.adgenius.ai/create
                    </div>
                  </div>
                </div>

                {/* Demo content */}
                <div className="p-8 bg-gradient-to-br from-slate-900 to-slate-800">
                  <div className="grid md:grid-cols-2 gap-8">
                    {/* Input side */}
                    <div className="space-y-6">
                      <div>
                        <label className="text-sm text-gray-400 mb-2 block">Product/Service</label>
                        <div className="px-4 py-3 bg-slate-800/50 rounded-xl border border-white/5 text-white">
                          Premium Fitness App
                        </div>
                      </div>
                      <div>
                        <label className="text-sm text-gray-400 mb-2 block">Target Platform</label>
                        <div className="flex gap-2">
                          {['Meta', 'Google', 'TikTok', 'LinkedIn'].map((platform, i) => (
                            <div key={platform} className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                              i === 0 ? 'bg-blue-600 text-white' : 'bg-slate-800/50 text-gray-400 hover:bg-slate-700/50'
                            }`}>
                              {platform}
                            </div>
                          ))}
                        </div>
                      </div>
                      <button className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 font-semibold flex items-center justify-center gap-2 animate-pulse-glow">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                        Generate Ad Copy
                      </button>
                    </div>

                    {/* Output side */}
                    <div className="space-y-4">
                      <div className="text-sm text-gray-400 mb-2">Generated Variations</div>
                      {[
                        "Transform your body in just 30 days. Join 1M+ users crushing their fitness goals.",
                        "Stop scrolling. Start sweating. Your dream physique is one tap away.",
                        "AI-powered workouts. Real results. Download free today."
                      ].map((text, i) => (
                        <div key={i} className="p-4 bg-slate-800/30 rounded-xl border border-white/5 hover:border-blue-500/50 transition-all cursor-pointer group">
                          <p className="text-sm text-gray-300">{text}</p>
                          <div className="mt-3 flex items-center justify-between">
                            <span className="text-xs text-gray-500">Variation {i + 1}</span>
                            <button className="text-xs text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity">
                              Copy
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating 3D elements */}
              <div className="absolute -top-10 -left-10 w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-400 opacity-20 blur-sm animate-float rotate-12" />
              <div className="absolute -bottom-10 -right-10 w-24 h-24 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 opacity-20 blur-sm animate-float-delayed" />
            </div>
          </div>
        </section>

        {/* Platform Logos Section */}
        <section id="platforms" className="py-20 px-6 border-y border-white/5">
          <div className="container mx-auto">
            <div className="text-center mb-12">
              <p className="text-sm text-gray-500 uppercase tracking-widest">Optimized for every platform</p>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-12 md:gap-20">
              {[
                { name: 'Meta', logo: MetaLogo, color: 'text-blue-400' },
                { name: 'Google', logo: GoogleLogo, color: '' },
                { name: 'TikTok', logo: TikTokLogo, color: 'text-white' },
                { name: 'LinkedIn', logo: LinkedInLogo, color: 'text-blue-500' },
              ].map(({ name, logo: Logo, color }) => (
                <div key={name} className="flex items-center gap-3 text-gray-400 hover:text-white transition-colors group cursor-pointer">
                  <div className={`${color} group-hover:scale-110 transition-transform`}>
                    <Logo />
                  </div>
                  <span className="font-medium">{name}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Social Proof Stats */}
        <section className="py-24 px-6">
          <div className="container mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
              {[
                { value: 10000, suffix: '+', label: 'Active Users' },
                { value: 2, suffix: 'M+', label: 'Ads Generated' },
                { value: 98, suffix: '%', label: 'Customer Satisfaction' },
                { value: 15, suffix: 's', label: 'Avg. Generation Time' },
              ].map((stat, i) => (
                <div key={i} className="text-center">
                  <div className="text-4xl md:text-5xl font-bold gradient-text">
                    <AnimatedCounter end={stat.value} suffix={stat.suffix} />
                  </div>
                  <div className="mt-2 text-sm text-gray-500">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Bento Grid Features */}
        <section id="features" className="py-24 px-6">
          <div className="container mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                Everything you need to
                <br />
                <span className="gradient-text">create winning ads</span>
              </h2>
              <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                Powerful features designed to help marketers create high-converting ad campaigns in record time.
              </p>
            </div>

            {/* Bento Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-6xl mx-auto">
              {/* Large feature card */}
              <div className="md:col-span-2 md:row-span-2 rounded-3xl glass border border-white/10 p-8 hover-lift group relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-purple-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative z-10">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center mb-6">
                    <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold mb-3">AI-Powered Generation</h3>
                  <p className="text-gray-400 mb-8 max-w-md">
                    Our advanced AI analyzes millions of successful ad campaigns to generate copy that resonates with your target audience and drives conversions.
                  </p>

                  {/* Mini demo */}
                  <div className="bg-slate-800/50 rounded-2xl p-4 border border-white/5">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                        <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                        </svg>
                      </div>
                      <span className="text-sm text-gray-400">Generating 5 variations...</span>
                    </div>
                    <div className="space-y-2">
                      {[100, 75, 45].map((width, i) => (
                        <div key={i} className="h-2 rounded-full bg-slate-700" style={{ width: `${width}%` }}>
                          <div className="h-full rounded-full bg-gradient-to-r from-blue-500 to-purple-500 animate-shimmer" style={{ animationDelay: `${i * 200}ms` }} />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Small feature cards */}
              <div className="rounded-3xl glass border border-white/10 p-6 hover-lift group relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-600/20 to-blue-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative z-10">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center mb-4">
                    <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-bold mb-2">Lightning Fast</h3>
                  <p className="text-sm text-gray-400">Generate 5 professional ad variations in under 15 seconds.</p>
                </div>
              </div>

              <div className="rounded-3xl glass border border-white/10 p-6 hover-lift group relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-green-600/20 to-emerald-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative z-10">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center mb-4">
                    <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-bold mb-2">Platform Optimized</h3>
                  <p className="text-sm text-gray-400">Copy tailored for each platform with correct character limits.</p>
                </div>
              </div>

              {/* Medium feature card */}
              <div className="md:col-span-2 rounded-3xl glass border border-white/10 p-6 hover-lift group relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 to-pink-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative z-10 flex flex-col md:flex-row md:items-center gap-6">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold mb-2">Brand Kit Integration</h3>
                    <p className="text-sm text-gray-400">Set up your brand voice, tone, and guidelines once. Every ad matches your style perfectly.</p>
                  </div>
                </div>
              </div>

              <div className="rounded-3xl glass border border-white/10 p-6 hover-lift group relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-orange-600/20 to-red-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative z-10">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center mb-4">
                    <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-bold mb-2">A/B Testing Ready</h3>
                  <p className="text-sm text-gray-400">Multiple variations ready for split testing instantly.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-24 px-6 relative">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-950/20 to-transparent" />
          <div className="container mx-auto relative z-10">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                Loved by marketers
                <br />
                <span className="gradient-text">everywhere</span>
              </h2>
            </div>

            <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {[
                {
                  quote: "AdGenius cut our ad creation time by 80%. What used to take a full day now takes minutes.",
                  author: "Sarah Chen",
                  role: "Marketing Director, TechFlow",
                  avatar: "SC"
                },
                {
                  quote: "The AI understands our brand voice perfectly. Every ad feels authentically us.",
                  author: "Marcus Johnson",
                  role: "CMO, GrowthLab",
                  avatar: "MJ"
                },
                {
                  quote: "Finally, a tool that actually delivers on its promises. Our conversion rates are up 35%.",
                  author: "Emily Rodriguez",
                  role: "Performance Manager, ScaleUp",
                  avatar: "ER"
                }
              ].map((testimonial, i) => (
                <div key={i} className="rounded-3xl glass border border-white/10 p-8 hover-lift">
                  <div className="flex items-center gap-1 mb-6">
                    {[...Array(5)].map((_, j) => (
                      <svg key={j} className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <p className="text-gray-300 mb-6">&ldquo;{testimonial.quote}&rdquo;</p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-sm font-bold">
                      {testimonial.avatar}
                    </div>
                    <div>
                      <div className="font-semibold text-sm">{testimonial.author}</div>
                      <div className="text-xs text-gray-500">{testimonial.role}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="py-24 px-6">
          <div className="container mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                Simple, transparent
                <br />
                <span className="gradient-text">pricing</span>
              </h2>
              <p className="text-gray-400 text-lg">Start free, upgrade when you&apos;re ready.</p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {/* Free tier */}
              <div className="rounded-3xl glass border border-white/10 p-8 hover-lift">
                <div className="text-sm text-gray-400 mb-2">Free</div>
                <div className="text-4xl font-bold mb-1">$0</div>
                <div className="text-sm text-gray-500 mb-6">forever</div>
                <ul className="space-y-4 mb-8">
                  {['10 creatives per month', 'All 4 platforms', 'Basic brand kit', 'Email support'].map((feature, i) => (
                    <li key={i} className="flex items-center gap-3 text-gray-300">
                      <svg className="w-5 h-5 text-green-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
                <Link href="/register" className="block w-full py-3 rounded-xl border border-white/20 text-center font-semibold hover:bg-white/5 transition-colors">
                  Get Started Free
                </Link>
              </div>

              {/* Pro tier */}
              <div className="rounded-3xl glass border border-blue-500/50 p-8 hover-lift relative overflow-hidden">
                <div className="absolute top-4 right-4">
                  <span className="px-3 py-1 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-xs font-semibold">
                    Popular
                  </span>
                </div>
                <div className="text-sm text-blue-400 mb-2">Pro</div>
                <div className="text-4xl font-bold mb-1">$29</div>
                <div className="text-sm text-gray-500 mb-6">per month</div>
                <ul className="space-y-4 mb-8">
                  {['Unlimited creatives', 'All 4 platforms', 'Advanced brand kit', 'Priority support', 'API access', 'Team collaboration'].map((feature, i) => (
                    <li key={i} className="flex items-center gap-3 text-gray-300">
                      <svg className="w-5 h-5 text-green-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
                <Link href="/register" className="block w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-center font-semibold hover:from-blue-500 hover:to-purple-500 transition-all">
                  Start 7-Day Free Trial
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-24 px-6">
          <div className="container mx-auto">
            <div className="max-w-4xl mx-auto rounded-3xl relative overflow-hidden">
              {/* Animated gradient background */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 animate-gradient" />
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_0%,_rgba(0,0,0,0.3)_100%)]" />

              <div className="relative z-10 p-12 md:p-16 text-center">
                <h2 className="text-4xl md:text-5xl font-bold mb-6">
                  Ready to transform your ad creation?
                </h2>
                <p className="text-xl text-white/80 mb-10 max-w-xl mx-auto">
                  Join thousands of marketers who are creating better ads in less time.
                </p>
                <Link
                  href="/register"
                  className="inline-flex items-center gap-2 px-8 py-4 text-lg font-semibold rounded-2xl bg-white text-slate-950 hover:bg-gray-100 transition-all duration-300"
                >
                  Get Started Free
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Link>
                <p className="mt-6 text-sm text-white/60">
                  No credit card required. Start with 10 free creatives.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="py-16 px-6 border-t border-white/5">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <span className="font-bold">AdGenius<span className="text-blue-400">AI</span></span>
              </div>
              <p className="text-sm text-gray-500">
                AI-powered ad copy generation for modern marketers.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-gray-500">
                <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#pricing" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition-colors">API</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-gray-500">
                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-gray-500">
                <li><a href="#" className="hover:text-white transition-colors">Privacy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms</a></li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-sm text-gray-500">
              &copy; {new Date().getFullYear()} AdGenius AI. All rights reserved.
            </div>
            <div className="flex items-center gap-6">
              <a href="#" className="text-gray-500 hover:text-white transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>
              <a href="#" className="text-gray-500 hover:text-white transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                </svg>
              </a>
              <a href="#" className="text-gray-500 hover:text-white transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10c5.51 0 10-4.48 10-10S17.51 2 12 2zm6.605 4.61a8.502 8.502 0 011.93 5.314c-.281-.054-3.101-.629-5.943-.271-.065-.141-.12-.293-.184-.445a25.416 25.416 0 00-.564-1.236c3.145-1.28 4.577-3.124 4.761-3.362zM12 3.475c2.17 0 4.154.813 5.662 2.148-.152.216-1.443 1.941-4.48 3.08-1.399-2.57-2.95-4.675-3.189-5A8.687 8.687 0 0112 3.475zm-3.633.803a53.896 53.896 0 013.167 4.935c-3.992 1.063-7.517 1.04-7.896 1.04a8.581 8.581 0 014.729-5.975zM3.453 12.01v-.26c.37.01 4.512.065 8.775-1.215.25.477.477.965.694 1.453-.109.033-.228.065-.336.098-4.404 1.42-6.747 5.303-6.942 5.629a8.522 8.522 0 01-2.19-5.705zM12 20.547a8.482 8.482 0 01-5.239-1.8c.152-.315 1.888-3.656 6.703-5.337.022-.01.033-.01.054-.022a35.318 35.318 0 011.823 6.475 8.4 8.4 0 01-3.341.684zm4.761-1.465c-.086-.52-.542-3.015-1.659-6.084 2.679-.423 5.022.271 5.314.369a8.468 8.468 0 01-3.655 5.715z" clipRule="evenodd" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
