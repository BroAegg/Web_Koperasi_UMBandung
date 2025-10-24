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
  colorClass = 'text-orange-500',
  loading = false,
}: MetricsCardProps) {
  if (loading) {
    return (
      <Card>
        <CardContent className="p-5">
          <Skeleton className="mb-1 h-3 w-24" />
          <Skeleton className="mt-1 mb-1 h-8 w-32" />
          <Skeleton className="h-3 w-20" />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardContent className="p-5">
        {/* Title - snippet style */}
        <p className="text-xs font-semibold text-gray-500 dark:text-slate-300">{title}</p>

        {/* Value - snippet style: text-2xl, semibold */}
        <p className="mt-1 text-2xl font-semibold text-gray-900 dark:text-slate-100">{value}</p>

        {/* Delta - snippet style: simple text-xs with green/red */}
        {trend && (
          <p
            className={cn(
              'mt-1 text-xs',
              trend.isPositive
                ? 'text-green-500 dark:text-green-400'
                : 'text-red-500 dark:text-red-400'
            )}
          >
            {trend.isPositive ? '+' : ''}
            {trend.value}% vs last month
          </p>
        )}
      </CardContent>
    </Card>
  )
}
