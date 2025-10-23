import * as React from 'react'
import Link from 'next/link'
import { ChevronRight, LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

interface BreadcrumbItem {
  label: string
  href?: string
}

interface PageHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string
  description?: string
  icon?: LucideIcon
  breadcrumbs?: BreadcrumbItem[]
  actions?: React.ReactNode
}

export function PageHeader({
  title,
  description,
  icon: Icon,
  breadcrumbs,
  actions,
  className,
  ...props
}: PageHeaderProps) {
  return (
    <div className={cn('bg-background flex flex-col gap-4 border-b pb-4', className)} {...props}>
      {breadcrumbs && breadcrumbs.length > 0 && (
        <nav className="text-muted-foreground flex items-center gap-2 text-sm">
          {breadcrumbs.map((item, index) => (
            <React.Fragment key={index}>
              {index > 0 && <ChevronRight className="h-4 w-4 shrink-0" />}
              {item.href ? (
                <Link href={item.href} className="hover:text-foreground transition-colors">
                  {item.label}
                </Link>
              ) : (
                <span className="text-foreground font-medium">{item.label}</span>
              )}
            </React.Fragment>
          ))}
        </nav>
      )}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-4">
          {Icon && (
            <div className="bg-primary/10 flex h-12 w-12 shrink-0 items-center justify-center rounded-lg">
              <Icon className="text-primary h-6 w-6" />
            </div>
          )}
          <div className="flex flex-col gap-1">
            <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
            {description && <p className="text-muted-foreground">{description}</p>}
          </div>
        </div>

        {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
      </div>
    </div>
  )
}

interface PageHeaderActionProps {
  children: React.ReactNode
}

export function PageHeaderActions({ children }: PageHeaderActionProps) {
  return <div className="flex flex-wrap items-center gap-2">{children}</div>
}
