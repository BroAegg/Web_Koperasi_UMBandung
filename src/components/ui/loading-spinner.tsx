import * as React from 'react'
import { cn } from '@/lib/utils'

interface LoadingSpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  variant?: 'primary' | 'muted' | 'white'
}

const sizeClasses = {
  sm: 'h-4 w-4 border-2',
  md: 'h-8 w-8 border-2',
  lg: 'h-12 w-12 border-3',
  xl: 'h-16 w-16 border-4',
}

const variantClasses = {
  primary: 'border-primary border-t-transparent',
  muted: 'border-muted-foreground border-t-transparent',
  white: 'border-white border-t-transparent',
}

export function LoadingSpinner({
  size = 'md',
  variant = 'primary',
  className,
  ...props
}: LoadingSpinnerProps) {
  return (
    <div role="status" aria-label="Loading" className={cn('inline-block', className)} {...props}>
      <div
        className={cn('animate-spin rounded-full', sizeClasses[size], variantClasses[variant])}
      />
      <span className="sr-only">Loading...</span>
    </div>
  )
}

interface LoadingOverlayProps {
  isLoading: boolean
  children: React.ReactNode
  message?: string
}

export function LoadingOverlay({
  isLoading,
  children,
  message = 'Loading...',
}: LoadingOverlayProps) {
  if (!isLoading) return <>{children}</>

  return (
    <div className="relative">
      <div className="pointer-events-none opacity-50">{children}</div>
      <div className="bg-background/80 absolute inset-0 flex flex-col items-center justify-center gap-3 backdrop-blur-sm">
        <LoadingSpinner size="lg" />
        {message && <p className="text-muted-foreground text-sm font-medium">{message}</p>}
      </div>
    </div>
  )
}
