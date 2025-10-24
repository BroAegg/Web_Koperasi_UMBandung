import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth'
import { AppLayout } from '@/components/layout/app-layout'
import { InventoryContent } from '@/components/inventory/inventory-content'

export default async function InventoryPage() {
  const session = await getSession()

  if (!session) {
    redirect('/login')
  }

  return (
    <AppLayout session={session}>
      <InventoryContent />
    </AppLayout>
  )
}
