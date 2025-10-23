import React from 'react'
import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ButtonSpinnerProps {
  /**
   * Loading text to display alongside spinner
   */
  text?: string
  /**
   * Size of the spinner
   */
  size?: 'sm' | 'md' | 'lg'
  /**
   * Additional classes
   */
  className?: string
}

const sizeClasses = {
  sm: 'h-3 w-3',
  md: 'h-4 w-4',
  lg: 'h-5 w-5',
}

/**
 * ButtonSpinner - Loading indicator for button actions
 *
 * @example
 * <Button disabled={isLoading}>
 *   {isLoading ? <ButtonSpinner text="Saving..." /> : 'Save'}
 * </Button>
 */
export function ButtonSpinner({ text, size = 'md', className }: ButtonSpinnerProps) {
  return (
    <div className={cn('flex items-center gap-2', className)}>
      <Loader2 className={cn('animate-spin', sizeClasses[size])} />
      {text && <span>{text}</span>}
    </div>
  )
}

/**
 * Inline spinner without text - useful for icon-only buttons
 */
export function SpinnerIcon({ size = 'md', className }: Omit<ButtonSpinnerProps, 'text'>) {
  return <Loader2 className={cn('animate-spin', sizeClasses[size], className)} />
}
