'use client'

import { useState, useEffect } from 'react'
import { trpc } from '@/lib/trpc/client'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Search, Package, Plus, AlertCircle } from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface ProductSearchProps {
  onAddToCart: (product: {
    id: string
    name: string
    sku: string
    selling_price: number
    stock: number
  }) => void
}

const CATEGORIES = [
  { id: 'all', name: 'Semua Kategori' },
  { id: '1', name: 'Makanan' },
  { id: '2', name: 'Minuman' },
  { id: '3', name: 'Snack' },
  { id: '4', name: 'Keperluan Rumah' },
  { id: '5', name: 'Alat Tulis' },
  { id: '6', name: 'Lainnya' },
]

export function ProductSearch({ onAddToCart }: ProductSearchProps) {
  const [search, setSearch] = useState('')
  const [categoryId, setCategoryId] = useState('all')
  const [debouncedSearch, setDebouncedSearch] = useState('')

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search)
    }, 300)

    return () => clearTimeout(timer)
  }, [search])

  const productsQuery = trpc.pos.getProducts.useQuery({
    search: debouncedSearch,
    category_id: categoryId === 'all' ? undefined : categoryId,
    page: 1,
    limit: 20,
  })

  const handleAddToCart = (product: {
    id: string
    name: string
    sku: string
    selling_price: unknown
    stock: number
  }) => {
    onAddToCart({
      id: product.id,
      name: product.name,
      sku: product.sku,
      selling_price: Number(product.selling_price),
      stock: product.stock,
    })
  }

  return (
    <Card>
      <CardContent className="p-6">
        {/* Search Bar */}
        <div className="space-y-4">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
              <Input
                placeholder="Cari produk (nama atau SKU)..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
                autoFocus
              />
            </div>
            <Select value={categoryId} onValueChange={setCategoryId}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Kategori" />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Product Grid */}
          <div className="max-h-[600px] min-h-[500px] overflow-y-auto">
            {productsQuery.isLoading ? (
              <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
                {[...Array(8)].map((_, i) => (
                  <Card key={i}>
                    <CardContent className="p-4">
                      <Skeleton className="mb-2 h-4 w-3/4" />
                      <Skeleton className="mb-4 h-3 w-1/2" />
                      <Skeleton className="mb-2 h-6 w-full" />
                      <Skeleton className="h-3 w-2/3" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : productsQuery.error ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <AlertCircle className="text-destructive mb-4 h-12 w-12" />
                <p className="text-lg font-medium">Error loading products</p>
                <p className="text-muted-foreground text-sm">{productsQuery.error.message}</p>
              </div>
            ) : !productsQuery.data?.products.length ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Package className="text-muted-foreground mb-4 h-12 w-12" />
                <p className="text-lg font-medium">Produk tidak ditemukan</p>
                <p className="text-muted-foreground text-sm">Coba kata kunci atau filter lain</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
                {productsQuery.data.products.map((product) => {
                  const isLowStock = product.stock <= product.min_stock
                  const isOutOfStock = product.stock === 0

                  return (
                    <Card
                      key={product.id}
                      className="group cursor-pointer transition-shadow hover:shadow-lg"
                    >
                      <CardContent className="p-4">
                        <div className="space-y-2">
                          {/* Product Name */}
                          <div>
                            <p className="group-hover:text-primary line-clamp-2 text-sm font-medium transition-colors">
                              {product.name}
                            </p>
                            <p className="text-muted-foreground text-xs">{product.sku}</p>
                          </div>

                          {/* Price */}
                          <p className="text-primary text-lg font-bold">
                            Rp {Number(product.selling_price).toLocaleString('id-ID')}
                          </p>

                          {/* Stock Status */}
                          <div className="flex items-center justify-between">
                            {isOutOfStock ? (
                              <Badge variant="destructive" className="text-xs">
                                Habis
                              </Badge>
                            ) : isLowStock ? (
                              <Badge variant="secondary" className="text-xs">
                                Stok {product.stock}
                              </Badge>
                            ) : (
                              <Badge variant="outline" className="text-xs">
                                Stok {product.stock}
                              </Badge>
                            )}
                          </div>

                          {/* Add to Cart Button */}
                          <Button
                            size="sm"
                            className="w-full"
                            disabled={isOutOfStock}
                            onClick={() => handleAddToCart(product)}
                          >
                            <Plus className="mr-1 h-4 w-4" />
                            Tambah
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            )}
          </div>

          {/* Pagination Info */}
          {productsQuery.data && productsQuery.data.products.length > 0 && (
            <div className="text-muted-foreground border-t pt-2 text-center text-sm">
              Menampilkan {productsQuery.data.products.length} dari{' '}
              {productsQuery.data.pagination.total} produk
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
