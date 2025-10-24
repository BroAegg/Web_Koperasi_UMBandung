/**
 * Success & Error Animation Components
 * Animated feedback components for user actions
 */

'use client'

import { useEffect, useState } from 'react'
import { CheckCircle2, XCircle, AlertCircle, Info } from 'lucide-react'
import { cn } from '@/lib/utils'

interface AnimatedIconProps {
  className?: string
  size?: number
}

// Success checkmark animation
export function SuccessAnimation({ className, size = 64 }: AnimatedIconProps) {
  const [show, setShow] = useState(true)

  return (
    <div className={cn('relative', className)}>
      <CheckCircle2
        size={size}
        className={cn(
          'text-success',
          show ? 'animate-bounce-in' : 'scale-0 opacity-0',
          'transition-all duration-500'
        )}
        strokeWidth={2}
      />
      {show && (
        <svg
          className="absolute inset-0"
          viewBox="0 0 100 100"
          style={{ width: size, height: size }}
        >
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="text-success/20 animate-ripple"
          />
        </svg>
      )}
    </div>
  )
}

// Error shake animation
export function ErrorAnimation({ className, size = 64 }: AnimatedIconProps) {
  return (
    <div className={cn('relative', className)}>
      <XCircle
        size={size}
        className={cn('text-destructive animate-shake', 'transition-all duration-300')}
        strokeWidth={2}
      />
    </div>
  )
}

// Warning pulse animation
export function WarningAnimation({ className, size = 64 }: AnimatedIconProps) {
  return (
    <div className={cn('relative', className)}>
      <AlertCircle size={size} className="text-warning animate-pulse" strokeWidth={2} />
    </div>
  )
}

// Info animation
export function InfoAnimation({ className, size = 64 }: AnimatedIconProps) {
  return (
    <div className={cn('relative', className)}>
      <Info
        size={size}
        className={cn('text-info animate-fade-in-scale', 'transition-all duration-300')}
        strokeWidth={2}
      />
    </div>
  )
}

// Animated success message
export function SuccessMessage({
  message,
  description,
  onClose,
}: {
  message: string
  description?: string
  onClose?: () => void
}) {
  useEffect(() => {
    if (onClose) {
      const timer = setTimeout(onClose, 3000)
      return () => clearTimeout(timer)
    }
  }, [onClose])

  return (
    <div
      className={cn(
        'bg-success/10 border-success/20 flex items-start space-x-3 rounded-lg border p-4',
        'animate-slide-down'
      )}
    >
      <SuccessAnimation size={24} />
      <div className="flex-1">
        <h4 className="text-success-foreground font-semibold">{message}</h4>
        {description && <p className="text-muted-foreground mt-1 text-sm">{description}</p>}
      </div>
    </div>
  )
}

// Animated error message
export function ErrorMessage({
  message,
  description,
  onClose,
}: {
  message: string
  description?: string
  onClose?: () => void
}) {
  useEffect(() => {
    if (onClose) {
      const timer = setTimeout(onClose, 3000)
      return () => clearTimeout(timer)
    }
  }, [onClose])

  return (
    <div
      className={cn(
        'bg-destructive/10 border-destructive/20 flex items-start space-x-3 rounded-lg border p-4',
        'animate-shake'
      )}
    >
      <ErrorAnimation size={24} />
      <div className="flex-1">
        <h4 className="text-destructive-foreground font-semibold">{message}</h4>
        {description && <p className="text-muted-foreground mt-1 text-sm">{description}</p>}
      </div>
    </div>
  )
}

// Loading spinner with text
export function LoadingSpinner({
  message = 'Loading...',
  size = 32,
}: {
  message?: string
  size?: number
}) {
  return (
    <div className="flex flex-col items-center justify-center space-y-4 py-8">
      <div
        className="border-primary/20 border-t-primary animate-spin rounded-full border-4"
        style={{ width: size, height: size }}
      />
      <p className="text-muted-foreground animate-pulse text-sm">{message}</p>
    </div>
  )
}

// Progress indicator
export function ProgressIndicator({ progress }: { progress: number }) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <span className="text-muted-foreground">Processing...</span>
        <span className="font-semibold">{progress}%</span>
      </div>
      <div className="bg-muted h-2 overflow-hidden rounded-full">
        <div
          className="bg-primary h-full transition-all duration-300 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  )
}
