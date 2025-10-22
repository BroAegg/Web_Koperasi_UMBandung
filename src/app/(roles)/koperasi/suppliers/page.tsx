'use client'

import { useState } from 'react'
import { trpc } from '@/lib/trpc'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { PageContainer } from '@/components/shared/PageContainer'
import { PageHeader } from '@/components/shared/PageHeader'
import { MetricCard } from '@/components/shared/MetricCard'
import { Plus, Search, Edit, Trash2, Users, Building2, Package, X, Phone, Mail } from 'lucide-react'

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

      {/* Suppliers Table */}
      <Card>
        <CardHeader>
          <CardTitle>Daftar Supplier</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="px-4 py-3 text-left">Nama Usaha</th>
                  <th className="px-4 py-3 text-left">Kontak Person</th>
                  <th className="px-4 py-3 text-left">Telepon</th>
                  <th className="px-4 py-3 text-left">Email</th>
                  <th className="px-4 py-3 text-left">Alamat</th>
                  <th className="px-4 py-3 text-center">Produk</th>
                  <th className="px-4 py-3 text-center">Status</th>
                  <th className="px-4 py-3 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                {suppliersData?.suppliers.map((supplier: any) => (
                  <tr key={supplier.id} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Building2 className="h-4 w-4 text-gray-400" />
                        <span className="font-medium">{supplier.business_name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">{supplier.contact_person}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2 text-sm">
                        <Phone className="h-3 w-3 text-gray-400" />
                        {supplier.phone}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      {supplier.email ? (
                        <div className="flex items-center gap-2 text-sm">
                          <Mail className="h-3 w-3 text-gray-400" />
                          {supplier.email}
                        </div>
                      ) : (
                        <span className="text-sm text-gray-400">-</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span className="line-clamp-2 text-sm">
                        {supplier.address || <span className="text-gray-400">-</span>}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className="inline-flex items-center rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-700">
                        {supplier._count.products}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span
                        className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                          supplier.is_active
                            ? 'bg-green-100 text-green-700'
                            : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {supplier.is_active ? 'Aktif' : 'Non-aktif'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-2">
                        <Button size="sm" variant="ghost" onClick={() => handleEdit(supplier)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDelete(supplier.id)}
                          className="text-red-600 hover:text-red-700"
                          disabled={supplier._count.products > 0}
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

          {suppliersData?.suppliers.length === 0 && (
            <div className="py-8 text-center text-gray-400">
              <Building2 className="mx-auto mb-2 h-12 w-12" />
              <p>Belum ada supplier</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Supplier Form Modal */}
      {showForm && (
        <div className="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black p-4">
          <Card className="w-full max-w-2xl">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>{formData.id ? 'Edit Supplier' : 'Tambah Supplier'}</CardTitle>
              <Button variant="ghost" onClick={() => setShowForm(false)}>
                <X className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="mb-1 block text-sm font-medium">Nama Usaha *</label>
                    <input
                      type="text"
                      required
                      value={formData.business_name}
                      onChange={(e) => setFormData({ ...formData, business_name: e.target.value })}
                      className="w-full rounded-lg border px-3 py-2 focus:ring-2 focus:ring-green-500 focus:outline-none"
                      placeholder="CV. Supplier ABC"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium">Kontak Person *</label>
                    <input
                      type="text"
                      required
                      value={formData.contact_person}
                      onChange={(e) => setFormData({ ...formData, contact_person: e.target.value })}
                      className="w-full rounded-lg border px-3 py-2 focus:ring-2 focus:ring-green-500 focus:outline-none"
                      placeholder="Nama PIC"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="mb-1 block text-sm font-medium">Telepon *</label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full rounded-lg border px-3 py-2 focus:ring-2 focus:ring-green-500 focus:outline-none"
                      placeholder="08123456789"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium">Email</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full rounded-lg border px-3 py-2 focus:ring-2 focus:ring-green-500 focus:outline-none"
                      placeholder="supplier@example.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium">Alamat</label>
                  <textarea
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    rows={3}
                    className="w-full rounded-lg border px-3 py-2 focus:ring-2 focus:ring-green-500 focus:outline-none"
                    placeholder="Alamat lengkap supplier..."
                  />
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.is_active}
                    onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                    className="h-4 w-4"
                  />
                  <label className="text-sm font-medium">Supplier Aktif</label>
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
    </PageContainer>
  )
}
