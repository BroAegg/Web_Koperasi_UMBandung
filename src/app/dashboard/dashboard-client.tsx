'use client'

import { Wallet, TrendingUp, ShoppingCart, Package, Users } from 'lucide-react'
import { AppLayout } from '@/components/layout/app-layout'
import { MetricsCard } from '@/components/dashboard/metrics-card'
import { RevenueChart } from '@/components/dashboard/revenue-chart'
import { BalanceChart } from '@/components/dashboard/balance-chart'
import { RecentActivity } from '@/components/dashboard/recent-activity'
import { QuickActions } from '@/components/dashboard/quick-actions'
import { useTheme } from '@/contexts/theme-context'

interface DashboardClientProps {
  session: {
    userId: string
    username: string
    email: string | null
    fullName: string
    role: string
    isActive: boolean
    expiresAt: Date
  }
}

export function DashboardClient({ session }: DashboardClientProps) {
  const { theme } = useTheme()

  return (
    <AppLayout session={session}>
      <div className="space-y-6">
        {/* Welcome Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-semibold">Welcome back, {session.fullName}! 👋</h1>
          <p className={`mt-1 text-sm ${theme.subtext}`}>
            Here&apos;s what&apos;s happening with your cooperative today
          </p>
        </div>

        {/* Metrics Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
          <MetricsCard
            title="Total Balance"
            value="Rp 67.5M"
            trend={{ value: 12.5, isPositive: true }}
          />
          <MetricsCard
            title="Today's Revenue"
            value="Rp 4.3M"
            trend={{ value: 8.2, isPositive: true }}
          />
          <MetricsCard
            title="Pending Orders"
            value="23"
            trend={{ value: 3.1, isPositive: false }}
          />
          <MetricsCard title="Low Stock Items" value="12" />
          <MetricsCard
            title="Active Members"
            value="156"
            trend={{ value: 5.4, isPositive: true }}
          />
        </div>

        {/* Charts Row */}
        <div className="grid gap-4 md:grid-cols-2">
          <RevenueChart />
          <BalanceChart />
        </div>

        {/* Activity and Quick Actions Row */}
        <div className="grid gap-4 md:grid-cols-2">
          <RecentActivity />
          <QuickActions session={session} />
        </div>
      </div>
    </AppLayout>
  )
}
