'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Home,
  DollarSign,
  ShoppingCart,
  Package,
  Users,
  Building2,
  Activity,
  Settings,
  LogOut,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { getCurrentUser, type UserData } from '@/lib/user-utils'

const navigationItems = [
  { name: 'Dashboard', href: '/koperasi', icon: Home },
  { name: 'Financial', href: '/koperasi/financial', icon: DollarSign },
  { name: 'POS', href: '/koperasi/pos', icon: ShoppingCart },
  { name: 'Inventory', href: '/koperasi/inventory', icon: Package },
  { name: 'Members', href: '/koperasi/members', icon: Users },
  { name: 'Suppliers', href: '/koperasi/suppliers', icon: Building2 },
  { name: 'Activity', href: '/koperasi/activity', icon: Activity },
  { name: 'Settings', href: '/koperasi/settings', icon: Settings },
]

interface DesktopSidebarProps {
  onLogout?: () => void
}

export function DesktopSidebar({ onLogout }: DesktopSidebarProps) {
  const pathname = usePathname()
  // Initialize with null, then load on client side only
  const [userData, setUserData] = useState<UserData | null>(null)

  useEffect(() => {
    // Load user data only on client side
    // Use setTimeout to defer setState to next tick
    const timer = setTimeout(() => setUserData(getCurrentUser()), 0)
    return () => clearTimeout(timer)
  }, [])

  return (
    <aside className="hidden border-r border-gray-200 bg-white lg:fixed lg:inset-y-0 lg:left-0 lg:z-30 lg:flex lg:w-64 lg:flex-col">
      <div className="flex h-full flex-col">
        {/* Sidebar Header */}
        <div className="flex items-center gap-3 border-b border-gray-200 px-6 py-5">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-linear-to-br from-blue-600 to-indigo-600 shadow-lg">
            <span className="text-xl font-bold text-white">K</span>
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900">Koperasi</h2>
            <p className="text-xs text-gray-500">UM Bandung</p>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 overflow-y-auto px-4 py-6">
          <div className="space-y-2">
            {navigationItems.map((item) => {
              const isActive = pathname === item.href || pathname?.startsWith(item.href + '/')
              const Icon = item.icon

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`group flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-blue-50 text-blue-600 shadow-sm'
                      : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  <Icon
                    className={`h-5 w-5 transition-transform group-hover:scale-110 ${
                      isActive ? 'text-blue-600' : 'text-gray-500'
                    }`}
                  />
                  {item.name}
                  {isActive && (
                    <div className="ml-auto h-2 w-2 animate-pulse rounded-full bg-blue-600" />
                  )}
                </Link>
              )
            })}
          </div>
        </nav>

        {/* User Info & Logout */}
        <div className="border-t border-gray-200 p-4">
          <div className="mb-3 rounded-lg bg-gray-50 p-3">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-linear-to-br from-purple-500 to-pink-500 text-sm font-bold text-white">
                {userData?.initials || 'U'}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-gray-900">
                  {userData?.fullName || 'User'}
                </p>
                <p className="text-xs text-gray-500">{userData?.email || 'user@koperasi.com'}</p>
              </div>
            </div>
          </div>
          <Button
            onClick={onLogout}
            variant="outline"
            className="w-full justify-start gap-2 border-2 border-red-200 text-red-600 hover:border-red-300 hover:bg-red-50 hover:text-red-700"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </div>
      </div>
    </aside>
  )
}
