import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { LucideIcon } from 'lucide-react'

interface StatsCardProps {
  title: string
  value: string | number
  subtitle?: string
  icon: LucideIcon
  gradient: 'blue' | 'green' | 'purple' | 'emerald' | 'orange' | 'pink' | 'red'
  trend?: {
    value: string
    isPositive?: boolean
  }
}

const gradientClasses = {
  blue: 'from-blue-500 to-blue-600',
  green: 'from-green-500 to-green-600',
  purple: 'from-purple-500 to-purple-600',
  emerald: 'from-emerald-500 to-emerald-600',
  orange: 'from-orange-500 to-orange-600',
  pink: 'from-pink-500 to-pink-600',
  red: 'from-red-500 to-red-600',
}

export function StatsCard({ title, value, subtitle, icon: Icon, gradient, trend }: StatsCardProps) {
  return (
    <Card className={`bg-gradient-to-br ${gradientClasses[gradient]} text-white`}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-2xl font-bold text-white">{value}</CardTitle>
            <p className="mt-1 text-sm text-white/80">{title}</p>
          </div>
          <Icon className="h-10 w-10 text-white/80" />
        </div>
      </CardHeader>
      {(subtitle || trend) && (
        <CardContent>
          <div className="flex items-center text-sm text-white/80">
            {subtitle && <span>{subtitle}</span>}
            {trend && <span>{trend.value}</span>}
          </div>
        </CardContent>
      )}
    </Card>
  )
}
