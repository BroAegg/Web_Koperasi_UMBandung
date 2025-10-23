import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth'
import { User } from 'lucide-react'
import { AppLayout } from '@/components/layout/app-layout'
import { getRoleDisplayName, getRoleBadgeColor } from '@/lib/permissions'

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

        {/* User Info Card */}
        <div className="bg-card rounded-lg border p-6">
          <div className="flex items-center space-x-4">
            <div className="bg-primary/10 flex h-16 w-16 items-center justify-center rounded-full">
              <User className="text-primary h-8 w-8" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">{session.fullName}</h2>
              <p className="text-muted-foreground">@{session.username}</p>
              {session.email && <p className="text-muted-foreground text-sm">{session.email}</p>}
            </div>
            <div className="ml-auto">
              <span
                className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ${getRoleBadgeColor(session.role as 'DEVELOPER' | 'SUPER_ADMIN' | 'ADMIN' | 'KASIR' | 'STAFF' | 'SUPPLIER')} `}
              >
                {getRoleDisplayName(
                  session.role as
                    | 'DEVELOPER'
                    | 'SUPER_ADMIN'
                    | 'ADMIN'
                    | 'KASIR'
                    | 'STAFF'
                    | 'SUPPLIER'
                )}
              </span>
            </div>
          </div>
        </div>

        {/* Session Info */}
        <div className="bg-card rounded-lg border p-6">
          <h3 className="mb-4 text-lg font-semibold">Session Information</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">User ID:</span>
              <span className="font-mono">{session.userId}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Username:</span>
              <span className="font-mono">{session.username}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Role:</span>
              <span className="font-mono">{session.role}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Status:</span>
              <span className={session.isActive ? 'text-green-600' : 'text-red-600'}>
                {session.isActive ? 'Active' : 'Inactive'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Session Expires:</span>
              <span>{new Date(session.expiresAt).toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Phase 2.2 Complete Notice */}
        <div className="rounded-lg border border-blue-200 bg-blue-50 p-6 dark:border-blue-800 dark:bg-blue-950">
          <h3 className="mb-2 text-lg font-semibold text-blue-900 dark:text-blue-100">
            ✅ Phase 2.2 Complete: Layout & Navigation
          </h3>
          <p className="text-sm text-blue-800 dark:text-blue-200">
            Professional layout with collapsible sidebar, responsive header, and mobile navigation!
          </p>
          <ul className="mt-4 space-y-1 text-sm text-blue-700 dark:text-blue-300">
            <li>• Collapsible sidebar with role-based menu filtering</li>
            <li>• Responsive header with breadcrumbs & search</li>
            <li>• Mobile bottom navigation with sheet menu</li>
            <li>• Theme toggle & user profile dropdown</li>
            <li>• Smooth transitions & dark mode support</li>
          </ul>
        </div>
      </div>
    </AppLayout>
  )
}
