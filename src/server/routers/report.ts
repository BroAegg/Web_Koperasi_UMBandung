import { z } from 'zod'
import { router, protectedProcedure } from '../trpc'
import { prisma } from '@/lib/db'

const dateRangeSchema = z.object({
  startDate: z.date(),
  endDate: z.date(),
})

export const reportRouter = router({
  // Get comprehensive dashboard data
  getDashboardReport: protectedProcedure.input(dateRangeSchema).query(async ({ input }) => {
    const { startDate, endDate } = input

    const where = {
      created_at: {
        gte: startDate,
        lte: endDate,
      },
    }

    // Financial data
    const [cashIn, cashOut, transactions] = await Promise.all([
      prisma.transaction.aggregate({
        where: { ...where, type: 'CASH_IN', deleted_at: null },
        _sum: { amount: true },
        _count: true,
      }),
      prisma.transaction.aggregate({
        where: { ...where, type: 'CASH_OUT', deleted_at: null },
        _sum: { amount: true },
        _count: true,
      }),
      prisma.transaction.count({ where: { ...where, deleted_at: null } }),
    ])

    // Sales data
    const [orders, orderRevenue] = await Promise.all([
      prisma.order.count({ where }),
      prisma.order.aggregate({
        where: { ...where, status: 'COMPLETED' },
        _sum: { total: true },
      }),
    ])

    // Inventory data
    const [lowStockCount, totalProducts, stockValue] = await Promise.all([
      prisma.product.count({
        where: {
          deleted_at: null,
          stock: { lte: prisma.product.fields.min_stock },
        },
      }),
      prisma.product.count({ where: { deleted_at: null } }),
      prisma.product.findMany({
        where: { deleted_at: null },
        select: { stock: true, purchase_price: true },
      }),
    ])

    const totalStockValue = stockValue.reduce(
      (sum: number, p: { stock: number; purchase_price: number }) =>
        sum + p.stock * Number(p.purchase_price),
      0
    )

    // Member data
    const [memberDeposits, memberWithdrawals] = await Promise.all([
      prisma.transaction.aggregate({
        where: { ...where, category: 'MEMBER_DEPOSIT', deleted_at: null },
        _sum: { amount: true },
        _count: true,
      }),
      prisma.transaction.aggregate({
        where: { ...where, category: 'MEMBER_WITHDRAWAL', deleted_at: null },
        _sum: { amount: true },
        _count: true,
      }),
    ])

    return {
      financial: {
        cashIn: Number(cashIn._sum.amount || 0),
        cashOut: Number(cashOut._sum.amount || 0),
        balance: Number(cashIn._sum.amount || 0) - Number(cashOut._sum.amount || 0),
        transactions,
      },
      sales: {
        orders,
        revenue: Number(orderRevenue._sum.total || 0),
        averageOrderValue: orders > 0 ? Number(orderRevenue._sum.total || 0) / orders : 0,
      },
      inventory: {
        totalProducts,
        lowStockCount,
        totalStockValue,
      },
      member: {
        deposits: Number(memberDeposits._sum.amount || 0),
        withdrawals: Number(memberWithdrawals._sum.amount || 0),
        balance:
          Number(memberDeposits._sum.amount || 0) - Number(memberWithdrawals._sum.amount || 0),
        transactions: (memberDeposits._count || 0) + (memberWithdrawals._count || 0),
      },
    }
  }),
})
