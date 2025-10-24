'use client'

import { trpc } from '@/lib/trpc/client'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Separator } from '@/components/ui/separator'
import { Building2, User, Phone, Mail, MapPin, Package, Calendar, AlertCircle } from 'lucide-react'

interface SupplierDetailDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  supplierId: string
}

export function SupplierDetailDialog({
  open,
  onOpenChange,
  supplierId,
}: SupplierDetailDialogProps) {
  const supplierQuery = trpc.supplier.getSupplier.useQuery(
    { id: supplierId },
    { enabled: open && !!supplierId }
  )

  const supplier = supplierQuery.data

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Detail Supplier</DialogTitle>
        </DialogHeader>

        {supplierQuery.isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-32 w-full" />
          </div>
        ) : supplierQuery.error ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <AlertCircle className="text-destructive mb-4 h-12 w-12" />
            <p className="text-lg font-medium">Error loading supplier</p>
            <p className="text-muted-foreground text-sm">{supplierQuery.error.message}</p>
          </div>
        ) : supplier ? (
          <div className="space-y-6">
            {/* Header Info */}
            <div>
              <div className="mb-2 flex items-start justify-between">
                <h3 className="text-2xl font-bold">{supplier.business_name}</h3>
                <Badge variant={supplier.is_active ? 'default' : 'secondary'}>
                  {supplier.is_active ? 'Aktif' : 'Tidak Aktif'}
                </Badge>
              </div>
              <p className="text-muted-foreground text-sm">ID: {supplier.id}</p>
            </div>

            <Separator />

            {/* Contact Information */}
            <div>
              <h4 className="mb-4 flex items-center gap-2 font-semibold">
                <Building2 className="h-4 w-4" />
                Informasi Kontak
              </h4>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <User className="text-muted-foreground mt-0.5 h-5 w-5" />
                  <div>
                    <p className="text-muted-foreground text-sm">Nama Kontak</p>
                    <p className="font-medium">{supplier.contact_person}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="text-muted-foreground mt-0.5 h-5 w-5" />
                  <div>
                    <p className="text-muted-foreground text-sm">Nomor Telepon</p>
                    <p className="font-medium">{supplier.phone}</p>
                  </div>
                </div>

                {supplier.email && (
                  <div className="flex items-start gap-3">
                    <Mail className="text-muted-foreground mt-0.5 h-5 w-5" />
                    <div>
                      <p className="text-muted-foreground text-sm">Email</p>
                      <p className="font-medium">{supplier.email}</p>
                    </div>
                  </div>
                )}

                {supplier.address && (
                  <div className="flex items-start gap-3">
                    <MapPin className="text-muted-foreground mt-0.5 h-5 w-5" />
                    <div>
                      <p className="text-muted-foreground text-sm">Alamat</p>
                      <p className="font-medium">{supplier.address}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <Separator />

            {/* Products */}
            <div>
              <h4 className="mb-4 flex items-center gap-2 font-semibold">
                <Package className="h-4 w-4" />
                Produk ({supplier.products?.length || 0})
              </h4>
              {supplier.products && supplier.products.length > 0 ? (
                <div className="space-y-2">
                  {supplier.products.map((product) => (
                    <div
                      key={product.id}
                      className="bg-card flex items-center justify-between rounded-lg border p-3"
                    >
                      <div>
                        <p className="font-medium">{product.name}</p>
                        <p className="text-muted-foreground text-sm">{product.sku}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">
                          Rp {Number(product.selling_price).toLocaleString('id-ID')}
                        </p>
                        <p className="text-muted-foreground text-xs">Stok: {product.stock}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-sm">Belum ada produk dari supplier ini</p>
              )}
            </div>

            <Separator />

            {/* Timestamps */}
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <div className="text-muted-foreground mb-1 flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>Dibuat</span>
                </div>
                <p className="font-medium">
                  {new Date(supplier.created_at).toLocaleString('id-ID')}
                </p>
              </div>
              <div>
                <div className="text-muted-foreground mb-1 flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>Diperbarui</span>
                </div>
                <p className="font-medium">
                  {new Date(supplier.updated_at).toLocaleString('id-ID')}
                </p>
              </div>
            </div>
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  )
}
