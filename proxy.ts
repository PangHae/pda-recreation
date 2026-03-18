import { NextRequest, NextResponse } from 'next/server'
import { getIronSession } from 'iron-session'
import { SessionData, sessionOptions } from '@/lib/auth'

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Only protect /admin/* (except /admin itself which is the login page)
  if (pathname.startsWith('/admin') && pathname !== '/admin') {
    const res = NextResponse.next()
    const session = await getIronSession<SessionData>(request, res, sessionOptions)

    if (!session.isAdmin) {
      return NextResponse.redirect(new URL('/admin', request.url))
    }
    return res
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path+'],
}
