'use client'

import { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Skeleton } from '@/components/ui/skeleton'
import { useTheme } from '@/contexts/theme-context'

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

export function MetricsCard({ title, value, trend, loading = false }: MetricsCardProps) {
  const { theme } = useTheme()

  if (loading) {
    return (
      <div className={`rounded-2xl border p-5 shadow-sm ${theme.card}`}>
        <Skeleton className="mb-1 h-3 w-24" />
        <Skeleton className="mt-1 mb-1 h-8 w-32" />
        <Skeleton className="h-3 w-20" />
      </div>
    )
  }

  return (
    <div className={`rounded-2xl border shadow-sm ${theme.card}`}>
      <div className="p-5">
        {/* Title - snippet style */}
        <p className={`text-xs font-semibold ${theme.kpiTitleText}`}>{title}</p>

        {/* Value - snippet style: text-2xl, semibold */}
        <p className={`mt-1 text-2xl font-semibold ${theme.valueText}`}>{value}</p>

        {/* Delta - snippet style: simple text-xs with green/red */}
        {trend && (
          <p className={cn('mt-1 text-xs', trend.isPositive ? 'text-green-500' : 'text-red-500')}>
            {trend.isPositive ? '+' : ''}
            {trend.value}% vs last month
          </p>
        )}
      </div>
    </div>
  )
}
