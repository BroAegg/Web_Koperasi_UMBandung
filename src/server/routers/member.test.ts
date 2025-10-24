import { describe, it, expect } from 'vitest'
import { z } from 'zod'

describe('Member Transaction Validation', () => {
  const memberTransactionSchema = z.object({
    member_name: z.string().min(1, 'Member name is required'),
    amount: z.number().positive('Amount must be positive'),
    type: z.enum(['MEMBER_DEPOSIT', 'MEMBER_WITHDRAWAL']),
    payment_method: z.enum(['CASH', 'TRANSFER', 'QRIS', 'DEBIT_CARD', 'CREDIT_CARD']),
    notes: z.string().optional(),
  })

  describe('Valid member transactions', () => {
    it('should validate member deposit', () => {
      const input = {
        member_name: 'John Doe',
        amount: 100000,
        type: 'MEMBER_DEPOSIT',
        payment_method: 'CASH',
      }

      const result = memberTransactionSchema.safeParse(input)
      expect(result.success).toBe(true)
    })

    it('should validate member withdrawal', () => {
      const input = {
        member_name: 'Jane Smith',
        amount: 50000,
        type: 'MEMBER_WITHDRAWAL',
        payment_method: 'TRANSFER',
        notes: 'Emergency withdrawal',
      }

      const result = memberTransactionSchema.safeParse(input)
      expect(result.success).toBe(true)
    })

    it('should allow optional notes', () => {
      const input = {
        member_name: 'John Doe',
        amount: 100000,
        type: 'MEMBER_DEPOSIT',
        payment_method: 'CASH',
      }

      const result = memberTransactionSchema.safeParse(input)
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.notes).toBeUndefined()
      }
    })
  })

  describe('Invalid member transactions', () => {
    it('should reject empty member name', () => {
      const input = {
        member_name: '',
        amount: 100000,
        type: 'MEMBER_DEPOSIT',
        payment_method: 'CASH',
      }

      const result = memberTransactionSchema.safeParse(input)
      expect(result.success).toBe(false)
    })

    it('should reject zero amount', () => {
      const input = {
        member_name: 'John Doe',
        amount: 0,
        type: 'MEMBER_DEPOSIT',
        payment_method: 'CASH',
      }

      const result = memberTransactionSchema.safeParse(input)
      expect(result.success).toBe(false)
    })

    it('should reject negative amount', () => {
      const input = {
        member_name: 'John Doe',
        amount: -50000,
        type: 'MEMBER_DEPOSIT',
        payment_method: 'CASH',
      }

      const result = memberTransactionSchema.safeParse(input)
      expect(result.success).toBe(false)
    })

    it('should reject invalid transaction type', () => {
      const input = {
        member_name: 'John Doe',
        amount: 100000,
        type: 'LOAN',
        payment_method: 'CASH',
      }

      const result = memberTransactionSchema.safeParse(input)
      expect(result.success).toBe(false)
    })

    it('should reject invalid payment method', () => {
      const input = {
        member_name: 'John Doe',
        amount: 100000,
        type: 'MEMBER_DEPOSIT',
        payment_method: 'PAYPAL',
      }

      const result = memberTransactionSchema.safeParse(input)
      expect(result.success).toBe(false)
    })
  })
})

describe('Member Statistics Calculation', () => {
  it('should calculate balance correctly', () => {
    const deposits = [100000, 50000, 75000]
    const withdrawals = [30000, 20000]

    const totalDeposits = deposits.reduce((sum, d) => sum + d, 0)
    const totalWithdrawals = withdrawals.reduce((sum, w) => sum + w, 0)
    const balance = totalDeposits - totalWithdrawals

    expect(totalDeposits).toBe(225000)
    expect(totalWithdrawals).toBe(50000)
    expect(balance).toBe(175000)
  })

  it('should handle negative balance (overdraft)', () => {
    const deposits = [50000]
    const withdrawals = [100000]

    const balance = deposits[0] - withdrawals[0]
    expect(balance).toBe(-50000)
    expect(balance < 0).toBe(true)
  })

  it('should handle decimal amounts', () => {
    const deposits = [100000.5, 50000.75]
    const withdrawals = [30000.25]

    const balance = deposits.reduce((s, d) => s + d, 0) - withdrawals.reduce((s, w) => s + w, 0)
    expect(balance).toBe(120001)
  })
})

describe('Member Name Extraction', () => {
  const extractMemberName = (description: string): string => {
    const match = description.match(/(?:Setoran|Penarikan) Anggota - (.+)/)
    return match ? match[1] : 'Unknown'
  }

  it('should extract name from deposit description', () => {
    const description = 'Setoran Anggota - John Doe'
    expect(extractMemberName(description)).toBe('John Doe')
  })

  it('should extract name from withdrawal description', () => {
    const description = 'Penarikan Anggota - Jane Smith'
    expect(extractMemberName(description)).toBe('Jane Smith')
  })

  it('should return Unknown for invalid format', () => {
    const description = 'Invalid transaction description'
    expect(extractMemberName(description)).toBe('Unknown')
  })

  it('should handle names with special characters', () => {
    const description = "Setoran Anggota - Siti Nur'aini"
    expect(extractMemberName(description)).toBe("Siti Nur'aini")
  })
})
