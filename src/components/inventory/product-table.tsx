'use client'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  MoreHorizontal,
  Pencil,
  Package,
  Trash2,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'

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
  category: {
    id: string
    name: string
    description?: string | null
  }
  supplier: {
    id: string
    business_name: string
    contact_person: string
    phone: string
  }
}

interface ProductTableProps {
  data?: {
    products: Product[]
    pagination: {
      total: number
      page: number
      limit: number
      totalPages: number
    }
    lowStockCount?: number
  }
  loading: boolean
  onEdit: (product: Product) => void
  onUpdateStock: (productId: string) => void
  onDelete: (product: Product) => void
  onPageChange: (page: number) => void
}

const categoryLabels: Record<string, string> = {
  FOOD: 'Makanan',
  BEVERAGE: 'Minuman',
  SNACK: 'Snack',
  HOUSEHOLD: 'Keperluan Rumah',
  STATIONERY: 'Alat Tulis',
  OTHER: 'Lainnya',
}

export function ProductTable({
  data,
  loading,
  onEdit,
  onUpdateStock,
  onDelete,
  onPageChange,
}: ProductTableProps) {
  if (loading) {
    return (
      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>SKU</TableHead>
              <TableHead>Nama Produk</TableHead>
              <TableHead>Kategori</TableHead>
              <TableHead>Supplier</TableHead>
              <TableHead>Stok</TableHead>
              <TableHead>Min Stok</TableHead>
              <TableHead>Harga Beli</TableHead>
              <TableHead>Harga Jual</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: 10 }).map((_, i) => (
              <TableRow key={i}>
                <TableCell>
                  <Skeleton className="h-4 w-16" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-32" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-20" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-12" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-12" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-12" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-20" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-20" />
                </TableCell>
                <TableCell>
                  <Skeleton className="ml-auto h-8 w-8" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    )
  }

  if (!data || data.products.length === 0) {
    return (
      <div className="rounded-lg border border-dashed p-12 text-center">
        <Package className="text-muted-foreground mx-auto mb-4 h-12 w-12" />
        <h3 className="mb-2 text-lg font-semibold">Produk Tidak Ditemukan</h3>
        <p className="text-muted-foreground text-sm">
          Tidak ada produk yang sesuai dengan filter yang dipilih
        </p>
      </div>
    )
  }

  const { products, pagination } = data

  return (
    <div className="space-y-4">
      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>SKU</TableHead>
              <TableHead>Nama Produk</TableHead>
              <TableHead>Kategori</TableHead>
              <TableHead>Supplier</TableHead>
              <TableHead>Stok</TableHead>
              <TableHead>Min Stok</TableHead>
              <TableHead>Harga Beli</TableHead>
              <TableHead>Harga Jual</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product) => {
              const isLowStock = product.stock <= product.min_stock

              return (
                <TableRow key={product.id}>
                  <TableCell className="font-mono text-xs">{product.sku}</TableCell>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      {product.name}
                      {isLowStock && (
                        <Badge variant="destructive" className="gap-1">
                          <AlertTriangle className="h-3 w-3" />
                          Rendah
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{product.category.name}</Badge>
                  </TableCell>
                  <TableCell className="text-sm">{product.supplier.business_name}</TableCell>
                  <TableCell>
                    <span className={`font-medium ${isLowStock ? 'text-destructive' : ''}`}>
                      {product.stock} unit
                    </span>
                  </TableCell>
                  <TableCell>{product.min_stock} unit</TableCell>
                  <TableCell>Rp {Number(product.purchase_price).toLocaleString('id-ID')}</TableCell>
                  <TableCell>Rp {Number(product.selling_price).toLocaleString('id-ID')}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onUpdateStock(product.id)}>
                          <Package className="mr-2 h-4 w-4" />
                          Update Stok
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onEdit(product)}>
                          <Pencil className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => onDelete(product)}
                          className="text-destructive"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Hapus
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(pagination.page - 1)}
            disabled={pagination.page === 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          {Array.from({ length: pagination.totalPages }, (_, i) => i + 1)
            .filter((page) => {
              const current = pagination.page
              return (
                page === 1 ||
                page === pagination.totalPages ||
                (page >= current - 1 && page <= current + 1)
              )
            })
            .map((page, index, array) => {
              const showEllipsisBefore = index > 0 && page - array[index - 1] > 1
              return (
                <div key={page} className="flex items-center gap-2">
                  {showEllipsisBefore && <span className="text-muted-foreground">...</span>}
                  <Button
                    variant={pagination.page === page ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => onPageChange(page)}
                  >
                    {page}
                  </Button>
                </div>
              )
            })}

          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(pagination.page + 1)}
            disabled={pagination.page === pagination.totalPages}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  )
}
