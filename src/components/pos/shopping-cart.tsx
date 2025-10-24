'use client'

import { memo, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { ShoppingCart as CartIcon, Trash2, Plus, Minus, User, X } from 'lucide-react'
import type { CartItem } from './pos-content'

interface ShoppingCartProps {
  items: CartItem[]
  customerName: string
  onCustomerNameChange: (name: string) => void
  onUpdateQuantity: (productId: string, quantity: number) => void
  onRemoveItem: (productId: string) => void
  onClearCart: () => void
  onCheckout: () => void
}

export const ShoppingCart = memo(function ShoppingCart({
  items,
  customerName,
  onCustomerNameChange,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onCheckout,
}: ShoppingCartProps) {
  // Memoize expensive calculations
  const subtotal = useMemo(
    () => items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [items]
  )
  const itemCount = useMemo(() => items.reduce((sum, item) => sum + item.quantity, 0), [items])

  return (
    <Card className="border-primary/20 sticky top-6 border-2">
      <CardHeader className="from-primary/5 bg-gradient-to-r to-orange-500/5">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-primary/10 rounded-lg p-2">
              <CartIcon className="text-primary h-5 w-5" />
            </div>
            <span>Keranjang</span>
            {itemCount > 0 && <Badge className="bg-primary ml-1 text-white">{itemCount}</Badge>}
          </div>
          {items.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClearCart}
              className="text-destructive hover:text-destructive h-8"
            >
              <X className="mr-1 h-4 w-4" />
              Hapus
            </Button>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Customer Name */}
        <div>
          <label className="mb-1.5 block text-sm font-medium">Nama Pelanggan (Opsional)</label>
          <div className="relative">
            <User className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
            <Input
              placeholder="Nama pelanggan..."
              value={customerName}
              onChange={(e) => onCustomerNameChange(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>

        <Separator />

        {/* Cart Items */}
        <div className="max-h-[400px] space-y-3 overflow-y-auto">
          {items.length === 0 ? (
            <div className="py-12 text-center">
              <CartIcon className="text-muted-foreground mx-auto mb-3 h-12 w-12" />
              <p className="text-muted-foreground text-sm">Keranjang masih kosong</p>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item.product_id}
                className="bg-card hover:bg-accent/50 flex gap-3 rounded-lg border p-3 transition-colors"
              >
                <div className="min-w-0 flex-1">
                  {/* Product Info */}
                  <p className="truncate text-sm font-medium">{item.name}</p>
                  <p className="text-muted-foreground text-xs">{item.sku}</p>
                  <p className="text-primary mt-1 text-sm font-semibold">
                    Rp {item.price.toLocaleString('id-ID')}
                  </p>

                  {/* Quantity Controls */}
                  <div className="mt-2 flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-7 w-7"
                      onClick={() =>
                        onUpdateQuantity(item.product_id, Math.max(1, item.quantity - 1))
                      }
                      disabled={item.quantity <= 1}
                    >
                      <Minus className="h-3 w-3" />
                    </Button>
                    <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-7 w-7"
                      onClick={() => onUpdateQuantity(item.product_id, item.quantity + 1)}
                      disabled={item.quantity >= item.stock}
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-destructive hover:text-destructive ml-auto h-7 w-7"
                      onClick={() => onRemoveItem(item.product_id)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>

                  {/* Stock Warning */}
                  {item.quantity >= item.stock && (
                    <p className="text-destructive mt-1 text-xs">Maksimal stok: {item.stock}</p>
                  )}
                </div>

                {/* Subtotal */}
                <div className="text-right">
                  <p className="text-sm font-bold">
                    Rp {(item.price * item.quantity).toLocaleString('id-ID')}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Summary */}
        {items.length > 0 && (
          <>
            <Separator />
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Total Item</span>
                <span className="font-medium">{itemCount}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Subtotal</span>
                <span className="text-primary text-lg font-bold">
                  Rp {subtotal.toLocaleString('id-ID')}
                </span>
              </div>
            </div>

            {/* Checkout Button */}
            <Button size="lg" className="w-full" onClick={onCheckout} disabled={items.length === 0}>
              <CartIcon className="mr-2 h-4 w-4" />
              Checkout
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  )
})
