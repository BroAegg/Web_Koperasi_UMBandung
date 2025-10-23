'use client'

import { useState, useMemo } from 'react'
import { trpc } from '@/lib/trpc'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Activity,
  Filter,
  Clock,
  User,
  Plus,
  Edit,
  Trash2,
  LogIn,
  LogOut,
  ShoppingCart,
  Package,
  Users,
  DollarSign,
  Truck,
  Calendar,
} from 'lucide-react'

export default function ActivityPage() {
  const [moduleFilter, setModuleFilter] = useState('')
  const [actionFilter, setActionFilter] = useState('')

  const { data: logsData } = trpc.activity.getActivityLogs.useQuery({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    module: (moduleFilter || undefined) as any,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    action: (actionFilter || undefined) as any,
    page: 1,
    limit: 100,
  })

  const { data: stats } = trpc.activity.getActivityStats.useQuery()

  // Group logs by time periods
  const groupedLogs = useMemo(() => {
    if (!logsData?.logs) return {}

    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)
    const thisWeek = new Date(today)
    thisWeek.setDate(thisWeek.getDate() - 7)

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const groups: Record<string, any[]> = {
      'Hari Ini': [],
      Kemarin: [],
      'Minggu Ini': [],
      'Lebih Lama': [],
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    logsData.logs.forEach((log: any) => {
      const logDate = new Date(log.created_at)
      if (logDate >= today) {
        groups['Hari Ini'].push(log)
      } else if (logDate >= yesterday) {
        groups['Kemarin'].push(log)
      } else if (logDate >= thisWeek) {
        groups['Minggu Ini'].push(log)
      } else {
        groups['Lebih Lama'].push(log)
      }
    })

    return groups
  }, [logsData])

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'CREATE':
        return Plus
      case 'UPDATE':
        return Edit
      case 'DELETE':
        return Trash2
      case 'LOGIN':
        return LogIn
      case 'LOGOUT':
        return LogOut
      default:
        return Activity
    }
  }

  const getActionColor = (action: string) => {
    switch (action) {
      case 'CREATE':
        return {
          bg: 'bg-green-500',
          text: 'text-green-700',
          light: 'bg-green-50',
          ring: 'ring-green-200',
        }
      case 'UPDATE':
        return {
          bg: 'bg-blue-500',
          text: 'text-blue-700',
          light: 'bg-blue-50',
          ring: 'ring-blue-200',
        }
      case 'DELETE':
        return { bg: 'bg-red-500', text: 'text-red-700', light: 'bg-red-50', ring: 'ring-red-200' }
      case 'LOGIN':
        return {
          bg: 'bg-purple-500',
          text: 'text-purple-700',
          light: 'bg-purple-50',
          ring: 'ring-purple-200',
        }
      case 'LOGOUT':
        return {
          bg: 'bg-gray-500',
          text: 'text-gray-700',
          light: 'bg-gray-50',
          ring: 'ring-gray-200',
        }
      default:
        return {
          bg: 'bg-gray-500',
          text: 'text-gray-700',
          light: 'bg-gray-50',
          ring: 'ring-gray-200',
        }
    }
  }

  const getModuleIcon = (module: string) => {
    switch (module) {
      case 'AUTH':
        return User
      case 'FINANCIAL':
        return DollarSign
      case 'POS':
        return ShoppingCart
      case 'INVENTORY':
        return Package
      case 'SUPPLIER':
        return Truck
      case 'MEMBER':
        return Users
      default:
        return Activity
    }
  }

  const getModuleColor = (module: string) => {
    const colors: Record<string, string> = {
      AUTH: 'bg-purple-100 text-purple-700 border-purple-200',
      FINANCIAL: 'bg-green-100 text-green-700 border-green-200',
      POS: 'bg-blue-100 text-blue-700 border-blue-200',
      INVENTORY: 'bg-yellow-100 text-yellow-700 border-yellow-200',
      SUPPLIER: 'bg-orange-100 text-orange-700 border-orange-200',
      MEMBER: 'bg-pink-100 text-pink-700 border-pink-200',
    }
    return colors[module] || 'bg-gray-100 text-gray-700 border-gray-200'
  }

  // Get user initials for avatar
  const getUserInitials = (fullName: string) => {
    const names = fullName.split(' ')
    if (names.length >= 2) {
      return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase()
    }
    return fullName.slice(0, 2).toUpperCase()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Log Aktivitas</h1>
          <p className="mt-1 text-sm text-gray-600">Timeline aktivitas sistem dan pengguna</p>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <Card className="border-2 border-indigo-200 bg-gradient-to-br from-indigo-50 to-purple-50">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-semibold text-indigo-700">Total Aktivitas</CardTitle>
            <div className="rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 p-2">
              <Activity className="h-5 w-5 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-indigo-700">{stats?.totalLogs || 0}</div>
            <p className="mt-1 text-xs font-medium text-indigo-600">Total Log Tercatat</p>
          </CardContent>
        </Card>

        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
        {stats?.moduleStats.slice(0, 3).map((stat: any) => {
          const ModuleIcon = getModuleIcon(stat.module)
          return (
            <Card
              key={stat.module}
              className="border-l-4 shadow-sm transition-shadow hover:shadow-md"
              style={{
                borderLeftColor: getModuleColor(stat.module).includes('purple')
                  ? '#9333ea'
                  : getModuleColor(stat.module).includes('green')
                    ? '#16a34a'
                    : getModuleColor(stat.module).includes('blue')
                      ? '#2563eb'
                      : '#6b7280',
              }}
            >
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-semibold text-gray-700">{stat.module}</CardTitle>
                <div className={`rounded-full p-2 ${getModuleColor(stat.module).split(' ')[0]}`}>
                  <ModuleIcon className="h-5 w-5" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">{stat.count}</div>
                <p className="mt-1 text-xs font-medium text-gray-600">Log Aktivitas</p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="flex flex-1 items-center gap-2">
          <Filter className="h-5 w-5 text-gray-400" />
          <select
            value={moduleFilter}
            onChange={(e) => setModuleFilter(e.target.value)}
            className="flex-1 rounded-lg border-2 px-4 py-2.5 font-medium focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          >
            <option value="">📋 Semua Modul</option>
            <option value="AUTH">🔐 AUTH</option>
            <option value="FINANCIAL">💰 FINANCIAL</option>
            <option value="POS">🛒 POS</option>
            <option value="INVENTORY">📦 INVENTORY</option>
            <option value="SUPPLIER">🚚 SUPPLIER</option>
            <option value="MEMBER">👥 MEMBER</option>
          </select>
        </div>

        <select
          value={actionFilter}
          onChange={(e) => setActionFilter(e.target.value)}
          className="rounded-lg border-2 px-4 py-2.5 font-medium focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
        >
          <option value="">⚡ Semua Aksi</option>
          <option value="CREATE">➕ CREATE</option>
          <option value="UPDATE">✏️ UPDATE</option>
          <option value="DELETE">🗑️ DELETE</option>
          <option value="LOGIN">🔓 LOGIN</option>
          <option value="LOGOUT">🔒 LOGOUT</option>
        </select>
      </div>

      {/* Activity Timeline */}
      <div className="space-y-8">
        {Object.entries(groupedLogs).map(([period, logs]) => {
          if (logs.length === 0) return null

          return (
            <div key={period}>
              {/* Period Header */}
              <div className="mb-4 flex items-center gap-3">
                <div className="rounded-lg bg-indigo-100 p-2">
                  <Calendar className="h-5 w-5 text-indigo-600" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">{period}</h2>
                  <p className="text-sm text-gray-600">{logs.length} aktivitas</p>
                </div>
              </div>

              {/* Timeline */}
              <div className="relative ml-6 space-y-6 border-l-2 border-gray-200 pl-8">
                {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                {logs.map((log: any) => {
                  const ActionIcon = getActionIcon(log.action)
                  const actionColors = getActionColor(log.action)
                  const ModuleIcon = getModuleIcon(log.module)

                  return (
                    <div key={log.id} className="group relative">
                      {/* Timeline Dot */}
                      <div
                        className={`absolute -left-[2.4rem] flex h-12 w-12 items-center justify-center rounded-full ${actionColors.bg} ring-4 ${actionColors.ring} transition-all group-hover:scale-110`}
                      >
                        <ActionIcon className="h-6 w-6 text-white" />
                      </div>

                      {/* Activity Card */}
                      <Card className="transition-all hover:scale-[1.01] hover:shadow-lg">
                        <CardContent className="p-5">
                          <div className="flex items-start justify-between gap-4">
                            {/* Left Side: User & Action Info */}
                            <div className="flex flex-1 gap-4">
                              {/* User Avatar */}
                              <div className="flex-shrink-0">
                                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 text-sm font-bold text-white ring-2 ring-indigo-200">
                                  {getUserInitials(log.user.full_name)}
                                </div>
                              </div>

                              {/* Activity Details */}
                              <div className="min-w-0 flex-1">
                                <div className="mb-2 flex flex-wrap items-center gap-2">
                                  <span className="font-bold text-gray-900">
                                    {log.user.full_name}
                                  </span>
                                  <span className="text-sm text-gray-500">
                                    @{log.user.username}
                                  </span>
                                  <span
                                    className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-semibold ${getModuleColor(log.module)}`}
                                  >
                                    <ModuleIcon className="h-3 w-3" />
                                    {log.module}
                                  </span>
                                </div>

                                <p className="mb-2 text-sm text-gray-700">{log.description}</p>

                                <div className="flex items-center gap-2 text-xs text-gray-500">
                                  <Clock className="h-3 w-3" />
                                  {new Date(log.created_at).toLocaleString('id-ID', {
                                    day: '2-digit',
                                    month: 'short',
                                    year: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit',
                                  })}
                                </div>
                              </div>
                            </div>

                            {/* Right Side: Action Badge */}
                            <div className="flex-shrink-0">
                              <div
                                className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-semibold ${actionColors.light} ${actionColors.text}`}
                              >
                                <ActionIcon className="h-4 w-4" />
                                {log.action}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  )
                })}
              </div>
            </div>
          )
        })}

        {/* Empty State */}
        {logsData?.logs.length === 0 && (
          <Card className="py-16">
            <CardContent className="text-center">
              <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gray-100">
                <Activity className="h-10 w-10 text-gray-400" />
              </div>
              <h3 className="mb-2 text-lg font-semibold text-gray-900">Belum Ada Aktivitas</h3>
              <p className="text-sm text-gray-600">
                Log aktivitas akan muncul di sini ketika ada aktivitas sistem
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
