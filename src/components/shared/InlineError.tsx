import React from 'react'
import { AlertCircle, AlertTriangle, XCircle, Info } from 'lucide-react'
import { cn } from '@/lib/utils'

interface InlineErrorProps {
  /**
   * Error message to display
   */
  message: string
  /**
   * Severity level
   */
  variant?: 'error' | 'warning' | 'info'
  /**
   * Show icon
   */
  showIcon?: boolean
  /**
   * Additional CSS classes
   */
  className?: string
}

const variantStyles = {
  error: {
    container: 'border-red-200 bg-red-50 text-red-800',
    icon: 'text-red-600',
    Icon: XCircle,
  },
  warning: {
    container: 'border-orange-200 bg-orange-50 text-orange-800',
    icon: 'text-orange-600',
    Icon: AlertTriangle,
  },
  info: {
    container: 'border-blue-200 bg-blue-50 text-blue-800',
    icon: 'text-blue-600',
    Icon: Info,
  },
}

/**
 * InlineError - Display inline error/warning/info messages
 *
 * @example
 * <InlineError message="Email sudah terdaftar" variant="error" />
 */
export function InlineError({
  message,
  variant = 'error',
  showIcon = true,
  className,
}: InlineErrorProps) {
  const styles = variantStyles[variant]
  const Icon = styles.Icon

  return (
    <div
      className={cn(
        'flex items-start gap-2 rounded-lg border p-3 text-sm',
        styles.container,
        className
      )}
      role="alert"
    >
      {showIcon && <Icon className={cn('h-5 w-5 shrink-0', styles.icon)} />}
      <p className="flex-1">{message}</p>
    </div>
  )
}

/**
 * FormFieldError - Error message for form fields
 *
 * @example
 * {errors.email && <FormFieldError message={errors.email} />}
 */
export function FormFieldError({ message, className }: { message: string; className?: string }) {
  return (
    <div className={cn('mt-1 flex items-center gap-1 text-sm text-red-600', className)}>
      <AlertCircle className="h-4 w-4 shrink-0" />
      <span>{message}</span>
    </div>
  )
}

/**
 * ErrorAlert - Prominent error alert box
 *
 * @example
 * {error && <ErrorAlert title="Login Failed" message={error.message} />}
 */
export function ErrorAlert({
  title,
  message,
  onDismiss,
  className,
}: {
  title?: string
  message: string
  onDismiss?: () => void
  className?: string
}) {
  return (
    <div
      className={cn('relative rounded-lg border-2 border-red-200 bg-red-50 p-4', className)}
      role="alert"
    >
      <div className="flex items-start gap-3">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-red-100">
          <XCircle className="h-5 w-5 text-red-600" />
        </div>
        <div className="flex-1">
          {title && <h4 className="mb-1 font-semibold text-red-900">{title}</h4>}
          <p className="text-sm text-red-700">{message}</p>
        </div>
        {onDismiss && (
          <button
            onClick={onDismiss}
            className="shrink-0 rounded-md p-1 text-red-600 hover:bg-red-100 focus:ring-2 focus:ring-red-500 focus:outline-none"
            aria-label="Dismiss"
          >
            <XCircle className="h-5 w-5" />
          </button>
        )}
      </div>
    </div>
  )
}

/**
 * WarningAlert - Warning alert box
 */
export function WarningAlert({
  title,
  message,
  onDismiss,
  className,
}: {
  title?: string
  message: string
  onDismiss?: () => void
  className?: string
}) {
  return (
    <div
      className={cn('relative rounded-lg border-2 border-orange-200 bg-orange-50 p-4', className)}
      role="alert"
    >
      <div className="flex items-start gap-3">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-orange-100">
          <AlertTriangle className="h-5 w-5 text-orange-600" />
        </div>
        <div className="flex-1">
          {title && <h4 className="mb-1 font-semibold text-orange-900">{title}</h4>}
          <p className="text-sm text-orange-700">{message}</p>
        </div>
        {onDismiss && (
          <button
            onClick={onDismiss}
            className="shrink-0 rounded-md p-1 text-orange-600 hover:bg-orange-100 focus:ring-2 focus:ring-orange-500 focus:outline-none"
            aria-label="Dismiss"
          >
            <XCircle className="h-5 w-5" />
          </button>
        )}
      </div>
    </div>
  )
}

/**
 * InfoAlert - Info alert box
 */
export function InfoAlert({
  title,
  message,
  onDismiss,
  className,
}: {
  title?: string
  message: string
  onDismiss?: () => void
  className?: string
}) {
  return (
    <div
      className={cn('relative rounded-lg border-2 border-blue-200 bg-blue-50 p-4', className)}
      role="alert"
    >
      <div className="flex items-start gap-3">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-100">
          <Info className="h-5 w-5 text-blue-600" />
        </div>
        <div className="flex-1">
          {title && <h4 className="mb-1 font-semibold text-blue-900">{title}</h4>}
          <p className="text-sm text-blue-700">{message}</p>
        </div>
        {onDismiss && (
          <button
            onClick={onDismiss}
            className="shrink-0 rounded-md p-1 text-blue-600 hover:bg-blue-100 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            aria-label="Dismiss"
          >
            <XCircle className="h-5 w-5" />
          </button>
        )}
      </div>
    </div>
  )
}
