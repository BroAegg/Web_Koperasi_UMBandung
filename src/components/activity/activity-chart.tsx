'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { trpc } from '@/lib/trpc'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import { format } from 'date-fns'
import { id } from 'date-fns/locale'

export function ActivityChart() {
  const [days, setDays] = useState(7)

  const { data, isLoading } = trpc.activity.getActivityTrends.useQuery({
    days,
  })

  const chartData = data?.map((item) => ({
    date: format(new Date(item.date), 'dd MMM', { locale: id }),
    activities: item.activities,
  }))

  return (
    <div className="space-y-4">
      {/* Period Selector */}
      <Card className="p-4">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">Periode:</span>
          <Button variant={days === 7 ? 'default' : 'outline'} size="sm" onClick={() => setDays(7)}>
            7 Hari
          </Button>
          <Button
            variant={days === 14 ? 'default' : 'outline'}
            size="sm"
            onClick={() => setDays(14)}
          >
            14 Hari
          </Button>
          <Button
            variant={days === 30 ? 'default' : 'outline'}
            size="sm"
            onClick={() => setDays(30)}
          >
            30 Hari
          </Button>
        </div>
      </Card>

      {/* Chart */}
      <Card className="p-6">
        <h3 className="mb-4 text-lg font-semibold">Tren Aktivitas</h3>
        {isLoading ? (
          <div className="flex h-80 items-center justify-center">
            <p className="text-muted-foreground">Memuat data...</p>
          </div>
        ) : chartData && chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="activities"
                stroke="#3b82f6"
                strokeWidth={2}
                name="Aktivitas"
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex h-80 items-center justify-center">
            <p className="text-muted-foreground">Tidak ada data untuk ditampilkan</p>
          </div>
        )}
      </Card>

      {/* Summary */}
      {chartData && chartData.length > 0 && (
        <Card className="p-6">
          <h3 className="mb-4 text-lg font-semibold">Ringkasan</h3>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-1">
              <p className="text-muted-foreground text-sm">Total Aktivitas</p>
              <p className="text-2xl font-bold">
                {chartData.reduce((sum, item) => sum + item.activities, 0).toLocaleString('id-ID')}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-muted-foreground text-sm">Rata-rata per Hari</p>
              <p className="text-2xl font-bold">
                {Math.round(
                  chartData.reduce((sum, item) => sum + item.activities, 0) / chartData.length
                ).toLocaleString('id-ID')}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-muted-foreground text-sm">Hari Paling Aktif</p>
              <p className="text-2xl font-bold">
                {
                  chartData.reduce((max, item) => (item.activities > max.activities ? item : max))
                    .date
                }
              </p>
            </div>
          </div>
        </Card>
      )}
    </div>
  )
}
