'use client'

import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ProductImage } from '@/components/ui/product-image'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { MoreHorizontal, Pencil, Package, Trash2, AlertTriangle } from 'lucide-react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

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

interface ProductGridProps {
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

export function ProductGrid({
  data,
  loading,
  onEdit,
  onUpdateStock,
  onDelete,
  onPageChange,
}: ProductGridProps) {
  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} className="bg-card rounded-lg border p-4">
            <Skeleton className="mb-3 h-6 w-3/4" />
            <Skeleton className="mb-2 h-4 w-1/2" />
            <Skeleton className="mb-4 h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        ))}
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
      {/* Product Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {products.map((product) => {
          const isLowStock = product.stock <= product.min_stock

          return (
            <div
              key={product.id}
              className="group bg-card relative rounded-lg border p-4 transition-all hover:shadow-md"
            >
              {/* Low Stock Badge */}
              {isLowStock && (
                <Badge variant="destructive" className="absolute top-4 right-4 gap-1">
                  <AlertTriangle className="h-3 w-3" />
                  Stok Rendah
                </Badge>
              )}

              {/* Product Image */}
              <div className="mb-3">
                <ProductImage
                  src={product.image}
                  alt={product.name}
                  size="lg"
                  className="mx-auto"
                />
              </div>

              {/* Product Info */}
              <div className="mb-3">
                <p className="text-muted-foreground text-xs">{product.sku}</p>
                <h3 className="mt-1 font-semibold">{product.name}</h3>
                <Badge variant="outline" className="mt-2">
                  {product.category.name}
                </Badge>
              </div>

              {/* Stock Info */}
              <div className="mb-3 space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Stok:</span>
                  <span className={`font-medium ${isLowStock ? 'text-destructive' : ''}`}>
                    {product.stock} unit
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Min Stok:</span>
                  <span className="font-medium">{product.min_stock} unit</span>
                </div>
                <div className="flex justify-between border-t pt-1">
                  <span className="text-muted-foreground">Supplier:</span>
                  <span className="text-xs font-medium">{product.supplier.business_name}</span>
                </div>
              </div>

              {/* Price Info */}
              <div className="bg-muted/50 mb-3 rounded-md p-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Harga Beli:</span>
                  <span className="font-medium">
                    Rp {Number(product.purchase_price).toLocaleString('id-ID')}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Harga Jual:</span>
                  <span className="font-medium">
                    Rp {Number(product.selling_price).toLocaleString('id-ID')}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={() => onUpdateStock(product.id)}
                >
                  <Package className="mr-2 h-4 w-4" />
                  Update Stok
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
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
              </div>
            </div>
          )
        })}
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
