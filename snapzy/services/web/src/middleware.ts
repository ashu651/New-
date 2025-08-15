import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(_req: NextRequest) {
	const res = NextResponse.next()
	res.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()')
	return res
}

export const config = { matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'] }