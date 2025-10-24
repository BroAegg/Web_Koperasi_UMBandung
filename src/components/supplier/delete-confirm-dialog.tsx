'use client'

import { trpc } from '@/lib/trpc/client'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'

interface DeleteConfirmDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  supplierId: string
}

export function DeleteConfirmDialog({ open, onOpenChange, supplierId }: DeleteConfirmDialogProps) {
  const utils = trpc.useUtils()

  const supplierQuery = trpc.supplier.getSupplier.useQuery(
    { id: supplierId },
    { enabled: open && !!supplierId }
  )

  const deleteMutation = trpc.supplier.deleteSupplier.useMutation({
    onSuccess: () => {
      toast.success('Supplier berhasil dihapus')
      utils.supplier.getSuppliers.invalidate()
      onOpenChange(false)
    },
    onError: (error) => {
      toast.error('Gagal menghapus supplier', {
        description: error.message,
      })
    },
  })

  const handleDelete = () => {
    deleteMutation.mutate({ id: supplierId })
  }

  const supplier = supplierQuery.data

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Hapus Supplier?</AlertDialogTitle>
          <AlertDialogDescription>
            Tindakan ini tidak dapat dibatalkan. Data supplier akan dihapus secara permanen.
          </AlertDialogDescription>
        </AlertDialogHeader>

        {supplier && (
          <div className="bg-muted/50 rounded-lg border p-4">
            <p className="font-medium">{supplier.business_name}</p>
            <p className="text-muted-foreground text-sm">{supplier.contact_person}</p>
            <p className="text-muted-foreground text-sm">{supplier.phone}</p>
            {supplier.products && supplier.products.length > 0 && (
              <p className="text-destructive mt-2 text-sm">
                ⚠️ Memiliki {supplier.products.length} produk terkait
              </p>
            )}
          </div>
        )}

        <AlertDialogFooter>
          <AlertDialogCancel disabled={deleteMutation.isPending}>Batal</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={deleteMutation.isPending}
            className="bg-destructive hover:bg-destructive/90"
          >
            {deleteMutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Menghapus...
              </>
            ) : (
              'Hapus'
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
