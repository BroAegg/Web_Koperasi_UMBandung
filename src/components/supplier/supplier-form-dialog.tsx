'use client'

import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { trpc } from '@/lib/trpc/client'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
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
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'

const formSchema = z.object({
  business_name: z.string().min(1, 'Nama usaha wajib diisi'),
  contact_person: z.string().min(1, 'Nama kontak wajib diisi'),
  phone: z.string().min(1, 'Nomor telepon wajib diisi'),
  email: z.string().email('Email tidak valid').optional().or(z.literal('')),
  address: z.string().optional(),
  is_active: z.boolean(),
})

type FormValues = z.infer<typeof formSchema>

interface SupplierFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  supplierId?: string | null
}

export function SupplierFormDialog({ open, onOpenChange, supplierId }: SupplierFormDialogProps) {
  const utils = trpc.useUtils()
  const isEdit = !!supplierId

  const supplierQuery = trpc.supplier.getSupplier.useQuery({ id: supplierId! }, { enabled: isEdit })

  const createMutation = trpc.supplier.createSupplier.useMutation({
    onSuccess: () => {
      toast.success('Supplier berhasil ditambahkan')
      utils.supplier.getSuppliers.invalidate()
      onOpenChange(false)
      form.reset()
    },
    onError: (error) => {
      toast.error('Gagal menambahkan supplier', {
        description: error.message,
      })
    },
  })

  const updateMutation = trpc.supplier.updateSupplier.useMutation({
    onSuccess: () => {
      toast.success('Supplier berhasil diperbarui')
      utils.supplier.getSuppliers.invalidate()
      utils.supplier.getSupplier.invalidate({ id: supplierId! })
      onOpenChange(false)
    },
    onError: (error) => {
      toast.error('Gagal memperbarui supplier', {
        description: error.message,
      })
    },
  })

  const form = useForm<FormValues>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(formSchema) as any,
    defaultValues: {
      business_name: '',
      contact_person: '',
      phone: '',
      email: '',
      address: '',
      is_active: true,
    },
  })

  useEffect(() => {
    if (open && supplierQuery.data) {
      form.reset({
        business_name: supplierQuery.data.business_name,
        contact_person: supplierQuery.data.contact_person,
        phone: supplierQuery.data.phone,
        email: supplierQuery.data.email || '',
        address: supplierQuery.data.address || '',
        is_active: supplierQuery.data.is_active,
      })
    } else if (!open) {
      form.reset()
    }
  }, [open, supplierQuery.data, form])

  const onSubmit = (data: FormValues) => {
    if (isEdit) {
      updateMutation.mutate({
        id: supplierId,
        ...data,
        email: data.email || undefined,
      })
    } else {
      createMutation.mutate({
        ...data,
        email: data.email || undefined,
      })
    }
  }

  const isPending = createMutation.isPending || updateMutation.isPending

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Edit Supplier' : 'Tambah Supplier Baru'}</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="business_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nama Usaha *</FormLabel>
                    <FormControl>
                      <Input placeholder="PT. Example Indonesia" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="contact_person"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nama Kontak *</FormLabel>
                    <FormControl>
                      <Input placeholder="John Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nomor Telepon *</FormLabel>
                    <FormControl>
                      <Input placeholder="08123456789" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="supplier@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Alamat</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Masukkan alamat lengkap..."
                      className="resize-none"
                      rows={3}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="is_active"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Status Aktif</FormLabel>
                    <div className="text-muted-foreground text-sm">
                      Supplier dapat melakukan transaksi
                    </div>
                  </div>
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isPending}
              >
                Batal
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {isEdit ? 'Menyimpan...' : 'Menambahkan...'}
                  </>
                ) : (
                  <>{isEdit ? 'Simpan' : 'Tambah'}</>
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
