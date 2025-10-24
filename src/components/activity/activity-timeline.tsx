'use client'

import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Clock } from 'lucide-react'
import { format } from 'date-fns'
import { id } from 'date-fns/locale'

interface ActivityLog {
  id: string
  module: string
  action: string
  description: string
  created_at: Date
  user: {
    id: string
    username: string
    full_name: string
    role: string
  }
}

interface ActivityTimelineProps {
  data?: {
    logs: ActivityLog[]
    pagination: {
      total: number
      page: number
      limit: number
      totalPages: number
      hasMore: boolean
    }
  }
  isLoading: boolean
}

const getActionColor = (action: string) => {
  switch (action) {
    case 'CREATE':
      return 'bg-green-500'
    case 'UPDATE':
      return 'bg-blue-500'
    case 'DELETE':
      return 'bg-red-500'
    case 'LOGIN':
      return 'bg-purple-500'
    case 'LOGOUT':
      return 'bg-gray-500'
    default:
      return 'bg-gray-500'
  }
}

const getActionBadgeVariant = (action: string) => {
  switch (action) {
    case 'CREATE':
      return 'default'
    case 'UPDATE':
      return 'secondary'
    case 'DELETE':
      return 'destructive'
    default:
      return 'outline'
  }
}

const getModuleColor = (module: string) => {
  switch (module) {
    case 'AUTH':
      return 'text-purple-600'
    case 'FINANCIAL':
      return 'text-green-600'
    case 'POS':
      return 'text-blue-600'
    case 'INVENTORY':
      return 'text-orange-600'
    case 'SUPPLIER':
      return 'text-cyan-600'
    case 'MEMBER':
      return 'text-pink-600'
    default:
      return 'text-gray-600'
  }
}

export function ActivityTimeline({ data, isLoading }: ActivityTimelineProps) {
  if (isLoading) {
    return (
      <Card className="p-8">
        <div className="text-muted-foreground text-center">Memuat activity logs...</div>
      </Card>
    )
  }

  if (!data || data.logs.length === 0) {
    return (
      <Card className="p-8">
        <div className="text-muted-foreground text-center">
          Tidak ada activity logs yang ditemukan
        </div>
      </Card>
    )
  }

  return (
    <Card className="p-6">
      <div className="space-y-4">
        {data.logs.map((log, index) => (
          <div key={log.id} className="relative flex gap-4">
            {/* Timeline connector */}
            {index !== data.logs.length - 1 && (
              <div className="bg-border absolute top-12 bottom-0 left-5 w-px" />
            )}

            {/* Action indicator */}
            <div
              className={`h-10 w-10 rounded-full ${getActionColor(log.action)} flex shrink-0 items-center justify-center`}
            >
              <div className="h-3 w-3 rounded-full bg-white" />
            </div>

            {/* Content */}
            <div className="flex-1 space-y-2 pb-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="mb-1 flex items-center gap-2">
                    {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                    <Badge variant={getActionBadgeVariant(log.action) as any}>{log.action}</Badge>
                    <span className={`text-sm font-semibold ${getModuleColor(log.module)}`}>
                      {log.module}
                    </span>
                  </div>
                  <p className="text-foreground text-sm">{log.description}</p>
                </div>

                <div className="text-muted-foreground text-right text-sm whitespace-nowrap">
                  <div className="flex items-center justify-end gap-1">
                    <Clock className="h-3 w-3" />
                    {format(new Date(log.created_at), 'dd MMM yyyy, HH:mm', { locale: id })}
                  </div>
                </div>
              </div>

              {/* User info */}
              <div className="flex items-center gap-2 text-sm">
                <Avatar className="h-6 w-6">
                  <AvatarFallback className="text-xs">
                    {log.user.full_name
                      .split(' ')
                      .map((n) => n[0])
                      .join('')
                      .toUpperCase()
                      .slice(0, 2)}
                  </AvatarFallback>
                </Avatar>
                <span className="text-muted-foreground">
                  {log.user.full_name} ({log.user.username})
                </span>
                <Badge variant="outline" className="text-xs">
                  {log.user.role}
                </Badge>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}
