'use client'

import { useState } from 'react'
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
import { trpc } from '@/lib/trpc/client'
import { toast } from 'sonner'

interface DeleteConfirmDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  transaction: {
    id: string
    description: string
    amount: number
  }
}

export function DeleteConfirmDialog({ open, onOpenChange, transaction }: DeleteConfirmDialogProps) {
  const [loading, setLoading] = useState(false)
  const utils = trpc.useUtils()

  const deleteMutation = trpc.financial.deleteTransaction.useMutation({
    onSuccess: () => {
      toast.success('Transaction deleted successfully')
      utils.financial.getTransactions.invalidate()
      utils.financial.getDailySummary.invalidate()
      utils.financial.getTotalBalance.invalidate()
      onOpenChange(false)
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to delete transaction')
    },
  })

  const handleDelete = async () => {
    setLoading(true)
    try {
      await deleteMutation.mutateAsync({ id: transaction.id })
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(value)
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the transaction:
            <div className="bg-muted mt-2 rounded-md p-3">
              <p className="font-medium">{transaction.description}</p>
              <p className="text-muted-foreground text-sm">
                Amount: {formatCurrency(transaction.amount)}
              </p>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={loading}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={loading}
            className="bg-red-600 hover:bg-red-700"
          >
            {loading ? 'Deleting...' : 'Delete'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
