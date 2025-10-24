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
      <Card className="border-border/50 from-background to-muted/20 border-2 bg-gradient-to-br">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-12 w-12 rounded-xl" />
        </CardHeader>
        <CardContent>
          <Skeleton className="mb-3 h-10 w-36" />
          <Skeleton className="h-3 w-full" />
          <Skeleton className="mt-3 h-6 w-24 rounded-full" />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card
      hover
      className="group border-border/50 from-background to-muted/20 hover:border-primary/50 hover:shadow-primary/10 relative overflow-hidden border-2 bg-gradient-to-br transition-all duration-300 hover:shadow-2xl"
    >
      {/* Subtle gradient overlay on hover */}
      <div className="from-primary/0 to-primary/0 group-hover:from-primary/5 pointer-events-none absolute inset-0 bg-gradient-to-br opacity-0 transition-opacity duration-300 group-hover:to-orange-500/5 group-hover:opacity-100" />

      <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-3">
        <CardTitle className="text-muted-foreground text-sm font-semibold tracking-wide uppercase">
          {title}
        </CardTitle>
        <div
          className={cn(
            'rounded-xl p-3 shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:shadow-xl',
            'from-primary/20 bg-gradient-to-br to-orange-500/20',
            colorClass
          )}
        >
          <Icon className="h-6 w-6" />
        </div>
      </CardHeader>
      <CardContent className="relative">
        <div className="text-foreground group-hover:text-primary mb-2 text-4xl font-extrabold tracking-tight transition-all duration-300 group-hover:scale-105">
          {value}
        </div>
        {description && (
          <p className="text-muted-foreground/80 text-xs font-medium">{description}</p>
        )}
        {trend && (
          <div className="mt-3 flex items-center gap-2">
            <div
              className={cn(
                'flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold shadow-sm',
                trend.isPositive
                  ? 'bg-green-500/20 text-green-700 dark:bg-green-500/30 dark:text-green-300'
                  : 'bg-red-500/20 text-red-700 dark:bg-red-500/30 dark:text-red-300'
              )}
            >
              <span className="text-base">{trend.isPositive ? '↑' : '↓'}</span>
              <span>{Math.abs(trend.value)}%</span>
            </div>
            <span className="text-muted-foreground/60 text-xs font-medium">vs last month</span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
