import { Ratelimit } from "@upstash/ratelimit"
import { Redis } from "@upstash/redis"

// Initialize Redis connection
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
})

// Contact form rate limiter: 5 requests per minute per IP
export const contactLimiter = new Ratelimit({
  redis: redis,
  limiter: Ratelimit.slidingWindow(5, "1 m"),
  analytics: true,
})

// Admin login rate limiter: 5 attempts per 10 minutes per IP
export const adminLoginLimiter = new Ratelimit({
  redis: redis,
  limiter: Ratelimit.slidingWindow(5, "10 m"),
  analytics: true,
})

// Helper function to extract IP address from request
export function getClientIP(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for")
  if (forwarded) {
    return forwarded.split(',')[0].trim()
  }
  
  const realIP = request.headers.get("x-real-ip")
  if (realIP) {
    return realIP
  }
  
  // Fallback to a default for development
  return "127.0.0.1"
}