import { LucideIcon } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { Skeleton } from '@/components/ui/skeleton'

interface MetricsCardProps {
  title: string
  value: string | number
  icon: LucideIcon
  description?: string
  trend?: {
    value: number
    isPositive: boolean
  }
  colorClass?: string
  loading?: boolean
}

export function MetricsCard({
  title,
  value,
  icon: Icon,
  description,
  trend,
  colorClass = 'text-primary',
  loading = false,
}: MetricsCardProps) {
  if (loading) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-8 w-8 rounded-md" />
        </CardHeader>
        <CardContent>
          <Skeleton className="mb-2 h-8 w-32" />
          <Skeleton className="h-3 w-full" />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card hover className="group hover:border-l-primary border-l-4 border-l-transparent">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div
          className={cn(
            'rounded-lg p-2.5 transition-all duration-200 group-hover:scale-110 group-hover:shadow-lg',
            colorClass,
            'from-primary/10 to-primary/5 bg-gradient-to-br'
          )}
        >
          <Icon className="h-5 w-5" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="from-primary bg-gradient-to-r to-orange-600 bg-clip-text text-3xl font-bold text-transparent transition-all duration-200">
          {value}
        </div>
        {description && <p className="text-muted-foreground mt-1.5 text-xs">{description}</p>}
        {trend && (
          <div className="mt-2 flex items-center gap-1">
            <div
              className={cn(
                'flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold',
                trend.isPositive
                  ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                  : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
              )}
            >
              <span>{trend.isPositive ? '↑' : '↓'}</span>
              <span>{Math.abs(trend.value)}%</span>
            </div>
            <span className="text-muted-foreground text-xs">vs last month</span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
