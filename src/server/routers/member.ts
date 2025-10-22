import { z } from 'zod'
import { router, protectedProcedure } from '../trpc'
import { prisma } from '@/lib/db'

// Zod Schemas
const memberDepositSchema = z.object({
  member_name: z.string().min(1),
  amount: z.number().positive(),
  payment_method: z.enum(['CASH', 'BANK_TRANSFER', 'E_WALLET', 'OTHER']),
  notes: z.string().optional(),
})

const memberWithdrawalSchema = z.object({
  member_name: z.string().min(1),
  amount: z.number().positive(),
  payment_method: z.enum(['CASH', 'BANK_TRANSFER', 'E_WALLET', 'OTHER']),
  notes: z.string().optional(),
})

const memberTransactionFilterSchema = z.object({
  member_name: z.string().optional(),
  type: z.enum(['MEMBER_DEPOSIT', 'MEMBER_WITHDRAWAL']).optional(),
  startDate: z.date().optional(),
  endDate: z.date().optional(),
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(20),
})

export const memberRouter = router({
  // Record member deposit
  recordDeposit: protectedProcedure.input(memberDepositSchema).mutation(async ({ input, ctx }) => {
    const transaction = await prisma.transaction.create({
      data: {
        type: 'CASH_IN',
        category: 'MEMBER_DEPOSIT',
        amount: input.amount,
        payment_method: input.payment_method,
        description: `Setoran Anggota - ${input.member_name}`,
        notes: input.notes,
        created_by_id: ctx.user.userId,
      },
    })

    // Log activity
    await prisma.activityLog.create({
      data: {
        user_id: ctx.user.userId,
        role: ctx.user.role,
        action: 'CREATE',
        module: 'MEMBER',
        description: `Recorded deposit for ${input.member_name}: Rp ${input.amount.toLocaleString('id-ID')}`,
      },
    })

    return transaction
  }),

  // Record member withdrawal
  recordWithdrawal: protectedProcedure
    .input(memberWithdrawalSchema)
    .mutation(async ({ input, ctx }) => {
      const transaction = await prisma.transaction.create({
        data: {
          type: 'CASH_OUT',
          category: 'MEMBER_WITHDRAWAL',
          amount: input.amount,
          payment_method: input.payment_method,
          description: `Penarikan Anggota - ${input.member_name}`,
          notes: input.notes,
          created_by_id: ctx.user.userId,
        },
      })

      // Log activity
      await prisma.activityLog.create({
        data: {
          user_id: ctx.user.userId,
          role: ctx.user.role,
          action: 'CREATE',
          module: 'MEMBER',
          description: `Recorded withdrawal for ${input.member_name}: Rp ${input.amount.toLocaleString('id-ID')}`,
        },
      })

      return transaction
    }),

  // Get member transactions
  getMemberTransactions: protectedProcedure
    .input(memberTransactionFilterSchema)
    .query(async ({ input }) => {
      const { member_name, type, startDate, endDate, page, limit } = input

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const where: any = {
        category: {
          in: ['MEMBER_DEPOSIT', 'MEMBER_WITHDRAWAL'],
        },
        deleted_at: null,
      }

      if (member_name) {
        where.description = {
          contains: member_name,
          mode: 'insensitive',
        }
      }

      if (type) {
        where.category = type
      }

      if (startDate || endDate) {
        where.created_at = {}
        if (startDate) where.created_at.gte = startDate
        if (endDate) where.created_at.lte = endDate
      }

      const [transactions, total] = await Promise.all([
        prisma.transaction.findMany({
          where,
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

  // Get member statistics
  getMemberStats: protectedProcedure.query(async () => {
    const [totalDeposits, totalWithdrawals, depositSum, withdrawalSum] = await Promise.all([
      prisma.transaction.count({
        where: {
          category: 'MEMBER_DEPOSIT',
          deleted_at: null,
        },
      }),
      prisma.transaction.count({
        where: {
          category: 'MEMBER_WITHDRAWAL',
          deleted_at: null,
        },
      }),
      prisma.transaction.aggregate({
        where: {
          category: 'MEMBER_DEPOSIT',
          deleted_at: null,
        },
        _sum: {
          amount: true,
        },
      }),
      prisma.transaction.aggregate({
        where: {
          category: 'MEMBER_WITHDRAWAL',
          deleted_at: null,
        },
        _sum: {
          amount: true,
        },
      }),
    ])

    const totalDepositAmount = Number(depositSum._sum.amount || 0)
    const totalWithdrawalAmount = Number(withdrawalSum._sum.amount || 0)
    const balance = totalDepositAmount - totalWithdrawalAmount

    return {
      totalDeposits,
      totalWithdrawals,
      totalDepositAmount,
      totalWithdrawalAmount,
      balance,
    }
  }),
})
