'use client'

import React, { useState } from 'react'
import { trpc } from '@/lib/trpc'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
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
                          <div className="relative flex h-40 items-center justify-center overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
                            {product.image_url ? (
                              <Image
                                src={product.image_url}
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
                              <div className="absolute inset-0 flex items-end justify-center bg-gradient-to-t from-black/60 to-transparent pb-4 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
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
              <CardHeader className="border-b bg-gradient-to-r from-green-50 to-emerald-50">
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
                          <div className="relative flex h-16 w-16 flex-shrink-0 items-center justify-center overflow-hidden rounded-md bg-gradient-to-br from-gray-50 to-gray-100">
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
                    <div className="mt-4 space-y-3 rounded-lg bg-gradient-to-br from-gray-50 to-gray-100 p-4">
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
                      className="mt-4 h-12 w-full bg-gradient-to-r from-green-600 to-emerald-600 text-base font-bold text-white shadow-lg transition-all duration-200 hover:from-green-700 hover:to-emerald-700 hover:shadow-xl"
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

      {/* Payment Modal */}
      {showPayment && (
        <div className="animate-in fade-in fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm duration-200">
          <Card className="animate-in zoom-in w-full max-w-md shadow-2xl duration-200">
            <CardHeader className="bg-gradient-to-r from-green-600 to-emerald-600 text-white">
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
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Diskon (Rp)
                </label>
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
              <div className="rounded-xl border-2 border-green-100 bg-gradient-to-br from-green-50 to-emerald-50 p-4">
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
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Jumlah Bayar
                </label>
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
                <div className="animate-in slide-in-from-bottom rounded-xl border-2 border-emerald-300 bg-gradient-to-br from-emerald-100 to-green-100 p-4 duration-300">
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-gray-900">Kembalian:</span>
                    <span className="text-3xl font-bold text-emerald-600">
                      Rp {change.toLocaleString('id-ID')}
                    </span>
                  </div>
                </div>
              )}

              <div className="flex gap-3 pt-2">
                <Button
                  variant="outline"
                  onClick={() => setShowPayment(false)}
                  className="flex-1 border-2 hover:bg-gray-50"
                  disabled={createOrderMutation.isPending}
                >
                  Batal
                </Button>
                <Button
                  onClick={handlePayment}
                  disabled={paymentAmount < total || createOrderMutation.isPending}
                  className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-lg transition-all hover:from-green-700 hover:to-emerald-700 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {createOrderMutation.isPending ? (
                    <>
                      <span className="mr-2 animate-spin">⏳</span>
                      Memproses...
                    </>
                  ) : (
                    <>
                      <CreditCard className="mr-2 h-4 w-4" />
                      Bayar Sekarang
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Receipt Modal */}
      {showReceipt && lastOrder && (
        <div className="animate-in fade-in fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm duration-200">
          <Card className="animate-in zoom-in w-full max-w-md shadow-2xl duration-200">
            <CardHeader className="bg-gradient-to-r from-green-600 to-emerald-600 text-white">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Receipt className="h-6 w-6" />
                  Struk Penjualan
                </CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowReceipt(false)}
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
                  <span className="font-mono font-bold text-gray-900">
                    {lastOrder.order_number}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tanggal:</span>
                  <span className="font-medium text-gray-900">
                    {new Date(lastOrder.created_at).toLocaleString('id-ID', {
                      dateStyle: 'medium',
                      timeStyle: 'short',
                    })}
                  </span>
                </div>
                {lastOrder.customer_name && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Pelanggan:</span>
                    <span className="font-medium text-gray-900">{lastOrder.customer_name}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-600">Pembayaran:</span>
                  <span className="font-medium text-gray-900">
                    {lastOrder.payment_method === 'CASH'
                      ? '💵 Tunai'
                      : lastOrder.payment_method === 'BANK_TRANSFER'
                        ? '🏦 Transfer'
                        : lastOrder.payment_method === 'E_WALLET'
                          ? '📱 E-Wallet'
                          : '💳 Lainnya'}
                  </span>
                </div>
              </div>

              {/* Items */}
              <div className="space-y-3 border-b py-4">
                <h4 className="mb-3 font-bold text-gray-900">Detail Pembelian</h4>
                {/* Map through order items */}
                {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                {lastOrder.items.map((item: any, index: number) => (
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
                    Rp {Number(lastOrder.subtotal).toLocaleString('id-ID')}
                  </span>
                </div>
                {Number(lastOrder.discount) > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-700">Diskon:</span>
                    <span className="font-semibold text-red-600">
                      - Rp {Number(lastOrder.discount).toLocaleString('id-ID')}
                    </span>
                  </div>
                )}
                {Number(lastOrder.tax) > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-700">Pajak:</span>
                    <span className="font-semibold text-gray-900">
                      Rp {Number(lastOrder.tax).toLocaleString('id-ID')}
                    </span>
                  </div>
                )}
                <div className="flex justify-between border-t-2 border-dashed pt-3">
                  <span className="text-lg font-bold text-gray-900">Total:</span>
                  <span className="text-2xl font-bold text-green-600">
                    Rp {Number(lastOrder.total).toLocaleString('id-ID')}
                  </span>
                </div>
                <div className="flex justify-between rounded bg-gray-50 p-2 text-sm">
                  <span className="text-gray-700">Bayar:</span>
                  <span className="font-semibold text-gray-900">
                    Rp {Number(lastOrder.payment_amount).toLocaleString('id-ID')}
                  </span>
                </div>
                <div className="flex justify-between rounded bg-green-50 p-2 text-sm">
                  <span className="font-medium text-gray-700">Kembalian:</span>
                  <span className="text-xl font-bold text-green-600">
                    Rp {Number(lastOrder.change_amount).toLocaleString('id-ID')}
                  </span>
                </div>
              </div>

              {/* Footer */}
              <div className="space-y-2 border-t-2 border-dashed pt-4 text-center">
                <p className="text-sm font-medium text-gray-900">
                  Terima kasih atas kunjungan Anda!
                </p>
                <p className="text-xs text-gray-500">
                  Barang yang sudah dibeli tidak dapat dikembalikan
                </p>
                <div className="mt-3 font-mono text-xs text-gray-400">
                  {new Date().toLocaleString('id-ID')}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-6 flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => setShowReceipt(false)}
                  className="flex-1 border-2"
                >
                  <X className="mr-2 h-4 w-4" />
                  Tutup
                </Button>
                <Button
                  onClick={handlePrintReceipt}
                  className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-lg hover:from-green-700 hover:to-emerald-700"
                >
                  <Receipt className="mr-2 h-4 w-4" />
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
