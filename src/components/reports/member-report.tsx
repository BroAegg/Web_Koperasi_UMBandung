'use client'

import { Card } from '@/components/ui/card'
import { Users, ArrowDownCircle, ArrowUpCircle, Wallet } from 'lucide-react'
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'

interface MemberReportProps {
  data?: {
    deposits: number
    withdrawals: number
    balance: number
    transactions: number
  }
  dateRange: {
    from: Date
    to: Date
  }
}

export function MemberReport({ data }: MemberReportProps) {
  if (!data) return null

  const chartData = [
    {
      name: 'Setoran',
      value: data.deposits,
    },
    {
      name: 'Penarikan',
      value: data.withdrawals,
    },
  ]

  // Mock trend data
  const trendData = [
    {
      date: 'Minggu 1',
      deposits: data.deposits * 0.2,
      withdrawals: data.withdrawals * 0.25,
    },
    {
      date: 'Minggu 2',
      deposits: data.deposits * 0.3,
      withdrawals: data.withdrawals * 0.2,
    },
    {
      date: 'Minggu 3',
      deposits: data.deposits * 0.25,
      withdrawals: data.withdrawals * 0.3,
    },
    {
      date: 'Minggu 4',
      deposits: data.deposits * 0.25,
      withdrawals: data.withdrawals * 0.25,
    },
  ]

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="p-6">
          <div className="flex items-center gap-2">
            <ArrowDownCircle className="h-5 w-5 text-green-500" />
            <div className="flex-1">
              <p className="text-muted-foreground text-sm">Total Setoran</p>
              <p className="text-2xl font-bold text-green-600">
                Rp {data.deposits.toLocaleString('id-ID')}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-2">
            <ArrowUpCircle className="h-5 w-5 text-red-500" />
            <div className="flex-1">
              <p className="text-muted-foreground text-sm">Total Penarikan</p>
              <p className="text-2xl font-bold text-red-600">
                Rp {data.withdrawals.toLocaleString('id-ID')}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-2">
            <Wallet className="h-5 w-5 text-blue-500" />
            <div className="flex-1">
              <p className="text-muted-foreground text-sm">Saldo Anggota</p>
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
            <Users className="h-5 w-5 text-purple-500" />
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
        {/* Bar Chart - Deposits vs Withdrawals */}
        <Card className="p-6">
          <h3 className="mb-4 text-lg font-semibold">Setoran vs Penarikan</h3>
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

        {/* Line Chart - Trend */}
        <Card className="p-6">
          <h3 className="mb-4 text-lg font-semibold">Tren Transaksi Anggota</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip formatter={(value: number) => `Rp ${value.toLocaleString('id-ID')}`} />
              <Legend />
              <Line
                type="monotone"
                dataKey="deposits"
                stroke="#22c55e"
                strokeWidth={2}
                name="Setoran"
              />
              <Line
                type="monotone"
                dataKey="withdrawals"
                stroke="#ef4444"
                strokeWidth={2}
                name="Penarikan"
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Member Metrics */}
      <Card>
        <div className="p-6">
          <h3 className="mb-4 text-lg font-semibold">Metrik Anggota</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b pb-3">
              <span className="text-muted-foreground">Total Setoran</span>
              <span className="font-semibold text-green-600">
                Rp {data.deposits.toLocaleString('id-ID')}
              </span>
            </div>
            <div className="flex items-center justify-between border-b pb-3">
              <span className="text-muted-foreground">Total Penarikan</span>
              <span className="font-semibold text-red-600">
                Rp {data.withdrawals.toLocaleString('id-ID')}
              </span>
            </div>
            <div className="flex items-center justify-between border-b pb-3">
              <span className="text-muted-foreground">Saldo Anggota</span>
              <span
                className={`font-bold ${data.balance >= 0 ? 'text-green-600' : 'text-red-600'}`}
              >
                Rp {data.balance.toLocaleString('id-ID')}
              </span>
            </div>
            <div className="flex items-center justify-between border-b pb-3">
              <span className="text-muted-foreground">Total Transaksi</span>
              <span className="font-semibold">{data.transactions} transaksi</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Rata-rata per Transaksi</span>
              <span className="font-semibold">
                Rp{' '}
                {data.transactions > 0
                  ? Math.round(
                      (data.deposits + data.withdrawals) / data.transactions
                    ).toLocaleString('id-ID')
                  : '0'}
              </span>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}
