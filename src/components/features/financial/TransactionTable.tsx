'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatCurrency, formatDate, exportToCSV, downloadCSV } from '@/lib/financial-utils'
import {
  getCategoryLabel,
  getTypeLabel,
  getTypeBadgeVariant,
  type Transaction,
  type TransactionType,
} from '@/types/financial'
import { Download, Search, ChevronLeft, ChevronRight, Edit, Trash2 } from 'lucide-react'

interface TransactionTableProps {
  transactions: Transaction[]
  pagination: {
    total: number
    page: number
    limit: number
    totalPages: number
    hasMore: boolean
  }
  onPageChange: (page: number) => void
  onSearch?: (search: string) => void
  onEdit?: (transaction: Transaction) => void
  onDelete?: (transaction: Transaction) => void
}

export function TransactionTable({
  transactions,
  pagination,
  onPageChange,
  onSearch,
  onEdit,
  onDelete,
}: TransactionTableProps) {
  const [searchQuery, setSearchQuery] = useState('')

  const handleSearch = () => {
    onSearch?.(searchQuery)
  }

  const handleExport = () => {
    const csv = exportToCSV(transactions)
    const filename = `transaksi_${new Date().toISOString().split('T')[0]}.csv`
    downloadCSV(csv, filename)
  }

  const getBadgeColor = (type: TransactionType) => {
    const variant = getTypeBadgeVariant(type)
    switch (variant) {
      case 'default':
        return 'bg-green-100 text-green-700 border-green-200'
      case 'destructive':
        return 'bg-red-100 text-red-700 border-red-200'
      case 'secondary':
        return 'bg-blue-100 text-blue-700 border-blue-200'
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200'
    }
  }

  if (transactions.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Riwayat Transaksi</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex min-h-[300px] items-center justify-center text-gray-500">
            <div className="text-center">
              <p className="text-sm">Belum ada transaksi</p>
              <p className="mt-1 text-xs text-gray-400">
                Transaksi akan muncul di sini setelah Anda membuatnya
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <CardTitle>Riwayat Transaksi</CardTitle>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            {/* Search */}
            {onSearch && (
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Cari transaksi..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                />
                <Button onClick={handleSearch} size="sm" variant="outline">
                  <Search className="h-4 w-4" />
                </Button>
              </div>
            )}
            {/* Export */}
            <Button onClick={handleExport} size="sm" variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Export CSV
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="pb-3 text-left text-xs font-semibold text-gray-600 uppercase">
                  Tanggal
                </th>
                <th className="pb-3 text-left text-xs font-semibold text-gray-600 uppercase">
                  Tipe
                </th>
                <th className="pb-3 text-left text-xs font-semibold text-gray-600 uppercase">
                  Kategori
                </th>
                <th className="pb-3 text-left text-xs font-semibold text-gray-600 uppercase">
                  Deskripsi
                </th>
                <th className="pb-3 text-right text-xs font-semibold text-gray-600 uppercase">
                  Jumlah
                </th>
                <th className="pb-3 text-left text-xs font-semibold text-gray-600 uppercase">
                  Supplier
                </th>
                <th className="pb-3 text-center text-xs font-semibold text-gray-600 uppercase">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((tx) => (
                <tr key={tx.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 text-sm text-gray-700">{formatDate(tx.created_at, true)}</td>
                  <td className="py-3">
                    <span
                      className={`inline-flex rounded-full border px-2.5 py-0.5 text-xs font-semibold ${getBadgeColor(tx.type)}`}
                    >
                      {getTypeLabel(tx.type)}
                    </span>
                  </td>
                  <td className="py-3 text-sm text-gray-700">{getCategoryLabel(tx.category)}</td>
                  <td className="py-3">
                    <div className="max-w-xs">
                      <p className="truncate text-sm font-medium text-gray-900">{tx.description}</p>
                      {tx.notes && <p className="truncate text-xs text-gray-500">{tx.notes}</p>}
                    </div>
                  </td>
                  <td className="py-3 text-right">
                    <span
                      className={`text-sm font-semibold ${
                        tx.type === 'CASH_IN' ? 'text-green-600' : 'text-red-600'
                      }`}
                    >
                      {tx.type === 'CASH_IN' ? '+' : '-'}
                      {formatCurrency(Number(tx.amount))}
                    </span>
                  </td>
                  <td className="py-3 text-sm text-gray-700">
                    {tx.supplier?.business_name || '-'}
                  </td>
                  <td className="py-3">
                    <div className="flex items-center justify-center gap-2">
                      {onEdit && (
                        <button
                          onClick={() => onEdit(tx)}
                          className="rounded p-1 text-blue-600 hover:bg-blue-50"
                          title="Edit"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                      )}
                      {onDelete && (
                        <button
                          onClick={() => onDelete(tx)}
                          className="rounded p-1 text-red-600 hover:bg-red-50"
                          title="Hapus"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="mt-4 flex items-center justify-between border-t border-gray-200 pt-4">
          <div className="text-sm text-gray-600">
            Menampilkan{' '}
            <span className="font-semibold">
              {(pagination.page - 1) * pagination.limit + 1}-
              {Math.min(pagination.page * pagination.limit, pagination.total)}
            </span>{' '}
            dari <span className="font-semibold">{pagination.total}</span> transaksi
          </div>
          <div className="flex items-center gap-2">
            <Button
              onClick={() => onPageChange(pagination.page - 1)}
              disabled={pagination.page === 1}
              size="sm"
              variant="outline"
            >
              <ChevronLeft className="h-4 w-4" />
              Prev
            </Button>
            <div className="flex items-center gap-1">
              {[...Array(Math.min(pagination.totalPages, 5))].map((_, i) => {
                const pageNum = i + 1
                return (
                  <Button
                    key={pageNum}
                    onClick={() => onPageChange(pageNum)}
                    size="sm"
                    variant={pagination.page === pageNum ? 'default' : 'outline'}
                  >
                    {pageNum}
                  </Button>
                )
              })}
            </div>
            <Button
              onClick={() => onPageChange(pagination.page + 1)}
              disabled={!pagination.hasMore}
              size="sm"
              variant="outline"
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
