import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth'
import { LogOut, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { getRoleDisplayName, getRoleBadgeColor } from '@/lib/permissions'

export default async function DashboardPage() {
  const session = await getSession()

  // Redirect to login if no session
  if (!session) {
    redirect('/login')
  }

  return (
    <div className="bg-background min-h-screen">
      {/* Header */}
      <header className="bg-card border-b">
        <div className="container mx-auto flex items-center justify-between px-4 py-4">
          <div>
            <h1 className="text-2xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground text-sm">Welcome to Web Koperasi UMB</p>
          </div>
          <form action="/api/auth/logout" method="POST">
            <Button type="submit" variant="outline" size="sm">
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </form>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* User Info Card */}
        <div className="bg-card mb-8 rounded-lg border p-6">
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

        {/* Phase 1.4 Complete Notice */}
        <div className="mt-8 rounded-lg border border-green-200 bg-green-50 p-6 dark:border-green-800 dark:bg-green-950">
          <h3 className="mb-2 text-lg font-semibold text-green-900 dark:text-green-100">
            ✅ Phase 1.4 Complete: Authentication System
          </h3>
          <p className="text-sm text-green-800 dark:text-green-200">
            Custom authentication with JWT sessions, role-based access control, and protected routes
            are now fully functional!
          </p>
          <ul className="mt-4 space-y-1 text-sm text-green-700 dark:text-green-300">
            <li>• Session management with 7-day expiration</li>
            <li>• Password hashing with bcryptjs</li>
            <li>• Role-based permissions (6 roles, 11 permissions)</li>
            <li>• Modern login page with floating labels</li>
            <li>• Protected routes with middleware</li>
          </ul>
        </div>
      </main>
    </div>
  )
}
