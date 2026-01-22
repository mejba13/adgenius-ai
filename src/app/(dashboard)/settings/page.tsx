'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Save, Trash2, Loader2, Check } from 'lucide-react'

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
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Settings</h2>
        <p className="text-gray-600">
          Manage your account settings and preferences
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
          <CardDescription>
            Update your personal information
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              value={profile.name}
              onChange={(e) => setProfile(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Your name"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={profile.email}
              disabled
              className="bg-gray-50"
            />
            <p className="text-xs text-gray-500">
              Email cannot be changed. Contact support if needed.
            </p>
          </div>
          <div className="flex justify-end">
            <Button onClick={handleSave} disabled={saving}>
              {saving ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : saved ? (
                <>
                  <Check className="h-4 w-4 mr-2" />
                  Saved
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Password</CardTitle>
          <CardDescription>
            Change your password
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="new_password">New Password</Label>
            <Input
              id="new_password"
              type="password"
              placeholder="••••••••"
              value={passwords.new}
              onChange={(e) => setPasswords(prev => ({ ...prev, new: e.target.value }))}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirm_password">Confirm New Password</Label>
            <Input
              id="confirm_password"
              type="password"
              placeholder="••••••••"
              value={passwords.confirm}
              onChange={(e) => setPasswords(prev => ({ ...prev, confirm: e.target.value }))}
            />
          </div>
          {passwordError && (
            <p className="text-sm text-red-500">{passwordError}</p>
          )}
          {passwordSuccess && (
            <p className="text-sm text-green-500">Password updated successfully!</p>
          )}
          <div className="flex justify-end">
            <Button
              variant="outline"
              onClick={handlePasswordChange}
              disabled={!passwords.new || !passwords.confirm}
            >
              Update Password
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="border-red-200">
        <CardHeader>
          <CardTitle className="text-red-600">Danger Zone</CardTitle>
          <CardDescription>
            Irreversible actions that affect your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Delete Account</p>
              <p className="text-sm text-gray-500">
                Permanently delete your account and all data
              </p>
            </div>
            <Button
              variant="destructive"
              onClick={handleDeleteAccount}
              disabled={deleting}
            >
              {deleting ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Trash2 className="h-4 w-4 mr-2" />
              )}
              Delete Account
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
