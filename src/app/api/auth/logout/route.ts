import { NextRequest, NextResponse } from 'next/server'
import { deleteSession, getSession } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { Role } from '@prisma/client'

export async function POST(request: NextRequest) {
  try {
    // Get session before deleting
    const session = await getSession()

    // Log activity if session exists
    if (session) {
      await prisma.activityLog.create({
        data: {
          user_id: session.userId,
          role: session.role as Role,
          module: 'AUTH',
          action: 'LOGOUT',
          description: `User ${session.username} logged out`,
          ip_address:
            request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown',
          user_agent: request.headers.get('user-agent') || 'unknown',
        },
      })
    }

    // Delete session cookie
    await deleteSession()

    return NextResponse.json({
      success: true,
      message: 'Logout successful',
    })
  } catch (error) {
    console.error('Logout error:', error)
    return NextResponse.json({ error: 'An error occurred during logout' }, { status: 500 })
  }
}
