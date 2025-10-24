import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth'
import { AppLayout } from '@/components/layout/app-layout'
import { ReportsContent } from '@/components/reports/reports-content'

export default async function ReportsPage() {
  const session = await getSession()

  if (!session) {
    redirect('/login')
  }

  return (
    <AppLayout session={session}>
      <ReportsContent />
    </AppLayout>
  )
}
