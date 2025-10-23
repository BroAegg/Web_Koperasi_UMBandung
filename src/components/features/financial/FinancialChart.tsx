'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatCurrency } from '@/lib/financial-utils'
import type { ChartData } from '@/types/financial'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import { TrendingUp, TrendingDown } from 'lucide-react'

interface FinancialChartProps {
  data: ChartData
  title?: string
  height?: number
}

// Custom Tooltip Component
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload || payload.length === 0) {
    return null
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const cashIn = payload.find((p: any) => p.dataKey === 'Pemasukan')?.value || 0
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const cashOut = payload.find((p: any) => p.dataKey === 'Pengeluaran')?.value || 0
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const balance = payload.find((p: any) => p.dataKey === 'Saldo')?.value || 0
  const netFlow = cashIn - cashOut

  // Get fullDate from payload
  const fullDate = payload[0]?.payload?.fullDate

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-lg">
      <p className="mb-3 text-sm font-semibold text-gray-700">
        {fullDate
          ? new Date(fullDate).toLocaleDateString('id-ID', {
              weekday: 'short',
              day: 'numeric',
              month: 'short',
              year: 'numeric',
            })
          : label}
      </p>
      <div className="space-y-2">
        {/* Cash In */}
        <div className="flex items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-emerald-500" />
            <span className="text-xs text-gray-600">Pemasukan:</span>
          </div>
          <span className="text-sm font-bold text-emerald-600">{formatCurrency(cashIn)}</span>
        </div>
        {/* Cash Out */}
        <div className="flex items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-rose-500" />
            <span className="text-xs text-gray-600">Pengeluaran:</span>
          </div>
          <span className="text-sm font-bold text-rose-600">{formatCurrency(cashOut)}</span>
        </div>
        {/* Net Flow */}
        <div className="flex items-center justify-between gap-6 border-t border-gray-200 pt-2">
          <div className="flex items-center gap-2">
            {netFlow >= 0 ? (
              <TrendingUp className="h-3 w-3 text-emerald-500" />
            ) : (
              <TrendingDown className="h-3 w-3 text-rose-500" />
            )}
            <span className="text-xs font-medium text-gray-700">Net Flow:</span>
          </div>
          <span
            className={`text-sm font-bold ${netFlow >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}
          >
            {netFlow >= 0 ? '+' : ''}
            {formatCurrency(netFlow)}
          </span>
        </div>
        {/* Balance */}
        <div className="flex items-center justify-between gap-6 border-t border-gray-200 pt-2">
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-blue-500" />
            <span className="text-xs font-medium text-gray-700">Saldo:</span>
          </div>
          <span className="text-sm font-bold text-blue-600">{formatCurrency(balance)}</span>
        </div>
      </div>
    </div>
  )
}

export function FinancialChart({
  data,
  title = 'Grafik Keuangan',
  height = 350,
}: FinancialChartProps) {
  // Transform data for chart
  const chartData = data.map((item) => ({
    date: new Date(item.date).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
    }),
    fullDate: item.date,
    Pemasukan: item.cashIn,
    Pengeluaran: item.cashOut,
    Saldo: item.balance,
  }))

  if (chartData.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div
            className="flex items-center justify-center text-gray-500"
            style={{ height: `${height}px` }}
          >
            <div className="text-center">
              <p className="text-sm">Tidak ada data untuk ditampilkan</p>
              <p className="mt-1 text-xs text-gray-400">Lakukan transaksi untuk melihat grafik</p>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-emerald-500" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={height}>
          <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorCashIn" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorCashOut" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 12 }}
              tickLine={false}
              axisLine={false}
              stroke="#6b7280"
            />
            <YAxis
              tick={{ fontSize: 12 }}
              tickLine={false}
              axisLine={false}
              stroke="#6b7280"
              tickFormatter={(value) => {
                if (value >= 1000000) {
                  return `${(value / 1000000).toFixed(1)}M`
                } else if (value >= 1000) {
                  return `${(value / 1000).toFixed(0)}K`
                }
                return value.toString()
              }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              wrapperStyle={{
                paddingTop: '20px',
                fontSize: '14px',
              }}
            />
            <Area
              type="monotone"
              dataKey="Pemasukan"
              stroke="#10b981"
              strokeWidth={2}
              fill="url(#colorCashIn)"
              name="Pemasukan"
            />
            <Area
              type="monotone"
              dataKey="Pengeluaran"
              stroke="#ef4444"
              strokeWidth={2}
              fill="url(#colorCashOut)"
              name="Pengeluaran"
            />
            <Area
              type="monotone"
              dataKey="Saldo"
              stroke="#3b82f6"
              strokeWidth={2}
              fill="url(#colorBalance)"
              name="Saldo"
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
