import { router } from './trpc'
import { healthRouter } from './routers/health'
import { productRouter } from './routers/product'
import { authRouter } from './routers/auth'
import { financialRouter } from './routers/financial'

export const appRouter = router({
  health: healthRouter,
  product: productRouter,
  auth: authRouter,
  financial: financialRouter,
})

export type AppRouter = typeof appRouter
