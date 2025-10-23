'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff, Lock, User, ShoppingBag } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { LoadingSpinner } from '@/components/ui/loading-spinner'

export default function LoginPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')

  // Form state
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  // Floating label state
  const [usernameFocused, setUsernameFocused] = useState(false)
  const [passwordFocused, setPasswordFocused] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Login failed')
      }

      // Redirect to dashboard on success
      router.push('/dashboard')
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen">
      {/* Left Panel - Branding */}
      <div className="bg-gradient-primary relative hidden overflow-hidden lg:flex lg:w-2/5">
        {/* Decorative elements */}
        <div className="bg-grid-pattern absolute inset-0 opacity-10" />
        <div className="absolute top-0 right-0 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute bottom-0 left-0 h-96 w-96 rounded-full bg-white/5 blur-3xl" />

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-center px-12 text-white">
          <div className="mb-8">
            <ShoppingBag className="mb-4 h-16 w-16" />
            <h1 className="mb-2 text-4xl font-bold">Web Koperasi</h1>
            <p className="text-xl text-white/90">Universitas Muhammadiyah Bandung</p>
          </div>

          <div className="space-y-6">
            <div className="flex items-start space-x-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white/20">
                <span className="text-lg font-bold">✓</span>
              </div>
              <div>
                <h3 className="mb-1 font-semibold">Manajemen Koperasi Modern</h3>
                <p className="text-sm text-white/80">
                  Kelola seluruh operasional koperasi dalam satu platform terpadu
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white/20">
                <span className="text-lg font-bold">✓</span>
              </div>
              <div>
                <h3 className="mb-1 font-semibold">Real-time Reporting</h3>
                <p className="text-sm text-white/80">
                  Dapatkan laporan dan analitik secara real-time untuk keputusan yang lebih baik
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white/20">
                <span className="text-lg font-bold">✓</span>
              </div>
              <div>
                <h3 className="mb-1 font-semibold">Keamanan Terjamin</h3>
                <p className="text-sm text-white/80">
                  Data Anda aman dengan enkripsi dan sistem keamanan berlapis
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="bg-background flex flex-1 items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="mb-8 text-center lg:hidden">
            <ShoppingBag className="text-primary mx-auto mb-3 h-12 w-12" />
            <h1 className="text-2xl font-bold">Web Koperasi UMB</h1>
            <p className="text-muted-foreground text-sm">Universitas Muhammadiyah Bandung</p>
          </div>

          {/* Form Header */}
          <div className="mb-8">
            <h2 className="mb-2 text-3xl font-bold">Welcome Back</h2>
            <p className="text-muted-foreground">Sign in to access your cooperative dashboard</p>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="bg-destructive/10 border-destructive/20 mb-6 rounded-lg border p-4">
              <p className="text-destructive text-sm">{error}</p>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Username Field with Floating Label */}
            <div className="relative">
              <div className="text-muted-foreground absolute top-1/2 left-3 -translate-y-1/2">
                <User className="h-5 w-5" />
              </div>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                onFocus={() => setUsernameFocused(true)}
                onBlur={() => setUsernameFocused(false)}
                className={`bg-background border-input focus:ring-ring w-full rounded-lg border pt-6 pr-4 pb-2 pl-11 transition-all duration-200 focus:ring-2 focus:outline-none`}
                required
                disabled={isLoading}
              />
              <label
                htmlFor="username"
                className={`pointer-events-none absolute left-11 transition-all duration-200 ${
                  usernameFocused || username
                    ? 'text-muted-foreground top-2 text-xs'
                    : 'text-muted-foreground top-1/2 -translate-y-1/2 text-sm'
                } `}
              >
                Username
              </label>
            </div>

            {/* Password Field with Floating Label */}
            <div className="relative">
              <div className="text-muted-foreground absolute top-1/2 left-3 -translate-y-1/2">
                <Lock className="h-5 w-5" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onFocus={() => setPasswordFocused(true)}
                onBlur={() => setPasswordFocused(false)}
                className={`bg-background border-input focus:ring-ring w-full rounded-lg border pt-6 pr-12 pb-2 pl-11 transition-all duration-200 focus:ring-2 focus:outline-none`}
                required
                disabled={isLoading}
              />
              <label
                htmlFor="password"
                className={`pointer-events-none absolute left-11 transition-all duration-200 ${
                  passwordFocused || password
                    ? 'text-muted-foreground top-2 text-xs'
                    : 'text-muted-foreground top-1/2 -translate-y-1/2 text-sm'
                } `}
              >
                Password
              </label>
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-muted-foreground hover:text-foreground absolute top-1/2 right-3 -translate-y-1/2 transition-colors"
                disabled={isLoading}
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <label className="flex cursor-pointer items-center space-x-2">
                <input
                  type="checkbox"
                  className="border-input text-primary focus:ring-ring h-4 w-4 rounded focus:ring-2"
                  disabled={isLoading}
                />
                <span className="text-muted-foreground text-sm">Remember me</span>
              </label>
              <button type="button" className="text-primary text-sm hover:underline" disabled>
                Forgot password?
              </button>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="h-12 w-full text-base font-semibold"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <LoadingSpinner size="sm" className="mr-2" />
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </Button>
          </form>

          {/* Test Credentials */}
          <div className="bg-muted/50 mt-8 rounded-lg p-4">
            <p className="text-muted-foreground mb-2 text-xs font-semibold">Test Credentials:</p>
            <div className="text-muted-foreground space-y-1 font-mono text-xs">
              <p>developer / password123</p>
              <p>admin / password123</p>
              <p>kasir / password123</p>
            </div>
          </div>

          {/* Footer */}
          <p className="text-muted-foreground mt-8 text-center text-xs">
            © 2025 Web Koperasi UM Bandung. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  )
}
