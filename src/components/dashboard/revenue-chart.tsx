'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts'
import { useTheme } from 'next-themes'

interface RevenueChartProps {
  data?: Array<{
    date: string
    revenue: number
  }>
  loading?: boolean
}

export function RevenueChart({ data, loading = false }: RevenueChartProps) {
  const { theme } = useTheme()
  // Force light mode until toggle is implemented (Phase 10.4)
  const isDark = false // theme === 'dark'

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
    { date: 'Mon', revenue: 2400 },
    { date: 'Tue', revenue: 1398 },
    { date: 'Wed', revenue: 9800 },
    { date: 'Thu', revenue: 3908 },
    { date: 'Fri', revenue: 4800 },
    { date: 'Sat', revenue: 3800 },
    { date: 'Sun', revenue: 4300 },
  ]

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(value)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Revenue Overview</CardTitle>
        <CardDescription>Daily revenue for the last 7 days</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#374151' : '#e5e7eb'} />
            <XAxis dataKey="date" stroke={isDark ? '#9ca3af' : '#6b7280'} fontSize={12} />
            <YAxis
              stroke={isDark ? '#9ca3af' : '#6b7280'}
              fontSize={12}
              tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: isDark ? '#1f2937' : '#ffffff',
                border: `1px solid ${isDark ? '#374151' : '#e5e7eb'}`,
                borderRadius: '8px',
              }}
              labelStyle={{
                color: isDark ? '#f3f4f6' : '#111827',
              }}
              formatter={(value: number) => [formatCurrency(value), 'Revenue']}
            />
            <Bar dataKey="revenue" radius={[8, 8, 0, 0]}>
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={`hsl(var(--primary))`} opacity={0.8} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
