'use client'

import { useState } from 'react'
import { trpc } from '@/lib/trpc'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { PageContainer } from '@/components/shared/PageContainer'
import { PageHeader } from '@/components/shared/PageHeader'
import { MetricCard } from '@/components/shared/MetricCard'
import Image from 'next/image'
import { ResponsiveLayout } from '@/components/layout'
import { useDebounce } from '@/hooks/useDebounce'
import {
  Package,
  Plus,
  Search,
  Edit,
  Trash2,
  AlertTriangle,
  TrendingDown,
  TrendingUp,
  Box,
  DollarSign,
  Settings,
  Upload,
  ImageIcon,
  X,
  Grid3x3,
  List,
  ShoppingBag,
  ArrowUp,
  ArrowDown,
  RefreshCw,
  Clock,
  User,
} from 'lucide-react'

type ProductFormData = {
  id?: string
  sku: string
  name: string
  description?: string
  category_id: string
  supplier_id: string
  purchase_price: number
  selling_price: number
  stock: number
  min_stock: number
  image?: string // Base64 string or URL
  is_active: boolean
}

export default function InventoryPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [showStockModal, setShowStockModal] = useState(false)
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid')
  const [formData, setFormData] = useState<ProductFormData>({
    sku: '',
    name: '',
    description: '',
    category_id: '',
    supplier_id: '',
    purchase_price: 0,
    selling_price: 0,
    stock: 0,
    min_stock: 0,
    is_active: true,
  })
  const [selectedProduct, setSelectedProduct] = useState<string>('')
  const [stockMovement, setStockMovement] = useState({
    type: 'IN' as 'IN' | 'OUT' | 'ADJUSTMENT',
    quantity: 0,
    notes: '',
  })

  // Debounce search query to reduce API calls
  const debouncedSearchQuery = useDebounce(searchQuery, 500)

  const utils = trpc.useUtils()

  // Queries
  const { data: productsData } = trpc.inventory.getProducts.useQuery({
    search: debouncedSearchQuery,
    category_id: selectedCategory || undefined,
    page: 1,
    limit: 50,
  })

  const { data: categories } = trpc.inventory.getCategories.useQuery()
  const { data: suppliers } = trpc.inventory.getSuppliers.useQuery()
  const { data: lowStockAlerts } = trpc.inventory.getLowStockAlerts.useQuery()
  const { data: stats } = trpc.inventory.getInventoryStats.useQuery()

  // Stock movements for selected product
  const { data: stockMovementsData } = trpc.inventory.getStockMovements.useQuery(
    {
      product_id: selectedProduct || undefined,
      page: 1,
      limit: 20,
    },
    {
      enabled: !!selectedProduct && showStockModal, // Only fetch when modal is open
    }
  )

  // Mutations
  const createMutation = trpc.inventory.createProduct.useMutation({
    onSuccess: () => {
      utils.inventory.getProducts.invalidate()
      utils.inventory.getInventoryStats.invalidate()
      setShowForm(false)
      resetForm()
    },
  })

  const updateMutation = trpc.inventory.updateProduct.useMutation({
    onSuccess: () => {
      utils.inventory.getProducts.invalidate()
      utils.inventory.getInventoryStats.invalidate()
      setShowForm(false)
      resetForm()
    },
  })

  const deleteMutation = trpc.inventory.deleteProduct.useMutation({
    onSuccess: () => {
      utils.inventory.getProducts.invalidate()
      utils.inventory.getInventoryStats.invalidate()
      utils.inventory.getLowStockAlerts.invalidate()
    },
  })

  const stockMovementMutation = trpc.inventory.recordStockMovement.useMutation({
    onSuccess: () => {
      utils.inventory.getProducts.invalidate()
      utils.inventory.getInventoryStats.invalidate()
      utils.inventory.getLowStockAlerts.invalidate()
      utils.inventory.getStockMovements.invalidate() // Refresh timeline
      setStockMovement({ type: 'IN', quantity: 0, notes: '' })
    },
  })

  const resetForm = () => {
    setFormData({
      sku: '',
      name: '',
      description: '',
      category_id: '',
      supplier_id: '',
      purchase_price: 0,
      selling_price: 0,
      stock: 0,
      min_stock: 0,
      is_active: true,
    })
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleEdit = (product: any) => {
    setFormData({
      id: product.id,
      sku: product.sku,
      name: product.name,
      description: product.description || '',
      category_id: product.category_id,
      supplier_id: product.supplier_id,
      purchase_price: Number(product.purchase_price),
      selling_price: Number(product.selling_price),
      stock: product.stock,
      min_stock: product.min_stock,
      is_active: product.is_active,
    })
    setShowForm(true)
  }

  const handleDelete = (id: string) => {
    if (confirm('Hapus produk ini?')) {
      deleteMutation.mutate({ id })
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.id) {
      updateMutation.mutate({ ...formData, id: formData.id })
    } else {
      createMutation.mutate(formData)
    }
  }

  const handleStockMovement = () => {
    if (!selectedProduct || stockMovement.quantity <= 0) return
    stockMovementMutation.mutate({
      product_id: selectedProduct,
      ...stockMovement,
    })
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  return (
    <ResponsiveLayout>
      <PageContainer>
        <PageHeader
          title="Manajemen Inventori"
          subtitle="Kelola stok dan produk koperasi"
          action={
            <Button onClick={() => setShowForm(true)} className="bg-green-600 hover:bg-green-700">
              <Plus className="mr-2 h-4 w-4" />
              Tambah Produk
            </Button>
          }
        />

        {/* Statistics Cards */}
        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <MetricCard
            title="TOTAL PRODUK"
            value={stats?.totalProducts || 0}
            subtitle={`${stats?.activeProducts || 0} Produk Aktif`}
            icon={Package}
            variant="green"
          />

          <MetricCard
            title="TOTAL STOK"
            value={stats?.totalStock || 0}
            subtitle="Unit tersedia"
            icon={Box}
            variant="blue"
          />

          <MetricCard
            title="STOK MENIPIS"
            value={stats?.lowStockProducts || 0}
            subtitle="Perlu restock"
            icon={AlertTriangle}
            variant="orange"
          />

          <MetricCard
            title="NILAI INVENTORI"
            value={formatCurrency(Number(stats?.inventoryValue) || 0)}
            subtitle="Total nilai stok"
            icon={DollarSign}
            variant="purple"
          />
        </div>

        {/* Low Stock Alerts - Enhanced */}
        {lowStockAlerts && lowStockAlerts.length > 0 && (
          <Card className="mb-6 border-2 border-orange-200 bg-linear-to-br from-orange-50 to-yellow-50 shadow-lg">
            <CardHeader className="border-b border-orange-200 bg-white/80">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-lg text-orange-700">
                  <div className="rounded-full bg-orange-600 p-2">
                    <AlertTriangle className="h-5 w-5 animate-pulse text-white" />
                  </div>
                  Peringatan Stok Menipis
                  <span className="rounded-full bg-orange-600 px-3 py-1 text-sm font-bold text-white">
                    {lowStockAlerts.length}
                  </span>
                </CardTitle>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-orange-600 text-orange-600 hover:bg-orange-600 hover:text-white"
                >
                  Export List
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-4">
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                {lowStockAlerts.slice(0, 6).map((product: any) => {
                  const stockPercentage = (product.stock / product.min_stock) * 100
                  const reorderQty = Math.ceil(product.min_stock * 2 - product.stock)

                  return (
                    <Card
                      key={product.id}
                      className="border-2 border-orange-200 bg-white transition-all hover:border-orange-400 hover:shadow-xl"
                    >
                      <CardContent className="p-4">
                        {/* Product Info */}
                        <div className="mb-3">
                          <h3 className="mb-1 line-clamp-2 font-bold text-gray-900">
                            {product.name}
                          </h3>
                          <p className="w-fit rounded bg-gray-100 px-2 py-1 font-mono text-xs text-gray-500">
                            {product.sku}
                          </p>
                        </div>

                        {/* Stock Level Indicator */}
                        <div className="mb-3">
                          <div className="mb-1 flex items-center justify-between">
                            <span className="text-xs font-medium text-gray-600">Stock Level</span>
                            <span
                              className={`text-xs font-bold ${
                                stockPercentage < 50
                                  ? 'text-red-600'
                                  : stockPercentage < 75
                                    ? 'text-orange-600'
                                    : 'text-yellow-600'
                              }`}
                            >
                              {stockPercentage.toFixed(0)}%
                            </span>
                          </div>
                          <div className="h-2 overflow-hidden rounded-full bg-gray-200">
                            <div
                              className={`h-full transition-all ${
                                stockPercentage < 50
                                  ? 'bg-red-500'
                                  : stockPercentage < 75
                                    ? 'bg-orange-500'
                                    : 'bg-yellow-500'
                              }`}
                              style={{ width: `${Math.min(stockPercentage, 100)}%` }}
                            />
                          </div>
                          <div className="mt-1 flex items-center justify-between">
                            <span className="text-sm font-bold text-orange-600">
                              {product.stock} unit
                            </span>
                            <span className="text-xs text-gray-500">Min: {product.min_stock}</span>
                          </div>
                        </div>

                        {/* Supplier Info */}
                        <div className="mb-3 rounded-lg border border-blue-200 bg-blue-50 p-2">
                          <div className="mb-1 flex items-center gap-2">
                            <Package className="h-3 w-3 text-blue-600" />
                            <span className="text-xs font-semibold text-blue-900">Supplier</span>
                          </div>
                          <p className="text-sm font-medium text-blue-700">
                            {product.supplier?.business_name || 'N/A'}
                          </p>
                          {product.supplier?.phone && (
                            <p className="text-xs text-blue-600">📞 {product.supplier.phone}</p>
                          )}
                        </div>

                        {/* Reorder Suggestion */}
                        <div className="mb-3 rounded-lg border border-green-200 bg-green-50 p-2">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-xs font-semibold text-green-900">
                                Reorder Suggestion
                              </p>
                              <p className="text-lg font-bold text-green-600">+{reorderQty} unit</p>
                            </div>
                            <TrendingDown className="h-6 w-6 text-green-600" />
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            className="flex-1 bg-green-600 text-xs hover:bg-green-700"
                            onClick={() => {
                              setSelectedProduct(product.id)
                              setStockMovement({
                                type: 'IN',
                                quantity: reorderQty,
                                notes: `Restock - Low stock alert`,
                              })
                              setShowStockModal(true)
                            }}
                          >
                            <Plus className="mr-1 h-3 w-3" />
                            Restock
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="flex-1 text-xs"
                            onClick={() => handleEdit(product)}
                          >
                            <Edit className="mr-1 h-3 w-3" />
                            Edit
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>

              {/* Show More if there are more alerts */}
              {lowStockAlerts.length > 6 && (
                <div className="mt-4 text-center">
                  <Button
                    variant="outline"
                    className="border-orange-600 text-orange-600 hover:bg-orange-50"
                  >
                    Show {lowStockAlerts.length - 6} More Alerts
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Filters & View Toggle */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute top-3 left-3 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Cari produk (nama, SKU, deskripsi)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border py-2 pr-4 pl-10 focus:ring-2 focus:ring-green-500 focus:outline-none"
            />
          </div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="rounded-lg border px-4 py-2 focus:ring-2 focus:ring-green-500 focus:outline-none"
          >
            <option value="">Semua Kategori</option>
            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
            {categories?.map((cat: any) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>

          {/* View Toggle */}
          <div className="flex gap-2 rounded-lg border p-1">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('grid')}
              className={viewMode === 'grid' ? 'bg-green-600 hover:bg-green-700' : ''}
            >
              <Grid3x3 className="mr-1 h-4 w-4" />
              Grid
            </Button>
            <Button
              variant={viewMode === 'table' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('table')}
              className={viewMode === 'table' ? 'bg-green-600 hover:bg-green-700' : ''}
            >
              <List className="mr-1 h-4 w-4" />
              Table
            </Button>
          </div>
        </div>

        {/* Products Grid View */}
        {viewMode === 'grid' && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {productsData?.products && productsData.products.length > 0 ? (
              <>
                {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                {productsData.products.map((product: any) => {
                  const isLowStock = product.stock <= product.min_stock
                  const profitMargin = (
                    ((product.selling_price - product.purchase_price) / product.purchase_price) *
                    100
                  ).toFixed(1)

                  return (
                    <Card
                      key={product.id}
                      className="group overflow-hidden transition-all hover:shadow-xl"
                    >
                      <CardContent className="p-0">
                        {/* Product Image */}
                        <div className="relative flex h-48 items-center justify-center overflow-hidden bg-linear-to-br from-gray-50 to-gray-100">
                          {product.image ? (
                            <Image
                              src={product.image}
                              alt={product.name}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <ShoppingBag className="h-20 w-20 text-gray-300" />
                          )}

                          {/* Status Badge */}
                          <div className="absolute top-2 left-2">
                            <span
                              className={`rounded-full px-2 py-1 text-xs font-bold shadow-lg ${
                                product.is_active
                                  ? 'bg-green-500 text-white'
                                  : 'bg-gray-400 text-white'
                              }`}
                            >
                              {product.is_active ? 'Aktif' : 'Non-aktif'}
                            </span>
                          </div>

                          {/* Low Stock Badge */}
                          {isLowStock && (
                            <div className="absolute top-2 right-2">
                              <span className="flex items-center gap-1 rounded-full bg-orange-500 px-2 py-1 text-xs font-bold text-white shadow-lg">
                                <AlertTriangle className="h-3 w-3" />
                                Stok Rendah
                              </span>
                            </div>
                          )}

                          {/* Quick Actions - appears on hover */}
                          <div className="absolute inset-0 flex items-end justify-center gap-2 bg-linear-to-t from-black/80 to-transparent pb-4 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                            <Button
                              size="sm"
                              className="bg-white text-gray-900 shadow-lg hover:bg-gray-100"
                              onClick={() => handleEdit(product)}
                            >
                              <Edit className="mr-1 h-3 w-3" />
                              Edit
                            </Button>
                            <Button
                              size="sm"
                              className="bg-green-600 text-white shadow-lg hover:bg-green-700"
                              onClick={() => {
                                setSelectedProduct(product.id)
                                setShowStockModal(true)
                              }}
                            >
                              <TrendingDown className="mr-1 h-3 w-3" />
                              Stok
                            </Button>
                            <Button
                              size="sm"
                              className="bg-red-600 text-white shadow-lg hover:bg-red-700"
                              onClick={() => handleDelete(product.id)}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>

                        {/* Product Info */}
                        <div className="space-y-3 p-4">
                          {/* SKU & Category */}
                          <div className="flex items-center justify-between gap-2">
                            <span className="rounded bg-gray-100 px-2 py-1 font-mono text-xs text-gray-500">
                              {product.sku}
                            </span>
                            <span className="rounded bg-blue-50 px-2 py-1 text-xs text-gray-600">
                              {product.category?.name}
                            </span>
                          </div>

                          {/* Product Name */}
                          <div className="min-h-[48px]">
                            <h3 className="line-clamp-2 leading-tight font-semibold text-gray-900">
                              {product.name}
                            </h3>
                          </div>

                          {/* Supplier */}
                          <div className="flex items-center gap-1 text-xs text-gray-500">
                            <Package className="h-3 w-3" />
                            {product.supplier?.business_name}
                          </div>

                          {/* Description */}
                          {product.description && (
                            <p className="line-clamp-2 text-xs text-gray-500">
                              {product.description}
                            </p>
                          )}

                          {/* Price & Stock */}
                          <div className="space-y-2 border-t pt-3">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-xs text-gray-500">Harga Jual</p>
                                <p className="text-lg font-bold text-green-600">
                                  Rp {Number(product.selling_price).toLocaleString('id-ID')}
                                </p>
                              </div>
                              <div className="text-right">
                                <p className="text-xs text-gray-500">Stok</p>
                                <p
                                  className={`text-2xl font-bold ${
                                    isLowStock ? 'text-orange-600' : 'text-gray-900'
                                  }`}
                                >
                                  {product.stock}
                                </p>
                              </div>
                            </div>

                            {/* Profit Margin */}
                            <div className="flex items-center justify-between rounded bg-green-50 px-2 py-1 text-xs">
                              <span className="text-gray-600">Margin Keuntungan</span>
                              <span className="font-bold text-green-600">+{profitMargin}%</span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </>
            ) : (
              <div className="col-span-full">
                <Card>
                  <CardContent className="py-16 text-center">
                    <Package className="mx-auto mb-4 h-20 w-20 text-gray-300" />
                    <h3 className="mb-2 text-lg font-semibold text-gray-900">
                      {searchQuery || selectedCategory
                        ? 'Produk tidak ditemukan'
                        : 'Belum ada produk'}
                    </h3>
                    <p className="mb-4 text-sm text-gray-500">
                      {searchQuery || selectedCategory
                        ? 'Coba kata kunci atau kategori lain'
                        : 'Klik tombol "Tambah Produk" untuk memulai'}
                    </p>
                    {!searchQuery && !selectedCategory && (
                      <Button
                        onClick={() => setShowForm(true)}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <Plus className="mr-2 h-4 w-4" />
                        Tambah Produk Pertama
                      </Button>
                    )}
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        )}

        {/* Products Table View */}
        {viewMode === 'table' && (
          <Card>
            <CardHeader>
              <CardTitle>Daftar Produk</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="px-4 py-3 text-left">SKU</th>
                      <th className="px-4 py-3 text-left">Nama Produk</th>
                      <th className="px-4 py-3 text-left">Kategori</th>
                      <th className="px-4 py-3 text-left">Supplier</th>
                      <th className="px-4 py-3 text-right">Harga Beli</th>
                      <th className="px-4 py-3 text-right">Harga Jual</th>
                      <th className="px-4 py-3 text-center">Stok</th>
                      <th className="px-4 py-3 text-center">Status</th>
                      <th className="px-4 py-3 text-center">Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                    {productsData?.products.map((product: any) => (
                      <tr key={product.id} className="border-b hover:bg-gray-50">
                        <td className="px-4 py-3 font-mono text-sm">{product.sku}</td>
                        <td className="px-4 py-3">
                          <div>
                            <p className="font-medium">{product.name}</p>
                            {product.description && (
                              <p className="line-clamp-1 text-xs text-gray-500">
                                {product.description}
                              </p>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-3">{product.category?.name}</td>
                        <td className="px-4 py-3">{product.supplier?.business_name}</td>
                        <td className="px-4 py-3 text-right">
                          Rp {Number(product.purchase_price).toLocaleString('id-ID')}
                        </td>
                        <td className="px-4 py-3 text-right font-medium">
                          Rp {Number(product.selling_price).toLocaleString('id-ID')}
                        </td>
                        <td className="px-4 py-3 text-center">
                          <div className="flex items-center justify-center gap-2">
                            <span
                              className={`font-bold ${
                                product.stock <= product.min_stock
                                  ? 'text-yellow-600'
                                  : 'text-green-600'
                              }`}
                            >
                              {product.stock}
                            </span>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setSelectedProduct(product.id)
                                setShowStockModal(true)
                              }}
                              className="h-6 w-6 p-0"
                            >
                              <TrendingDown className="h-3 w-3" />
                            </Button>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <span
                            className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                              product.is_active
                                ? 'bg-green-100 text-green-700'
                                : 'bg-gray-100 text-gray-700'
                            }`}
                          >
                            {product.is_active ? 'Aktif' : 'Non-aktif'}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-center gap-2">
                            <Button size="sm" variant="ghost" onClick={() => handleEdit(product)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleDelete(product.id)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Product Form Modal - Enhanced */}
        {showForm && (
          <div className="animate-in fade-in fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/50 p-4 backdrop-blur-sm duration-200">
            <Card className="animate-in zoom-in my-8 w-full max-w-3xl shadow-2xl duration-200">
              <CardHeader className="bg-linear-to-r from-green-600 to-emerald-600 text-white">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2 text-xl">
                    <Package className="h-6 w-6" />
                    {formData.id ? 'Edit Produk' : 'Tambah Produk Baru'}
                  </CardTitle>
                  <Button
                    variant="ghost"
                    onClick={() => setShowForm(false)}
                    className="text-white hover:bg-white/20"
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Basic Information Section */}
                  <div className="rounded-lg border-2 border-gray-200 bg-gray-50 p-4">
                    <h3 className="mb-4 flex items-center gap-2 text-sm font-bold text-gray-900">
                      <Package className="h-4 w-4 text-green-600" />
                      Informasi Dasar
                    </h3>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="mb-2 block text-sm font-semibold text-gray-700">
                            SKU *{' '}
                            <span className="text-xs text-gray-500">(Stock Keeping Unit)</span>
                          </label>
                          <input
                            type="text"
                            required
                            value={formData.sku}
                            onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                            placeholder="contoh: PRD-001"
                            className="w-full rounded-lg border-2 px-4 py-2.5 font-mono transition-all focus:border-green-500 focus:ring-2 focus:ring-green-500 focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="mb-2 block text-sm font-semibold text-gray-700">
                            Nama Produk *
                          </label>
                          <input
                            type="text"
                            required
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            placeholder="Nama lengkap produk"
                            className="w-full rounded-lg border-2 px-4 py-2.5 transition-all focus:border-green-500 focus:ring-2 focus:ring-green-500 focus:outline-none"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="mb-2 block text-sm font-semibold text-gray-700">
                          Deskripsi Produk <span className="text-xs text-gray-500">(Opsional)</span>
                        </label>
                        <textarea
                          value={formData.description}
                          onChange={(e) =>
                            setFormData({ ...formData, description: e.target.value })
                          }
                          rows={3}
                          placeholder="Deskripsi detail tentang produk ini..."
                          className="w-full resize-none rounded-lg border-2 px-4 py-2.5 transition-all focus:border-green-500 focus:ring-2 focus:ring-green-500 focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Category & Supplier Section */}
                  <div className="rounded-lg border-2 border-gray-200 bg-blue-50 p-4">
                    <h3 className="mb-4 flex items-center gap-2 text-sm font-bold text-gray-900">
                      <Box className="h-4 w-4 text-blue-600" />
                      Kategori & Supplier
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="mb-2 block text-sm font-semibold text-gray-700">
                          Kategori *
                        </label>
                        <select
                          required
                          value={formData.category_id}
                          onChange={(e) =>
                            setFormData({ ...formData, category_id: e.target.value })
                          }
                          className="w-full rounded-lg border-2 bg-white px-4 py-2.5 font-medium transition-all focus:border-green-500 focus:ring-2 focus:ring-green-500 focus:outline-none"
                        >
                          <option value="">-- Pilih Kategori --</option>
                          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                          {categories?.map((cat: any) => (
                            <option key={cat.id} value={cat.id}>
                              {cat.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="mb-2 block text-sm font-semibold text-gray-700">
                          Supplier *
                        </label>
                        <select
                          required
                          value={formData.supplier_id}
                          onChange={(e) =>
                            setFormData({ ...formData, supplier_id: e.target.value })
                          }
                          className="w-full rounded-lg border-2 bg-white px-4 py-2.5 font-medium transition-all focus:border-green-500 focus:ring-2 focus:ring-green-500 focus:outline-none"
                        >
                          <option value="">-- Pilih Supplier --</option>
                          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                          {suppliers?.map((sup: any) => (
                            <option key={sup.id} value={sup.id}>
                              {sup.business_name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Pricing Section */}
                  <div className="rounded-lg border-2 border-gray-200 bg-green-50 p-4">
                    <h3 className="mb-4 flex items-center gap-2 text-sm font-bold text-gray-900">
                      <DollarSign className="h-4 w-4 text-green-600" />
                      Harga & Margin Keuntungan
                    </h3>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="mb-2 block text-sm font-semibold text-gray-700">
                            Harga Beli (Rp) *
                          </label>
                          <input
                            type="number"
                            required
                            min="0"
                            step="100"
                            value={formData.purchase_price || ''}
                            onChange={(e) =>
                              setFormData({ ...formData, purchase_price: Number(e.target.value) })
                            }
                            placeholder="0"
                            className="w-full rounded-lg border-2 px-4 py-2.5 text-lg font-bold transition-all focus:border-green-500 focus:ring-2 focus:ring-green-500 focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="mb-2 block text-sm font-semibold text-gray-700">
                            Harga Jual (Rp) *
                          </label>
                          <input
                            type="number"
                            required
                            min="0"
                            step="100"
                            value={formData.selling_price || ''}
                            onChange={(e) =>
                              setFormData({ ...formData, selling_price: Number(e.target.value) })
                            }
                            placeholder="0"
                            className="w-full rounded-lg border-2 px-4 py-2.5 text-lg font-bold transition-all focus:border-green-500 focus:ring-2 focus:ring-green-500 focus:outline-none"
                          />
                        </div>
                      </div>

                      {/* Profit Margin Calculator */}
                      {formData.purchase_price > 0 && formData.selling_price > 0 && (
                        <div className="rounded-lg border-2 border-green-200 bg-white p-3">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-xs font-medium text-gray-600">Profit Margin</p>
                              <p className="text-2xl font-bold text-green-600">
                                {(
                                  ((formData.selling_price - formData.purchase_price) /
                                    formData.purchase_price) *
                                  100
                                ).toFixed(1)}
                                %
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-xs font-medium text-gray-600">Profit Per Unit</p>
                              <p className="text-lg font-bold text-green-600">
                                Rp{' '}
                                {(formData.selling_price - formData.purchase_price).toLocaleString(
                                  'id-ID'
                                )}
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Stock Management Section */}
                  <div className="rounded-lg border-2 border-gray-200 bg-purple-50 p-4">
                    <h3 className="mb-4 flex items-center gap-2 text-sm font-bold text-gray-900">
                      <TrendingUp className="h-4 w-4 text-purple-600" />
                      Manajemen Stok
                    </h3>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="mb-2 block text-sm font-semibold text-gray-700">
                            Stok Awal *{' '}
                            {formData.id && (
                              <span className="text-xs text-orange-600">(Tidak bisa diubah)</span>
                            )}
                          </label>
                          <input
                            type="number"
                            required
                            min="0"
                            value={formData.stock || ''}
                            onChange={(e) =>
                              setFormData({ ...formData, stock: Number(e.target.value) })
                            }
                            placeholder="0"
                            disabled={!!formData.id}
                            className="w-full rounded-lg border-2 px-4 py-2.5 text-lg font-bold transition-all focus:border-green-500 focus:ring-2 focus:ring-green-500 focus:outline-none disabled:cursor-not-allowed disabled:bg-gray-200"
                          />
                          {formData.id && (
                            <p className="mt-1 text-xs text-gray-600">
                              💡 Gunakan <span className="font-bold">&quot;Kelola Stok&quot;</span>{' '}
                              untuk update stok
                            </p>
                          )}
                        </div>
                        <div>
                          <label className="mb-2 block text-sm font-semibold text-gray-700">
                            Stok Minimum *{' '}
                            <span className="text-xs text-gray-500">(Alert threshold)</span>
                          </label>
                          <input
                            type="number"
                            required
                            min="0"
                            value={formData.min_stock || ''}
                            onChange={(e) =>
                              setFormData({ ...formData, min_stock: Number(e.target.value) })
                            }
                            placeholder="0"
                            className="w-full rounded-lg border-2 px-4 py-2.5 text-lg font-bold transition-all focus:border-green-500 focus:ring-2 focus:ring-green-500 focus:outline-none"
                          />
                        </div>
                      </div>

                      {/* Stock Alert Preview */}
                      {formData.stock !== undefined &&
                        formData.min_stock !== undefined &&
                        formData.stock <= formData.min_stock && (
                          <div className="flex items-center gap-3 rounded-lg border-2 border-orange-300 bg-orange-100 p-3">
                            <AlertTriangle className="h-5 w-5 shrink-0 text-orange-600" />
                            <div>
                              <p className="text-sm font-bold text-orange-800">
                                Peringatan Stok Rendah!
                              </p>
                              <p className="text-xs text-orange-700">
                                Stok saat ini ({formData.stock}) berada di atau di bawah minimum (
                                {formData.min_stock})
                              </p>
                            </div>
                          </div>
                        )}
                    </div>
                  </div>

                  {/* Image Upload Section */}
                  <div className="rounded-lg border-2 border-gray-200 bg-indigo-50 p-4">
                    <h3 className="mb-4 flex items-center gap-2 text-sm font-bold text-gray-900">
                      <ImageIcon className="h-4 w-4 text-indigo-600" />
                      Gambar Produk{' '}
                      <span className="text-xs font-normal text-gray-500">(Opsional)</span>
                    </h3>
                    <div className="space-y-4">
                      {/* Image Preview */}
                      {formData.image && (
                        <div className="group relative mx-auto aspect-square w-full max-w-xs overflow-hidden rounded-lg border-2 border-indigo-200">
                          <Image
                            src={formData.image}
                            alt="Product preview"
                            fill
                            className="object-cover"
                          />
                          <button
                            type="button"
                            onClick={() => setFormData({ ...formData, image: undefined })}
                            className="absolute top-2 right-2 rounded-full bg-red-500 p-2 text-white opacity-0 transition-opacity group-hover:opacity-100 hover:bg-red-600"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      )}

                      {/* Upload Button */}
                      <div className="flex w-full items-center justify-center">
                        <label className="flex h-32 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-indigo-300 bg-white transition-colors hover:bg-indigo-100">
                          <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <Upload className="mb-2 h-8 w-8 text-indigo-600" />
                            <p className="mb-2 text-sm font-semibold text-gray-700">
                              <span className="text-indigo-600">Click to upload</span> or drag and
                              drop
                            </p>
                            <p className="text-xs text-gray-500">PNG, JPG, JPEG (MAX. 2MB)</p>
                          </div>
                          <input
                            type="file"
                            className="hidden"
                            accept="image/png,image/jpeg,image/jpg"
                            onChange={(e) => {
                              const file = e.target.files?.[0]
                              if (file) {
                                // Check file size (2MB max)
                                if (file.size > 2 * 1024 * 1024) {
                                  alert('File terlalu besar! Maksimal 2MB')
                                  return
                                }

                                // Convert to Base64
                                const reader = new FileReader()
                                reader.onloadend = () => {
                                  setFormData({ ...formData, image: reader.result as string })
                                }
                                reader.readAsDataURL(file)
                              }
                            }}
                          />
                        </label>
                      </div>

                      {/* Future-proof note */}
                      <p className="text-center text-xs text-gray-500 italic">
                        💡 <span className="font-semibold">Production:</span> Gambar akan di-upload
                        ke cloud storage untuk performa optimal
                      </p>
                    </div>
                  </div>

                  {/* Status & Settings Section */}
                  <div className="rounded-lg border-2 border-gray-200 bg-gray-50 p-4">
                    <h3 className="mb-4 flex items-center gap-2 text-sm font-bold text-gray-900">
                      <Settings className="h-4 w-4 text-gray-600" />
                      Status & Pengaturan
                    </h3>
                    <div className="space-y-3">
                      <label className="group flex cursor-pointer items-center gap-3">
                        <div className="relative">
                          <input
                            type="checkbox"
                            checked={formData.is_active}
                            onChange={(e) =>
                              setFormData({ ...formData, is_active: e.target.checked })
                            }
                            className="peer sr-only"
                          />
                          <div className="peer h-6 w-11 rounded-full bg-gray-300 transition-colors peer-checked:bg-green-500"></div>
                          <div className="absolute top-1 left-1 h-4 w-4 rounded-full bg-white transition-transform peer-checked:translate-x-5"></div>
                        </div>
                        <div>
                          <span className="text-sm font-bold text-gray-900 transition-colors group-hover:text-green-600">
                            {formData.is_active ? '✅ Produk Aktif' : '❌ Produk Non-aktif'}
                          </span>
                          <p className="text-xs text-gray-600">
                            {formData.is_active
                              ? 'Produk dapat dijual dan muncul di POS'
                              : 'Produk disembunyikan dari POS'}
                          </p>
                        </div>
                      </label>

                      {/* Quick Stock Action for Edit Mode */}
                      {formData.id && (
                        <div className="mt-4 rounded-lg border-2 border-blue-200 bg-blue-50 p-3">
                          <p className="mb-2 text-xs font-semibold text-blue-900">⚡ Aksi Cepat</p>
                          <button
                            type="button"
                            onClick={() => {
                              setShowForm(false)
                              setShowStockModal(true)
                            }}
                            className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2 font-bold text-white transition-colors hover:bg-blue-700"
                          >
                            <TrendingUp className="h-4 w-4" />
                            Kelola Stok Sekarang
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-2 pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowForm(false)}
                      className="flex-1"
                    >
                      Batal
                    </Button>
                    <Button
                      type="submit"
                      disabled={createMutation.isPending || updateMutation.isPending}
                      className="flex-1 bg-green-600 hover:bg-green-700"
                    >
                      {createMutation.isPending || updateMutation.isPending
                        ? 'Menyimpan...'
                        : 'Simpan'}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Stock Movement Modal with Timeline History */}
        {showStockModal && (
          <div className="animate-in fade-in fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
            <Card className="animate-in zoom-in max-h-[90vh] w-full max-w-4xl overflow-hidden">
              <CardHeader className="bg-linear-to-r from-purple-600 to-indigo-600 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Package className="h-5 w-5" />
                      Mutasi Stok
                    </CardTitle>
                    {selectedProduct && (
                      <p className="mt-1 text-sm text-purple-100">
                        {
                          productsData?.products.find(
                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                            (p: any) => p.id === selectedProduct
                          )?.name
                        }
                      </p>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    onClick={() => setShowStockModal(false)}
                    className="text-white hover:bg-white/20"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="max-h-[calc(90vh-80px)] overflow-y-auto p-6">
                <div className="grid gap-6 md:grid-cols-2">
                  {/* Left: Stock Movement Form */}
                  <div className="space-y-4">
                    <h3 className="flex items-center gap-2 text-lg font-bold text-gray-900">
                      <TrendingUp className="h-5 w-5 text-purple-600" />
                      Tambah Mutasi Baru
                    </h3>
                    <div className="space-y-4 rounded-lg border-2 border-purple-200 bg-purple-50 p-4">
                      <div>
                        <label className="mb-2 block text-sm font-semibold text-gray-700">
                          Jenis Mutasi *
                        </label>
                        <select
                          value={stockMovement.type}
                          onChange={(e) =>
                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                            setStockMovement({ ...stockMovement, type: e.target.value as any })
                          }
                          className="w-full rounded-lg border-2 px-4 py-2.5 font-medium transition-all focus:border-purple-500 focus:ring-2 focus:ring-purple-500 focus:outline-none"
                        >
                          <option value="IN">📥 Stok Masuk (IN)</option>
                          <option value="OUT">📤 Stok Keluar (OUT)</option>
                          <option value="ADJUSTMENT">🔄 Penyesuaian (ADJUSTMENT)</option>
                        </select>
                      </div>

                      <div>
                        <label className="mb-2 block text-sm font-semibold text-gray-700">
                          Jumlah *
                        </label>
                        <input
                          type="number"
                          min="1"
                          value={stockMovement.quantity || ''}
                          onChange={(e) =>
                            setStockMovement({ ...stockMovement, quantity: Number(e.target.value) })
                          }
                          placeholder="0"
                          className="w-full rounded-lg border-2 px-4 py-2.5 text-lg font-bold transition-all focus:border-purple-500 focus:ring-2 focus:ring-purple-500 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="mb-2 block text-sm font-semibold text-gray-700">
                          Catatan <span className="text-xs text-gray-500">(Opsional)</span>
                        </label>
                        <textarea
                          value={stockMovement.notes}
                          onChange={(e) =>
                            setStockMovement({ ...stockMovement, notes: e.target.value })
                          }
                          rows={3}
                          className="w-full resize-none rounded-lg border-2 px-4 py-2.5 transition-all focus:border-purple-500 focus:ring-2 focus:ring-purple-500 focus:outline-none"
                          placeholder="Tambahkan catatan untuk mutasi ini..."
                        />
                      </div>

                      <div className="flex gap-2 pt-2">
                        <Button
                          variant="outline"
                          onClick={() => setShowStockModal(false)}
                          className="flex-1"
                        >
                          Batal
                        </Button>
                        <Button
                          onClick={handleStockMovement}
                          disabled={stockMovementMutation.isPending || stockMovement.quantity <= 0}
                          className="flex-1 bg-purple-600 hover:bg-purple-700"
                        >
                          {stockMovementMutation.isPending ? 'Memproses...' : '💾 Simpan Mutasi'}
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Right: Stock Movement History Timeline */}
                  <div className="space-y-4">
                    <h3 className="flex items-center gap-2 text-lg font-bold text-gray-900">
                      <Clock className="h-5 w-5 text-indigo-600" />
                      Riwayat Mutasi Stok
                    </h3>

                    {/* Timeline Container */}
                    <div className="relative">
                      {stockMovementsData?.movements && stockMovementsData.movements.length > 0 ? (
                        <div className="space-y-4">
                          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                          {stockMovementsData.movements.map((movement: any, index: number) => {
                            const isLast = index === stockMovementsData.movements.length - 1

                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                            const typeConfigs: Record<string, any> = {
                              IN: {
                                icon: ArrowUp,
                                color: 'text-green-600',
                                bg: 'bg-green-100',
                                border: 'border-green-300',
                                label: 'Stok Masuk',
                                sign: '+',
                              },
                              OUT: {
                                icon: ArrowDown,
                                color: 'text-red-600',
                                bg: 'bg-red-100',
                                border: 'border-red-300',
                                label: 'Stok Keluar',
                                sign: '-',
                              },
                              ADJUSTMENT: {
                                icon: RefreshCw,
                                color: 'text-blue-600',
                                bg: 'bg-blue-100',
                                border: 'border-blue-300',
                                label: 'Penyesuaian',
                                sign: '±',
                              },
                            }

                            const typeConfig =
                              typeConfigs[movement.type as keyof typeof typeConfigs] ||
                              typeConfigs.ADJUSTMENT

                            const Icon = typeConfig.icon
                            const date = new Date(movement.created_at)
                            const formattedDate = date.toLocaleDateString('id-ID', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                            })
                            const formattedTime = date.toLocaleTimeString('id-ID', {
                              hour: '2-digit',
                              minute: '2-digit',
                            })

                            return (
                              <div key={movement.id} className="relative flex gap-4">
                                {/* Timeline Line */}
                                {!isLast && (
                                  <div className="absolute top-10 bottom-0 left-[18px] w-0.5 bg-gray-300" />
                                )}

                                {/* Icon Circle */}
                                <div
                                  className={`relative z-10 flex h-9 w-9 items-center justify-center rounded-full border-2 ${typeConfig.border} ${typeConfig.bg} shrink-0`}
                                >
                                  <Icon className={`h-5 w-5 ${typeConfig.color}`} />
                                </div>

                                {/* Content Card */}
                                <div className="flex-1 pb-6">
                                  <div className="rounded-lg border-2 border-gray-200 bg-white p-3 shadow-sm transition-shadow hover:shadow-md">
                                    <div className="mb-2 flex items-start justify-between">
                                      <div>
                                        <span className={`text-sm font-bold ${typeConfig.color}`}>
                                          {typeConfig.label}
                                        </span>
                                        <div className="mt-0.5 flex items-center gap-1 text-xs text-gray-500">
                                          <Clock className="h-3 w-3" />
                                          {formattedDate} • {formattedTime}
                                        </div>
                                      </div>
                                      <span className={`text-lg font-bold ${typeConfig.color}`}>
                                        {typeConfig.sign}
                                        {movement.quantity}
                                      </span>
                                    </div>

                                    {movement.notes && (
                                      <p className="mt-2 rounded border border-gray-200 bg-gray-50 p-2 text-sm text-gray-700">
                                        💬 {movement.notes}
                                      </p>
                                    )}

                                    {movement.created_by && (
                                      <div className="mt-2 flex items-center gap-1 text-xs text-gray-500">
                                        <User className="h-3 w-3" />
                                        <span>oleh: {movement.created_by}</span>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            )
                          })}
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center py-12 text-center">
                          <Clock className="mb-4 h-16 w-16 text-gray-300" />
                          <p className="mb-1 text-sm font-semibold text-gray-600">
                            Belum Ada Riwayat Mutasi
                          </p>
                          <p className="text-xs text-gray-500">
                            Mutasi stok yang Anda buat akan muncul di sini
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </PageContainer>
    </ResponsiveLayout>
  )
}
