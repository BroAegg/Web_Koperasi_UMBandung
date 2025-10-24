import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth'
import { AppLayout } from '@/components/layout/app-layout'
import { ActivityLogsContent } from '@/components/activity/activity-logs-content'

export default async function ActivityLogsPage() {
  const session = await getSession()

  if (!session) {
    redirect('/login')
  }

  // Only Developer, Super Admin and Admin can access activity logs
  const allowedRoles = ['DEVELOPER', 'SUPER_ADMIN', 'ADMIN']
  if (!allowedRoles.includes(session.role)) {
    redirect('/dashboard')
  }

  return (
    <AppLayout session={session}>
      <ActivityLogsContent />
    </AppLayout>
  )
}
