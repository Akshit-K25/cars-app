// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Add the paths that don't require authentication
const publicPaths = ['/', '/login', '/signup']

export function middleware(request: NextRequest) {
  const authCookie = request.cookies.get('auth')
  const { pathname } = request.nextUrl

  // Allow access to public paths without authentication
  if (publicPaths.includes(pathname)) {
    return NextResponse.next()
  }

  // If no auth cookie and trying to access protected route, redirect to login
  if (!authCookie && !publicPaths.includes(pathname)) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('from', pathname)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * 1. /api/** (API routes)
     * 2. /_next/** (Next.js internals)
     * 3. /.well-known/** (Well-known URIs)
     * 4. /_static/** (static files)
     * 5. /_vercel/** (Vercel internals)
     * 6. /favicon.ico, /sitemap.xml (static files)
     */
    '/((?!api|_next|.well-known|_static|_vercel|favicon.ico|sitemap.xml).*)',
  ],
}