'use client'

import { useState } from 'react'
import { ProductSearch } from './product-search'
import { ShoppingCart } from './shopping-cart'
import { PaymentModal } from './payment-modal'
import { ReceiptModal } from './receipt-modal'

export interface CartItem {
  product_id: string
  name: string
  sku: string
  price: number
  quantity: number
  stock: number
}

export function POSContent() {
  const [cart, setCart] = useState<CartItem[]>([])
  const [showPayment, setShowPayment] = useState(false)
  const [showReceipt, setShowReceipt] = useState(false)
  const [orderId, setOrderId] = useState<string | null>(null)
  const [customerName, setCustomerName] = useState('')

  const addToCart = (product: {
    id: string
    name: string
    sku: string
    selling_price: number
    stock: number
  }) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.product_id === product.id)

      if (existingItem) {
        // Increase quantity if not exceeding stock
        if (existingItem.quantity < product.stock) {
          return prevCart.map((item) =>
            item.product_id === product.id ? { ...item, quantity: item.quantity + 1 } : item
          )
        }
        return prevCart
      }

      // Add new item
      return [
        ...prevCart,
        {
          product_id: product.id,
          name: product.name,
          sku: product.sku,
          price: Number(product.selling_price),
          quantity: 1,
          stock: product.stock,
        },
      ]
    })
  }

  const updateQuantity = (productId: string, quantity: number) => {
    setCart((prevCart) =>
      prevCart.map((item) => (item.product_id === productId ? { ...item, quantity } : item))
    )
  }

  const removeFromCart = (productId: string) => {
    setCart((prevCart) => prevCart.filter((item) => item.product_id !== productId))
  }

  const clearCart = () => {
    setCart([])
    setCustomerName('')
  }

  const handleCheckout = () => {
    if (cart.length === 0) return
    setShowPayment(true)
  }

  const handlePaymentSuccess = (newOrderId: string) => {
    setOrderId(newOrderId)
    setShowPayment(false)
    setShowReceipt(true)
    clearCart()
  }

  const handlePaymentCancel = () => {
    setShowPayment(false)
  }

  const handleReceiptClose = () => {
    setShowReceipt(false)
    setOrderId(null)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Point of Sale</h1>
        <p className="text-muted-foreground">Scan atau cari produk untuk memulai transaksi</p>
      </div>

      {/* Split View: Product Search | Shopping Cart */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left: Product Search (2/3 width) */}
        <div className="lg:col-span-2">
          <ProductSearch onAddToCart={addToCart} />
        </div>

        {/* Right: Shopping Cart (1/3 width) */}
        <div className="lg:col-span-1">
          <ShoppingCart
            items={cart}
            customerName={customerName}
            onCustomerNameChange={setCustomerName}
            onUpdateQuantity={updateQuantity}
            onRemoveItem={removeFromCart}
            onClearCart={clearCart}
            onCheckout={handleCheckout}
          />
        </div>
      </div>

      {/* Payment Modal */}
      <PaymentModal
        open={showPayment}
        onOpenChange={setShowPayment}
        cart={cart}
        customerName={customerName}
        onSuccess={handlePaymentSuccess}
        onCancel={handlePaymentCancel}
      />

      {/* Receipt Modal */}
      {orderId && (
        <ReceiptModal
          open={showReceipt}
          onOpenChange={setShowReceipt}
          orderId={orderId}
          onClose={handleReceiptClose}
        />
      )}
    </div>
  )
}
