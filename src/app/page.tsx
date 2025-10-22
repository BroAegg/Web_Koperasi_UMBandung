'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { trpc } from '@/lib/trpc'
import { CheckCircle2, Loader2 } from 'lucide-react'

export default function Home() {
  const { data, isLoading, error } = trpc.health.check.useQuery()

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-green-50 p-4">
      <div className="w-full max-w-4xl space-y-8">
        {/* Header */}
        <div className="space-y-4 text-center">
          <h1 className="text-5xl font-bold text-gray-900">🏗️ Web Koperasi UM Bandung</h1>
          <p className="text-xl text-gray-600">Full Rebuild Project - Foundation Setup Complete</p>
        </div>

        {/* Status Grid */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {/* Next.js */}
          <Card className="border-2 border-green-200 bg-white">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-green-700">
                <CheckCircle2 className="h-5 w-5" />
                Next.js 16
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">App Router + TypeScript</p>
            </CardContent>
          </Card>

          {/* Tailwind */}
          <Card className="border-2 border-green-200 bg-white">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-green-700">
                <CheckCircle2 className="h-5 w-5" />
                Tailwind CSS 4
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">Modern styling system</p>
            </CardContent>
          </Card>

          {/* shadcn/ui */}
          <Card className="border-2 border-green-200 bg-white">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-green-700">
                <CheckCircle2 className="h-5 w-5" />
                shadcn/ui
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">Component library ready</p>
            </CardContent>
          </Card>

          {/* Prisma */}
          <Card className="border-2 border-green-200 bg-white">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-green-700">
                <CheckCircle2 className="h-5 w-5" />
                Prisma ORM
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">PostgreSQL + schema ready</p>
            </CardContent>
          </Card>

          {/* tRPC */}
          <Card className="border-2 border-green-200 bg-white">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-green-700">
                <CheckCircle2 className="h-5 w-5" />
                tRPC + Zod
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">Type-safe API layer</p>
            </CardContent>
          </Card>

          {/* TanStack Query */}
          <Card className="border-2 border-green-200 bg-white">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-green-700">
                <CheckCircle2 className="h-5 w-5" />
                TanStack Query
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">Data fetching & caching</p>
            </CardContent>
          </Card>
        </div>

        {/* API Health Check */}
        <Card className="border-2 border-blue-200 bg-white">
          <CardHeader>
            <CardTitle>🔌 tRPC API Health Check</CardTitle>
            <CardDescription>Testing end-to-end type-safe API</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading && (
              <div className="flex items-center gap-2 text-gray-600">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Checking API status...</span>
              </div>
            )}
            {error && (
              <div className="rounded-lg border border-red-200 bg-red-50 p-4">
                <p className="font-medium text-red-700">⚠️ API Error</p>
                <p className="mt-1 text-sm text-red-600">{error.message}</p>
              </div>
            )}
            {data && (
              <div className="space-y-3">
                <div className="flex items-center gap-2 font-medium text-green-700">
                  <CheckCircle2 className="h-5 w-5" />
                  <span>API is running successfully!</span>
                </div>
                <div className="rounded-lg bg-gray-50 p-4 font-mono text-sm">
                  <pre>{JSON.stringify(data, null, 2)}</pre>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Next Steps */}
        <Card className="border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50">
          <CardHeader>
            <CardTitle className="text-purple-900">🎯 Next Steps</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-purple-800">✅ Week 1: Foundation Setup - COMPLETE</p>
            <p className="text-gray-600">📋 Next: Configure PostgreSQL database</p>
            <p className="text-gray-600">📋 Then: Create database migrations</p>
            <p className="text-gray-600">📋 Then: Seed initial data</p>
            <p className="text-gray-600">📋 Coming: Week 2 - Financial Module</p>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-wrap justify-center gap-4">
          <Button size="lg" className="bg-purple-600 hover:bg-purple-700" asChild>
            <a href="/login">🔐 Test Login System</a>
          </Button>
          <Button size="lg" className="bg-green-600 hover:bg-green-700" asChild>
            <a href="/test/products">🛍️ Test Products API</a>
          </Button>
          <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
            View Documentation
          </Button>
          <Button size="lg" variant="outline">
            GitHub Repository
          </Button>
        </div>
      </div>
    </div>
  )
}
