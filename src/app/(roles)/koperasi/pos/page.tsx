'use client'

import React, { useState, Suspense } from 'react'
import { trpc } from '@/lib/trpc'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { lazyWithRetry } from '@/lib/lazy-utils'
import { FormLoadingFallback } from '@/components/ui/lazy-loading'

// Lazy load heavy modal components
const PaymentModal = lazyWithRetry(() =>
  import('@/components/pos/PaymentModal').then((m) => ({ default: m.PaymentModal }))
)
const ReceiptModal = lazyWithRetry(() =>
  import('@/components/pos/ReceiptModal').then((m) => ({ default: m.ReceiptModal }))
)
import { useDebounce } from '@/hooks/useDebounce'
import {
  ShoppingCart,
  Plus,
  Minus,
  Trash2,
  CreditCard,
  Search,
  X,
  History,
  Receipt,
  Package,
  AlertCircle,
} from 'lucide-react'
import Image from 'next/image'
import { ResponsiveLayout } from '@/components/layout'

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

  // Debounce search to avoid excessive queries during typing
  const debouncedSearchQuery = useDebounce(searchQuery, 500)

  // Queries
  const { data: productsData } = trpc.pos.getProducts.useQuery({
    search: debouncedSearchQuery,
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
      // Stay on kasir tab for quick next transaction
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
    <ResponsiveLayout>
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
                {productsData?.products && productsData.products.length > 0 ? (
                  <>
                    {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                    {productsData.products.map((product: any) => {
                      const inCart = cart.find((item) => item.product_id === product.id)
                      const isOutOfStock = product.stock <= 0
                      const isLowStock = product.stock > 0 && product.stock <= 10

                      return (
                        <Card
                          key={product.id}
                          className={`group relative overflow-hidden transition-all duration-200 ${
                            isOutOfStock
                              ? 'cursor-not-allowed opacity-60'
                              : 'cursor-pointer hover:scale-105 hover:shadow-xl'
                          }`}
                          onClick={() => !isOutOfStock && addToCart(product)}
                        >
                          <CardContent className="p-0">
                            {/* Product Image */}
                            <div className="relative flex h-40 items-center justify-center overflow-hidden bg-linear-to-br from-gray-50 to-gray-100">
                              {product.image ? (
                                <Image
                                  src={product.image}
                                  alt={product.name}
                                  fill
                                  className="object-cover"
                                />
                              ) : (
                                <Package className="h-16 w-16 text-gray-300" />
                              )}

                              {/* Out of Stock Badge */}
                              {isOutOfStock && (
                                <div className="absolute inset-0 flex items-center justify-center bg-black/60">
                                  <div className="text-center">
                                    <AlertCircle className="mx-auto mb-1 h-8 w-8 text-white" />
                                    <span className="text-sm font-bold text-white">Habis</span>
                                  </div>
                                </div>
                              )}

                              {/* Low Stock Badge */}
                              {isLowStock && !isOutOfStock && (
                                <div className="absolute top-2 right-2">
                                  <span className="rounded-full bg-orange-500 px-2 py-1 text-xs font-bold text-white shadow-lg">
                                    Stok Sedikit
                                  </span>
                                </div>
                              )}

                              {/* In Cart Badge */}
                              {inCart && !isOutOfStock && (
                                <div className="absolute top-2 left-2">
                                  <span className="flex items-center gap-1 rounded-full bg-green-600 px-2 py-1 text-xs font-bold text-white shadow-lg">
                                    <ShoppingCart className="h-3 w-3" />
                                    {inCart.quantity}
                                  </span>
                                </div>
                              )}

                              {/* Quick Add Button - appears on hover */}
                              {!isOutOfStock && (
                                <div className="absolute inset-0 flex items-end justify-center bg-linear-to-t from-black/60 to-transparent pb-4 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                                  <Button
                                    size="sm"
                                    className="bg-white text-green-600 shadow-lg hover:bg-green-50"
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      addToCart(product)
                                    }}
                                  >
                                    <Plus className="mr-1 h-4 w-4" />
                                    Tambah
                                  </Button>
                                </div>
                              )}
                            </div>

                            {/* Product Info */}
                            <div className="space-y-2 p-4">
                              <div className="min-h-[48px]">
                                <h3 className="line-clamp-2 text-sm leading-tight font-semibold text-gray-900">
                                  {product.name}
                                </h3>
                              </div>

                              <div className="flex items-center justify-between gap-2">
                                <span className="rounded bg-gray-100 px-2 py-1 font-mono text-xs text-gray-500">
                                  {product.sku}
                                </span>
                                <span
                                  className={`text-xs font-medium ${
                                    isOutOfStock
                                      ? 'text-red-600'
                                      : isLowStock
                                        ? 'text-orange-600'
                                        : 'text-gray-600'
                                  }`}
                                >
                                  Stok: {product.stock}
                                </span>
                              </div>

                              <div className="border-t pt-2">
                                <span className="text-lg font-bold text-green-600">
                                  Rp {product.selling_price.toLocaleString('id-ID')}
                                </span>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      )
                    })}
                  </>
                ) : (
                  <div className="col-span-full">
                    <Card>
                      <CardContent className="py-16 text-center">
                        <Package className="mx-auto mb-4 h-20 w-20 text-gray-300" />
                        <h3 className="mb-2 text-lg font-semibold text-gray-900">
                          {searchQuery ? 'Produk tidak ditemukan' : 'Belum ada produk'}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {searchQuery
                            ? 'Coba kata kunci pencarian lain'
                            : 'Tambahkan produk di halaman Inventory'}
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                )}
              </div>
            </div>

            {/* Cart Section */}
            <div className="space-y-4">
              <Card className="border-2 shadow-lg">
                <CardHeader className="border-b bg-linear-to-r from-green-50 to-emerald-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="rounded-lg bg-green-600 p-2">
                        <ShoppingCart className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-xl">Keranjang</CardTitle>
                        <p className="mt-0.5 text-xs text-gray-600">
                          {cart.length} item{cart.length !== 1 ? '' : ''}
                        </p>
                      </div>
                    </div>
                    {cart.length > 0 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={clearCart}
                        className="text-red-600 hover:bg-red-50 hover:text-red-700"
                      >
                        <Trash2 className="mr-1 h-4 w-4" />
                        Hapus Semua
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="p-4">
                  {cart.length === 0 ? (
                    <div className="py-12 text-center text-gray-400">
                      <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gray-100">
                        <ShoppingCart className="h-10 w-10 text-gray-300" />
                      </div>
                      <p className="mb-1 font-medium text-gray-900">Keranjang Kosong</p>
                      <p className="text-sm">Pilih produk untuk mulai transaksi</p>
                    </div>
                  ) : (
                    <>
                      <div className="max-h-[400px] space-y-3 overflow-y-auto pr-1">
                        {cart.map((item) => (
                          <div
                            key={item.product_id}
                            className="group relative flex gap-3 rounded-lg border-2 p-3 transition-all hover:border-green-200 hover:bg-green-50/50"
                          >
                            {/* Product Image */}
                            <div className="relative flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-md bg-linear-to-br from-gray-50 to-gray-100">
                              <Package className="h-8 w-8 text-gray-300" />
                            </div>

                            {/* Product Info */}
                            <div className="min-w-0 flex-1">
                              <h4 className="mb-1 line-clamp-2 text-sm leading-tight font-semibold text-gray-900">
                                {item.name}
                              </h4>
                              <p className="mb-2 font-mono text-xs text-gray-500">{item.sku}</p>
                              <div className="flex items-center justify-between">
                                <span className="text-sm font-bold text-green-600">
                                  Rp {item.price.toLocaleString('id-ID')}
                                </span>
                                <span className="text-xs text-gray-500">Stok: {item.stock}</span>
                              </div>
                            </div>

                            {/* Remove Button */}
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => removeFromCart(item.product_id)}
                              className="absolute top-2 right-2 h-6 w-6 p-0 text-gray-400 opacity-0 transition-opacity group-hover:opacity-100 hover:bg-red-50 hover:text-red-600"
                            >
                              <X className="h-4 w-4" />
                            </Button>

                            {/* Quantity Controls */}
                            <div className="absolute right-2 bottom-2 flex items-center gap-1 rounded-lg border bg-white shadow-sm">
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => updateQuantity(item.product_id, item.quantity - 1)}
                                className="h-7 w-7 rounded-r-none p-0 hover:bg-red-50 hover:text-red-600"
                              >
                                <Minus className="h-3 w-3" />
                              </Button>
                              <span className="w-10 text-center text-sm font-bold text-gray-900">
                                {item.quantity}
                              </span>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => updateQuantity(item.product_id, item.quantity + 1)}
                                disabled={item.quantity >= item.stock}
                                className="h-7 w-7 rounded-l-none p-0 hover:bg-green-50 hover:text-green-600 disabled:opacity-50"
                              >
                                <Plus className="h-3 w-3" />
                              </Button>
                            </div>

                            {/* Item Subtotal */}
                            <div className="absolute top-2 right-2 opacity-100 transition-opacity group-hover:opacity-0">
                              <span className="text-xs font-bold text-gray-700">
                                Rp {(item.price * item.quantity).toLocaleString('id-ID')}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Totals Summary */}
                      <div className="mt-4 space-y-3 rounded-lg bg-linear-to-br from-gray-50 to-gray-100 p-4">
                        <div className="flex justify-between text-sm">
                          <span className="font-medium text-gray-700">Subtotal</span>
                          <span className="font-semibold text-gray-900">
                            Rp {subtotal.toLocaleString('id-ID')}
                          </span>
                        </div>
                        {discount > 0 && (
                          <div className="flex justify-between text-sm">
                            <span className="font-medium text-gray-700">Diskon</span>
                            <span className="font-semibold text-red-600">
                              - Rp {discount.toLocaleString('id-ID')}
                            </span>
                          </div>
                        )}
                        {tax > 0 && (
                          <div className="flex justify-between text-sm">
                            <span className="font-medium text-gray-700">Pajak</span>
                            <span className="font-semibold text-gray-900">
                              Rp {tax.toLocaleString('id-ID')}
                            </span>
                          </div>
                        )}
                        <div className="flex justify-between border-t-2 pt-3">
                          <span className="text-lg font-bold text-gray-900">Total</span>
                          <span className="text-2xl font-bold text-green-600">
                            Rp {total.toLocaleString('id-ID')}
                          </span>
                        </div>
                      </div>

                      {/* Checkout Button */}
                      <Button
                        onClick={handleCheckout}
                        className="mt-4 h-12 w-full bg-linear-to-r from-green-600 to-emerald-600 text-base font-bold text-white shadow-lg transition-all duration-200 hover:from-green-700 hover:to-emerald-700 hover:shadow-xl"
                        size="lg"
                      >
                        <CreditCard className="mr-2 h-5 w-5" />
                        Proses Pembayaran
                        <span className="ml-auto">Rp {total.toLocaleString('id-ID')}</span>
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
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                ordersData.orders.map((order: any) => (
                  <Card key={order.id} className="transition-shadow hover:shadow-md">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="mb-2 flex items-center gap-2">
                            <span className="font-mono font-semibold">{order.order_number}</span>
                            <span
                              className={`rounded-full px-2 py-1 text-xs ${
                                order.status === 'COMPLETED'
                                  ? 'bg-green-100 text-green-700'
                                  : order.status === 'CANCELLED'
                                    ? 'bg-red-100 text-red-700'
                                    : 'bg-yellow-100 text-yellow-700'
                              }`}
                            >
                              {order.status}
                            </span>
                          </div>
                          <p className="mb-1 text-sm text-gray-600">
                            {new Date(order.created_at).toLocaleString('id-ID')}
                          </p>
                          {order.customer_name && (
                            <p className="mb-2 text-sm text-gray-600">
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

        {/* Payment Modal - Lazy loaded for better performance */}
        {showPayment && (
          <Suspense fallback={<FormLoadingFallback />}>
            <PaymentModal
              show={showPayment}
              onClose={() => setShowPayment(false)}
              customerName={customerName}
              setCustomerName={setCustomerName}
              paymentMethod={paymentMethod}
              setPaymentMethod={setPaymentMethod}
              discount={discount}
              setDiscount={setDiscount}
              paymentAmount={paymentAmount}
              setPaymentAmount={setPaymentAmount}
              subtotal={subtotal}
              total={total}
              change={change}
              onProcessPayment={handlePayment}
              isProcessing={createOrderMutation.isPending}
            />
          </Suspense>
        )}

        {/* Receipt Modal - Lazy loaded for better performance */}
        {showReceipt && lastOrder && (
          <Suspense fallback={<FormLoadingFallback />}>
            <ReceiptModal
              show={showReceipt}
              onClose={() => setShowReceipt(false)}
              order={lastOrder}
              onPrint={handlePrintReceipt}
            />
          </Suspense>
        )}
      </div>
    </ResponsiveLayout>
  )
}
