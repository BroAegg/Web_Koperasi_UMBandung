'use client'

import { useState } from 'react'
import { trpc } from '@/lib/trpc/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { SupplierFormDialog } from './supplier-form-dialog'
import { SupplierDetailDialog } from './supplier-detail-dialog'
import { DeleteConfirmDialog } from './delete-confirm-dialog'
import { SkeletonCard } from '@/components/ui/loading-skeleton'
import {
  Plus,
  Search,
  Building2,
  Phone,
  Mail,
  MapPin,
  User,
  Package,
  MoreHorizontal,
  Pencil,
  Trash2,
  Eye,
  AlertCircle,
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export function SupplierContent() {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all')
  const [page, setPage] = useState(1)

  const [showForm, setShowForm] = useState(false)
  const [showDetail, setShowDetail] = useState(false)
  const [showDelete, setShowDelete] = useState(false)
  const [selectedSupplier, setSelectedSupplier] = useState<string | null>(null)

  const suppliersQuery = trpc.supplier.getSuppliers.useQuery({
    search: search || undefined,
    is_active: statusFilter === 'all' ? undefined : statusFilter === 'active',
    page,
    limit: 12,
  })

  const handleCreate = () => {
    setSelectedSupplier(null)
    setShowForm(true)
  }

  const handleEdit = (id: string) => {
    setSelectedSupplier(id)
    setShowForm(true)
  }

  const handleView = (id: string) => {
    setSelectedSupplier(id)
    setShowDetail(true)
  }

  const handleDelete = (id: string) => {
    setSelectedSupplier(id)
    setShowDelete(true)
  }

  const suppliers = suppliersQuery.data?.suppliers || []
  const pagination = suppliersQuery.data?.pagination

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Supplier</h1>
          <p className="text-muted-foreground">Kelola data supplier dan riwayat transaksi</p>
        </div>
        <Button onClick={handleCreate}>
          <Plus className="mr-2 h-4 w-4" />
          Tambah Supplier
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
              <Input
                placeholder="Cari nama, kontak, telepon, email..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value)
                  setPage(1)
                }}
                className="pl-9"
              />
            </div>
            <Select
              value={statusFilter}
              onValueChange={(value) => {
                setStatusFilter(value as typeof statusFilter)
                setPage(1)
              }}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Status</SelectItem>
                <SelectItem value="active">Aktif</SelectItem>
                <SelectItem value="inactive">Tidak Aktif</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Suppliers Grid */}
      {suppliersQuery.isLoading ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 9 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : suppliersQuery.error ? (
        <Card>
          <CardContent className="p-12 text-center">
            <AlertCircle className="text-destructive mx-auto mb-4 h-12 w-12" />
            <p className="text-lg font-medium">Error loading suppliers</p>
            <p className="text-muted-foreground text-sm">{suppliersQuery.error.message}</p>
          </CardContent>
        </Card>
      ) : suppliers.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <Building2 className="text-muted-foreground mx-auto mb-4 h-12 w-12" />
            <p className="text-lg font-medium">Belum ada supplier</p>
            <p className="text-muted-foreground mb-4 text-sm">
              Tambahkan supplier baru untuk mulai mengelola data
            </p>
            <Button onClick={handleCreate}>
              <Plus className="mr-2 h-4 w-4" />
              Tambah Supplier
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {suppliers.map((supplier) => (
              <Card
                key={supplier.id}
                className="group cursor-pointer transition-shadow hover:shadow-lg"
              >
                <CardContent className="p-6">
                  {/* Header */}
                  <div className="mb-4 flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="group-hover:text-primary line-clamp-1 text-lg font-semibold transition-colors">
                        {supplier.business_name}
                      </h3>
                      <Badge
                        variant={supplier.is_active ? 'default' : 'secondary'}
                        className="mt-1"
                      >
                        {supplier.is_active ? 'Aktif' : 'Tidak Aktif'}
                      </Badge>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleView(supplier.id)}>
                          <Eye className="mr-2 h-4 w-4" />
                          Detail
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleEdit(supplier.id)}>
                          <Pencil className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDelete(supplier.id)}
                          className="text-destructive"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Hapus
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  {/* Info */}
                  <div className="space-y-2 text-sm">
                    <div className="text-muted-foreground flex items-center gap-2">
                      <User className="h-4 w-4 shrink-0" />
                      <span className="truncate">{supplier.contact_person}</span>
                    </div>
                    <div className="text-muted-foreground flex items-center gap-2">
                      <Phone className="h-4 w-4 shrink-0" />
                      <span>{supplier.phone}</span>
                    </div>
                    {supplier.email && (
                      <div className="text-muted-foreground flex items-center gap-2">
                        <Mail className="h-4 w-4 shrink-0" />
                        <span className="truncate">{supplier.email}</span>
                      </div>
                    )}
                    {supplier.address && (
                      <div className="text-muted-foreground flex items-center gap-2">
                        <MapPin className="h-4 w-4 shrink-0" />
                        <span className="line-clamp-1">{supplier.address}</span>
                      </div>
                    )}
                  </div>

                  {/* Product Count */}
                  <div className="mt-4 border-t pt-4">
                    <div className="flex items-center justify-between text-sm">
                      <div className="text-muted-foreground flex items-center gap-2">
                        <Package className="h-4 w-4" />
                        <span>Produk</span>
                      </div>
                      <span className="font-medium">{supplier._count.products}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Pagination */}
          {pagination && pagination.totalPages > 1 && (
            <div className="flex items-center justify-between">
              <p className="text-muted-foreground text-sm">
                Menampilkan {suppliers.length} dari {pagination.total} supplier
              </p>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setPage(page - 1)} disabled={page === 1}>
                  Previous
                </Button>
                <div className="flex items-center gap-1">
                  {[...Array(pagination.totalPages)].map((_, i) => (
                    <Button
                      key={i}
                      variant={page === i + 1 ? 'default' : 'outline'}
                      size="icon"
                      onClick={() => setPage(i + 1)}
                      className="h-10 w-10"
                    >
                      {i + 1}
                    </Button>
                  ))}
                </div>
                <Button
                  variant="outline"
                  onClick={() => setPage(page + 1)}
                  disabled={!pagination.hasMore}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </>
      )}

      {/* Dialogs */}
      <SupplierFormDialog
        open={showForm}
        onOpenChange={setShowForm}
        supplierId={selectedSupplier}
      />

      {selectedSupplier && (
        <>
          <SupplierDetailDialog
            open={showDetail}
            onOpenChange={setShowDetail}
            supplierId={selectedSupplier}
          />

          <DeleteConfirmDialog
            open={showDelete}
            onOpenChange={setShowDelete}
            supplierId={selectedSupplier}
          />
        </>
      )}
    </div>
  )
}
