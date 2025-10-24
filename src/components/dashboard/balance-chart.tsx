'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Line,
  LineChart,
} from 'recharts'
import { useTheme } from '@/contexts/theme-context'

interface BalanceChartProps {
  data?: Array<{
    date: string
    balance: number
  }>
  loading?: boolean
}

export function BalanceChart({ data, loading = false }: BalanceChartProps) {
  const { theme, darkMode } = useTheme()

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="mb-2 h-5 w-40" />
          <Skeleton className="h-4 w-64" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[300px] w-full" />
        </CardContent>
      </Card>
    )
  }

  // Default data if none provided
  const chartData = data || [
    { date: 'Jan', balance: 45000000 },
    { date: 'Feb', balance: 52000000 },
    { date: 'Mar', balance: 48000000 },
    { date: 'Apr', balance: 61000000 },
    { date: 'May', balance: 55000000 },
    { date: 'Jun', balance: 67000000 },
  ]

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      notation: 'compact',
    }).format(value)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Balance Trend</CardTitle>
        <CardDescription>Monthly balance for the last 6 months</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke={theme.chartGrid} />
            <XAxis dataKey="date" stroke={theme.subtext} fontSize={12} />
            <YAxis
              stroke={theme.subtext}
              fontSize={12}
              tickFormatter={(value) => formatCurrency(value)}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: darkMode ? '#0f172a' : '#fff',
                border: `1px solid ${darkMode ? '#334155' : '#e5e7eb'}`,
                borderRadius: '8px',
              }}
              labelStyle={{
                color: darkMode ? '#f3f4f6' : '#111827',
              }}
              formatter={(value: number) => [formatCurrency(value), 'Balance']}
            />
            <Line
              type="monotone"
              dataKey="balance"
              stroke={theme.highlight}
              strokeWidth={3}
              dot={{ r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
