'use client'

import { PageContainer } from '@/components/shared/PageContainer'
import { PageHeader } from '@/components/shared/PageHeader'
import { StatsCard } from '@/components/shared/StatsCard'
import { SkeletonLoader } from '@/components/shared/SkeletonLoader'
import { ErrorDisplay } from '@/components/shared/ErrorBoundary'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Users,
  Package,
  UserCog,
  DollarSign,
  Box,
  Activity,
  TrendingUp,
  ShoppingCart,
} from 'lucide-react'
import { trpc } from '@/lib/trpc'

export default function KoperasiDashboard() {
  // Fetch dashboard stats
  const { data: supplierStats, isLoading: loadingSuppliers } =
    trpc.supplier.getSupplierStats.useQuery()
  const { data: productStats, isLoading: loadingProducts } = trpc.product.getStats.useQuery()
  const { data: inventoryStats, isLoading: loadingInventory } =
    trpc.inventory.getInventoryStats.useQuery()
  const { data: memberStats, isLoading: loadingMembers } = trpc.member.getMemberStats.useQuery()
  const { data: activityStats, isLoading: loadingActivity } =
    trpc.activity.getActivityStats.useQuery()
  const { data: salesStats, isLoading: loadingSales } = trpc.pos.getSalesStats.useQuery({
    startDate: new Date(new Date().setHours(0, 0, 0, 0)),
    endDate: new Date(new Date().setHours(23, 59, 59, 999)),
  })

  const isLoading =
    loadingSuppliers ||
    loadingProducts ||
    loadingInventory ||
    loadingMembers ||
    loadingActivity ||
    loadingSales

  // Format currency
  const formatCurrency = (amount: number) => {
    if (amount >= 1000000) {
      return `Rp ${(amount / 1000000).toFixed(1)}M`
    } else if (amount >= 1000) {
      return `Rp ${(amount / 1000).toFixed(1)}K`
    }
    return `Rp ${amount.toLocaleString('id-ID')}`
  }

  return (
    <PageContainer>
      <PageHeader
        title="Dashboard Koperasi"
        subtitle="Kelola dan monitor seluruh sistem koperasi"
      />

      {/* Loading State */}
      {isLoading && <SkeletonLoader variant="stats" count={8} />}

      {/* Stats Grid - Module Cards */}
      {!isLoading && (
        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          <StatsCard
            title="Total Suppliers"
            value={supplierStats?.totalSuppliers || 0}
            subtitle="Supplier aktif"
            icon={Users}
            gradient="blue"
            trend={{ value: '+12% dari bulan lalu', isPositive: true }}
          />

          <StatsCard
            title="Total Products"
            value={productStats?.total || 0}
            subtitle="Produk tersedia"
            icon={Package}
            gradient="green"
            trend={{
              value: `${productStats?.active || 0} produk aktif`,
              isPositive: true,
            }}
          />

          <StatsCard
            title="Inventory Value"
            value={formatCurrency(inventoryStats?.inventoryValue || 0)}
            subtitle="Nilai stok saat ini"
            icon={DollarSign}
            gradient="emerald"
            trend={{
              value: `${inventoryStats?.lowStockProducts || 0} low stock`,
              isPositive: (inventoryStats?.lowStockProducts || 0) === 0,
            }}
          />

          <StatsCard
            title="Inventory"
            value={inventoryStats?.totalProducts || 0}
            subtitle="Total items"
            icon={Box}
            gradient="orange"
            trend={{
              value: `${inventoryStats?.lowStockProducts || 0} low stock alerts`,
              isPositive: (inventoryStats?.lowStockProducts || 0) === 0,
            }}
          />

          <StatsCard
            title="Orders Today"
            value={salesStats?.totalOrders || 0}
            subtitle="Transaksi hari ini"
            icon={ShoppingCart}
            gradient="pink"
            trend={{
              value: formatCurrency(salesStats?.totalRevenue || 0),
              isPositive: true,
            }}
          />

          <StatsCard
            title="Members"
            value={(memberStats?.totalDeposits || 0) + (memberStats?.totalWithdrawals || 0)}
            subtitle="Total transaksi"
            icon={Users}
            gradient="blue"
            trend={{
              value: formatCurrency(memberStats?.balance || 0) + ' balance',
              isPositive: (memberStats?.balance || 0) >= 0,
            }}
          />

          <StatsCard
            title="Activity Logs"
            value={activityStats?.totalLogs || 0}
            subtitle="Total log aktivitas"
            icon={Activity}
            gradient="purple"
            trend={{ value: 'Last 30 days', isPositive: true }}
          />
        </div>
      )}

      {/* Quick Actions & Recent Activity */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-blue-500" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <button className="w-full rounded-lg border border-gray-200 p-3 text-left transition-all hover:border-blue-500 hover:bg-blue-50">
                <div className="font-medium text-gray-900">Buat Transaksi POS</div>
                <div className="text-sm text-gray-500">Mulai transaksi penjualan baru</div>
              </button>
              <button className="w-full rounded-lg border border-gray-200 p-3 text-left transition-all hover:border-green-500 hover:bg-green-50">
                <div className="font-medium text-gray-900">Tambah Produk</div>
                <div className="text-sm text-gray-500">Tambahkan produk ke inventory</div>
              </button>
              <button className="w-full rounded-lg border border-gray-200 p-3 text-left transition-all hover:border-purple-500 hover:bg-purple-50">
                <div className="font-medium text-gray-900">Lihat Laporan</div>
                <div className="text-sm text-gray-500">Akses laporan keuangan</div>
              </button>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity Preview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-purple-500" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-start gap-3 rounded-lg border border-gray-200 p-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100">
                  <Package className="h-4 w-4 text-green-600" />
                </div>
                <div className="flex-1">
                  <div className="text-sm font-medium text-gray-900">New product added</div>
                  <div className="text-xs text-gray-500">Admin • 2 minutes ago</div>
                </div>
              </div>

              <div className="flex items-start gap-3 rounded-lg border border-gray-200 p-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100">
                  <ShoppingCart className="h-4 w-4 text-blue-600" />
                </div>
                <div className="flex-1">
                  <div className="text-sm font-medium text-gray-900">Order completed</div>
                  <div className="text-xs text-gray-500">Kasir • 15 minutes ago</div>
                </div>
              </div>

              <div className="flex items-start gap-3 rounded-lg border border-gray-200 p-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-100">
                  <Users className="h-4 w-4 text-purple-600" />
                </div>
                <div className="flex-1">
                  <div className="text-sm font-medium text-gray-900">New member registered</div>
                  <div className="text-xs text-gray-500">System • 1 hour ago</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  )
}
