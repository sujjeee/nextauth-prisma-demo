import { redis } from '@/lib/redis'
import { Ratelimit } from '@upstash/ratelimit'

// Create a new ratelimiter, that allows 10 requests per 10 seconds
export const rateLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(20, '60 s'),
})