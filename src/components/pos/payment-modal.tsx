'use client'

import { useState } from 'react'
import { trpc } from '@/lib/trpc/client'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { CreditCard, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import type { CartItem } from './pos-content'

interface PaymentModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  cart: CartItem[]
  customerName: string
  onSuccess: (orderId: string) => void
  onCancel: () => void
}

export function PaymentModal({
  open,
  onOpenChange,
  cart,
  customerName,
  onSuccess,
  onCancel,
}: PaymentModalProps) {
  const [paymentMethod, setPaymentMethod] = useState<
    'CASH' | 'BANK_TRANSFER' | 'E_WALLET' | 'OTHER'
  >('CASH')
  const [paymentAmount, setPaymentAmount] = useState('')
  const [discount, setDiscount] = useState('')
  const [tax, setTax] = useState('')

  const utils = trpc.useUtils()

  const createOrderMutation = trpc.pos.createOrder.useMutation({
    onSuccess: (data) => {
      if (!data) return

      toast.success('Transaksi berhasil!', {
        description: `Order ${data.order_number} telah dibuat`,
      })

      onSuccess(data.id)
      resetForm()

      utils.pos.getProducts.invalidate()
      utils.inventory.getProducts.invalidate()
    },
    onError: (error) => {
      toast.error('Transaksi gagal', {
        description: error.message,
      })
    },
  })

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const discountAmount = Number(discount) || 0
  const taxAmount = Number(tax) || 0
  const total = subtotal - discountAmount + taxAmount
  const payment = Number(paymentAmount) || 0
  const change = payment - total

  const handleSubmit = () => {
    if (payment < total) {
      toast.error('Pembayaran kurang!', {
        description: `Total: Rp ${total.toLocaleString('id-ID')}, Dibayar: Rp ${payment.toLocaleString('id-ID')}`,
      })
      return
    }

    createOrderMutation.mutate({
      customer_name: customerName || undefined,
      items: cart.map((item) => ({
        product_id: item.product_id,
        quantity: item.quantity,
        price: item.price,
      })),
      payment_method: paymentMethod,
      payment_amount: payment,
      discount: discountAmount,
      tax: taxAmount,
    })
  }

  const resetForm = () => {
    setPaymentMethod('CASH')
    setPaymentAmount('')
    setDiscount('')
    setTax('')
  }

  const handleCancel = () => {
    resetForm()
    onCancel()
  }

  const handleSetExactAmount = () => {
    setPaymentAmount(total.toString())
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Pembayaran
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Order Summary */}
          <div className="bg-muted/30 space-y-2 rounded-lg border p-4">
            <div className="flex justify-between text-sm">
              <span>Subtotal</span>
              <span>Rp {subtotal.toLocaleString('id-ID')}</span>
            </div>

            {/* Discount */}
            <div className="flex items-center justify-between gap-2">
              <Label htmlFor="discount" className="text-sm">
                Diskon
              </Label>
              <Input
                id="discount"
                type="number"
                placeholder="0"
                value={discount}
                onChange={(e) => setDiscount(e.target.value)}
                className="h-8 w-32"
                min="0"
              />
            </div>

            {/* Tax */}
            <div className="flex items-center justify-between gap-2">
              <Label htmlFor="tax" className="text-sm">
                Pajak
              </Label>
              <Input
                id="tax"
                type="number"
                placeholder="0"
                value={tax}
                onChange={(e) => setTax(e.target.value)}
                className="h-8 w-32"
                min="0"
              />
            </div>

            <Separator />

            <div className="flex justify-between text-lg font-bold">
              <span>Total</span>
              <span className="text-primary">Rp {total.toLocaleString('id-ID')}</span>
            </div>
          </div>

          {/* Payment Method */}
          <div className="space-y-2">
            <Label htmlFor="payment-method">Metode Pembayaran</Label>
            <Select
              value={paymentMethod}
              onValueChange={(value) => setPaymentMethod(value as typeof paymentMethod)}
            >
              <SelectTrigger id="payment-method">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="CASH">Tunai</SelectItem>
                <SelectItem value="BANK_TRANSFER">Transfer Bank</SelectItem>
                <SelectItem value="E_WALLET">E-Wallet</SelectItem>
                <SelectItem value="OTHER">Lainnya</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Payment Amount */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="payment-amount">Jumlah Dibayar</Label>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleSetExactAmount}
                className="h-7 text-xs"
              >
                Pas
              </Button>
            </div>
            <Input
              id="payment-amount"
              type="number"
              placeholder="Masukkan jumlah pembayaran"
              value={paymentAmount}
              onChange={(e) => setPaymentAmount(e.target.value)}
              min="0"
              autoFocus
            />
          </div>

          {/* Change */}
          {payment > 0 && (
            <div className="bg-primary/5 rounded-lg border p-4">
              <div className="flex items-center justify-between">
                <span className="font-medium">Kembalian</span>
                <span
                  className={`text-lg font-bold ${
                    change >= 0 ? 'text-primary' : 'text-destructive'
                  }`}
                >
                  Rp {change.toLocaleString('id-ID')}
                </span>
              </div>
            </div>
          )}

          {/* Customer Name Display */}
          {customerName && (
            <div className="text-muted-foreground text-sm">
              Pelanggan: <span className="text-foreground font-medium">{customerName}</span>
            </div>
          )}
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={handleCancel} disabled={createOrderMutation.isPending}>
            Batal
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={createOrderMutation.isPending || payment < total}
          >
            {createOrderMutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Memproses...
              </>
            ) : (
              'Bayar'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
