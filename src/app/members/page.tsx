import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth'
import { AppLayout } from '@/components/layout/app-layout'
import { MembersContent } from '@/components/members/members-content'

export default async function MembersPage() {
  const session = await getSession()

  if (!session) {
    redirect('/login')
  }

  return (
    <AppLayout session={session}>
      <MembersContent />
    </AppLayout>
  )
}
