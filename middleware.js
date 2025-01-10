import { NextRequest, NextResponse } from 'next/server'
import { Ratelimit } from '@upstash/ratelimit'
import { kv } from '@vercel/kv'

const rateLimit = new Ratelimit({
  redis: kv,
  limiter: Ratelimit.slidingWindow(1000, '1 h'),
});

export default async function middleware(request) {
  const ip = request.ip || '127.0.0.1'
  const { success } = await rateLimit.limit(ip)
  return success ? NextResponse.next() : NextResponse.json({ error: 'Too many requests' }, { status: 429 })
}
