'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { canAccessModule } from '@/lib/permissions'
import { LayoutDashboard, Wallet, Package, ShoppingCart, Menu } from 'lucide-react'

interface MobileNavProps {
  session: {
    userId: string
    username: string
    email: string | null
    fullName: string
    role: string
    isActive: boolean
    expiresAt: Date
  }
  onMenuClick: () => void
}

interface NavItem {
  title: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  module: string
}

const navItems: NavItem[] = [
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
    title: 'POS',
    href: '/pos',
    icon: ShoppingCart,
    module: 'pos',
  },
  {
    title: 'Inventori',
    href: '/inventory',
    icon: Package,
    module: 'inventory',
  },
]

export function MobileNav({ session, onMenuClick }: MobileNavProps) {
  const pathname = usePathname()

  // Filter nav items based on user role permissions
  const filteredNavItems = navItems.filter((item) =>
    canAccessModule(
      session.role as 'DEVELOPER' | 'SUPER_ADMIN' | 'ADMIN' | 'KASIR' | 'STAFF' | 'SUPPLIER',
      item.module
    )
  )

  return (
    <nav className="bg-card fixed right-0 bottom-0 left-0 z-40 border-t lg:hidden">
      <div className="flex h-16 items-center justify-around px-2">
        {filteredNavItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`)

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex h-full flex-1 flex-col items-center justify-center space-y-1 transition-colors',
                isActive ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
              )}
            >
              <Icon className="h-5 w-5" />
              <span className="text-xs font-medium">{item.title}</span>
            </Link>
          )
        })}

        {/* More Menu Button */}
        <button
          onClick={onMenuClick}
          className="text-muted-foreground hover:text-foreground flex h-full flex-1 flex-col items-center justify-center space-y-1 transition-colors"
        >
          <Menu className="h-5 w-5" />
          <span className="text-xs font-medium">Menu</span>
        </button>
      </div>
    </nav>
  )
}
