'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { trpc } from '@/lib/trpc'
import { Loader2, LogIn, ShieldCheck } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const router = useRouter()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const loginMutation = trpc.auth.login.useMutation({
    onSuccess: (data) => {
      alert(`✅ ${data.message}\nSelamat datang, ${data.user.full_name}!`)
      router.push('/')
      router.refresh()
    },
    onError: (error) => {
      alert(`❌ Error: ${error.message}`)
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    loginMutation.mutate({ username, password })
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 p-4">
      <Card className="w-full max-w-md border-2 border-blue-200">
        <CardHeader className="space-y-1 text-center">
          <div className="mb-4 flex justify-center">
            <div className="rounded-2xl bg-blue-600 p-4">
              <ShieldCheck className="h-10 w-10 text-white" />
            </div>
          </div>
          <CardTitle className="text-3xl font-bold">Login</CardTitle>
          <CardDescription>Web Koperasi UM Bandung</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Username */}
            <div className="space-y-2">
              <label htmlFor="username" className="text-sm font-medium text-gray-700">
                Username
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                placeholder="Masukkan username"
                required
                disabled={loginMutation.isPending}
              />
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                placeholder="Masukkan password"
                required
                disabled={loginMutation.isPending}
              />
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700"
              disabled={loginMutation.isPending}
            >
              {loginMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Loading...
                </>
              ) : (
                <>
                  <LogIn className="mr-2 h-4 w-4" />
                  Login
                </>
              )}
            </Button>
          </form>

          {/* Demo Credentials */}
          <div className="mt-6 rounded-lg border border-gray-200 bg-gray-50 p-4">
            <p className="mb-2 text-xs font-semibold text-gray-700">🔑 Demo Credentials:</p>
            <div className="space-y-1 text-xs text-gray-600">
              <p>
                <strong>Developer:</strong> developer / password123
              </p>
              <p>
                <strong>Super Admin:</strong> superadmin / password123
              </p>
              <p>
                <strong>Admin:</strong> admin / password123
              </p>
              <p>
                <strong>Kasir:</strong> kasir / password123
              </p>
            </div>
          </div>

          {/* Back to Home */}
          <div className="mt-4 text-center">
            <Button
              variant="link"
              onClick={() => router.push('/')}
              className="text-sm text-blue-600"
            >
              ← Kembali ke Homepage
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
