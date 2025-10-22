import { z } from 'zod'
import { router, protectedProcedure } from '../trpc'
import { prisma } from '@/lib/db'
import { TRPCError } from '@trpc/server'

// Zod Schemas for Validation
const createTransactionSchema = z.object({
  type: z.enum(['CASH_IN', 'CASH_OUT', 'TRANSFER', 'ADJUSTMENT']),
  category: z.enum([
    'SALES',
    'PURCHASE',
    'OPERATIONAL',
    'MEMBER_DEPOSIT',
    'MEMBER_WITHDRAWAL',
    'OTHER',
  ]),
  amount: z.number().positive('Amount must be positive'),
  description: z.string().min(1, 'Description is required'),
  supplierId: z.string().optional(),
  notes: z.string().optional(),
})

const updateTransactionSchema = z.object({
  id: z.string(),
  type: z.enum(['CASH_IN', 'CASH_OUT', 'TRANSFER', 'ADJUSTMENT']).optional(),
  category: z
    .enum(['SALES', 'PURCHASE', 'OPERATIONAL', 'MEMBER_DEPOSIT', 'MEMBER_WITHDRAWAL', 'OTHER'])
    .optional(),
  amount: z.number().positive().optional(),
  description: z.string().min(1).optional(),
  supplierId: z.string().nullable().optional(),
  notes: z.string().nullable().optional(),
})

const periodFilterSchema = z.object({
  period: z.enum(['today', 'week', 'month', 'custom']).default('today'),
  startDate: z.date().optional(),
  endDate: z.date().optional(),
})

const transactionFilterSchema = z
  .object({
    search: z.string().optional(),
    type: z.enum(['CASH_IN', 'CASH_OUT', 'TRANSFER', 'ADJUSTMENT']).optional(),
    category: z
      .enum(['SALES', 'PURCHASE', 'OPERATIONAL', 'MEMBER_DEPOSIT', 'MEMBER_WITHDRAWAL', 'OTHER'])
      .optional(),
    supplierId: z.string().optional(),
    page: z.number().min(1).default(1),
    limit: z.number().min(1).max(100).default(10),
  })
  .merge(periodFilterSchema)

export const financialRouter = router({
  // Get Daily Summary
  getDailySummary: protectedProcedure.input(periodFilterSchema).query(async ({ input }) => {
    const { period, startDate, endDate } = input

    // Calculate date range
    let dateFilter: { gte: Date; lte?: Date } = { gte: new Date() }
    const now = new Date()

    switch (period) {
      case 'today':
        dateFilter = {
          gte: new Date(now.setHours(0, 0, 0, 0)),
          lte: new Date(now.setHours(23, 59, 59, 999)),
        }
        break
      case 'week':
        const weekAgo = new Date()
        weekAgo.setDate(weekAgo.getDate() - 7)
        dateFilter = { gte: weekAgo }
        break
      case 'month':
        const monthAgo = new Date()
        monthAgo.setMonth(monthAgo.getMonth() - 1)
        dateFilter = { gte: monthAgo }
        break
      case 'custom':
        if (startDate && endDate) {
          dateFilter = { gte: startDate, lte: endDate }
        }
        break
    }

    // Get all transactions in period
    const transactions = await prisma.transaction.findMany({
      where: {
        created_at: dateFilter,
        deleted_at: null,
      },
      include: {
        supplier: {
          select: {
            id: true,
            business_name: true,
          },
        },
        createdBy: {
          select: {
            id: true,
            full_name: true,
            role: true,
          },
        },
      },
      orderBy: {
        created_at: 'desc',
      },
    })

    // Calculate summaries
    let cashIn = 0
    let cashOut = 0
    let tokoBalance = 0
    let titipanBalance = 0

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    transactions.forEach((tx: any) => {
      if (tx.type === 'CASH_IN') {
        cashIn += tx.amount
      } else {
        cashOut += tx.amount
      }

      // Calculate balance by category
      if (tx.category === 'SALES' || tx.category === 'CASH_DEPOSIT') {
        tokoBalance += tx.type === 'CASH_IN' ? tx.amount : -tx.amount
      } else if (tx.category === 'CONSIGNMENT') {
        titipanBalance += tx.type === 'CASH_IN' ? tx.amount : -tx.amount
      }
    })

    const totalBalance = tokoBalance + titipanBalance
    const netCashFlow = cashIn - cashOut
    const transactionCount = transactions.length

    return {
      totalBalance,
      tokoBalance,
      titipanBalance,
      cashIn,
      cashOut,
      netCashFlow,
      transactionCount,
      period,
      startDate: dateFilter.gte,
      endDate: dateFilter.lte,
      status: netCashFlow >= 0 ? 'surplus' : 'deficit',
    }
  }),

  // Get Transactions with Filters
  getTransactions: protectedProcedure.input(transactionFilterSchema).query(async ({ input }) => {
    const { search, type, category, supplierId, page, limit, period, startDate, endDate } = input

    // Date filter
    let dateFilter: { gte: Date; lte?: Date } = { gte: new Date() }
    const now = new Date()

    switch (period) {
      case 'today':
        dateFilter = {
          gte: new Date(now.setHours(0, 0, 0, 0)),
          lte: new Date(now.setHours(23, 59, 59, 999)),
        }
        break
      case 'week':
        const weekAgo = new Date()
        weekAgo.setDate(weekAgo.getDate() - 7)
        dateFilter = { gte: weekAgo }
        break
      case 'month':
        const monthAgo = new Date()
        monthAgo.setMonth(monthAgo.getMonth() - 1)
        dateFilter = { gte: monthAgo }
        break
      case 'custom':
        if (startDate && endDate) {
          dateFilter = { gte: startDate, lte: endDate }
        }
        break
    }

    // Build where clause
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: any = {
      deleted_at: null,
      created_at: dateFilter,
    }

    if (search) {
      where.OR = [
        { description: { contains: search, mode: 'insensitive' } },
        { notes: { contains: search, mode: 'insensitive' } },
      ]
    }

    if (type) where.type = type
    if (category) where.category = category
    if (supplierId) where.supplier_id = supplierId

    // Get transactions with pagination
    const [transactions, total] = await Promise.all([
      prisma.transaction.findMany({
        where,
        include: {
          supplier: {
            select: {
              id: true,
              business_name: true,
            },
          },
          createdBy: {
            select: {
              id: true,
              full_name: true,
              role: true,
            },
          },
        },
        orderBy: {
          created_at: 'desc',
        },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.transaction.count({ where }),
    ])

    const totalPages = Math.ceil(total / limit)

    return {
      transactions,
      pagination: {
        total,
        page,
        limit,
        totalPages,
        hasMore: page < totalPages,
      },
    }
  }),

  // Get Chart Data
  getChartData: protectedProcedure.input(periodFilterSchema).query(async ({ input }) => {
    const { period, startDate, endDate } = input

    // Calculate date range
    let dateFilter: { gte: Date; lte?: Date } = { gte: new Date() }
    const now = new Date()

    switch (period) {
      case 'today':
        dateFilter = {
          gte: new Date(now.setHours(0, 0, 0, 0)),
          lte: new Date(now.setHours(23, 59, 59, 999)),
        }
        break
      case 'week':
        const weekAgo = new Date()
        weekAgo.setDate(weekAgo.getDate() - 7)
        dateFilter = { gte: weekAgo }
        break
      case 'month':
        const monthAgo = new Date()
        monthAgo.setMonth(monthAgo.getMonth() - 1)
        dateFilter = { gte: monthAgo }
        break
      case 'custom':
        if (startDate && endDate) {
          dateFilter = { gte: startDate, lte: endDate }
        }
        break
    }

    // Get transactions
    const transactions = await prisma.transaction.findMany({
      where: {
        created_at: dateFilter,
        deleted_at: null,
      },
      orderBy: {
        created_at: 'asc',
      },
    })

    // Group by date
    const chartData: Record<
      string,
      { date: string; cashIn: number; cashOut: number; balance: number }
    > = {}

    let runningBalance = 0

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    transactions.forEach((tx: any) => {
      const dateKey = tx.created_at.toISOString().split('T')[0]

      if (!chartData[dateKey]) {
        chartData[dateKey] = {
          date: dateKey,
          cashIn: 0,
          cashOut: 0,
          balance: runningBalance,
        }
      }

      if (tx.type === 'CASH_IN') {
        chartData[dateKey].cashIn += tx.amount
        runningBalance += tx.amount
      } else {
        chartData[dateKey].cashOut += tx.amount
        runningBalance -= tx.amount
      }

      chartData[dateKey].balance = runningBalance
    })

    return Object.values(chartData)
  }),

  // Create Transaction
  createTransaction: protectedProcedure
    .input(createTransactionSchema)
    .mutation(async ({ input, ctx }) => {
      const userId = ctx.user.userId

      const transaction = await prisma.transaction.create({
        data: {
          ...input,
          created_by_id: userId,
        },
        include: {
          supplier: true,
          createdBy: {
            select: {
              id: true,
              full_name: true,
              role: true,
            },
          },
        },
      })

      // Log activity
      await prisma.activityLog.create({
        data: {
          user_id: userId,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          role: ctx.user.role as any,
          action: 'CREATE',
          module: 'FINANCIAL',
          description: `Created transaction: ${input.description} - Rp ${input.amount.toLocaleString('id-ID')}`,
        },
      })

      return transaction
    }),

  // Update Transaction
  updateTransaction: protectedProcedure
    .input(updateTransactionSchema)
    .mutation(async ({ input, ctx }) => {
      const { id, ...data } = input

      // Check if transaction exists
      const existingTransaction = await prisma.transaction.findUnique({
        where: { id },
      })

      if (!existingTransaction) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Transaction not found',
        })
      }

      if (existingTransaction.deleted_at) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Cannot update deleted transaction',
        })
      }

      const transaction = await prisma.transaction.update({
        where: { id },
        data,
        include: {
          supplier: true,
          createdBy: {
            select: {
              id: true,
              full_name: true,
              role: true,
            },
          },
        },
      })

      // Log activity
      await prisma.activityLog.create({
        data: {
          user_id: ctx.user.userId,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          role: ctx.user.role as any,
          action: 'UPDATE',
          module: 'FINANCIAL',
          description: `Updated transaction: ${transaction.description}`,
        },
      })

      return transaction
    }),

  // Delete Transaction (Soft Delete)
  deleteTransaction: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const { id } = input

      // Check if transaction exists
      const existingTransaction = await prisma.transaction.findUnique({
        where: { id },
      })

      if (!existingTransaction) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Transaction not found',
        })
      }

      if (existingTransaction.deleted_at) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Transaction already deleted',
        })
      }

      // Soft delete
      const transaction = await prisma.transaction.update({
        where: { id },
        data: {
          deleted_at: new Date(),
        },
      })

      // Log activity
      await prisma.activityLog.create({
        data: {
          user_id: ctx.user.userId,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          role: ctx.user.role as any,
          action: 'DELETE',
          module: 'FINANCIAL',
          description: `Deleted transaction: ${existingTransaction.description}`,
        },
      })

      return transaction
    }),
})
