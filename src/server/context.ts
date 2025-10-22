import { prisma } from '../lib/db'
import { getSession } from '../lib/auth'

export async function createContext() {
  const session = await getSession()

  return {
    prisma,
    user: session || null,
  }
}

export type Context = Awaited<ReturnType<typeof createContext>>
