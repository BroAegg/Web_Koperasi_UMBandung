'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'
import { useTheme } from '@/contexts/theme-context'

const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { hover?: boolean; interactive?: boolean }
>(({ className, hover = false, interactive = false, ...props }, ref) => {
  const { theme } = useTheme()

  return (
    <div
      ref={ref}
      className={cn(
        'rounded-2xl border shadow-sm transition-all duration-300',
        theme.card, // bg-white / bg-slate-800
        hover && 'hover:shadow-md',
        interactive && 'cursor-pointer hover:border-gray-300',
        className
      )}
      {...props}
    />
  )
})
Card.displayName = 'Card'

const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('flex flex-col space-y-1.5 p-5', className)} {...props} />
  )
)
CardHeader.displayName = 'CardHeader'

const CardTitle = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    const { theme } = useTheme()

    return (
      <div
        ref={ref}
        className={cn(
          'text-xs leading-none font-semibold tracking-tight',
          theme.kpiTitleText,
          className
        )}
        {...props}
      />
    )
  }
)
CardTitle.displayName = 'CardTitle'

const CardDescription = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    const { theme } = useTheme()

    return <div ref={ref} className={cn('text-sm', theme.subtext, className)} {...props} />
  }
)
CardDescription.displayName = 'CardDescription'

const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('p-5 pt-0', className)} {...props} />
  )
)
CardContent.displayName = 'CardContent'

const CardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('flex items-center p-5 pt-0', className)} {...props} />
  )
)
CardFooter.displayName = 'CardFooter'

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }
