'use client'

import { useState } from 'react'
import { MobileNav } from './MobileNav'
import { DesktopSidebar } from './DesktopSidebar'
import { LogoutModal } from '@/components/shared/LogoutModal'
import { SkipLink } from '@/components/shared/SkipLink'

interface ResponsiveLayoutProps {
  children: React.ReactNode
}

export function ResponsiveLayout({ children }: ResponsiveLayoutProps) {
  const [showLogoutModal, setShowLogoutModal] = useState(false)

  const handleLogout = () => {
    setShowLogoutModal(true)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Skip to main content for keyboard users */}
      <SkipLink />

      {/* Mobile Navigation */}
      <MobileNav onLogout={handleLogout} />

      {/* Desktop Sidebar */}
      <DesktopSidebar onLogout={handleLogout} />

      {/* Main Content Area */}
      <main id="main-content" className="lg:pl-64" tabIndex={-1}>
        <div className="px-4 py-6 sm:px-6 lg:px-8 lg:py-8">{children}</div>
      </main>

      {/* Logout Modal */}
      <LogoutModal isOpen={showLogoutModal} onClose={() => setShowLogoutModal(false)} />
    </div>
  )
}
