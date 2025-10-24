import { describe, it, expect } from 'vitest'
import { z } from 'zod'

describe('Product Validation', () => {
  const productSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    sku: z.string().min(1, 'SKU is required'),
    category_id: z.string().min(1, 'Category is required'),
    supplier_id: z.string().optional(),
    purchase_price: z.number().nonnegative(),
    selling_price: z.number().positive(),
    stock: z.number().int().nonnegative(),
    min_stock: z.number().int().nonnegative(),
    unit: z.string().min(1, 'Unit is required'),
    description: z.string().optional(),
    is_active: z.boolean().default(true),
  })

  describe('Valid products', () => {
    it('should validate complete product data', () => {
      const input = {
        name: 'Laptop ASUS',
        sku: 'LAP-001',
        category_id: 'cat-1',
        supplier_id: 'sup-1',
        purchase_price: 5000000,
        selling_price: 6000000,
        stock: 10,
        min_stock: 3,
        unit: 'pcs',
        description: 'Laptop ASUS ROG',
        is_active: true,
      }

      const result = productSchema.safeParse(input)
      expect(result.success).toBe(true)
    })

    it('should allow zero purchase price (consignment)', () => {
      const input = {
        name: 'Produk Konsinyasi',
        sku: 'CONS-001',
        category_id: 'cat-1',
        purchase_price: 0,
        selling_price: 50000,
        stock: 5,
        min_stock: 2,
        unit: 'pcs',
      }

      const result = productSchema.safeParse(input)
      expect(result.success).toBe(true)
    })

    it('should default is_active to true', () => {
      const input = {
        name: 'Test Product',
        sku: 'TEST-001',
        category_id: 'cat-1',
        purchase_price: 10000,
        selling_price: 15000,
        stock: 5,
        min_stock: 2,
        unit: 'pcs',
      }

      const result = productSchema.safeParse(input)
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.is_active).toBe(true)
      }
    })

    it('should allow optional supplier_id and description', () => {
      const input = {
        name: 'Test Product',
        sku: 'TEST-001',
        category_id: 'cat-1',
        purchase_price: 10000,
        selling_price: 15000,
        stock: 5,
        min_stock: 2,
        unit: 'pcs',
      }

      const result = productSchema.safeParse(input)
      expect(result.success).toBe(true)
    })
  })

  describe('Invalid products', () => {
    it('should reject empty name', () => {
      const input = {
        name: '',
        sku: 'TEST-001',
        category_id: 'cat-1',
        purchase_price: 10000,
        selling_price: 15000,
        stock: 5,
        min_stock: 2,
        unit: 'pcs',
      }

      const result = productSchema.safeParse(input)
      expect(result.success).toBe(false)
    })

    it('should reject negative purchase price', () => {
      const input = {
        name: 'Test',
        sku: 'TEST-001',
        category_id: 'cat-1',
        purchase_price: -1000,
        selling_price: 15000,
        stock: 5,
        min_stock: 2,
        unit: 'pcs',
      }

      const result = productSchema.safeParse(input)
      expect(result.success).toBe(false)
    })

    it('should reject zero or negative selling price', () => {
      const input = {
        name: 'Test',
        sku: 'TEST-001',
        category_id: 'cat-1',
        purchase_price: 10000,
        selling_price: 0,
        stock: 5,
        min_stock: 2,
        unit: 'pcs',
      }

      const result = productSchema.safeParse(input)
      expect(result.success).toBe(false)
    })

    it('should reject negative stock', () => {
      const input = {
        name: 'Test',
        sku: 'TEST-001',
        category_id: 'cat-1',
        purchase_price: 10000,
        selling_price: 15000,
        stock: -5,
        min_stock: 2,
        unit: 'pcs',
      }

      const result = productSchema.safeParse(input)
      expect(result.success).toBe(false)
    })

    it('should reject decimal stock (must be integer)', () => {
      const input = {
        name: 'Test',
        sku: 'TEST-001',
        category_id: 'cat-1',
        purchase_price: 10000,
        selling_price: 15000,
        stock: 5.5,
        min_stock: 2,
        unit: 'pcs',
      }

      const result = productSchema.safeParse(input)
      expect(result.success).toBe(false)
    })
  })

  describe('Business logic validation', () => {
    it('should allow selling price equal to purchase price', () => {
      const input = {
        name: 'Test',
        sku: 'TEST-001',
        category_id: 'cat-1',
        purchase_price: 10000,
        selling_price: 10000,
        stock: 5,
        min_stock: 2,
        unit: 'pcs',
      }

      const result = productSchema.safeParse(input)
      expect(result.success).toBe(true)
    })

    it('should allow stock below min_stock (low stock warning)', () => {
      const input = {
        name: 'Test',
        sku: 'TEST-001',
        category_id: 'cat-1',
        purchase_price: 10000,
        selling_price: 15000,
        stock: 1,
        min_stock: 5,
        unit: 'pcs',
      }

      const result = productSchema.safeParse(input)
      expect(result.success).toBe(true)
    })
  })
})

describe('Stock Update Validation', () => {
  const stockUpdateSchema = z.object({
    product_id: z.string().min(1),
    quantity: z.number().int(),
    type: z.enum(['IN', 'OUT', 'ADJUSTMENT']),
    notes: z.string().optional(),
  })

  it('should validate stock IN', () => {
    const input = {
      product_id: 'prod-1',
      quantity: 10,
      type: 'IN',
      notes: 'Restock',
    }

    const result = stockUpdateSchema.safeParse(input)
    expect(result.success).toBe(true)
  })

  it('should validate stock OUT (negative quantity)', () => {
    const input = {
      product_id: 'prod-1',
      quantity: -5,
      type: 'OUT',
    }

    const result = stockUpdateSchema.safeParse(input)
    expect(result.success).toBe(true)
  })

  it('should reject decimal quantity', () => {
    const input = {
      product_id: 'prod-1',
      quantity: 5.5,
      type: 'IN',
    }

    const result = stockUpdateSchema.safeParse(input)
    expect(result.success).toBe(false)
  })
})
