import { describe, it, expect, beforeEach, vi } from 'vitest'
import { z } from 'zod'

// Test Zod schemas for financial transactions
describe('Financial Transaction Validation', () => {
  const transactionSchema = z.object({
    type: z.enum(['CASH_IN', 'CASH_OUT', 'TRANSFER', 'ADJUSTMENT']),
    category: z.enum([
      'SALES',
      'PURCHASE',
      'OPERATIONAL',
      'MEMBER_DEPOSIT',
      'MEMBER_WITHDRAWAL',
      'OTHER',
    ]),
    amount: z.number().positive(),
    description: z.string().min(1),
    notes: z.string().optional(),
    payment_method: z
      .enum(['CASH', 'TRANSFER', 'QRIS', 'DEBIT_CARD', 'CREDIT_CARD'])
      .default('CASH'),
  })

  describe('Valid transactions', () => {
    it('should validate CASH_IN transaction', () => {
      const input = {
        type: 'CASH_IN',
        category: 'SALES',
        amount: 100000,
        description: 'Penjualan produk',
        payment_method: 'CASH',
      }

      const result = transactionSchema.safeParse(input)
      expect(result.success).toBe(true)
    })

    it('should validate CASH_OUT transaction', () => {
      const input = {
        type: 'CASH_OUT',
        category: 'PURCHASE',
        amount: 50000,
        description: 'Pembelian stok',
        notes: 'Dari supplier A',
        payment_method: 'TRANSFER',
      }

      const result = transactionSchema.safeParse(input)
      expect(result.success).toBe(true)
    })

    it('should allow optional notes field', () => {
      const input = {
        type: 'CASH_IN',
        category: 'SALES',
        amount: 100000,
        description: 'Penjualan',
        payment_method: 'CASH',
      }

      const result = transactionSchema.safeParse(input)
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.notes).toBeUndefined()
      }
    })

    it('should default payment_method to CASH', () => {
      const input = {
        type: 'CASH_IN',
        category: 'SALES',
        amount: 100000,
        description: 'Penjualan',
      }

      const result = transactionSchema.safeParse(input)
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.payment_method).toBe('CASH')
      }
    })
  })

  describe('Invalid transactions', () => {
    it('should reject negative amount', () => {
      const input = {
        type: 'CASH_IN',
        category: 'SALES',
        amount: -100,
        description: 'Invalid',
        payment_method: 'CASH',
      }

      const result = transactionSchema.safeParse(input)
      expect(result.success).toBe(false)
    })

    it('should reject zero amount', () => {
      const input = {
        type: 'CASH_IN',
        category: 'SALES',
        amount: 0,
        description: 'Invalid',
        payment_method: 'CASH',
      }

      const result = transactionSchema.safeParse(input)
      expect(result.success).toBe(false)
    })

    it('should reject empty description', () => {
      const input = {
        type: 'CASH_IN',
        category: 'SALES',
        amount: 100000,
        description: '',
        payment_method: 'CASH',
      }

      const result = transactionSchema.safeParse(input)
      expect(result.success).toBe(false)
    })

    it('should reject invalid transaction type', () => {
      const input = {
        type: 'INVALID_TYPE',
        category: 'SALES',
        amount: 100000,
        description: 'Test',
        payment_method: 'CASH',
      }

      const result = transactionSchema.safeParse(input)
      expect(result.success).toBe(false)
    })

    it('should reject invalid category', () => {
      const input = {
        type: 'CASH_IN',
        category: 'INVALID_CATEGORY',
        amount: 100000,
        description: 'Test',
        payment_method: 'CASH',
      }

      const result = transactionSchema.safeParse(input)
      expect(result.success).toBe(false)
    })

    it('should reject invalid payment method', () => {
      const input = {
        type: 'CASH_IN',
        category: 'SALES',
        amount: 100000,
        description: 'Test',
        payment_method: 'BITCOIN',
      }

      const result = transactionSchema.safeParse(input)
      expect(result.success).toBe(false)
    })
  })

  describe('Amount calculation logic', () => {
    it('should handle decimal amounts correctly', () => {
      const input = {
        type: 'CASH_IN',
        category: 'SALES',
        amount: 99.99,
        description: 'Test decimal',
        payment_method: 'CASH',
      }

      const result = transactionSchema.safeParse(input)
      expect(result.success).toBe(true)
    })

    it('should handle large amounts', () => {
      const input = {
        type: 'CASH_IN',
        category: 'SALES',
        amount: 999999999,
        description: 'Large transaction',
        payment_method: 'TRANSFER',
      }

      const result = transactionSchema.safeParse(input)
      expect(result.success).toBe(true)
    })
  })
})

describe('Financial Period Validation', () => {
  const periodSchema = z.enum(['today', 'week', 'month', 'custom'])

  it('should validate period values', () => {
    expect(periodSchema.safeParse('today').success).toBe(true)
    expect(periodSchema.safeParse('week').success).toBe(true)
    expect(periodSchema.safeParse('month').success).toBe(true)
    expect(periodSchema.safeParse('custom').success).toBe(true)
  })

  it('should reject invalid period', () => {
    expect(periodSchema.safeParse('year').success).toBe(false)
    expect(periodSchema.safeParse('invalid').success).toBe(false)
  })
})
