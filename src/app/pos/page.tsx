import { getSession } from '@/lib/session'
import { redirect } from 'next/navigation'
import { AppLayout } from '@/components/layout/AppLayout'
import { POSContent } from '@/components/pos/pos-content'

export default async function POSPage() {
  const session = await getSession()

  if (!session) {
    redirect('/login')
  }

  return (
    <AppLayout>
      <POSContent />
    </AppLayout>
  )
}
