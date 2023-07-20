import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { rateLimiter } from '@/lib/rate-limit'

export async function middleware(req: NextRequest) {

    const ip = req.headers.get('x-forwarded-for') ?? '127.0.0.1'

    try {
        const { success } = await rateLimiter.limit(ip)

        if (!success) return new NextResponse('Too many requests! Please try again later.')
        return NextResponse.next()
    } catch (error) {
        return new NextResponse(
            'Sorry, something went wrong processing your message. Please try again later.'
        )
    }
}

// See "Matching Paths" below to learn more
export const config = {
    matcher: '/api/:path*',
}