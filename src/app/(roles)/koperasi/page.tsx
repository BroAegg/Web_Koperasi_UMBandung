'use client'

import { useState } from 'react'
import { PageContainer } from '@/components/shared/PageContainer'
import { PageHeader } from '@/components/shared/PageHeader'
import { StatsCard } from '@/components/shared/StatsCard'
import { SkeletonLoader } from '@/components/shared/SkeletonLoader'
import { useToast } from '@/components/shared/ToastContext'
import { LogoutModal } from '@/components/shared/LogoutModal'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Users,
  Package,
  DollarSign,
  Box,
  Activity,
  TrendingUp,
  ShoppingCart,
  ArrowRight,
  Clock,
  Bell,
  LogOut,
} from 'lucide-react'
import { trpc } from '@/lib/trpc'
import { useRouter } from 'next/navigation'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
} from 'recharts'

export default function KoperasiDashboard() {
  const router = useRouter()
  const toast = useToast()
  const [showLogoutModal, setShowLogoutModal] = useState(false)

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

  // Fetch recent activity logs
  const { data: recentActivityData, isLoading: loadingRecentActivity } =
    trpc.activity.getActivityLogs.useQuery({
      page: 1,
      limit: 5,
    })

  // Fetch activity trends for chart
  const { data: activityTrends, isLoading: loadingTrends } =
    trpc.activity.getActivityTrends.useQuery({
      days: 7,
    })

  // Fetch best selling products
  const { data: bestSellers, isLoading: loadingBestSellers } = trpc.pos.getBestSellers.useQuery({
    days: 30,
    limit: 10,
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

  // Get activity icon and color
  const getActivityIcon = (module: string) => {
    switch (module) {
      case 'POS':
        return { icon: ShoppingCart, color: 'text-pink-600', bg: 'bg-pink-100' }
      case 'INVENTORY':
        return { icon: Package, color: 'text-orange-600', bg: 'bg-orange-100' }
      case 'MEMBER':
        return { icon: Users, color: 'text-purple-600', bg: 'bg-purple-100' }
      case 'SUPPLIER':
        return { icon: Users, color: 'text-blue-600', bg: 'bg-blue-100' }
      case 'FINANCIAL':
        return { icon: DollarSign, color: 'text-emerald-600', bg: 'bg-emerald-100' }
      default:
        return { icon: Activity, color: 'text-gray-600', bg: 'bg-gray-100' }
    }
  }

  // Format date/time
  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const formatDate = (date: Date, short: boolean = false) => {
    if (short) {
      return new Date(date).toLocaleDateString('id-ID', {
        month: 'short',
        day: 'numeric',
      })
    }
    return new Date(date).toLocaleDateString('id-ID')
  }

  // Format chart data from real activity trends
  const chartData =
    activityTrends?.map((trend) => ({
      date: formatDate(new Date(trend.date), true),
      activities: trend.activities,
    })) || []

  return (
    <PageContainer>
      <div className="mb-8 flex items-center justify-between flex-wrap gap-4">
        <PageHeader
          title="Dashboard Koperasi"
          subtitle="Kelola dan monitor seluruh sistem koperasi"
        />
        
        {/* Action Buttons */}
        <div className="flex gap-2">
          {/* Logout Button */}
          <Button
            onClick={() => setShowLogoutModal(true)}
            variant="outline"
            className="border-2 border-red-200 text-red-600 hover:bg-red-50"
            size="sm"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>

          {/* Toast Demo Button */}
          <Button
            onClick={() => {
              toast.success('Berhasil!', 'Data telah tersimpan ke database')
            }}
            variant="outline"
            className="border-2 border-green-200 text-green-600 hover:bg-green-50"
            size="sm"
          >
            <Bell className="mr-2 h-4 w-4" />
            Test Toast
          </Button>
        </div>
      </div>

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
              <button
                onClick={() => router.push('/koperasi/pos')}
                className="group w-full rounded-lg border border-gray-200 p-3 text-left transition-all hover:border-pink-500 hover:bg-pink-50"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-gray-900">Buat Transaksi POS</div>
                    <div className="text-sm text-gray-500">Mulai transaksi penjualan baru</div>
                  </div>
                  <ArrowRight className="h-5 w-5 text-gray-400 transition-transform group-hover:translate-x-1 group-hover:text-pink-500" />
                </div>
              </button>
              <button
                onClick={() => router.push('/koperasi/inventory')}
                className="group w-full rounded-lg border border-gray-200 p-3 text-left transition-all hover:border-green-500 hover:bg-green-50"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-gray-900">Kelola Inventory</div>
                    <div className="text-sm text-gray-500">Tambah atau update produk</div>
                  </div>
                  <ArrowRight className="h-5 w-5 text-gray-400 transition-transform group-hover:translate-x-1 group-hover:text-green-500" />
                </div>
              </button>
              <button
                onClick={() => router.push('/koperasi/financial')}
                className="group w-full rounded-lg border border-gray-200 p-3 text-left transition-all hover:border-emerald-500 hover:bg-emerald-50"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-gray-900">Lihat Keuangan</div>
                    <div className="text-sm text-gray-500">Akses laporan keuangan</div>
                  </div>
                  <ArrowRight className="h-5 w-5 text-gray-400 transition-transform group-hover:translate-x-1 group-hover:text-emerald-500" />
                </div>
              </button>
              <button
                onClick={() => router.push('/koperasi/activity')}
                className="group w-full rounded-lg border border-gray-200 p-3 text-left transition-all hover:border-purple-500 hover:bg-purple-50"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-gray-900">Activity Logs</div>
                    <div className="text-sm text-gray-500">Monitor semua aktivitas</div>
                  </div>
                  <ArrowRight className="h-5 w-5 text-gray-400 transition-transform group-hover:translate-x-1 group-hover:text-purple-500" />
                </div>
              </button>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity Preview */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-purple-500" />
                Recent Activity
              </CardTitle>
              <button
                onClick={() => router.push('/koperasi/activity')}
                className="text-sm text-blue-600 hover:text-blue-700"
              >
                View All
              </button>
            </div>
          </CardHeader>
          <CardContent>
            {loadingRecentActivity ? (
              <div className="space-y-3">
                <SkeletonLoader variant="list" count={3} />
              </div>
            ) : recentActivityData?.logs && recentActivityData.logs.length > 0 ? (
              <div className="space-y-3">
                {recentActivityData.logs.map((log) => {
                  const { icon: Icon, color, bg } = getActivityIcon(log.module)
                  return (
                    <div
                      key={log.id}
                      className="flex items-start gap-3 rounded-lg border border-gray-200 p-3 transition-all hover:border-purple-300 hover:bg-purple-50/50"
                    >
                      <div
                        className={`flex h-8 w-8 items-center justify-center rounded-full ${bg}`}
                      >
                        <Icon className={`h-4 w-4 ${color}`} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0 flex-1">
                            <div className="truncate text-sm font-medium text-gray-900">
                              {log.action} • {log.module}
                            </div>
                            <div className="truncate text-xs text-gray-500">
                              {log.user.full_name || log.user.username}
                            </div>
                          </div>
                          <div className="flex shrink-0 items-center gap-1 text-xs text-gray-400">
                            <Clock className="h-3 w-3" />
                            {formatTime(log.created_at)}
                          </div>
                        </div>
                        {log.description && (
                          <div className="mt-1 line-clamp-1 text-xs text-gray-600">
                            {log.description}
                          </div>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="py-8 text-center text-gray-500">
                <Activity className="mx-auto h-12 w-12 text-gray-300" />
                <p className="mt-2 text-sm">No recent activity</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Charts Section - Side by Side */}
      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        {/* Activity Trends Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-purple-500" />
              Activity Trends
              {activityTrends && activityTrends.length > 0 && (
                <span className="text-sm font-normal text-gray-500">
                  (Last {activityTrends.length} days)
                </span>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loadingTrends ? (
              <div className="flex h-[300px] items-center justify-center">
                <div className="text-center">
                  <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-purple-500 border-t-transparent"></div>
                  <p className="mt-2 text-sm text-gray-500">Loading chart data...</p>
                </div>
              </div>
            ) : chartData.length > 0 ? (
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis
                      dataKey="date"
                      stroke="#6b7280"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis stroke="#6b7280" fontSize={12} tickLine={false} axisLine={false} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'white',
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="activities"
                      stroke="#8b5cf6"
                      strokeWidth={2}
                      dot={{ fill: '#8b5cf6', r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="flex h-[300px] items-center justify-center">
                <div className="text-center text-gray-500">
                  <TrendingUp className="mx-auto h-12 w-12 text-gray-300" />
                  <p className="mt-2 text-sm">No activity data available</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Best Sellers Chart */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <ShoppingCart className="h-5 w-5 text-pink-500" />
                Best Sellers
                <span className="text-sm font-normal text-gray-500">(Last 30 days)</span>
              </CardTitle>
              <button
                onClick={() => router.push('/koperasi/inventory')}
                className="text-sm text-blue-600 hover:text-blue-700"
              >
                View All
              </button>
            </div>
          </CardHeader>
          <CardContent>
            {loadingBestSellers ? (
              <div className="flex h-[300px] items-center justify-center">
                <div className="text-center">
                  <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-pink-500 border-t-transparent"></div>
                  <p className="mt-2 text-sm text-gray-500">Loading best sellers...</p>
                </div>
              </div>
            ) : bestSellers && bestSellers.length > 0 ? (
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={bestSellers}
                    layout="vertical"
                    margin={{ top: 5, right: 20, left: 80, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis type="number" stroke="#6b7280" fontSize={12} />
                    <YAxis
                      type="category"
                      dataKey="product_name"
                      stroke="#6b7280"
                      fontSize={11}
                      width={75}
                      tickFormatter={(value) =>
                        value.length > 12 ? value.substring(0, 12) + '...' : value
                      }
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'white',
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                      }}
                      formatter={(value: number, name: string) => {
                        if (name === 'total_quantity') {
                          return [value + ' items', 'Sold']
                        }
                        return [formatCurrency(value), 'Revenue']
                      }}
                      labelFormatter={(label) => `Product: ${label}`}
                    />
                    <Bar dataKey="total_quantity" radius={[0, 8, 8, 0]}>
                      {bestSellers.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={
                            [
                              '#ec4899',
                              '#f472b6',
                              '#fb7185',
                              '#fda4af',
                              '#fecdd3',
                              '#fecaca',
                              '#fed7aa',
                              '#fdba74',
                              '#fb923c',
                              '#f97316',
                            ][index] || '#e5e7eb'
                          }
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="flex h-[300px] items-center justify-center">
                <div className="text-center text-gray-500">
                  <ShoppingCart className="mx-auto h-12 w-12 text-gray-300" />
                  <p className="mt-2 text-sm">No sales data available</p>
                  <p className="text-xs">Start selling to see best sellers!</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Toast Demo Section */}
      <Card className="border-2 border-indigo-200 bg-linear-to-br from-indigo-50 to-purple-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-indigo-900">
            <Bell className="h-5 w-5" />
            Toast Notification Demo
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600 mb-4">
            Test the global toast notification system dengan berbagai tipe:
          </p>
          <div className="flex flex-wrap gap-3">
            <Button
              onClick={() => toast.success('Berhasil!', 'Data berhasil disimpan ke database')}
              className="bg-green-600 hover:bg-green-700"
            >
              ✓ Success Toast
            </Button>
            <Button
              onClick={() => toast.error('Error!', 'Terjadi kesalahan saat menyimpan data')}
              className="bg-red-600 hover:bg-red-700"
            >
              ✕ Error Toast
            </Button>
            <Button
              onClick={() => toast.warning('Peringatan!', 'Stok barang hampir habis')}
              className="bg-orange-600 hover:bg-orange-700"
            >
              ⚠ Warning Toast
            </Button>
            <Button
              onClick={() => toast.info('Informasi', 'Ada pembaruan sistem tersedia')}
              className="bg-blue-600 hover:bg-blue-700"
            >
              ℹ Info Toast
            </Button>
            <Button
              onClick={() => {
                toast.success('Toast 1', 'Ini toast pertama')
                setTimeout(() => toast.error('Toast 2', 'Ini toast kedua'), 500)
                setTimeout(() => toast.warning('Toast 3', 'Ini toast ketiga'), 1000)
                setTimeout(() => toast.info('Toast 4', 'Ini toast keempat'), 1500)
              }}
              variant="outline"
              className="border-2 border-indigo-300 text-indigo-700 hover:bg-indigo-50"
            >
              🎯 Multiple Toasts
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Logout Modal */}
      <LogoutModal isOpen={showLogoutModal} onClose={() => setShowLogoutModal(false)} />
    </PageContainer>
  )
}
