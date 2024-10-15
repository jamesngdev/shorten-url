import { NextRequest, NextResponse, userAgent } from 'next/server'

export function middleware(request: NextRequest) {
    const url = request.nextUrl
    const { device , ...args} = userAgent(request)
    console.log("..arsg", args, device)
    const viewport = device.type === 'mobile' ? 'mobile' : 'desktop'
    url.searchParams.set('viewport', viewport)
    return NextResponse.rewrite(url)
}