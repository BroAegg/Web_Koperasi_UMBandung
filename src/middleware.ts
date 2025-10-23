import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getSessionFromRequest } from '@/lib/auth'
import { canAccessModule } from '@/lib/permissions'

// Public routes yang tidak perlu authentication
const PUBLIC_ROUTES = ['/login', '/']

// Routes yang require authentication
const PROTECTED_ROUTES = [
  '/dashboard',
  '/financial',
  '/inventory',
  '/pos',
  '/suppliers',
  '/members',
  '/reports',
  '/users',
  '/activity-logs',
]

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Check if route is public
  const isPublicRoute = PUBLIC_ROUTES.some((route) => pathname.startsWith(route))

  // Get session
  const session = await getSessionFromRequest(request)

  // Redirect to login if accessing protected route without session
  if (!isPublicRoute && !session) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('callbackUrl', pathname)
    return NextResponse.redirect(loginUrl)
  }

  // Redirect to dashboard if accessing login page while logged in
  if (pathname.startsWith('/login') && session) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  // Check module access permission
  if (session && !isPublicRoute) {
    const protectedModule = pathname.split('/')[1] // Get first path segment

    if (PROTECTED_ROUTES.some((route) => route.startsWith(`/${protectedModule}`))) {
      const hasAccess = canAccessModule(
        session.role as 'DEVELOPER' | 'SUPER_ADMIN' | 'ADMIN' | 'KASIR' | 'STAFF' | 'SUPPLIER',
        protectedModule
      )

      if (!hasAccess) {
        // Redirect to dashboard with error message
        const dashboardUrl = new URL('/dashboard', request.url)
        dashboardUrl.searchParams.set('error', 'unauthorized')
        return NextResponse.redirect(dashboardUrl)
      }
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - api routes
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public folder)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
