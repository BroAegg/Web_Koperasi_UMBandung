'use client'

import { useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import { Bell, Search, Menu, LogOut, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { ThemeToggle } from '@/components/ui/theme-toggle'
import { cn } from '@/lib/utils'

interface HeaderProps {
  session: {
    userId: string
    username: string
    email: string | null
    fullName: string
    role: string
    isActive: boolean
    expiresAt: Date
  }
  sidebarCollapsed?: boolean
  onMobileMenuToggle?: () => void
}

const routeNames: Record<string, string> = {
  dashboard: 'Dashboard',
  financial: 'Keuangan',
  inventory: 'Inventori',
  pos: 'POS',
  suppliers: 'Supplier',
  members: 'Anggota',
  reports: 'Laporan',
  'activity-logs': 'Aktivitas',
  users: 'Pengguna',
  settings: 'Pengaturan',
}

export function Header({ session, sidebarCollapsed, onMobileMenuToggle }: HeaderProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [searchQuery, setSearchQuery] = useState('')

  // Generate breadcrumbs
  const pathSegments = pathname.split('/').filter(Boolean)
  const breadcrumbs = pathSegments.map((segment, index) => ({
    label: routeNames[segment] || segment.charAt(0).toUpperCase() + segment.slice(1),
    href: '/' + pathSegments.slice(0, index + 1).join('/'),
    isLast: index === pathSegments.length - 1,
  }))

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
      router.push('/login')
      router.refresh()
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      // TODO: Implement global search
      console.log('Search:', searchQuery)
    }
  }

  return (
    <header
      className={cn(
        'bg-background fixed top-0 right-0 z-30 h-16 border-b transition-all duration-300',
        sidebarCollapsed ? 'left-16' : 'left-64',
        'max-lg:left-0'
      )}
    >
      <div className="flex h-full items-center justify-between px-4 lg:px-6">
        {/* Left: Mobile Menu + Breadcrumbs */}
        <div className="flex min-w-0 flex-1 items-center space-x-4">
          {/* Mobile Menu Toggle */}
          <Button variant="ghost" size="icon" className="lg:hidden" onClick={onMobileMenuToggle}>
            <Menu className="h-5 w-5" />
          </Button>

          {/* Breadcrumbs */}
          <nav className="text-muted-foreground hidden items-center space-x-2 text-sm md:flex">
            <Link href="/dashboard" className="hover:text-foreground transition-colors">
              Home
            </Link>
            {breadcrumbs.map((crumb) => (
              <div key={crumb.href} className="flex items-center space-x-2">
                <ChevronRight className="h-4 w-4" />
                {crumb.isLast ? (
                  <span className="text-foreground font-medium">{crumb.label}</span>
                ) : (
                  <Link href={crumb.href} className="hover:text-foreground transition-colors">
                    {crumb.label}
                  </Link>
                )}
              </div>
            ))}
          </nav>
        </div>

        {/* Right: Search, Notifications, Theme, Profile */}
        <div className="flex items-center space-x-2">
          {/* Search */}
          <form onSubmit={handleSearch} className="hidden md:block">
            <div className="relative">
              <Search className="text-muted-foreground absolute top-2.5 left-2.5 h-4 w-4" />
              <Input
                type="search"
                placeholder="Cari..."
                className="w-[200px] pl-8 lg:w-[300px]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </form>

          {/* Notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <DropdownMenuLabel>Notifikasi</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <div className="text-muted-foreground p-4 text-center text-sm">
                Tidak ada notifikasi baru
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Theme Toggle */}
          <ThemeToggle />

          {/* Profile Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-10 pr-3 pl-2">
                <div className="flex items-center space-x-2">
                  <div className="bg-primary/10 text-primary flex h-7 w-7 items-center justify-center rounded-full text-sm font-semibold">
                    {session.fullName.charAt(0).toUpperCase()}
                  </div>
                  <span className="hidden text-sm font-medium lg:block">{session.fullName}</span>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium">{session.fullName}</p>
                  <p className="text-muted-foreground text-xs">@{session.username}</p>
                  {session.email && (
                    <p className="text-muted-foreground text-xs">{session.email}</p>
                  )}
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/profile">Profil Saya</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/settings">Pengaturan</Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={handleLogout}
                className="text-destructive focus:text-destructive"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
