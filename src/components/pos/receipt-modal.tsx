'use client'

import { useEffect, useRef } from 'react'
import { trpc } from '@/lib/trpc/client'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import { Printer, Download, CheckCircle2, AlertCircle } from 'lucide-react'
import { toast } from 'sonner'

interface ReceiptModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  orderId: string
  onClose: () => void
}

export function ReceiptModal({ open, onOpenChange, orderId, onClose }: ReceiptModalProps) {
  const receiptRef = useRef<HTMLDivElement>(null)

  const orderQuery = trpc.pos.getOrder.useQuery({ id: orderId }, { enabled: !!orderId })

  const order = orderQuery.data

  const handlePrint = () => {
    const printContent = receiptRef.current
    if (!printContent) return

    const printWindow = window.open('', '_blank')
    if (!printWindow) {
      toast.error('Gagal membuka jendela print')
      return
    }

    printWindow.document.write(`
      <html>
        <head>
          <title>Struk - ${order?.order_number}</title>
          <style>
            body {
              font-family: 'Courier New', monospace;
              max-width: 300px;
              margin: 20px auto;
              padding: 0;
              font-size: 12px;
            }
            .header {
              text-align: center;
              margin-bottom: 20px;
            }
            .header h1 {
              font-size: 18px;
              margin: 0 0 5px 0;
            }
            .header p {
              margin: 2px 0;
              font-size: 11px;
            }
            .divider {
              border-top: 1px dashed #000;
              margin: 10px 0;
            }
            .info {
              margin-bottom: 15px;
            }
            .info-row {
              display: flex;
              justify-content: space-between;
              margin: 3px 0;
            }
            .items {
              margin: 15px 0;
            }
            .item {
              margin: 8px 0;
            }
            .item-name {
              font-weight: bold;
            }
            .item-details {
              display: flex;
              justify-content: space-between;
              font-size: 11px;
            }
            .summary {
              margin-top: 15px;
            }
            .summary-row {
              display: flex;
              justify-content: space-between;
              margin: 5px 0;
            }
            .total {
              font-size: 14px;
              font-weight: bold;
              border-top: 1px solid #000;
              padding-top: 5px;
              margin-top: 5px;
            }
            .footer {
              text-align: center;
              margin-top: 20px;
              font-size: 11px;
            }
            @media print {
              body {
                margin: 0;
              }
            }
          </style>
        </head>
        <body>
          ${printContent.innerHTML}
        </body>
      </html>
    `)

    printWindow.document.close()
    printWindow.focus()
    setTimeout(() => {
      printWindow.print()
      printWindow.close()
    }, 250)
  }

  const handleDownload = () => {
    toast.info('Fitur download akan segera tersedia')
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-green-600 dark:text-green-500">
            <CheckCircle2 className="h-5 w-5" />
            Transaksi Berhasil
          </DialogTitle>
        </DialogHeader>

        {orderQuery.isLoading ? (
          <div className="space-y-4 py-4">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        ) : orderQuery.error ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <AlertCircle className="text-destructive mb-4 h-12 w-12" />
            <p className="text-lg font-medium">Error loading receipt</p>
            <p className="text-muted-foreground text-sm">{orderQuery.error.message}</p>
          </div>
        ) : order ? (
          <>
            {/* Receipt Content */}
            <div
              ref={receiptRef}
              className="bg-card space-y-4 rounded-lg border p-6 font-mono text-sm"
            >
              {/* Header */}
              <div className="header text-center">
                <h1 className="text-xl font-bold">KOPERASI UM BANDUNG</h1>
                <p className="text-muted-foreground text-xs">Jl. Universitas No. 123, Bandung</p>
                <p className="text-muted-foreground text-xs">Telp: (022) 1234567</p>
              </div>

              <div className="divider border-t border-dashed" />

              {/* Order Info */}
              <div className="info space-y-1 text-xs">
                <div className="info-row flex justify-between">
                  <span>No. Order</span>
                  <span className="font-medium">{order.order_number}</span>
                </div>
                <div className="info-row flex justify-between">
                  <span>Tanggal</span>
                  <span>{new Date(order.created_at).toLocaleString('id-ID')}</span>
                </div>
                {order.customer_name && (
                  <div className="info-row flex justify-between">
                    <span>Pelanggan</span>
                    <span>{order.customer_name}</span>
                  </div>
                )}
                <div className="info-row flex justify-between">
                  <span>Kasir</span>
                  <span>{order.created_by}</span>
                </div>
              </div>

              <div className="divider border-t border-dashed" />

              {/* Items */}
              <div className="items space-y-3">
                {order.items.map((item) => (
                  <div key={item.id} className="item">
                    <div className="item-name font-medium">{item.product.name}</div>
                    <div className="item-details flex justify-between text-xs">
                      <span>
                        {item.quantity} x Rp {Number(item.price).toLocaleString('id-ID')}
                      </span>
                      <span className="font-medium">
                        Rp {Number(item.subtotal).toLocaleString('id-ID')}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="divider border-t border-dashed" />

              {/* Summary */}
              <div className="summary space-y-2 text-xs">
                <div className="summary-row flex justify-between">
                  <span>Subtotal</span>
                  <span>Rp {Number(order.subtotal).toLocaleString('id-ID')}</span>
                </div>
                {Number(order.discount) > 0 && (
                  <div className="summary-row text-destructive flex justify-between">
                    <span>Diskon</span>
                    <span>- Rp {Number(order.discount).toLocaleString('id-ID')}</span>
                  </div>
                )}
                {Number(order.tax) > 0 && (
                  <div className="summary-row flex justify-between">
                    <span>Pajak</span>
                    <span>Rp {Number(order.tax).toLocaleString('id-ID')}</span>
                  </div>
                )}
                <div className="total summary-row flex justify-between border-t pt-2 text-base font-bold">
                  <span>TOTAL</span>
                  <span>Rp {Number(order.total).toLocaleString('id-ID')}</span>
                </div>
                <div className="summary-row flex justify-between">
                  <span>Dibayar ({order.payment_method})</span>
                  <span>Rp {Number(order.payment_amount).toLocaleString('id-ID')}</span>
                </div>
                <div className="summary-row flex justify-between font-medium">
                  <span>Kembalian</span>
                  <span>Rp {Number(order.change_amount).toLocaleString('id-ID')}</span>
                </div>
              </div>

              <div className="divider border-t border-dashed" />

              {/* Footer */}
              <div className="footer text-center text-xs">
                <p>Terima kasih atas kunjungan Anda!</p>
                <p className="text-muted-foreground">
                  Barang yang sudah dibeli tidak dapat dikembalikan
                </p>
              </div>
            </div>

            <DialogFooter className="gap-2">
              <Button variant="outline" onClick={handleDownload}>
                <Download className="mr-2 h-4 w-4" />
                Download
              </Button>
              <Button onClick={handlePrint}>
                <Printer className="mr-2 h-4 w-4" />
                Print
              </Button>
              <Button variant="secondary" onClick={onClose}>
                Tutup
              </Button>
            </DialogFooter>
          </>
        ) : null}
      </DialogContent>
    </Dialog>
  )
}
