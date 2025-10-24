// Lazy Loading Components
// Provides loading states for code-split components

import { Loader2 } from 'lucide-react'
import { Card, CardContent } from './card'

// Generic page loading fallback
export function PageLoadingFallback() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="text-center">
        <Loader2 className="text-primary mx-auto mb-4 h-12 w-12 animate-spin" />
        <p className="text-muted-foreground text-sm">Loading page...</p>
      </div>
    </div>
  )
}

// Dashboard loading skeleton
export function DashboardLoadingFallback() {
  return (
    <div className="space-y-6 p-6">
      <div className="h-10 w-64 animate-pulse rounded bg-gray-200" />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="space-y-3">
                <div className="h-4 w-24 animate-pulse rounded bg-gray-200" />
                <div className="h-8 w-32 animate-pulse rounded bg-gray-200" />
                <div className="h-3 w-20 animate-pulse rounded bg-gray-200" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

// Table loading skeleton
export function TableLoadingFallback() {
  return (
    <div className="space-y-4 p-6">
      <div className="flex items-center justify-between">
        <div className="h-8 w-48 animate-pulse rounded bg-gray-200" />
        <div className="h-10 w-32 animate-pulse rounded bg-gray-200" />
      </div>
      <Card>
        <CardContent className="p-6">
          <div className="space-y-3">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="h-12 w-full animate-pulse rounded bg-gray-100" />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// POS loading skeleton
export function POSLoadingFallback() {
  return (
    <div className="grid gap-6 p-6 lg:grid-cols-3">
      {/* Products area */}
      <div className="lg:col-span-2">
        <Card>
          <CardContent className="p-6">
            <div className="mb-4 h-10 w-full animate-pulse rounded bg-gray-200" />
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-48 animate-pulse rounded-lg bg-gray-100" />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
      {/* Cart area */}
      <div>
        <Card>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="h-8 w-32 animate-pulse rounded bg-gray-200" />
              <div className="space-y-3">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="h-20 w-full animate-pulse rounded bg-gray-100" />
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

// Form loading skeleton
export function FormLoadingFallback() {
  return (
    <Card className="p-6">
      <div className="space-y-4">
        <div className="h-8 w-48 animate-pulse rounded bg-gray-200" />
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="space-y-2">
            <div className="h-4 w-24 animate-pulse rounded bg-gray-200" />
            <div className="h-10 w-full animate-pulse rounded bg-gray-100" />
          </div>
        ))}
        <div className="flex gap-2">
          <div className="h-10 w-24 animate-pulse rounded bg-gray-200" />
          <div className="h-10 w-24 animate-pulse rounded bg-gray-200" />
        </div>
      </div>
    </Card>
  )
}

// Minimal loading indicator for smaller components
export function ComponentLoadingFallback() {
  return (
    <div className="flex items-center justify-center py-8">
      <Loader2 className="text-muted-foreground h-6 w-6 animate-spin" />
    </div>
  )
}

// Chart loading skeleton
export function ChartLoadingFallback() {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="mb-4 h-6 w-32 animate-pulse rounded bg-gray-200" />
        <div className="h-64 animate-pulse rounded-lg bg-gray-100" />
      </CardContent>
    </Card>
  )
}
