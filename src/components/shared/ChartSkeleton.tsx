import React from 'react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { cn } from '@/lib/utils'

interface ChartSkeletonProps {
  /**
   * Type of chart skeleton
   */
  variant?: 'line' | 'bar' | 'pie' | 'area'
  /**
   * Height of the chart area
   */
  height?: string | number
  /**
   * Show chart title skeleton
   */
  showTitle?: boolean
  /**
   * Additional classes
   */
  className?: string
}

/**
 * Base skeleton component with shimmer effect
 */
function Skeleton({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <div
      className={cn(
        'animate-pulse rounded-md bg-linear-to-r from-neutral-200 via-neutral-100 to-neutral-200 bg-size-[200%_100%]',
        className
      )}
      style={{
        animation: 'shimmer 2s infinite',
        ...style,
      }}
    />
  )
}

/**
 * Line/Area Chart Skeleton
 */
function LineChartSkeleton({ height }: { height: string | number }) {
  // Pre-calculate heights to avoid Math.random() during render
  const barHeights = [85, 65, 75, 90, 70, 80, 60]

  return (
    <div className="relative" style={{ height }}>
      {/* Y-axis labels */}
      <div className="absolute top-0 left-0 flex h-full flex-col justify-between">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-3 w-8" />
        ))}
      </div>

      {/* Chart area */}
      <div className="ml-12 flex h-full items-end gap-2">
        {barHeights.map((heightPercent, i) => (
          <div key={i} className="flex flex-1 flex-col items-center gap-2">
            <div className="relative w-full flex-1">
              <Skeleton
                className="absolute bottom-0 w-full"
                style={{ height: `${heightPercent}%` }}
              />
            </div>
            <Skeleton className="h-3 w-8" />
          </div>
        ))}
      </div>
    </div>
  )
}

/**
 * Bar Chart Skeleton
 */
function BarChartSkeleton({ height }: { height: string | number }) {
  // Pre-calculate heights to avoid Math.random() during render
  const barHeights = [70, 85, 60, 90, 75, 65, 80, 55]

  return (
    <div className="flex items-end gap-2" style={{ height }}>
      {barHeights.map((heightPercent, i) => (
        <div key={i} className="flex flex-1 flex-col items-center gap-2">
          <Skeleton className="w-full" style={{ height: `${heightPercent}%` }} />
          <Skeleton className="h-3 w-12" />
        </div>
      ))}
    </div>
  )
}

/**
 * Pie Chart Skeleton
 */
function PieChartSkeleton({ height }: { height: string | number }) {
  return (
    <div className="flex items-center justify-center gap-8" style={{ height }}>
      {/* Pie circle */}
      <Skeleton className="aspect-square rounded-full" style={{ height: '80%' }} />

      {/* Legend */}
      <div className="space-y-3">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="flex items-center gap-2">
            <Skeleton className="h-4 w-4 rounded-sm" />
            <Skeleton className="h-3 w-20" />
          </div>
        ))}
      </div>
    </div>
  )
}

/**
 * ChartSkeleton - Loading skeleton for chart components
 *
 * @example
 * {isLoading ? (
 *   <ChartSkeleton variant="line" height={300} showTitle />
 * ) : (
 *   <LineChart data={data} />
 * )}
 */
export function ChartSkeleton({
  variant = 'line',
  height = 300,
  showTitle = true,
  className,
}: ChartSkeletonProps) {
  const heightValue = typeof height === 'number' ? `${height}px` : height

  const renderChart = () => {
    switch (variant) {
      case 'bar':
        return <BarChartSkeleton height={heightValue} />
      case 'pie':
        return <PieChartSkeleton height={heightValue} />
      case 'area':
      case 'line':
      default:
        return <LineChartSkeleton height={heightValue} />
    }
  }

  return (
    <Card className={className}>
      <CardHeader>
        {showTitle && (
          <div className="space-y-2">
            <Skeleton className="h-6 w-1/3" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        )}
      </CardHeader>
      <CardContent>{renderChart()}</CardContent>
    </Card>
  )
}
