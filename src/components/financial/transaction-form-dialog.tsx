'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { trpc } from '@/lib/trpc/client'
import { toast } from 'sonner'

const formSchema = z.object({
  type: z.enum(['CASH_IN', 'CASH_OUT', 'TRANSFER', 'ADJUSTMENT']),
  category: z.enum([
    'SALES',
    'PURCHASE',
    'OPERATIONAL',
    'MEMBER_DEPOSIT',
    'MEMBER_WITHDRAWAL',
    'OTHER',
  ]),
  amount: z.number().positive('Amount must be positive'),
  description: z.string().min(1, 'Description is required'),
  notes: z.string().optional(),
  supplierId: z.string().optional(),
})

type FormValues = z.infer<typeof formSchema>

interface TransactionFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  transaction?: {
    id: string
    type: string
    category: string
    amount: number
    description: string
    notes: string | null
    supplier: { id: string; business_name: string } | null
  }
}

export function TransactionFormDialog({
  open,
  onOpenChange,
  transaction,
}: TransactionFormDialogProps) {
  const [loading, setLoading] = useState(false)
  const utils = trpc.useUtils()

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      type: (transaction?.type || 'CASH_IN') as FormValues['type'],
      category: (transaction?.category || 'SALES') as FormValues['category'],
      amount: transaction?.amount || 0,
      description: transaction?.description || '',
      notes: transaction?.notes || '',
      supplierId: transaction?.supplier?.id || '',
    },
  })

  const createMutation = trpc.financial.createTransaction.useMutation({
    onSuccess: () => {
      toast.success('Transaction created successfully')
      utils.financial.getTransactions.invalidate()
      utils.financial.getDailySummary.invalidate()
      utils.financial.getTotalBalance.invalidate()
      onOpenChange(false)
      form.reset()
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to create transaction')
    },
  })

  const updateMutation = trpc.financial.updateTransaction.useMutation({
    onSuccess: () => {
      toast.success('Transaction updated successfully')
      utils.financial.getTransactions.invalidate()
      utils.financial.getDailySummary.invalidate()
      utils.financial.getTotalBalance.invalidate()
      onOpenChange(false)
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to update transaction')
    },
  })

  const onSubmit = async (data: FormValues) => {
    setLoading(true)
    try {
      if (transaction) {
        await updateMutation.mutateAsync({
          id: transaction.id,
          ...data,
        })
      } else {
        await createMutation.mutateAsync(data)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{transaction ? 'Edit Transaction' : 'New Transaction'}</DialogTitle>
          <DialogDescription>
            {transaction
              ? 'Update transaction details below'
              : 'Create a new financial transaction'}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Type */}
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="CASH_IN">Cash In</SelectItem>
                      <SelectItem value="CASH_OUT">Cash Out</SelectItem>
                      <SelectItem value="TRANSFER">Transfer</SelectItem>
                      <SelectItem value="ADJUSTMENT">Adjustment</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Category */}
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="SALES">Sales</SelectItem>
                      <SelectItem value="PURCHASE">Purchase</SelectItem>
                      <SelectItem value="OPERATIONAL">Operational</SelectItem>
                      <SelectItem value="MEMBER_DEPOSIT">Member Deposit</SelectItem>
                      <SelectItem value="MEMBER_WITHDRAWAL">Member Withdrawal</SelectItem>
                      <SelectItem value="OTHER">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Amount */}
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amount</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="0" {...field} />
                  </FormControl>
                  <FormDescription>Enter amount in Rupiah</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Description */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Input placeholder="Transaction description" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Notes */}
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Additional notes..."
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? 'Saving...' : transaction ? 'Update' : 'Create'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
