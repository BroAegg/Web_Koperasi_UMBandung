'use client'

import { Card } from '@/components/ui/card'
import { ShoppingCart, TrendingUp, DollarSign } from 'lucide-react'
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'

interface SalesReportProps {
  data?: {
    orders: number
    revenue: number
    averageOrderValue: number
  }
  dateRange: {
    from: Date
    to: Date
  }
}

export function SalesReport({ data }: SalesReportProps) {
  if (!data) return null

  // Mock trend data (in real app, this would come from backend)
  const trendData = [
    { date: 'Minggu 1', orders: Math.floor(data.orders * 0.2), revenue: data.revenue * 0.2 },
    { date: 'Minggu 2', orders: Math.floor(data.orders * 0.25), revenue: data.revenue * 0.25 },
    { date: 'Minggu 3', orders: Math.floor(data.orders * 0.3), revenue: data.revenue * 0.3 },
    { date: 'Minggu 4', orders: Math.floor(data.orders * 0.25), revenue: data.revenue * 0.25 },
  ]

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="p-6">
          <div className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5 text-blue-500" />
            <div className="flex-1">
              <p className="text-muted-foreground text-sm">Total Pesanan</p>
              <p className="text-2xl font-bold">{data.orders}</p>
              <p className="text-muted-foreground text-xs">pesanan selesai</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-green-500" />
            <div className="flex-1">
              <p className="text-muted-foreground text-sm">Total Pendapatan</p>
              <p className="text-2xl font-bold text-green-600">
                Rp {data.revenue.toLocaleString('id-ID')}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-purple-500" />
            <div className="flex-1">
              <p className="text-muted-foreground text-sm">Rata-rata Nilai Pesanan</p>
              <p className="text-2xl font-bold">
                Rp {Math.round(data.averageOrderValue).toLocaleString('id-ID')}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Line Chart - Orders Trend */}
        <Card className="p-6">
          <h3 className="mb-4 text-lg font-semibold">Tren Pesanan</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="orders"
                stroke="#3b82f6"
                strokeWidth={2}
                name="Pesanan"
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        {/* Area Chart - Revenue Trend */}
        <Card className="p-6">
          <h3 className="mb-4 text-lg font-semibold">Tren Pendapatan</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip formatter={(value: number) => `Rp ${value.toLocaleString('id-ID')}`} />
              <Legend />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="#22c55e"
                fill="#22c55e"
                fillOpacity={0.6}
                name="Pendapatan"
              />
            </AreaChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Sales Metrics */}
      <Card>
        <div className="p-6">
          <h3 className="mb-4 text-lg font-semibold">Metrik Penjualan</h3>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b pb-3">
                <span className="text-muted-foreground">Total Pesanan</span>
                <span className="font-semibold">{data.orders} pesanan</span>
              </div>
              <div className="flex items-center justify-between border-b pb-3">
                <span className="text-muted-foreground">Total Pendapatan</span>
                <span className="font-semibold text-green-600">
                  Rp {data.revenue.toLocaleString('id-ID')}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Rata-rata Nilai Pesanan</span>
                <span className="font-semibold">
                  Rp {Math.round(data.averageOrderValue).toLocaleString('id-ID')}
                </span>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between border-b pb-3">
                <span className="text-muted-foreground">Pesanan per Hari</span>
                <span className="font-semibold">{(data.orders / 30).toFixed(1)} pesanan</span>
              </div>
              <div className="flex items-center justify-between border-b pb-3">
                <span className="text-muted-foreground">Pendapatan per Hari</span>
                <span className="font-semibold text-green-600">
                  Rp {Math.round(data.revenue / 30).toLocaleString('id-ID')}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Tingkat Konversi</span>
                <span className="font-semibold">{data.orders > 0 ? '100%' : '0%'}</span>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}
