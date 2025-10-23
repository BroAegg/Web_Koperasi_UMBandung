import React from 'react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { cn } from '@/lib/utils'

interface SkeletonLoaderProps {
  /**
   * Type of skeleton to display
   */
  variant?: 'card' | 'table' | 'stats' | 'list'
  /**
   * Number of items to show
   */
  count?: number
  className?: string
}

/**
 * Skeleton base component with enhanced shimmer effect
 */
function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-md bg-neutral-200 before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-linear-to-r before:from-transparent before:via-white/60 before:to-transparent',
        className
      )}
    />
  )
}

/**
 * Stats Card Skeleton
 */
function StatsCardSkeleton() {
  return (
    <Card className="border-0 shadow-lg">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex-1 space-y-2">
            <Skeleton className="h-8 w-16" />
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-3 w-20" />
          </div>
          <Skeleton className="h-10 w-10 rounded-full" />
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <Skeleton className="h-4 w-32" />
      </CardContent>
    </Card>
  )
}

/**
 * Table Row Skeleton
 */
function TableRowSkeleton() {
  return (
    <div className="flex items-center gap-4 border-b border-neutral-200 py-4">
      <Skeleton className="h-4 w-1/6" />
      <Skeleton className="h-4 w-1/4" />
      <Skeleton className="h-4 w-1/5" />
      <Skeleton className="h-4 w-1/6" />
      <Skeleton className="h-4 w-1/6" />
      <Skeleton className="h-8 w-20 rounded-md" />
    </div>
  )
}

/**
 * Card Content Skeleton
 */
function CardSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-1/3" />
        <Skeleton className="mt-2 h-4 w-1/2" />
      </CardHeader>
      <CardContent className="space-y-3">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <Skeleton className="h-4 w-4/6" />
        <div className="mt-4 flex gap-2">
          <Skeleton className="h-10 w-24 rounded-md" />
          <Skeleton className="h-10 w-24 rounded-md" />
        </div>
      </CardContent>
    </Card>
  )
}

/**
 * List Item Skeleton
 */
function ListItemSkeleton() {
  return (
    <div className="flex items-start gap-3 rounded-lg border border-neutral-200 p-3">
      <Skeleton className="h-8 w-8 shrink-0 rounded-full" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
      </div>
    </div>
  )
}

/**
 * Main Skeleton Loader Component
 */
export function SkeletonLoader({ variant = 'card', count = 1, className }: SkeletonLoaderProps) {
  const renderSkeleton = () => {
    switch (variant) {
      case 'stats':
        return (
          <div className={cn('grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4', className)}>
            {Array.from({ length: count }).map((_, i) => (
              <StatsCardSkeleton key={i} />
            ))}
          </div>
        )

      case 'table':
        return (
          <Card className={className}>
            <CardContent className="p-6">
              {Array.from({ length: count }).map((_, i) => (
                <TableRowSkeleton key={i} />
              ))}
            </CardContent>
          </Card>
        )

      case 'list':
        return (
          <div className={cn('space-y-3', className)}>
            {Array.from({ length: count }).map((_, i) => (
              <ListItemSkeleton key={i} />
            ))}
          </div>
        )

      case 'card':
      default:
        return (
          <div className={cn('grid gap-4 sm:grid-cols-2 lg:grid-cols-3', className)}>
            {Array.from({ length: count }).map((_, i) => (
              <CardSkeleton key={i} />
            ))}
          </div>
        )
    }
  }

  return <>{renderSkeleton()}</>
}

// Export individual skeleton components for custom use
export { Skeleton, StatsCardSkeleton, TableRowSkeleton, CardSkeleton, ListItemSkeleton }
