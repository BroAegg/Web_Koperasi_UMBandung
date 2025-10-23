import React from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { LucideIcon, Inbox, FileX, SearchX, PackageX, Users, Package } from 'lucide-react'
import { cn } from '@/lib/utils'

interface EmptyStateProps {
  /**
   * Icon to display
   */
  icon?: LucideIcon
  /**
   * Preset icon variant
   */
  variant?: 'default' | 'search' | 'data' | 'products' | 'users' | 'orders'
  /**
   * Title text
   */
  title: string
  /**
   * Description text
   */
  description: string
  /**
   * Optional action button
   */
  action?: {
    label: string
    onClick: () => void
    icon?: LucideIcon
  }
  /**
   * Optional secondary action
   */
  secondaryAction?: {
    label: string
    onClick: () => void
  }
  className?: string
}

const variantIcons: Record<string, LucideIcon> = {
  default: Inbox,
  search: SearchX,
  data: FileX,
  products: PackageX,
  users: Users,
  orders: Package,
}

const variantColors: Record<string, string> = {
  default: 'bg-neutral-100 text-neutral-600',
  search: 'bg-blue-100 text-blue-600',
  data: 'bg-purple-100 text-purple-600',
  products: 'bg-green-100 text-green-600',
  users: 'bg-orange-100 text-orange-600',
  orders: 'bg-pink-100 text-pink-600',
}

/**
 * Empty State Component
 * Displays a friendly message when there's no data to show
 */
export function EmptyState({
  icon: CustomIcon,
  variant = 'default',
  title,
  description,
  action,
  secondaryAction,
  className,
}: EmptyStateProps) {
  const Icon = CustomIcon || variantIcons[variant]
  const colorClass = variantColors[variant]

  return (
    <Card className={cn('border-dashed', className)}>
      <CardContent className="flex flex-col items-center justify-center px-4 py-16">
        {/* Icon */}
        <div
          className={cn('mb-4 flex h-20 w-20 items-center justify-center rounded-full', colorClass)}
        >
          <Icon className="h-10 w-10" />
        </div>

        {/* Title */}
        <h3 className="mb-2 text-center text-xl font-semibold text-neutral-900">{title}</h3>

        {/* Description */}
        <p className="mb-6 max-w-md text-center text-sm text-neutral-600">{description}</p>

        {/* Actions */}
        {(action || secondaryAction) && (
          <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
            {action && (
              <Button onClick={action.onClick} variant="default">
                {action.icon && <action.icon className="mr-2 h-4 w-4" />}
                {action.label}
              </Button>
            )}
            {secondaryAction && (
              <Button onClick={secondaryAction.onClick} variant="outline">
                {secondaryAction.label}
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

/**
 * Simple Empty State (without card wrapper)
 * For use inside existing cards
 */
interface SimpleEmptyStateProps {
  icon?: LucideIcon
  title: string
  description?: string
  className?: string
}

export function SimpleEmptyState({
  icon: Icon = Inbox,
  title,
  description,
  className,
}: SimpleEmptyStateProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center px-4 py-12', className)}>
      <Icon className="mb-3 h-12 w-12 text-neutral-400" />
      <p className="mb-1 text-sm font-medium text-neutral-900">{title}</p>
      {description && (
        <p className="max-w-xs text-center text-xs text-neutral-500">{description}</p>
      )}
    </div>
  )
}
