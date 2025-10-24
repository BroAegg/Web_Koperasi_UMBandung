/**
 * Enhanced Loading Skeleton Components
 * Various skeleton loaders for different content types
 */

import { cn } from '@/lib/utils'

interface SkeletonProps {
  className?: string
  style?: React.CSSProperties
}

export function Skeleton({ className, style }: SkeletonProps) {
  return <div className={cn('skeleton', className)} style={style} />
}

export function SkeletonText({ className }: SkeletonProps) {
  return <div className={cn('skeleton skeleton-text', className)} />
}

export function SkeletonAvatar({ className }: SkeletonProps) {
  return <div className={cn('skeleton skeleton-avatar', className)} />
}

export function SkeletonButton({ className }: SkeletonProps) {
  return <div className={cn('skeleton skeleton-button', className)} />
}

// Card skeleton
export function SkeletonCard() {
  return (
    <div className="border-border bg-card space-y-4 rounded-lg border p-6">
      <div className="flex items-center space-x-4">
        <SkeletonAvatar />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-1/4" />
          <Skeleton className="h-3 w-1/3" />
        </div>
      </div>
      <div className="space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <Skeleton className="h-4 w-4/6" />
      </div>
    </div>
  )
}

// Table skeleton
export function SkeletonTable({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center space-x-4">
          <Skeleton className="h-12 w-12 rounded" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-1/4" />
            <Skeleton className="h-3 w-1/3" />
          </div>
          <Skeleton className="h-8 w-20" />
        </div>
      ))}
    </div>
  )
}

// Stats card skeleton
export function SkeletonStatsCard() {
  return (
    <div className="border-border bg-card space-y-3 rounded-lg border p-6">
      <Skeleton className="h-4 w-1/3" />
      <Skeleton className="h-8 w-1/2" />
      <Skeleton className="h-3 w-2/3" />
    </div>
  )
}

// Chart skeleton
export function SkeletonChart() {
  const heights = [40, 65, 50, 85, 70, 45, 90]

  return (
    <div className="space-y-4">
      <div className="flex h-64 items-end justify-between px-4">
        {heights.map((height, i) => (
          <Skeleton key={i} className="w-12" style={{ height: `${height}%` }} />
        ))}
      </div>
      <div className="flex justify-between px-4">
        {Array.from({ length: 7 }).map((_, i) => (
          <Skeleton key={i} className="h-3 w-8" />
        ))}
      </div>
    </div>
  )
}

// Form skeleton
export function SkeletonForm({ fields = 4 }: { fields?: number }) {
  return (
    <div className="space-y-6">
      {Array.from({ length: fields }).map((_, i) => (
        <div key={i} className="space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-10 w-full" />
        </div>
      ))}
      <div className="flex justify-end space-x-2">
        <SkeletonButton />
        <SkeletonButton />
      </div>
    </div>
  )
}

// Page skeleton (full page loader)
export function SkeletonPage() {
  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="space-y-2">
        <Skeleton className="h-8 w-1/4" />
        <Skeleton className="h-4 w-1/3" />
      </div>

      {/* Stats cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <SkeletonStatsCard />
        <SkeletonStatsCard />
        <SkeletonStatsCard />
        <SkeletonStatsCard />
      </div>

      {/* Content */}
      <div className="grid gap-6 lg:grid-cols-2">
        <SkeletonCard />
        <SkeletonCard />
      </div>
    </div>
  )
}
