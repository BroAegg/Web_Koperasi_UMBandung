import React from 'react'
import { Button } from '@/components/ui/button'
import { RefreshCcw, RotateCcw, ArrowLeft } from 'lucide-react'
import { cn } from '@/lib/utils'

interface RetryButtonProps {
  /**
   * Click handler
   */
  onRetry: () => void
  /**
   * Button variant
   */
  variant?: 'default' | 'outline' | 'ghost'
  /**
   * Button size
   */
  size?: 'default' | 'sm' | 'lg'
  /**
   * Custom label
   */
  label?: string
  /**
   * Show icon
   */
  showIcon?: boolean
  /**
   * Loading state
   */
  loading?: boolean
  /**
   * Additional CSS classes
   */
  className?: string
}

/**
 * RetryButton - Button for retry actions with loading state
 *
 * @example
 * <RetryButton onRetry={refetch} loading={isRefetching} />
 */
export function RetryButton({
  onRetry,
  variant = 'default',
  size = 'default',
  label = 'Coba Lagi',
  showIcon = true,
  loading = false,
  className,
}: RetryButtonProps) {
  return (
    <Button
      onClick={onRetry}
      variant={variant}
      size={size}
      disabled={loading}
      className={className}
    >
      {loading ? (
        <>
          <RefreshCcw className={cn('mr-2 animate-spin', size === 'sm' ? 'h-3 w-3' : 'h-4 w-4')} />
          Memuat...
        </>
      ) : (
        <>
          {showIcon && <RotateCcw className={cn('mr-2', size === 'sm' ? 'h-3 w-3' : 'h-4 w-4')} />}
          {label}
        </>
      )}
    </Button>
  )
}

/**
 * BackButton - Button to go back/cancel
 */
export function BackButton({
  onBack,
  label = 'Kembali',
  variant = 'outline',
  size = 'default',
  className,
}: {
  onBack: () => void
  label?: string
  variant?: 'default' | 'outline' | 'ghost'
  size?: 'default' | 'sm' | 'lg'
  className?: string
}) {
  return (
    <Button onClick={onBack} variant={variant} size={size} className={className}>
      <ArrowLeft className={cn('mr-2', size === 'sm' ? 'h-3 w-3' : 'h-4 w-4')} />
      {label}
    </Button>
  )
}

/**
 * RefreshButton - Simple refresh button with icon only
 */
export function RefreshButton({
  onRefresh,
  loading = false,
  size = 'default',
  className,
}: {
  onRefresh: () => void
  loading?: boolean
  size?: 'default' | 'sm' | 'lg'
  className?: string
}) {
  const iconSize = size === 'sm' ? 'h-3 w-3' : size === 'lg' ? 'h-5 w-5' : 'h-4 w-4'

  return (
    <Button
      onClick={onRefresh}
      variant="ghost"
      size="icon"
      disabled={loading}
      className={cn(
        size === 'sm' ? 'h-8 w-8' : size === 'lg' ? 'h-12 w-12' : 'h-10 w-10',
        className
      )}
      aria-label="Refresh"
    >
      <RefreshCcw className={cn(iconSize, loading && 'animate-spin')} />
    </Button>
  )
}
