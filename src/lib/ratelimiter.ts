import { Ratelimit } from "@upstash/ratelimit"
import { Redis } from "@upstash/redis"

// Initialize Redis connection only if environment variables are available
let redis: Redis | null = null;
let contactLimiter: Ratelimit | null = null;

if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
  try {
    redis = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
    })

    // Contact form rate limiter: 5 requests per minute per IP
    contactLimiter = new Ratelimit({
      redis: redis,
      limiter: Ratelimit.slidingWindow(5, "1 m"),
      analytics: true,
    })
  } catch (error) {
    console.error('Failed to initialize rate limiter:', error);
    contactLimiter = null;
  }
}

// Export with null check
export { contactLimiter }

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