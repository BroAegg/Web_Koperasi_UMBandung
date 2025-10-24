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
import { ArrowDownCircle } from 'lucide-react'

const depositSchema = z.object({
  member_name: z.string().min(1, 'Nama anggota wajib diisi'),
  amount: z.string().min(1, 'Jumlah setoran wajib diisi'),
  payment_method: z.enum(['CASH', 'BANK_TRANSFER', 'E_WALLET', 'OTHER']),
  notes: z.string().optional(),
})

type DepositFormData = z.infer<typeof depositSchema>

interface DepositModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function DepositModal({ open, onOpenChange }: DepositModalProps) {
  const form = useForm<DepositFormData>({
    resolver: zodResolver(depositSchema),
    defaultValues: {
      member_name: '',
      amount: '',
      payment_method: 'CASH',
      notes: '',
    },
  })

  const utils = trpc.useUtils()
  const recordDeposit = trpc.member.recordDeposit.useMutation({
    onSuccess: () => {
      toast.success('Setoran berhasil dicatat!', {
        description: 'Setoran anggota telah ditambahkan ke sistem',
      })
      utils.member.getMemberTransactions.invalidate()
      utils.member.getMemberStats.invalidate()
      form.reset()
      onOpenChange(false)
    },
    onError: (error) => {
      toast.error('Gagal mencatat setoran', {
        description: error.message,
      })
    },
  })

  const onSubmit = (data: DepositFormData) => {
    recordDeposit.mutate({
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
            <ArrowDownCircle className="h-5 w-5 text-green-500" />
            Setoran Anggota
          </DialogTitle>
          <DialogDescription>
            Catat setoran dari anggota koperasi. Setoran akan masuk ke kas koperasi.
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
                  <FormLabel>Jumlah Setoran</FormLabel>
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
              <Button type="submit" disabled={recordDeposit.isPending} className="flex-1">
                {recordDeposit.isPending ? 'Menyimpan...' : 'Simpan Setoran'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
