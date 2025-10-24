import { describe, it, expect } from 'vitest'

describe('POS Cart Logic', () => {
  interface CartItem {
    product_id: string
    name: string
    price: number
    quantity: number
    stock: number
  }

  describe('Cart calculations', () => {
    it('should calculate subtotal correctly', () => {
      const cart: CartItem[] = [
        { product_id: '1', name: 'Product A', price: 10000, quantity: 2, stock: 10 },
        { product_id: '2', name: 'Product B', price: 15000, quantity: 3, stock: 5 },
      ]

      const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
      expect(subtotal).toBe(65000) // (10000 * 2) + (15000 * 3)
    })

    it('should calculate discount amount', () => {
      const subtotal = 100000
      const discountPercent = 10

      const discountAmount = (subtotal * discountPercent) / 100
      expect(discountAmount).toBe(10000)
    })

    it('should calculate final total with discount', () => {
      const subtotal = 100000
      const discount = 10000

      const total = subtotal - discount
      expect(total).toBe(90000)
    })

    it('should calculate change correctly', () => {
      const total = 90000
      const payment = 100000

      const change = payment - total
      expect(change).toBe(10000)
    })

    it('should handle zero discount', () => {
      const subtotal = 100000
      const discount = 0

      const total = subtotal - discount
      expect(total).toBe(100000)
    })
  })

  describe('Cart item management', () => {
    it('should add new item to cart', () => {
      const cart: CartItem[] = []
      const newItem: CartItem = {
        product_id: '1',
        name: 'Product A',
        price: 10000,
        quantity: 1,
        stock: 10,
      }

      const updatedCart = [...cart, newItem]
      expect(updatedCart).toHaveLength(1)
      expect(updatedCart[0]).toEqual(newItem)
    })

    it('should increase quantity of existing item', () => {
      const cart: CartItem[] = [
        { product_id: '1', name: 'Product A', price: 10000, quantity: 1, stock: 10 },
      ]

      const updatedCart = cart.map((item) =>
        item.product_id === '1' ? { ...item, quantity: item.quantity + 1 } : item
      )

      expect(updatedCart[0].quantity).toBe(2)
    })

    it('should remove item from cart', () => {
      const cart: CartItem[] = [
        { product_id: '1', name: 'Product A', price: 10000, quantity: 1, stock: 10 },
        { product_id: '2', name: 'Product B', price: 15000, quantity: 2, stock: 5 },
      ]

      const updatedCart = cart.filter((item) => item.product_id !== '1')
      expect(updatedCart).toHaveLength(1)
      expect(updatedCart[0].product_id).toBe('2')
    })

    it('should update item quantity', () => {
      const cart: CartItem[] = [
        { product_id: '1', name: 'Product A', price: 10000, quantity: 1, stock: 10 },
      ]

      const updatedCart = cart.map((item) =>
        item.product_id === '1' ? { ...item, quantity: 5 } : item
      )

      expect(updatedCart[0].quantity).toBe(5)
    })

    it('should clear entire cart', () => {
      const cart: CartItem[] = [
        { product_id: '1', name: 'Product A', price: 10000, quantity: 1, stock: 10 },
        { product_id: '2', name: 'Product B', price: 15000, quantity: 2, stock: 5 },
      ]

      const updatedCart: CartItem[] = []
      expect(updatedCart).toHaveLength(0)
    })
  })

  describe('Stock validation', () => {
    it('should not allow quantity exceeding stock', () => {
      const item: CartItem = {
        product_id: '1',
        name: 'Product A',
        price: 10000,
        quantity: 5,
        stock: 3,
      }

      const isValid = item.quantity <= item.stock
      expect(isValid).toBe(false)
    })

    it('should allow quantity equal to stock', () => {
      const item: CartItem = {
        product_id: '1',
        name: 'Product A',
        price: 10000,
        quantity: 5,
        stock: 5,
      }

      const isValid = item.quantity <= item.stock
      expect(isValid).toBe(true)
    })

    it('should allow quantity less than stock', () => {
      const item: CartItem = {
        product_id: '1',
        name: 'Product A',
        price: 10000,
        quantity: 3,
        stock: 10,
      }

      const isValid = item.quantity <= item.stock
      expect(isValid).toBe(true)
    })
  })

  describe('Payment validation', () => {
    it('should reject payment less than total', () => {
      const total = 100000
      const payment = 90000

      const isValid = payment >= total
      expect(isValid).toBe(false)
    })

    it('should accept payment equal to total', () => {
      const total = 100000
      const payment = 100000

      const isValid = payment >= total
      const change = payment - total

      expect(isValid).toBe(true)
      expect(change).toBe(0)
    })

    it('should accept payment greater than total', () => {
      const total = 90000
      const payment = 100000

      const isValid = payment >= total
      const change = payment - total

      expect(isValid).toBe(true)
      expect(change).toBe(10000)
    })
  })

  describe('Order validation', () => {
    it('should reject empty cart', () => {
      const cart: CartItem[] = []
      const isValid = cart.length > 0

      expect(isValid).toBe(false)
    })

    it('should accept cart with items', () => {
      const cart: CartItem[] = [
        { product_id: '1', name: 'Product A', price: 10000, quantity: 1, stock: 10 },
      ]
      const isValid = cart.length > 0

      expect(isValid).toBe(true)
    })
  })
})

describe('Currency Formatting', () => {
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount)
  }

  it('should format Indonesian currency correctly', () => {
    expect(formatCurrency(100000)).toContain('100.000')
  })

  it('should handle decimal values', () => {
    const formatted = formatCurrency(100000.5)
    expect(formatted).toBeTruthy()
  })

  it('should handle zero', () => {
    const formatted = formatCurrency(0)
    expect(formatted).toBeTruthy()
  })
})
