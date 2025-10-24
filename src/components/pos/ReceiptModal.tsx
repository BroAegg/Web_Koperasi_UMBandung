'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Receipt, X } from 'lucide-react'

interface ReceiptModalProps {
  show: boolean
  onClose: () => void
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  order: any
  onPrint: () => void
}

export function ReceiptModal({ show, onClose, order, onPrint }: ReceiptModalProps) {
  if (!show || !order) return null

  return (
    <div className="animate-in fade-in fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm duration-200">
      <Card className="animate-in zoom-in w-full max-w-md shadow-2xl duration-200">
        <CardHeader className="bg-linear-to-r from-green-600 to-emerald-600 text-white">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Receipt className="h-6 w-6" />
              Struk Penjualan
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-white hover:bg-white/20"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-6" id="receipt-content">
          {/* Receipt Header */}
          <div className="border-b-2 border-dashed pb-4 text-center">
            <h3 className="text-xl font-bold text-gray-900">Koperasi UM Bandung</h3>
            <p className="mt-1 text-sm text-gray-600">Jl. Raya Bandung No. 123</p>
            <p className="text-xs text-gray-500">Telp: (022) 1234-5678</p>
          </div>

          {/* Order Info */}
          <div className="space-y-2 border-b py-4 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">No. Order:</span>
              <span className="font-mono font-bold text-gray-900">{order.order_number}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Tanggal:</span>
              <span className="font-medium text-gray-900">
                {new Date(order.created_at).toLocaleString('id-ID', {
                  dateStyle: 'medium',
                  timeStyle: 'short',
                })}
              </span>
            </div>
            {order.customer_name && (
              <div className="flex justify-between">
                <span className="text-gray-600">Pelanggan:</span>
                <span className="font-medium text-gray-900">{order.customer_name}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-gray-600">Pembayaran:</span>
              <span className="font-medium text-gray-900">
                {order.payment_method === 'CASH'
                  ? '💵 Tunai'
                  : order.payment_method === 'BANK_TRANSFER'
                    ? '🏦 Transfer'
                    : order.payment_method === 'E_WALLET'
                      ? '📱 E-Wallet'
                      : '💳 Lainnya'}
              </span>
            </div>
          </div>

          {/* Items */}
          <div className="space-y-3 border-b py-4">
            <h4 className="mb-3 font-bold text-gray-900">Detail Pembelian</h4>
            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
            {order.items.map((item: any, index: number) => (
              <div key={item.id} className="space-y-1">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-sm leading-tight font-semibold text-gray-900">
                      {index + 1}. {item.product.name}
                    </p>
                    <p className="mt-0.5 text-xs text-gray-500">SKU: {item.product.sku}</p>
                  </div>
                </div>
                <div className="flex justify-between pl-4 text-sm">
                  <span className="text-gray-600">
                    {item.quantity} x Rp {Number(item.price).toLocaleString('id-ID')}
                  </span>
                  <span className="font-bold text-gray-900">
                    Rp {Number(item.subtotal).toLocaleString('id-ID')}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Totals */}
          <div className="space-y-2 py-4">
            <div className="flex justify-between text-sm">
              <span className="text-gray-700">Subtotal:</span>
              <span className="font-semibold text-gray-900">
                Rp {Number(order.subtotal).toLocaleString('id-ID')}
              </span>
            </div>
            {Number(order.discount) > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-700">Diskon:</span>
                <span className="font-semibold text-red-600">
                  - Rp {Number(order.discount).toLocaleString('id-ID')}
                </span>
              </div>
            )}
            {Number(order.tax) > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-700">Pajak:</span>
                <span className="font-semibold text-gray-900">
                  Rp {Number(order.tax).toLocaleString('id-ID')}
                </span>
              </div>
            )}
            <div className="flex justify-between border-t-2 border-dashed pt-3">
              <span className="text-lg font-bold text-gray-900">Total:</span>
              <span className="text-2xl font-bold text-green-600">
                Rp {Number(order.total).toLocaleString('id-ID')}
              </span>
            </div>
            <div className="flex justify-between rounded bg-gray-50 p-2 text-sm">
              <span className="text-gray-700">Bayar:</span>
              <span className="font-semibold text-gray-900">
                Rp {Number(order.payment_amount).toLocaleString('id-ID')}
              </span>
            </div>
            <div className="flex justify-between rounded bg-green-50 p-2 text-sm">
              <span className="font-medium text-gray-700">Kembalian:</span>
              <span className="text-xl font-bold text-green-600">
                Rp {Number(order.change_amount).toLocaleString('id-ID')}
              </span>
            </div>
          </div>

          {/* Footer */}
          <div className="space-y-2 border-t-2 border-dashed pt-4 text-center">
            <p className="text-sm font-medium text-gray-900">Terima kasih atas kunjungan Anda!</p>
            <p className="text-xs text-gray-500">
              Barang yang sudah dibeli tidak dapat dikembalikan
            </p>
            <div className="mt-3 font-mono text-xs text-gray-400">
              {new Date().toLocaleString('id-ID')}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-6 flex gap-3">
            <Button variant="outline" onClick={onClose} className="flex-1 border-2">
              <X className="mr-2 h-4 w-4" />
              Tutup
            </Button>
            <Button
              onClick={onPrint}
              className="flex-1 bg-linear-to-r from-green-600 to-emerald-600 text-white shadow-lg hover:from-green-700 hover:to-emerald-700"
            >
              <Receipt className="mr-2 h-4 w-4" />
              Cetak Struk
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
