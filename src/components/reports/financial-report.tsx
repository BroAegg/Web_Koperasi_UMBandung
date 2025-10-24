'use client'

import { Card } from '@/components/ui/card'
import { ArrowDownCircle, ArrowUpCircle, TrendingUp, Wallet } from 'lucide-react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts'

interface FinancialReportProps {
  data?: {
    cashIn: number
    cashOut: number
    balance: number
    transactions: number
  }
  dateRange: {
    from: Date
    to: Date
  }
}

export function FinancialReport({ data }: FinancialReportProps) {
  if (!data) return null

  const chartData = [
    {
      name: 'Pemasukan',
      value: data.cashIn,
    },
    {
      name: 'Pengeluaran',
      value: data.cashOut,
    },
  ]

  const pieData = [
    { name: 'Pemasukan', value: data.cashIn, color: '#22c55e' },
    { name: 'Pengeluaran', value: data.cashOut, color: '#ef4444' },
  ]

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="p-6">
          <div className="flex items-center gap-2">
            <ArrowDownCircle className="h-5 w-5 text-green-500" />
            <div className="flex-1">
              <p className="text-muted-foreground text-sm">Pemasukan</p>
              <p className="text-2xl font-bold text-green-600">
                Rp {data.cashIn.toLocaleString('id-ID')}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-2">
            <ArrowUpCircle className="h-5 w-5 text-red-500" />
            <div className="flex-1">
              <p className="text-muted-foreground text-sm">Pengeluaran</p>
              <p className="text-2xl font-bold text-red-600">
                Rp {data.cashOut.toLocaleString('id-ID')}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-2">
            <Wallet className="h-5 w-5 text-blue-500" />
            <div className="flex-1">
              <p className="text-muted-foreground text-sm">Saldo</p>
              <p
                className={`text-2xl font-bold ${data.balance >= 0 ? 'text-green-600' : 'text-red-600'}`}
              >
                Rp {data.balance.toLocaleString('id-ID')}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-purple-500" />
            <div className="flex-1">
              <p className="text-muted-foreground text-sm">Total Transaksi</p>
              <p className="text-2xl font-bold">{data.transactions}</p>
              <p className="text-muted-foreground text-xs">transaksi</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Bar Chart */}
        <Card className="p-6">
          <h3 className="mb-4 text-lg font-semibold">Perbandingan Pemasukan vs Pengeluaran</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip formatter={(value: number) => `Rp ${value.toLocaleString('id-ID')}`} />
              <Legend />
              <Bar dataKey="value" fill="#3b82f6" name="Jumlah" />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Pie Chart */}
        <Card className="p-6">
          <h3 className="mb-4 text-lg font-semibold">Distribusi Keuangan</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                label={(entry: any) => `${entry.name}: ${(entry.percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value: number) => `Rp ${value.toLocaleString('id-ID')}`} />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Summary Table */}
      <Card>
        <div className="p-6">
          <h3 className="mb-4 text-lg font-semibold">Ringkasan Keuangan</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b pb-3">
              <span className="text-muted-foreground">Total Pemasukan</span>
              <span className="font-semibold text-green-600">
                Rp {data.cashIn.toLocaleString('id-ID')}
              </span>
            </div>
            <div className="flex items-center justify-between border-b pb-3">
              <span className="text-muted-foreground">Total Pengeluaran</span>
              <span className="font-semibold text-red-600">
                Rp {data.cashOut.toLocaleString('id-ID')}
              </span>
            </div>
            <div className="flex items-center justify-between border-b pb-3">
              <span className="text-muted-foreground">Selisih</span>
              <span
                className={`font-bold ${data.balance >= 0 ? 'text-green-600' : 'text-red-600'}`}
              >
                Rp {data.balance.toLocaleString('id-ID')}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Rata-rata per Transaksi</span>
              <span className="font-semibold">
                Rp{' '}
                {data.transactions > 0
                  ? Math.round((data.cashIn + data.cashOut) / data.transactions).toLocaleString(
                      'id-ID'
                    )
                  : '0'}
              </span>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}
