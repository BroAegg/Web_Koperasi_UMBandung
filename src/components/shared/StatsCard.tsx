import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react'
import { cn } from '@/lib/utils'

type GradientVariant = 'blue' | 'green' | 'purple' | 'emerald' | 'orange' | 'pink' | 'red'

interface StatsCardProps {
  title: string
  value: string | number
  subtitle?: string
  icon: LucideIcon
  gradient: GradientVariant
  trend?: {
    value: string
    isPositive?: boolean
  }
  className?: string
}

const gradientClasses: Record<GradientVariant, string> = {
  blue: 'from-blue-500 to-blue-600',
  green: 'from-green-500 to-green-600',
  purple: 'from-purple-500 to-purple-600',
  emerald: 'from-emerald-500 to-emerald-600',
  orange: 'from-orange-500 to-orange-600',
  pink: 'from-pink-500 to-pink-600',
  red: 'from-red-500 to-red-600',
}

const textColorClasses: Record<GradientVariant, string> = {
  blue: 'text-blue-100',
  green: 'text-green-100',
  purple: 'text-purple-100',
  emerald: 'text-emerald-100',
  orange: 'text-orange-100',
  pink: 'text-pink-100',
  red: 'text-red-100',
}

export function StatsCard({
  title,
  value,
  subtitle,
  icon: Icon,
  gradient,
  trend,
  className,
}: StatsCardProps) {
  return (
    <Card
      className={cn(
        'border-0 bg-linear-to-br text-white shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl',
        gradientClasses[gradient],
        className
      )}
    >
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <CardTitle className="mb-1 text-2xl font-bold text-white">{value}</CardTitle>
            <p className={cn('text-sm font-medium', textColorClasses[gradient])}>{title}</p>
            {subtitle && (
              <p className={cn('mt-1 text-xs opacity-90', textColorClasses[gradient])}>
                {subtitle}
              </p>
            )}
          </div>
          <div className="ml-4">
            <Icon className="h-10 w-10 text-white/80" />
          </div>
        </div>
      </CardHeader>

      {trend && (
        <CardContent className="pt-0">
          <div className={cn('flex items-center text-sm font-medium', textColorClasses[gradient])}>
            {trend.isPositive ? (
              <TrendingUp className="mr-1 h-4 w-4" />
            ) : (
              <TrendingDown className="mr-1 h-4 w-4" />
            )}
            <span>{trend.value}</span>
          </div>
        </CardContent>
      )}
    </Card>
  )
}
