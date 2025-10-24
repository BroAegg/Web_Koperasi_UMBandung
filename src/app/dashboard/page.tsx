import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth'
import { Wallet, TrendingUp, ShoppingCart, Package, Users } from 'lucide-react'
import { AppLayout } from '@/components/layout/app-layout'
import { MetricsCard } from '@/components/dashboard/metrics-card'
import { RevenueChart } from '@/components/dashboard/revenue-chart'
import { BalanceChart } from '@/components/dashboard/balance-chart'
import { RecentActivity } from '@/components/dashboard/recent-activity'
import { QuickActions } from '@/components/dashboard/quick-actions'

export default async function DashboardPage() {
  const session = await getSession()

  // Redirect to login if no session
  if (!session) {
    redirect('/login')
  }

  return (
    <AppLayout session={session}>
      <div className="space-y-6">
        {/* Welcome Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Welcome back, {session.fullName}! 👋</h1>
          <p className="text-muted-foreground mt-1">
            Here&apos;s what&apos;s happening with your cooperative today
          </p>
        </div>

        {/* Metrics Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
          <MetricsCard
            title="Total Balance"
            value="Rp 67.5M"
            icon={Wallet}
            description="Current cooperative balance"
            trend={{ value: 12.5, isPositive: true }}
            colorClass="text-green-600"
          />
          <MetricsCard
            title="Today's Revenue"
            value="Rp 4.3M"
            icon={TrendingUp}
            description="Revenue from all transactions"
            trend={{ value: 8.2, isPositive: true }}
            colorClass="text-blue-600"
          />
          <MetricsCard
            title="Pending Orders"
            value="23"
            icon={ShoppingCart}
            description="Orders awaiting fulfillment"
            trend={{ value: 3.1, isPositive: false }}
            colorClass="text-orange-600"
          />
          <MetricsCard
            title="Low Stock Items"
            value="12"
            icon={Package}
            description="Products need restock"
            colorClass="text-red-600"
          />
          <MetricsCard
            title="Active Members"
            value="156"
            icon={Users}
            description="Registered members"
            trend={{ value: 5.4, isPositive: true }}
            colorClass="text-purple-600"
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

        {/* Phase 3.1 Complete Notice */}
        <div className="rounded-lg border border-blue-200 bg-blue-50 p-6 dark:border-blue-800 dark:bg-blue-950">
          <h3 className="mb-2 text-lg font-semibold text-blue-900 dark:text-blue-100">
            ✅ Phase 3.1 Complete: Dashboard Page Rebuild
          </h3>
          <p className="text-sm text-blue-800 dark:text-blue-200">
            Modern dashboard with metrics cards, interactive charts, activity timeline, and quick
            actions!
          </p>
          <ul className="mt-4 space-y-1 text-sm text-blue-700 dark:text-blue-300">
            <li>• Hero metrics cards with trend indicators</li>
            <li>• Interactive revenue & balance charts (Recharts)</li>
            <li>• Recent activity timeline with user avatars</li>
            <li>• Role-based quick actions panel</li>
            <li>• Loading skeletons & dark mode support</li>
          </ul>
        </div>
      </div>
    </AppLayout>
  )
}
