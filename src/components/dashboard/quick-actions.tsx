'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus, DollarSign, Package, ShoppingCart, FileText, Users, TrendingUp } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { canAccessModule } from '@/lib/permissions'

interface Session {
  userId: string
  username: string
  email: string | null
  fullName: string
  role: string
  isActive: boolean
  expiresAt: Date | number
}

interface QuickActionsProps {
  session: Session
}

interface QuickAction {
  title: string
  description: string
  icon: typeof Plus
  href: string
  color: string
  requiredModule: string
}

export function QuickActions({ session }: QuickActionsProps) {
  const router = useRouter()

  const allActions: QuickAction[] = [
    {
      title: 'New Transaction',
      description: 'Record income or expense',
      icon: DollarSign,
      href: '/keuangan/transaksi/baru',
      color: 'bg-green-500 hover:bg-green-600',
      requiredModule: 'KEUANGAN',
    },
    {
      title: 'Add Product',
      description: 'Add new product to inventory',
      icon: Package,
      href: '/inventori/produk/baru',
      color: 'bg-blue-500 hover:bg-blue-600',
      requiredModule: 'INVENTORI',
    },
    {
      title: 'New Sale',
      description: 'Process a new sale',
      icon: ShoppingCart,
      href: '/pos',
      color: 'bg-purple-500 hover:bg-purple-600',
      requiredModule: 'POS',
    },
    {
      title: 'Register Member',
      description: 'Add new member',
      icon: Users,
      href: '/anggota/baru',
      color: 'bg-orange-500 hover:bg-orange-600',
      requiredModule: 'ANGGOTA',
    },
    {
      title: 'Generate Report',
      description: 'Create financial report',
      icon: FileText,
      href: '/laporan',
      color: 'bg-indigo-500 hover:bg-indigo-600',
      requiredModule: 'LAPORAN',
    },
    {
      title: 'View Analytics',
      description: 'See detailed analytics',
      icon: TrendingUp,
      href: '/laporan/analytics',
      color: 'bg-pink-500 hover:bg-pink-600',
      requiredModule: 'LAPORAN',
    },
  ]

  // Filter actions based on user's role
  const availableActions = allActions.filter((action) =>
    canAccessModule(
      session.role as 'DEVELOPER' | 'SUPER_ADMIN' | 'ADMIN' | 'KASIR' | 'STAFF' | 'SUPPLIER',
      action.requiredModule
    )
  )

  return (
    <Card hover>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
        <CardDescription>Common tasks you can perform</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {availableActions.map((action) => {
            const Icon = action.icon
            return (
              <Button
                key={action.title}
                variant="outline"
                className="group flex h-auto items-start gap-3 p-4"
                onClick={() => router.push(action.href)}
              >
                <div
                  className={`rounded-lg p-2 text-white transition-transform duration-200 group-hover:scale-110 ${action.color}`}
                >
                  <Icon className="h-5 w-5" />
                </div>
                <div className="flex-1 text-left">
                  <div className="text-sm font-medium">{action.title}</div>
                  <div className="text-muted-foreground text-xs">{action.description}</div>
                </div>
              </Button>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
