'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type {
  Transaction,
  TransactionType,
  TransactionCategory,
  PaymentMethod,
} from '@/types/financial'
import { X } from 'lucide-react'

interface TransactionFormProps {
  transaction?: Transaction | null
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: TransactionFormData) => void
  isLoading?: boolean
}

export interface TransactionFormData {
  type: TransactionType
  category: TransactionCategory
  amount: number
  payment_method: PaymentMethod
  description: string
  notes?: string
  supplier_id?: string
}

export function TransactionForm({
  transaction,
  isOpen,
  onClose,
  onSubmit,
  isLoading = false,
}: TransactionFormProps) {
  const [formData, setFormData] = useState<TransactionFormData>({
    type: 'CASH_IN',
    category: 'SALES',
    amount: 0,
    payment_method: 'CASH',
    description: '',
    notes: '',
    supplier_id: '',
  })

  const [errors, setErrors] = useState<Partial<Record<keyof TransactionFormData, string>>>({})

  // Populate form when editing
  useEffect(() => {
    if (!isOpen) return

    if (transaction) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFormData({
        type: transaction.type,
        category: transaction.category,
        amount: Number(transaction.amount),
        payment_method: transaction.payment_method,
        description: transaction.description,
        notes: transaction.notes || '',
        supplier_id: transaction.supplier_id || '',
      })
    } else {
      // Reset form

      setFormData({
        type: 'CASH_IN',
        category: 'SALES',
        amount: 0,
        payment_method: 'CASH',
        description: '',
        notes: '',
        supplier_id: '',
      })
    }
    setErrors({})
  }, [transaction, isOpen])

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof TransactionFormData, string>> = {}

    if (!formData.description.trim()) {
      newErrors.description = 'Deskripsi wajib diisi'
    }

    if (formData.amount <= 0) {
      newErrors.amount = 'Jumlah harus lebih dari 0'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!validate()) {
      return
    }

    onSubmit(formData)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <Card className="max-h-[90vh] w-full max-w-2xl overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>{transaction ? 'Edit Transaksi' : 'Tambah Transaksi Baru'}</CardTitle>
          <button
            onClick={onClose}
            className="rounded-full p-1 hover:bg-gray-100"
            disabled={isLoading}
          >
            <X className="h-5 w-5" />
          </button>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Type */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">
                Tipe Transaksi <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.type}
                onChange={(e) =>
                  setFormData({ ...formData, type: e.target.value as TransactionType })
                }
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                disabled={isLoading}
              >
                <option value="CASH_IN">Pemasukan</option>
                <option value="CASH_OUT">Pengeluaran</option>
                <option value="TRANSFER">Transfer</option>
                <option value="ADJUSTMENT">Penyesuaian</option>
              </select>
            </div>

            {/* Category */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">
                Kategori <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.category}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    category: e.target.value as TransactionCategory,
                  })
                }
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                disabled={isLoading}
              >
                <option value="SALES">Penjualan</option>
                <option value="PURCHASE">Pembelian</option>
                <option value="OPERATIONAL">Operasional</option>
                <option value="MEMBER_DEPOSIT">Simpanan Anggota</option>
                <option value="MEMBER_WITHDRAWAL">Penarikan Anggota</option>
                <option value="OTHER">Lainnya</option>
              </select>
            </div>

            {/* Amount */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">
                Jumlah (Rp) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                value={formData.amount || ''}
                onChange={(e) => setFormData({ ...formData, amount: Number(e.target.value) })}
                className={`w-full rounded-md border px-3 py-2 text-sm focus:ring-1 focus:outline-none ${
                  errors.amount
                    ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                    : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                }`}
                placeholder="0"
                min="0"
                step="1000"
                disabled={isLoading}
              />
              {errors.amount && <p className="mt-1 text-xs text-red-500">{errors.amount}</p>}
            </div>

            {/* Payment Method */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">
                Metode Pembayaran <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.payment_method}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    payment_method: e.target.value as PaymentMethod,
                  })
                }
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                disabled={isLoading}
              >
                <option value="CASH">Tunai</option>
                <option value="BANK_TRANSFER">Transfer Bank</option>
                <option value="E_WALLET">E-Wallet</option>
                <option value="OTHER">Lainnya</option>
              </select>
            </div>

            {/* Description */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">
                Deskripsi <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className={`w-full rounded-md border px-3 py-2 text-sm focus:ring-1 focus:outline-none ${
                  errors.description
                    ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                    : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                }`}
                placeholder="Contoh: Penjualan produk A"
                maxLength={500}
                disabled={isLoading}
              />
              {errors.description && (
                <p className="mt-1 text-xs text-red-500">{errors.description}</p>
              )}
            </div>

            {/* Notes */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">
                Catatan (Opsional)
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                placeholder="Catatan tambahan..."
                rows={3}
                maxLength={1000}
                disabled={isLoading}
              />
            </div>

            {/* Buttons */}
            <div className="flex justify-end gap-3 pt-4">
              <Button type="button" onClick={onClose} variant="outline" disabled={isLoading}>
                Batal
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? 'Menyimpan...' : transaction ? 'Simpan Perubahan' : 'Tambah Transaksi'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
