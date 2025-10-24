'use client'

import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { trpc } from '@/lib/trpc/client'
import { toast } from 'sonner'
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
import { ImageUpload } from '@/components/ui/image-upload'

const formSchema = z.object({
  sku: z.string().min(1, 'SKU wajib diisi'),
  name: z.string().min(1, 'Nama produk wajib diisi'),
  description: z.string().optional(),
  category_id: z.string().min(1, 'Kategori wajib dipilih'),
  supplier_id: z.string().min(1, 'Supplier wajib dipilih'),
  purchase_price: z.number().min(0, 'Harga beli tidak boleh negatif'),
  selling_price: z.number().min(0, 'Harga jual tidak boleh negatif'),
  stock: z.number().min(0, 'Stok tidak boleh negatif').optional(),
  min_stock: z.number().min(0, 'Stok minimum tidak boleh negatif'),
  image: z.string().nullable().optional(),
  is_active: z.boolean(),
})

type FormValues = z.infer<typeof formSchema>

interface Product {
  id: string
  sku: string
  name: string
  description?: string | null
  category_id: string
  supplier_id: string
  purchase_price: number
  selling_price: number
  stock: number
  min_stock: number
  image?: string | null
  is_active: boolean
}

interface ProductFormDialogProps {
  product?: unknown
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ProductFormDialog({ product, open, onOpenChange }: ProductFormDialogProps) {
  const utils = trpc.useUtils()
  const typedProduct = product as Product | null | undefined

  // Fetch suppliers for dropdown
  const suppliersQuery = trpc.supplier.getSuppliers.useQuery({
    is_active: true,
    page: 1,
    limit: 100,
  })

  const form = useForm<FormValues>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(formSchema) as any,
    defaultValues: {
      sku: typedProduct?.sku || '',
      name: typedProduct?.name || '',
      description: typedProduct?.description || '',
      category_id: typedProduct?.category_id || '',
      supplier_id: typedProduct?.supplier_id || '',
      purchase_price: typedProduct?.purchase_price ? Number(typedProduct.purchase_price) : 0,
      selling_price: typedProduct?.selling_price ? Number(typedProduct.selling_price) : 0,
      stock: typedProduct?.stock,
      min_stock: typedProduct?.min_stock || 5,
      image: typedProduct?.image || null,
      is_active: typedProduct?.is_active ?? true,
    },
  })

  useEffect(() => {
    if (open && typedProduct) {
      form.reset({
        sku: typedProduct.sku,
        name: typedProduct.name,
        description: typedProduct.description || '',
        category_id: typedProduct.category_id,
        supplier_id: typedProduct.supplier_id,
        purchase_price: Number(typedProduct.purchase_price),
        selling_price: Number(typedProduct.selling_price),
        stock: typedProduct.stock,
        min_stock: typedProduct.min_stock,
        image: typedProduct.image || null,
        is_active: typedProduct.is_active,
      })
    } else if (open && !typedProduct) {
      form.reset({
        sku: '',
        name: '',
        description: '',
        category_id: '',
        supplier_id: '',
        purchase_price: 0,
        selling_price: 0,
        stock: 0,
        min_stock: 5,
        is_active: true,
      })
    }
  }, [open, typedProduct, form])

  const createMutation = trpc.inventory.createProduct.useMutation({
    onSuccess: () => {
      toast.success('Produk berhasil dibuat')
      utils.inventory.getProducts.invalidate()
      onOpenChange(false)
    },
    onError: (error) => {
      toast.error(error.message || 'Gagal membuat produk')
    },
  })

  const updateMutation = trpc.inventory.updateProduct.useMutation({
    onSuccess: () => {
      toast.success('Produk berhasil diperbarui')
      utils.inventory.getProducts.invalidate()
      onOpenChange(false)
    },
    onError: (error) => {
      toast.error(error.message || 'Gagal memperbarui produk')
    },
  })

  const onSubmit = (values: FormValues) => {
    // Convert null to undefined for image field
    const sanitizedValues = {
      ...values,
      image: values.image ?? undefined,
    }

    if (typedProduct) {
      updateMutation.mutate({
        id: typedProduct.id,
        ...sanitizedValues,
      })
    } else {
      createMutation.mutate(sanitizedValues)
    }
  }

  // Hardcoded categories for now (could be fetched from API later)
  const categories = [
    { id: '1', name: 'Makanan' },
    { id: '2', name: 'Minuman' },
    { id: '3', name: 'Snack' },
    { id: '4', name: 'Keperluan Rumah' },
    { id: '5', name: 'Alat Tulis' },
    { id: '6', name: 'Lainnya' },
  ]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{typedProduct ? 'Edit Produk' : 'Tambah Produk Baru'}</DialogTitle>
          <DialogDescription>
            {typedProduct ? 'Perbarui informasi produk' : 'Isi form untuk menambah produk baru'}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* SKU & Name */}
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="sku"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>SKU</FormLabel>
                    <FormControl>
                      <Input placeholder="PRD001" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nama Produk</FormLabel>
                    <FormControl>
                      <Input placeholder="Nama produk..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Category & Supplier */}
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="category_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Kategori</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih kategori" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categories.map((cat) => (
                          <SelectItem key={cat.id} value={cat.id}>
                            {cat.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="supplier_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Supplier</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih supplier" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {suppliersQuery.data?.suppliers.map((supplier) => (
                          <SelectItem key={supplier.id} value={supplier.id}>
                            {supplier.business_name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Prices */}
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="purchase_price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Harga Beli</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="selling_price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Harga Jual</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Stock & Min Stock */}
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="stock"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Stok Awal</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        value={field.value ?? ''}
                        onChange={(e) =>
                          field.onChange(e.target.value ? Number(e.target.value) : undefined)
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="min_stock"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Stok Minimum</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Deskripsi (Opsional)</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Deskripsi produk..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Product Image */}
            <FormField
              control={form.control}
              name="image"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Gambar Produk (Opsional)</FormLabel>
                  <FormControl>
                    <ImageUpload
                      value={field.value}
                      onChange={field.onChange}
                      disabled={createMutation.isPending || updateMutation.isPending}
                      maxSize={2}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Batal
              </Button>
              <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
                {createMutation.isPending || updateMutation.isPending
                  ? 'Menyimpan...'
                  : typedProduct
                    ? 'Perbarui'
                    : 'Simpan'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
