'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { trpc } from '@/lib/trpc'
import { toast } from 'sonner'
import { ArrowUpCircle } from 'lucide-react'

const withdrawalSchema = z.object({
  member_name: z.string().min(1, 'Nama anggota wajib diisi'),
  amount: z.string().min(1, 'Jumlah penarikan wajib diisi'),
  payment_method: z.enum(['CASH', 'BANK_TRANSFER', 'E_WALLET', 'OTHER']),
  notes: z.string().optional(),
})

type WithdrawalFormData = z.infer<typeof withdrawalSchema>

interface WithdrawalModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function WithdrawalModal({ open, onOpenChange }: WithdrawalModalProps) {
  const form = useForm<WithdrawalFormData>({
    resolver: zodResolver(withdrawalSchema),
    defaultValues: {
      member_name: '',
      amount: '',
      payment_method: 'CASH',
      notes: '',
    },
  })

  const utils = trpc.useUtils()
  const recordWithdrawal = trpc.member.recordWithdrawal.useMutation({
    onSuccess: () => {
      toast.success('Penarikan berhasil dicatat!', {
        description: 'Penarikan anggota telah dikurangi dari kas koperasi',
      })
      utils.member.getMemberTransactions.invalidate()
      utils.member.getMemberStats.invalidate()
      form.reset()
      onOpenChange(false)
    },
    onError: (error) => {
      toast.error('Gagal mencatat penarikan', {
        description: error.message,
      })
    },
  })

  const onSubmit = (data: WithdrawalFormData) => {
    recordWithdrawal.mutate({
      member_name: data.member_name,
      amount: parseFloat(data.amount),
      payment_method: data.payment_method,
      notes: data.notes,
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ArrowUpCircle className="h-5 w-5 text-red-500" />
            Penarikan Anggota
          </DialogTitle>
          <DialogDescription>
            Catat penarikan dari anggota koperasi. Penarikan akan keluar dari kas koperasi.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="member_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nama Anggota</FormLabel>
                  <FormControl>
                    <Input placeholder="Masukkan nama anggota" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Jumlah Penarikan</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="0"
                      {...field}
                      onChange={(e) => {
                        field.onChange(e.target.value)
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="payment_method"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Metode Pembayaran</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="CASH">Tunai</SelectItem>
                      <SelectItem value="BANK_TRANSFER">Transfer Bank</SelectItem>
                      <SelectItem value="E_WALLET">E-Wallet</SelectItem>
                      <SelectItem value="OTHER">Lainnya</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Catatan (Opsional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Catatan tambahan..."
                      className="resize-none"
                      rows={3}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="flex-1"
              >
                Batal
              </Button>
              <Button type="submit" disabled={recordWithdrawal.isPending} className="flex-1">
                {recordWithdrawal.isPending ? 'Menyimpan...' : 'Simpan Penarikan'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
