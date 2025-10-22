'use client'

import { useState } from 'react'
import { trpc } from '@/lib/trpc'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Search, Activity, Filter } from 'lucide-react'

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

  const getActionColor = (action: string) => {
    switch (action) {
      case 'CREATE':
        return 'bg-green-100 text-green-700'
      case 'UPDATE':
        return 'bg-blue-100 text-blue-700'
      case 'DELETE':
        return 'bg-red-100 text-red-700'
      case 'LOGIN':
        return 'bg-purple-100 text-purple-700'
      case 'LOGOUT':
        return 'bg-gray-100 text-gray-700'
      default:
        return 'bg-gray-100 text-gray-700'
    }
  }

  const getModuleColor = (module: string) => {
    const colors: Record<string, string> = {
      AUTH: 'bg-purple-100 text-purple-700',
      FINANCIAL: 'bg-green-100 text-green-700',
      POS: 'bg-blue-100 text-blue-700',
      INVENTORY: 'bg-yellow-100 text-yellow-700',
      SUPPLIER: 'bg-orange-100 text-orange-700',
      MEMBER: 'bg-pink-100 text-pink-700',
    }
    return colors[module] || 'bg-gray-100 text-gray-700'
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Log Aktivitas</h1>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Aktivitas</CardTitle>
            <Activity className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalLogs || 0}</div>
            <p className="mt-1 text-xs text-gray-500">Total Log</p>
          </CardContent>
        </Card>

        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
        {stats?.moduleStats.slice(0, 3).map((stat: any) => (
          <Card key={stat.module}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">{stat.module}</CardTitle>
              <Filter className="h-4 w-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.count}</div>
              <p className="mt-1 text-xs text-gray-500">Aktivitas</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <div className="flex gap-4">
        <select
          value={moduleFilter}
          onChange={(e) => setModuleFilter(e.target.value)}
          className="rounded-lg border px-4 py-2 focus:ring-2 focus:ring-green-500 focus:outline-none"
        >
          <option value="">Semua Modul</option>
          <option value="AUTH">AUTH</option>
          <option value="FINANCIAL">FINANCIAL</option>
          <option value="POS">POS</option>
          <option value="INVENTORY">INVENTORY</option>
          <option value="SUPPLIER">SUPPLIER</option>
          <option value="MEMBER">MEMBER</option>
        </select>

        <select
          value={actionFilter}
          onChange={(e) => setActionFilter(e.target.value)}
          className="rounded-lg border px-4 py-2 focus:ring-2 focus:ring-green-500 focus:outline-none"
        >
          <option value="">Semua Aksi</option>
          <option value="CREATE">CREATE</option>
          <option value="UPDATE">UPDATE</option>
          <option value="DELETE">DELETE</option>
          <option value="LOGIN">LOGIN</option>
          <option value="LOGOUT">LOGOUT</option>
        </select>
      </div>

      {/* Activity Logs Table */}
      <Card>
        <CardHeader>
          <CardTitle>Riwayat Aktivitas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="px-4 py-3 text-left">Waktu</th>
                  <th className="px-4 py-3 text-left">Pengguna</th>
                  <th className="px-4 py-3 text-left">Modul</th>
                  <th className="px-4 py-3 text-left">Aksi</th>
                  <th className="px-4 py-3 text-left">Deskripsi</th>
                </tr>
              </thead>
              <tbody>
                {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                {logsData?.logs.map((log: any) => (
                  <tr key={log.id} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm">
                      {new Date(log.created_at).toLocaleString('id-ID', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </td>
                    <td className="px-4 py-3">
                      <div>
                        <p className="font-medium">{log.user.full_name}</p>
                        <p className="text-xs text-gray-500">@{log.user.username}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${getModuleColor(log.module)}`}
                      >
                        {log.module}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${getActionColor(log.action)}`}
                      >
                        {log.action}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm">{log.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {logsData?.logs.length === 0 && (
            <div className="py-8 text-center text-gray-400">
              <Activity className="mx-auto mb-2 h-12 w-12" />
              <p>Belum ada aktivitas</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
