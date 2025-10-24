'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Activity, Search, CalendarIcon, TrendingUp, FileText } from 'lucide-react'
import { format } from 'date-fns'
import { id } from 'date-fns/locale'
import { trpc } from '@/lib/trpc'
import { ActivityTimeline } from './activity-timeline'
import { ActivityStats } from './activity-stats'
import { ActivityChart } from './activity-chart'

export function ActivityLogsContent() {
  const [filters, setFilters] = useState({
    module: 'all',
    action: 'all',
    userId: '',
    dateRange: {
      from: undefined as Date | undefined,
      to: undefined as Date | undefined,
    },
    page: 1,
  })

  const { data: logsData, isLoading } = trpc.activity.getActivityLogs.useQuery({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    module: filters.module === 'all' ? undefined : (filters.module as any),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    action: filters.action === 'all' ? undefined : (filters.action as any),
    userId: filters.userId || undefined,
    startDate: filters.dateRange.from,
    endDate: filters.dateRange.to,
    page: filters.page,
    limit: 20,
  })

  const { data: stats } = trpc.activity.getActivityStats.useQuery()

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleFilterChange = (key: string, value: any) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
      page: 1, // Reset to first page when filters change
    }))
  }

  const resetFilters = () => {
    setFilters({
      module: 'all',
      action: 'all',
      userId: '',
      dateRange: {
        from: undefined,
        to: undefined,
      },
      page: 1,
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Activity Logs</h1>
          <p className="text-muted-foreground">Monitor semua aktivitas pengguna dalam sistem</p>
        </div>
        <Button variant="outline" onClick={resetFilters}>
          Reset Filter
        </Button>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="logs" className="space-y-4">
        <TabsList>
          <TabsTrigger value="logs" className="gap-2">
            <FileText className="h-4 w-4" />
            Logs
          </TabsTrigger>
          <TabsTrigger value="stats" className="gap-2">
            <TrendingUp className="h-4 w-4" />
            Statistik
          </TabsTrigger>
          <TabsTrigger value="trends" className="gap-2">
            <Activity className="h-4 w-4" />
            Tren
          </TabsTrigger>
        </TabsList>

        {/* Logs Tab */}
        <TabsContent value="logs" className="space-y-4">
          {/* Filters */}
          <Card className="p-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
              {/* Module Filter */}
              <Select
                value={filters.module}
                onValueChange={(value) => handleFilterChange('module', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Semua Modul" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Modul</SelectItem>
                  <SelectItem value="AUTH">Auth</SelectItem>
                  <SelectItem value="FINANCIAL">Financial</SelectItem>
                  <SelectItem value="POS">POS</SelectItem>
                  <SelectItem value="INVENTORY">Inventory</SelectItem>
                  <SelectItem value="SUPPLIER">Supplier</SelectItem>
                  <SelectItem value="MEMBER">Member</SelectItem>
                </SelectContent>
              </Select>

              {/* Action Filter */}
              <Select
                value={filters.action}
                onValueChange={(value) => handleFilterChange('action', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Semua Aksi" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Aksi</SelectItem>
                  <SelectItem value="CREATE">Create</SelectItem>
                  <SelectItem value="UPDATE">Update</SelectItem>
                  <SelectItem value="DELETE">Delete</SelectItem>
                  <SelectItem value="LOGIN">Login</SelectItem>
                  <SelectItem value="LOGOUT">Logout</SelectItem>
                </SelectContent>
              </Select>

              {/* User ID Search */}
              <div className="relative">
                <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
                <Input
                  placeholder="Cari user ID..."
                  value={filters.userId}
                  onChange={(e) => handleFilterChange('userId', e.target.value)}
                  className="pl-9"
                />
              </div>

              {/* Date From */}
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="justify-start text-left font-normal">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {filters.dateRange.from ? (
                      format(filters.dateRange.from, 'dd MMM yyyy', { locale: id })
                    ) : (
                      <span>Dari tanggal</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={filters.dateRange.from}
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    onSelect={(date: any) =>
                      handleFilterChange('dateRange', { ...filters.dateRange, from: date })
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>

              {/* Date To */}
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="justify-start text-left font-normal">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {filters.dateRange.to ? (
                      format(filters.dateRange.to, 'dd MMM yyyy', { locale: id })
                    ) : (
                      <span>Sampai tanggal</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={filters.dateRange.to}
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    onSelect={(date: any) =>
                      handleFilterChange('dateRange', { ...filters.dateRange, to: date })
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </Card>

          {/* Activity Timeline */}
          <ActivityTimeline data={logsData} isLoading={isLoading} />

          {/* Pagination */}
          {logsData && logsData.pagination.totalPages > 1 && (
            <Card className="p-4">
              <div className="flex items-center justify-between">
                <p className="text-muted-foreground text-sm">
                  Halaman {logsData.pagination.page} dari {logsData.pagination.totalPages} (
                  {logsData.pagination.total} total logs)
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={filters.page === 1}
                    onClick={() => handleFilterChange('page', filters.page - 1)}
                  >
                    Sebelumnya
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={!logsData.pagination.hasMore}
                    onClick={() => handleFilterChange('page', filters.page + 1)}
                  >
                    Selanjutnya
                  </Button>
                </div>
              </div>
            </Card>
          )}
        </TabsContent>

        {/* Stats Tab */}
        <TabsContent value="stats" className="space-y-4">
          <ActivityStats data={stats} />
        </TabsContent>

        {/* Trends Tab */}
        <TabsContent value="trends" className="space-y-4">
          <ActivityChart />
        </TabsContent>
      </Tabs>
    </div>
  )
}
