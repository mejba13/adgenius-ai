'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Save, Trash2, Loader2, Check, User, Lock, AlertTriangle } from 'lucide-react'

export default function SettingsPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [profile, setProfile] = useState({
    name: '',
    email: '',
  })
  const [passwords, setPasswords] = useState({
    current: '',
    new: '',
    confirm: '',
  })
  const [passwordError, setPasswordError] = useState('')
  const [passwordSuccess, setPasswordSuccess] = useState(false)

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    try {
      const res = await fetch('/api/profile')
      const data = await res.json()
      if (data.profile) {
        setProfile({
          name: data.profile.name || '',
          email: data.profile.email || '',
        })
      }
    } catch (error) {
      console.error('Failed to fetch profile:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    setSaved(false)
    try {
      const res = await fetch('/api/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: profile.name }),
      })
      if (res.ok) {
        setSaved(true)
        setTimeout(() => setSaved(false), 2000)
      }
    } catch (error) {
      console.error('Failed to save profile:', error)
    } finally {
      setSaving(false)
    }
  }

  const handlePasswordChange = async () => {
    setPasswordError('')
    setPasswordSuccess(false)

    if (passwords.new !== passwords.confirm) {
      setPasswordError('New passwords do not match')
      return
    }

    if (passwords.new.length < 6) {
      setPasswordError('Password must be at least 6 characters')
      return
    }

    try {
      const supabase = createClient()
      const { error } = await supabase.auth.updateUser({
        password: passwords.new,
      })

      if (error) {
        setPasswordError(error.message)
      } else {
        setPasswordSuccess(true)
        setPasswords({ current: '', new: '', confirm: '' })
        setTimeout(() => setPasswordSuccess(false), 3000)
      }
    } catch (error) {
      setPasswordError('Failed to update password')
    }
  }

  const handleDeleteAccount = async () => {
    if (!confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      return
    }

    setDeleting(true)
    try {
      const res = await fetch('/api/profile', { method: 'DELETE' })
      if (res.ok) {
        const supabase = createClient()
        await supabase.auth.signOut()
        router.push('/')
      }
    } catch (error) {
      console.error('Failed to delete account:', error)
    } finally {
      setDeleting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
          <p className="text-slate-400">Loading settings...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-fade-in-up">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white">Settings</h1>
        <p className="text-slate-400 mt-1">
          Manage your account settings and preferences
        </p>
      </div>

      {/* Profile Section */}
      <div className="rounded-2xl bg-slate-900/50 border border-white/10 overflow-hidden">
        <div className="p-6 border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500">
              <User className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">Profile</h2>
              <p className="text-sm text-slate-400">Update your personal information</p>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-white">Full Name</label>
            <input
              type="text"
              value={profile.name}
              onChange={(e) => setProfile(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Your name"
              className="w-full h-12 px-4 bg-slate-800/50 border border-white/10 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-white">Email</label>
            <input
              type="email"
              value={profile.email}
              disabled
              className="w-full h-12 px-4 bg-slate-800/30 border border-white/5 rounded-xl text-slate-400 cursor-not-allowed"
            />
            <p className="text-xs text-slate-500">
              Email cannot be changed. Contact support if needed.
            </p>
          </div>

          <div className="flex justify-end">
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 rounded-xl font-semibold text-white shadow-lg shadow-blue-500/20 transition-all disabled:opacity-50"
            >
              {saving ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : saved ? (
                <>
                  <Check className="h-4 w-4" />
                  Saved!
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Password Section */}
      <div className="rounded-2xl bg-slate-900/50 border border-white/10 overflow-hidden">
        <div className="p-6 border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500">
              <Lock className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">Password</h2>
              <p className="text-sm text-slate-400">Change your password</p>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-white">New Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={passwords.new}
              onChange={(e) => setPasswords(prev => ({ ...prev, new: e.target.value }))}
              className="w-full h-12 px-4 bg-slate-800/50 border border-white/10 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-white">Confirm New Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={passwords.confirm}
              onChange={(e) => setPasswords(prev => ({ ...prev, confirm: e.target.value }))}
              className="w-full h-12 px-4 bg-slate-800/50 border border-white/10 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all"
            />
          </div>

          {passwordError && (
            <p className="text-sm text-red-400">{passwordError}</p>
          )}
          {passwordSuccess && (
            <p className="text-sm text-emerald-400">Password updated successfully!</p>
          )}

          <div className="flex justify-end">
            <button
              onClick={handlePasswordChange}
              disabled={!passwords.new || !passwords.confirm}
              className="flex items-center gap-2 px-5 py-2.5 bg-slate-800 border border-white/10 rounded-xl font-medium text-white hover:bg-slate-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Update Password
            </button>
          </div>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="rounded-2xl bg-red-500/5 border border-red-500/20 overflow-hidden">
        <div className="p-6 border-b border-red-500/10">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gradient-to-br from-red-500 to-orange-500">
              <AlertTriangle className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-red-400">Danger Zone</h2>
              <p className="text-sm text-slate-400">Irreversible actions</p>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-white">Delete Account</p>
              <p className="text-sm text-slate-400">
                Permanently delete your account and all data
              </p>
            </div>
            <button
              onClick={handleDeleteAccount}
              disabled={deleting}
              className="flex items-center gap-2 px-5 py-2.5 bg-red-500/10 border border-red-500/20 rounded-xl font-medium text-red-400 hover:bg-red-500/20 transition-all disabled:opacity-50"
            >
              {deleting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Trash2 className="h-4 w-4" />
              )}
              Delete Account
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
