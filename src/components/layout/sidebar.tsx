'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { canAccessModule, getRoleDisplayName } from '@/lib/permissions'
import { Button } from '@/components/ui/button'
import { useTheme } from '@/contexts/theme-context'
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
  onToggle?: (collapsed: boolean) => void
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
    href: '/keuangan',
    icon: Wallet,
    module: 'financial',
  },
  {
    title: 'Inventori',
    href: '/inventori',
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

export function Sidebar({ session, onToggle }: SidebarProps) {
  const { theme } = useTheme()
  const [collapsed, setCollapsed] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('sidebar-collapsed')
      return saved === 'true'
    }
    return false
  })
  const pathname = usePathname()

  const handleToggle = () => {
    const newCollapsed = !collapsed
    setCollapsed(newCollapsed)
    if (typeof window !== 'undefined') {
      localStorage.setItem('sidebar-collapsed', String(newCollapsed))
    }
    onToggle?.(newCollapsed)
  }

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
        'fixed top-0 left-0 z-40 h-screen border-r transition-all duration-300',
        theme.card,
        theme.border,
        collapsed ? 'w-20' : 'w-64'
      )}
    >
      {/* Logo & Brand - Orange to Green Gradient! */}
      <div className={`flex h-16 items-center justify-between border-b px-4 ${theme.border}`}>
        <div className="flex items-center gap-3">
          {/* Snippet style: gradient logo */}
          <div className="h-8 w-8 rounded-xl bg-gradient-to-tr from-orange-500 to-green-400" />
          {!collapsed && (
            <span className={`font-semibold tracking-tight ${theme.text}`}>Koperasi UMB</span>
          )}
        </div>
        <Button size="icon" variant="ghost" className="h-8 w-8" onClick={handleToggle}>
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>

      {/* User Info */}
      <div className={`border-b p-3 ${theme.border}`}>
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-gray-400/20" />
          {!collapsed && (
            <div className="min-w-0 flex-1">
              <p className={`truncate text-sm font-medium ${theme.text}`}>{session.fullName}</p>
              <p className={`truncate text-xs ${theme.subtext}`}>
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

      {/* Navigation - Snippet style! */}
      <nav className="mt-3 px-2">
        {filteredMenuItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`)

          return (
            <Link key={item.href} href={item.href}>
              <button
                className={cn(
                  'group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors',
                  isActive ? theme.navActive + ' font-medium' : theme.navHover
                )}
              >
                <Icon className="h-5 w-5" />
                {!collapsed && <span>{item.title}</span>}
              </button>
            </Link>
          )
        })}
      </nav>

      {/* Bottom section */}
      <div className={`absolute right-0 bottom-0 left-0 border-t p-3 ${theme.border}`}>
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-gray-400/20" />
          {!collapsed && (
            <div>
              <p className={`text-sm font-medium ${theme.text}`}>Administrator</p>
              <p className={`text-xs ${theme.subtext}`}>Admin</p>
            </div>
          )}
        </div>
      </div>
    </aside>
  )
}
