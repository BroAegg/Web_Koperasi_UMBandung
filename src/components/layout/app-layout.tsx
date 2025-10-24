'use client'

import { useState, useRef, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { Sidebar } from './sidebar'
import { Header } from './header'
import { MobileNav } from './mobile-nav'
import { cn } from '@/lib/utils'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'

interface AppLayoutProps {
  children: React.ReactNode
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

export function AppLayout({ children, session }: AppLayoutProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('sidebar-collapsed')
      return saved === 'true'
    }
    return false
  })
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const pathname = usePathname()
  const prevPathname = useRef(pathname)

  // Sync sidebar collapsed state with localStorage
  const handleSidebarToggle = (collapsed: boolean) => {
    setSidebarCollapsed(collapsed)
    if (typeof window !== 'undefined') {
      localStorage.setItem('sidebar-collapsed', String(collapsed))
    }
  }

  // Close mobile menu on route change
  // This is a legitimate use case for setState in effect - we want the menu to close when navigating
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (prevPathname.current !== pathname) {
      prevPathname.current = pathname
      setMobileMenuOpen(false)
    }
  })

  return (
    <div className="bg-background min-h-screen">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        <Sidebar session={session} onToggle={handleSidebarToggle} />
      </div>

      {/* Mobile Sidebar Sheet */}
      <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
        <SheetContent side="left" className="w-64 p-0">
          <SheetHeader className="border-b px-4 py-3">
            <SheetTitle>Menu</SheetTitle>
          </SheetHeader>
          <div className="h-[calc(100vh-60px)] overflow-y-auto">
            <Sidebar session={session} onToggle={() => {}} />
          </div>
        </SheetContent>
      </Sheet>

      {/* Header */}
      <Header
        session={session}
        sidebarCollapsed={sidebarCollapsed}
        onMobileMenuToggle={() => setMobileMenuOpen(!mobileMenuOpen)}
      />

      {/* Main Content */}
      <main
        className={cn(
          'pt-16 pb-20 transition-all duration-300 lg:pb-6',
          sidebarCollapsed ? 'lg:pl-16' : 'lg:pl-64'
        )}
      >
        <div className="container mx-auto px-4 py-6 lg:px-6">{children}</div>
      </main>

      {/* Mobile Bottom Navigation */}
      <MobileNav session={session} onMenuClick={() => setMobileMenuOpen(!mobileMenuOpen)} />
    </div>
  )
}
