import { memo, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Wallet, TrendingUp, TrendingDown, Activity } from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { cn } from '@/lib/utils'

interface FinancialSummaryProps {
  data?: {
    totalBalance: number
    tokoBalance: number
    titipanBalance: number
    cashIn: number
    cashOut: number
    netCashFlow: number
    transactionCount: number
    status: 'surplus' | 'deficit'
  }
  loading: boolean
  period: 'today' | 'week' | 'month' | 'custom'
  onPeriodChange: (period: 'today' | 'week' | 'month' | 'custom') => void
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(value)
}

export const FinancialSummary = memo(function FinancialSummary({
  data,
  loading,
  period,
  onPeriodChange,
}: FinancialSummaryProps) {
  const handlePeriodChange = useCallback(
    (value: string) => {
      onPeriodChange(value as typeof period)
    },
    [onPeriodChange]
  )

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-8 w-8 rounded-md" />
            </CardHeader>
            <CardContent>
              <Skeleton className="mb-2 h-8 w-32" />
              <Skeleton className="h-3 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Period Selector */}
      <div className="flex justify-end">
        <Select value={period} onValueChange={handlePeriodChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select period" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="today">Today</SelectItem>
            <SelectItem value="week">Last 7 Days</SelectItem>
            <SelectItem value="month">Last 30 Days</SelectItem>
            <SelectItem value="custom">Custom Range</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Total Balance */}
        <Card className="transition-shadow duration-300 hover:shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Balance</CardTitle>
            <div className="bg-muted rounded-md p-2 text-green-600">
              <Wallet className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(data?.totalBalance || 0)}</div>
            <p className="text-muted-foreground mt-1 text-xs">
              Toko: {formatCurrency(data?.tokoBalance || 0)} | Titipan:{' '}
              {formatCurrency(data?.titipanBalance || 0)}
            </p>
          </CardContent>
        </Card>

        {/* Cash In */}
        <Card className="transition-shadow duration-300 hover:shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cash In</CardTitle>
            <div className="bg-muted rounded-md p-2 text-green-600">
              <TrendingUp className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {formatCurrency(data?.cashIn || 0)}
            </div>
            <p className="text-muted-foreground mt-1 text-xs">Income for selected period</p>
          </CardContent>
        </Card>

        {/* Cash Out */}
        <Card className="transition-shadow duration-300 hover:shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cash Out</CardTitle>
            <div className="bg-muted rounded-md p-2 text-red-600">
              <TrendingDown className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {formatCurrency(data?.cashOut || 0)}
            </div>
            <p className="text-muted-foreground mt-1 text-xs">Expenses for selected period</p>
          </CardContent>
        </Card>

        {/* Net Cash Flow */}
        <Card className="transition-shadow duration-300 hover:shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Net Cash Flow</CardTitle>
            <div
              className={cn(
                'bg-muted rounded-md p-2',
                data?.status === 'surplus' ? 'text-green-600' : 'text-red-600'
              )}
            >
              <Activity className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div
              className={cn(
                'text-2xl font-bold',
                data?.status === 'surplus' ? 'text-green-600' : 'text-red-600'
              )}
            >
              {formatCurrency(data?.netCashFlow || 0)}
            </div>
            <p className="text-muted-foreground mt-1 text-xs">
              {data?.transactionCount || 0} transactions
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
})
