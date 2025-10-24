'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { useTheme } from '@/contexts/theme-context'

interface RevenueChartProps {
  data?: Array<{
    date: string
    revenue: number
  }>
  loading?: boolean
}

export function RevenueChart({ data, loading = false }: RevenueChartProps) {
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
            <CartesianGrid strokeDasharray="3 3" stroke={theme.chartGrid} />
            <XAxis dataKey="date" stroke={theme.subtext} fontSize={12} />
            <YAxis
              stroke={theme.subtext}
              fontSize={12}
              tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
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
              formatter={(value: number) => [formatCurrency(value), 'Revenue']}
            />
            <Bar dataKey="revenue" fill={theme.accent} radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
