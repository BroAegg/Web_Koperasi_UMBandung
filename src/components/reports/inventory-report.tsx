'use client'

import { Card } from '@/components/ui/card'
import { Package, AlertTriangle, DollarSign } from 'lucide-react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'

interface InventoryReportProps {
  data?: {
    totalProducts: number
    lowStockCount: number
    totalStockValue: number
  }
}

export function InventoryReport({ data }: InventoryReportProps) {
  if (!data) return null

  const chartData = [
    {
      name: 'Stok Normal',
      value: data.totalProducts - data.lowStockCount,
      fill: '#22c55e',
    },
    {
      name: 'Stok Rendah',
      value: data.lowStockCount,
      fill: '#f59e0b',
    },
  ]

  const lowStockPercentage =
    data.totalProducts > 0 ? ((data.lowStockCount / data.totalProducts) * 100).toFixed(1) : '0'

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="p-6">
          <div className="flex items-center gap-2">
            <Package className="h-5 w-5 text-blue-500" />
            <div className="flex-1">
              <p className="text-muted-foreground text-sm">Total Produk</p>
              <p className="text-2xl font-bold">{data.totalProducts}</p>
              <p className="text-muted-foreground text-xs">produk aktif</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-orange-500" />
            <div className="flex-1">
              <p className="text-muted-foreground text-sm">Stok Rendah</p>
              <p className="text-2xl font-bold text-orange-600">{data.lowStockCount}</p>
              <p className="text-muted-foreground text-xs">{lowStockPercentage}% dari total</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-green-500" />
            <div className="flex-1">
              <p className="text-muted-foreground text-sm">Nilai Stok</p>
              <p className="text-2xl font-bold text-green-600">
                Rp {Math.round(data.totalStockValue).toLocaleString('id-ID')}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Bar Chart - Stock Status */}
        <Card className="p-6">
          <h3 className="mb-4 text-lg font-semibold">Status Stok Produk</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" name="Jumlah Produk" />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Stock Health Indicator */}
        <Card className="p-6">
          <h3 className="mb-4 text-lg font-semibold">Kesehatan Inventori</h3>
          <div className="mt-8 space-y-6">
            <div>
              <div className="mb-2 flex justify-between">
                <span className="text-sm font-medium">Stok Normal</span>
                <span className="text-muted-foreground text-sm">
                  {data.totalProducts - data.lowStockCount} produk
                </span>
              </div>
              <div className="h-3 w-full rounded-full bg-gray-200">
                <div
                  className="h-3 rounded-full bg-green-500"
                  style={{
                    width: `${data.totalProducts > 0 ? ((data.totalProducts - data.lowStockCount) / data.totalProducts) * 100 : 0}%`,
                  }}
                />
              </div>
            </div>

            <div>
              <div className="mb-2 flex justify-between">
                <span className="text-sm font-medium">Stok Rendah</span>
                <span className="text-muted-foreground text-sm">{data.lowStockCount} produk</span>
              </div>
              <div className="h-3 w-full rounded-full bg-gray-200">
                <div
                  className="h-3 rounded-full bg-orange-500"
                  style={{
                    width: `${data.totalProducts > 0 ? (data.lowStockCount / data.totalProducts) * 100 : 0}%`,
                  }}
                />
              </div>
            </div>

            <div className="bg-muted mt-6 rounded-lg p-4">
              <p className="mb-2 text-sm font-medium">Rekomendasi</p>
              {data.lowStockCount > 0 ? (
                <p className="text-muted-foreground text-sm">
                  Ada {data.lowStockCount} produk dengan stok rendah yang perlu segera di-restock
                  untuk menghindari kehabisan stok.
                </p>
              ) : (
                <p className="text-muted-foreground text-sm">
                  Semua produk memiliki stok yang cukup. Pertahankan monitoring berkala.
                </p>
              )}
            </div>
          </div>
        </Card>
      </div>

      {/* Inventory Metrics */}
      <Card>
        <div className="p-6">
          <h3 className="mb-4 text-lg font-semibold">Metrik Inventori</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b pb-3">
              <span className="text-muted-foreground">Total Produk Aktif</span>
              <span className="font-semibold">{data.totalProducts} produk</span>
            </div>
            <div className="flex items-center justify-between border-b pb-3">
              <span className="text-muted-foreground">Produk Stok Rendah</span>
              <span className="font-semibold text-orange-600">
                {data.lowStockCount} produk ({lowStockPercentage}%)
              </span>
            </div>
            <div className="flex items-center justify-between border-b pb-3">
              <span className="text-muted-foreground">Nilai Total Stok</span>
              <span className="font-semibold text-green-600">
                Rp {Math.round(data.totalStockValue).toLocaleString('id-ID')}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Nilai Rata-rata per Produk</span>
              <span className="font-semibold">
                Rp{' '}
                {data.totalProducts > 0
                  ? Math.round(data.totalStockValue / data.totalProducts).toLocaleString('id-ID')
                  : '0'}
              </span>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}
