import { router } from './trpc'
import { healthRouter } from './routers/health'
import { productRouter } from './routers/product'
import { authRouter } from './routers/auth'

export const appRouter = router({
  health: healthRouter,
  product: productRouter,
  auth: authRouter,
})

export type AppRouter = typeof appRouter
