import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth'
import { DashboardClient } from './dashboard-client'

export default async function DashboardPage() {
  const session = await getSession()

  // Redirect to login if no session
  if (!session) {
    redirect('/login')
  }

  return <DashboardClient session={session} />
}
