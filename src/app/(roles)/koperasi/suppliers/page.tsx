'use client'

import { useState } from 'react'
import { trpc } from '@/lib/trpc'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { PageContainer } from '@/components/shared/PageContainer'
import { PageHeader } from '@/components/shared/PageHeader'
import { MetricCard } from '@/components/shared/MetricCard'
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Users,
  Building2,
  Package,
  X,
  Phone,
  Mail,
  MapPin,
  Star,
  TrendingUp,
} from 'lucide-react'
import { ResponsiveLayout } from '@/components/layout'

type SupplierFormData = {
  id?: string
  business_name: string
  contact_person: string
  phone: string
  email?: string
  address?: string
  is_active: boolean
}

export default function SuppliersPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState<SupplierFormData>({
    business_name: '',
    contact_person: '',
    phone: '',
    email: '',
    address: '',
    is_active: true,
  })

  const utils = trpc.useUtils()

  // Queries
  const { data: suppliersData } = trpc.supplier.getSuppliers.useQuery({
    search: searchQuery,
    page: 1,
    limit: 50,
  })

  const { data: stats } = trpc.supplier.getSupplierStats.useQuery()

  // Mutations
  const createMutation = trpc.supplier.createSupplier.useMutation({
    onSuccess: () => {
      utils.supplier.getSuppliers.invalidate()
      utils.supplier.getSupplierStats.invalidate()
      setShowForm(false)
      resetForm()
    },
  })

  const updateMutation = trpc.supplier.updateSupplier.useMutation({
    onSuccess: () => {
      utils.supplier.getSuppliers.invalidate()
      utils.supplier.getSupplierStats.invalidate()
      setShowForm(false)
      resetForm()
    },
  })

  const deleteMutation = trpc.supplier.deleteSupplier.useMutation({
    onSuccess: () => {
      utils.supplier.getSuppliers.invalidate()
      utils.supplier.getSupplierStats.invalidate()
    },
  })

  const resetForm = () => {
    setFormData({
      business_name: '',
      contact_person: '',
      phone: '',
      email: '',
      address: '',
      is_active: true,
    })
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleEdit = (supplier: any) => {
    setFormData({
      id: supplier.id,
      business_name: supplier.business_name,
      contact_person: supplier.contact_person,
      phone: supplier.phone,
      email: supplier.email || '',
      address: supplier.address || '',
      is_active: supplier.is_active,
    })
    setShowForm(true)
  }

  const handleDelete = (id: string) => {
    if (confirm('Hapus supplier ini?')) {
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

  return (
    <ResponsiveLayout>
      <PageContainer>
        <PageHeader
          title="Manajemen Supplier"
          subtitle="Kelola data supplier dan mitra koperasi"
          action={
            <Button onClick={() => setShowForm(true)} className="bg-green-600 hover:bg-green-700">
              <Plus className="mr-2 h-4 w-4" />
              Tambah Supplier
            </Button>
          }
        />

        {/* Statistics Cards */}
        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <MetricCard
            title="TOTAL SUPPLIER"
            value={stats?.totalSuppliers || 0}
            subtitle={`${stats?.activeSuppliers || 0} Supplier Aktif`}
            icon={Building2}
            variant="blue"
          />

          <MetricCard
            title="TOTAL PRODUK"
            value={stats?.totalProducts || 0}
            subtitle="Dari semua supplier"
            icon={Package}
            variant="green"
          />

          <MetricCard
            title="SUPPLIER AKTIF"
            value={stats?.activeSuppliers || 0}
            subtitle="Supplier dengan status aktif"
            icon={Users}
            variant="purple"
          />
        </div>

        {/* Top Suppliers */}
        {stats?.topSuppliers && stats.topSuppliers.length > 0 && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-lg">Top 5 Supplier (Berdasarkan Jumlah Produk)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                {stats.topSuppliers.map((supplier: any, index: number) => (
                  <div
                    key={supplier.id}
                    className="flex items-center justify-between rounded-lg bg-gray-50 p-3"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100 font-bold text-green-700">
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-medium">{supplier.business_name}</p>
                        <p className="text-sm text-gray-600">
                          {supplier.contact_person} • {supplier.phone}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-green-600">{supplier.productCount}</p>
                      <p className="text-xs text-gray-500">Produk</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Search */}
        <div className="relative">
          <Search className="absolute top-3 left-3 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Cari supplier (nama usaha, kontak, telepon, email)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border py-2 pr-4 pl-10 focus:ring-2 focus:ring-green-500 focus:outline-none"
          />
        </div>

        {/* Suppliers Card Grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {suppliersData?.suppliers && suppliersData.suppliers.length > 0 ? (
            <>
              {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
              {suppliersData.suppliers.map((supplier: any) => {
                const hasProducts = supplier._count.products > 0
                const topProducts = supplier.products?.slice(0, 3) || []

                return (
                  <Card
                    key={supplier.id}
                    className="group overflow-hidden border-2 transition-all hover:shadow-xl"
                  >
                    <CardContent className="p-0">
                      {/* Card Header with Gradient */}
                      <div className="relative bg-gradient-to-br from-blue-600 to-indigo-600 p-6 pb-12">
                        {/* Status Badge */}
                        <div className="absolute top-4 right-4">
                          <span
                            className={`rounded-full px-3 py-1 text-xs font-bold shadow-lg ${
                              supplier.is_active
                                ? 'bg-green-500 text-white'
                                : 'bg-gray-400 text-white'
                            }`}
                          >
                            {supplier.is_active ? '✅ Aktif' : '⏸️ Non-aktif'}
                          </span>
                        </div>

                        {/* Business Name */}
                        <div className="flex items-start gap-3">
                          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
                            <Building2 className="h-7 w-7 text-white" />
                          </div>
                          <div className="flex-1">
                            <h3 className="line-clamp-2 text-xl font-bold text-white">
                              {supplier.business_name}
                            </h3>
                            <p className="mt-1 flex items-center gap-1 text-sm text-blue-100">
                              <Star className="h-3 w-3 fill-yellow-300 text-yellow-300" />
                              Supplier Partner
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Product Count Badge - Overlapping */}
                      <div className="relative -mt-6 px-6">
                        <div className="rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 p-4 shadow-lg">
                          <div className="flex items-center justify-between text-white">
                            <div>
                              <p className="text-xs font-medium opacity-90">Total Produk</p>
                              <p className="text-3xl font-bold">{supplier._count.products}</p>
                            </div>
                            <Package className="h-10 w-10 opacity-80" />
                          </div>
                        </div>
                      </div>

                      {/* Contact Information */}
                      <div className="space-y-3 p-6">
                        {/* Contact Person */}
                        <div className="flex items-center gap-3 rounded-lg bg-gray-50 p-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-100">
                            <Users className="h-5 w-5 text-purple-600" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-xs font-medium text-gray-500">Contact Person</p>
                            <p className="truncate font-semibold text-gray-900">
                              {supplier.contact_person}
                            </p>
                          </div>
                        </div>

                        {/* Phone */}
                        <div className="flex items-center gap-3 rounded-lg bg-gray-50 p-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
                            <Phone className="h-5 w-5 text-green-600" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-xs font-medium text-gray-500">Telepon</p>
                            <p className="font-semibold text-gray-900">{supplier.phone}</p>
                          </div>
                        </div>

                        {/* Email */}
                        {supplier.email && (
                          <div className="flex items-center gap-3 rounded-lg bg-gray-50 p-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
                              <Mail className="h-5 w-5 text-blue-600" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="text-xs font-medium text-gray-500">Email</p>
                              <p className="truncate font-semibold text-gray-900">
                                {supplier.email}
                              </p>
                            </div>
                          </div>
                        )}

                        {/* Address */}
                        {supplier.address && (
                          <div className="flex items-start gap-3 rounded-lg bg-gray-50 p-3">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-orange-100">
                              <MapPin className="h-5 w-5 text-orange-600" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="text-xs font-medium text-gray-500">Alamat</p>
                              <p className="line-clamp-2 text-sm text-gray-700">
                                {supplier.address}
                              </p>
                            </div>
                          </div>
                        )}

                        {/* Top Products */}
                        {hasProducts && topProducts.length > 0 && (
                          <div className="mt-4 rounded-lg border-2 border-blue-100 bg-blue-50 p-3">
                            <p className="mb-2 flex items-center gap-1 text-xs font-bold text-blue-900">
                              <TrendingUp className="h-3 w-3" />
                              Top Products
                            </p>
                            <div className="space-y-1.5">
                              {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                              {topProducts.map((product: any) => (
                                <div
                                  key={product.id}
                                  className="flex items-center justify-between rounded bg-white px-2 py-1.5 text-sm"
                                >
                                  <span className="flex-1 truncate font-medium text-gray-700">
                                    {product.name}
                                  </span>
                                  <span className="ml-2 text-xs font-bold text-blue-600">
                                    Stok: {product.stock}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-2 border-t bg-gray-50 p-4">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEdit(supplier)}
                          className="flex-1 font-semibold hover:border-blue-300 hover:bg-blue-50 hover:text-blue-600"
                        >
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDelete(supplier.id)}
                          disabled={supplier._count.products > 0}
                          className="flex-1 font-semibold text-red-600 hover:border-red-300 hover:bg-red-50 hover:text-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                          title={
                            supplier._count.products > 0
                              ? 'Tidak bisa hapus supplier yang masih memiliki produk'
                              : 'Hapus supplier'
                          }
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Hapus
                        </Button>
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
                  <Building2 className="mx-auto mb-4 h-20 w-20 text-gray-300" />
                  <h3 className="mb-2 text-lg font-semibold text-gray-900">Belum Ada Supplier</h3>
                  <p className="mb-6 text-sm text-gray-500">
                    Mulai tambahkan supplier untuk mengelola produk koperasi
                  </p>
                  <Button
                    onClick={() => setShowForm(true)}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Tambah Supplier Pertama
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}
        </div>

        {/* Supplier Form Modal */}
        {showForm && (
          <div className="animate-in fade-in fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
            <Card className="animate-in zoom-in w-full max-w-2xl">
              <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Building2 className="h-5 w-5" />
                    {formData.id ? 'Edit Supplier' : 'Tambah Supplier Baru'}
                  </CardTitle>
                  <Button
                    variant="ghost"
                    onClick={() => setShowForm(false)}
                    className="text-white hover:bg-white/20"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="mb-2 block text-sm font-semibold text-gray-700">
                        Nama Usaha *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.business_name}
                        onChange={(e) =>
                          setFormData({ ...formData, business_name: e.target.value })
                        }
                        className="w-full rounded-lg border-2 px-4 py-2.5 font-medium transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        placeholder="CV. Supplier ABC"
                      />
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-semibold text-gray-700">
                        Kontak Person *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.contact_person}
                        onChange={(e) =>
                          setFormData({ ...formData, contact_person: e.target.value })
                        }
                        className="w-full rounded-lg border-2 px-4 py-2.5 font-medium transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        placeholder="Nama PIC"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="mb-2 block text-sm font-semibold text-gray-700">
                        Telepon *
                      </label>
                      <input
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full rounded-lg border-2 px-4 py-2.5 font-medium transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        placeholder="08123456789"
                      />
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-semibold text-gray-700">
                        Email <span className="text-xs text-gray-500">(Opsional)</span>
                      </label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full rounded-lg border-2 px-4 py-2.5 font-medium transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        placeholder="supplier@example.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-gray-700">
                      Alamat <span className="text-xs text-gray-500">(Opsional)</span>
                    </label>
                    <textarea
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      rows={3}
                      className="w-full resize-none rounded-lg border-2 px-4 py-2.5 transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      placeholder="Alamat lengkap supplier..."
                    />
                  </div>

                  <div className="rounded-lg border-2 border-blue-200 bg-blue-50 p-3">
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
                        <div className="peer h-6 w-11 rounded-full bg-gray-300 transition-colors peer-checked:bg-blue-500"></div>
                        <div className="absolute top-1 left-1 h-4 w-4 rounded-full bg-white transition-transform peer-checked:translate-x-5"></div>
                      </div>
                      <div>
                        <span className="text-sm font-bold text-gray-900 transition-colors group-hover:text-blue-600">
                          {formData.is_active ? '✅ Supplier Aktif' : '⏸️ Supplier Non-aktif'}
                        </span>
                        <p className="text-xs text-gray-600">
                          {formData.is_active
                            ? 'Supplier dapat melakukan supply produk'
                            : 'Supplier tidak aktif sementara'}
                        </p>
                      </div>
                    </label>
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
                      className="flex-1 bg-blue-600 hover:bg-blue-700"
                    >
                      {createMutation.isPending || updateMutation.isPending
                        ? 'Menyimpan...'
                        : '💾 Simpan Supplier'}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        )}
      </PageContainer>
    </ResponsiveLayout>
  )
}
