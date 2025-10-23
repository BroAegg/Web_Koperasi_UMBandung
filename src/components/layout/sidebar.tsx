'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { canAccessModule, getRoleDisplayName } from '@/lib/permissions'
import { Button } from '@/components/ui/button'
import {
  LayoutDashboard,
  Wallet,
  Package,
  ShoppingCart,
  Truck,
  Users,
  FileText,
  Activity,
  ChevronLeft,
  ChevronRight,
  ShoppingBag,
} from 'lucide-react'

interface SidebarProps {
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

interface MenuItem {
  title: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  module: string
  badge?: string
}

const menuItems: MenuItem[] = [
  {
    title: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
    module: 'dashboard',
  },
  {
    title: 'Keuangan',
    href: '/financial',
    icon: Wallet,
    module: 'financial',
  },
  {
    title: 'Inventori',
    href: '/inventory',
    icon: Package,
    module: 'inventory',
  },
  {
    title: 'POS',
    href: '/pos',
    icon: ShoppingCart,
    module: 'pos',
  },
  {
    title: 'Supplier',
    href: '/suppliers',
    icon: Truck,
    module: 'suppliers',
  },
  {
    title: 'Anggota',
    href: '/members',
    icon: Users,
    module: 'members',
  },
  {
    title: 'Laporan',
    href: '/reports',
    icon: FileText,
    module: 'reports',
  },
  {
    title: 'Aktivitas',
    href: '/activity-logs',
    icon: Activity,
    module: 'activity-logs',
  },
]

export function Sidebar({ session }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false)
  const pathname = usePathname()

  // Filter menu items based on user role permissions
  const filteredMenuItems = menuItems.filter((item) =>
    canAccessModule(
      session.role as 'DEVELOPER' | 'SUPER_ADMIN' | 'ADMIN' | 'KASIR' | 'STAFF' | 'SUPPLIER',
      item.module
    )
  )

  return (
    <aside
      className={cn(
        'bg-card fixed top-0 left-0 z-40 h-screen border-r transition-all duration-300',
        collapsed ? 'w-16' : 'w-64'
      )}
    >
      {/* Logo & Brand */}
      <div className="flex h-16 items-center justify-between border-b px-4">
        {!collapsed && (
          <Link href="/dashboard" className="flex items-center space-x-2">
            <ShoppingBag className="text-primary h-6 w-6" />
            <span className="text-lg font-bold">Koperasi UMB</span>
          </Link>
        )}
        {collapsed && (
          <Link href="/dashboard" className="flex w-full items-center justify-center">
            <ShoppingBag className="text-primary h-6 w-6" />
          </Link>
        )}
      </div>

      {/* User Info */}
      <div className="border-b p-4">
        <div className="flex items-center space-x-3">
          <div
            className={cn(
              'bg-primary/10 text-primary flex items-center justify-center rounded-full font-semibold',
              collapsed ? 'h-8 w-8 text-sm' : 'h-10 w-10'
            )}
          >
            {session.fullName.charAt(0).toUpperCase()}
          </div>
          {!collapsed && (
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">{session.fullName}</p>
              <p className="text-muted-foreground truncate text-xs">
                {getRoleDisplayName(
                  session.role as
                    | 'DEVELOPER'
                    | 'SUPER_ADMIN'
                    | 'ADMIN'
                    | 'KASIR'
                    | 'STAFF'
                    | 'SUPPLIER'
                )}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 overflow-y-auto p-4">
        {filteredMenuItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`)

          return (
            <Link key={item.href} href={item.href}>
              <Button
                variant={isActive ? 'default' : 'ghost'}
                className={cn(
                  'w-full justify-start',
                  collapsed && 'justify-center px-2',
                  !collapsed && 'px-3'
                )}
                title={collapsed ? item.title : undefined}
              >
                <Icon className={cn('h-5 w-5', !collapsed && 'mr-2')} />
                {!collapsed && <span>{item.title}</span>}
                {!collapsed && item.badge && (
                  <span className="bg-primary/20 text-primary ml-auto rounded-full px-2 py-0.5 text-xs font-semibold">
                    {item.badge}
                  </span>
                )}
              </Button>
            </Link>
          )
        })}
      </nav>

      {/* Collapse Toggle */}
      <div className="border-t p-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setCollapsed(!collapsed)}
          className="w-full justify-center"
        >
          {collapsed ? (
            <ChevronRight className="h-5 w-5" />
          ) : (
            <>
              <ChevronLeft className="mr-2 h-5 w-5" />
              <span>Collapse</span>
            </>
          )}
        </Button>
      </div>
    </aside>
  )
}
