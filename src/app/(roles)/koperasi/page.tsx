'use client'

import { PageContainer } from '@/components/shared/PageContainer'
import { PageHeader } from '@/components/shared/PageHeader'
import { StatsCard } from '@/components/shared/StatsCard'
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

export default function KoperasiDashboard() {
  // TODO: Replace with real data from tRPC
  const stats = {
    suppliers: 25,
    products: 456,
    users: 12,
    revenue: 15000000,
    inventory: 234,
    orders: 89,
    activeMembers: 45,
    activities: 1245,
  }

  return (
    <PageContainer>
      <PageHeader
        title="Dashboard Koperasi"
        subtitle="Kelola dan monitor seluruh sistem koperasi"
      />

      {/* Stats Grid - Module Cards */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        <StatsCard
          title="Total Suppliers"
          value={stats.suppliers}
          subtitle="Supplier aktif"
          icon={Users}
          gradient="blue"
          trend={{ value: '+12% dari bulan lalu', isPositive: true }}
        />

        <StatsCard
          title="Total Products"
          value={stats.products}
          subtitle="Produk tersedia"
          icon={Package}
          gradient="green"
          trend={{ value: '+8% dari bulan lalu', isPositive: true }}
        />

        <StatsCard
          title="Total Users"
          value={stats.users}
          subtitle="Pengguna sistem"
          icon={UserCog}
          gradient="purple"
          trend={{ value: '+2 user baru', isPositive: true }}
        />

        <StatsCard
          title="Revenue"
          value={`Rp ${(stats.revenue / 1000000).toFixed(1)}M`}
          subtitle="Total pendapatan"
          icon={DollarSign}
          gradient="emerald"
          trend={{ value: '+15% dari bulan lalu', isPositive: true }}
        />

        <StatsCard
          title="Inventory"
          value={stats.inventory}
          subtitle="Total items"
          icon={Box}
          gradient="orange"
          trend={{ value: '12 low stock alerts', isPositive: false }}
        />

        <StatsCard
          title="Orders"
          value={stats.orders}
          subtitle="Transaksi hari ini"
          icon={ShoppingCart}
          gradient="pink"
          trend={{ value: '+5 dari kemarin', isPositive: true }}
        />

        <StatsCard
          title="Members"
          value={stats.activeMembers}
          subtitle="Anggota aktif"
          icon={Users}
          gradient="blue"
          trend={{ value: '+3 member baru', isPositive: true }}
        />

        <StatsCard
          title="Activity Logs"
          value={stats.activities}
          subtitle="Total log aktivitas"
          icon={Activity}
          gradient="purple"
          trend={{ value: 'Last 30 days', isPositive: true }}
        />
      </div>

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
