'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatCurrency } from '@/lib/financial-utils'
import type { ChartData } from '@/types/financial'
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

  return (
    <div className="rounded-lg border bg-white p-3 shadow-lg">
      <p className="mb-2 text-sm font-semibold text-gray-700">
        {new Date(label as string).toLocaleDateString('id-ID', {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
        })}
      </p>
      <div className="space-y-1">
        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center justify-between gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full" style={{ backgroundColor: entry.color }} />
              <span className="text-gray-600">{entry.name}:</span>
            </div>
            <span className="font-semibold" style={{ color: entry.color }}>
              {formatCurrency(entry.value as number)}
            </span>
          </div>
        ))}
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
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={height}>
          <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 12 }}
              tickLine={{ stroke: '#e0e0e0' }}
              stroke="#9ca3af"
            />
            <YAxis
              tick={{ fontSize: 12 }}
              tickLine={{ stroke: '#e0e0e0' }}
              stroke="#9ca3af"
              tickFormatter={(value) => {
                // Format large numbers: 1000000 -> 1M
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
            <Line
              type="monotone"
              dataKey="Pemasukan"
              stroke="#10b981"
              strokeWidth={2}
              dot={{ fill: '#10b981', r: 4 }}
              activeDot={{ r: 6 }}
              name="Pemasukan"
            />
            <Line
              type="monotone"
              dataKey="Pengeluaran"
              stroke="#ef4444"
              strokeWidth={2}
              dot={{ fill: '#ef4444', r: 4 }}
              activeDot={{ r: 6 }}
              name="Pengeluaran"
            />
            <Line
              type="monotone"
              dataKey="Saldo"
              stroke="#3b82f6"
              strokeWidth={2}
              dot={{ fill: '#3b82f6', r: 4 }}
              activeDot={{ r: 6 }}
              name="Saldo"
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
