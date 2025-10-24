import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Skeleton } from '@/components/ui/skeleton'
import {
  DollarSign,
  Package,
  ShoppingCart,
  Users,
  FileText,
  TrendingUp,
  TrendingDown,
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface Activity {
  id: string
  user: string
  action: string
  module: string
  description: string
  timestamp: string
  type: 'success' | 'warning' | 'info' | 'error'
}

interface RecentActivityProps {
  activities?: Activity[]
  loading?: boolean
}

const iconMap: Record<string, typeof DollarSign> = {
  KEUANGAN: DollarSign,
  INVENTORI: Package,
  POS: ShoppingCart,
  ANGGOTA: Users,
  LAPORAN: FileText,
  PEMASUKAN: TrendingUp,
  PENGELUARAN: TrendingDown,
}

const typeColorMap = {
  success: 'bg-green-100 dark:bg-green-900/20 border-green-200 dark:border-green-800',
  warning: 'bg-yellow-100 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800',
  info: 'bg-blue-100 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800',
  error: 'bg-red-100 dark:bg-red-900/20 border-red-200 dark:border-red-800',
}

export function RecentActivity({ activities, loading = false }: RecentActivityProps) {
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="mb-2 h-5 w-32" />
          <Skeleton className="h-4 w-48" />
        </CardHeader>
        <CardContent className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-start gap-3">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    )
  }

  // Default activities if none provided
  const defaultActivities: Activity[] = [
    {
      id: '1',
      user: 'Developer',
      action: 'Created transaction',
      module: 'KEUANGAN',
      description: 'Transaksi pemasukan sebesar Rp 5,000,000',
      timestamp: '2 minutes ago',
      type: 'success',
    },
    {
      id: '2',
      user: 'Admin',
      action: 'Updated product',
      module: 'INVENTORI',
      description: 'Updated stock for Mie Instan to 150 units',
      timestamp: '15 minutes ago',
      type: 'info',
    },
    {
      id: '3',
      user: 'Kasir',
      action: 'Completed sale',
      module: 'POS',
      description: 'Sale of 5 items worth Rp 125,000',
      timestamp: '1 hour ago',
      type: 'success',
    },
    {
      id: '4',
      user: 'Admin',
      action: 'New member registered',
      module: 'ANGGOTA',
      description: 'Member M-2024-006 has been registered',
      timestamp: '2 hours ago',
      type: 'info',
    },
    {
      id: '5',
      user: 'Developer',
      action: 'Generated report',
      module: 'LAPORAN',
      description: 'Monthly financial report for May 2024',
      timestamp: '3 hours ago',
      type: 'info',
    },
  ]

  const displayActivities = activities || defaultActivities

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  const getIcon = (module: string) => {
    const Icon = iconMap[module] || FileText
    return Icon
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
        <CardDescription>Latest actions in the system</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {displayActivities.map((activity) => {
            const Icon = getIcon(activity.module)
            return (
              <div key={activity.id} className="flex items-start gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarFallback className="text-xs">{getInitials(activity.user)}</AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <p className="text-sm leading-none font-medium">{activity.user}</p>
                    <div
                      className={cn(
                        'flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium',
                        typeColorMap[activity.type]
                      )}
                    >
                      <Icon className="h-3 w-3" />
                      <span>{activity.module}</span>
                    </div>
                  </div>
                  <p className="text-muted-foreground text-sm">{activity.description}</p>
                  <p className="text-muted-foreground text-xs">{activity.timestamp}</p>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
