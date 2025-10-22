'use client'

import { useState } from 'react'
import { trpc } from '@/lib/trpc'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Package,
  Plus,
  Search,
  Edit,
  Trash2,
  AlertTriangle,
  TrendingDown,
  Box,
  DollarSign,
  X,
  ArrowUp,
  ArrowDown,
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
  is_active: boolean
}

export default function InventoryPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [showStockModal, setShowStockModal] = useState(false)
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

  const utils = trpc.useUtils()

  // Queries
  const { data: productsData } = trpc.inventory.getProducts.useQuery({
    search: searchQuery,
    category_id: selectedCategory || undefined,
    page: 1,
    limit: 50,
  })

  const { data: categories } = trpc.inventory.getCategories.useQuery()
  const { data: suppliers } = trpc.inventory.getSuppliers.useQuery()
  const { data: lowStockAlerts } = trpc.inventory.getLowStockAlerts.useQuery()
  const { data: stats } = trpc.inventory.getInventoryStats.useQuery()

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
      setShowStockModal(false)
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Manajemen Inventori</h1>
        <Button onClick={() => setShowForm(true)} className="bg-green-600 hover:bg-green-700">
          <Plus className="mr-2 h-4 w-4" />
          Tambah Produk
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Produk</CardTitle>
            <Package className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalProducts || 0}</div>
            <p className="mt-1 text-xs text-gray-500">{stats?.activeProducts || 0} Aktif</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Stok</CardTitle>
            <Box className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalStock || 0}</div>
            <p className="mt-1 text-xs text-gray-500">Unit</p>
          </CardContent>
        </Card>

        <Card className="border-yellow-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-yellow-700">Stok Menipis</CardTitle>
            <AlertTriangle className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-700">{stats?.lowStockProducts || 0}</div>
            <p className="mt-1 text-xs text-yellow-600">Perlu Restock</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Nilai Inventori</CardTitle>
            <DollarSign className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              Rp {(stats?.inventoryValue || 0).toLocaleString('id-ID')}
            </div>
            <p className="mt-1 text-xs text-gray-500">Total Nilai</p>
          </CardContent>
        </Card>
      </div>

      {/* Low Stock Alerts */}
      {lowStockAlerts && lowStockAlerts.length > 0 && (
        <Card className="border-yellow-200 bg-yellow-50">
          <CardHeader>
            <CardTitle className="flex items-center text-lg text-yellow-700">
              <AlertTriangle className="mr-2 h-5 w-5" />
              Peringatan Stok Menipis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
              {lowStockAlerts.slice(0, 5).map((product: any) => (
                <div
                  key={product.id}
                  className="flex items-center justify-between rounded border bg-white p-2"
                >
                  <div>
                    <p className="font-medium">{product.name}</p>
                    <p className="text-sm text-gray-600">{product.sku}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-yellow-700">
                      {product.stock} / {product.min_stock}
                    </p>
                    <p className="text-xs text-gray-500">Stok / Min Stok</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Filters */}
      <div className="flex gap-4">
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
      </div>

      {/* Products Table */}
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

      {/* Product Form Modal */}
      {showForm && (
        <div className="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black p-4">
          <Card className="my-8 w-full max-w-2xl">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>{formData.id ? 'Edit Produk' : 'Tambah Produk'}</CardTitle>
              <Button variant="ghost" onClick={() => setShowForm(false)}>
                <X className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="mb-1 block text-sm font-medium">SKU *</label>
                    <input
                      type="text"
                      required
                      value={formData.sku}
                      onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                      className="w-full rounded-lg border px-3 py-2 focus:ring-2 focus:ring-green-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium">Nama Produk *</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full rounded-lg border px-3 py-2 focus:ring-2 focus:ring-green-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium">Deskripsi</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                    className="w-full rounded-lg border px-3 py-2 focus:ring-2 focus:ring-green-500 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="mb-1 block text-sm font-medium">Kategori *</label>
                    <select
                      required
                      value={formData.category_id}
                      onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                      className="w-full rounded-lg border px-3 py-2 focus:ring-2 focus:ring-green-500 focus:outline-none"
                    >
                      <option value="">Pilih Kategori</option>
                      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                      {categories?.map((cat: any) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium">Supplier *</label>
                    <select
                      required
                      value={formData.supplier_id}
                      onChange={(e) => setFormData({ ...formData, supplier_id: e.target.value })}
                      className="w-full rounded-lg border px-3 py-2 focus:ring-2 focus:ring-green-500 focus:outline-none"
                    >
                      <option value="">Pilih Supplier</option>
                      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                      {suppliers?.map((sup: any) => (
                        <option key={sup.id} value={sup.id}>
                          {sup.business_name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="mb-1 block text-sm font-medium">Harga Beli (Rp) *</label>
                    <input
                      type="number"
                      required
                      min="0"
                      value={formData.purchase_price || ''}
                      onChange={(e) =>
                        setFormData({ ...formData, purchase_price: Number(e.target.value) })
                      }
                      className="w-full rounded-lg border px-3 py-2 focus:ring-2 focus:ring-green-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium">Harga Jual (Rp) *</label>
                    <input
                      type="number"
                      required
                      min="0"
                      value={formData.selling_price || ''}
                      onChange={(e) =>
                        setFormData({ ...formData, selling_price: Number(e.target.value) })
                      }
                      className="w-full rounded-lg border px-3 py-2 focus:ring-2 focus:ring-green-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="mb-1 block text-sm font-medium">Stok Awal</label>
                    <input
                      type="number"
                      min="0"
                      value={formData.stock || ''}
                      onChange={(e) => setFormData({ ...formData, stock: Number(e.target.value) })}
                      className="w-full rounded-lg border px-3 py-2 focus:ring-2 focus:ring-green-500 focus:outline-none"
                      disabled={!!formData.id}
                    />
                    {formData.id && (
                      <p className="mt-1 text-xs text-gray-500">
                        Gunakan tombol Mutasi Stok untuk mengubah stok
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium">Stok Minimum</label>
                    <input
                      type="number"
                      min="0"
                      value={formData.min_stock || ''}
                      onChange={(e) =>
                        setFormData({ ...formData, min_stock: Number(e.target.value) })
                      }
                      className="w-full rounded-lg border px-3 py-2 focus:ring-2 focus:ring-green-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.is_active}
                    onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                    className="h-4 w-4"
                  />
                  <label className="text-sm font-medium">Produk Aktif</label>
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

      {/* Stock Movement Modal */}
      {showStockModal && (
        <div className="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black p-4">
          <Card className="w-full max-w-md">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Mutasi Stok</CardTitle>
              <Button variant="ghost" onClick={() => setShowStockModal(false)}>
                <X className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium">Jenis Mutasi</label>
                <select
                  value={stockMovement.type}
                  onChange={(e) =>
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    setStockMovement({ ...stockMovement, type: e.target.value as any })
                  }
                  className="w-full rounded-lg border px-3 py-2 focus:ring-2 focus:ring-green-500 focus:outline-none"
                >
                  <option value="IN">Stok Masuk</option>
                  <option value="OUT">Stok Keluar</option>
                  <option value="ADJUSTMENT">Penyesuaian</option>
                </select>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium">Jumlah</label>
                <input
                  type="number"
                  min="1"
                  value={stockMovement.quantity || ''}
                  onChange={(e) =>
                    setStockMovement({ ...stockMovement, quantity: Number(e.target.value) })
                  }
                  className="w-full rounded-lg border px-3 py-2 focus:ring-2 focus:ring-green-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium">Catatan</label>
                <textarea
                  value={stockMovement.notes}
                  onChange={(e) => setStockMovement({ ...stockMovement, notes: e.target.value })}
                  rows={3}
                  className="w-full rounded-lg border px-3 py-2 focus:ring-2 focus:ring-green-500 focus:outline-none"
                  placeholder="Catatan opsional..."
                />
              </div>

              <div className="flex gap-2">
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
                  className="flex-1 bg-green-600 hover:bg-green-700"
                >
                  {stockMovementMutation.isPending ? 'Memproses...' : 'Simpan'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
