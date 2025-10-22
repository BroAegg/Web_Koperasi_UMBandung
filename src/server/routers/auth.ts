import { z } from 'zod'
import { router, publicProcedure } from '../trpc'
import * as bcrypt from 'bcryptjs'
import { createSession, deleteSession } from '@/lib/auth'
import { TRPCError } from '@trpc/server'

export const authRouter = router({
  // Login
  login: publicProcedure
    .input(
      z.object({
        username: z.string().min(3, 'Username minimal 3 karakter'),
        password: z.string().min(6, 'Password minimal 6 karakter'),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Find user
      const user = await ctx.prisma.user.findUnique({
        where: { username: input.username },
      })

      if (!user) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'Username atau password salah',
        })
      }

      // Check if user is active
      if (!user.is_active) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'Akun Anda telah dinonaktifkan',
        })
      }

      // Verify password
      const isValidPassword = await bcrypt.compare(input.password, user.password)

      if (!isValidPassword) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'Username atau password salah',
        })
      }

      // Create session
      await createSession(user.id, user.username, user.role)

      // Log activity
      await ctx.prisma.activityLog.create({
        data: {
          user_id: user.id,
          role: user.role,
          action: 'LOGIN',
          module: 'AUTH',
          description: `User ${user.username} logged in`,
        },
      })

      return {
        success: true,
        message: 'Login berhasil',
        user: {
          id: user.id,
          username: user.username,
          full_name: user.full_name,
          role: user.role,
          email: user.email,
        },
      }
    }),

  // Logout
  logout: publicProcedure.mutation(async ({ ctx }) => {
    await deleteSession()

    return {
      success: true,
      message: 'Logout berhasil',
    }
  }),

  // Get current user
  me: publicProcedure.query(async () => {
    // This will be enhanced with middleware later
    return {
      user: null,
    }
  }),

  // Register (for admin only in production)
  register: publicProcedure
    .input(
      z.object({
        username: z.string().min(3, 'Username minimal 3 karakter'),
        password: z.string().min(6, 'Password minimal 6 karakter'),
        full_name: z.string().min(3, 'Nama lengkap minimal 3 karakter'),
        email: z.string().email('Email tidak valid').optional(),
        phone: z.string().optional(),
        role: z.enum(['ADMIN', 'KASIR', 'STAFF', 'SUPPLIER']),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Check if username exists
      const existingUser = await ctx.prisma.user.findUnique({
        where: { username: input.username },
      })

      if (existingUser) {
        throw new TRPCError({
          code: 'CONFLICT',
          message: 'Username sudah digunakan',
        })
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(input.password, 10)

      // Create user
      const user = await ctx.prisma.user.create({
        data: {
          username: input.username,
          password: hashedPassword,
          full_name: input.full_name,
          email: input.email,
          phone: input.phone,
          role: input.role,
        },
      })

      return {
        success: true,
        message: 'Registrasi berhasil',
        user: {
          id: user.id,
          username: user.username,
          full_name: user.full_name,
          role: user.role,
        },
      }
    }),
})
