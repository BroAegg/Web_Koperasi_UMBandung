import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth'
import { AppLayout } from '@/components/layout/app-layout'
import { FinancialContent } from '@/components/financial/financial-content'

export default async function FinancialPage() {
  const session = await getSession()

  if (!session) {
    redirect('/login')
  }

  return (
    <AppLayout session={session}>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Financial Management</h1>
          <p className="text-muted-foreground mt-1">
            Manage transactions, view balance, and track cash flow
          </p>
        </div>

        <FinancialContent />
      </div>
    </AppLayout>
  )
}
