'use client'

import React, { useState } from 'react'
import { trpc } from '@/lib/trpc'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ShoppingCart, Plus, Minus, Trash2, CreditCard, Search, X, History, Receipt } from 'lucide-react'

type CartItem = {
  product_id: string
  name: string
  sku: string
  price: number
  quantity: number
  stock: number
}

type PaymentMethod = 'CASH' | 'BANK_TRANSFER' | 'E_WALLET' | 'OTHER'

export default function POSPage() {
  const [activeTab, setActiveTab] = useState<'kasir' | 'riwayat'>('kasir')
  const [cart, setCart] = useState<CartItem[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [showPayment, setShowPayment] = useState(false)
  const [customerName, setCustomerName] = useState('')
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('CASH')
  const [paymentAmount, setPaymentAmount] = useState<number>(0)
  const [discount, setDiscount] = useState<number>(0)
  const [showReceipt, setShowReceipt] = useState(false)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [lastOrder, setLastOrder] = useState<any>(null)

  // Queries
  const { data: productsData } = trpc.pos.getProducts.useQuery({
    search: searchQuery,
    page: 1,
    limit: 50,
  })

  // Get today's orders
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const { data: ordersData, refetch: refetchOrders } = trpc.pos.getOrders.useQuery({
    startDate: today,
    page: 1,
    limit: 20,
  })

  const createOrderMutation = trpc.pos.createOrder.useMutation({
    onSuccess: (order) => {
      setLastOrder(order)
      setCart([])
      setCustomerName('')
      setPaymentAmount(0)
      setDiscount(0)
      setShowPayment(false)
      setShowReceipt(true)
      // Switch to history tab and refetch
      setActiveTab('riwayat')
      refetchOrders()
    },
  })

  // Cart functions
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const addToCart = (product: any) => {
    const existingItem = cart.find((item) => item.product_id === product.id)

    if (existingItem) {
      if (existingItem.quantity < product.stock) {
        setCart(
          cart.map((item) =>
            item.product_id === product.id ? { ...item, quantity: item.quantity + 1 } : item
          )
        )
      }
    } else {
      setCart([
        ...cart,
        {
          product_id: product.id,
          name: product.name,
          sku: product.sku,
          price: Number(product.selling_price),
          quantity: 1,
          stock: Number(product.stock),
        },
      ])
    }
  }

  const updateQuantity = (productId: string, newQuantity: number) => {
    const item = cart.find((i) => i.product_id === productId)
    if (!item) return

    if (newQuantity <= 0) {
      removeFromCart(productId)
      return
    }

    if (newQuantity > item.stock) return

    setCart(
      cart.map((item) =>
        item.product_id === productId ? { ...item, quantity: newQuantity } : item
      )
    )
  }

  const removeFromCart = (productId: string) => {
    setCart(cart.filter((item) => item.product_id !== productId))
  }

  const clearCart = () => {
    setCart([])
  }

  // Calculate totals
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const tax = 0 // Can be calculated if needed
  const total = subtotal - discount + tax
  const change = paymentAmount - total

  // Handle checkout
  const handleCheckout = () => {
    if (cart.length === 0) return
    setShowPayment(true)
  }

  const handlePayment = () => {
    if (paymentAmount < total) {
      alert('Jumlah pembayaran kurang!')
      return
    }

    createOrderMutation.mutate({
      customer_name: customerName || undefined,
      items: cart.map((item) => ({
        product_id: item.product_id,
        quantity: Number(item.quantity),
        price: Number(item.price),
      })),
      payment_method: paymentMethod,
      payment_amount: Number(paymentAmount),
      discount: Number(discount) || 0,
      tax: Number(tax) || 0,
    })
  }

  const handlePrintReceipt = () => {
    window.print()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Point of Sale (POS)</h1>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b">
        <button
          onClick={() => setActiveTab('kasir')}
          className={`flex items-center gap-2 px-4 py-2 font-medium transition-colors ${
            activeTab === 'kasir'
              ? 'border-b-2 border-green-600 text-green-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <ShoppingCart className="h-4 w-4" />
          Kasir
        </button>
        <button
          onClick={() => setActiveTab('riwayat')}
          className={`flex items-center gap-2 px-4 py-2 font-medium transition-colors ${
            activeTab === 'riwayat'
              ? 'border-b-2 border-green-600 text-green-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <History className="h-4 w-4" />
          Riwayat Hari Ini
        </button>
      </div>

      {/* Tab Content - Kasir */}
      {activeTab === 'kasir' && (
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Products Section */}
        <div className="space-y-4 lg:col-span-2">
          {/* Search */}
          <div className="relative">
            <Search className="absolute top-3 left-3 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Cari produk (nama atau SKU)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border py-2 pr-4 pl-10 focus:ring-2 focus:ring-green-500 focus:outline-none"
            />
          </div>

          {/* Product Grid */}
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
            {productsData?.products.map((product: any) => (
              <Card
                key={product.id}
                className="cursor-pointer transition-shadow hover:shadow-lg"
                onClick={() => addToCart(product)}
              >
                <CardContent className="p-4">
                  <div className="space-y-2">
                    <h3 className="line-clamp-2 text-sm font-semibold">{product.name}</h3>
                    <p className="text-xs text-gray-500">{product.sku}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold text-green-600">
                        Rp {product.selling_price.toLocaleString('id-ID')}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500">Stok: {product.stock}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Cart Section */}
        <div className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xl">Keranjang</CardTitle>
              {cart.length > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearCart}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </CardHeader>
            <CardContent className="space-y-4">
              {cart.length === 0 ? (
                <div className="py-8 text-center text-gray-400">
                  <ShoppingCart className="mx-auto mb-2 h-12 w-12" />
                  <p>Keranjang kosong</p>
                </div>
              ) : (
                <>
                  <div className="max-h-96 space-y-3 overflow-y-auto">
                    {cart.map((item) => (
                      <div
                        key={item.product_id}
                        className="flex items-start gap-2 rounded border p-2"
                      >
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium">{item.name}</p>
                          <p className="text-xs text-gray-500">
                            Rp {item.price.toLocaleString('id-ID')}
                          </p>
                        </div>
                        <div className="flex items-center gap-1">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateQuantity(item.product_id, item.quantity - 1)}
                            className="h-7 w-7 p-0"
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="w-8 text-center text-sm">{item.quantity}</span>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateQuantity(item.product_id, item.quantity + 1)}
                            className="h-7 w-7 p-0"
                            disabled={item.quantity >= item.stock}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => removeFromCart(item.product_id)}
                          className="h-7 w-7 p-0 text-red-600"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>

                  {/* Totals */}
                  <div className="space-y-2 border-t pt-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Subtotal</span>
                      <span>Rp {subtotal.toLocaleString('id-ID')}</span>
                    </div>
                    {discount > 0 && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Diskon</span>
                        <span className="text-red-600">
                          - Rp {discount.toLocaleString('id-ID')}
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between border-t pt-2 text-lg font-bold">
                      <span>Total</span>
                      <span className="text-green-600">Rp {total.toLocaleString('id-ID')}</span>
                    </div>
                  </div>

                  <Button
                    onClick={handleCheckout}
                    className="w-full bg-green-600 hover:bg-green-700"
                    size="lg"
                  >
                    <CreditCard className="mr-2 h-4 w-4" />
                    Proses Pembayaran
                  </Button>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
      )}

      {/* Tab Content - Riwayat Hari Ini */}
      {activeTab === 'riwayat' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Riwayat Penjualan Hari Ini</h2>
            <div className="text-sm text-gray-600">
              Total: {ordersData?.pagination.total || 0} transaksi
            </div>
          </div>

          {/* Orders List */}
          <div className="grid gap-4">
            {ordersData?.orders && ordersData.orders.length > 0 ? (
              ordersData.orders.map((order: any) => (
                <Card key={order.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-mono font-semibold">{order.order_number}</span>
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            order.status === 'COMPLETED' ? 'bg-green-100 text-green-700' :
                            order.status === 'CANCELLED' ? 'bg-red-100 text-red-700' :
                            'bg-yellow-100 text-yellow-700'
                          }`}>
                            {order.status}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-1">
                          {new Date(order.created_at).toLocaleString('id-ID')}
                        </p>
                        {order.customer_name && (
                          <p className="text-sm text-gray-600 mb-2">
                            Pelanggan: {order.customer_name}
                          </p>
                        )}
                        <div className="text-sm text-gray-700">
                          {order.items.length} item • {order.payment_method}
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-green-600">
                          Rp {Number(order.total).toLocaleString('id-ID')}
                        </p>
                        <Button
                          variant="outline"
                          size="sm"
                          className="mt-2"
                          onClick={() => {
                            setLastOrder(order)
                            setShowReceipt(true)
                          }}
                        >
                          <Receipt className="mr-1 h-3 w-3" />
                          Lihat Struk
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card>
                <CardContent className="py-12 text-center text-gray-400">
                  <Receipt className="mx-auto mb-3 h-16 w-16 opacity-50" />
                  <p className="text-lg font-medium">Belum ada transaksi hari ini</p>
                  <p className="text-sm">Transaksi akan muncul di sini setelah checkout</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      )}

      {/* Payment Modal */}
      {showPayment && (
        <div className="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black p-4">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Pembayaran</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium">Nama Pelanggan (Opsional)</label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full rounded-lg border px-3 py-2 focus:ring-2 focus:ring-green-500 focus:outline-none"
                  placeholder="Nama pelanggan..."
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium">Metode Pembayaran</label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                  className="w-full rounded-lg border px-3 py-2 focus:ring-2 focus:ring-green-500 focus:outline-none"
                >
                  <option value="CASH">Tunai</option>
                  <option value="BANK_TRANSFER">Transfer Bank</option>
                  <option value="E_WALLET">E-Wallet</option>
                  <option value="OTHER">Lainnya</option>
                </select>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium">Diskon (Rp)</label>
                <input
                  type="number"
                  value={discount}
                  onChange={(e) => setDiscount(Number(e.target.value))}
                  className="w-full rounded-lg border px-3 py-2 focus:ring-2 focus:ring-green-500 focus:outline-none"
                  placeholder="0"
                  min="0"
                />
              </div>

              <div className="rounded-lg bg-gray-50 p-3">
                <div className="mb-1 flex justify-between text-sm">
                  <span>Subtotal:</span>
                  <span>Rp {subtotal.toLocaleString('id-ID')}</span>
                </div>
                {discount > 0 && (
                  <div className="mb-1 flex justify-between text-sm">
                    <span>Diskon:</span>
                    <span className="text-red-600">- Rp {discount.toLocaleString('id-ID')}</span>
                  </div>
                )}
                <div className="flex justify-between border-t pt-2 text-lg font-bold">
                  <span>Total:</span>
                  <span className="text-green-600">Rp {total.toLocaleString('id-ID')}</span>
                </div>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium">Jumlah Bayar</label>
                <input
                  type="number"
                  value={paymentAmount || ''}
                  onChange={(e) => setPaymentAmount(Number(e.target.value))}
                  className="w-full rounded-lg border px-3 py-2 focus:ring-2 focus:ring-green-500 focus:outline-none"
                  placeholder={total.toString()}
                  min={total}
                />
                <div className="mt-2 flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => setPaymentAmount(total)}>
                    Pas
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setPaymentAmount(Math.ceil(total / 1000) * 1000)}
                  >
                    Bulatkan
                  </Button>
                </div>
              </div>

              {paymentAmount >= total && (
                <div className="rounded-lg bg-green-50 p-3">
                  <div className="flex justify-between font-bold">
                    <span>Kembalian:</span>
                    <span className="text-green-600">Rp {change.toLocaleString('id-ID')}</span>
                  </div>
                </div>
              )}

              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setShowPayment(false)} className="flex-1">
                  Batal
                </Button>
                <Button
                  onClick={handlePayment}
                  disabled={paymentAmount < total || createOrderMutation.isPending}
                  className="flex-1 bg-green-600 hover:bg-green-700"
                >
                  {createOrderMutation.isPending ? 'Memproses...' : 'Bayar'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Receipt Modal */}
      {showReceipt && lastOrder && (
        <div className="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black p-4">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Struk Penjualan</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="border-b pb-4 text-center">
                <h3 className="text-lg font-bold">Koperasi UM Bandung</h3>
                <p className="text-sm text-gray-600">{new Date().toLocaleString('id-ID')}</p>
                <p className="mt-1 font-mono text-sm">{lastOrder.order_number}</p>
              </div>

              <div className="space-y-2">
                {/* Map through order items */}
                {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                {lastOrder.items.map((item: any) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <div className="flex-1">
                      <p className="font-medium">{item.product.name}</p>
                      <p className="text-gray-600">
                        {item.quantity} x Rp {item.price.toLocaleString('id-ID')}
                      </p>
                    </div>
                    <p className="font-medium">Rp {item.subtotal.toLocaleString('id-ID')}</p>
                  </div>
                ))}
              </div>

              <div className="space-y-1 border-t pt-3">
                <div className="flex justify-between text-sm">
                  <span>Subtotal:</span>
                  <span>Rp {lastOrder.subtotal.toLocaleString('id-ID')}</span>
                </div>
                {lastOrder.discount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span>Diskon:</span>
                    <span className="text-red-600">
                      - Rp {lastOrder.discount.toLocaleString('id-ID')}
                    </span>
                  </div>
                )}
                <div className="flex justify-between border-t pt-2 text-lg font-bold">
                  <span>Total:</span>
                  <span>Rp {lastOrder.total.toLocaleString('id-ID')}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Bayar:</span>
                  <span>Rp {lastOrder.payment_amount.toLocaleString('id-ID')}</span>
                </div>
                <div className="flex justify-between text-sm font-medium">
                  <span>Kembalian:</span>
                  <span className="text-green-600">
                    Rp {lastOrder.change_amount.toLocaleString('id-ID')}
                  </span>
                </div>
              </div>

              <div className="border-t pt-3 text-center text-sm text-gray-600">
                <p>Terima kasih atas kunjungan Anda!</p>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setShowReceipt(false)} className="flex-1">
                  Tutup
                </Button>
                <Button
                  onClick={handlePrintReceipt}
                  className="flex-1 bg-green-600 hover:bg-green-700"
                >
                  Cetak Struk
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
