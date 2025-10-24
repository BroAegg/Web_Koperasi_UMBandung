import { getSession } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { AppLayout } from '@/components/layout/app-layout'
import { POSContent } from '@/components/pos/pos-content'

export default async function POSPage() {
  const session = await getSession()

  if (!session) {
    redirect('/login')
  }

  return (
    <AppLayout session={session}>
      <POSContent />
    </AppLayout>
  )
}
