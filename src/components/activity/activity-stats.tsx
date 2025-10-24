'use client'

import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Activity, Users, FileText, TrendingUp } from 'lucide-react'
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'

interface ActivityStatsProps {
  data?: {
    totalLogs: number
    moduleStats: Array<{ module: string; count: number }>
    actionStats: Array<{ action: string; count: number }>
    recentUsers: Array<{
      id: string
      username: string
      full_name: string
      role: string
    }>
  }
}

const MODULE_COLORS: Record<string, string> = {
  AUTH: '#9333ea',
  FINANCIAL: '#22c55e',
  POS: '#3b82f6',
  INVENTORY: '#f97316',
  SUPPLIER: '#06b6d4',
  MEMBER: '#ec4899',
}

const ACTION_COLORS: Record<string, string> = {
  CREATE: '#22c55e',
  UPDATE: '#3b82f6',
  DELETE: '#ef4444',
  LOGIN: '#9333ea',
  LOGOUT: '#6b7280',
}

export function ActivityStats({ data }: ActivityStatsProps) {
  if (!data) {
    return (
      <Card className="p-8">
        <div className="text-muted-foreground text-center">Memuat statistik...</div>
      </Card>
    )
  }

  const modulePieData = data.moduleStats.map((stat) => ({
    name: stat.module,
    value: stat.count,
    color: MODULE_COLORS[stat.module] || '#6b7280',
  }))

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="p-6">
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-blue-500" />
            <div className="flex-1">
              <p className="text-muted-foreground text-sm">Total Logs</p>
              <p className="text-2xl font-bold">{data.totalLogs.toLocaleString('id-ID')}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-green-500" />
            <div className="flex-1">
              <p className="text-muted-foreground text-sm">Total Modul</p>
              <p className="text-2xl font-bold">{data.moduleStats.length}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-purple-500" />
            <div className="flex-1">
              <p className="text-muted-foreground text-sm">Total Aksi</p>
              <p className="text-2xl font-bold">{data.actionStats.length}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-orange-500" />
            <div className="flex-1">
              <p className="text-muted-foreground text-sm">Pengguna Aktif</p>
              <p className="text-2xl font-bold">{data.recentUsers.length}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Module Distribution */}
        <Card className="p-6">
          <h3 className="mb-4 text-lg font-semibold">Distribusi per Modul</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={modulePieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                label={(entry: any) => `${entry.name}: ${entry.value}`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {modulePieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Card>

        {/* Action Distribution */}
        <Card className="p-6">
          <h3 className="mb-4 text-lg font-semibold">Distribusi per Aksi</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data.actionStats}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="action" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" name="Jumlah" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Recent Active Users */}
      <Card className="p-6">
        <h3 className="mb-4 text-lg font-semibold">Pengguna Aktif Terakhir</h3>
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {data.recentUsers.map((user) => (
            <div key={user.id} className="flex items-center gap-3 rounded-lg border p-3">
              <Avatar>
                <AvatarFallback>
                  {user.full_name
                    .split(' ')
                    .map((n) => n[0])
                    .join('')
                    .toUpperCase()
                    .slice(0, 2)}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium">{user.full_name}</p>
                <p className="text-muted-foreground truncate text-sm">@{user.username}</p>
              </div>
              <Badge variant="outline">{user.role}</Badge>
            </div>
          ))}
        </div>
      </Card>

      {/* Module Stats Table */}
      <Card className="p-6">
        <h3 className="mb-4 text-lg font-semibold">Detail per Modul</h3>
        <div className="space-y-2">
          {data.moduleStats.map((stat) => (
            <div key={stat.module} className="flex items-center justify-between border-b py-2">
              <div className="flex items-center gap-2">
                <div
                  className="h-3 w-3 rounded-full"
                  style={{ backgroundColor: MODULE_COLORS[stat.module] || '#6b7280' }}
                />
                <span className="font-medium">{stat.module}</span>
              </div>
              <span className="text-muted-foreground">
                {stat.count.toLocaleString('id-ID')} logs
              </span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
