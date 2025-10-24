'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CreditCard, X } from 'lucide-react'

type PaymentMethod = 'CASH' | 'BANK_TRANSFER' | 'E_WALLET' | 'OTHER'

interface PaymentModalProps {
  show: boolean
  onClose: () => void
  customerName: string
  setCustomerName: (name: string) => void
  paymentMethod: PaymentMethod
  setPaymentMethod: (method: PaymentMethod) => void
  discount: number
  setDiscount: (amount: number) => void
  paymentAmount: number
  setPaymentAmount: (amount: number) => void
  subtotal: number
  total: number
  change: number
  onProcessPayment: () => void
  isProcessing: boolean
}

export function PaymentModal({
  show,
  onClose,
  customerName,
  setCustomerName,
  paymentMethod,
  setPaymentMethod,
  discount,
  setDiscount,
  paymentAmount,
  setPaymentAmount,
  subtotal,
  total,
  change,
  onProcessPayment,
  isProcessing,
}: PaymentModalProps) {
  if (!show) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader className="bg-linear-to-r from-green-600 to-emerald-600 text-white">
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-6 w-6" />
            Pembayaran
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 p-6">
          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700">
              Nama Pelanggan (Opsional)
            </label>
            <input
              type="text"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              className="w-full rounded-lg border-2 px-4 py-2.5 transition-all focus:border-green-500 focus:ring-2 focus:ring-green-500 focus:outline-none"
              placeholder="Masukkan nama pelanggan..."
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700">
              Metode Pembayaran
            </label>
            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
              className="w-full rounded-lg border-2 px-4 py-2.5 font-medium transition-all focus:border-green-500 focus:ring-2 focus:ring-green-500 focus:outline-none"
            >
              <option value="CASH">💵 Tunai</option>
              <option value="BANK_TRANSFER">🏦 Transfer Bank</option>
              <option value="E_WALLET">📱 E-Wallet</option>
              <option value="OTHER">💳 Lainnya</option>
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700">Diskon (Rp)</label>
            <input
              type="number"
              value={discount || ''}
              onChange={(e) => setDiscount(Number(e.target.value))}
              className="w-full rounded-lg border-2 px-4 py-2.5 transition-all focus:border-green-500 focus:ring-2 focus:ring-green-500 focus:outline-none"
              placeholder="0"
              min="0"
            />
          </div>

          {/* Total Summary */}
          <div className="rounded-xl border-2 border-green-100 bg-linear-to-br from-green-50 to-emerald-50 p-4">
            <div className="mb-2 flex justify-between text-sm">
              <span className="text-gray-700">Subtotal:</span>
              <span className="font-semibold">Rp {subtotal.toLocaleString('id-ID')}</span>
            </div>
            {discount > 0 && (
              <div className="mb-2 flex justify-between text-sm">
                <span className="text-gray-700">Diskon:</span>
                <span className="font-semibold text-red-600">
                  - Rp {discount.toLocaleString('id-ID')}
                </span>
              </div>
            )}
            <div className="flex justify-between border-t-2 border-green-200 pt-3">
              <span className="text-lg font-bold text-gray-900">Total:</span>
              <span className="text-2xl font-bold text-green-600">
                Rp {total.toLocaleString('id-ID')}
              </span>
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700">Jumlah Bayar</label>
            <input
              type="number"
              value={paymentAmount || ''}
              onChange={(e) => setPaymentAmount(Number(e.target.value))}
              className="w-full rounded-lg border-2 px-4 py-2.5 text-lg font-bold transition-all focus:border-green-500 focus:ring-2 focus:ring-green-500 focus:outline-none"
              placeholder={total.toString()}
              min={total}
            />
            <div className="mt-2 flex gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => setPaymentAmount(total)}
                className="flex-1 border-2 hover:border-green-500 hover:bg-green-50 hover:text-green-600"
              >
                Uang Pas
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setPaymentAmount(Math.ceil(total / 1000) * 1000)}
                className="flex-1 border-2 hover:border-green-500 hover:bg-green-50 hover:text-green-600"
              >
                Bulatkan
              </Button>
            </div>
          </div>

          {paymentAmount >= total && (
            <div className="rounded-xl border-2 border-blue-100 bg-linear-to-br from-blue-50 to-cyan-50 p-4">
              <div className="flex justify-between">
                <span className="text-base font-semibold text-gray-700">Kembalian:</span>
                <span className="text-xl font-bold text-blue-600">
                  Rp {change.toLocaleString('id-ID')}
                </span>
              </div>
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <Button
              variant="outline"
              className="flex-1 border-2 hover:border-red-500 hover:bg-red-50 hover:text-red-600"
              onClick={onClose}
              disabled={isProcessing}
            >
              <X className="mr-2 h-4 w-4" />
              Batal
            </Button>
            <Button
              className="flex-1 bg-linear-to-r from-green-600 to-emerald-600 text-white shadow-lg hover:from-green-700 hover:to-emerald-700"
              onClick={onProcessPayment}
              disabled={paymentAmount < total || isProcessing}
            >
              <CreditCard className="mr-2 h-4 w-4" />
              {isProcessing ? 'Memproses...' : 'Proses Pembayaran'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
