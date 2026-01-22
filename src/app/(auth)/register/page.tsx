'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Loader2, Mail, Lock, Eye, EyeOff, ArrowRight, User, Check, Zap } from 'lucide-react'

export default function RegisterPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const router = useRouter()

  // Password validation
  const passwordChecks = [
    { label: 'At least 8 characters', valid: password.length >= 8 },
    { label: 'Contains a number', valid: /\d/.test(password) },
    { label: 'Contains a letter', valid: /[a-zA-Z]/.test(password) },
  ]
  const isPasswordValid = passwordChecks.every((check) => check.valid)

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!isPasswordValid) {
      setError('Please meet all password requirements')
      return
    }

    setLoading(true)

    const supabase = createClient()
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
        },
      },
    })

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    router.push('/dashboard')
    router.refresh()
  }

  const handleGoogleSignup = async () => {
    setGoogleLoading(true)
    const supabase = createClient()
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback?redirect=/dashboard`,
      },
    })
  }

  return (
    <div className="animate-fade-in-up">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-white mb-2">Create your account</h2>
        <p className="text-slate-400">Start generating high-converting ads in seconds</p>
      </div>

      {/* Form Card */}
      <div className="rounded-3xl bg-slate-900/50 border border-white/10 backdrop-blur-xl p-8 shadow-2xl shadow-black/20">
        {/* Google Sign Up */}
        <button
          type="button"
          onClick={handleGoogleSignup}
          disabled={googleLoading}
          className="w-full flex items-center justify-center gap-3 py-4 px-6 rounded-2xl bg-white hover:bg-gray-50 text-slate-900 font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-white/10 disabled:opacity-50 group"
        >
          {googleLoading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
          )}
          <span className="group-hover:translate-x-0.5 transition-transform">
            Sign up with Google
          </span>
        </button>

        {/* Divider */}
        <div className="relative my-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-white/10" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-slate-900/50 text-slate-500">or sign up with email</span>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-center gap-3 animate-shake">
            <div className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center flex-shrink-0">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleRegister} className="space-y-5">
          {/* Name Field */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
              <User className="w-4 h-4 text-emerald-400" />
              Full Name
            </label>
            <div className="relative group">
              <input
                type="text"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full h-14 px-5 bg-slate-800/50 border border-white/10 rounded-2xl text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all group-hover:border-white/20"
              />
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 opacity-0 group-focus-within:opacity-100 transition-opacity -z-10 blur-xl" />
            </div>
          </div>

          {/* Email Field */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
              <Mail className="w-4 h-4 text-blue-400" />
              Email
            </label>
            <div className="relative group">
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full h-14 px-5 bg-slate-800/50 border border-white/10 rounded-2xl text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all group-hover:border-white/20"
              />
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/20 to-purple-500/20 opacity-0 group-focus-within:opacity-100 transition-opacity -z-10 blur-xl" />
            </div>
          </div>

          {/* Password Field */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
              <Lock className="w-4 h-4 text-purple-400" />
              Password
            </label>
            <div className="relative group">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Create a strong password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full h-14 px-5 pr-14 bg-slate-800/50 border border-white/10 rounded-2xl text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all group-hover:border-white/20"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-2 text-slate-400 hover:text-white transition-colors"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-500/20 to-pink-500/20 opacity-0 group-focus-within:opacity-100 transition-opacity -z-10 blur-xl" />
            </div>

            {/* Password Requirements */}
            {password && (
              <div className="pt-3 space-y-2">
                {passwordChecks.map((check, i) => (
                  <div
                    key={i}
                    className={`flex items-center gap-2 text-xs transition-colors ${
                      check.valid ? 'text-emerald-400' : 'text-slate-500'
                    }`}
                  >
                    <div
                      className={`w-4 h-4 rounded-full flex items-center justify-center transition-all ${
                        check.valid
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : 'bg-slate-800 text-slate-600'
                      }`}
                    >
                      <Check className="w-2.5 h-2.5" />
                    </div>
                    {check.label}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading || !isPasswordValid}
            className="relative w-full h-14 rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/25 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden group"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 opacity-0 group-hover:opacity-100 transition-opacity blur-xl" />
            <span className="relative flex items-center justify-center gap-2">
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Creating account...
                </>
              ) : (
                <>
                  Create account
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </span>
          </button>
        </form>

        {/* Free Plan Highlight */}
        <div className="mt-6 p-4 rounded-2xl bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 border border-emerald-500/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-cyan-600 flex items-center justify-center flex-shrink-0">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-sm font-medium text-white">Start with 10 free creatives</p>
              <p className="text-xs text-slate-400">
                No credit card required. Upgrade anytime.
              </p>
            </div>
          </div>
        </div>

        {/* Terms */}
        <p className="mt-6 text-xs text-center text-slate-500">
          By creating an account, you agree to our{' '}
          <Link href="/terms" className="text-blue-400 hover:text-blue-300 transition-colors">
            Terms of Service
          </Link>{' '}
          and{' '}
          <Link href="/privacy" className="text-blue-400 hover:text-blue-300 transition-colors">
            Privacy Policy
          </Link>
        </p>
      </div>

      {/* Footer */}
      <p className="mt-8 text-center text-sm text-slate-500">
        Already have an account?{' '}
        <Link
          href="/login"
          className="text-blue-400 hover:text-blue-300 font-medium transition-colors"
        >
          Sign in instead
        </Link>
      </p>
    </div>
  )
}
