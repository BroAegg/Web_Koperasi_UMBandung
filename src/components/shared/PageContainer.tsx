import React from 'react'
import { cn } from '@/lib/utils'

interface PageContainerProps {
  children: React.ReactNode
  className?: string
  /**
   * Optional max width constraint (defaults to full width)
   * - 'default': max-w-7xl (1280px)
   * - 'wide': max-w-screen-2xl (1536px)
   * - 'full': no max width
   */
  maxWidth?: 'default' | 'wide' | 'full'
}

const maxWidthClasses = {
  default: 'max-w-7xl mx-auto',
  wide: 'max-w-screen-2xl mx-auto',
  full: 'w-full',
}

export function PageContainer({ children, className, maxWidth = 'default' }: PageContainerProps) {
  return (
    <div
      className={cn(
        'min-h-screen bg-neutral-50 p-4 sm:p-6 lg:p-8',
        maxWidthClasses[maxWidth],
        'animate-fade-in',
        className
      )}
    >
      {children}
    </div>
  )
}
