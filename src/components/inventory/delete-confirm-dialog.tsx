'use client'

import { trpc } from '@/lib/trpc/client'
import { toast } from 'sonner'
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

interface Product {
  id: string
  sku: string
  name: string
  stock: number
}

interface DeleteConfirmDialogProps {
  product: unknown
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function DeleteConfirmDialog({ product, open, onOpenChange }: DeleteConfirmDialogProps) {
  const utils = trpc.useUtils()
  const typedProduct = product as Product | null | undefined

  const deleteMutation = trpc.inventory.deleteProduct.useMutation({
    onSuccess: () => {
      toast.success('Produk berhasil dihapus')
      utils.inventory.getProducts.invalidate()
      onOpenChange(false)
    },
    onError: (error) => {
      toast.error(error.message || 'Gagal menghapus produk')
    },
  })

  const handleDelete = () => {
    if (!typedProduct) return
    deleteMutation.mutate({ id: typedProduct.id })
  }

  if (!typedProduct) return null

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Hapus Produk?</AlertDialogTitle>
          <AlertDialogDescription>
            Anda yakin ingin menghapus produk ini? Tindakan ini tidak dapat dibatalkan.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="bg-muted/50 my-4 rounded-lg border p-4">
          <p className="mb-1 text-sm font-medium">{typedProduct.name}</p>
          <p className="text-muted-foreground text-xs">SKU: {typedProduct.sku}</p>
          <p className="text-muted-foreground mt-2 text-xs">Stok: {typedProduct.stock} unit</p>
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel>Batal</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            disabled={deleteMutation.isPending}
          >
            {deleteMutation.isPending ? 'Menghapus...' : 'Hapus'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
