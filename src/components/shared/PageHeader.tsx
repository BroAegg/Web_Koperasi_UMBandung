import React from 'react'
import { cn } from '@/lib/utils'

interface PageHeaderProps {
  title: string
  subtitle?: string
  action?: React.ReactNode
  className?: string
  /**
   * Optional breadcrumb component
   */
  breadcrumb?: React.ReactNode
}

export function PageHeader({ title, subtitle, action, className, breadcrumb }: PageHeaderProps) {
  return (
    <div className={cn('animate-slide-up mb-6 space-y-4', className)}>
      {/* Breadcrumb (if provided) */}
      {breadcrumb && <div className="text-sm">{breadcrumb}</div>}

      {/* Header Content */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex-1">
          <h1 className="text-3xl font-bold tracking-tight text-neutral-900">{title}</h1>
          {subtitle && (
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-neutral-600">{subtitle}</p>
          )}
        </div>

        {/* Action Buttons */}
        {action && <div className="flex shrink-0 items-center gap-2">{action}</div>}
      </div>
    </div>
  )
}
