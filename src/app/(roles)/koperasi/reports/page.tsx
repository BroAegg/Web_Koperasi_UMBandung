'use client'

import { useState } from 'react'
import { trpc } from '@/lib/trpc'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  ShoppingCart,
  Package,
  Users,
  AlertTriangle,
} from 'lucide-react'

export default function ReportsPage() {
  const [startDate, setStartDate] = useState(() => {
    const date = new Date()
    date.setDate(1) // First day of current month
    return date.toISOString().split('T')[0]
  })

  const [endDate, setEndDate] = useState(() => {
    const date = new Date()
    return date.toISOString().split('T')[0]
  })

  const { data: report, isLoading } = trpc.report.getDashboardReport.useQuery({
    startDate: new Date(startDate),
    endDate: new Date(endDate),
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Laporan & Analisis</h1>
      </div>

      {/* Date Range Filter */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-end gap-4">
            <div className="flex-1">
              <label className="mb-1 block text-sm font-medium">Tanggal Mulai</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full rounded-lg border px-3 py-2 focus:ring-2 focus:ring-green-500 focus:outline-none"
              />
            </div>
            <div className="flex-1">
              <label className="mb-1 block text-sm font-medium">Tanggal Akhir</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full rounded-lg border px-3 py-2 focus:ring-2 focus:ring-green-500 focus:outline-none"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {isLoading ? (
        <div className="py-12 text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-green-600 border-r-transparent"></div>
          <p className="mt-2 text-gray-500">Memuat laporan...</p>
        </div>
      ) : (
        <>
          {/* Financial Section */}
          <div>
            <h2 className="mb-4 text-xl font-bold">Keuangan</h2>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
              <Card className="border-green-200 bg-green-50">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-green-700">Pemasukan</CardTitle>
                  <TrendingUp className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-700">
                    Rp {(report?.financial.cashIn || 0).toLocaleString('id-ID')}
                  </div>
                  <p className="mt-1 text-xs text-green-600">Cash In</p>
                </CardContent>
              </Card>

              <Card className="border-red-200 bg-red-50">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-red-700">Pengeluaran</CardTitle>
                  <TrendingDown className="h-4 w-4 text-red-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-red-700">
                    Rp {(report?.financial.cashOut || 0).toLocaleString('id-ID')}
                  </div>
                  <p className="mt-1 text-xs text-red-600">Cash Out</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Saldo</CardTitle>
                  <DollarSign className="h-4 w-4 text-gray-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    Rp {(report?.financial.balance || 0).toLocaleString('id-ID')}
                  </div>
                  <p className="mt-1 text-xs text-gray-500">Balance</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Transaksi</CardTitle>
                  <ShoppingCart className="h-4 w-4 text-gray-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{report?.financial.transactions || 0}</div>
                  <p className="mt-1 text-xs text-gray-500">Total Transaksi</p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Sales Section */}
          <div>
            <h2 className="mb-4 text-xl font-bold">Penjualan (POS)</h2>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Total Pendapatan</CardTitle>
                  <DollarSign className="h-4 w-4 text-gray-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    Rp {(report?.sales.revenue || 0).toLocaleString('id-ID')}
                  </div>
                  <p className="mt-1 text-xs text-gray-500">Revenue</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Total Order</CardTitle>
                  <ShoppingCart className="h-4 w-4 text-gray-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{report?.sales.orders || 0}</div>
                  <p className="mt-1 text-xs text-gray-500">Pesanan</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Rata-rata Order</CardTitle>
                  <TrendingUp className="h-4 w-4 text-gray-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    Rp {(report?.sales.averageOrderValue || 0).toLocaleString('id-ID')}
                  </div>
                  <p className="mt-1 text-xs text-gray-500">AOV</p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Inventory Section */}
          <div>
            <h2 className="mb-4 text-xl font-bold">Inventori</h2>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Total Produk</CardTitle>
                  <Package className="h-4 w-4 text-gray-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{report?.inventory.totalProducts || 0}</div>
                  <p className="mt-1 text-xs text-gray-500">Produk</p>
                </CardContent>
              </Card>

              <Card className="border-yellow-200 bg-yellow-50">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-yellow-700">
                    Stok Menipis
                  </CardTitle>
                  <AlertTriangle className="h-4 w-4 text-yellow-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-yellow-700">
                    {report?.inventory.lowStockCount || 0}
                  </div>
                  <p className="mt-1 text-xs text-yellow-600">Perlu Restock</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Nilai Inventori</CardTitle>
                  <DollarSign className="h-4 w-4 text-gray-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    Rp {(report?.inventory.totalStockValue || 0).toLocaleString('id-ID')}
                  </div>
                  <p className="mt-1 text-xs text-gray-500">Total Nilai</p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Member Section */}
          <div>
            <h2 className="mb-4 text-xl font-bold">Simpanan Anggota</h2>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
              <Card className="border-green-200 bg-green-50">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-green-700">
                    Total Setoran
                  </CardTitle>
                  <TrendingUp className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-700">
                    Rp {(report?.member.deposits || 0).toLocaleString('id-ID')}
                  </div>
                  <p className="mt-1 text-xs text-green-600">Deposits</p>
                </CardContent>
              </Card>

              <Card className="border-red-200 bg-red-50">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-red-700">
                    Total Penarikan
                  </CardTitle>
                  <TrendingDown className="h-4 w-4 text-red-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-red-700">
                    Rp {(report?.member.withdrawals || 0).toLocaleString('id-ID')}
                  </div>
                  <p className="mt-1 text-xs text-red-600">Withdrawals</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Saldo Simpanan</CardTitle>
                  <DollarSign className="h-4 w-4 text-gray-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    Rp {(report?.member.balance || 0).toLocaleString('id-ID')}
                  </div>
                  <p className="mt-1 text-xs text-gray-500">Balance</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Transaksi</CardTitle>
                  <Users className="h-4 w-4 text-gray-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{report?.member.transactions || 0}</div>
                  <p className="mt-1 text-xs text-gray-500">Total</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
