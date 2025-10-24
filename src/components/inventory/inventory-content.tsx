'use client'

import { useState } from 'react'
import { trpc } from '@/lib/trpc/client'
import { Button } from '@/components/ui/button'
import { Plus, Grid3x3, List, Download } from 'lucide-react'
import { ProductGrid } from './product-grid'
import { ProductTable } from './product-table'
import { ProductFormDialog } from './product-form-dialog'
import { ProductFilters } from './product-filters'
import { StockUpdateDialog } from './stock-update-dialog'
import { DeleteConfirmDialog } from './delete-confirm-dialog'
import { SkeletonCard, SkeletonTable } from '@/components/ui/loading-skeleton'

type ViewMode = 'grid' | 'table'

interface FiltersType {
  search?: string
  category_id?: string
  supplier_id?: string
  is_active?: boolean
  low_stock?: boolean
  page: number
  limit: number
}

export function InventoryContent() {
  const [viewMode, setViewMode] = useState<ViewMode>('grid')
  const [filters, setFilters] = useState<FiltersType>({
    page: 1,
    limit: 12,
  })
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null)
  const [showProductForm, setShowProductForm] = useState(false)
  const [showStockUpdate, setShowStockUpdate] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [productToEdit, setProductToEdit] = useState<unknown>(null)
  const [productToDelete, setProductToDelete] = useState<unknown>(null)

  // Fetch products with filters
  const productsQuery = trpc.inventory.getProducts.useQuery({
    search: filters.search,
    category_id: filters.category_id,
    supplier_id: filters.supplier_id,
    is_active: filters.is_active,
    low_stock: filters.low_stock,
    page: filters.page,
    limit: filters.limit,
  })

  const handleCreateProduct = () => {
    setProductToEdit(null)
    setShowProductForm(true)
  }

  const handleEditProduct = (product: unknown) => {
    setProductToEdit(product)
    setShowProductForm(true)
  }

  const handleUpdateStock = (productId: string) => {
    setSelectedProduct(productId)
    setShowStockUpdate(true)
  }

  const handleDeleteProduct = (product: unknown) => {
    setProductToDelete(product)
    setShowDeleteConfirm(true)
  }

  const handleExport = () => {
    // TODO: Implement export functionality
    console.log('Export products')
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Inventori</h1>
          <p className="text-muted-foreground">Kelola produk dan stok barang</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleExport}>
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button onClick={handleCreateProduct}>
            <Plus className="mr-2 h-4 w-4" />
            Produk Baru
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      {productsQuery.data && (
        <div className="grid gap-4 md:grid-cols-4">
          <div className="bg-card rounded-lg border p-4">
            <p className="text-muted-foreground text-sm font-medium">Total Produk</p>
            <p className="mt-2 text-2xl font-bold">{productsQuery.data.pagination.total}</p>
          </div>
          <div className="bg-card rounded-lg border p-4">
            <p className="text-muted-foreground text-sm font-medium">Total Stok</p>
            <p className="mt-2 text-2xl font-bold">
              {productsQuery.data.products.reduce((sum, p) => sum + p.stock, 0)}
            </p>
          </div>
          <div className="bg-card rounded-lg border p-4">
            <p className="text-muted-foreground text-sm font-medium">Stok Rendah</p>
            <p className="text-destructive mt-2 text-2xl font-bold">
              {productsQuery.data.lowStockCount || 0}
            </p>
          </div>
          <div className="bg-card rounded-lg border p-4">
            <p className="text-muted-foreground text-sm font-medium">Total Nilai</p>
            <p className="mt-2 text-2xl font-bold">
              Rp{' '}
              {productsQuery.data.products
                .reduce((sum, p) => sum + p.stock * Number(p.selling_price), 0)
                .toLocaleString('id-ID')}
            </p>
          </div>
        </div>
      )}

      {/* Filters */}
      <ProductFilters filters={filters} onFilterChange={setFilters} />

      {/* View Toggle & Results */}
      <div className="flex items-center justify-between">
        <p className="text-muted-foreground text-sm">
          {productsQuery.data?.pagination.total || 0} produk ditemukan
        </p>
        <div className="flex items-center gap-1 rounded-lg border p-1">
          <Button
            variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
            size="sm"
            onClick={() => setViewMode('grid')}
          >
            <Grid3x3 className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === 'table' ? 'secondary' : 'ghost'}
            size="sm"
            onClick={() => setViewMode('table')}
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Product Display */}
      {productsQuery.isLoading ? (
        viewMode === 'grid' ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : (
          <SkeletonTable rows={8} />
        )
      ) : viewMode === 'grid' ? (
        <ProductGrid
          data={
            productsQuery.data
              ? ({
                  products: productsQuery.data.products.map((p) => ({
                    ...p,
                    purchase_price: Number(p.purchase_price),
                    selling_price: Number(p.selling_price),
                  })),
                  pagination: productsQuery.data.pagination,
                  lowStockCount: productsQuery.data.lowStockCount,
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                } as any)
              : undefined
          }
          loading={productsQuery.isLoading}
          onEdit={handleEditProduct}
          onUpdateStock={handleUpdateStock}
          onDelete={handleDeleteProduct}
          onPageChange={(page: number) => setFilters({ ...filters, page })}
        />
      ) : (
        <ProductTable
          data={
            productsQuery.data
              ? ({
                  products: productsQuery.data.products.map((p) => ({
                    ...p,
                    purchase_price: Number(p.purchase_price),
                    selling_price: Number(p.selling_price),
                  })),
                  pagination: productsQuery.data.pagination,
                  lowStockCount: productsQuery.data.lowStockCount,
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                } as any)
              : undefined
          }
          loading={productsQuery.isLoading}
          onEdit={handleEditProduct}
          onUpdateStock={handleUpdateStock}
          onDelete={handleDeleteProduct}
          onPageChange={(page: number) => setFilters({ ...filters, page })}
        />
      )}

      {/* Dialogs */}
      <ProductFormDialog
        product={productToEdit}
        open={showProductForm}
        onOpenChange={setShowProductForm}
      />

      <StockUpdateDialog
        productId={selectedProduct}
        open={showStockUpdate}
        onOpenChange={setShowStockUpdate}
      />

      <DeleteConfirmDialog
        product={productToDelete}
        open={showDeleteConfirm}
        onOpenChange={setShowDeleteConfirm}
      />
    </div>
  )
}
