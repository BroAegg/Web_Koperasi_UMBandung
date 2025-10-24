'use client'

import { useState } from 'react'
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
  Menu,
  X,
  LogOut,
} from 'lucide-react'
import { Button } from '@/components/ui/button'

const navigationItems = [
  { name: 'Dashboard', href: '/koperasi', icon: Home },
  { name: 'Financial', href: '/koperasi/financial', icon: DollarSign },
  { name: 'POS', href: '/koperasi/pos', icon: ShoppingCart },
  { name: 'Inventory', href: '/koperasi/inventori', icon: Package },
  { name: 'Members', href: '/koperasi/members', icon: Users },
  { name: 'Suppliers', href: '/koperasi/suppliers', icon: Building2 },
  { name: 'Activity', href: '/koperasi/activity', icon: Activity },
  { name: 'Settings', href: '/koperasi/settings', icon: Settings },
]

interface MobileNavProps {
  onLogout?: () => void
}

export function MobileNav({ onLogout }: MobileNavProps) {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  const toggleMenu = () => setIsOpen(!isOpen)
  const closeMenu = () => setIsOpen(false)

  return (
    <>
      {/* Mobile Header */}
      <div className="fixed top-0 right-0 left-0 z-40 border-b border-gray-200 bg-white lg:hidden">
        <div className="flex items-center justify-between px-4 py-3">
          {/* Logo & Title */}
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-linear-to-br from-blue-600 to-indigo-600">
              <span className="text-lg font-bold text-white">K</span>
            </div>
            <div>
              <h1 className="text-sm font-bold text-gray-900">Koperasi</h1>
              <p className="text-xs text-gray-500">UM Bandung</p>
            </div>
          </div>

          {/* Hamburger Button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleMenu}
            className="h-10 w-10"
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>
      </div>

      {/* Spacer for fixed header */}
      <div className="h-16 lg:hidden" />

      {/* Mobile Sidebar Overlay */}
      {isOpen && (
        <div
          className="animate-in fade-in fixed inset-0 z-50 bg-black/50 backdrop-blur-sm duration-200 lg:hidden"
          onClick={closeMenu}
        />
      )}

      {/* Mobile Sidebar */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-72 transform bg-white shadow-xl transition-transform duration-300 ease-in-out lg:hidden ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex h-full flex-col">
          {/* Sidebar Header */}
          <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-linear-to-br from-blue-600 to-indigo-600">
                <span className="text-lg font-bold text-white">K</span>
              </div>
              <div>
                <h2 className="text-base font-bold text-gray-900">Koperasi</h2>
                <p className="text-xs text-gray-500">UM Bandung</p>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={closeMenu} className="h-8 w-8">
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 overflow-y-auto px-3 py-4">
            <div className="space-y-1">
              {navigationItems.map((item) => {
                const isActive = pathname === item.href || pathname?.startsWith(item.href + '/')
                const Icon = item.icon

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={closeMenu}
                    className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-blue-50 text-blue-600'
                        : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                    }`}
                  >
                    <Icon className={`h-5 w-5 ${isActive ? 'text-blue-600' : 'text-gray-500'}`} />
                    {item.name}
                  </Link>
                )
              })}
            </div>
          </nav>

          {/* Logout Button */}
          <div className="border-t border-gray-200 p-4">
            <Button
              onClick={() => {
                closeMenu()
                onLogout?.()
              }}
              variant="outline"
              className="w-full justify-start gap-2 border-2 border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </aside>
    </>
  )
}
