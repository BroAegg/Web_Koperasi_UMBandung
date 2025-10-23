import { z } from 'zod'
import { router, protectedProcedure } from '../trpc'
import { prisma } from '@/lib/db'

const activityLogFilterSchema = z.object({
  module: z.enum(['AUTH', 'FINANCIAL', 'POS', 'INVENTORY', 'SUPPLIER', 'MEMBER']).optional(),
  action: z.enum(['CREATE', 'UPDATE', 'DELETE', 'LOGIN', 'LOGOUT']).optional(),
  userId: z.string().optional(),
  startDate: z.date().optional(),
  endDate: z.date().optional(),
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(50),
})

export const activityRouter = router({
  // Get activity logs with filters
  getActivityLogs: protectedProcedure.input(activityLogFilterSchema).query(async ({ input }) => {
    const { module, action, userId, startDate, endDate, page, limit } = input

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: any = {}

    if (module) where.module = module
    if (action) where.action = action
    if (userId) where.user_id = userId

    if (startDate || endDate) {
      where.created_at = {}
      if (startDate) where.created_at.gte = startDate
      if (endDate) where.created_at.lte = endDate
    }

    const [logs, total] = await Promise.all([
      prisma.activityLog.findMany({
        where,
        include: {
          user: {
            select: {
              id: true,
              username: true,
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
      prisma.activityLog.count({ where }),
    ])

    const totalPages = Math.ceil(total / limit)

    return {
      logs,
      pagination: {
        total,
        page,
        limit,
        totalPages,
        hasMore: page < totalPages,
      },
    }
  }),

  // Get activity statistics
  getActivityStats: protectedProcedure.query(async () => {
    const [totalLogs, moduleStats, actionStats, recentUsers] = await Promise.all([
      prisma.activityLog.count(),
      prisma.activityLog.groupBy({
        by: ['module'],
        _count: true,
      }),
      prisma.activityLog.groupBy({
        by: ['action'],
        _count: true,
      }),
      prisma.activityLog.findMany({
        distinct: ['user_id'],
        select: {
          user: {
            select: {
              id: true,
              username: true,
              full_name: true,
              role: true,
            },
          },
        },
        orderBy: {
          created_at: 'desc',
        },
        take: 10,
      }),
    ])

    return {
      totalLogs,
      moduleStats: moduleStats.map((stat: { module: string; _count: number }) => ({
        module: stat.module,
        count: stat._count,
      })),
      actionStats: actionStats.map((stat: { action: string; _count: number }) => ({
        action: stat.action,
        count: stat._count,
      })),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      recentUsers: recentUsers.map((log: any) => log.user),
    }
  }),

  // Get activity trends (daily count for chart)
  getActivityTrends: protectedProcedure
    .input(
      z.object({
        days: z.number().min(1).max(30).default(7),
      })
    )
    .query(async ({ input }) => {
      const { days } = input

      // Get the oldest activity log to determine start date
      const oldestLog = await prisma.activityLog.findFirst({
        orderBy: {
          created_at: 'asc',
        },
        select: {
          created_at: true,
        },
      })

      // If no logs exist, return empty array
      if (!oldestLog) {
        return []
      }

      // Calculate date range
      const endDate = new Date()
      endDate.setHours(23, 59, 59, 999)

      const startDate = new Date(oldestLog.created_at)
      startDate.setHours(0, 0, 0, 0)

      // Calculate actual days based on oldest log or requested days
      const daysDiff = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))
      const actualDays = Math.min(daysDiff + 1, days)

      // Generate date array starting from oldest log date
      const dates = Array.from({ length: actualDays }, (_, i) => {
        const date = new Date(startDate)
        date.setDate(date.getDate() + i)
        return date
      })

      // Fetch activity count per day
      const trends = await Promise.all(
        dates.map(async (date) => {
          const dayStart = new Date(date)
          dayStart.setHours(0, 0, 0, 0)

          const dayEnd = new Date(date)
          dayEnd.setHours(23, 59, 59, 999)

          const count = await prisma.activityLog.count({
            where: {
              created_at: {
                gte: dayStart,
                lte: dayEnd,
              },
            },
          })

          return {
            date: date.toISOString(),
            activities: count,
          }
        })
      )

      return trends
    }),
})
