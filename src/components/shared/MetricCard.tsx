import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { LucideIcon } from 'lucide-react'

interface MetricCardProps {
  title: string
  value: string | number
  subtitle: string
  icon: LucideIcon
  variant: 'green' | 'red' | 'blue' | 'purple' | 'orange'
}

const variantClasses = {
  green: {
    border: 'border-green-200',
    icon: 'text-green-500',
    value: 'text-green-600',
  },
  red: {
    border: 'border-red-200',
    icon: 'text-red-500',
    value: 'text-red-600',
  },
  blue: {
    border: 'border-blue-200',
    icon: 'text-blue-500',
    value: 'text-blue-600',
  },
  purple: {
    border: 'border-purple-200',
    icon: 'text-purple-500',
    value: 'text-purple-600',
  },
  orange: {
    border: 'border-orange-200',
    icon: 'text-orange-500',
    value: 'text-orange-600',
  },
}

export function MetricCard({ title, value, subtitle, icon: Icon, variant }: MetricCardProps) {
  const classes = variantClasses[variant]

  return (
    <Card className={`border-2 bg-white ${classes.border}`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium text-gray-700">{title}</CardTitle>
          <Icon className={`h-5 w-5 ${classes.icon}`} />
        </div>
      </CardHeader>
      <CardContent>
        <div className={`text-2xl font-bold ${classes.value}`}>{value}</div>
        <p className="mt-1 text-xs text-gray-500">{subtitle}</p>
      </CardContent>
    </Card>
  )
}
