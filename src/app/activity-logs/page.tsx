import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth'
import { AppLayout } from '@/components/layout/app-layout'
import { ActivityLogsContent } from '@/components/activity/activity-logs-content'

export default async function ActivityLogsPage() {
  const session = await getSession()

  if (!session) {
    redirect('/login')
  }

  // Only Super Admin can access activity logs
  if (session.role !== 'SUPER_ADMIN') {
    redirect('/')
  }

  return (
    <AppLayout session={session}>
      <ActivityLogsContent />
    </AppLayout>
  )
}
