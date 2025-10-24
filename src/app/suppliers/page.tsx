import { getSession } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { AppLayout } from '@/components/layout/app-layout'
import { SupplierContent } from '@/components/supplier/supplier-content'

export default async function SupplierPage() {
  const session = await getSession()

  if (!session) {
    redirect('/login')
  }

  return (
    <AppLayout session={session}>
      <SupplierContent />
    </AppLayout>
  )
}
